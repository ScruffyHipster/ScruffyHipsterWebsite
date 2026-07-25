import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { publicRoutes, siteUrl } from "./route-meta.mjs";

const rootDir = new URL("../", import.meta.url).pathname;
const distDir = join(rootDir, "dist");
const trackerBasePath = "/breastfeeding-tracker";
const trackerRoutes = publicRoutes.filter(
  (route) => route.path === trackerBasePath || route.path.startsWith(`${trackerBasePath}/`)
);
const expectedTrackerRouteCount = 8;

assert(
  trackerRoutes.length === expectedTrackerRouteCount,
  `Expected ${expectedTrackerRouteCount} tracker routes, found ${trackerRoutes.length}.`
);

const sitemap = await readFile(join(distDir, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert(
  sitemapUrls.length === publicRoutes.length,
  `Expected ${publicRoutes.length} sitemap URLs, found ${sitemapUrls.length}.`
);

for (const route of publicRoutes) {
  const html = await readFile(routeOutputPath(route.path), "utf8");
  const canonical = canonicalUrl(route.path);

  assert(html.includes(`<link rel="canonical" href="${canonical}"`), `${route.path} has the wrong canonical.`);
  assert(html.includes('<meta name="robots" content="index,follow"'), `${route.path} is not indexable.`);
  assert(
    /<div id="root"><div class="site-shell(?:\s[^"]*)?">/.test(html),
    `${route.path} is missing server-rendered body HTML.`
  );
  assert(/<h1[\s>]/.test(html), `${route.path} is missing an initial HTML h1.`);
  assert(sitemapUrls.includes(canonical), `${route.path} is missing from the sitemap.`);

  for (const candidate of publicRoutes) {
    if (candidate.path === "/") {
      continue;
    }
    const nonCanonicalLink = new RegExp(
      `href="${escapeRegExp(candidate.path)}(?=["#?])`
    );
    assert(
      !nonCanonicalLink.test(html),
      `${route.path} links to non-canonical path ${candidate.path}.`
    );
  }
}

const seenTitles = new Set();
const seenDescriptions = new Set();

for (const route of trackerRoutes) {
  const outputPath = routeOutputPath(route.path);
  const html = await readFile(outputPath, "utf8");
  const canonical = canonicalUrl(route.path);

  assert(html.includes(`<link rel="canonical" href="${canonical}"`), `${route.path} has the wrong canonical.`);
  assert(html.includes('<meta name="robots" content="index,follow"'), `${route.path} is not indexable.`);
  assert(
    /<div id="root"><div class="site-shell(?:\s[^"]*)?">/.test(html),
    `${route.path} is missing server-rendered body HTML.`
  );
  assert(/<h1[\s>]/.test(html), `${route.path} is missing an initial HTML h1.`);
  assert(html.includes("BreadcrumbList"), `${route.path} is missing breadcrumb structured data.`);
  assert(sitemap.includes(`<loc>${canonical}</loc>`), `${route.path} is missing from the sitemap.`);

  const title = matchContent(
    html,
    /<title(?:\s+[^>]*)?>([\s\S]*?)<\/title>/i,
    `${route.path} title`
  );
  const description = matchContent(
    html,
    /<meta name="description" content="([^"]+)"/i,
    `${route.path} description`
  );
  assert(!seenTitles.has(title), `${route.path} duplicates another tracker title.`);
  assert(!seenDescriptions.has(description), `${route.path} duplicates another tracker description.`);
  seenTitles.add(title);
  seenDescriptions.add(description);

  const jsonLdScripts = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
    )
  ];
  assert(jsonLdScripts.length > 0, `${route.path} has no structured data.`);
  for (const [, value] of jsonLdScripts) {
    JSON.parse(value);
  }

  const internalTrackerLinks = [
    ...html.matchAll(/href="(\/breastfeeding-tracker(?:\/[^"#?]*)?)(?:[#?][^"]*)?"/g)
  ].map((match) => match[1]);
  for (const href of internalTrackerLinks) {
    await access(routeOutputPath(href));
  }

  if (route.path === trackerBasePath) {
    assert(html.includes('"@type":"SoftwareApplication"'), "Tracker landing page is missing SoftwareApplication data.");
    assert(html.includes('"@type":"FAQPage"'), "Tracker landing page is missing FAQPage data.");
  } else if (route.path === `${trackerBasePath}/guides`) {
    assert(html.includes('"@type":"CollectionPage"'), "Guide index is missing CollectionPage data.");
  } else {
    assert(html.includes('class="feeding-article-body"'), `${route.path} is missing rendered guide content.`);
    assert(
      /class="feeding-article-body"><h2>/.test(html),
      `${route.path} does not begin its article body with an h2.`
    );
    assert(html.includes('"@type":"Article"'), `${route.path} is missing Article data.`);
  }
}

const legacyPath = "/apps/breast-feeding-tracker";
const legacyHtml = await readFile(routeOutputPath(legacyPath), "utf8");
assert(!sitemap.includes(`${siteUrl}${legacyPath}`), "Legacy tracker URL is still in the sitemap.");
assert(legacyHtml.includes('content="noindex,follow"'), "Legacy tracker redirect is missing noindex.");
assert(
  legacyHtml.includes(`<link rel="canonical" href="${canonicalUrl(trackerBasePath)}"`),
  "Legacy tracker redirect has the wrong canonical."
);

const rewireHtml = await readFile(routeOutputPath("/rewire"), "utf8");
assert(
  /<div id="root"><div class="site-shell(?:\s[^"]*)?">/.test(rewireHtml),
  "Rewire lost server-rendered body HTML."
);
assert(rewireHtml.includes("<h1>"), "Rewire lost its initial h1.");

await access(join(distDir, "assets", "breastfeeding-tracker-og.png"));

console.log(
  `SEO checks passed for all ${publicRoutes.length} public routes, ${trackerRoutes.length} tracker routes, the legacy redirect, and Rewire prerendering.`
);

function routeOutputPath(path) {
  if (path === "/") {
    return join(distDir, "index.html");
  }
  return join(distDir, path.replace(/^\//, ""), "index.html");
}

function canonicalUrl(path) {
  const canonicalPath = path === "/" ? "" : `${path.replace(/\/+$/, "")}/`;
  return `${siteUrl}${canonicalPath}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchContent(value, pattern, label) {
  const match = value.match(pattern);
  assert(match?.[1], `Could not read ${label}.`);
  return match[1];
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

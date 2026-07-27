import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { publicRoutes, siteUrl } from "./route-meta.mjs";
import generatedGuides from "../src/generated/breastfeeding-tracker-guides.json" with { type: "json" };

const rootDir = new URL("../", import.meta.url).pathname;
const distDir = join(rootDir, "dist");
const trackerBasePath = "/breastfeeding-tracker";
const trackerRoutes = publicRoutes.filter(
  (route) => route.path === trackerBasePath || route.path.startsWith(`${trackerBasePath}/`)
);
const expectedTrackerRouteCount = generatedGuides.posts.length + 2;

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

const comparisonPath = `${trackerBasePath}/guides/best-breastfeeding-apps`;
const comparisonHtml = await readFile(routeOutputPath(comparisonPath), "utf8");
const comparisonTitle = matchContent(
  comparisonHtml,
  /<title(?:\s+[^>]*)?>([\s\S]*?)<\/title>/i,
  "comparison title"
);
const comparisonDescription = matchContent(
  comparisonHtml,
  /<meta name="description" content="([^"]+)"/i,
  "comparison description"
);
const comparisonJsonLd = [
  ...comparisonHtml.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  )
].map((match) => JSON.parse(match[1]));
const comparisonFaq = comparisonJsonLd.find((entry) => entry["@type"] === "FAQPage");
const comparisonArticle = comparisonJsonLd.find((entry) => entry["@type"] === "Article");
const expectedComparisonAlt =
  "Huckleberry, Nara Baby and Breastfeeding Tracker & Timer compared by best use, features and cost.";
const expectedComparisonAltHtml = expectedComparisonAlt.replace("&", "&amp;");
const requiredComparisonSources = [
  "https://apps.apple.com/us/app/huckleberry-baby-tracker/id1169136078",
  "https://huckleberrycare.com/product/free",
  "https://apps.apple.com/us/app/nara-baby-pregnancy-tracker/id1444639029",
  "https://nara.com/pages/nara-baby-tracker-faq",
  "https://apps.apple.com/gb/app/breastfeeding-tracker-timer/id6754637800",
  "https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/breastfeeding/the-first-few-days/",
  "https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/breastfeeding-problems/enough-milk/",
  "https://www.unicef.org.uk/babyfriendly/baby-friendly-resources/%20relationship-building-resources/responsive-feeding-infosheet/"
];

assert(
  comparisonHtml.includes(
    "<h1>Best Breastfeeding &amp; Baby Feeding Apps (2026): Which App Is Right for You?</h1>"
  ),
  "Comparison guide has the wrong h1."
);
assert(
  (comparisonHtml.match(/<h1[\s>]/g) || []).length === 1,
  "Comparison guide must have exactly one h1."
);
assert(comparisonTitle.length < 60, "Comparison meta title must be under 60 characters.");
assert(
  comparisonDescription.length >= 150 && comparisonDescription.length <= 160,
  "Comparison meta description must be 150–160 characters."
);
assert(
  (comparisonHtml.match(/<div class="feeding-table-scroll"[^>]*tabindex="0"[^>]*>/g) || [])
    .length === 2,
  "Comparison guide must render two keyboard-scrollable table containers."
);
assert(
  (comparisonHtml.match(/<table><thead><tr>/g) || []).length === 2 &&
    (comparisonHtml.match(/<tbody>/g) || []).length === 2 &&
    comparisonHtml.includes('<th scope="col">'),
  "Comparison guide tables are not semantic."
);
assert(comparisonArticle, "Comparison guide is missing Article structured data.");
assert(
  comparisonArticle.url === canonicalUrl(comparisonPath),
  "Comparison Article data has the wrong canonical URL."
);
assert(
  comparisonArticle.datePublished === "2026-07-27",
  "Comparison Article data has the wrong publication date."
);
assert(comparisonFaq, "Comparison guide is missing FAQPage structured data.");
assert(
  comparisonFaq.mainEntity?.length === 6,
  "Comparison FAQPage data must contain six questions."
);
assert(
  !comparisonHtml.includes('class="feeding-article-cta"'),
  "Comparison guide should suppress the default promotional CTA."
);
assert(
  comparisonHtml.includes(
    'href="https://apps.apple.com/gb/app/breastfeeding-tracker-timer/id6754637800"'
  ),
  "Comparison guide is missing its calm inline App Store link."
);
for (const source of requiredComparisonSources) {
  assert(comparisonHtml.includes(`href="${source}"`), `Comparison guide is missing source ${source}.`);
}
assert(
  comparisonHtml.includes(
    '<meta property="og:image" content="https://scruffyhipster.com/assets/breastfeeding-apps-comparison-2026.png"'
  ) &&
    comparisonHtml.includes(`<meta property="og:image:alt" content="${expectedComparisonAltHtml}"`) &&
    comparisonHtml.includes(`<meta name="twitter:image:alt" content="${expectedComparisonAltHtml}"`),
  "Comparison guide is missing dedicated social image metadata."
);

const comparisonImage = await readFile(
  join(distDir, "assets", "breastfeeding-apps-comparison-2026.png")
);
assert(
  comparisonImage.readUInt32BE(16) === 1200 && comparisonImage.readUInt32BE(20) === 630,
  "Comparison social image must be 1200×630."
);

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

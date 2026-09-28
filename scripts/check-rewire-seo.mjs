import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { publicRoutes, legacyRedirects, siteUrl } from "./route-meta.mjs";

const dist = new URL("../dist/", import.meta.url).pathname;
const output = (path) => join(dist, path.replace(/^\//, ""), "index.html");
const canonical = (path) => `${siteUrl}${path.replace(/\/+$/, "")}/`;
const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(new Set(urls).size, urls.length, "Sitemap contains duplicate URLs");
assert(!urls.includes(`${siteUrl}/apps/rewire/`), "Old Rewire product URL is still in the sitemap");

const rewireRoutes = publicRoutes.filter(({ path }) => /^\/rewire(?:\/|$)/.test(path));
for (const route of rewireRoutes) {
  const html = await readFile(output(route.path), "utf8");
  const canonicals = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/g)];
  assert.equal(canonicals.length, 1, `${route.path}: expected one canonical`);
  assert.equal(canonicals[0][1], canonical(route.path), `${route.path}: incorrect canonical`);
  assert.equal(urls.filter((url) => url === canonical(route.path)).length, 1, `${route.path}: sitemap mismatch`);
  assert(html.includes(`property="og:url" content="${canonical(route.path)}"`), `${route.path}: Open Graph URL mismatch`);
}

for (const [from, to] of [["/apps/rewire", "/rewire"], ["/pages/portfolio/rewire.html", "/rewire"]]) {
  assert(legacyRedirects.some(([source, target]) => source === from && target === to), `${from}: missing direct legacy mapping`);
  const file = from.endsWith(".html") ? join(dist, from.slice(1)) : output(from);
  const html = await readFile(file, "utf8");
  assert(html.includes('content="noindex,follow"'), `${from}: redirect must not be indexed`);
  assert(html.includes(`content="0; url=${siteUrl}/rewire/"`), `${from}: missing immediate HTML redirect`);
  assert(html.includes(`rel="canonical" href="${siteUrl}/rewire/"`), `${from}: redirect canonical mismatch`);
  assert(!html.includes(`${siteUrl}/apps/rewire/`), `${from}: redirect chain through old product page`);
}

// Check every published page, including catalogue/related-app links into Rewire.
for (const route of publicRoutes) {
  const html = await readFile(route.path === "/" ? join(dist, "index.html") : output(route.path), "utf8");
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (!href.startsWith("/") && !href.startsWith(`${siteUrl}/`)) continue;
    const url = new URL(href.replaceAll("&amp;", "&"), siteUrl);
    if (url.origin !== new URL(siteUrl).origin) continue;
    assert(!/^\/apps\/rewire\/?$/.test(url.pathname), `${route.path}: stale product link ${href}`);
    assert(url.pathname !== "/pages/portfolio/rewire.html", `${route.path}: legacy portfolio link ${href}`);
    if (/^\/rewire(?:\/|$)/.test(url.pathname)) {
      assert(url.pathname.endsWith("/"), `${route.path}: noncanonical Rewire link ${href}`);
      assert(urls.includes(`${siteUrl}${url.pathname}`), `${route.path}: unpublished Rewire link ${href}`);
    }
  }
}

const shortlist = await readFile(output("/rewire/blog/best-app-blocker-for-iphone"), "utf8");
for (const source of ["https://opalapp.com/help/why-pay-for-opal", "https://one-sec.app/", "https://getbrick.com/pages/faq", "https://support.apple.com/en-gb/guide/iphone/iphb0c7313c9/ios"]) {
  assert(shortlist.includes(`href="${source}"`), `Shortlist is missing source ${source}`);
}
assert(shortlist.includes("not an independent review or a hands-on comparison"), "Shortlist needs its evidence disclosure");
assert(shortlist.includes('href="/rewire/blog/rewire-vs-opal-one-sec-brick/"'), "Shortlist needs its detailed comparison link");
console.log(`Rewire SEO checks passed: ${rewireRoutes.length} canonical pages, legacy redirects, sitemap, catalogue links, and shortlist sources.`);

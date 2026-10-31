import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
const root = new URL("../", import.meta.url).pathname;
const home = await readFile(join(root, "src/content/smartyColoursHome.html"), "utf8");
assert(!/_blob\/|\.dc\.html|\{\{theme\}\}|\[.*artwork.*\]/i.test(home), "Replace every prototype URL, binding and artwork placeholder.");
assert(!/<script\b|\bon\w+\s*=|<iframe\b/i.test(home), "The static home content must contain no executable or embedded third-party content.");
assert.equal([...home.matchAll(/class="sc-pack"/g)].length, 8, "The home must show the eight artboard packs.");
assert.equal([...home.matchAll(/class="pick__art"/g)].length, 6, "The home must show six original line drawings.");
for (const [, source] of home.matchAll(/<img[^>]+src="([^"]+)"/g)) {
  assert(source.startsWith("/smarty-colours/"), `Home image must be self-hosted: ${source}`);
  await access(join(root, "public", source));
}
for (const [, href] of home.matchAll(/href="([^"]+)"/g)) assert(href.startsWith("#") || href === "/apps/smarty-colours/", `Outbound destination escaped the gate: ${href}`);
const fonts = await readFile(join(root, "src/content/smartyColoursFonts.css"), "utf8");
assert(!/https?:/.test(fonts), "Fonts must be self-hosted.");
for (const [, source] of fonts.matchAll(/url\(([^)]+)\)/g)) await access(join(root, "public", source));
const html = await readFile(join(root, "dist/apps/smarty-colours/index.html"), "utf8");
const app = JSON.parse(await readFile(join(root, "content/apps/smarty-colours.json"), "utf8"));
const robots = app.seo.robots || "index,follow";
assert(html.includes(`name="robots" content="${robots}"`), "Rendered indexing must match the declared launch state.");
assert(html.includes('rel="icon"') && html.includes("/smarty-colours/favicon-64.png"), "The original pencil icon must be present in the initial head.");
assert(html.includes('lang="en-GB"'), "Initial page language must be British English.");
assert(html.includes('"@type":"FAQPage"'), "The visible FAQs must be represented in structured data.");
console.log("SmartyColours hand-off checks passed: original artwork, self-hosted fonts/assets, six pictures, eight packs, gated destinations, declared indexing and FAQ markup.");

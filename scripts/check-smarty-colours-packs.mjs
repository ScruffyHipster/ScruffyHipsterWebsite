import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { makeSmartyColourRoutes } from "../src/content/smartyColourRouteData.js";

const root = new URL("../", import.meta.url).pathname;
const readJson = async path => JSON.parse(await readFile(join(root, path), "utf8"));
const catalogue = await readJson("content/smarty-colours/catalogue.json");
const selection = await readJson("docs/smarty-colours-design/pack-selection.json");
const pdfEvidence = await readJson("docs/smarty-colours-pdf-validation.json");
const { publicRoutes, siteUrl } = await import("./route-meta.mjs");
const origin = new URL(siteUrl).origin;
const library = `${catalogue.basePath}/colouring-pages/`;
const canonical = path => new URL(`${path.replace(/\/+$/, "")}/`, `${origin}/`).href;
const packPath = pack => `${library}${pack.id}/`;
const pagePath = (pack, page) => `${packPath(pack)}${page.slug}/`;
const pdfPath = (pack, page, size) => `/smarty-colours/pdfs/smartycolours-${pack.id}-${page ? page.slug : "free-pages"}-${size}.pdf`;
const sha256 = data => createHash("sha256").update(data).digest("hex");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const dist = join(root, "dist");

assert.equal(new URL(siteUrl).protocol, "https:", "Public canonicals must use HTTPS.");
assert.equal(new URL(siteUrl).hostname, catalogue.domain, "The catalogue, PDF domain and website host must agree.");
assert.equal((await readFile(join(root, "CNAME"), "utf8")).trim(), catalogue.domain, "GitHub Pages CNAME must match the approved domain.");
assert.equal(catalogue.packs.length, 16, "The launch catalogue must contain all sixteen approved packs.");
assert.equal(new Set(catalogue.packs.map(pack => pack.id)).size, 16, "Pack URL identifiers must be unique.");
const pages = catalogue.packs.flatMap(pack => pack.pages.map(page => ({ pack, page })));
assert.equal(pages.length, 80);
assert.equal(new Set(pages.map(({ page }) => page.id)).size, 80, "Studio IDs must identify one original picture each.");
assert.equal(new Set(pages.map(({ page }) => page.sourceSha256)).size, 80, "Duplicating source artwork must not inflate the free-page count.");
const expectedPaths = new Set([library, ...catalogue.packs.flatMap(pack => [packPath(pack), ...pack.pages.map(page => pagePath(pack, page))])]);
assert.equal(expectedPaths.size, 97, "Library, pack and individual picture URLs must be distinct.");
const expectedPdfs = new Map();
const auditedImages = new Map(selection.pages.map(page => [page.id, page]));

for (const pack of catalogue.packs) {
  assert(slugPattern.test(pack.id), `Pack URL is not stable and descriptive: ${pack.id}`);
  assert.equal(pack.pages.length, 5, `${pack.name} must offer exactly five free pictures.`);
  assert.equal(new Set(pack.pages.map(page => page.slug)).size, 5, `${pack.name} repeats a picture slug.`);
  assert(pack.description?.trim() && pack.coverAlt?.trim(), `${pack.name} needs its own useful description and cover alt text.`);
  await access(join(root, "public", pack.cover));
  for (const size of ["a4", "letter"]) expectedPdfs.set(pdfPath(pack, null, size), { pack, size, count: 7 });
  for (const page of pack.pages) {
    assert(slugPattern.test(page.id) && slugPattern.test(page.slug), `${pack.name} has an invalid picture identifier.`);
    assert(page.title?.trim() && page.alt?.trim() && page.description?.trim(), `${page.id} lacks picture-specific accessible content.`);
    assert(/^[a-f0-9]{64}$/.test(page.sourceSha256), `${page.id} is missing its original source fingerprint.`);
    assert.equal(page.image, `/smarty-colours/artwork/${page.id}.png`, `${page.id} has an unexpected public artwork path.`);
    const audited = auditedImages.get(page.id);
    assert(audited && audited.pack === pack.id && audited.sourceSha256 === page.sourceSha256, `${page.id} differs from the visually reviewed selection.`);
    const image = await readFile(join(root, "public", page.image));
    assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", `${page.id} is not a PNG.`);
    assert.equal(sha256(image), audited.imageSha256, `${page.id} changed after its visual review.`);
    assert.equal(image.readUInt32BE(16), audited.width, `${page.id} was resized after its native-resolution export.`);
    assert.equal(image.readUInt32BE(20), audited.height);
    assert.equal(image[25], 0, `${page.id} must remain opaque grayscale line art.`);
    for (const size of ["a4", "letter"]) expectedPdfs.set(pdfPath(pack, page, size), { pack, page, size, count: 1 });
  }
}

// Read the actual committed PDFs. Their recorded hashes bind these files to the
// independent PDF parser, vector-stroke checks and rendered review evidence.
assert.equal(expectedPdfs.size, 192);
const recordedPdfs = new Map(pdfEvidence.files.map(file => [file.file, file]));
assert.equal(recordedPdfs.size, 192);
const pdfFiles = (await readdir(join(root, "public/smarty-colours/pdfs"))).filter(name => name.endsWith(".pdf"));
assert.deepEqual(new Set(pdfFiles), new Set([...expectedPdfs.keys()].map(path => path.split("/").at(-1))), "PDF output contains missing or unreviewed files.");
for (const [path, expected] of expectedPdfs) {
  const bytes = await readFile(join(root, "public", path));
  const name = path.split("/").at(-1);
  const evidence = recordedPdfs.get(name);
  assert(evidence && sha256(bytes) === evidence.sha256, `${name} differs from the structurally and visually reviewed PDF.`);
  assert.equal(evidence.pages, expected.count);
  const raw = bytes.toString("latin1");
  assert(raw.startsWith("%PDF-") && /%%EOF\s*$/.test(raw), `${name} is truncated or not a PDF.`);
  assert.equal([...raw.matchAll(/\/Type\s*\/Page\b/g)].length, expected.count, `${name} has the wrong number of PDF pages.`);
  const boxes = [...raw.matchAll(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/g)];
  assert.equal(boxes.length, expected.count, `${name} must declare its paper size on each page.`);
  const size = expected.size === "a4" ? [595.2756, 841.8898] : [612, 792];
  for (const [, width, height] of boxes) assert(Math.abs(Number(width) - size[0]) < 0.02 && Math.abs(Number(height) - size[1]) < 0.02, `${name} is not ${expected.size} paper.`);
  assert(!/\/AcroForm\b|\/Annots\b|\/Subtype\s*\/Widget\b/.test(raw), `${name} contains an unexpected child form or annotation.`);
}

const routes = makeSmartyColourRoutes(catalogue, siteUrl);
assert.deepEqual(new Set(routes.map(route => canonical(route.path))), new Set([...expectedPaths].map(canonical)), "Shared route metadata does not cover the approved library, packs and pictures exactly.");
assert.equal(routes.length, 97);
const published = publicRoutes.filter(route => `${route.path}/`.startsWith(library));
assert.deepEqual(new Set(published.map(route => canonical(route.path))), new Set(routes.map(route => canonical(route.path))), "Static prerendering omits or duplicates catalogue URLs.");
assert.equal(published.length, 97);
assert.equal(new Set(routes.map(route => route.title)).size, 97, "Pack and picture pages must not share search titles.");
assert.equal(new Set(routes.map(route => route.description)).size, 97, "Pack and picture pages must not share generic descriptions.");

const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8");
assert(/xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/.test(sitemap), "The sitemap is missing its image extension.");
const sitemapEntries = new Map([...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => [decode(entry.match(/<loc>([\s\S]*?)<\/loc>/)?.[1] ?? ""), entry]));
const built = new Map();
for (const route of routes) {
  const url = canonical(route.path);
  const html = await readFile(join(dist, route.path.replace(/^\//, ""), "index.html"), "utf8");
  built.set(url, html);
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
  const title = text(head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  assert.equal(title, route.title, `${route.path} emitted the wrong search title.`);
  const metas = tags(head, "meta");
  const links = tags(head, "link");
  const meta = key => metas.filter(item => item.name === key || item.property === key);
  assert.equal(meta("description").length, 1);
  assert.equal(meta("description")[0].content, route.description);
  assert.equal(meta("robots").length, 1);
  assert.equal(meta("robots")[0].content, "index,follow", `${route.path} must be indexable.`);
  const canonicals = links.filter(item => item.rel === "canonical");
  assert.equal(canonicals.length, 1);
  assert.equal(canonicals[0].href, url, `${route.path} has the wrong canonical.`);
  assert.equal(meta("og:url")[0]?.content, url);
  assert.equal(meta("og:image")[0]?.content, new URL(route.ogImage, origin).href);
  assert.equal(meta("og:image:alt")[0]?.content, route.ogImageAlt);
  const headings = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(([, heading]) => text(heading));
  assert.equal(headings.length, 1, `${route.path} must have exactly one initial HTML heading.`);
  assert(headings[0].trim(), `${route.path} has an empty heading.`);
  assert(/<html\b[^>]*lang="en-GB"/i.test(html), `${route.path} must emit British English in its initial HTML.`);
  assert(!/coming soon|being prepared|\[site domain\]|\.dc\.html|\/_blob\//i.test(body), `${route.path} still exposes launch placeholders.`);
  assert(!tags(body, "input").some(item => item.type !== "radio"), `${route.path} must not collect child text or personal data.`);
  const jsonLd = [...head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(([, script]) => JSON.parse(script));
  assert(jsonLd.some(item => item["@type"] === "BreadcrumbList"), `${route.path} lacks breadcrumb schema.`);
  assert.deepEqual(jsonLd, route.jsonLd, `${route.path} schema differs from the shared browser/static metadata.`);
  const anchors = tags(body, "a");
  for (const anchor of anchors) {
    if (!anchor.href || anchor.href.startsWith("#")) continue;
    const destination = new URL(anchor.href, url);
    assert.equal(destination.origin, origin, `${route.path} has a direct outbound link that bypasses the grown-up gate.`);
    if (destination.pathname.endsWith(".pdf")) {
      assert(expectedPdfs.has(destination.pathname), `${route.path} links to an unreviewed printable.`);
      await access(join(dist, destination.pathname));
    } else {
      assert(destination.pathname.endsWith("/"), `${route.path} links to a noncanonical page.`);
      await access(join(dist, destination.pathname, "index.html"));
    }
    if (destination.searchParams.has("picture")) {
      const id = destination.searchParams.get("picture"), packId = destination.searchParams.get("pack");
      assert(pages.some(({ pack, page }) => page.id === id && pack.id === packId), `${route.path} opens a missing picture or mismatched pack.`);
    }
  }
  for (const image of tags(body, "img")) {
    assert(image.src?.startsWith("/smarty-colours/"), `${route.path} embeds an unexpected remote image.`);
    await access(join(dist, image.src));
    assert(Object.hasOwn(image, "alt"), `${route.path} has an image without alt text.`);
  }
  const entry = sitemapEntries.get(url);
  assert(entry, `${route.path} is missing from the sitemap.`);
  const imageUrls = [...entry.matchAll(/<image:loc>([\s\S]*?)<\/image:loc>/g)].map(([, value]) => decode(value));
  assert.deepEqual(new Set(imageUrls), new Set(route.images), `${route.path} has missing or mismatched image-sitemap entries.`);
  assert.equal(imageUrls.length, route.images.length, `${route.path} repeats sitemap images.`);
}

const libraryHtml = built.get(canonical(library));
for (const pack of catalogue.packs) {
  assert(hasLink(libraryHtml, packPath(pack)), `The library hides ${pack.name} from visitors and crawlers.`);
  const html = built.get(canonical(packPath(pack)));
  const cards = [...html.matchAll(/<article\b[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/article>/gi)].filter(([, className]) => className.split(/\s+/).includes("sc-sheet"));
  assert.equal(cards.length, 6, `${pack.name} needs five free page cards and a sixth grown-up app card.`);
  const grownCards = cards.filter(([, className]) => className.split(/\s+/).includes("sc-pack-more"));
  assert.equal(grownCards.length, 1);
  assert(/sc-tag--grown/.test(grownCards[0][2]) && text(grownCards[0][2]).includes(`More ${pack.name} pages in the app`), `${pack.name}'s sixth card must be labelled for grown-ups.`);
  assert(hasLink(html, pdfPath(pack, null, "a4")) && hasLink(html, pdfPath(pack, null, "letter")), `${pack.name} must offer both bundle sizes without JavaScript.`);
  for (const page of pack.pages) {
    assert(hasLink(html, pagePath(pack, page)), `${pack.name} does not link to ${page.title}'s own page.`);
    const pageHtml = built.get(canonical(pagePath(pack, page)));
    assert(hasLink(pageHtml, pdfPath(pack, page, "a4")) && hasLink(pageHtml, pdfPath(pack, page, "letter")), `${page.title} must offer both PDF sizes without JavaScript.`);
    assert(hasLink(pageHtml, packPath(pack)), `${page.title} has lost its parent pack navigation.`);
    const pictureLinks = tags(pageHtml, "a").filter(item => item.href).map(item => new URL(item.href, origin));
    assert(pictureLinks.some(link => link.searchParams.get("picture") === page.id && link.searchParams.get("pack") === pack.id), `${page.title}'s Colour it link opens the wrong picture.`);
    assert(tags(pageHtml, "img").some(item => item.src === page.image && item.alt === page.alt), `${page.title} shows the wrong picture or alt text.`);
    assert(text(pageHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "").includes(page.title));
  }
}

console.log("SmartyColours pack checks passed: 16 packs, 80 reviewed original images, 192 reviewed A4/Letter PDFs, 97 prerendered URLs, exact search metadata/schema, crawlable downloads, six-card pack layouts and image-sitemap coverage.");

function decode(value) {
  return value.replace(/&#(x[\da-f]+|\d+);|&(amp|quot|apos|lt|gt);/gi, (_, numeric, named) => numeric
    ? String.fromCodePoint(numeric[0].toLowerCase() === "x" ? Number.parseInt(numeric.slice(1), 16) : Number(numeric))
    : ({ amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" })[named.toLowerCase()]);
}
function text(value) { return decode(value.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim(); }
function tags(html, tag) {
  const pattern = new RegExp(`<${tag}\\b((?:[^"'<>]|"[^"]*"|'[^']*')*)>`, "gi");
  return [...html.matchAll(pattern)].map(([, attributes]) => Object.fromEntries([...attributes.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)].map(([, name, quoted, single, bare]) => [name.toLowerCase(), decode(quoted ?? single ?? bare ?? "")])));
}
function hasLink(html, destination) { return tags(html, "a").some(link => link.href === destination); }

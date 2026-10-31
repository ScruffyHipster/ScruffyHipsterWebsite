import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const catalogue = JSON.parse(await readFile(new URL("content/smarty-colours/catalogue.json", root), "utf8"));
const copySource = (await readFile(new URL("src/content/smartyColoursStudio.ts", root), "utf8")).replace(/^import catalogue from [^\n]+\n/m, "");
const copyExports = {};
vm.runInNewContext(ts.transpile(copySource, { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS }), { catalogue, exports: copyExports });
assert.equal(copyExports.smartyStudioPacks.length, 16);
assert.equal(copyExports.smartyStudioPictures.length, 80);
for (const pack of copyExports.smartyStudioPacks) {
  assert.equal(pack.pages.length, 5, `${pack.id} must offer exactly five studio pages.`);
  for (const picture of pack.pages) {
    assert.equal(copyExports.resolveStudioPicture(picture.id, pack.id).id, picture.id);
    assert.equal(copyExports.resolveStudioPicture(picture.id).packId, pack.id);
    assert.ok(picture.image.startsWith("/smarty-colours/"));
  }
  assert.equal(copyExports.resolveStudioPicture("unknown-picture", pack.id).id, pack.pages[0].id);
}
const farm = copyExports.smartyStudioPacks.find((pack) => pack.id === "farm-yard");
const another = copyExports.smartyStudioPacks.find((pack) => pack.id !== "farm-yard");
assert.equal(copyExports.resolveStudioPicture(farm.pages[0].id, another.id).packId, another.id, "A mismatched deep link must respect its selected pack.");
assert.equal(copyExports.resolveStudioPicture("unknown-picture", "unknown-pack").packId, "farm-yard");

function declaration(source, fileName, name) {
  const tree = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const node = tree.statements.find((item) => ts.isFunctionDeclaration(item) && item.name?.text === name);
  assert.ok(node, `${name} must exist.`); return node.getText(tree).replace(/^export\s+/, "");
}
const studioSource = await readFile(new URL("src/components/SmartyColoursStudio.tsx", root), "utf8");
const memoryScope = {};
vm.runInNewContext(ts.transpile(`${declaration(studioSource, "Studio.tsx", "parkActivePicture")}\nglobalThis.park = parkActivePicture;`, { target: ts.ScriptTarget.ES2020 }), memoryScope);
const encoded = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==";
const cache = new Map();
for (const page of copyExports.smartyStudioPictures) {
  const active = { id: page.id, ready: true, dirty: true, canvas: { toDataURL: () => encoded }, undo: Array.from({ length: 8 }, () => ({ rawPixels: true })), redo: [] };
  assert.equal(memoryScope.park(active, cache), true);
  assert.equal(cache.get(page.id), encoded, "Leaving a picture must retain its exact compressed colours.");
  assert.equal(active.undo.length + active.redo.length, 0, "Inactive pictures must not retain raw undo pixels.");
  assert.equal(active.canvas, null, "Inactive pictures must release their canvas reference.");
}
assert.equal(cache.size, 80);
assert.ok(Array.from(cache.values()).every((value) => typeof value === "string"));
for (const toDataURL of [() => "data:,", () => { throw new Error("Encoding failed"); }]) {
  const active = { id: "keep-my-work", ready: true, dirty: true, canvas: { toDataURL }, undo: [{ rawPixels: true }], redo: [] };
  cache.set(active.id, encoded);
  assert.equal(memoryScope.park(active, cache), false);
  assert.equal(active.ready, true); assert.equal(active.undo.length, 1);
  assert.equal(cache.get(active.id), encoded, "An encode failure must not replace saved work or discard the active canvas.");
}

const printSource = await readFile(new URL("src/components/smartyColoursPrint.ts", root), "utf8");
const printScope = { copy: copyExports.smartyStudioCopy };
vm.runInNewContext(ts.transpile(`${declaration(printSource, "Print.ts", "escapePrintText")}\n${declaration(printSource, "Print.ts", "createSmartyPrintDocument")}\nglobalThis.documentFor = createSmartyPrintDocument;`, { target: ts.ScriptTarget.ES2020 }), printScope);
for (const size of ["a4", "letter"]) {
  const html = printScope.documentFor({ title: 'Cow <&" test', packName: "Farm Yard", alt: 'A cow \" onload=\"bad', image: encoded, size });
  assert.ok(html.includes(`size:${size === "a4" ? "A4" : "Letter"};margin:0`));
  assert.ok(html.includes(`data-size="${size}"`));
  assert.ok(html.includes("Cow &lt;&amp;&quot; test"));
  assert.ok(html.includes("&quot; onload=&quot;bad"));
  assert.equal((html.match(/<i><\/i>/g) ?? []).length, 5);
  assert.ok(html.includes("scruffyhipster.com"));
  assert.ok(html.includes('class="sc-print-name">Name <span></span>'));
  assert.ok(!/<input\b|<script\b/i.test(html));
  for (const [, destination] of html.matchAll(/(?:src|href)="([^"]+)"/g)) assert.ok(destination.startsWith("/smarty-colours/") || destination === encoded, "Print resources must stay local.");
}
assert.throws(() => printScope.documentFor({ title: "Cow", packName: "Farm Yard", alt: "Cow", image: "https://example.com/child-art.png", size: "a4" }), /local PNG/);
console.log("SmartyColours studio checks passed: 80 deep links across16packs, five pages each, compressed inactive work without raw history, encode-failure preservation, and local escaped A4/Letter PrintSheet documents.");

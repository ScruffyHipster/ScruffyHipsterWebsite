import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

// Exercise the shipped pixel algorithm without a browser or an additional canvas dependency.
const source = await readFile(new URL("../src/components/SmartyColoursStudio.tsx", import.meta.url), "utf8");
const syntax = ts.createSourceFile("SmartyColoursStudio.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const declaration = syntax.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === "fillRegion");
assert.ok(declaration, "The studio must expose its named fillRegion implementation to this source-level check.");
const SIZE = 1000;
const executable = ts.transpile(`const SIZE = ${SIZE};\n${declaration.getText(syntax)}\nglobalThis.fillRegion = fillRegion;`, { target: ts.ScriptTarget.ES2020 });
const sandbox = vm.createContext({ Uint8Array, parseInt, Math });
vm.runInContext(executable, sandbox);
const fillRegion = sandbox.fillRegion;

function page() {
  const pixels = new Uint8ClampedArray(SIZE * SIZE * 4); pixels.fill(255);
  const context = { getImageData: () => ({ data: pixels }), putImageData: () => {} };
  return { pixels, canvas: { getContext: () => context } };
}
function pixelEquals(pixels, x, y, rgb) {
  const offset = (y * SIZE + x) * 4;
  return pixels[offset] === rgb[0] && pixels[offset + 1] === rgb[1] && pixels[offset + 2] === rgb[2] && pixels[offset + 3] === 255;
}
const green = [52, 199, 89], white = [255, 255, 255];

{
  const { pixels, canvas } = page(), boundary = new Uint8Array(SIZE * SIZE);
  for (let y = 0; y < SIZE; y++) boundary[y * SIZE + 500] = 1;
  assert.equal(fillRegion(canvas, boundary, { x: 0, y: 0 }, "#34c759"), true);
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    assert.ok(pixelEquals(pixels, x, y, x <= 500 ? green : white), `A 1px original outline must separate regions; unexpected pixel at ${x},${y}.`);
  }
}
{
  const { pixels, canvas } = page(), boundary = new Uint8Array(SIZE * SIZE);
  for (let y = 0; y < SIZE; y++) for (let x = 500; x < 505; x++) boundary[y * SIZE + x] = 1;
  assert.equal(fillRegion(canvas, boundary, { x: 100, y: 500 }, "#34c759"), true);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 500; x <= 502; x++) assert.ok(pixelEquals(pixels, x, y, green), `Fill must extend three pixels under the line at ${x},${y}.`);
    for (let x = 503; x < SIZE; x++) assert.ok(pixelEquals(pixels, x, y, white), `Underlap must stop after 3px and never reach the other white region at ${x},${y}.`);
  }
  const before = pixels.slice();
  assert.equal(fillRegion(canvas, boundary, { x: 501, y: 500 }, "#fc3242"), false, "Clicking an outline must be ignored.");
  assert.deepEqual(pixels, before, "Clicking an outline must leave every existing mark intact.");
}
console.log("SmartyColours fill checks passed: closed 1px boundaries, connected edge regions, exactly 3px underlap, no neighbouring-region bleed, and outline clicks preserve existing colour.");

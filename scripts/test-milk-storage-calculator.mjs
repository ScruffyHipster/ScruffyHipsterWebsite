import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

process.env.TZ = 'Europe/London';
const directory = await mkdtemp(join(tmpdir(), 'milk-storage-test-'));
let passed = 0;
const test = (name, run) => { run(); passed++; console.log(`PASS ${name}`); };
try {
  const source = await readFile(new URL('../src/components/milkStorageCalculatorModel.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  const modelFile = join(directory, 'model.mjs'); await writeFile(modelFile, compiled);
  const m = await import(pathToFileURL(modelFile));
  const copy = JSON.parse(await readFile(new URL('../content/pages/milk-storage-calculator.json', import.meta.url)));
  const at = value => new Date(value).getTime();
  const HOUR = 3_600_000, DAY = HOUR * 24;
  test('fridge deadline follows the approved 8 calendar days', () => {
    assert.equal(m.milkStorageDeadline('fridge', at('2026-10-31T07:30')), at('2026-11-08T07:30'));
  });
  test('ice compartment deadline follows the approved 14 calendar days', () => {
    assert.equal(m.milkStorageDeadline('ice', at('2026-10-28T22:05')), at('2026-11-11T22:05'));
  });
  test('freezer uses six calendar months rather than 180 days', () => {
    assert.equal(m.milkStorageDeadline('freezer', at('2026-05-05T21:15')), at('2026-11-05T21:15'));
    assert.equal(m.milkStorageDeadline('freezer', at('2026-08-31T08:00')), at('2027-02-28T08:00'));
  });
  test('month-end clamping respects leap years', () => {
    assert.equal(m.milkStorageDeadline('freezer', at('2027-08-31T08:00')), at('2028-02-29T08:00'));
  });
  test('calendar day arithmetic preserves local time across daylight saving', () => {
    assert.equal(m.milkStorageDeadline('fridge', at('2026-03-25T08:00')), at('2026-04-02T08:00'));
    assert.equal(m.milkStorageDeadline('fridge', at('2026-10-22T08:00')), at('2026-10-30T08:00'));
  });
  test('fridge Use soon begins at 24 hours remaining', () => {
    const stored = at('2026-10-31T08:00'), end = m.milkStorageDeadline('fridge', stored);
    assert.equal(m.milkStorageStatus('fridge', stored, end-DAY-1).soon, false);
    assert.equal(m.milkStorageStatus('fridge', stored, end-DAY).soon, true);
  });
  test('ice compartment Use soon also begins at 24 hours', () => {
    const stored = at('2026-10-31T08:00'), end = m.milkStorageDeadline('ice', stored);
    assert.equal(m.milkStorageStatus('ice', stored, end-DAY).soon, true);
  });
  test('freezer Use soon begins at seven days remaining', () => {
    const stored = at('2026-05-05T21:15'), end = m.milkStorageDeadline('freezer', stored);
    assert.equal(m.milkStorageStatus('freezer', stored, end-7*DAY-1).soon, false);
    assert.equal(m.milkStorageStatus('freezer', stored, end-7*DAY).soon, true);
  });
  test('Guidance passed takes effect exactly at the deadline', () => {
    const stored = at('2026-10-31T08:00'), end = m.milkStorageDeadline('fridge', stored);
    assert.equal(m.milkStorageStatus('fridge', stored, end-1).passed, false);
    assert.equal(m.milkStorageStatus('fridge', stored, end).passed, true);
    assert.equal(m.milkStorageStatus('fridge', stored, end).soon, false);
  });
  test('future entry condition matches the prototype', () => {
    const now = at('2026-10-31T08:00');
    assert.equal(m.milkStorageStatus('fridge', now+60_001, now).future, true);
    assert.equal(m.milkStorageStatus('fridge', now, now).future, false);
  });
  test('relative durations match the approved display, including floor rounding', () => {
    assert.equal(m.milkDuration(8*DAY-1000, copy.durations), '7 days');
    assert.equal(m.milkDuration(DAY+3*HOUR, copy.durations), '1 day 3 hr');
    assert.equal(m.milkDuration(DAY, copy.durations), '1 day');
    assert.equal(m.milkDuration(HOUR+59*60_000, copy.durations), '1 hr');
    assert.equal(m.milkDuration(30_000, copy.durations), 'Just now');
  });
  test('date input round trip preserves local date and time', () => {
    const value = '2026-10-31T06:50'; assert.equal(m.milkLocalInput(m.parseMilkLocalInput(value)), value);
    assert.equal(m.parseMilkLocalInput('2026-02-30T06:50'), null);
    assert.equal(m.parseMilkLocalInput(''), null);
  });
  test('last bag and invitation dismissal round trip through versioned storage', () => {
    const state = {place:'freezer',stored:at('2026-05-05T21:15'),interacted:true,dismissed:true};
    assert.deepEqual(m.readMilkCalculator(m.serializeMilkCalculator(state), at('2026-10-31T08:00')), state);
  });
  test('invalid or future stored records do not replace the default calculator', () => {
    const now = at('2026-10-31T08:00');
    for (const raw of ['{','null','{"v":2}',JSON.stringify({v:1,place:'bottle',stored:now}),JSON.stringify({v:1,place:'fridge',stored:now+DAY}),JSON.stringify({v:1,place:'fridge',stored:'yesterday'})]) assert.equal(m.readMilkCalculator(raw, now), null);
  });
  test('a new browser defaults to fridge at the current minute without an invitation', () => {
    const state = m.defaultMilkCalculator(at('2026-10-31T08:00:15'));
    assert.equal(state.place,'fridge');assert.equal(state.stored,at('2026-10-31T08:00'));assert.equal(state.interacted,false);assert.equal(state.dismissed,false);
  });
  const reference = (await Promise.all(['MilkMain.dc.html','MilkCalc.dc.html'].map(name => readFile(new URL(`../docs/milk-storage-calculator-design/${name}`, import.meta.url), 'utf8')))).join('\n').replaceAll('&amp;', '&');
  test('every static label, FAQ and metadata sentence comes from the approved designs', () => {
    for (const value of [...Object.values(copy.labels), copy.seo.title, copy.seo.description, ...copy.faqs.flatMap(faq => [faq.question,faq.answer])]) assert.ok(reference.includes(value), `Unapproved copy: ${value}`);
    for (const rule of Object.values(copy.rules)) for (const value of Object.values(rule)) assert.ok(reference.includes(value), `Unapproved rule wording: ${value}`);
  });
  console.log(`${passed} milk storage checks passed.`);
} finally { await rm(directory,{recursive:true,force:true}); }

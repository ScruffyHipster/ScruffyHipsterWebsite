import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const directory = await mkdtemp(join(tmpdir(), 'breastfeeding-timer-test-'));
let passed = 0;
const test = async (name, run) => { await run(); passed++; console.log(`PASS ${name}`); };
try {
  for (const name of ['breastfeedingTimerModel', 'breastfeedingTimerStore']) {
    const source = await readFile(new URL(`../src/components/${name}.ts`, import.meta.url), 'utf8');
    const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
    await writeFile(join(directory, `${name}.mjs`), output.replace('"./breastfeedingTimerModel"', '"./breastfeedingTimerModel.mjs"'));
  }
  const m = await import(pathToFileURL(join(directory, 'breastfeedingTimerModel.mjs')));
  const { BreastfeedingTimerStore: Store } = await import(pathToFileURL(join(directory, 'breastfeedingTimerStore.mjs')));
  const minute = 60_000;
  const at = new Date(2026, 9, 30, 12).getTime();
  const begin = () => m.startFeed(m.emptyTimer(), at, 'feed');
  const storage = () => {
    let value = null; let writes = 0;
    return { getItem: () => value, setItem: (_, next) => { value = next; writes++; }, get writes() { return writes; } };
  };
  const drain = async () => { for (let i = 0; i < 8; i++) await new Promise(setImmediate); };

  await test('start commits timestamp immediately and repeated Start is idempotent', () => {
    const timer = begin(); assert.equal(timer.active.start, at);
    assert.equal(m.startFeed(timer, at + 1), timer);
  });
  await test('multiple switches preserve side totals and exclude pauses', () => {
    let timer = begin();
    timer = m.switchSide(timer, at + 2 * minute);
    timer = m.togglePause(timer, at + 3 * minute);
    timer = m.switchSide(timer, at + 4 * minute);
    timer = m.togglePause(timer, at + 5 * minute);
    timer = m.switchSide(timer, at + 6 * minute);
    timer = m.stopFeed(timer, at + 7 * minute);
    assert.equal(timer.feeds[0].ms, 5 * minute);
    assert.equal(m.sideMs(timer.feeds[0], 'L'), 3 * minute);
    assert.equal(m.sideMs(timer.feeds[0], 'R'), 2 * minute);
  });
  await test('Stop while paused freezes elapsed and repeated Stop never saves twice', () => {
    let timer = m.togglePause(begin(), at + minute);
    timer = m.stopFeed(timer, at + 10 * minute);
    assert.equal(timer.feeds[0].ms, minute);
    assert.equal(m.stopFeed(timer, at + 11 * minute), timer);
  });
  await test('Last used retains finishing side when Stop immediately follows Switch', () => {
    const timer = m.stopFeed(m.switchSide(begin(), at + minute), at + minute);
    assert.equal(m.finalSide(timer.feeds[0]), 'R');
  });
  await test('running and paused state restore without counting background ticks', () => {
    const running = m.readStoredTimer(m.serializeTimer(begin()));
    assert.equal(m.elapsedMs(running.active, at + 4 * minute), 4 * minute);
    const paused = m.readStoredTimer(m.serializeTimer(m.togglePause(running, at + minute)));
    assert.equal(m.elapsedMs(paused.active, at + 60 * minute), minute);
  });
  await test('start correction preserves closed segments and rejects negative open duration', () => {
    const timer = m.switchSide(begin(), at + 2 * minute);
    assert.equal(m.isStartValid(timer.active, at - minute, at + 3 * minute), true);
    assert.equal(m.isStartValid(timer.active, at + 2 * minute, at + 3 * minute), false);
  });
  await test('manual save is idempotent and editing does not resurrect deleted records', () => {
    const draft = m.newDraft('R', at);
    const saved = m.saveDraft(m.emptyTimer(), draft, null, at);
    assert.equal(saved.feeds.length, 1);
    assert.equal(m.saveDraft(saved, draft, null, at), saved);
    assert.equal(m.saveDraft(m.emptyTimer(), draft, draft.id, at).feeds.length, 0);
    assert.equal(m.deleteFeed(saved, draft.id).feeds.length, 0);
  });
  await test('no-op edit preserves seconds, pauses, and segment order', () => {
    const timer = m.stopFeed(m.switchSide(begin(), at + 65_000), at + 130_000);
    assert.equal(m.saveDraft(timer, m.draftFromFeed(timer.feeds[0]), 'feed', at + 5 * minute), timer);
  });
  await test('short feeds remain editable without rounding their saved duration away', () => {
    const timer = m.stopFeed(begin(), at + 5000);
    const draft = m.draftFromFeed(timer.feeds[0]);
    assert.equal(m.isDraftValid(draft, at + minute), true);
    assert.equal(m.saveDraft(timer, draft, 'feed', at + minute), timer);
  });
  await test('input parsing rejects impossible dates and times', () => {
    assert.equal(m.parseLocalInput('2026-02-30T10:00'), null);
    assert.equal(m.parseTimeInput('25:00', at), null);
    assert.equal(m.parseTimeInput('10:90', at), null);
  });
  await test('invitation hides for exactly the next 3 or 10 new saves', () => {
    for (const cooldown of [3, 10]) {
      let timer = { ...m.emptyTimer(), invite: false, cooldown };
      for (let i = 0; i < cooldown; i++) {
        timer = m.stopFeed(m.startFeed(timer, at + i * minute), at + i * minute + 1000);
        assert.equal(timer.invite, false);
      }
      timer = m.stopFeed(m.startFeed(timer, at + 20 * minute), at + 21 * minute);
      assert.equal(timer.invite, true);
    }
  });
  await test('more than 200 feeds survive save and restore', () => {
    let timer = m.emptyTimer();
    for (let i = 0; i < 205; i++) timer = m.stopFeed(m.startFeed(timer, at + i * minute), at + i * minute + 1000);
    assert.equal(m.readStoredTimer(m.serializeTimer(timer)).feeds.length, 205);
  });
  await test('malformed entries preserve valid records; invalid JSON safely fails', () => {
    const timer = m.stopFeed(begin(), at + minute);
    const raw = JSON.parse(m.serializeTimer(timer)); raw.feeds.push(null, { id: 'bad', ms: -1 });
    assert.equal(m.readStoredTimer(JSON.stringify(raw)).feeds.length, 1);
    assert.equal(m.readStoredTimer('{'), null);
    assert.equal(m.readStoredTimer('null'), null);
  });
  await test('midnight grouping and long-duration display', () => {
    assert.notEqual(m.dayKey(new Date(2026, 9, 30, 23, 59).getTime()), m.dayKey(new Date(2026, 9, 31, 0, 1).getTime()));
    assert.equal(m.clock(27 * 60 * minute + 61_000), '27:01:01');
  });
  await test('storage notifications do not echo writes and actions use latest persisted state', () => {
    const disk = storage(); const a = new Store(); const b = new Store();
    a.connect(disk, null); b.connect(disk, null);
    a.commit((state) => m.startFeed(state, at, 'a'));
    const writes = disk.writes; b.refresh(); assert.equal(disk.writes, writes);
    b.commit((state) => m.switchSide(state, at + minute));
    a.commit((state) => m.stopFeed(state, at + 2 * minute));
    assert.equal(a.getSnapshot().feeds.length, 1);
    assert.equal(m.sideMs(a.getSnapshot().feeds[0], 'R'), minute);
  });
  await test('unavailable or full storage retains the timer in memory', () => {
    for (const disk of [null, { getItem: () => null, setItem: () => { throw Error('quota'); } }]) {
      const a = new Store(); a.connect(disk, null);
      a.commit((state) => m.startFeed(state, at, 'a'));
      a.commit((state) => m.stopFeed(state, at + minute));
      a.refresh(); assert.equal(a.getSnapshot().feeds[0].ms, minute);
    }
  });
  await test('malformed external storage does not discard the valid in-memory copy', () => {
    const disk = storage(); const a = new Store(); a.connect(disk, null);
    a.commit((state) => m.startFeed(state, at, 'a'));
    disk.setItem(m.STORAGE_KEY, '{'); a.refresh();
    assert.equal(a.getSnapshot().active.id, 'a');
  });
  await test('simultaneous tabs serialize writes and Stop saves a shared feed once', async () => {
    let queue = Promise.resolve();
    const locks = { request: (_, run) => { const next = queue.then(run); queue = next.catch(() => {}); return next; } };
    const disk = storage(); const a = new Store(); const b = new Store();
    a.connect(disk, locks); b.connect(disk, locks);
    a.commit((state) => m.startFeed(state, at, 'a'));
    assert.equal(a.getSnapshot().active.start, at); // optimistic state within the tap
    await drain(); b.refresh();
    a.commit((state) => m.stopFeed(state, at + minute));
    b.commit((state) => m.stopFeed(state, at + minute));
    await drain(); a.refresh(); b.refresh();
    assert.equal(a.getSnapshot().feeds.length, 1); assert.deepEqual(a.getSnapshot(), b.getSnapshot());
    const da = m.newDraft('L', at); const db = m.newDraft('R', at);
    a.commit((state) => m.saveDraft(state, da, null, at));
    b.commit((state) => m.saveDraft(state, db, null, at));
    await drain(); a.refresh(); assert.equal(a.getSnapshot().feeds.length, 3);
  });
  await test('feed controls have no direct network or analytics calls', async () => {
    for (const name of ['BreastfeedingTimer.tsx', 'breastfeedingTimerModel.ts', 'breastfeedingTimerStore.ts']) {
      const source = await readFile(new URL(`../src/components/${name}`, import.meta.url), 'utf8');
      assert.doesNotMatch(source, /\b(trackEvent|fetch|sendBeacon|XMLHttpRequest)\s*\(/);
    }
  });
  console.log(`${passed} timer checks passed.`);
} finally { await rm(directory, { recursive: true, force: true }); }

// Run with: node --experimental-vm-modules scripts/test-smarty-colours-privacy.mjs
// The actual analytics modules execute against an in-memory SDK. No request is sent.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

assert(
  typeof vm.SourceTextModule === "function",
  "Run this check with node --experimental-vm-modules scripts/test-smarty-colours-privacy.mjs"
);

const analyticsSource = await readFile(new URL("../src/analytics/telemetrydeck.ts", import.meta.url), "utf8");
const routeSource = await readFile(new URL("../src/analytics/RouteAnalytics.tsx", import.meta.url), "utf8");
const compile = (source) => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 }
}).outputText;

async function analyticsHarness(pathname, { defer = false } = {}) {
  const state = { imports: 0, constructors: 0, reads: 0, writes: 0, signals: [] };
  let release;
  const ready = defer ? new Promise((resolve) => { release = resolve; }) : Promise.resolve();
  const context = vm.createContext({
    window: { location: { pathname } },
    sessionStorage: {
      getItem() { state.reads++; return null; },
      setItem() { state.writes++; }
    },
    Date, Math, console
  });
  const sdk = new vm.SyntheticModule(["TelemetryDeck"], function () {
    this.setExport("TelemetryDeck", class {
      constructor() { state.constructors++; }
      signal(...args) { state.signals.push(args); }
    });
  }, { context });
  const module = new vm.SourceTextModule(compile(analyticsSource), {
    context,
    initializeImportMeta(meta) {
      meta.env = {
        PROD: true, DEV: false,
        VITE_ANALYTICS_ENABLED: "true", VITE_TELEMETRYDECK_APP_ID: "in-memory-test"
      };
    },
    async importModuleDynamically() {
      state.imports++;
      await ready;
      if (sdk.status === "unlinked") await sdk.link(() => {});
      if (sdk.status === "linked") await sdk.evaluate();
      return sdk;
    }
  });
  await module.link(() => {});
  await module.evaluate();
  return { state, api: module.namespace, context, release };
}

const child = await analyticsHarness("/apps/smarty-colours/");
for (const path of [
  "/apps/smarty-colours", "/apps/smarty-colours/", "/apps/smarty-colours/play/",
  "/APPS/Smarty-Colours/", "/apps/%73marty-colours/"
]) assert(child.api.isSmartyColoursPath(path), `Expected child route: ${path}`);
for (const path of ["/about/", "/apps/smarty-colours-extra/", "/apps/smarty-colours%invalid"])
  assert(!child.api.isSmartyColoursPath(path), `Expected unrelated route: ${path}`);
await child.api.initTelemetryDeck();
child.api.trackEvent("blocked-direct-entry");
assert.deepEqual(child.state, { imports: 0, constructors: 0, reads: 0, writes: 0, signals: [] });

const pending = await analyticsHarness("/about/", { defer: true });
const initialization = pending.api.initTelemetryDeck();
pending.api.trackEvent("queued-before-navigation");
pending.context.window.location.pathname = "/apps/smarty-colours/";
pending.release();
await initialization;
await new Promise((resolve) => setImmediate(resolve));
assert.equal(pending.state.imports, 1);
assert.equal(pending.state.constructors, 0);
assert.equal(pending.state.reads, 0);
assert.equal(pending.state.writes, 0);
assert.equal(pending.state.signals.length, 0);
pending.context.window.location.pathname = "/about/";
await pending.api.initTelemetryDeck();
pending.api.trackEvent("adult-route-after-cancelled-initialization");
assert.equal(pending.state.signals.length, 1, "Cancelled initialization must not leave adult analytics stuck.");

const active = await analyticsHarness("/about/");
await active.api.initTelemetryDeck();
active.api.trackEvent("allowed");
assert.equal(active.state.signals.length, 1);
active.context.window.location.pathname = "/apps/smarty-colours/";
active.api.trackEvent("blocked-after-navigation");
assert.equal(active.state.signals.length, 1);
active.context.window.location.pathname = "/about/";
active.api.trackEvent("allowed-after-return");
assert.equal(active.state.signals.length, 2);

async function exerciseRouteAnalytics(pathname) {
  const state = { attributionReads: 0, effects: [], signals: [] };
  const context = vm.createContext({ window: {}, document: { title: "Test page", referrer: "" } });
  const values = {
    react: {
      useEffect: (callback) => state.effects.push(callback),
      useRef: () => ({ current: false })
    },
    "react-router-dom": { useLocation: () => ({ pathname, search: "", hash: "" }) },
    "./landingAttribution": {
      ensureLandingAttribution: () => { state.attributionReads++; return {}; },
      readLandingAttribution: () => { state.attributionReads++; return {}; }
    },
    "./telemetrydeck": {
      isSmartyColoursPath: child.api.isSmartyColoursPath,
      trackEvent: (...args) => state.signals.push(args)
    },
    "../content/trackerLocales": { localeForPath: () => "en-GB" },
    "../content/routes": { BREASTFEEDING_TIMER_PATH: "/breastfeeding-timer" },
    "../content/pages": { breastfeedingTimerPageContent: { seo: { title: "Timer" } } }
  };
  const module = new vm.SourceTextModule(compile(routeSource), { context });
  await module.link((specifier) => {
    const exports = values[specifier];
    assert(exports, `Unexpected RouteAnalytics import: ${specifier}`);
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
  });
  await module.evaluate();
  module.namespace.RouteAnalytics();
  for (const effect of state.effects) effect();
  return state;
}
const childRoute = await exerciseRouteAnalytics("/apps/smarty-colours/");
assert.equal(childRoute.attributionReads, 0);
assert.equal(childRoute.signals.length, 0);
const adultRoute = await exerciseRouteAnalytics("/about/");
assert.equal(adultRoute.attributionReads, 2);
assert.equal(adultRoute.signals.length, 2);

console.log("SmartyColours privacy checks passed: direct entry, route aliases, pending imports/events, navigation, adult-route recovery and attribution suppression.");

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createServer } from "vite";

const root = new URL("../", import.meta.url).pathname;
const manifest = JSON.parse(await readFile(join(root, "src/generated/breastfeeding-tracker-locales.json"), "utf8"));
const english = JSON.parse(await readFile(join(root, "content/breastfeeding-tracker/landing.json"), "utf8"));
// Keep the full rendered sections in sync with the English design, including hidden FAQ answers.
const sections = ["faqSection", "faqs", "navigation", "everyday", "footer", "editorial", "finalCta", "softwareApplication"];
function assertShape(source, translation, path) {
  assert.equal(typeof translation, typeof source, `${path} is missing or has the wrong type`);
  if (Array.isArray(source)) {
    assert.ok(Array.isArray(translation), `${path} must be an array`);
    if (path.endsWith(".seo.keywords")) {
      assert.ok(translation.length && translation.every((keyword) => typeof keyword === "string" && keyword.trim()), `${path} needs localized keywords`);
      return;
    }
    assert.equal(translation.length, source.length, `${path} has incomplete coverage`);
    source.forEach((value, index) => assertShape(value, translation[index], `${path}.${index}`));
  } else if (source && typeof source === "object") {
    for (const [key, value] of Object.entries(source)) assertShape(value, translation[key], `${path}.${key}`);
  } else if (typeof source === "string") {
    assert.ok(translation.trim(), `${path} is empty`);
  }
}
const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: "custom" });
try {
  const { render } = await server.ssrLoadModule("/src/entry-server.tsx");
  const { render: renderProduction } = await import("../.ssr-dist/entry-server.js");
  for (const config of manifest.locales) {
    const content = config.sourceContent.fixed.landing;
    for (const [section, keys] of Object.entries({
      hero: ["eyebrow", "heading", "headingEmphasis", "body", "primaryCta", "secondaryCta", "storeNote", "imageAlt", "caption"],
      howItWorks: ["eyebrow", "heading", "body"],
      careMethodsFeature: ["link"],
      historyFeature: ["eyebrow", "heading", "paragraphs", "cta", "url", "imageAlts"],
      seo: ["title", "description", "ogImage"]
    })) {
      for (const key of keys) assertShape(english[section][key], content[section][key], `${config.locale}.${section}.${key}`);
    }
    for (const section of sections) assertShape(english[section], content[section], `${config.locale}.${section}`);
    for (const suffix of ["", "/"]) {
      const context = {};
      const html = render(config.prefix + suffix, context);
      const { helmet } = context;
      const head = [helmet.title, helmet.meta, helmet.link, helmet.script, helmet.priority].map((part) => part?.toString() ?? "").join("");
      assert.ok(html.includes('class="bft-editorial-hero"'), `${config.locale}: redesigned page is not rendered`);
      assert.ok(html.includes(content.hero.heading), `${config.locale}: missing translated heading`);
      assert.ok(!html.includes(english.hero.heading), `${config.locale}: English heading leaked`);
      assert.ok(!html.includes(english.editorial.screens.switcherLabel), `${config.locale}: English appearance label leaked`);
      assert.equal((html.match(/<details>/g) ?? []).length, english.faqs.length);
      assert.ok(helmet.htmlAttributes.toString().includes(`lang="${config.locale}"`));
      assert.ok(head.includes(`${config.prefix}/`));
      if (!config.enabled) assert.ok(head.includes("noindex,nofollow"));
      assert.ok(head.includes('"priceCurrency":"EUR"'));
      assert.ok(head.includes(content.faqs[0].question));
      assert.ok(html.includes(`apps.apple.com/${config.appStoreCountry}/`));
      assert.ok(html.includes(`ct=site_${config.appStoreCountry}_tracker_landing`));
      for (const [, source] of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
        assert.ok(existsSync(join(root, "public", source)), `${config.locale}: missing image ${source}`);
        if (source.includes("/breastfeeding-editorial/") && !source.includes("motherhood-") && !source.includes("app-icon-")) {
          assert.ok(source.includes(`/${config.locale}/`), `${config.locale}: English screenshot leaked`);
        }
      }
      const production = renderProduction(config.prefix + suffix, {});
      assert.equal(production.includes('class="bft-editorial-hero"'), config.enabled, `${config.locale}: release gate was bypassed`);
    }
  }
  const { trackerContentForPath, trackerLocalePath } = await server.ssrLoadModule("/src/content/trackerLocales.ts");
  for (const config of manifest.locales) {
    const fixed = config.sourceContent.fixed;
    for (const [kind, name] of Object.entries({ support: "breastfeeding-support", blog: "breastfeeding-blog", editorialDisclosure: "breastfeeding-blog-disclosure" })) {
      const original = JSON.parse(await readFile(join(root, "content/pages", `${name}.json`), "utf8"));
      assertShape(original, fixed[kind], `${config.locale}.${kind}`);
    }
    const resources = [
      ...["support", "blog", "editorialDisclosure"].map((kind) => ({
        path: trackerLocalePath(config.locale, kind), kind, title: fixed[kind].hero.heading
      })),
      ...Object.values(config.sourceContent.guides).map((article) => ({
        path: trackerLocalePath(config.locale, "guide", article.translationKey), kind: "guide", title: article.title,
        translationKey: article.translationKey, article
      })),
      ...Object.values(config.sourceContent.blog).map((article) => ({
        path: trackerLocalePath(config.locale, "blogPost", article.translationKey), kind: "blogPost", title: article.title,
        translationKey: article.translationKey, article
      }))
    ];
    const paths = new Set([config.prefix, ...resources.map((resource) => resource.path)]);
    for (const resource of resources) {
      const route = trackerContentForPath(resource.path);
      assert.equal(route.kind, resource.kind);
      assert.equal(route.translationKey, resource.translationKey);
      for (const target of ["en-GB", ...manifest.locales.map((item) => item.locale)]) {
        const equivalent = trackerLocalePath(target, route.kind, route.translationKey);
        assert.ok(equivalent, `${resource.path}: missing equivalent in ${target}`);
        assert.deepEqual(trackerContentForPath(equivalent), route);
      }
      for (const suffix of ["", "/"]) {
        const context = {};
        const html = render(resource.path + suffix, context);
        const { helmet } = context;
        const head = [helmet.meta, helmet.link, helmet.script, helmet.priority].map((part) => part?.toString() ?? "").join("");
        const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
        assert.ok(html.includes(`<h1>${escape(resource.title)}</h1>`), `${resource.path}: translated heading missing`);
        assert.ok(helmet.htmlAttributes.toString().includes(`lang="${config.locale}"`));
        assert.ok(head.includes(`${resource.path}/`), `${resource.path}: wrong canonical`);
        if (!config.enabled) assert.ok(head.includes("noindex,nofollow"));
        assert.equal((html.match(/class="tracker-language-dropdown"/g) ?? []).length, 1);
        assert.ok(html.includes(`value="${config.locale}" selected=""`), `${resource.path}: wrong dropdown selection`);
        const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
        for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
          if (href.startsWith("#")) assert.ok(ids.has(href.slice(1)), `${resource.path}: broken anchor ${href}`);
          if (href.startsWith(config.prefix)) assert.ok(paths.has(href.split(/[?#]/)[0].replace(/\/+$/, "")), `${resource.path}: broken local link ${href}`);
          assert.ok(!href.startsWith("/breastfeeding-tracker"), `${resource.path}: unexpected English resource link ${href}`);
        }
        for (const [, source] of html.matchAll(/<img[^>]+src="([^"]+)"/g)) assert.ok(existsSync(join(root, "public", source)), `${resource.path}: missing asset ${source}`);
        if (resource.article) {
          assert.ok(html.includes(resource.article.html), `${resource.path}: missing translated article body`);
          for (const heading of resource.article.tableOfContents) assert.ok(ids.has(heading.id), `${resource.path}: contents target missing`);
          assert.ok(head.includes(`"headline":"${resource.article.title}"`));
        }
        if (!config.enabled) {
          const production = renderProduction(resource.path, {});
          assert.ok(!production.includes(`<h1>${escape(resource.title)}</h1>`), `${resource.path}: draft exposed in production`);
        }
      }
    }
    const blog = render(trackerLocalePath(config.locale, "blog"), {});
    assert.equal((blog.match(/class="feeding-blog-card(?: feeding-blog-card-featured)?"/g) ?? []).length, Object.keys(config.sourceContent.blog).length);
  }
  const englishHtml = renderProduction("/breastfeeding-tracker/", {});
  assert.ok(englishHtml.includes(english.hero.heading));
  for (const config of manifest.locales.filter((locale) => !locale.enabled)) {
    assert.ok(!englishHtml.includes(`href="${config.prefix}/"`), "Draft locale exposed in production selector");
  }
  console.log("Tracker locale checks passed: DE/FR landing, Help, Blog and editorial routes; equivalent articles, navigation, contents anchors, metadata, screenshots and production gates.");
} finally {
  await server.close();
}

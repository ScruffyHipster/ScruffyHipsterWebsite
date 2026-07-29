import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

const rootDir = new URL("../", import.meta.url).pathname;
const generatedDir = join(rootDir, "src", "generated");
const ratingFallbackPath = join(rootDir, "src", "content", "rewireAppStoreRatingFallback.json");
const rewireAppId = "6757722922";
const storeCountry = process.env.APP_STORE_COUNTRY || "us";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const contentCollections = [
  {
    sourceDir: join(rootDir, "content", "rewire-blog"),
    outputFile: "rewire-blog.json",
    defaultOgImage: "/assets/rewire/app-store/rewire-icon.jpg"
  },
  {
    sourceDir: join(rootDir, "content", "breastfeeding-tracker", "guides"),
    outputFile: "breastfeeding-tracker-guides.json",
    defaultOgImage: "/assets/breastfeeding-tracker-og.png"
  }
];
const siteSource = await readJson(join(rootDir, "content", "cms", "site.json"));
const markdownTableAriaLabel = siteSource.shared.markdown.scrollableTableAriaLabel;

await mkdir(generatedDir, { recursive: true });
const generatedCollections = new Map();
for (const collection of contentCollections) {
  generatedCollections.set(collection.outputFile, await generateContentCollection(collection));
}
await generateRating();
await generateCmsContent({
  rewireArticles: generatedCollections.get("rewire-blog.json"),
  breastfeedingGuides: generatedCollections.get("breastfeeding-tracker-guides.json")
});

async function generateContentCollection({ sourceDir, outputFile, defaultOgImage }) {
  const files = existsSync(sourceDir)
    ? (await readdir(sourceDir)).filter((file) => file.endsWith(".md")).sort()
    : [];

  const posts = [];
  for (const file of files) {
    const slug = basename(file, ".md");
    const source = await readFile(join(sourceDir, file), "utf8");
    const { frontmatter, body } = parseFrontmatter(source);
    const published =
      frontmatter.published === undefined
        ? !parseBoolean(frontmatter.draft)
        : parseBoolean(frontmatter.published);

    if (!frontmatter.title || !frontmatter.description || !frontmatter.publishedAt) {
      throw new Error(`${file} must include title, description, and publishedAt frontmatter.`);
    }
    assert(slugPattern.test(slug), `${file} has an invalid immutable slug.`);
    validateMarkdownMedia(source, file);

    const faqItems = extractFaqItems(body);
    posts.push({
      slug,
      title: frontmatter.title,
      metaTitle: frontmatter.metaTitle || null,
      description: frontmatter.description,
      publishedAt: frontmatter.publishedAt,
      updatedAt: frontmatter.updatedAt || null,
      excerpt: frontmatter.excerpt || frontmatter.description,
      tags: parseTags(frontmatter.tags),
      published,
      draft: !published,
      ogImage: frontmatter.ogImage || defaultOgImage,
      ogImageAlt: frontmatter.ogImageAlt || null,
      faqItems,
      showDefaultCta:
        frontmatter.showDefaultCta === undefined
          ? true
          : parseBoolean(frontmatter.showDefaultCta),
      html: renderMarkdown(body)
    });
  }

  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => compareDatesDescending(a.publishedAt, b.publishedAt));

  const output = {
    generatedAt: new Date().toISOString(),
    posts: publishedPosts
  };
  await writeJson(join(generatedDir, outputFile), output);
  return output;
}

async function generateCmsContent({ rewireArticles, breastfeedingGuides }) {
  const site = await readJson(join(rootDir, "content", "cms", "site.json"));
  const pageRecords = await readJsonDirectory(join(rootDir, "content", "pages"));
  const appRecords = await readJsonDirectory(join(rootDir, "content", "apps"));
  const privacyRecords = await readJsonDirectory(
    join(rootDir, "content", "privacy-policies")
  );
  const standardPageRecords = await readJsonDirectory(
    join(rootDir, "content", "standard-pages")
  );
  const rewire = await readJson(join(rootDir, "content", "rewire", "landing.json"));
  const breastfeedingTracker = await readJson(
    join(rootDir, "content", "breastfeeding-tracker", "landing.json")
  );

  const pages = Object.fromEntries(
    pageRecords.map(({ filename, value }) => [basename(filename, ".json"), value])
  );
  const apps = appRecords
    .map(({ filename, value }) => {
      validateImmutableSlug(filename, value.slug);
      return value;
    })
    .sort(compareOrder);
  const privacyPolicies = privacyRecords
    .map(({ filename, value }) => {
      validateImmutableSlug(filename, value.slug);
      return value;
    })
    .sort(compareOrder);
  const standardPages = standardPageRecords.map(({ filename, value }) => {
    validateImmutableSlug(filename, value.slug);
    return value;
  });

  validateCmsContent({
    site,
    pages,
    apps,
    privacyPolicies,
    standardPages,
    rewire,
    breastfeedingTracker,
    rewireArticles,
    breastfeedingGuides
  });

  await writeJson(join(generatedDir, "cms-content.json"), {
    generatedAt: new Date().toISOString(),
    site,
    pages,
    apps: apps.filter((app) => app.published),
    privacyPolicies: privacyPolicies.filter((policy) => policy.published),
    standardPages: standardPages.filter((page) => page.published),
    rewire,
    breastfeedingTracker,
    rewireArticles: rewireArticles.posts,
    breastfeedingGuides: breastfeedingGuides.posts
  });
}

function validateCmsContent(content) {
  const {
    site,
    pages,
    apps,
    privacyPolicies,
    standardPages,
    rewire,
    breastfeedingTracker,
    rewireArticles,
    breastfeedingGuides
  } = content;
  const expectedPages = [
    "home",
    "apps",
    "about",
    "not-found",
    "rewire-blog",
    "breastfeeding-guides"
  ];

  for (const pageName of expectedPages) {
    assert(pages[pageName], `Missing fixed page content/pages/${pageName}.json.`);
    validatePublished(pages[pageName], `Fixed page ${pageName}`);
    validateSeo(pages[pageName].seo, `Fixed page ${pageName}`);
  }

  requireString(site.companyName, "site.companyName");
  requireString(site.legalName, "site.legalName");
  requireString(site.domain, "site.domain");
  requireString(site.supportEmail, "site.supportEmail");
  requireString(site.helloEmail, "site.helloEmail");
  requireString(site.branding?.name, "site.branding.name");
  requireString(site.branding?.logo, "site.branding.logo");
  requireString(site.branding?.logoAlt, "site.branding.logoAlt");
  assert(Array.isArray(site.navigation?.items), "site.navigation.items must be a list.");
  validateSeo(site.defaultSeo, "site.defaultSeo");

  const appIds = new Set();
  const appSlugs = new Set();
  const appOrders = new Set();
  for (const app of apps) {
    validatePublished(app, `App ${app.slug || "(missing slug)"}`);
    requireString(app.id, "app.id");
    requireString(app.slug, `${app.id}.slug`);
    requireString(app.name, `${app.id}.name`);
    requireString(app.icon, `${app.id}.icon`);
    requireString(app.iconAlt, `${app.id}.iconAlt`);
    assert(Number.isInteger(app.order), `${app.id}.order must be an integer.`);
    validateSeo(app.seo, `App ${app.slug}`);
    assert(!appIds.has(app.id), `Duplicate app id "${app.id}".`);
    assert(!appSlugs.has(app.slug), `Duplicate app slug "${app.slug}".`);
    assert(!appOrders.has(app.order), `Duplicate app order "${app.order}".`);
    appIds.add(app.id);
    appSlugs.add(app.slug);
    appOrders.add(app.order);
    assert(Array.isArray(app.screenshots) && app.screenshots.length > 0, `${app.slug} has no screenshots.`);
    validateImages(app.screenshots, `App ${app.slug} screenshots`);
  }

  const privacySlugs = new Set();
  const privacyOrders = new Set();
  for (const policy of privacyPolicies) {
    validatePublished(policy, `Privacy policy ${policy.slug || "(missing slug)"}`);
    requireString(policy.slug, "privacyPolicy.slug");
    requireString(policy.appName, `${policy.slug}.appName`);
    requireString(policy.htmlContent, `${policy.slug}.htmlContent`);
    assert(Number.isInteger(policy.order), `${policy.slug}.order must be an integer.`);
    validateSeo(policy.seo, `Privacy policy ${policy.slug}`);
    assert(!privacySlugs.has(policy.slug), `Duplicate privacy policy slug "${policy.slug}".`);
    assert(!privacyOrders.has(policy.order), `Duplicate privacy policy order "${policy.order}".`);
    privacySlugs.add(policy.slug);
    privacyOrders.add(policy.order);
  }

  for (const app of apps) {
    if (app.privacySlug) {
      assert(
        privacySlugs.has(app.privacySlug),
        `App ${app.slug} references missing privacy policy ${app.privacySlug}.`
      );
      assert(
        !app.published ||
          privacyPolicies.find((policy) => policy.slug === app.privacySlug)?.published,
        `Published app ${app.slug} references unpublished privacy policy ${app.privacySlug}.`
      );
    }
  }

  for (const group of pages.apps.groups || []) {
    requireString(group.label, "apps group label");
    for (const appId of group.appIds || []) {
      assert(appIds.has(appId), `Apps page group references missing app id "${appId}".`);
      assert(
        apps.find((app) => app.id === appId)?.published,
        `Apps page group references unpublished app id "${appId}".`
      );
    }
  }

  validatePublished(rewire, "Rewire landing");
  validateSeo(rewire.seo, "Rewire landing");
  validateImages(rewire.screenshots, "Rewire screenshots");
  validatePublished(breastfeedingTracker, "Breastfeeding Tracker landing");
  validateSeo(breastfeedingTracker.seo, "Breastfeeding Tracker landing");
  assert(
    apps.find((app) => app.slug === "rewire")?.published,
    "Rewire landing requires the published Rewire app record."
  );
  assert(
    apps.find((app) => app.slug === "breast-feeding-tracker")?.published,
    "Breastfeeding Tracker landing requires the published tracker app record."
  );

  const rewireArticleSlugs = new Set(rewireArticles.posts.map((post) => post.slug));
  const breastfeedingGuideSlugs = new Set(
    breastfeedingGuides.posts.map((guide) => guide.slug)
  );
  for (const guide of rewire.guidePages || []) {
    assert(
      rewireArticleSlugs.has(guide.slug),
      `Rewire landing references missing published article "${guide.slug}".`
    );
  }
  for (const faq of rewire.faqs || []) {
    assert(
      rewireArticleSlugs.has(faq.guideSlug),
      `Rewire FAQ references missing published article "${faq.guideSlug}".`
    );
  }

  const reservedTopLevelSlugs = new Set([
    "404",
    "about",
    "apps",
    "breastfeeding-tracker",
    "index.html",
    "privacy",
    "rewire",
    ...appSlugs,
    ...privacySlugs
  ]);
  const standardSlugs = new Set();
  for (const page of standardPages) {
    validatePublished(page, `Standard page ${page.slug || "(missing slug)"}`);
    assert(
      !reservedTopLevelSlugs.has(page.slug),
      `Standard page slug "${page.slug}" is reserved by an existing route.`
    );
    assert(!standardSlugs.has(page.slug), `Duplicate standard page slug "${page.slug}".`);
    standardSlugs.add(page.slug);
    validateSeo(page.seo, `Standard page ${page.slug}`);
    assert(Array.isArray(page.sections) && page.sections.length > 0, `${page.slug} has no sections.`);
    validateStandardSections(page);
  }

  const routeSet = new Set([
    ...Object.values(pages).map((page) => canonicalRoute(page.route)),
    canonicalRoute(rewire.route),
    canonicalRoute(breastfeedingTracker.route),
    ...apps
      .filter((app) => app.published)
      .map((app) =>
        canonicalRoute(
          app.slug === "breast-feeding-tracker"
            ? breastfeedingTracker.route
            : `/apps/${app.slug}`
        )
      ),
    ...privacyPolicies
      .filter((policy) => policy.published)
      .map((policy) => canonicalRoute(`/privacy/${policy.slug}`)),
    ...rewireArticles.posts.map((post) => canonicalRoute(`/rewire/blog/${post.slug}`)),
    ...breastfeedingGuides.posts.map((guide) =>
      canonicalRoute(`/breastfeeding-tracker/guides/${guide.slug}`)
    ),
    ...standardPages
      .filter((page) => page.published)
      .map((page) => canonicalRoute(`/${page.slug}`))
  ]);

  assert(
    breastfeedingGuideSlugs.size === breastfeedingGuides.posts.length,
    "Breastfeeding guide slugs must be unique."
  );
  assert(
    rewireArticleSlugs.size === rewireArticles.posts.length,
    "Rewire article slugs must be unique."
  );

  for (const item of site.navigation.items) {
    requireString(item.label, "Navigation label");
    assert(
      routeSet.has(canonicalRoute(item.path)),
      `Navigation references missing route "${item.path}".`
    );
  }

  validateContentLinks(content, routeSet);
  validateRichTextLinks(content, routeSet);
  validateContentMedia(content);
}

function validatePublished(record, label) {
  assert(typeof record.published === "boolean", `${label} must include a published boolean.`);
}

function validateSeo(seo, label) {
  assert(seo && typeof seo === "object", `${label} is missing SEO content.`);
  requireString(seo.title, `${label} SEO title`);
  requireString(seo.description, `${label} SEO description`);
  if (seo.ogImage) {
    assertLocalAsset(seo.ogImage, `${label} SEO image`);
  }
}

function validateImages(images, label) {
  assert(Array.isArray(images), `${label} must be a list.`);
  for (const [index, image] of images.entries()) {
    requireString(image.src, `${label}[${index}].src`);
    requireString(image.alt, `${label}[${index}].alt`);
    assertLocalAsset(image.src, `${label}[${index}]`);
  }
}

function validateStandardSections(page) {
  const supportedTypes = new Set([
    "hero",
    "richText",
    "image",
    "gallery",
    "featureList",
    "cta",
    "faq"
  ]);
  for (const [index, section] of page.sections.entries()) {
    const label = `${page.slug}.sections[${index}]`;
    assert(supportedTypes.has(section.type), `${label} has unsupported type "${section.type}".`);
    if (section.type === "hero" || section.type === "cta") {
      requireString(section.heading, `${label}.heading`);
    }
    if (section.type === "richText") {
      requireString(section.body, `${label}.body`);
    }
    if (section.type === "image") {
      validateImages([section], label);
    }
    if (section.type === "gallery") {
      validateImages(section.images, `${label}.images`);
    }
    if (section.type === "featureList") {
      assert(Array.isArray(section.features) && section.features.length > 0, `${label} has no features.`);
      for (const feature of section.features) {
        requireString(feature.title, `${label} feature title`);
        requireString(feature.body, `${label} feature body`);
      }
    }
    if (section.type === "faq") {
      assert(Array.isArray(section.items) && section.items.length > 0, `${label} has no FAQs.`);
      for (const faq of section.items) {
        requireString(faq.question, `${label} FAQ question`);
        requireString(faq.answer, `${label} FAQ answer`);
      }
    }
  }
}

function validateContentLinks(value, routeSet, location = "content") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateContentLinks(item, routeSet, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") {
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    const childLocation = `${location}.${key}`;
    if (key === "url" && typeof child === "string") {
      validateInternalUrl(child, routeSet, childLocation);
    } else {
      validateContentLinks(child, routeSet, childLocation);
    }
  }
}

function validateInternalUrl(url, routeSet, location) {
  if (
    !url ||
    url === "app-store" ||
    url === "terms" ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("#")
  ) {
    return;
  }
  if (isLocalMedia(url)) {
    assertLocalAsset(url, location);
    return;
  }
  assert(url.startsWith("/"), `${location} must be an absolute internal or external URL.`);
  const [path] = url.split(/[?#]/);
  assert(
    routeSet.has(canonicalRoute(path)),
    `${location} links to unpublished or missing route "${url}".`
  );
  assert(
    path === "/" || path.endsWith("/"),
    `${location} must use the trailing-slash canonical form: "${url}".`
  );
}

function validateContentMedia(value, location = "content") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateContentMedia(item, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") {
    return;
  }
  if (typeof value.src === "string" && isLocalMedia(value.src)) {
    requireString(value.alt, `${location}.alt`);
    assertLocalAsset(value.src, location);
  }
  for (const [key, child] of Object.entries(value)) {
    if (typeof child === "string" && child.includes("<img")) {
      validateEmbeddedImages(child, `${location}.${key}`);
    }
    if (
      typeof child === "string" &&
      ["icon", "logo", "ogImage"].includes(key) &&
      isLocalMedia(child)
    ) {
      assertLocalAsset(child, `${location}.${key}`);
    }
    validateContentMedia(child, `${location}.${key}`);
  }
}

function validateRichTextLinks(value, routeSet, location = "content") {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      validateRichTextLinks(item, routeSet, `${location}[${index}]`)
    );
    return;
  }
  if (!value || typeof value !== "object") {
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    const childLocation = `${location}.${key}`;
    if (typeof child === "string" && child.includes("href=")) {
      for (const match of child.matchAll(/href="([^"]+)"/g)) {
        validateInternalUrl(match[1], routeSet, childLocation);
      }
    } else {
      validateRichTextLinks(child, routeSet, childLocation);
    }
  }
}

function validateEmbeddedImages(value, location) {
  for (const match of value.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = match[1];
    const src = attributes.match(/\bsrc="([^"]+)"/i)?.[1];
    const alt = attributes.match(/\balt="([^"]*)"/i)?.[1];
    requireString(src, `${location} embedded image src`);
    requireString(alt, `${location} embedded image alt`);
    if (src.startsWith("/")) {
      assertLocalAsset(src, `${location} embedded image`);
    }
  }
}

function validateMarkdownMedia(source, filename) {
  for (const match of source.matchAll(/!\[([^\]]*)\]\((\/[^)\s]+)\)/g)) {
    requireString(match[1], `${filename} image alt text`);
    assertLocalAsset(match[2], `${filename} image`);
  }
}

function validateImmutableSlug(filename, slug) {
  const filenameSlug = basename(filename, extname(filename));
  requireString(slug, `${filename}.slug`);
  assert(slugPattern.test(slug), `${filename} has invalid slug "${slug}".`);
  assert(
    filenameSlug === slug,
    `${filename} must keep immutable slug "${filenameSlug}", found "${slug}".`
  );
}

function assertLocalAsset(value, label) {
  assert(
    typeof value === "string" && value.startsWith("/"),
    `${label} must use a root-relative asset path.`
  );
  const assetPath = join(rootDir, "public", value.replace(/^\//, ""));
  assert(existsSync(assetPath), `${label} references missing asset "${value}".`);
}

function isLocalMedia(value) {
  return typeof value === "string" && value.startsWith("/") && /\.[a-z0-9]+$/i.test(value);
}

function canonicalRoute(value) {
  assert(typeof value === "string" && value.startsWith("/"), `Invalid route "${value}".`);
  return value === "/" ? "/" : `${value.replace(/\/+$/, "")}/`;
}

function requireString(value, label) {
  assert(typeof value === "string" && value.trim().length > 0, `${label} is required.`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function readJsonDirectory(path) {
  if (!existsSync(path)) {
    return [];
  }
  const filenames = (await readdir(path)).filter((filename) => filename.endsWith(".json")).sort();
  return Promise.all(
    filenames.map(async (filename) => ({
      filename,
      value: await readJson(join(path, filename))
    }))
  );
}

async function generateRating() {
  const fallback = await readJson(ratingFallbackPath);
  let rating = { ...fallback, source: "fallback" };

  try {
    const url = `https://itunes.apple.com/lookup?id=${rewireAppId}&country=${encodeURIComponent(storeCountry)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) {
      throw new Error(`Apple lookup returned ${response.status}`);
    }

    const payload = await response.json();
    const result = payload.results?.[0];
    if (!result) {
      throw new Error("Apple lookup returned no result");
    }

    rating = {
      rating: typeof result.averageUserRating === "number" ? result.averageUserRating : null,
      ratingCount: typeof result.userRatingCount === "number" ? result.userRatingCount : null,
      storeUrl: result.trackViewUrl || fallback.storeUrl,
      source: "apple-lookup",
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.warn(`Using fallback Rewire App Store rating: ${error.message}`);
  }

  await writeJson(join(generatedDir, "rewire-app-store-rating.json"), rating);
}

function parseFrontmatter(source) {
  if (!source.startsWith("---\n")) {
    return { frontmatter: {}, body: source };
  }

  const end = source.indexOf("\n---", 4);
  if (end === -1) {
    throw new Error("Markdown frontmatter is not closed.");
  }

  const rawFrontmatter = source.slice(4, end).trim();
  const body = source.slice(end + 4).trim();
  const frontmatter = {};

  for (const line of rawFrontmatter.split(/\r?\n/)) {
    if (!line.trim()) {
      continue;
    }

    const separator = line.indexOf(":");
    if (separator === -1) {
      throw new Error(`Invalid frontmatter line: ${line}`);
    }

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    frontmatter[key] = stripQuotes(rawValue);
  }

  return { frontmatter, body };
}

function renderMarkdown(source) {
  const blocks = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(`<pre><code${language ? ` class="language-${escapeAttr(language)}"` : ""}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length + 1;
      const content = renderInline(heading[2]);
      const className = content.includes('class="feeding-inline-image"')
        ? ' class="feeding-product-heading"'
        : "";
      blocks.push(`<h${level}${className}>${content}</h${level}>`);
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines = [];
      while (index < lines.length && lines[index].startsWith("> ")) {
        quoteLines.push(lines[index].slice(2));
        index += 1;
      }
      blocks.push(`<blockquote>${quoteLines.map(renderInline).join("<br />")}</blockquote>`);
      continue;
    }

    if (isTableStart(lines, index)) {
      const headers = splitTableRow(lines[index]);
      const rows = [];
      index += 2;
      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }
      blocks.push(renderTable(headers, rows));
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(`<li>${renderInline(lines[index].replace(/^[-*]\s+/, ""))}</li>`);
        index += 1;
      }
      blocks.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(`<li>${renderInline(lines[index].replace(/^\d+\.\s+/, ""))}</li>`);
        index += 1;
      }
      blocks.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    const paragraphLines = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith("```") &&
      !/^(#{1,3})\s+/.test(lines[index]) &&
      !lines[index].startsWith("> ") &&
      !isTableStart(lines, index) &&
      !/^[-*]\s+/.test(lines[index]) &&
      !/^\d+\.\s+/.test(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push(`<p>${renderInline(paragraphLines.join(" "))}</p>`);
  }

  return blocks.join("\n");
}

function isTableStart(lines, index) {
  if (index + 1 >= lines.length || !isTableRow(lines[index])) {
    return false;
  }
  const separatorCells = splitTableRow(lines[index + 1]);
  return separatorCells.length > 0 && separatorCells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function isTableRow(line) {
  return line.trim().includes("|");
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderTable(headers, rows) {
  const headerHtml = headers
    .map((header) => `<th scope="col">${renderInline(header)}</th>`)
    .join("");
  const bodyHtml = rows
    .map((row) => {
      const cells = headers.map((_, index) => `<td>${renderInline(row[index] || "")}</td>`);
      return `<tr>${cells.join("")}</tr>`;
    })
    .join("");
  return `<div class="feeding-table-scroll" tabindex="0" role="region" aria-label="${escapeAttr(markdownTableAriaLabel)}"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}

function extractFaqItems(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const faqHeadingIndex = lines.findIndex((line) => /^#{1,3}\s+FAQs\s*$/i.test(line.trim()));
  if (faqHeadingIndex === -1) {
    return [];
  }

  const sectionLevel = lines[faqHeadingIndex].match(/^#+/)?.[0].length || 1;
  const items = [];
  let currentQuestion = null;
  let answerLines = [];

  const commitItem = () => {
    if (!currentQuestion) {
      return;
    }
    const answer = stripMarkdownFormatting(answerLines.join(" "));
    if (!answer) {
      throw new Error(`FAQ question "${currentQuestion}" has no visible answer.`);
    }
    items.push({ question: currentQuestion, answer });
  };

  for (let index = faqHeadingIndex + 1; index < lines.length; index += 1) {
    const heading = lines[index].match(/^(#{1,3})\s+(.+)$/);
    if (heading && heading[1].length <= sectionLevel) {
      break;
    }
    if (heading) {
      commitItem();
      currentQuestion = stripMarkdownFormatting(heading[2]);
      answerLines = [];
      continue;
    }
    if (currentQuestion && lines[index].trim()) {
      answerLines.push(lines[index].trim());
    }
  }
  commitItem();
  return items;
}

function stripMarkdownFormatting(value) {
  return String(value)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_~`>#]/g, "")
    .replace(/^\s*(?:[-*]|\d+\.)\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function renderInline(value) {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  output = output.replace(
    /!\[([^\]]*)\]\((\/[^)\s]+)\)/g,
    '<img class="feeding-inline-image" src="$2" alt="$1" loading="lazy" width="96" height="96" />'
  );
  output = output.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  output = output.replace(/\[([^\]]+)\]\((\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
  return output;
}

function parseTags(value) {
  if (!value) {
    return [];
  }
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}

function parseBoolean(value) {
  return String(value).toLowerCase() === "true";
}

function compareDatesDescending(a, b) {
  return new Date(b).getTime() - new Date(a).getTime();
}

function compareOrder(a, b) {
  return Number(a.order) - Number(b.order);
}

function stripQuotes(value) {
  return value.replace(/^["']|["']$/g, "");
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

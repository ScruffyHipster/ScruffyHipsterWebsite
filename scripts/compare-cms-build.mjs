import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { publicRoutes } from "./route-meta.mjs";

const [baselineArgument, currentArgument = "dist"] = process.argv.slice(2);

if (!baselineArgument) {
  throw new Error(
    "Usage: node scripts/compare-cms-build.mjs <baseline-dist> [current-dist]"
  );
}

const baselineDir = resolve(baselineArgument);
const currentDir = resolve(currentArgument);
const differences = [];

for (const route of publicRoutes) {
  const baseline = summarize(
    await readFile(routeOutputPath(baselineDir, route.path), "utf8")
  );
  const current = summarize(
    await readFile(routeOutputPath(currentDir, route.path), "utf8")
  );

  for (const key of Object.keys(baseline)) {
    if (JSON.stringify(baseline[key]) !== JSON.stringify(current[key])) {
      differences.push(`${route.path} changed ${key}`);
    }
  }
}

if (differences.length) {
  throw new Error(
    `CMS build parity failed:\n${differences.map((difference) => `- ${difference}`).join("\n")}`
  );
}

console.log(
  `CMS build parity passed for visible copy, headings, metadata, links, canonicals, and structured data across ${publicRoutes.length} routes.`
);

function summarize(html) {
  return {
    visibleCopy: visibleText(html),
    headings: [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map(
      ([, level, value]) => `${level}:${visibleText(value)}`
    ),
    metadata: metadata(html),
    internalLinks: [
      ...new Set(
        [...html.matchAll(/href="(\/[^"]*)"/g)]
          .map((match) => match[1])
          .filter((href) => !href.startsWith("/assets/"))
      )
    ].sort(),
    structuredData: [
      ...html.matchAll(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
      )
    ].map((match) => stableValue(JSON.parse(match[1])))
  };
}

function metadata(html) {
  const values = {
    title: matchValue(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    canonical: matchValue(
      html,
      /<link[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/i
    )
  };
  for (const name of [
    "description",
    "robots",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
    "twitter:image:alt"
  ]) {
    values[name] = matchValue(
      html,
      new RegExp(`<meta[^>]*name="${escapeRegExp(name)}"[^>]*content="([^"]*)"[^>]*>`, "i")
    );
  }
  for (const property of [
    "og:type",
    "og:title",
    "og:description",
    "og:url",
    "og:image",
    "og:image:alt"
  ]) {
    values[property] = matchValue(
      html,
      new RegExp(
        `<meta[^>]*property="${escapeRegExp(property)}"[^>]*content="([^"]*)"[^>]*>`,
        "i"
      )
    );
  }
  return values;
}

function visibleText(value) {
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ");
}

function stableValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableValue(value[key])])
    );
  }
  return value;
}

function matchValue(value, pattern) {
  return value.match(pattern)?.[1] || null;
}

function routeOutputPath(root, path) {
  return path === "/"
    ? join(root, "index.html")
    : join(root, path.replace(/^\//, ""), "index.html");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

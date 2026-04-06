import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { legacyRedirects, siteUrl } from "./route-meta.mjs";
import { prerenderRoutes } from "./prerender.mjs";
import { generateSitemap } from "./generate-sitemap.mjs";

const distDir = new URL("../dist/", import.meta.url).pathname;

await prerenderRoutes(distDir);
await generateSitemap(distDir);
await generateLegacyRedirects(distDir);
await writeFile(join(distDir, ".nojekyll"), "", "utf8");

async function generateLegacyRedirects(rootDir) {
  for (const [from, to] of legacyRedirects) {
    const filePath = join(rootDir, from.replace(/^\//, ""));
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, redirectHtml(`${siteUrl}${to}`, to), "utf8");
  }
}

function redirectHtml(absoluteTarget, relativeTarget) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redirecting…</title>
    <meta name="robots" content="noindex,follow" />
    <meta http-equiv="refresh" content="0; url=${absoluteTarget}" />
    <link rel="canonical" href="${absoluteTarget}" />
    <script>location.replace(${JSON.stringify(absoluteTarget)});</script>
  </head>
  <body>
    <p>Redirecting to <a href="${relativeTarget}">${relativeTarget}</a>…</p>
  </body>
</html>
`;
}

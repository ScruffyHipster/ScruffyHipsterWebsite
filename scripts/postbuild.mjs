import { mkdir, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { legacyRedirects, siteUrl } from "./route-meta.mjs";
import { prerenderRoutes } from "./prerender.mjs";
import { generateSitemap } from "./generate-sitemap.mjs";

const distDir = new URL("../dist/", import.meta.url).pathname;
const serverEntryPath = new URL("../.ssr-dist/entry-server.js", import.meta.url).pathname;
const { render } = await import(pathToFileURL(serverEntryPath).href);

await prerenderRoutes(distDir, render);
await generateSitemap(distDir);
await generateLegacyRedirects(distDir);
await writeFile(join(distDir, ".nojekyll"), "", "utf8");

async function generateLegacyRedirects(rootDir) {
  for (const [from, to] of legacyRedirects) {
    const relativePath = from.replace(/^\//, "");
    const filePath = extname(relativePath)
      ? join(rootDir, relativePath)
      : join(rootDir, relativePath, "index.html");
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

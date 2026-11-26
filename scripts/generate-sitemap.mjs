import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { publicRoutes, siteUrl } from "./route-meta.mjs";

export async function generateSitemap(distDir) {
  const urls = publicRoutes
    .filter(isIndexableRoute)
    .map((route) => {
      const loc = canonicalUrl(route.path);
      const images = [...new Set(route.images || [])]
        .map((image) => `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`)
        .join("");
      const lastmod = routeLastModified(route);
      const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
      return `<url><loc>${escapeXml(loc)}</loc>${lastmodTag}${images}</url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}</urlset>
`;

  const sitemapPath = join(distDir, "sitemap.xml");
  await mkdir(dirname(sitemapPath), { recursive: true });
  await writeFile(sitemapPath, sitemap, "utf8");

  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  await writeFile(join(distDir, "robots.txt"), robots, "utf8");
}

export function isIndexableRoute(route) {
  const directives = (route.robots || "").toLowerCase().split(/[\s,]+/);
  return !directives.some((directive) => directive === "noindex" || directive === "none");
}

// Articles carry their published and updated dates in JSON-LD; other routes have no
// reliable date, so they are listed without one rather than with a guessed date.
function routeLastModified(route) {
  for (const entry of [route.jsonLd ?? []].flat()) {
    const date = entry?.dateModified || entry?.datePublished;
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)) {
      return date.slice(0, 10);
    }
  }
  return undefined;
}

function canonicalUrl(path) {
  const canonicalPath = path === "/" ? "" : `${path.replace(/\/+$/, "")}/`;
  return `${siteUrl}${canonicalPath}`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

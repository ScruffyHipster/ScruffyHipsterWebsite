import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { publicRoutes, siteUrl } from "./route-meta.mjs";

export async function generateSitemap(distDir) {
  const urls = publicRoutes
    .map((route) => {
      const loc = canonicalUrl(route.path);
      return `<url><loc>${escapeXml(loc)}</loc></url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>
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

function canonicalUrl(path) {
  return `${siteUrl}${path === "/" ? "" : path}`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

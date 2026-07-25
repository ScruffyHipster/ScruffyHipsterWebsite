import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { publicRoutes, siteUrl } from "./route-meta.mjs";

export async function prerenderRoutes(distDir, render) {
  const baseHtmlPath = join(distDir, "index.html");
  const baseHtml = await readFile(baseHtmlPath, "utf8");

  for (const route of publicRoutes) {
    const renderedApp = render(route.path);
    const renderedHtml = injectRenderedApp(baseHtml, renderedApp);

    if (route.path === "/") {
      const updated = injectRouteMeta(renderedHtml, route);
      await writeFile(baseHtmlPath, updated, "utf8");
      continue;
    }

    const outputPath = join(distDir, route.path.replace(/^\//, ""), "index.html");
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, injectRouteMeta(renderedHtml, route), "utf8");
  }

  // GitHub Pages SPA fallback for unknown paths with explicit noindex.
  const notFoundHtml = injectRouteMeta(injectRenderedApp(baseHtml, render("/404")), {
    path: "/404",
    title: "Page Not Found | Scruffyhipster",
    description: "The page you were looking for could not be found on Scruffyhipster.",
    ogImage: "/og-default.png",
    robots: "noindex,follow"
  });
  await writeFile(join(distDir, "404.html"), notFoundHtml, "utf8");
}

function injectRouteMeta(html, route) {
  const canonical = canonicalUrl(route.path);
  const image = route.ogImage?.startsWith("http") ? route.ogImage : `${siteUrl}${route.ogImage || "/og-default.png"}`;
  const robots = route.robots || "index,follow";
  const jsonLdEntries = Array.isArray(route.jsonLd)
    ? route.jsonLd
    : [
        route.jsonLd || {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: route.title,
          url: canonical,
          description: route.description
        }
      ];
  const jsonLd = jsonLdEntries
    .map(
      (entry, index) =>
        `<script${index === 0 ? ' id="route-jsonld"' : ""} type="application/ld+json" data-rh="true">${JSON.stringify(entry)}</script>`
    )
    .join("");

  return html
    .replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title data-rh="true">${escapeHtml(route.title)}</title>`
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${escapeAttr(canonical)}" data-rh="true" />`
    )
    .replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, "")
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeAttr(route.description)}" data-rh="true" />\n    <meta name="robots" content="${escapeAttr(robots)}" data-rh="true" />`
    )
    .replace(/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, '<meta property="og:type" content="website" data-rh="true" />')
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeAttr(route.title)}" data-rh="true" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeAttr(route.description)}" data-rh="true" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${escapeAttr(canonical)}" data-rh="true" />`)
    .replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${escapeAttr(image)}" data-rh="true" />`)
    .replace(/<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/?>/i, '<meta name="twitter:card" content="summary_large_image" data-rh="true" />')
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeAttr(route.title)}" data-rh="true" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeAttr(route.description)}" data-rh="true" />`)
    .replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${escapeAttr(image)}" data-rh="true" />`)
    .replace(
      /<script id="route-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/i,
      jsonLd
    );
}

function injectRenderedApp(html, renderedApp) {
  return html.replace('<div id="root"></div>', `<div id="root">${renderedApp}</div>`);
}

function canonicalUrl(path) {
  const canonicalPath = path === "/" ? "" : `${path.replace(/\/+$/, "")}/`;
  return `${siteUrl}${canonicalPath}`;
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

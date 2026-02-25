import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { publicRoutes, siteUrl } from "./route-meta.mjs";

export async function prerenderRoutes(distDir) {
  const baseHtmlPath = join(distDir, "index.html");
  const baseHtml = await readFile(baseHtmlPath, "utf8");

  for (const route of publicRoutes) {
    if (route.path === "/") {
      const updated = injectRouteMeta(baseHtml, route);
      await writeFile(baseHtmlPath, updated, "utf8");
      continue;
    }

    const outputPath = join(distDir, route.path.replace(/^\//, ""), "index.html");
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, injectRouteMeta(baseHtml, route), "utf8");
  }

  // GitHub Pages SPA fallback for unknown paths.
  await copyFile(baseHtmlPath, join(distDir, "404.html"));
}

function injectRouteMeta(html, route) {
  const canonical = `${siteUrl}${route.path === "/" ? "/" : route.path}`;
  const image = route.ogImage?.startsWith("http") ? route.ogImage : `${siteUrl}${route.ogImage || "/og-default.svg"}`;
  const jsonLd = JSON.stringify(
    route.jsonLd || {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: route.title,
      url: canonical,
      description: route.description
    }
  );

  const noscriptSummary = `<noscript><main style="font-family:Arial,sans-serif;max-width:760px;margin:2rem auto;padding:0 1rem;"><h1>${escapeHtml(
    route.title
  )}</h1><p>${escapeHtml(route.description)}</p><p><a href="${canonical}">${escapeHtml(
    canonical
  )}</a></p></main></noscript>`;

  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeAttr(route.description)}" />`
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${escapeAttr(canonical)}" />`
    )
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeAttr(route.title)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeAttr(route.description)}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${escapeAttr(canonical)}" />`)
    .replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${escapeAttr(image)}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`)
    .replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${escapeAttr(image)}" />`)
    .replace(
      /<script id="route-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script id="route-jsonld" type="application/ld+json">${jsonLd}</script>`
    )
    .replace(/<body>/i, `<body>\n    ${noscriptSummary}`);
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


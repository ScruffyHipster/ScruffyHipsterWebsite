import { mkdir, readFile, writeFile } from "node:fs/promises";
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

  // GitHub Pages SPA fallback for unknown paths with explicit noindex.
  const notFoundHtml = injectRouteMeta(baseHtml, {
    path: "/404",
    title: "Page Not Found | Scruffy Hipster",
    description: "The page you were looking for could not be found on Scruffy Hipster.",
    ogImage: "/og-default.svg",
    robots: "noindex,follow"
  });
  await writeFile(join(distDir, "404.html"), notFoundHtml, "utf8");
}

function injectRouteMeta(html, route) {
  const canonical = canonicalUrl(route.path);
  const image = route.ogImage?.startsWith("http") ? route.ogImage : `${siteUrl}${route.ogImage || "/og-default.svg"}`;
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
    .map((entry, index) => `<script${index === 0 ? ' id="route-jsonld"' : ""} type="application/ld+json">${JSON.stringify(entry)}</script>`)
    .join("");

  const noscriptSummary = `<noscript><main style="font-family:Arial,sans-serif;max-width:760px;margin:2rem auto;padding:0 1rem;"><h1>${escapeHtml(
    route.title
  )}</h1><p>${escapeHtml(route.description)}</p><p><a href="${canonical}">${escapeHtml(
    canonical
  )}</a></p></main></noscript>`;

  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`)
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${escapeAttr(canonical)}" />`
    )
    .replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, "")
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeAttr(route.description)}" />\n    <meta name="robots" content="${escapeAttr(robots)}" />`
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
      jsonLd
    )
    .replace(/<body>/i, `<body>\n    ${noscriptSummary}`);
}

function canonicalUrl(path) {
  return `${siteUrl}${path === "/" ? "" : path}`;
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

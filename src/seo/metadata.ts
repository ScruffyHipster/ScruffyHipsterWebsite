import { siteConfig } from "../content/site";
import type { SeoMeta } from "../content/types";

export type ResolvedMeta = {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl: string;
  keywords?: string;
  robots: string;
};

export const getSiteUrl = () =>
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || siteConfig.domain;

export const resolveMeta = (meta: SeoMeta, path: string): ResolvedMeta => {
  const siteUrl = getSiteUrl();
  const imagePath = meta.ogImage || siteConfig.defaultOgImage;
  const imageUrl = imagePath.startsWith("http") ? imagePath : `${siteUrl}${imagePath}`;
  return {
    title: meta.title,
    description: meta.description,
    canonicalUrl: canonicalUrl(path, siteUrl),
    imageUrl,
    keywords: meta.keywords?.join(", "),
    robots: meta.robots || "index,follow"
  };
};

function canonicalUrl(path: string, siteUrl: string) {
  return `${siteUrl}${path === "/" ? "" : path}`;
}

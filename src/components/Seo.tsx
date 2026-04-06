import { Helmet } from "react-helmet-async";
import type { PropsWithChildren } from "react";
import type { SeoMeta } from "../content/types";
import { resolveMeta } from "../seo/metadata";
import { stringifyJsonLd } from "../seo/jsonld";

type SeoProps = PropsWithChildren<{
  meta: SeoMeta;
  path: string;
  jsonLd?: object | object[];
}>;

export function Seo({ meta, path, jsonLd }: SeoProps) {
  const resolved = resolveMeta(meta, path);
  const jsonLdValue = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{resolved.title}</title>
      <meta name="description" content={resolved.description} />
      <meta name="robots" content={resolved.robots} />
      {resolved.keywords ? <meta name="keywords" content={resolved.keywords} /> : null}
      <link rel="canonical" href={resolved.canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={resolved.title} />
      <meta property="og:description" content={resolved.description} />
      <meta property="og:url" content={resolved.canonicalUrl} />
      <meta property="og:image" content={resolved.imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolved.title} />
      <meta name="twitter:description" content={resolved.description} />
      <meta name="twitter:image" content={resolved.imageUrl} />
      {jsonLdValue.map((entry, index) => (
        <script key={index} type="application/ld+json">
          {stringifyJsonLd(entry)}
        </script>
      ))}
    </Helmet>
  );
}

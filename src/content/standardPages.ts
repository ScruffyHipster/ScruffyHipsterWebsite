import cmsContent from "../generated/cms-content.json";
import type { SeoMeta } from "./types";

export type StandardPageSection =
  | {
      type: "hero";
      eyebrow?: string;
      heading: string;
      body?: string;
      links?: Array<{ label: string; url: string; style?: "primary" | "secondary" }>;
    }
  | { type: "richText"; heading?: string; body: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | {
      type: "gallery";
      heading?: string;
      images: Array<{ src: string; alt: string; caption?: string }>;
    }
  | {
      type: "featureList";
      eyebrow?: string;
      heading?: string;
      body?: string;
      features: Array<{ title: string; body: string }>;
    }
  | {
      type: "cta";
      eyebrow?: string;
      heading: string;
      body?: string;
      links?: Array<{ label: string; url: string; style?: "primary" | "secondary" }>;
    }
  | {
      type: "faq";
      eyebrow?: string;
      heading?: string;
      items: Array<{ question: string; answer: string }>;
    };

export type StandardPage = {
  slug: string;
  published: boolean;
  title: string;
  seo: SeoMeta;
  sections: StandardPageSection[];
};

export const standardPages = cmsContent.standardPages as StandardPage[];
export const standardPagesBySlug = new Map(
  standardPages.map((page) => [page.slug, page])
);

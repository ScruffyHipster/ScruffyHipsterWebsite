import cmsContent from "../generated/cms-content.json";
import { appsBySlug } from "./apps";

export const breastfeedingTrackerApp = appsBySlug.get("breast-feeding-tracker")!;
export const breastfeedingTrackerContent = cmsContent.breastfeedingTracker;
export const breastfeedingTrackerAppStoreUrl = breastfeedingTrackerContent.appStoreUrl;
export const breastfeedingTrackerOgImage = breastfeedingTrackerContent.ogImage;

export type BreastfeedingTrackerGuide = {
  slug: string;
  title: string;
  metaTitle: string | null;
  description: string;
  publishedAt: string;
  updatedAt: string | null;
  excerpt: string;
  tags: string[];
  published: boolean;
  draft: boolean;
  ogImage: string;
  ogImageAlt: string | null;
  faqItems: Array<{ question: string; answer: string }>;
  showDefaultCta: boolean;
  html: string;
};

export const breastfeedingTrackerGuides =
  cmsContent.breastfeedingGuides as BreastfeedingTrackerGuide[];
export const breastfeedingTrackerGuidesBySlug = new Map(
  breastfeedingTrackerGuides.map((guide) => [guide.slug, guide])
);
export const breastfeedingTrackerFaqs = breastfeedingTrackerContent.faqs;
export const breastfeedingTrackerKeywords = breastfeedingTrackerContent.seo.keywords;

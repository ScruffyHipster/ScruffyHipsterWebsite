import cmsContent from "../generated/cms-content.json";
import { appsBySlug } from "./apps";

export const breastfeedingTrackerApp = appsBySlug.get("breast-feeding-tracker")!;
export const breastfeedingTrackerContent = cmsContent.breastfeedingTracker;
export const breastfeedingTrackerAppStoreUrl = breastfeedingTrackerContent.appStoreUrl;
export const breastfeedingTrackerArticleAppStoreUrl =
  breastfeedingTrackerContent.articleAppStoreUrl;
export const breastfeedingTrackerOgImage = breastfeedingTrackerContent.ogImage;

export type BreastfeedingTrackerArticle = {
  slug: string;
  title: string;
  metaTitle: string | null;
  description: string;
  publishedAt: string;
  updatedAt: string | null;
  excerpt: string;
  tags: string[];
  category: string | null;
  readingMinutes: number;
  tableOfContents: Array<{ level: number; label: string; id: string }>;
  published: boolean;
  draft: boolean;
  ogImage: string;
  ogImageAlt: string | null;
  faqItems: Array<{ question: string; answer: string }>;
  showDefaultCta: boolean;
  html: string;
};

export const breastfeedingTrackerGuides =
  cmsContent.breastfeedingGuides as BreastfeedingTrackerArticle[];
export const breastfeedingTrackerGuidesBySlug = new Map(
  breastfeedingTrackerGuides.map((guide) => [guide.slug, guide])
);
export const breastfeedingTrackerBlogPosts =
  cmsContent.breastfeedingBlogPosts as BreastfeedingTrackerArticle[];
export const breastfeedingTrackerBlogPostsBySlug = new Map(
  breastfeedingTrackerBlogPosts.map((post) => [post.slug, post])
);
export const breastfeedingTrackerBlogCategories = [
  ...new Set(breastfeedingTrackerBlogPosts.map((post) => post.category).filter(Boolean))
] as string[];
export const formatBreastfeedingArticleDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00Z`));
export const breastfeedingTrackerFaqs = breastfeedingTrackerContent.faqs;
export const breastfeedingTrackerKeywords = breastfeedingTrackerContent.seo.keywords;

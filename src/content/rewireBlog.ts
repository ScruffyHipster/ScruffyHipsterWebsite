import cmsContent from "../generated/cms-content.json";

export type RewireBlogPost = {
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
  html: string;
};

export const rewireBlogPosts = cmsContent.rewireArticles as RewireBlogPost[];
export const rewireBlogPostsBySlug = new Map(
  rewireBlogPosts.map((post) => [post.slug, post])
);

export function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

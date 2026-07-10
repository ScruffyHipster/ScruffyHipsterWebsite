import generatedBlog from "../generated/rewire-blog.json";

export type RewireBlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string | null;
  excerpt: string;
  tags: string[];
  draft: boolean;
  ogImage: string;
  html: string;
};

export const rewireBlogPosts = generatedBlog.posts as RewireBlogPost[];
export const rewireBlogPostsBySlug = new Map(rewireBlogPosts.map((post) => [post.slug, post]));

export function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

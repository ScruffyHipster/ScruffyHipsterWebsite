import { Link, Navigate, useParams } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { formatPostDate, rewireBlogPostsBySlug } from "../content/rewireBlog";
import { rewireBlogPageContent } from "../content/pages";
import { siteConfig } from "../content/site";

export function RewireBlogPostPage() {
  const params = useParams<{ slug: string }>();
  const post = params.slug ? rewireBlogPostsBySlug.get(params.slug) : undefined;

  if (!post) {
    return <Navigate to={canonicalPath("/rewire/blog")} replace />;
  }

  const path = `/rewire/blog/${post.slug}`;
  const labels = siteConfig.shared.rewireArticle;

  return (
    <>
      <Seo
        path={path}
        meta={{
          title: `${post.title} | ${labels.titleSuffix}`,
          description: post.description,
          keywords: post.tags,
          ogImage: post.ogImage
        }}
        jsonLd={[
          organizationJsonLd(),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
            image: `${getSiteUrl()}${post.ogImage}`,
            url: canonicalUrl(path, getSiteUrl())
          },
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: getSiteUrl() },
            {
              name: rewireBlogPageContent.breadcrumbs.rewire,
              url: canonicalUrl("/rewire", getSiteUrl())
            },
            {
              name: rewireBlogPageContent.breadcrumbs.blog,
              url: canonicalUrl("/rewire/blog", getSiteUrl())
            },
            { name: post.title, url: canonicalUrl(path, getSiteUrl()) }
          ])
        ]}
      />

      <article className="section-block rewire-article">
        <div className="narrow-container">
          <Reveal>
            <Link className="rewire-text-link" to={canonicalPath("/rewire/blog")}>
              {labels.backLabel}
            </Link>
            <p className="eyebrow">{formatPostDate(post.publishedAt)}</p>
            <h1>{post.title}</h1>
            <p className="lead">{post.description}</p>
          </Reveal>
          <Reveal delayMs={80}>
            <div className="rewire-article-body" dangerouslySetInnerHTML={{ __html: post.html }} />
          </Reveal>
        </div>
      </article>
    </>
  );
}

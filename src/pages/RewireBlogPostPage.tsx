import { Link, Navigate, useParams } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { formatPostDate, rewireBlogPostsBySlug } from "../content/rewireBlog";

export function RewireBlogPostPage() {
  const params = useParams<{ slug: string }>();
  const post = params.slug ? rewireBlogPostsBySlug.get(params.slug) : undefined;

  if (!post) {
    return <Navigate to="/rewire/blog" replace />;
  }

  const path = `/rewire/blog/${post.slug}`;

  return (
    <>
      <Seo
        path={path}
        meta={{
          title: `${post.title} | Rewire Blog`,
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
            url: `${getSiteUrl()}${path}`
          },
          breadcrumbJsonLd([
            { name: "Scruffyhipster", url: getSiteUrl() },
            { name: "Rewire", url: `${getSiteUrl()}/rewire` },
            { name: "Blog", url: `${getSiteUrl()}/rewire/blog` },
            { name: post.title, url: `${getSiteUrl()}${path}` }
          ])
        ]}
      />

      <article className="section-block rewire-article">
        <div className="narrow-container">
          <Reveal>
            <Link className="rewire-text-link" to="/rewire/blog">
              back to rewire blog
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

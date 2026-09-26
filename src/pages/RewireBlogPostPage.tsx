const decoration = { arrow: "↗", down: "↓", check: "✓", plus: "+" };
import { Link, Navigate, useParams } from "react-router-dom";
import { rewireContent, rewireAppStoreFacts } from "../content/rewire";
import { Seo } from "../components/Seo";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import {
  formatPostDate,
  rewireBlogPostsBySlug,
  rewireBlogPosts,
} from "../content/rewireBlog";
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
  const c = rewireContent.editorial.blog;
  const related = rewireBlogPosts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <Seo
        path={path}
        meta={{
          title: post.metaTitle || `${post.title} | ${labels.titleSuffix}`,
          description: post.description,
          keywords: post.tags,
          ogImage: post.ogImage,
          ogImageAlt: post.ogImageAlt || undefined,
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
            url: canonicalUrl(path, getSiteUrl()),
            author: {
              "@type": "Organization",
              name: siteConfig.companyName,
              url: getSiteUrl(),
            },
            publisher: {
              "@type": "Organization",
              name: siteConfig.companyName,
              url: getSiteUrl(),
            },
            mainEntityOfPage: canonicalUrl(path, getSiteUrl()),
          },
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: getSiteUrl() },
            {
              name: rewireBlogPageContent.breadcrumbs.rewire,
              url: canonicalUrl("/rewire", getSiteUrl()),
            },
            {
              name: rewireBlogPageContent.breadcrumbs.blog,
              url: canonicalUrl("/rewire/blog", getSiteUrl()),
            },
            { name: post.title, url: canonicalUrl(path, getSiteUrl()) },
          ]),
        ]}
      />

      <article className="rw-container rw-article">
        <header className="rw-article-header">
          <Link className="rw-text-link" to="/rewire/blog/">
            {labels.backLabel}
          </Link>
          <p className="rw-eyebrow">
            {rewireContent.editorial.journal.eyebrow}
          </p>
          <h1>{post.title}</h1>
          <p className="rw-lead">{post.description}</p>
          <p className="rw-byline">{c.byline}</p>
          <p className="rw-article-date">
            <time dateTime={post.updatedAt || post.publishedAt}>
              {post.updatedAt ? c.updated : null}{" "}
              {formatPostDate(post.updatedAt || post.publishedAt)}
            </time>
            <span>
              {post.readingMinutes} {c.minutes}
            </span>
          </p>
        </header>
        <div className="rw-article-layout">
          <aside className="rw-toc">
            <nav aria-label={c.contents}>
              <p className="rw-eyebrow">{c.contents}</p>
              {post.tableOfContents.map((item) => (
                <a key={item.id} href={`#${item.id}`}>
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
          <div>
            <div
              className="rw-article-body"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
            <div className="rw-article-cta">
              <h2>{c.ctaTitle}</h2>
              <p>{c.ctaBody}</p>
              <a className="rw-button" href={rewireAppStoreFacts.appStoreUrl}>
                {rewireContent.hero.primaryCta}
                <span aria-hidden="true">{decoration.arrow}</span>
              </a>
            </div>
          </div>
        </div>
      </article>
      <section className="rw-container rw-related">
        <h2>{c.related}</h2>
        <div className="rw-guide-links">
          {related.map((item) => (
            <Link
              key={item.slug}
              to={canonicalPath(`/rewire/blog/${item.slug}`)}
            >
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              <span aria-hidden="true">{decoration.arrow}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

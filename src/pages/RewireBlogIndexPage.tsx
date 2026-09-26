const decoration = { arrow: "↗", down: "↓", check: "✓", plus: "+" };
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { RewireComparisonFeature } from "../components/RewireComparisonFeature";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { formatPostDate, rewireBlogPosts } from "../content/rewireBlog";
import { rewireBlogPageContent } from "../content/pages";
import { rewireContent } from "../content/rewire";
import { siteConfig } from "../content/site";
const c = rewireContent.editorial;
export function RewireBlogIndexPage() {
  return (
    <>
      <Seo
        path={rewireBlogPageContent.route}
        meta={rewireBlogPageContent.seo}
        jsonLd={[
          organizationJsonLd(),
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: getSiteUrl() },
            {
              name: rewireBlogPageContent.breadcrumbs.rewire,
              url: canonicalUrl("/rewire", getSiteUrl()),
            },
            {
              name: rewireBlogPageContent.breadcrumbs.blog,
              url: canonicalUrl(rewireBlogPageContent.route, getSiteUrl()),
            },
          ]),
        ]}
      />

      <section className="rw-container rw-blog-hero">
        <p className="rw-eyebrow">{rewireBlogPageContent.hero.eyebrow}</p>
        <h1>{rewireBlogPageContent.hero.heading}</h1>
        <p className="rw-lead">{rewireBlogPageContent.hero.body}</p>
      </section>
      <section className="rw-container rw-blog-feed">
        <RewireComparisonFeature />
        <h2 className="rw-feed-title">{c.blog.all}</h2>
        <div className="rw-post-grid">
          {rewireBlogPosts
            .filter((post) => post.slug !== c.journal.slug)
            .map((post, index) => (
              <Link
                key={post.slug}
                className="rw-post-card"
                to={canonicalPath(`/rewire/blog/${post.slug}`)}
              >
                <div className="rw-post-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <time dateTime={post.publishedAt}>
                    {formatPostDate(post.publishedAt)}
                  </time>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="rw-text-link">
                  {c.blog.read}
                  <span aria-hidden="true">{decoration.arrow}</span>
                </span>
              </Link>
            ))}
        </div>
        <p className="rw-editorial-note">{c.blog.disclosure}</p>
      </section>
    </>
  );
}

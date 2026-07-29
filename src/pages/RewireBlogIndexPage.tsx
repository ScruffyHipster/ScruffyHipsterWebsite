import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { formatPostDate, rewireBlogPosts } from "../content/rewireBlog";
import { rewireBlogPageContent } from "../content/pages";
import { siteConfig } from "../content/site";

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
              url: canonicalUrl("/rewire", getSiteUrl())
            },
            {
              name: rewireBlogPageContent.breadcrumbs.blog,
              url: canonicalUrl(rewireBlogPageContent.route, getSiteUrl())
            }
          ])
        ]}
      />

      <section className="section-block page-hero rewire-blog-hero">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">{rewireBlogPageContent.hero.eyebrow}</p>
            <h1>{rewireBlogPageContent.hero.heading}</h1>
            <p>{rewireBlogPageContent.hero.body}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-block section-pad">
        <div className="container">
          {rewireBlogPosts.length ? (
            <div className="rewire-post-list rewire-post-list-large">
              {rewireBlogPosts.map((post) => (
                <Reveal key={post.slug}>
                  <Link
                    className="rewire-post-row"
                    to={canonicalPath(`/rewire/blog/${post.slug}`)}
                  >
                    <span>{formatPostDate(post.publishedAt)}</span>
                    <strong>{post.title}</strong>
                    <small>{post.excerpt}</small>
                    {post.tags.length ? <em>{post.tags.join(" / ")}</em> : null}
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="lead">{rewireBlogPageContent.emptyLabel}</p>
          )}
        </div>
      </section>
    </>
  );
}

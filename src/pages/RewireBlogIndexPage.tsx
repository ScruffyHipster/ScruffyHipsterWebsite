import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { formatPostDate, rewireBlogPosts } from "../content/rewireBlog";

export function RewireBlogIndexPage() {
  return (
    <>
      <Seo
        path="/rewire/blog"
        meta={{
          title: "Rewire Blog | Scruffyhipster",
          description:
            "Notes from Rewire about focus, app blocking, intentional friction, Screen Time, and building calmer phone habits.",
          keywords: ["Rewire blog", "focus blog", "app blocker", "screen time", "intentional phone use"],
          ogImage: "/assets/rewire/app-store/rewire-icon.jpg"
        }}
        jsonLd={[
          organizationJsonLd(),
          breadcrumbJsonLd([
            { name: "Scruffyhipster", url: getSiteUrl() },
            { name: "Rewire", url: `${getSiteUrl()}/rewire` },
            { name: "Blog", url: `${getSiteUrl()}/rewire/blog` }
          ])
        ]}
      />

      <section className="section-block page-hero rewire-blog-hero">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">rewire blog</p>
            <h1>notes on focus, friction, and using your phone with intention.</h1>
            <p>
              Product notes, practical writing, and the thinking behind Rewire.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-block section-pad">
        <div className="container">
          {rewireBlogPosts.length ? (
            <div className="rewire-post-list rewire-post-list-large">
              {rewireBlogPosts.map((post) => (
                <Reveal key={post.slug}>
                  <Link className="rewire-post-row" to={`/rewire/blog/${post.slug}`}>
                    <span>{formatPostDate(post.publishedAt)}</span>
                    <strong>{post.title}</strong>
                    <small>{post.excerpt}</small>
                    {post.tags.length ? <em>{post.tags.join(" / ")}</em> : null}
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="lead">No posts published yet.</p>
          )}
        </div>
      </section>
    </>
  );
}

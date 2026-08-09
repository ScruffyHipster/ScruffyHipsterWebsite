import { useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import {
  breastfeedingTrackerBlogCategories,
  breastfeedingTrackerBlogPosts,
  formatBreastfeedingArticleDate
} from "../content/breastfeedingTracker";
import {
  BREASTFEEDING_TRACKER_BASE_PATH,
  BREASTFEEDING_TRACKER_BLOG_BASE_PATH,
  BREASTFEEDING_TRACKER_BLOG_DISCLOSURE_PATH
} from "../content/routes";
import { breastfeedingBlogPageContent } from "../content/pages";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { getSiteUrl } from "../seo/metadata";
import { siteConfig } from "../content/site";

export function BreastfeedingTrackerBlogPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const posts = activeCategory
    ? breastfeedingTrackerBlogPosts.filter((post) => post.category === activeCategory)
    : breastfeedingTrackerBlogPosts;
  const siteUrl = getSiteUrl();

  return (
    <>
      <Seo
        path={breastfeedingBlogPageContent.route}
        meta={breastfeedingBlogPageContent.seo}
        jsonLd={[
          organizationJsonLd(),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: breastfeedingBlogPageContent.collection.name,
            description: breastfeedingBlogPageContent.collection.description,
            url: canonicalUrl(BREASTFEEDING_TRACKER_BLOG_BASE_PATH, siteUrl),
            hasPart: breastfeedingTrackerBlogPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: canonicalUrl(`${BREASTFEEDING_TRACKER_BLOG_BASE_PATH}/${post.slug}`, siteUrl)
            }))
          },
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: siteUrl },
            {
              name: breastfeedingBlogPageContent.breadcrumbs.tracker,
              url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl)
            },
            {
              name: breastfeedingBlogPageContent.breadcrumbs.blog,
              url: canonicalUrl(BREASTFEEDING_TRACKER_BLOG_BASE_PATH, siteUrl)
            }
          ])
        ]}
      />

      <section className="feeding-resource-hero feeding-blog-hero">
        <div className="container">
          <Reveal>
            <Link className="feeding-text-link" to={canonicalPath(BREASTFEEDING_TRACKER_BASE_PATH)}>
              {breastfeedingBlogPageContent.hero.backLabel}
            </Link>
            <p className="eyebrow">{breastfeedingBlogPageContent.hero.eyebrow}</p>
            <h1>{breastfeedingBlogPageContent.hero.heading}</h1>
            <p className="lead">{breastfeedingBlogPageContent.hero.body}</p>
            <p className="feeding-blog-disclosure-note">
              {breastfeedingBlogPageContent.disclosurePrefix} {" "}
              <Link to={canonicalPath(BREASTFEEDING_TRACKER_BLOG_DISCLOSURE_PATH)}>
                {breastfeedingBlogPageContent.disclosureLabel}
              </Link>
              .
            </p>
            <div
              className="feeding-blog-filters"
              aria-label={breastfeedingBlogPageContent.filterAriaLabel}
            >
              <button
                type="button"
                className={!activeCategory ? "is-active" : undefined}
                aria-pressed={!activeCategory}
                onClick={() => setActiveCategory(null)}
              >
                {breastfeedingBlogPageContent.allFilterLabel}
                <span>{breastfeedingTrackerBlogPosts.length}</span>
              </button>
              {breastfeedingTrackerBlogCategories.map((category) => {
                const count = breastfeedingTrackerBlogPosts.filter(
                  (post) => post.category === category
                ).length;
                return (
                  <button
                    key={category}
                    type="button"
                    className={activeCategory === category ? "is-active" : undefined}
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="feeding-section feeding-blog-list-section">
        <div className="container">
          <Reveal className="feeding-section-heading">
            <h2>{breastfeedingBlogPageContent.recentHeading}</h2>
          </Reveal>
          <div className="feeding-blog-list" aria-live="polite">
            {posts.map((post, index) => (
              <Reveal key={post.slug}>
                <Link
                  className={`feeding-blog-card${index === 0 ? " feeding-blog-card-featured" : ""}`}
                  to={canonicalPath(`${BREASTFEEDING_TRACKER_BLOG_BASE_PATH}/${post.slug}`)}
                >
                  <img src={post.ogImage} alt={post.ogImageAlt || ""} />
                  <div>
                    <p className="feeding-blog-meta">
                      <span>{post.category}</span>
                      {formatBreastfeedingArticleDate(post.publishedAt)} {breastfeedingBlogPageContent.metaSeparator} {post.readingMinutes} {breastfeedingBlogPageContent.readingTimeSuffix}
                    </p>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <strong>{breastfeedingBlogPageContent.readLabel}</strong>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

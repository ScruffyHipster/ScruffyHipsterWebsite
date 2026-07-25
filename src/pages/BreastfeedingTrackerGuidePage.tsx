import { Link, Navigate, useParams } from "react-router-dom";
import { BreastfeedingTrackerAppStoreLink } from "../components/AppStoreLink";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import {
  breastfeedingTrackerGuides,
  breastfeedingTrackerGuidesBySlug,
  breastfeedingTrackerOgImage
} from "../content/breastfeedingTracker";
import {
  BREASTFEEDING_TRACKER_BASE_PATH,
  BREASTFEEDING_TRACKER_GUIDES_BASE_PATH
} from "../content/routes";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { canonicalPath, canonicalUrl } from "../seo/canonical";

export function BreastfeedingTrackerGuidePage() {
  const params = useParams<{ slug: string }>();
  const guide = params.slug ? breastfeedingTrackerGuidesBySlug.get(params.slug) : undefined;

  if (!guide) {
    return <Navigate to={canonicalPath(BREASTFEEDING_TRACKER_GUIDES_BASE_PATH)} replace />;
  }

  const siteUrl = getSiteUrl();
  const path = `${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}/${guide.slug}`;
  const relatedGuides = breastfeedingTrackerGuides
    .filter((candidate) => candidate.slug !== guide.slug)
    .slice(0, 2);

  return (
    <>
      <Seo
        path={path}
        meta={{
          title: guide.title,
          description: guide.description,
          keywords: guide.tags,
          ogImage: guide.ogImage || breastfeedingTrackerOgImage
        }}
        jsonLd={[
          organizationJsonLd(),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            datePublished: guide.publishedAt,
            ...(guide.updatedAt ? { dateModified: guide.updatedAt } : {}),
            image: `${siteUrl}${guide.ogImage || breastfeedingTrackerOgImage}`,
            url: canonicalUrl(path, siteUrl),
            author: {
              "@type": "Organization",
              name: "Scruffyhipster",
              url: siteUrl
            },
            about: {
              "@type": "SoftwareApplication",
              name: "Breastfeeding Tracker & Timer",
              url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl)
            }
          },
          breadcrumbJsonLd([
            { name: "Scruffyhipster", url: siteUrl },
            {
              name: "Breastfeeding Tracker",
              url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl)
            },
            {
              name: "Guides",
              url: canonicalUrl(BREASTFEEDING_TRACKER_GUIDES_BASE_PATH, siteUrl)
            },
            { name: guide.title, url: canonicalUrl(path, siteUrl) }
          ])
        ]}
      />

      <article className="feeding-article">
        <div className="narrow-container">
          <Reveal>
            <Link
              className="feeding-text-link"
              to={canonicalPath(BREASTFEEDING_TRACKER_GUIDES_BASE_PATH)}
            >
              Back to all guides
            </Link>
            <p className="eyebrow">breastfeeding tracker guide</p>
            <h1>{guide.title}</h1>
            <p className="lead">{guide.description}</p>
          </Reveal>
          <Reveal delayMs={70}>
            <div
              className="feeding-article-body"
              dangerouslySetInnerHTML={{ __html: guide.html }}
            />
          </Reveal>
          <Reveal className="feeding-article-cta">
            <p className="eyebrow">simple help for the first feeds</p>
            <h2>Start the next feed in one tap. Correct it later if you need to.</h2>
            <BreastfeedingTrackerAppStoreLink className="btn feeding-btn-primary" placement="guide">
              Download on the App Store
            </BreastfeedingTrackerAppStoreLink>
          </Reveal>
          <Reveal className="feeding-related-guides">
            <h2>Related guides</h2>
            {relatedGuides.map((related) => (
              <Link
                key={related.slug}
                to={canonicalPath(`${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}/${related.slug}`)}
              >
                {related.title}
              </Link>
            ))}
          </Reveal>
        </div>
      </article>
    </>
  );
}

import { Link, Navigate, useParams } from "react-router-dom";
import { BreastfeedingTrackerAppStoreLink } from "../components/AppStoreLink";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import {
  breastfeedingTrackerGuides,
  breastfeedingTrackerGuidesBySlug,
  breastfeedingTrackerContent,
  breastfeedingTrackerOgImage
} from "../content/breastfeedingTracker";
import {
  BREASTFEEDING_TRACKER_BASE_PATH,
  BREASTFEEDING_TRACKER_GUIDES_BASE_PATH
} from "../content/routes";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { breastfeedingGuidesPageContent } from "../content/pages";
import { siteConfig } from "../content/site";

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
  const template = breastfeedingTrackerContent.guideTemplate;

  return (
    <>
      <Seo
        path={path}
        meta={{
          title: guide.metaTitle || guide.title,
          description: guide.description,
          keywords: guide.tags,
          ogImage: guide.ogImage || breastfeedingTrackerOgImage,
          ...(guide.ogImageAlt ? { ogImageAlt: guide.ogImageAlt } : {})
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
              name: siteConfig.companyName,
              url: siteUrl
            },
            about: {
              "@type": "SoftwareApplication",
              name: breastfeedingTrackerContent.softwareApplication.name,
              url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl)
            }
          },
          ...(guide.faqItems.length
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: guide.faqItems.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: item.answer
                    }
                  }))
                }
              ]
            : []),
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: siteUrl },
            {
              name: breastfeedingGuidesPageContent.breadcrumbs.tracker,
              url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl)
            },
            {
              name: breastfeedingGuidesPageContent.breadcrumbs.guides,
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
              {template.backLabel}
            </Link>
            <p className="eyebrow">{template.eyebrow}</p>
            <h1>{guide.title}</h1>
            <p className="lead">{guide.description}</p>
          </Reveal>
          <Reveal delayMs={70} threshold={0.01}>
            <div
              className="feeding-article-body"
              dangerouslySetInnerHTML={{ __html: guide.html }}
            />
          </Reveal>
          {guide.showDefaultCta ? (
            <Reveal className="feeding-article-cta">
              <p className="eyebrow">{template.defaultCta.eyebrow}</p>
              <h2>{template.defaultCta.heading}</h2>
              <BreastfeedingTrackerAppStoreLink className="btn feeding-btn-primary" placement="guide">
                {template.defaultCta.label}
              </BreastfeedingTrackerAppStoreLink>
            </Reveal>
          ) : null}
          <Reveal className="feeding-related-guides">
            <h2>{template.relatedHeading}</h2>
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

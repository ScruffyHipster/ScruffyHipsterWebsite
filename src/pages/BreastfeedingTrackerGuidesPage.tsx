import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { breastfeedingTrackerGuides } from "../content/breastfeedingTracker";
import {
  BREASTFEEDING_TRACKER_BASE_PATH,
  BREASTFEEDING_TRACKER_GUIDES_BASE_PATH
} from "../content/routes";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { breastfeedingGuidesPageContent } from "../content/pages";
import { siteConfig } from "../content/site";

export function BreastfeedingTrackerGuidesPage() {
  const siteUrl = getSiteUrl();
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: breastfeedingGuidesPageContent.collection.name,
    description: breastfeedingGuidesPageContent.collection.description,
    url: canonicalUrl(BREASTFEEDING_TRACKER_GUIDES_BASE_PATH, siteUrl),
    hasPart: breastfeedingTrackerGuides.map((guide) => ({
      "@type": "Article",
      headline: guide.title,
      url: canonicalUrl(`${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}/${guide.slug}`, siteUrl)
    }))
  };

  return (
    <>
      <Seo
        path={breastfeedingGuidesPageContent.route}
        meta={breastfeedingGuidesPageContent.seo}
        jsonLd={[
          organizationJsonLd(),
          collectionJsonLd,
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: siteUrl },
            {
              name: breastfeedingGuidesPageContent.breadcrumbs.tracker,
              url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl)
            },
            {
              name: breastfeedingGuidesPageContent.breadcrumbs.guides,
              url: canonicalUrl(BREASTFEEDING_TRACKER_GUIDES_BASE_PATH, siteUrl)
            }
          ])
        ]}
      />

      <section className="feeding-guide-hero">
        <div className="container">
          <Reveal>
            <Link
              className="feeding-text-link"
              to={canonicalPath(BREASTFEEDING_TRACKER_BASE_PATH)}
            >
              {breastfeedingGuidesPageContent.hero.backLabel}
            </Link>
            <p className="eyebrow">{breastfeedingGuidesPageContent.hero.eyebrow}</p>
            <h1>{breastfeedingGuidesPageContent.hero.heading}</h1>
            <p className="lead">{breastfeedingGuidesPageContent.hero.body}</p>
          </Reveal>
        </div>
      </section>

      <section className="feeding-section">
        <div className="container feeding-guide-list feeding-guide-list-large">
          {breastfeedingTrackerGuides.map((guide, index) => (
            <Reveal key={guide.slug}>
              <Link
                className="feeding-guide-row"
                to={canonicalPath(`${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}/${guide.slug}`)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{guide.title}</strong>
                <small>{guide.excerpt}</small>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import {
  breastfeedingTrackerGuides,
  breastfeedingTrackerOgImage
} from "../content/breastfeedingTracker";
import {
  BREASTFEEDING_TRACKER_BASE_PATH,
  BREASTFEEDING_TRACKER_GUIDES_BASE_PATH
} from "../content/routes";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { canonicalPath, canonicalUrl } from "../seo/canonical";

export function BreastfeedingTrackerGuidesPage() {
  const siteUrl = getSiteUrl();
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Breastfeeding Tracker Guides",
    description:
      "Practical guides to timing, correcting, reviewing, and exporting newborn breastfeeding history without schedules or medical advice.",
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
        path={BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}
        meta={{
          title: "Newborn Breastfeeding Timer Guides for iPhone & Apple Watch",
          description:
            "Practical help for timing newborn feeds, remembering the last side, correcting missed entries, using Apple Watch, and exporting a PDF.",
          keywords: [
            "breastfeeding tracker guides",
            "breastfeeding timer help",
            "Apple Watch feeding tracker",
            "newborn breastfeeding tracker"
          ],
          ogImage: breastfeedingTrackerOgImage
        }}
        jsonLd={[
          organizationJsonLd(),
          collectionJsonLd,
          breadcrumbJsonLd([
            { name: "Scruffyhipster", url: siteUrl },
            {
              name: "Breastfeeding Tracker",
              url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl)
            },
            {
              name: "Guides",
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
              Back to Breastfeeding Tracker
            </Link>
            <p className="eyebrow">help for your newborn’s first feeds</p>
            <h1>Practical help for timing, correcting, reviewing, and sharing.</h1>
            <p className="lead">
              Use the useful parts of the tracker during the first weeks—without feeding schedules,
              adequacy scoring, or medical advice.
            </p>
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

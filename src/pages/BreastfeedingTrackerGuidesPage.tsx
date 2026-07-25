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

export function BreastfeedingTrackerGuidesPage() {
  const siteUrl = getSiteUrl();
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Breastfeeding Tracker Guides",
    description:
      "Practical, product-led guides for using Breastfeeding Tracker & Timer on iPhone and Apple Watch.",
    url: `${siteUrl}${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}`,
    hasPart: breastfeedingTrackerGuides.map((guide) => ({
      "@type": "Article",
      headline: guide.title,
      url: `${siteUrl}${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}/${guide.slug}`
    }))
  };

  return (
    <>
      <Seo
        path={BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}
        meta={{
          title: "Breastfeeding Tracker Guides for iPhone & Apple Watch",
          description:
            "Practical guides for timing feeds, tracking left and right sides, using Apple Watch, correcting history, protecting privacy, and exporting a PDF.",
          keywords: [
            "breastfeeding tracker guides",
            "breastfeeding timer help",
            "Apple Watch feeding tracker"
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
              url: `${siteUrl}${BREASTFEEDING_TRACKER_BASE_PATH}`
            },
            {
              name: "Guides",
              url: `${siteUrl}${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}`
            }
          ])
        ]}
      />

      <section className="feeding-guide-hero">
        <div className="container">
          <Reveal>
            <Link className="feeding-text-link" to={BREASTFEEDING_TRACKER_BASE_PATH}>
              Back to Breastfeeding Tracker
            </Link>
            <p className="eyebrow">breastfeeding tracker guides</p>
            <h1>Practical help for the timer, history, Watch, and export.</h1>
            <p className="lead">
              Product-led guidance without feeding schedules, adequacy scoring, or medical advice.
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
                to={`${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}/${guide.slug}`}
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

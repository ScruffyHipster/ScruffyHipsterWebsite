import { Link } from "react-router-dom";
import { BreastfeedingTrackerAppStoreLink } from "../components/AppStoreLink";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import {
  breastfeedingTrackerApp,
  breastfeedingTrackerAppStoreUrl,
  breastfeedingTrackerContent,
  breastfeedingTrackerFaqs,
  breastfeedingTrackerGuides
} from "../content/breastfeedingTracker";
import {
  BREASTFEEDING_TRACKER_BASE_PATH,
  BREASTFEEDING_TRACKER_GUIDES_BASE_PATH
} from "../content/routes";
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { siteConfig } from "../content/site";

const siteUrl = getSiteUrl();

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: breastfeedingTrackerContent.softwareApplication.name,
  applicationCategory: breastfeedingTrackerContent.softwareApplication.applicationCategory,
  applicationSubCategory:
    breastfeedingTrackerContent.softwareApplication.applicationSubCategory,
  operatingSystem: breastfeedingTrackerContent.softwareApplication.operatingSystem,
  description: breastfeedingTrackerContent.softwareApplication.description,
  url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl),
  image: `${siteUrl}${breastfeedingTrackerApp.icon}`,
  downloadUrl: breastfeedingTrackerAppStoreUrl,
  featureList: breastfeedingTrackerContent.softwareApplication.featureList,
  offers: {
    "@type": "Offer",
    ...breastfeedingTrackerContent.softwareApplication.offer
  }
};

export function BreastfeedingTrackerLandingPage() {
  return (
    <>
      <Seo
        path={BREASTFEEDING_TRACKER_BASE_PATH}
        meta={breastfeedingTrackerContent.seo}
        jsonLd={[
          organizationJsonLd(),
          softwareApplicationJsonLd,
          faqPageJsonLd(breastfeedingTrackerFaqs),
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: siteUrl },
            {
              name: breastfeedingTrackerContent.softwareApplication.applicationSubCategory,
              url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl)
            }
          ])
        ]}
      />

      <section className="feeding-hero">
        <div className="container feeding-hero-grid">
          <Reveal className="feeding-hero-copy">
            <img
              className="feeding-app-icon"
              src={breastfeedingTrackerApp.icon}
              alt={breastfeedingTrackerContent.hero.iconAlt}
            />
            <p className="eyebrow">{breastfeedingTrackerContent.hero.eyebrow}</p>
            <h1>{breastfeedingTrackerContent.hero.heading}</h1>
            <p className="lead">{breastfeedingTrackerContent.hero.body}</p>
            <div className="hero-actions">
              <BreastfeedingTrackerAppStoreLink className="btn feeding-btn-primary" placement="hero">
                {breastfeedingTrackerContent.hero.primaryCta}
              </BreastfeedingTrackerAppStoreLink>
              <a className="btn feeding-btn-secondary" href="#how-it-works">
                {breastfeedingTrackerContent.hero.secondaryCta}
              </a>
            </div>
            <p className="feeding-store-note">{breastfeedingTrackerContent.hero.storeNote}</p>
          </Reveal>

          <Reveal className="feeding-hero-visual" delayMs={90}>
            <div className="feeding-device-halo" aria-hidden="true" />
            <img
              className="feeding-hero-phone"
              src={breastfeedingTrackerApp.screenshots[0].src}
              alt={breastfeedingTrackerContent.hero.imageAlt}
            />
          </Reveal>
        </div>
      </section>

      <section className="feeding-proof" aria-label={breastfeedingTrackerContent.proof.ariaLabel}>
        <div className="container feeding-proof-row">
          {breastfeedingTrackerContent.proof.items.map((item) => (
            <p key={item.heading}>
              <strong>{item.heading}</strong>
              <span>{item.body}</span>
            </p>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="feeding-section">
        <div className="container">
          <Reveal className="feeding-section-heading">
            <p className="eyebrow">{breastfeedingTrackerContent.howItWorks.eyebrow}</p>
            <h2>{breastfeedingTrackerContent.howItWorks.heading}</h2>
          </Reveal>
          <div className="feeding-steps">
            {breastfeedingTrackerContent.howItWorks.steps.map((item, index) => (
              <Reveal className="feeding-step" key={item.step} delayMs={index * 70}>
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="feeding-feature-band">
        <div className="container feeding-feature-layout">
          <Reveal className="feeding-feature-copy">
            <p className="eyebrow">{breastfeedingTrackerContent.watchFeature.eyebrow}</p>
            <h2>{breastfeedingTrackerContent.watchFeature.heading}</h2>
            {breastfeedingTrackerContent.watchFeature.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link
              className="feeding-text-link"
              to={breastfeedingTrackerContent.watchFeature.link.url}
            >
              {breastfeedingTrackerContent.watchFeature.link.label}
            </Link>
          </Reveal>
          <Reveal className="feeding-feature-images" delayMs={100}>
            <img
              src={breastfeedingTrackerApp.screenshots[1].src}
              alt={breastfeedingTrackerContent.watchFeature.imageAlts[0]}
            />
            <img
              src={breastfeedingTrackerApp.screenshots[2].src}
              alt={breastfeedingTrackerContent.watchFeature.imageAlts[1]}
            />
          </Reveal>
        </div>
      </section>

      <section className="feeding-section">
        <div className="container feeding-history-layout">
          <Reveal className="feeding-history-images">
            <img
              src={breastfeedingTrackerApp.screenshots[3].src}
              alt={breastfeedingTrackerContent.historyFeature.imageAlts[0]}
            />
            <img
              src={breastfeedingTrackerApp.screenshots[4].src}
              alt={breastfeedingTrackerContent.historyFeature.imageAlts[1]}
            />
          </Reveal>
          <Reveal className="feeding-feature-copy" delayMs={90}>
            <p className="eyebrow">{breastfeedingTrackerContent.historyFeature.eyebrow}</p>
            <h2>{breastfeedingTrackerContent.historyFeature.heading}</h2>
            {breastfeedingTrackerContent.historyFeature.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <BreastfeedingTrackerAppStoreLink
              className="feeding-text-link"
              placement="feature"
            >
              {breastfeedingTrackerContent.historyFeature.cta}
            </BreastfeedingTrackerAppStoreLink>
          </Reveal>
        </div>
      </section>

      <section className="feeding-privacy">
        <div className="narrow-container">
          <Reveal>
            <p className="eyebrow">{breastfeedingTrackerContent.privacy.eyebrow}</p>
            <h2>{breastfeedingTrackerContent.privacy.heading}</h2>
            <p>{breastfeedingTrackerContent.privacy.body}</p>
            <div className="feeding-inline-links">
              {breastfeedingTrackerContent.privacy.links.map((link) => (
                <Link key={link.url} to={link.url}>
                  {link.label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="feeding-section feeding-guides">
        <div className="container">
          <Reveal className="feeding-section-heading">
            <p className="eyebrow">{breastfeedingTrackerContent.guidesSection.eyebrow}</p>
            <h2>{breastfeedingTrackerContent.guidesSection.heading}</h2>
            <p>{breastfeedingTrackerContent.guidesSection.body}</p>
          </Reveal>
          <div className="feeding-guide-list">
            {breastfeedingTrackerGuides.map((guide, index) => (
              <Reveal key={guide.slug} delayMs={Math.min(index * 55, 220)}>
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
          <Reveal>
            <Link
              className="feeding-text-link"
              to={canonicalPath(BREASTFEEDING_TRACKER_GUIDES_BASE_PATH)}
            >
              {breastfeedingTrackerContent.guidesSection.browseLabel}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="feeding-section feeding-faq">
        <div className="container feeding-faq-layout">
          <Reveal className="feeding-section-heading">
            <p className="eyebrow">{breastfeedingTrackerContent.faqSection.eyebrow}</p>
            <h2>{breastfeedingTrackerContent.faqSection.heading}</h2>
          </Reveal>
          <div className="feeding-faq-list">
            {breastfeedingTrackerFaqs.map((item) => (
              <Reveal key={item.question}>
                <details>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="feeding-final-cta">
        <div className="container">
          <Reveal>
            <img src={breastfeedingTrackerApp.icon} alt="" aria-hidden="true" />
            <p className="eyebrow">{breastfeedingTrackerContent.finalCta.eyebrow}</p>
            <h2>{breastfeedingTrackerContent.finalCta.heading}</h2>
            <BreastfeedingTrackerAppStoreLink className="btn feeding-btn-primary" placement="footer">
              {breastfeedingTrackerContent.finalCta.label}
            </BreastfeedingTrackerAppStoreLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import {
  rewireApp,
  rewireAppStoreFacts,
  rewireContent,
  rewireFaqs,
  rewireGuidePages,
  rewireScreenshots,
  rewireShowcaseSections
} from "../content/rewire";
import { formatRating, formatRatingCount, rewireAppStoreRating } from "../content/rewireRating";
import { siteConfig } from "../content/site";

const path = "/rewire";
const siteUrl = getSiteUrl();
const appStoreUrl = rewireAppStoreRating.storeUrl || rewireAppStoreFacts.appStoreUrl;

const landingFaqs = rewireFaqs.map(({ question, answer }) => ({ question, answer }));

const rewireSoftwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: rewireContent.softwareApplication.name,
  applicationCategory: rewireContent.softwareApplication.applicationCategory,
  applicationSubCategory: rewireContent.softwareApplication.applicationSubCategory,
  operatingSystem: rewireAppStoreFacts.minimumOsVersion,
  description: rewireContent.softwareApplication.description,
  url: canonicalUrl(path, siteUrl),
  image: `${siteUrl}${rewireApp.icon}`,
  downloadUrl: appStoreUrl,
  featureList: rewireContent.softwareApplication.featureList,
  offers: {
    "@type": "Offer",
    ...rewireContent.softwareApplication.offer
  },
  ...(typeof rewireAppStoreRating.rating === "number"
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rewireAppStoreRating.rating,
          ratingCount: rewireAppStoreRating.ratingCount || 1,
          bestRating: 5,
          worstRating: 1
        }
      }
    : {})
};

export function RewireLandingPage() {
  return (
    <>
      <Seo
        path={path}
        meta={rewireContent.seo}
        jsonLd={[
          organizationJsonLd(),
          rewireSoftwareJsonLd,
          faqPageJsonLd(landingFaqs),
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: siteUrl },
            { name: rewireApp.name, url: canonicalUrl(path, siteUrl) }
          ])
        ]}
      />

      <section className="rewire-hero">
        <div className="container rewire-hero-layout">
          <Reveal className="rewire-hero-copy">
            <img
              className="rewire-hero-icon"
              src={rewireApp.icon}
              alt={rewireContent.hero.iconAlt}
            />
            <p className="eyebrow">{rewireContent.hero.eyebrow}</p>
            <h1>{rewireContent.hero.heading}</h1>
            <p className="lead">{rewireContent.hero.body}</p>
            <div
              className="rewire-rating-line"
              aria-label={`${rewireContent.ratingLabels.ariaPrefix} ${formatRating(rewireAppStoreRating.rating)} ${rewireContent.ratingLabels.fromLabel} ${formatRatingCount(rewireAppStoreRating.ratingCount)}`}
            >
              <span>{formatRating(rewireAppStoreRating.rating)}</span>
              <span>{formatRatingCount(rewireAppStoreRating.ratingCount)}</span>
              <span>{rewireAppStoreFacts.price}</span>
            </div>
            <div className="hero-actions">
              <a className="btn btn-primary" href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                {rewireContent.hero.primaryCta}
              </a>
              <a className="btn btn-secondary" href="#how-it-works">
                {rewireContent.hero.secondaryCta}
              </a>
            </div>
          </Reveal>

          <Reveal className="rewire-hero-media" delayMs={120}>
            <div
              className="rewire-device-cluster"
              aria-label={rewireContent.hero.screenshotsAriaLabel}
            >
              <img className="rewire-device-main" src={rewireScreenshots[0].src} alt={rewireScreenshots[0].alt} loading="eager" decoding="async" />
              <img className="rewire-device-secondary rewire-device-secondary-a" src={rewireScreenshots[2].src} alt={rewireScreenshots[2].alt} loading="lazy" decoding="async" />
              <img className="rewire-device-secondary rewire-device-secondary-b" src={rewireScreenshots[4].src} alt={rewireScreenshots[4].alt} loading="lazy" decoding="async" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-block section-pad">
        <div className="container rewire-download-grid">
          <Reveal>
            <p className="eyebrow">{rewireContent.download.eyebrow}</p>
            <h2>{rewireContent.download.heading}</h2>
          </Reveal>
          <Reveal className="rewire-download-card" delayMs={80}>
            <img src={rewireApp.icon} alt="" aria-hidden="true" />
            <div>
              <h3>{rewireAppStoreFacts.title}</h3>
              <p>
                {rewireAppStoreFacts.price}
                {rewireAppStoreFacts.hasInAppPurchases
                  ? rewireContent.download.purchaseSuffix
                  : ""}
                . {rewireContent.download.requiresLabel} {rewireAppStoreFacts.minimumOsVersion}.{" "}
                {rewireContent.download.listedInLabel}{" "}
                {rewireAppStoreFacts.categories.join(
                  ` ${rewireContent.download.categoryJoiner} `
                )}.
              </p>
              <p>{rewireContent.download.body}</p>
              <a className="btn btn-primary" href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                {rewireContent.download.cta}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="screenshots" className="section-block section-pad">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">{rewireContent.screenshotsSection.eyebrow}</p>
            <h2>{rewireContent.screenshotsSection.heading}</h2>
            <p>{rewireContent.screenshotsSection.body}</p>
          </Reveal>
          <div className="rewire-screenshot-grid">
            {rewireScreenshots.map((shot, index) => (
              <Reveal key={shot.src} delayMs={Math.min(index * 45, 180)}>
                <figure className="rewire-screenshot-card">
                  <img src={shot.src} alt={shot.alt} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-block">
        <div className="container rewire-feature-flow">
          <Reveal className="rewire-section-intro">
            <p className="eyebrow">{rewireContent.howItWorks.eyebrow}</p>
            <h2>{rewireContent.howItWorks.heading}</h2>
          </Reveal>
          {rewireShowcaseSections.map((section, index) => (
            <Reveal key={section.title} className="rewire-feature-row" delayMs={Math.min(index * 70, 180)}>
              <div className="rewire-feature-copy">
                <p className="eyebrow">{section.eyebrow}</p>
                <h3>{section.title}</h3>
                <p>{section.body}</p>
              </div>
              <div className="rewire-feature-media">
                <img src={section.image.src} alt={section.image.alt} loading="lazy" decoding="async" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-block section-pad">
        <div className="container rewire-proof-strip">
          <Reveal>
            <p className="eyebrow">{rewireContent.proof.eyebrow}</p>
            <h2>{rewireContent.proof.heading}</h2>
          </Reveal>
          <Reveal delayMs={80}>
            <ul>
              {rewireContent.proof.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section-block section-pad">
        <div className="container rewire-guides">
          <Reveal className="section-head">
            <p className="eyebrow">{rewireContent.guidesSection.eyebrow}</p>
            <h2>{rewireContent.guidesSection.heading}</h2>
          </Reveal>
          <div className="rewire-guide-grid">
            {rewireGuidePages.map((guide, index) => (
              <Reveal key={guide.slug} delayMs={Math.min(index * 35, 160)}>
                <Link
                  className="rewire-guide-card"
                  to={canonicalPath(`/rewire/blog/${guide.slug}`)}
                >
                  <span>{guide.keyword}</span>
                  <strong>{guide.title}</strong>
                  <small>{guide.description}</small>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section-block section-pad">
        <div className="container rewire-faq-layout">
          <Reveal>
            <p className="eyebrow">{rewireContent.faqSection.eyebrow}</p>
            <h2>{rewireContent.faqSection.heading}</h2>
          </Reveal>
          <div className="rewire-faq-list">
            {rewireFaqs.map((item, index) => (
              <Reveal key={item.question} delayMs={Math.min(index * 50, 180)}>
                <article className="rewire-faq-item">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                  <Link to={canonicalPath(`/rewire/blog/${item.guideSlug}`)}>
                    {rewireContent.faqSection.linkLabel}
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block section-pad">
        <div className="container rewire-final-cta">
          <Reveal>
            <img src={rewireApp.icon} alt="" aria-hidden="true" />
            <p className="eyebrow">{rewireContent.finalCta.eyebrow}</p>
            <h2>{rewireContent.finalCta.heading}</h2>
            <div className="hero-actions">
              <a className="btn btn-primary" href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                {rewireContent.finalCta.primaryLabel}
              </a>
              <Link className="btn btn-secondary" to={canonicalPath("/privacy/rewire")}>
                {rewireContent.finalCta.secondaryLabel}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-block section-pad rewire-link-footer">
        <div className="container rewire-link-grid">
          {rewireContent.linkFooter.map((group) => (
            <div key={group.heading}>
              <p className="footer-heading">{group.heading}</p>
              {group.links.map((link) => {
                const url =
                  link.url === "app-store"
                    ? appStoreUrl
                    : link.url === "terms"
                      ? rewireAppStoreFacts.eulaUrl
                      : link.url;
                return url.startsWith("/") ? (
                  <Link key={link.label} to={url}>
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

const decoration = { arrow: "↗", down: "↓", check: "✓", plus: "+" };
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { RewireFocusDemo } from "../components/RewireFocusDemo";
import { RewireComparisonFeature } from "../components/RewireComparisonFeature";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
} from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import {
  rewireApp,
  rewireAppStoreFacts,
  rewireContent,
  rewireFaqs,
  rewireGuidePages,
} from "../content/rewire";
import { rewireAppStoreRating } from "../content/rewireRating";
import { siteConfig } from "../content/site";
const path = "/rewire";
const siteUrl = getSiteUrl();
const appStoreUrl =
  rewireAppStoreRating.storeUrl || rewireAppStoreFacts.appStoreUrl;

const landingFaqs = rewireFaqs.map(({ question, answer }) => ({
  question,
  answer,
}));

const rewireSoftwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: rewireContent.softwareApplication.name,
  applicationCategory: rewireContent.softwareApplication.applicationCategory,
  applicationSubCategory:
    rewireContent.softwareApplication.applicationSubCategory,
  operatingSystem: rewireAppStoreFacts.minimumOsVersion,
  description: rewireContent.softwareApplication.description,
  url: canonicalUrl(path, siteUrl),
  image: `${siteUrl}${rewireApp.icon}`,
  downloadUrl: appStoreUrl,
  featureList: rewireContent.softwareApplication.featureList,
  offers: {
    "@type": "Offer",
    ...rewireContent.softwareApplication.offer,
  },
};

const c = rewireContent.editorial;
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
            { name: rewireApp.name, url: canonicalUrl(path, siteUrl) },
          ]),
        ]}
      />
      <section className="rw-container rw-hero">
        <div className="rw-hero-copy">
          <p className="rw-eyebrow">
            <span className="rw-status-dot" />
            {rewireContent.hero.eyebrow}
          </p>
          <h1>
            {rewireContent.hero.heading}
            <em>{rewireContent.hero.headingEmphasis}</em>
          </h1>
          <p className="rw-lead">{rewireContent.hero.body}</p>
          <div className="rw-actions">
            <a className="rw-button" href={appStoreUrl}>
              {rewireContent.hero.primaryCta}
              <span aria-hidden="true">{decoration.arrow}</span>
            </a>
            <a className="rw-text-link" href="#how-it-works">
              {rewireContent.hero.secondaryCta}
              <span aria-hidden="true">{decoration.down}</span>
            </a>
          </div>
          <p className="rw-small">{c.availability}</p>
        </div>
        <RewireFocusDemo />
      </section>
      <div className="rw-promise">
        <div className="rw-container">
          {c.promise.map((item) => (
            <span key={item}>
              <span aria-hidden="true">{decoration.check}</span>
              {item}
            </span>
          ))}
        </div>
      </div>
      <section id="how-it-works" className="rw-container rw-section">
        <div className="rw-section-head">
          <p className="rw-eyebrow">{rewireContent.howItWorks.eyebrow}</p>
          <h2>{rewireContent.howItWorks.heading}</h2>
        </div>
        <div className="rw-steps">
          {c.steps.map((step) => (
            <article key={step.number}>
              <span className="rw-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="rw-screen-section">
        <div className="rw-container rw-section">
          <div className="rw-section-head">
            <p className="rw-eyebrow">{c.screens.eyebrow}</p>
            <h2>{c.screens.heading}</h2>
            <p>{c.screens.body}</p>
          </div>
          <div className="rw-screens">
            {c.screens.items.map((shot) => (
              <figure key={shot.src}>
                <img
                  src={shot.src}
                  alt={shot.alt}
                  width="600"
                  height="1298"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{shot.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="rw-container rw-section">
        <div className="rw-section-head">
          <p className="rw-eyebrow">{c.features.eyebrow}</p>
          <h2>{c.features.heading}</h2>
        </div>
        <div className="rw-features">
          {c.features.items.map((item) => (
            <article key={item.title}>
              <span className="rw-feature-symbol" aria-hidden="true">
                {item.symbol}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <div className="rw-privacy">
          <div>
            <p className="rw-eyebrow">{c.privacy.eyebrow}</p>
            <h2>{c.privacy.heading}</h2>
          </div>
          <div>
            <p>{c.privacy.body}</p>
            <Link className="rw-text-link" to="/privacy/rewire/">
              {c.privacy.link}
              <span aria-hidden="true">{decoration.arrow}</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="rw-journal-section">
        <div className="rw-container rw-section">
          <div className="rw-section-head rw-head-link">
            <div>
              <p className="rw-eyebrow">{c.journal.eyebrow}</p>
              <h2>{c.journal.heading}</h2>
            </div>
            <Link className="rw-text-link" to="/rewire/blog/">
              {c.journal.link}
              <span aria-hidden="true">{decoration.arrow}</span>
            </Link>
          </div>
          <RewireComparisonFeature />
          <div className="rw-guide-links">
            {rewireGuidePages.slice(0, 3).map((guide) => (
              <Link
                to={canonicalPath(`/rewire/blog/${guide.slug}`)}
                key={guide.slug}
              >
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
                <span aria-hidden="true">{decoration.arrow}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section id="faq" className="rw-container rw-section rw-faq">
        <div className="rw-section-head">
          <p className="rw-eyebrow">{rewireContent.faqSection.eyebrow}</p>
          <h2>{rewireContent.faqSection.heading}</h2>
        </div>
        <div>
          {rewireFaqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                {faq.question}
                <span aria-hidden="true">{decoration.plus}</span>
              </summary>
              <p>{faq.answer}</p>
              <Link
                className="rw-text-link"
                to={canonicalPath(`/rewire/blog/${faq.guideSlug}`)}
              >
                {rewireContent.faqSection.linkLabel}
                <span aria-hidden="true">{decoration.arrow}</span>
              </Link>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

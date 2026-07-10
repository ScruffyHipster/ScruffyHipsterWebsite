import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import {
  rewireApp,
  rewireAppStoreFacts,
  rewireFaqs,
  rewireGuidePages,
  rewireScreenshots,
  rewireSeoTargets,
  rewireShowcaseSections
} from "../content/rewire";
import { formatRating, formatRatingCount, rewireAppStoreRating } from "../content/rewireRating";

const path = "/rewire";
const siteUrl = getSiteUrl();
const appStoreUrl = rewireAppStoreRating.storeUrl || rewireAppStoreFacts.appStoreUrl;

const landingFaqs = rewireFaqs.map(({ question, answer }) => ({ question, answer }));

const rewireSoftwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: rewireAppStoreFacts.title,
  applicationCategory: "ProductivityApplication",
  applicationSubCategory: "App Blocker",
  operatingSystem: rewireAppStoreFacts.minimumOsVersion,
  description:
    "Rewire is an iPhone app and website blocker that uses Apple Screen Time controls to interrupt distracting app and website opens.",
  url: `${siteUrl}${path}`,
  image: `${siteUrl}${rewireApp.icon}`,
  downloadUrl: appStoreUrl,
  softwareVersion: rewireAppStoreFacts.version,
  datePublished: rewireAppStoreFacts.releaseDate,
  releaseNotes: rewireAppStoreFacts.releaseNotes,
  featureList: rewireApp.seoFeatureList,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    category: "free"
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
        meta={{
          title: "Rewire | App Blocker for iPhone",
          description:
            "Rewire is an iPhone app and website blocker for reducing screen time, stopping doomscrolling, and interrupting distracting app opens.",
          keywords: ["Rewire", ...rewireSeoTargets],
          ogImage: rewireApp.icon
        }}
        jsonLd={[
          organizationJsonLd(),
          rewireSoftwareJsonLd,
          faqPageJsonLd(landingFaqs),
          breadcrumbJsonLd([
            { name: "Scruffyhipster", url: siteUrl },
            { name: "Rewire", url: `${siteUrl}${path}` }
          ])
        ]}
      />

      <section className="rewire-hero">
        <div className="container rewire-hero-layout">
          <Reveal className="rewire-hero-copy">
            <img className="rewire-hero-icon" src={rewireApp.icon} alt="Rewire app icon" />
            <p className="eyebrow">app blocker for iphone</p>
            <h1>block apps and websites before the scroll starts.</h1>
            <p className="lead">
              Rewire uses Apple Screen Time controls to block distracting apps and websites, add a deliberate pause, and help you choose what happens next.
            </p>
            <div
              className="rewire-rating-line"
              aria-label={`App Store rating: ${formatRating(rewireAppStoreRating.rating)} from ${formatRatingCount(rewireAppStoreRating.ratingCount)}`}
            >
              <span>{formatRating(rewireAppStoreRating.rating)}</span>
              <span>{formatRatingCount(rewireAppStoreRating.ratingCount)}</span>
              <span>{rewireAppStoreFacts.price}</span>
            </div>
            <div className="hero-actions">
              <a className="btn btn-primary" href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                download on the app store
              </a>
              <a className="btn btn-secondary" href="#how-it-works">
                see how it works
              </a>
            </div>
          </Reveal>

          <Reveal className="rewire-hero-media" delayMs={120}>
            <div className="rewire-device-cluster" aria-label="Rewire app screenshots">
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
            <p className="eyebrow">download</p>
            <h2>free on the app store, built for iphone.</h2>
          </Reveal>
          <Reveal className="rewire-download-card" delayMs={80}>
            <img src={rewireApp.icon} alt="" aria-hidden="true" />
            <div>
              <h3>{rewireAppStoreFacts.title}</h3>
              <p>
                {rewireAppStoreFacts.price}
                {rewireAppStoreFacts.hasInAppPurchases ? " with in-app purchases" : ""}. Requires {rewireAppStoreFacts.minimumOsVersion}. Listed in {rewireAppStoreFacts.categories.join(" and ")}.
              </p>
              <p>
                No accounts, no ads, no personal data collection. Rewire works with Apple's Screen Time and Family Controls safeguards.
              </p>
              <a className="btn btn-primary" href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                open app store listing
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="screenshots" className="section-block section-pad">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">screenshots</p>
            <h2>current app store screens.</h2>
            <p>These images are downloaded from the current US App Store listing for Rewire.</p>
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
            <p className="eyebrow">how it works</p>
            <h2>four steps from reflex to choice.</h2>
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
            <p className="eyebrow">privacy first</p>
            <h2>no accounts. no ads. no personal data collection.</h2>
          </Reveal>
          <Reveal delayMs={80}>
            <ul>
              <li>uses Apple Screen Time and Family Controls APIs</li>
              <li>blocks apps and distracting websites</li>
              <li>supports timed and always-on focus sessions</li>
              <li>works offline after setup</li>
              <li>anonymous analytics only</li>
              <li>does not bypass Apple protections</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section-block section-pad">
        <div className="container rewire-guides">
          <Reveal className="section-head">
            <p className="eyebrow">guides</p>
            <h2>practical answers for app blocking, screen time, and focus.</h2>
          </Reveal>
          <div className="rewire-guide-grid">
            {rewireGuidePages.map((guide, index) => (
              <Reveal key={guide.slug} delayMs={Math.min(index * 35, 160)}>
                <Link className="rewire-guide-card" to={`/rewire/blog/${guide.slug}`}>
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
            <p className="eyebrow">faq</p>
            <h2>common questions about blocking apps on iphone.</h2>
          </Reveal>
          <div className="rewire-faq-list">
            {rewireFaqs.map((item, index) => (
              <Reveal key={item.question} delayMs={Math.min(index * 50, 180)}>
                <article className="rewire-faq-item">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                  <Link to={`/rewire/blog/${item.guideSlug}`}>learn more</Link>
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
            <p className="eyebrow">rewire</p>
            <h2>download the iphone app blocker built around the moment distraction starts.</h2>
            <div className="hero-actions">
              <a className="btn btn-primary" href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                download on the app store
              </a>
              <Link className="btn btn-secondary" to="/privacy/rewire">
                privacy policy
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-block section-pad rewire-link-footer">
        <div className="container rewire-link-grid">
          <div>
            <p className="footer-heading">app links</p>
            <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
              App Store
            </a>
            <Link to="/rewire/blog">Guides</Link>
          </div>
          <div>
            <p className="footer-heading">policies</p>
            <Link to="/privacy/rewire">Privacy</Link>
            <a href={rewireAppStoreFacts.eulaUrl} target="_blank" rel="noopener noreferrer">
              Terms
            </a>
          </div>
          <div>
            <p className="footer-heading">studio</p>
            <Link to="/">Scruffyhipster</Link>
            <Link to="/apps">Apps</Link>
          </div>
        </div>
      </section>
    </>
  );
}

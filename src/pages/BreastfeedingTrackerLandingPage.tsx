import { Link } from "react-router-dom";
import { BreastfeedingTrackerAppStoreLink } from "../components/AppStoreLink";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import {
  breastfeedingTrackerApp,
  breastfeedingTrackerAppStoreUrl,
  breastfeedingTrackerFaqs,
  breastfeedingTrackerGuides,
  breastfeedingTrackerKeywords,
  breastfeedingTrackerOgImage
} from "../content/breastfeedingTracker";
import {
  BREASTFEEDING_TRACKER_BASE_PATH,
  BREASTFEEDING_TRACKER_GUIDES_BASE_PATH
} from "../content/routes";
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";

const siteUrl = getSiteUrl();

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Breastfeeding Tracker & Timer",
  applicationCategory: "MedicalApplication",
  applicationSubCategory: "Breastfeeding Tracker",
  operatingSystem: "iOS 26.0 or later; watchOS 26.0 or later",
  description:
    "A simple, private breastfeeding timer for iPhone and Apple Watch with left and right side tracking, editable history, Live Activities, and PDF export.",
  url: `${siteUrl}${BREASTFEEDING_TRACKER_BASE_PATH}`,
  image: `${siteUrl}${breastfeedingTrackerApp.icon}`,
  downloadUrl: breastfeedingTrackerAppStoreUrl,
  featureList: [
    "One-handed breastfeeding timer with left and right side tracking",
    "Apple Watch companion app with offline tracking and later sync",
    "Live Activities and Dynamic Island",
    "Editable feed history and timer adjustment",
    "PDF export from feed history",
    "Private on-device summaries",
    "No account or subscription required"
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    category: "free with optional lifetime in-app purchase"
  }
};

const howItWorks = [
  {
    step: "01",
    title: "Choose a side",
    body: "Tap left or right on iPhone or Apple Watch. The timer starts without a form or setup flow."
  },
  {
    step: "02",
    title: "Keep the timer close",
    body: "See the active feed in the app, on Apple Watch, on the Lock Screen, or in Dynamic Island."
  },
  {
    step: "03",
    title: "Review, correct, export",
    body: "Check history, adjust a late start, add a missed feed, or create a PDF from what you recorded."
  }
];

export function BreastfeedingTrackerLandingPage() {
  return (
    <>
      <Seo
        path={BREASTFEEDING_TRACKER_BASE_PATH}
        meta={{
          title: "Breastfeeding Tracker for iPhone & Apple Watch",
          description:
            "Track breastfeeding with a one-handed timer, left and right side history, Live Activities and Apple Watch. Private, simple and built for 3am feeds.",
          keywords: breastfeedingTrackerKeywords,
          ogImage: breastfeedingTrackerOgImage
        }}
        jsonLd={[
          organizationJsonLd(),
          softwareApplicationJsonLd,
          faqPageJsonLd(breastfeedingTrackerFaqs),
          breadcrumbJsonLd([
            { name: "Scruffyhipster", url: siteUrl },
            {
              name: "Breastfeeding Tracker",
              url: `${siteUrl}${BREASTFEEDING_TRACKER_BASE_PATH}`
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
              alt="Breastfeeding Tracker & Timer app icon"
            />
            <p className="eyebrow">breastfeeding tracker for iphone + apple watch</p>
            <h1>A simple breastfeeding tracker for iPhone and Apple Watch.</h1>
            <p className="lead">
              Start with one hand. See the last side. Keep the timer on your wrist. Correct the
              history later when the moment is quieter.
            </p>
            <div className="hero-actions">
              <BreastfeedingTrackerAppStoreLink className="btn feeding-btn-primary" placement="hero">
                Download on the App Store
              </BreastfeedingTrackerAppStoreLink>
              <a className="btn feeding-btn-secondary" href="#how-it-works">
                See how it works
              </a>
            </div>
            <p className="feeding-store-note">Free with an optional lifetime unlock. No subscription.</p>
          </Reveal>

          <Reveal className="feeding-hero-visual" delayMs={90}>
            <div className="feeding-device-halo" aria-hidden="true" />
            <img
              className="feeding-hero-phone"
              src="/assets/breastfeedingScreenShots/1.png"
              alt="Breastfeeding timer running on iPhone and Apple Watch"
            />
          </Reveal>
        </div>
      </section>

      <section className="feeding-proof" aria-label="Product principles">
        <div className="container feeding-proof-row">
          <p>
            <strong>No accounts.</strong>
            <span>Open the app and start.</span>
          </p>
          <p>
            <strong>No subscriptions.</strong>
            <span>Optional lifetime unlock only.</span>
          </p>
          <p>
            <strong>Data Not Collected.</strong>
            <span>As declared on the App Store.</span>
          </p>
        </div>
      </section>

      <section id="how-it-works" className="feeding-section">
        <div className="container">
          <Reveal className="feeding-section-heading">
            <p className="eyebrow">how it works</p>
            <h2>Less admin between you and the feed.</h2>
          </Reveal>
          <div className="feeding-steps">
            {howItWorks.map((item, index) => (
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
            <p className="eyebrow">iphone + apple watch</p>
            <h2>The timer is on the device already in reach.</h2>
            <p>
              Start and stop on Apple Watch when your phone is elsewhere. The watch works offline
              and sends completed feeds back when your devices reconnect.
            </p>
            <p>
              On iPhone, Live Activities and Dynamic Island keep the active side and duration
              visible without repeatedly reopening the app.
            </p>
            <Link
              className="feeding-text-link"
              to={`${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}/breastfeeding-tracker-apple-watch`}
            >
              Read the Apple Watch guide
            </Link>
          </Reveal>
          <Reveal className="feeding-feature-images" delayMs={100}>
            <img
              src="/assets/breastfeedingScreenShots/2.png"
              alt="Breastfeeding Tracker controls on iPhone"
            />
            <img
              src="/assets/breastfeedingScreenShots/3.png"
              alt="Breastfeeding Tracker feed history"
            />
          </Reveal>
        </div>
      </section>

      <section className="feeding-section">
        <div className="container feeding-history-layout">
          <Reveal className="feeding-history-images">
            <img
              src="/assets/breastfeedingScreenShots/4.png"
              alt="Breastfeeding Tracker session details"
            />
            <img
              src="/assets/breastfeedingScreenShots/5.png"
              alt="Private summaries created from recent feed history"
            />
          </Reveal>
          <Reveal className="feeding-feature-copy" delayMs={90}>
            <p className="eyebrow">history that can handle real life</p>
            <h2>Forgot the timer? Correct it later.</h2>
            <p>
              Add, edit, or delete feeds from history. If a feed began before the timer, adjust the
              start instead of losing the session.
            </p>
            <p>
              When you want a portable record, export selected history as a PDF. The app records
              what you enter; it does not judge the feed or provide medical advice.
            </p>
            <BreastfeedingTrackerAppStoreLink
              className="feeding-text-link"
              placement="feature"
            >
              Try the tracker on the App Store
            </BreastfeedingTrackerAppStoreLink>
          </Reveal>
        </div>
      </section>

      <section className="feeding-privacy">
        <div className="narrow-container">
          <Reveal>
            <p className="eyebrow">private by design</p>
            <h2>Your feeding history is not an advertising profile.</h2>
            <p>
              No account is required, and the App Store privacy label says Data Not Collected.
              Recent-history summaries are created on the device and remain informational—not a
              diagnosis or assessment.
            </p>
            <div className="feeding-inline-links">
              <Link to="/privacy/breast-feeding-tracker">Read the privacy policy</Link>
              <Link
                to={`${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}/private-breastfeeding-tracker`}
              >
                Read the privacy guide
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="feeding-section feeding-guides">
        <div className="container">
          <Reveal className="feeding-section-heading">
            <p className="eyebrow">practical guides</p>
            <h2>Use the features without turning feeding into homework.</h2>
            <p>Focused product guides. No feeding schedules, adequacy scoring, or medical advice.</p>
          </Reveal>
          <div className="feeding-guide-list">
            {breastfeedingTrackerGuides.map((guide, index) => (
              <Reveal key={guide.slug} delayMs={Math.min(index * 55, 220)}>
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
          <Reveal>
            <Link className="feeding-text-link" to={BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}>
              Browse all guides
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="feeding-section feeding-faq">
        <div className="container feeding-faq-layout">
          <Reveal className="feeding-section-heading">
            <p className="eyebrow">frequently asked questions</p>
            <h2>The practical details.</h2>
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
            <p className="eyebrow">ready when the next feed starts</p>
            <h2>A tracker that stays out of the way.</h2>
            <BreastfeedingTrackerAppStoreLink className="btn feeding-btn-primary" placement="footer">
              Download on the App Store
            </BreastfeedingTrackerAppStoreLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}

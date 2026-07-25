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
import { canonicalPath, canonicalUrl } from "../seo/canonical";

const siteUrl = getSiteUrl();

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Breastfeeding Tracker & Timer",
  applicationCategory: "MedicalApplication",
  applicationSubCategory: "Breastfeeding Tracker",
  operatingSystem: "iOS 26.0 or later; watchOS 26.0 or later",
  description:
    "A simple breastfeeding timer for a newborn's first feeds, with one-handed left and right tracking, widgets, Apple Watch controls, editable history, and PDF export.",
  url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl),
  image: `${siteUrl}${breastfeedingTrackerApp.icon}`,
  downloadUrl: breastfeedingTrackerAppStoreUrl,
  featureList: [
    "One-handed breastfeeding timer with left and right side tracking",
    "Apple Watch companion app with offline tracking and later sync",
    "Home Screen widget, Live Activities, and Dynamic Island",
    "Late-start adjustment and manual feed entry",
    "PDF export from selected feed history",
    "Private, informational on-device summaries",
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
    title: "Start with one tap",
    body: "Choose left or right on iPhone or Apple Watch. The timer starts without a form or setup flow."
  },
  {
    step: "02",
    title: "Check without reopening",
    body: "See the current or last feed in the app, on Apple Watch, in a widget, on the Lock Screen, or in Dynamic Island."
  },
  {
    step: "03",
    title: "Correct it later",
    body: "Adjust a late start or add a missed feed after the moment has passed. Useful history does not need perfect timing."
  }
];

export function BreastfeedingTrackerLandingPage() {
  return (
    <>
      <Seo
        path={BREASTFEEDING_TRACKER_BASE_PATH}
        meta={{
          title: "Newborn Breastfeeding Timer for iPhone & Apple Watch",
          description:
            "A simple breastfeeding timer for your newborn's first weeks. Track left and right, check widgets or Apple Watch, correct missed feeds, and export a PDF.",
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
              alt="Breastfeeding Tracker & Timer app icon"
            />
            <p className="eyebrow">newborn breastfeeding timer for iphone + apple watch</p>
            <h1>A simple timer for your newborn’s first feeds.</h1>
            <p className="lead">
              In the first few weeks, feeds can blur together. Start with one hand, see which side
              you used last, and fix anything you forgot when you have a quieter moment.
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
              src={breastfeedingTrackerApp.screenshots[0].src}
              alt="Breastfeeding timer running on iPhone and Apple Watch"
            />
          </Reveal>
        </div>
      </section>

      <section className="feeding-proof" aria-label="Newborn feed tracking benefits">
        <div className="container feeding-proof-row">
          <p>
            <strong>Start in one tap.</strong>
            <span>Choose left or right and begin.</span>
          </p>
          <p>
            <strong>Fix it later.</strong>
            <span>Adjust a late start or add a feed.</span>
          </p>
          <p>
            <strong>Ready to review.</strong>
            <span>See history, patterns, or export a PDF.</span>
          </p>
        </div>
      </section>

      <section id="how-it-works" className="feeding-section">
        <div className="container">
          <Reveal className="feeding-section-heading">
            <p className="eyebrow">made for the first weeks</p>
            <h2>Less to remember when feeds blur together.</h2>
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
            <p className="eyebrow">the feed stays within reach</p>
            <h2>Check the timer where you already look.</h2>
            <p>
              Start and stop on Apple Watch when your phone is elsewhere. The watch works offline
              and sends completed feeds back when your devices reconnect.
            </p>
            <p>
              On iPhone, the Home Screen widget shows feeds completed today and the last side used.
              Live Activities and Dynamic Island keep an active feed visible without repeatedly
              reopening the app.
            </p>
            <Link
              className="feeding-text-link"
              to={canonicalPath(
                `${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}/breastfeeding-tracker-apple-watch`
              )}
            >
              Read the Apple Watch guide
            </Link>
          </Reveal>
          <Reveal className="feeding-feature-images" delayMs={100}>
            <img
              src={breastfeedingTrackerApp.screenshots[1].src}
              alt="Breastfeeding Tracker controls on iPhone"
            />
            <img
              src={breastfeedingTrackerApp.screenshots[2].src}
              alt="Breastfeeding Tracker feed history"
            />
          </Reveal>
        </div>
      </section>

      <section className="feeding-section">
        <div className="container feeding-history-layout">
          <Reveal className="feeding-history-images">
            <img
              src={breastfeedingTrackerApp.screenshots[3].src}
              alt="Breastfeeding Tracker session details"
            />
            <img
              src={breastfeedingTrackerApp.screenshots[4].src}
              alt="Private summaries created from recent feed history"
            />
          </Reveal>
          <Reveal className="feeding-feature-copy" delayMs={90}>
            <p className="eyebrow">for the feeds you forgot to time</p>
            <h2>Forgot to start? Fix it later.</h2>
            <p>
              If your baby latched before you remembered the timer, move the start time back. If
              the feed has already finished, add it from history. Exact seconds do not matter.
            </p>
            <p>
              Review recent history and private on-device summaries for visible patterns, then
              export selected feeds as a PDF for a midwife or feeding-support conversation. The
              summaries do not assess feeding, and the PDF only reflects what you recorded.
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
            <h2>Private, simple, and no pressure to track perfectly.</h2>
            <p>
              No account is required, there is no advertising profile, and the App Store privacy
              label says Data Not Collected. Use the tracker while it takes something off your
              mind, and leave it behind when you no longer need it.
            </p>
            <div className="feeding-inline-links">
              <Link to={canonicalPath("/privacy/breast-feeding-tracker")}>Read the privacy policy</Link>
              <Link
                to={canonicalPath(
                  `${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}/private-breastfeeding-tracker`
                )}
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
            <p className="eyebrow">help for the first weeks</p>
            <h2>Use the useful parts without turning feeding into homework.</h2>
            <p>Practical product guides without schedules, adequacy scoring, or medical advice.</p>
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
              Browse all guides
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="feeding-section feeding-faq">
        <div className="container feeding-faq-layout">
          <Reveal className="feeding-section-heading">
            <p className="eyebrow">frequently asked questions</p>
            <h2>Useful details without more mental load.</h2>
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
            <p className="eyebrow">ready for the first feeds</p>
            <h2>Start in one tap. Fix it later if you need to.</h2>
            <BreastfeedingTrackerAppStoreLink className="btn feeding-btn-primary" placement="footer">
              Download on the App Store
            </BreastfeedingTrackerAppStoreLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}

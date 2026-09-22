import { useState } from "react";
import { Link } from "react-router-dom";
import { BreastfeedingTrackerAppStoreLink } from "../components/AppStoreLink";
import { Seo } from "../components/Seo";
import { TrackerLanguageSelector } from "../components/TrackerLanguageSelector";
import {
  breastfeedingTrackerApp as app,
  breastfeedingTrackerAppStoreUrl,
  breastfeedingTrackerContent as content,
  breastfeedingTrackerFaqs
} from "../content/breastfeedingTracker";
import { BREASTFEEDING_TRACKER_BASE_PATH } from "../content/routes";
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { canonicalUrl } from "../seo/canonical";
import { siteConfig } from "../content/site";
import { trackerHreflangAlternates } from "../content/trackerLocales";
import { TrackerIcon as Icon } from "../components/TrackerIcon";

const siteUrl = getSiteUrl();
const editorial = content.editorial;
const appearanceModes = ["light", "dark"] as const;
const assetPath = "/assets/breastfeeding-editorial";
const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  ...content.softwareApplication,
  offer: undefined,
  url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl),
  image: `${siteUrl}${app.icon}`,
  downloadUrl: breastfeedingTrackerAppStoreUrl,
  offers: { "@type": "Offer", ...content.softwareApplication.offer }
};

function Phone({ screen, alt, className = "", priority = false, sizes = "(max-width: 600px) 44vw, 260px" }: {
  screen: string; alt: string; className?: string; priority?: boolean; sizes?: string;
}) {
  const priorityAttributes = priority ? { fetchpriority: "high" } : {};
  return (
    <div className={`bft-device ${className}`}>
      <img {...priorityAttributes} src={`${assetPath}/${screen}-660.webp`}
        srcSet={`${assetPath}/${screen}-360.webp 360w, ${assetPath}/${screen}-660.webp 660w`}
        sizes={sizes} alt={alt} width="1320" height="2868"
        loading={priority ? "eager" : "lazy"} decoding="async" />
    </div>
  );
}

function AppearancePreview({ device, appearance }: {
  device: "phone" | "tablet"; appearance: "light" | "dark";
}) {
  const isPhone = device === "phone";
  return (
    <div className={`${isPhone ? "bft-device" : "bft-tablet"} bft-appearance-preview`}>
      {appearanceModes.map((mode) => {
        const screen = `${isPhone ? "home" : "ipad-history"}-${mode}`;
        const label = mode === "light" ? editorial.screens.lightLabel : editorial.screens.darkLabel;
        return (
          <img key={mode} className="bft-appearance-screen" data-mode={mode}
            src={`${assetPath}/${screen}-${isPhone ? "660" : "1000"}.webp`}
            srcSet={isPhone ? `${assetPath}/${screen}-360.webp 360w, ${assetPath}/${screen}-660.webp 660w` : undefined}
            sizes={isPhone ? "(max-width: 760px) 31vw, 236px" : undefined}
            alt={appearance === mode ? `${isPhone ? editorial.screens.phoneAlt : editorial.screens.tabletAlt} — ${label}` : ""}
            aria-hidden={appearance !== mode}
            width={isPhone ? 1320 : 2064} height={isPhone ? 2868 : 2752}
            loading="lazy" decoding="async" />
        );
      })}
    </div>
  );
}

export function BreastfeedingTrackerLandingPage() {
  const [appearance, setAppearance] = useState<"light" | "dark">("light");
  return (
    <>
      <Seo path={BREASTFEEDING_TRACKER_BASE_PATH} meta={content.seo}
        alternates={trackerHreflangAlternates("landing", siteUrl)}
        jsonLd={[organizationJsonLd(), softwareApplicationJsonLd, faqPageJsonLd(breastfeedingTrackerFaqs),
          breadcrumbJsonLd([{ name: siteConfig.companyName, url: siteUrl }, { name: content.softwareApplication.name, url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl) }])]}
      />
      <section className="bft-editorial-hero" aria-labelledby="hero-heading">
        <div className="bft-container bft-editorial-hero-grid">
          <div className="bft-editorial-hero-copy">
            <TrackerLanguageSelector kind="landing" />
            <p className="bft-eyebrow">{content.hero.eyebrow}</p>
            <h1 id="hero-heading">{content.hero.heading}<em>{content.hero.headingEmphasis}</em></h1>
            <p className="bft-lead">{content.hero.body}</p>
            <BreastfeedingTrackerAppStoreLink className="bft-button" placement="hero">
              {content.hero.primaryCta}<Icon kind="arrow" />
            </BreastfeedingTrackerAppStoreLink>
            <p className="bft-store-note">{content.hero.storeNote}</p>
            <a className="bft-text-link bft-discover" href="#how-it-works">{content.hero.secondaryCta}<Icon kind="arrow" /></a>
          </div>
          <figure className="bft-editorial-scene">
            <img className="bft-lifestyle-photo" src={editorial.image.src}
              srcSet={`${editorial.image.smallSrc} 720w, ${editorial.image.src} 1200w`}
              sizes="(max-width: 760px) 94vw, 48vw" alt={editorial.image.alt}
              width="1200" height="1500" decoding="async" {...{ fetchpriority: "high" }} />
            <Phone screen="home-light" alt={content.hero.imageAlt} className="bft-scene-phone" priority />
          </figure>
        </div>
        <div className="bft-container bft-editorial-signoff">
          <p>{content.hero.caption}</p><span>{editorial.platforms}</span>
        </div>
      </section>

      <section className="bft-editorial-section" id="how-it-works" aria-labelledby="benefit-heading">
        <div className="bft-container bft-editorial-split">
          <div className="bft-editorial-copy">
            <p className="bft-eyebrow">{content.howItWorks.eyebrow}</p>
            <h2 id="benefit-heading">{content.howItWorks.heading}</h2>
            <p>{content.howItWorks.body}</p>
            <p className="bft-detail-note">{editorial.benefitNote}</p>
            <Link className="bft-text-link" to={content.careMethodsFeature.link.url}>{content.careMethodsFeature.link.label}<Icon kind="arrow" /></Link>
          </div>
          <div className="bft-editorial-duo">
            <Phone screen="home-light" alt={content.hero.imageAlt} />
            <Phone screen="history-light" alt={editorial.historyAlt} />
          </div>
        </div>
      </section>

      <section className="bft-editorial-section bft-night" aria-labelledby="everyday-heading">
        <div className="bft-container">
          <div className="bft-editorial-section-intro">
            <div><p className="bft-eyebrow">{content.everyday.eyebrow}</p><h2 id="everyday-heading">{content.everyday.heading}</h2></div>
            <p>{content.everyday.body}</p>
          </div>
          <div className="bft-night-grid">
            <div className="bft-night-product"><Phone screen="timer-dark" alt={editorial.timerAlt} /></div>
            <div className="bft-editorial-details">
              {content.everyday.items.map((item) => (
                <article key={item.title}>
                  <Icon kind={item.icon} />
                  <div><h3>{item.title}</h3><p>{item.body}</p></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bft-editorial-section" aria-labelledby="insights-heading">
        <div className="bft-container bft-editorial-split bft-insights-editorial">
          <div className="bft-insights-products">
            <Phone screen="timeline-light" alt={content.historyFeature.imageAlts[0]}
              sizes="(max-width: 520px) 218px, (max-width: 1100px) 237px, 20vw" />
            <Phone screen="insights-light" alt={content.historyFeature.imageAlts[1]}
              sizes="(max-width: 520px) 218px, (max-width: 1100px) 237px, 20vw" />
          </div>
          <div className="bft-editorial-copy">
            <p className="bft-eyebrow">{content.historyFeature.eyebrow}</p>
            <h2 id="insights-heading">{content.historyFeature.heading}</h2>
            {content.historyFeature.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <a className="bft-text-link" href={content.historyFeature.url}>{content.historyFeature.cta}<Icon kind="arrow" /></a>
            <p className="bft-detail-note">{editorial.insightsNote}</p>
          </div>
        </div>
      </section>

      <section className="bft-editorial-section bft-appearance" aria-labelledby="screens-heading">
        <div className="bft-container">
          <div className="bft-editorial-section-intro">
            <div><p className="bft-eyebrow">{editorial.screens.eyebrow}</p><h2 id="screens-heading">{editorial.screens.heading}</h2></div>
            <div><p>{editorial.screens.body}</p>
              <div className="bft-appearance-switch" role="group" aria-label={editorial.screens.switcherLabel}>
                <button type="button" aria-pressed={appearance === "light"} onClick={() => setAppearance("light")}>{editorial.screens.lightLabel}</button>
                <button type="button" aria-pressed={appearance === "dark"} onClick={() => setAppearance("dark")}>{editorial.screens.darkLabel}</button>
              </div>
            </div>
          </div>
          <div className="bft-device-collection" data-appearance={appearance}>
            <figure>
              <AppearancePreview device="phone" appearance={appearance} />
              <figcaption>{editorial.screens.phoneCaption}</figcaption>
            </figure>
            <figure>
              <AppearancePreview device="tablet" appearance={appearance} />
              <figcaption>{editorial.screens.tabletCaption}</figcaption>
            </figure>
          </div>
          <p className="bft-detail-note bft-appearance-note">{editorial.screens.note}</p>
        </div>
      </section>

      <section className="bft-editorial-section bft-founder" aria-labelledby="founder-heading">
        <div className="bft-container bft-editorial-split">
          <div><p className="bft-eyebrow">{editorial.founder.eyebrow}</p><h2 id="founder-heading">{editorial.founder.heading}</h2></div>
          <div className="bft-editorial-copy"><p>{editorial.founder.body}</p><p>{editorial.founder.closing}</p>
            <Link className="bft-text-link" to={editorial.founder.linkUrl}>{editorial.founder.linkLabel}<Icon kind="arrow" /></Link>
          </div>
        </div>
      </section>

      <section className="bft-section bft-faq-section" id="questions" aria-labelledby="faq-heading">
        <div className="bft-container bft-faq-grid">
          <div className="bft-section-heading"><p className="bft-eyebrow">{content.faqSection.eyebrow}</p><h2 id="faq-heading">{content.faqSection.heading}</h2><p>{content.faqSection.body}</p></div>
          <div className="bft-faq-list">{breastfeedingTrackerFaqs.map((item) => <details key={item.question}><summary>{item.question}<Icon kind="chevron" /></summary><p>{item.answer}</p></details>)}</div>
        </div>
      </section>
    </>
  );
}

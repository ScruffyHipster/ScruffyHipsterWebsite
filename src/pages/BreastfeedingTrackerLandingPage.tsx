import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BreastfeedingTrackerAppStoreLink } from "../components/AppStoreLink";
import { BreastfeedingTrackerWebApps } from "../components/BreastfeedingTrackerWebApps";
import { Seo } from "../components/Seo";
import {
  breastfeedingTrackerApp as app,
  breastfeedingTrackerAppStoreUrl
} from "../content/breastfeedingTracker";
import { BREASTFEEDING_TRACKER_BASE_PATH } from "../content/routes";
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { canonicalUrl } from "../seo/canonical";
import { siteConfig } from "../content/site";
import { localeForPath, localizedTrackerLocales, trackerLocalePath, trackerHreflangAlternates } from "../content/trackerLocales";
import { trackerLandingForPath, trackerLandingAssets } from "../content/trackerLanding";
import { localizedBreastfeedingTrackerAppStoreUrl } from "../analytics/appStoreClick";
import { TrackerIcon as Icon } from "../components/TrackerIcon";

const siteUrl = getSiteUrl();
const appearanceModes = ["light", "dark"] as const;
type EditorialScreens = ReturnType<typeof trackerLandingForPath>["editorial"]["screens"];

function Phone({ screen, alt, className = "", priority = false, sizes = "(max-width: 600px) 44vw, 260px" }: {
  screen: string; alt: string; className?: string; priority?: boolean; sizes?: string;
}) {
  const { pathname } = useLocation();
  const assetPath = trackerLandingAssets(pathname);
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

function AppearancePreview({ device, appearance, screens }: {
  device: "phone" | "tablet"; appearance: "light" | "dark"; screens: EditorialScreens;
}) {
  const { pathname } = useLocation();
  const assetPath = trackerLandingAssets(pathname);
  const isPhone = device === "phone";
  return (
    <div className={`${isPhone ? "bft-device" : "bft-tablet"} bft-appearance-preview`}>
      {appearanceModes.map((mode) => {
        const screen = `${isPhone ? "home" : "ipad-history"}-${mode}`;
        const label = mode === "light" ? screens.lightLabel : screens.darkLabel;
        return (
          <img key={mode} className="bft-appearance-screen" data-mode={mode}
            src={`${assetPath}/${screen}-${isPhone ? "660" : "1000"}.webp`}
            srcSet={isPhone ? `${assetPath}/${screen}-360.webp 360w, ${assetPath}/${screen}-660.webp 660w` : undefined}
            sizes={isPhone ? "(max-width: 760px) 31vw, 236px" : undefined}
            alt={appearance === mode ? `${isPhone ? screens.phoneAlt : screens.tabletAlt} — ${label}` : ""}
            aria-hidden={appearance !== mode}
            width={isPhone ? 1320 : 2064} height={isPhone ? 2868 : 2752}
            loading="lazy" decoding="async" />
        );
      })}
    </div>
  );
}

export function BreastfeedingTrackerLandingPage() {
  const { pathname } = useLocation();
  const content = trackerLandingForPath(pathname);
  const webApps = "webApps" in content ? content.webApps : null;
  const editorial = content.editorial;
  const locale = localeForPath(pathname);
  const localeConfig = localizedTrackerLocales.find((item) => item.locale === locale);
  const path = trackerLocalePath(locale, "landing") ?? BREASTFEEDING_TRACKER_BASE_PATH;
  const draft = Boolean(localeConfig && !localeConfig.enabled);
  const breastfeedingTrackerFaqs = content.faqs;
  const softwareApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    ...content.softwareApplication,
    offer: undefined,
    url: canonicalUrl(path, siteUrl),
    image: `${siteUrl}${app.icon}`,
    downloadUrl: locale === "en-GB" ? breastfeedingTrackerAppStoreUrl : localizedBreastfeedingTrackerAppStoreUrl(
      breastfeedingTrackerAppStoreUrl, locale, `site_${locale.slice(0, 2)}_tracker_landing`
    ),
    offers: { "@type": "Offer", ...content.softwareApplication.offer }
  };
  // Only the English page has this section until DE/FR translations and screenshots exist.
  const beyondFeeds = "beyondFeeds" in content ? content.beyondFeeds : undefined;
  const heroPlacards = "noteTop" in content.hero && "noteBottom" in content.hero
    ? [content.hero.noteTop, content.hero.noteBottom] : [];
  const [appearance, setAppearance] = useState<"light" | "dark">("light");
  return (
    <>
      <Seo path={path} meta={{ ...content.seo, ...(draft ? { robots: "noindex,nofollow" } : {}) }}
        locale={locale} ogLocale={localeConfig?.ogLocale ?? "en_GB"}
        alternates={trackerHreflangAlternates("landing", siteUrl)}
        jsonLd={[organizationJsonLd(), softwareApplicationJsonLd, faqPageJsonLd(breastfeedingTrackerFaqs),
          breadcrumbJsonLd([{ name: siteConfig.companyName, url: siteUrl }, { name: content.softwareApplication.name, url: canonicalUrl(path, siteUrl) }])]}
      />
      <section className="bft-editorial-hero" aria-labelledby="hero-heading">
        <div className="bft-container bft-editorial-hero-grid">
          <div className="bft-editorial-hero-copy">
            <h1 id="hero-heading">
              <span className="bft-eyebrow">{content.hero.eyebrow}</span>{" "}
              {content.hero.heading}{" "}<em>{content.hero.headingEmphasis}</em>
            </h1>
            <p className="bft-lead">{content.hero.body}</p>
            <p className="bft-hero-story">{content.hero.caption}</p>
          </div>
          <figure className="bft-editorial-product">
            {heroPlacards.map((note, index) => (
              <p key={note.label} className={`bft-hero-placard bft-hero-placard-${index}`}>
                <span>{note.label}</span><strong>{note.value}</strong>
              </p>
            ))}
            <Phone screen="home-light" alt={content.hero.imageAlt} className="bft-hero-product-phone" priority
              sizes="(max-width: 760px) 210px, 260px" />
            <figcaption>{editorial.platforms}</figcaption>
          </figure>
          <div className="bft-editorial-hero-actions">
            <BreastfeedingTrackerAppStoreLink className="bft-button" placement="hero">
              {content.hero.primaryCta}<Icon kind="arrow" />
            </BreastfeedingTrackerAppStoreLink>
            <p className="bft-store-note">{content.hero.storeNote}</p>
            {webApps ? <a className="bft-text-link bft-web-apps-hero-link" href="#web-apps">{webApps.heroCta}<Icon kind="arrow" /></a> : null}
            <a className="bft-text-link bft-discover" href="#how-it-works">{content.hero.secondaryCta}<Icon kind="arrow" /></a>
          </div>
        </div>
      </section>

      <section className="bft-editorial-section bft-founder" aria-labelledby="founder-heading">
        <div className="bft-container bft-editorial-split">
          <figure className="bft-founder-photo">
            <img className="bft-lifestyle-photo" src={editorial.image.src}
              srcSet={`${editorial.image.smallSrc} 720w, ${editorial.image.src} 1200w`}
              sizes="(max-width: 760px) 94vw, 48vw" alt={editorial.image.alt}
              width="1200" height="1500" loading="lazy" decoding="async" />
          </figure>
          <div className="bft-editorial-copy">
            <p className="bft-eyebrow">{editorial.founder.eyebrow}</p>
            <h2 id="founder-heading">{editorial.founder.heading}</h2>
            <p>{editorial.founder.body}</p><p>{editorial.founder.closing}</p>
            <Link className="bft-text-link" to={editorial.founder.linkUrl}>{editorial.founder.linkLabel}<Icon kind="arrow" /></Link>
          </div>
        </div>
      </section>

      {webApps ? <BreastfeedingTrackerWebApps content={webApps} /> : null}

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

      {beyondFeeds ? (
        <section className="bft-editorial-section bft-beyond" aria-labelledby="beyond-heading">
          <div className="bft-container">
            <div className="bft-editorial-section-intro">
              <div><p className="bft-eyebrow">{beyondFeeds.eyebrow}</p><h2 id="beyond-heading">{beyondFeeds.heading}</h2></div>
              <p>{beyondFeeds.body}</p>
            </div>
            <div className="bft-beyond-grid">
              {beyondFeeds.items.map((item) => (
                <article key={item.title}>
                  <div className="bft-beyond-product">
                    <Phone screen={item.screen} alt={item.imageAlt} sizes="(max-width: 760px) 220px, (max-width: 1100px) 28vw, 230px" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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

      <section className="bft-editorial-section bft-lifetime" id="lifetime-unlock" aria-labelledby="lifetime-heading">
        <div className="bft-container bft-editorial-split">
          <div><p className="bft-eyebrow">{content.privacy.eyebrow}</p><h2 id="lifetime-heading">{content.privacy.heading}</h2></div>
          <div className="bft-editorial-copy">
            <p>{content.privacy.body}</p>
            {content.privacy.links.map((link) => <Link className="bft-text-link" key={link.url} to={link.url}>{link.label}<Icon kind="arrow" /></Link>)}
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
              <AppearancePreview device="phone" appearance={appearance} screens={editorial.screens} />
              <figcaption>{editorial.screens.phoneCaption}</figcaption>
            </figure>
            <figure>
              <AppearancePreview device="tablet" appearance={appearance} screens={editorial.screens} />
              <figcaption>{editorial.screens.tabletCaption}</figcaption>
            </figure>
          </div>
          <p className="bft-detail-note bft-appearance-note">{editorial.screens.note}</p>
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

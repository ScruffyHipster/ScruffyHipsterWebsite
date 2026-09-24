import type { PropsWithChildren } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { BreastfeedingTrackerAppStoreLink } from "./AppStoreLink";
import { TrackerLanguageSelector } from "./TrackerLanguageSelector";
import { TrackerIcon } from "./TrackerIcon";
import {
  breastfeedingTrackerApp as app
} from "../content/breastfeedingTracker";
import {
  BREASTFEEDING_TRACKER_BASE_PATH
} from "../content/routes";
import { trackerLandingForPath } from "../content/trackerLanding";
import { localeForPath, trackerLocalePath, trackerContentForPath } from "../content/trackerLocales";
import { canonicalPath } from "../seo/canonical";
import "../pages/BreastfeedingTrackerLandingPage.css";
import "./BreastfeedingTrackerResources.css";
import "../pages/BreastfeedingTrackerEditorial.css";

export function BreastfeedingTrackerLayout({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const content = trackerLandingForPath(pathname);
  const basePath = trackerLocalePath(localeForPath(pathname), "landing") ?? BREASTFEEDING_TRACKER_BASE_PATH;
  const page = trackerContentForPath(pathname);
  const appStoreId = new URL(app.appStoreUrl).pathname.match(/\/id(\d+)(?:\/|$)/)?.[1];
  const placement = page?.kind === "blog" || page?.kind === "blogPost" || page?.kind === "editorialDisclosure"
    ? "blog" : page?.kind === "support" || page?.kind === "guide" ? "guide" : "hero";
  const homePath = canonicalPath(basePath);
  const currentPath = pathname.replace(/\/+$/, "");
  const isLanding = currentPath === basePath;
  const finalCta = isLanding ? content.editorial.finalCta : content.finalCta;
  const displayIcon = isLanding ? "/assets/breastfeeding-editorial/app-icon-128.webp" : app.icon;

  return (
    <div className={`bft-landing bft-site${isLanding ? " bft-premium" : ""}`}>
      {appStoreId ? (
        <Helmet>
          <meta name="apple-itunes-app" content={`app-id=${appStoreId}`} />
        </Helmet>
      ) : null}
      <a className="bft-skip-link" href="#feeding-content">
        {content.navigation.skipLabel}
      </a>
      <header className="bft-nav">
        <div className="bft-container bft-nav-inner">
          <Link className="bft-brand" to={homePath}>
            <img src={displayIcon} alt="" width="42" height="42" />
            <span>{content.navigation.brand}</span>
          </Link>
          <nav className="bft-nav-links" aria-label={content.navigation.ariaLabel}>
            {content.navigation.items.map((item) => {
              const itemPath = item.url.replace(/\/+$/, "");
              const isCurrent = currentPath === itemPath ||
                (itemPath !== basePath && currentPath.startsWith(`${itemPath}/`));
              return (
                <Link key={item.url} to={item.url} aria-current={isCurrent ? "page" : undefined}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="bft-nav-actions">
            <BreastfeedingTrackerAppStoreLink
              className="bft-button bft-button-small"
              placement={placement}
            >
              {content.navigation.downloadLabel}
              <TrackerIcon kind="arrow" />
            </BreastfeedingTrackerAppStoreLink>
            {page ? <TrackerLanguageSelector kind={page.kind} translationKey={page.translationKey} dropdown /> : null}
          </div>
        </div>
      </header>
      <main id="feeding-content" tabIndex={-1}>
        {children}
      </main>
      <section className="bft-final" aria-labelledby="download-heading">
        <div className="bft-container">
          <img src={displayIcon} alt="" width="64" height="64" loading="lazy" />
          <p className="bft-eyebrow">{finalCta.eyebrow}</p>
          <h2 id="download-heading">{finalCta.heading}</h2>
          <p>{finalCta.body}</p>
          <BreastfeedingTrackerAppStoreLink className="bft-button" placement="footer">
            {finalCta.label}
            <TrackerIcon kind="arrow" />
          </BreastfeedingTrackerAppStoreLink>
          <p className="bft-store-note">{finalCta.note}</p>
        </div>
      </section>
      <footer className="bft-footer">
        <div className="bft-container">
          <div className="bft-footer-top">
            <div className="bft-footer-brand">
              <Link className="bft-brand" to={homePath}>
                <img src={displayIcon} alt="" width="38" height="38" loading="lazy" />
                <span>{content.navigation.brand}</span>
              </Link>
              <p>{content.footer.body}</p>
            </div>
            <nav aria-label={content.footer.navigationLabel}>
              {content.footer.links.map((link) => (
                <Link key={link.url} to={link.url}>{link.label}</Link>
              ))}
            </nav>
          </div>
          <div className="bft-footer-bottom">
            <p>{content.footer.copyright}</p>
            <Link to="/about/">
              {content.footer.studioLabel}
              <TrackerIcon kind="arrow" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

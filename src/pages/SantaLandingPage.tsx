import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { appsBySlug } from "../content/apps";
import { appRoutePath } from "../content/routes";
import { siteConfig } from "../content/site";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { organizationJsonLd, softwareApplicationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import "./SantaLandingPage.css";

export function SantaLandingPage() {
  const app = appsBySlug.get("chat-with-santa");
  if (!app) return null;

  const path = appRoutePath(app);

  return (
    <div className="santa-page">
      <Seo
        path={path}
        meta={app.seo}
        jsonLd={[
          organizationJsonLd(),
          softwareApplicationJsonLd(app, canonicalUrl(path, getSiteUrl()))
        ]}
      />

      <header className="santa-header santa-container">
        <Link className="santa-brand" to={path}>
          <img src={app.icon} alt="" width="44" height="44" />
          <span>{app.name}</span>
        </Link>
        <Link className="santa-studio" to="/">{siteConfig.branding.name}</Link>
      </header>

      <main className="santa-hero santa-container">
        <div className="santa-copy">
          <p className="santa-eyebrow">{app.featureHeading}</p>
          <h1>{app.heroTitle}</h1>
          <p className="santa-intro">{app.tagline}</p>
          <a className="santa-store-link" href={app.appStoreUrl} target="_blank" rel="noopener noreferrer">
            {siteConfig.shared.appDetail.viewOnStore}
            <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <p className="santa-platform">{app.platformLabel}</p>
        </div>

        <div className="santa-screenshots" role="group" aria-label={siteConfig.shared.screenshotHeading}>
          {app.screenshots.map((screenshot) => (
            <figure className="santa-screen" key={screenshot.src}>
              <img
                src={screenshot.src}
                alt={screenshot.alt}
                width="1206"
                height="2622"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </main>

      <footer className="santa-footer santa-container">
        <span>{siteConfig.legalName}</span>
        <Link to={canonicalPath(`/privacy/${app.privacySlug}`)}>
          {siteConfig.shared.appDetail.readPrivacy}
        </Link>
      </footer>
    </div>
  );
}

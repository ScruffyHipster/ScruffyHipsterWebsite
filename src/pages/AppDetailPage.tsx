import type { CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { apps, appsBySlug } from "../content/apps";
import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { ScreenshotGallery } from "../components/ScreenshotGallery";
import { appRoutePath } from "../content/routes";
import { breadcrumbJsonLd, organizationJsonLd, softwareApplicationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";

export function AppDetailPage() {
  const params = useParams<{ slug: string }>();
  const app = params.slug ? appsBySlug.get(params.slug) : undefined;

  if (!app) {
    return <Navigate to="/" replace />;
  }

  const path = appRoutePath(app);
  const absoluteUrl = `${getSiteUrl()}${path}`;
  const relatedApps = apps.filter((candidate) => candidate.slug !== app.slug).slice(0, 3);
  const storeLinkMissing = app.appStoreUrl === "#";

  return (
    <>
      <Seo
        path={path}
        meta={app.seo}
        jsonLd={[
          organizationJsonLd(),
          softwareApplicationJsonLd(app, absoluteUrl),
          breadcrumbJsonLd([
            { name: "Scruffy Hipster", url: getSiteUrl() },
            { name: "Apps", url: `${getSiteUrl()}/#apps` },
            { name: app.name, url: absoluteUrl }
          ])
        ]}
      />

      <section className="section-block app-hero">
        <div className="container app-hero-grid">
          <Reveal>
            <div
              className="app-hero-card"
              style={
                {
                  "--accent-from": app.accent.from,
                  "--accent-via": app.accent.via,
                  "--accent-to": app.accent.to
                } as CSSProperties
              }
            >
              <img className="app-hero-icon" src={app.icon} alt={`${app.name} icon`} />
              <div>
                <p className="eyebrow">iOS App</p>
                <h1>{app.heroTitle}</h1>
                <p className="lead">{app.tagline}</p>
                <div className="hero-actions">
                  <a
                    className={`btn ${storeLinkMissing ? "btn-disabled" : "btn-primary"}`}
                    href={app.appStoreUrl}
                    target={storeLinkMissing ? undefined : "_blank"}
                    rel={storeLinkMissing ? undefined : "noopener noreferrer"}
                    aria-disabled={storeLinkMissing}
                  >
                    {storeLinkMissing ? "App Store link coming soon" : "View on the App Store"}
                  </a>
                  <a className="btn btn-secondary" href="#features">
                    See features
                  </a>
                </div>
                {app.privacySlug ? (
                  <p className="inline-link-row">
                    <Link to={`/privacy/${app.privacySlug}`}>Read privacy policy</Link>
                  </p>
                ) : (
                  <p className="inline-note">Privacy policy page coming soon.</p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="features" className="section-block section-pad">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Features</p>
            <h2>{app.featureHeading}</h2>
            <p>{app.featureIntro}</p>
          </Reveal>
          <div className="feature-grid">
            {app.features.map((feature, index) => (
              <Reveal key={feature.title} delayMs={Math.min(index * 65, 240)}>
                <article className="feature-card">
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <ScreenshotGallery screenshots={app.screenshots} title="Screenshots" />
      </div>

      <section className="section-block section-pad">
        <div className="container about-grid">
          <Reveal>
            <article className="glass-panel">
              <p className="eyebrow">Product Story</p>
              <h2>Why this app exists</h2>
              <p>{app.longDescription}</p>
              <p>{app.privacySummary}</p>
            </article>
          </Reveal>
          <Reveal delayMs={90}>
            <aside className="related-panel">
              <p className="eyebrow">More Apps</p>
              <h2>Explore other Scruffy Hipster products</h2>
              <ul className="related-list">
                {relatedApps.map((related) => (
                  <li key={related.id}>
                    <Link to={`/apps/${related.slug}`}>
                      <img src={related.icon} alt="" aria-hidden="true" />
                      <span>
                        <strong>{related.name}</strong>
                        <small>{related.shortDescription}</small>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}

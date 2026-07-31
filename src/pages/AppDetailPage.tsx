import type { CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { apps, appsBySlug } from "../content/apps";
import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { ScreenshotGallery } from "../components/ScreenshotGallery";
import { appRoutePath } from "../content/routes";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd, softwareApplicationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { siteConfig } from "../content/site";

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
  const labels = siteConfig.shared.appDetail;
  const appsLabel =
    siteConfig.navigation.items.find((item) => item.path === "/apps")?.label ??
    siteConfig.footer.appsHeading;

  return (
    <>
      <Seo
        path={path}
        meta={app.seo}
        jsonLd={[
          organizationJsonLd(),
          softwareApplicationJsonLd(app, absoluteUrl),
          ...(app.faqs?.length ? [faqPageJsonLd(app.faqs)] : []),
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: getSiteUrl() },
            { name: appsLabel, url: canonicalUrl("/apps", getSiteUrl()) },
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
              <img className="app-hero-icon" src={app.icon} alt={app.iconAlt} />
              <div>
                <p className="eyebrow">{app.platformLabel ?? labels.defaultPlatformLabel}</p>
                <h1>{app.heroTitle}</h1>
                <p className="lead">{app.tagline}</p>
                <div className="hero-actions">
                  {storeLinkMissing ? (
                    <button className="btn btn-disabled" type="button" disabled aria-disabled="true">
                      {labels.storeComingSoon}
                    </button>
                  ) : (
                    <a className="btn btn-primary" href={app.appStoreUrl} target="_blank" rel="noopener noreferrer">
                      {labels.viewOnStore}
                    </a>
                  )}
                  <a className="btn btn-secondary" href="#features">
                    {labels.seeFeatures}
                  </a>
                  {app.pressKit ? (
                    <a className="btn btn-secondary" href={app.pressKit.url} download>
                      {app.pressKit.label}
                    </a>
                  ) : null}
                </div>
                {app.pressKit ? <p className="inline-note">{app.pressKit.description}</p> : null}
                {app.privacySlug ? (
                  <p className="inline-link-row">
                    <Link to={canonicalPath(`/privacy/${app.privacySlug}`)}>
                      {labels.readPrivacy}
                    </Link>
                  </p>
                ) : (
                  <p className="inline-note">{labels.privacyComingSoon}</p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="features" className="section-block section-pad">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">{labels.featuresEyebrow}</p>
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

      {app.seoContent ? (
        <section className="section-block section-pad">
          <div className="container">
            <Reveal className="section-head">
              <p className="eyebrow">{app.seoContent.eyebrow ?? labels.detailEyebrow}</p>
              <h2>{app.seoContent.heading}</h2>
            </Reveal>
            <div className="about-grid">
              <Reveal>
                <article className="glass-panel">
                  {app.seoContent.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </article>
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {app.faqs?.length ? (
        <section className="section-block section-pad">
          <div className="container">
            <Reveal className="section-head">
              <p className="eyebrow">{labels.faqEyebrow}</p>
              <h2>{app.faqHeading ?? labels.faqHeading}</h2>
              {app.faqIntro ? <p>{app.faqIntro}</p> : null}
            </Reveal>
            <div className="feature-grid">
              {app.faqs.map((item, index) => (
                <Reveal key={item.question} delayMs={Math.min(index * 65, 240)}>
                  <article className="feature-card">
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="container">
        <ScreenshotGallery screenshots={app.screenshots} title={siteConfig.shared.screenshotHeading} />
      </div>

      <section className="section-block section-pad">
        <div className="container about-grid">
          <Reveal>
            <article className="glass-panel">
              <p className="eyebrow">{labels.whyEyebrow}</p>
              <h2>{labels.whyHeading}</h2>
              <p>{app.longDescription}</p>
              <p>{app.privacySummary}</p>
            </article>
          </Reveal>
          <Reveal delayMs={90}>
            <aside className="related-panel">
              <p className="eyebrow">{labels.moreAppsEyebrow}</p>
              <h2>{labels.moreAppsHeading}</h2>
              <ul className="related-list">
                {relatedApps.map((related) => (
                  <li key={related.id}>
                    <Link to={appRoutePath(related)}>
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

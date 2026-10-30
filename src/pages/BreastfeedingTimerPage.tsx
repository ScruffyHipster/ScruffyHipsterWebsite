import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { BreastfeedingTimer } from "../components/BreastfeedingTimer";
import { BreastfeedingTrackerAppStoreLink } from "../components/AppStoreLink";
import { Seo } from "../components/Seo";
import { breastfeedingTimerPageContent as page } from "../content/pages";
import { BREASTFEEDING_TRACKER_BASE_PATH } from "../content/routes";
import { siteConfig } from "../content/site";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import "./BreastfeedingTimerPage.css";

const featureIcons: Record<string, ReactNode> = {
  lock: <><rect x="6.5" y="2.5" width="11" height="19" rx="3" /><rect x="9.5" y="12" width="5" height="4" rx="1" /><path d="M10.5 12v-1.2a1.5 1.5 0 0 1 3 0V12" /></>,
  watch: <><rect x="6.5" y="6" width="11" height="12" rx="3" /><path d="M9 6V3h6v3M9 18v3h6v-3M12 9.5V12l1.5 1.2" /></>,
  drop: <path d="M12 3.5c3 4 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0c0-3 2.5-6 5.5-10z" />,
  cloud: <path d="M7.5 18.5h9.5a4 4 0 0 0 .6-7.95 5.5 5.5 0 0 0-10.6 1.2 3.4 3.4 0 0 0 .5 6.75z" />
};

function LineIcon({ children, size = 22 }: { children: ReactNode; size?: number }) {
  return (
    <svg className="bfw-line-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

export function BreastfeedingTimerPage() {
  const siteUrl = getSiteUrl();
  const trackerPath = canonicalPath(BREASTFEEDING_TRACKER_BASE_PATH);
  const pageUrl = canonicalUrl(page.route, siteUrl);

  return (
    <div className="bfw-page">
      <Seo
        path={page.route}
        meta={page.seo}
        jsonLd={[
          organizationJsonLd(),
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: page.webApplication.name,
            description: page.webApplication.description,
            url: pageUrl,
            applicationCategory: "HealthApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires JavaScript",
            isAccessibleForFree: true,
            featureList: page.webApplication.featureList,
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
            publisher: { "@type": "Organization", name: siteConfig.companyName, url: siteUrl }
          },
          faqPageJsonLd(page.faqs),
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: siteUrl },
            { name: page.breadcrumbs.tracker, url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl) },
            { name: page.breadcrumbs.timer, url: pageUrl }
          ])
        ]}
      />
      <Helmet>
        <meta name="theme-color" content="#efdbde" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#292327" media="(prefers-color-scheme: dark)" />
      </Helmet>

      <main>
        <BreastfeedingTimer copy={page.timer} appIcon={page.appIcon} aboutPath={trackerPath} howHref="#how" />

        <div className="bfw-content">
          <section id="how" className="bfw-section" aria-labelledby="bfw-how-title">
            <h2 id="bfw-how-title" className="bfw-heading">{page.how.heading}</h2>
            <p className="bfw-lead">{page.how.body}</p>
            <ol className="bfw-steps">
              {page.how.steps.map((step, index) => (
                <li className="bfw-card bfw-step" key={step.title}>
                  <span className="bfw-step-number" aria-hidden="true">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="bfw-card bfw-private" aria-labelledby="bfw-private-title">
            <span className="bfw-private-icon">
              <LineIcon>
                <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
                <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
              </LineIcon>
            </span>
            <div>
              <h2 id="bfw-private-title">{page.privacy.heading}</h2>
              <p>{page.privacy.body}</p>
            </div>
          </section>

          <section className="bfw-app" aria-labelledby="bfw-app-title">
            <img src={page.appIcon} alt="" width="72" height="72" loading="lazy" />
            <div className="bfw-app-intro">
              <h2 id="bfw-app-title" className="bfw-heading">{page.app.heading}</h2>
              <p className="bfw-lead">{page.app.body}</p>
            </div>
            <ul className="bfw-features">
              {page.app.features.map((feature) => (
                <li key={feature.icon}>
                  <span className="bfw-feature-icon">
                    <LineIcon>{featureIcons[feature.icon]}</LineIcon>
                  </span>
                  <span>{feature.label}</span>
                </li>
              ))}
            </ul>
            <BreastfeedingTrackerAppStoreLink className="bfw-press bfw-primary bfw-app-action" placement="timer-page">
              {page.app.action}
            </BreastfeedingTrackerAppStoreLink>
            <p className="bfw-note">{page.app.note}</p>
          </section>

          <section className="bfw-section bfw-faq-section" aria-labelledby="bfw-faq-title">
            <h2 id="bfw-faq-title" className="bfw-heading">{page.faqSection.heading}</h2>
            <div className="bfw-faqs">
              {page.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>
                    {faq.question}
                    <svg className="bfw-faq-chevron" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="bfw-footer">
        <p>{page.footer.note}</p>
        <nav aria-label={page.footer.navigationLabel}>
          {page.footer.links.map((link) => (
            <Link key={link.url} to={link.url}>{link.label}</Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}

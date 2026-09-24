import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { useTrackerResources } from "../content/trackerResources";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { siteConfig } from "../content/site";
import { trackerHreflangAlternates } from "../content/trackerLocales";

export function BreastfeedingTrackerSupportPage() {
  const {
    locale, ogLocale, robots, homePath, supportPath,
    supportPage: breastfeedingSupportPageContent, guides: breastfeedingTrackerGuides, supportEmailSubject
  } = useTrackerResources();
  const siteUrl = getSiteUrl();
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: breastfeedingSupportPageContent.collection.name,
    description: breastfeedingSupportPageContent.collection.description,
    url: canonicalUrl(supportPath, siteUrl),
    hasPart: breastfeedingTrackerGuides.map((guide) => ({
      "@type": "Article",
      headline: guide.title,
      url: canonicalUrl(`${supportPath}/${guide.slug}`, siteUrl)
    }))
  };

  return (
    <>
      <Seo
        locale={locale} ogLocale={ogLocale}
        path={breastfeedingSupportPageContent.route}
        meta={{ ...breastfeedingSupportPageContent.seo, robots }}
        alternates={trackerHreflangAlternates("support", siteUrl)}
        jsonLd={[
          organizationJsonLd(),
          collectionJsonLd,
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: siteUrl },
            {
              name: breastfeedingSupportPageContent.breadcrumbs.tracker,
              url: canonicalUrl(homePath, siteUrl)
            },
            {
              name: breastfeedingSupportPageContent.breadcrumbs.support,
              url: canonicalUrl(supportPath, siteUrl)
            }
          ])
        ]}
      />

      <section className="feeding-resource-hero feeding-resource-hero-centered bft-support-hero">
        <div className="container">
          <Reveal>
            <Link className="feeding-text-link" to={canonicalPath(homePath)}>
              {breastfeedingSupportPageContent.hero.backLabel}
            </Link>
            <p className="eyebrow">{breastfeedingSupportPageContent.hero.eyebrow}</p>
            <h1>{breastfeedingSupportPageContent.hero.heading}</h1>
            <p className="lead">{breastfeedingSupportPageContent.hero.body}</p>
          </Reveal>
        </div>
      </section>

      <section className="feeding-section feeding-support-topics">
        <div className="container">
          <Reveal className="feeding-section-heading">
            <h2>{breastfeedingSupportPageContent.topicsHeading}</h2>
          </Reveal>
          <div className="feeding-support-grid">
            {breastfeedingSupportPageContent.topics.map((topic: { label: string; body: string; slug: string }) => (
              <Reveal key={topic.slug}>
                <Link
                  className="feeding-support-card"
                  to={canonicalPath(`${supportPath}/${topic.slug}`)}
                >
                  <span aria-hidden="true">{breastfeedingSupportPageContent.topicIcon}</span>
                  <h3>{topic.label}</h3>
                  <p>{topic.body}</p>
                  <strong>{breastfeedingSupportPageContent.topicLinkLabel}</strong>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="feeding-section feeding-support-articles">
        <div className="container">
          <Reveal className="feeding-section-heading">
            <h2>{breastfeedingSupportPageContent.articlesHeading}</h2>
          </Reveal>
          <div className="feeding-guide-list feeding-guide-list-large">
            {breastfeedingTrackerGuides.map((guide, index) => (
              <Reveal key={guide.slug}>
                <Link
                  className="feeding-guide-row"
                  to={canonicalPath(`${supportPath}/${guide.slug}`)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{guide.title}</strong>
                  <small>{guide.excerpt}</small>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="feeding-support-contact">
        <div className="narrow-container">
          <Reveal>
            <p className="eyebrow">{breastfeedingSupportPageContent.contact.eyebrow}</p>
            <h2>{breastfeedingSupportPageContent.contact.heading}</h2>
            <p>{breastfeedingSupportPageContent.contact.body}</p>
            <a
              className="bft-button"
              href={`mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(supportEmailSubject)}`}
            >
              {breastfeedingSupportPageContent.contact.label}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

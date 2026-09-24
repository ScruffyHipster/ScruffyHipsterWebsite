import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { useTrackerResources } from "../content/trackerResources";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { getSiteUrl } from "../seo/metadata";
import { siteConfig } from "../content/site";
import { trackerHreflangAlternates } from "../content/trackerLocales";

export function BreastfeedingTrackerBlogDisclosurePage() {
  const {
    locale, ogLocale, robots, homePath, blogPath, disclosurePath,
    disclosurePage: breastfeedingBlogDisclosurePageContent, editorialEmailSubject
  } = useTrackerResources();
  const siteUrl = getSiteUrl();

  return (
    <>
      <Seo
        locale={locale} ogLocale={ogLocale}
        path={breastfeedingBlogDisclosurePageContent.route}
        meta={{ ...breastfeedingBlogDisclosurePageContent.seo, robots }}
        alternates={trackerHreflangAlternates("editorialDisclosure", siteUrl)}
        jsonLd={[
          organizationJsonLd(),
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: siteUrl },
            {
              name: breastfeedingBlogDisclosurePageContent.breadcrumbs.tracker,
              url: canonicalUrl(homePath, siteUrl)
            },
            {
              name: breastfeedingBlogDisclosurePageContent.breadcrumbs.blog,
              url: canonicalUrl(blogPath, siteUrl)
            },
            {
              name: breastfeedingBlogDisclosurePageContent.breadcrumbs.disclosure,
              url: canonicalUrl(disclosurePath, siteUrl)
            }
          ])
        ]}
      />
      <section className="feeding-resource-hero feeding-resource-hero-centered">
        <div className="narrow-container">
          <Reveal>
            <Link className="feeding-text-link" to={canonicalPath(blogPath)}>
              {breastfeedingBlogDisclosurePageContent.hero.backLabel}
            </Link>
            <p className="eyebrow">{breastfeedingBlogDisclosurePageContent.hero.eyebrow}</p>
            <h1>{breastfeedingBlogDisclosurePageContent.hero.heading}</h1>
            <p className="lead">{breastfeedingBlogDisclosurePageContent.hero.body}</p>
          </Reveal>
        </div>
      </section>
      <article className="feeding-disclosure-page">
        <div className="narrow-container">
          {breastfeedingBlogDisclosurePageContent.sections.map(
            (section: { heading: string; paragraphs: string[] }, index: number) => (
              <Reveal key={section.heading}>
                <section className={index === 0 ? "feeding-disclosure-summary" : undefined}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              </Reveal>
            )
          )}
          <Reveal className="feeding-disclosure-contact">
            <h2>{breastfeedingBlogDisclosurePageContent.contactHeading}</h2>
            <p>{breastfeedingBlogDisclosurePageContent.contactBody}</p>
            <a href={`mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(editorialEmailSubject)}`}>
              {breastfeedingBlogDisclosurePageContent.contactLabel}
            </a>
          </Reveal>
        </div>
      </article>
    </>
  );
}

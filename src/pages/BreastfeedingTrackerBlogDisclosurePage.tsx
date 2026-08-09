import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import {
  BREASTFEEDING_TRACKER_BASE_PATH,
  BREASTFEEDING_TRACKER_BLOG_BASE_PATH,
  BREASTFEEDING_TRACKER_BLOG_DISCLOSURE_PATH
} from "../content/routes";
import { breastfeedingBlogDisclosurePageContent } from "../content/pages";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { getSiteUrl } from "../seo/metadata";
import { siteConfig } from "../content/site";

export function BreastfeedingTrackerBlogDisclosurePage() {
  const siteUrl = getSiteUrl();

  return (
    <>
      <Seo
        path={breastfeedingBlogDisclosurePageContent.route}
        meta={breastfeedingBlogDisclosurePageContent.seo}
        jsonLd={[
          organizationJsonLd(),
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: siteUrl },
            {
              name: breastfeedingBlogDisclosurePageContent.breadcrumbs.tracker,
              url: canonicalUrl(BREASTFEEDING_TRACKER_BASE_PATH, siteUrl)
            },
            {
              name: breastfeedingBlogDisclosurePageContent.breadcrumbs.blog,
              url: canonicalUrl(BREASTFEEDING_TRACKER_BLOG_BASE_PATH, siteUrl)
            },
            {
              name: breastfeedingBlogDisclosurePageContent.breadcrumbs.disclosure,
              url: canonicalUrl(BREASTFEEDING_TRACKER_BLOG_DISCLOSURE_PATH, siteUrl)
            }
          ])
        ]}
      />
      <section className="feeding-resource-hero feeding-resource-hero-centered">
        <div className="narrow-container">
          <Reveal>
            <Link className="feeding-text-link" to={canonicalPath(BREASTFEEDING_TRACKER_BLOG_BASE_PATH)}>
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
            <a href={`mailto:${siteConfig.supportEmail}?subject=Blog%20editorial%20feedback`}>
              {breastfeedingBlogDisclosurePageContent.contactLabel}
            </a>
          </Reveal>
        </div>
      </article>
    </>
  );
}

import { Link, Navigate, useParams } from "react-router-dom";
import { BreastfeedingTrackerAppStoreLink } from "../components/AppStoreLink";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { useTrackerResources } from "../content/trackerResources";
import { TrackedMarkdownContent } from "../components/TrackedMarkdownContent";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { siteConfig } from "../content/site";
import { trackerHreflangAlternates } from "../content/trackerLocales";

export function BreastfeedingTrackerSupportArticlePage() {
  const {
    locale, ogLocale, robots, homePath, supportPath,
    content: breastfeedingTrackerContent, supportPage: breastfeedingSupportPageContent,
    supportTemplate, guides: breastfeedingTrackerGuides
  } = useTrackerResources();
  const breastfeedingTrackerOgImage = breastfeedingTrackerContent.seo.ogImage;
  const params = useParams<{ slug: string }>();
  const guide = params.slug ? breastfeedingTrackerGuides.find((article) => article.slug === params.slug) : undefined;

  if (!guide) {
    return <Navigate to={canonicalPath(supportPath)} replace />;
  }

  const siteUrl = getSiteUrl();
  const path = `${supportPath}/${guide.slug}`;
  const relatedGuides = breastfeedingTrackerGuides
    .filter((candidate) => candidate.slug !== guide.slug)
    .slice(0, 2);
  const template = supportTemplate;

  return (
    <>
      <Seo
        locale={locale} ogLocale={ogLocale}
        path={path}
        meta={{
          robots,
          title: guide.metaTitle || guide.title,
          description: guide.description,
          keywords: guide.tags,
          ogImage: guide.ogImage || breastfeedingTrackerOgImage,
          ...(guide.ogImageAlt ? { ogImageAlt: guide.ogImageAlt } : {})
        }}
        alternates={trackerHreflangAlternates("guide", siteUrl, guide.translationKey)}
        jsonLd={[
          organizationJsonLd(),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            datePublished: guide.publishedAt,
            ...(guide.updatedAt ? { dateModified: guide.updatedAt } : {}),
            image: `${siteUrl}${guide.ogImage || breastfeedingTrackerOgImage}`,
            url: canonicalUrl(path, siteUrl),
            author: {
              "@type": "Organization",
              name: siteConfig.companyName,
              url: siteUrl
            },
            about: {
              "@type": "SoftwareApplication",
              name: breastfeedingTrackerContent.softwareApplication.name,
              url: canonicalUrl(homePath, siteUrl)
            }
          },
          ...(guide.faqItems.length
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: guide.faqItems.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: item.answer
                    }
                  }))
                }
              ]
            : []),
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: siteUrl },
            {
              name: breastfeedingSupportPageContent.breadcrumbs.tracker,
              url: canonicalUrl(homePath, siteUrl)
            },
            {
              name: breastfeedingSupportPageContent.breadcrumbs.support,
              url: canonicalUrl(supportPath, siteUrl)
            },
            { name: guide.title, url: canonicalUrl(path, siteUrl) }
          ])
        ]}
      />

      <article className="feeding-article bft-help-article">
        <div className="narrow-container">
          <Reveal>
            <Link
              className="feeding-text-link"
              to={canonicalPath(supportPath)}
            >
              {template.backLabel}
            </Link>
            <p className="eyebrow">{template.eyebrow}</p>
            <h1>{guide.title}</h1>
            <p className="lead">{guide.description}</p>
          </Reveal>
          <Reveal delayMs={70} threshold={0.01}>
            <TrackedMarkdownContent
              className="feeding-article-body"
              html={guide.html}
              placement="guide"
            />
          </Reveal>
          {guide.showDefaultCta ? (
            <Reveal className="feeding-article-cta">
              <p className="eyebrow">{template.defaultCta.eyebrow}</p>
              <h2>{template.defaultCta.heading}</h2>
              <BreastfeedingTrackerAppStoreLink className="bft-button" placement="guide">
                {template.defaultCta.label}
              </BreastfeedingTrackerAppStoreLink>
            </Reveal>
          ) : null}
          <Reveal className="feeding-related-guides">
            <h2>{template.relatedHeading}</h2>
            {relatedGuides.map((related) => (
              <Link
                key={related.slug}
                to={canonicalPath(`${supportPath}/${related.slug}`)}
              >
                {related.title}
              </Link>
            ))}
          </Reveal>
        </div>
      </article>
    </>
  );
}

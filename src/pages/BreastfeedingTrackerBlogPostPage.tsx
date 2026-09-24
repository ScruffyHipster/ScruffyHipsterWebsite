import { Link, Navigate, useParams } from "react-router-dom";
import { BlogTableOfContents } from "../components/BlogTableOfContents";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { useTrackerResources } from "../content/trackerResources";
import { TrackedMarkdownContent } from "../components/TrackedMarkdownContent";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { canonicalPath, canonicalUrl } from "../seo/canonical";
import { getSiteUrl } from "../seo/metadata";
import { siteConfig } from "../content/site";
import { trackerHreflangAlternates } from "../content/trackerLocales";

export function BreastfeedingTrackerBlogPostPage() {
  const {
    locale, ogLocale, robots, homePath, blogPath, disclosurePath,
    content: breastfeedingTrackerContent, blogPage: breastfeedingBlogPageContent,
    posts: breastfeedingTrackerBlogPosts, formatDate: formatBreastfeedingArticleDate
  } = useTrackerResources();
  const breastfeedingTrackerOgImage = breastfeedingTrackerContent.seo.ogImage;
  const params = useParams<{ slug: string }>();
  const post = params.slug ? breastfeedingTrackerBlogPosts.find((article) => article.slug === params.slug) : undefined;

  if (!post) {
    return <Navigate to={canonicalPath(blogPath)} replace />;
  }

  const path = `${blogPath}/${post.slug}`;
  const siteUrl = getSiteUrl();
  const template = breastfeedingBlogPageContent.articleTemplate;
  const relatedPosts = breastfeedingTrackerBlogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 2);

  return (
    <>
      <Seo
        locale={locale} ogLocale={ogLocale}
        path={path}
        meta={{
          robots,
          title: post.metaTitle || post.title,
          description: post.description,
          keywords: post.tags,
          ogImage: post.ogImage || breastfeedingTrackerOgImage,
          ...(post.ogImageAlt ? { ogImageAlt: post.ogImageAlt } : {})
        }}
        alternates={trackerHreflangAlternates("blogPost", siteUrl, post.translationKey)}
        jsonLd={[
          organizationJsonLd(),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.publishedAt,
            ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
            image: `${siteUrl}${post.ogImage || breastfeedingTrackerOgImage}`,
            url: canonicalUrl(path, siteUrl),
            author: {
              "@type": "Person",
              name: template.authorName
            },
            publisher: {
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
          ...(post.faqItems.length
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: post.faqItems.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: { "@type": "Answer", text: item.answer }
                  }))
                }
              ]
            : []),
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: siteUrl },
            {
              name: breastfeedingBlogPageContent.breadcrumbs.tracker,
              url: canonicalUrl(homePath, siteUrl)
            },
            {
              name: breastfeedingBlogPageContent.breadcrumbs.blog,
              url: canonicalUrl(blogPath, siteUrl)
            },
            { name: post.title, url: canonicalUrl(path, siteUrl) }
          ])
        ]}
      />

      <article className="feeding-blog-article">
        <div className="container">
          <Reveal className="feeding-blog-article-header">
            <Link className="feeding-text-link" to={canonicalPath(blogPath)}>
              {template.backLabel}
            </Link>
            <p className="eyebrow">{post.category}</p>
            <h1>{post.title}</h1>
            <p className="lead">{post.description}</p>
            <p className="feeding-blog-byline">
              <strong>{template.authorName}</strong> {breastfeedingBlogPageContent.metaSeparator} {formatBreastfeedingArticleDate(post.publishedAt)} {breastfeedingBlogPageContent.metaSeparator} {post.readingMinutes} {breastfeedingBlogPageContent.readingTimeSuffix}
              {post.updatedAt
                ? ` ${breastfeedingBlogPageContent.metaSeparator} ${template.updatedLabel} ${formatBreastfeedingArticleDate(post.updatedAt)}`
                : ""}
            </p>
          </Reveal>
          <Reveal>
            <img
              className="feeding-blog-hero-image"
              src={post.ogImage || breastfeedingTrackerOgImage}
              alt={post.ogImageAlt || ""}
              width="1600"
              height="900"
              decoding="async"
            />
          </Reveal>
          <div className={`feeding-blog-article-layout${post.tableOfContents.length > 1 ? "" : " bft-article-without-toc"}`}>
            {post.tableOfContents.length > 1 ? (
              <BlogTableOfContents headings={post.tableOfContents} label={template.tocHeading} />
            ) : null}
            <div>
              <Reveal delayMs={70} threshold={0.01}>
                <TrackedMarkdownContent
                  className="feeding-article-body feeding-blog-article-body"
                  html={post.html}
                  placement="blog"
                />
              </Reveal>
              <Reveal className="feeding-blog-author-box">
                <p className="eyebrow">{template.aboutEyebrow}</p>
                <h2>{template.authorName}</h2>
                <p>{template.authorDescription}</p>
                <p>
                  {template.disclaimerPrefix} {" "}
                  <Link to={canonicalPath(disclosurePath)}>
                    {template.disclosureLinkLabel}
                  </Link>
                  .
                </p>
              </Reveal>
            </div>
          </div>
          <Reveal className="feeding-blog-related">
            <h2>{template.relatedHeading}</h2>
            <div>
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  to={canonicalPath(`${blogPath}/${related.slug}`)}
                >
                  <span>{related.category}</span>
                  <strong>{related.title}</strong>
                  <small>{related.excerpt}</small>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </article>
    </>
  );
}

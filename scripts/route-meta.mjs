import { readFileSync } from "node:fs";
import { join } from "node:path";

const rootDir = new URL("../", import.meta.url).pathname;
const cms = readGeneratedJson("cms-content.json");
const rewireRating = readGeneratedJson("rewire-app-store-rating.json");
const {
  site,
  pages,
  apps,
  privacyPolicies,
  standardPages,
  rewire,
  breastfeedingTracker,
  rewireArticles,
  breastfeedingGuides
} = cms;

export const siteUrl =
  process.env.VITE_SITE_URL?.replace(/\/$/, "") || site.domain.replace(/\/$/, "");

const absoluteRouteUrl = (path) => {
  const canonicalPath = path === "/" ? "" : `${path.replace(/\/+$/, "")}/`;
  return `${siteUrl}${canonicalPath}`;
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.companyName,
  legalName: site.legalName,
  url: siteUrl,
  email: site.supportEmail
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.companyName,
  url: siteUrl,
  description: site.websiteDescription
};

const webPageJsonLd = (path, seo) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: seo.title,
  url: absoluteRouteUrl(path),
  description: seo.description
});

const softwareApplicationJsonLd = (app, path) => {
  const structuredData = app.structuredData || {};
  const featureList = structuredData.featureList || app.seoFeatureList;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    applicationCategory: app.applicationCategory || "MobileApplication",
    ...(structuredData.applicationSubCategory || app.seoApplicationSubCategory
      ? {
          applicationSubCategory:
            structuredData.applicationSubCategory || app.seoApplicationSubCategory
        }
      : {}),
    operatingSystem: app.operatingSystem || "iOS",
    description: structuredData.description || app.shortDescription,
    url: absoluteRouteUrl(path),
    image: `${siteUrl}${app.icon}`,
    ...(app.appStoreUrl !== "#" ? { downloadUrl: app.appStoreUrl } : {}),
    ...(featureList ? { featureList } : {}),
    ...(app.slug === "rewire" && typeof rewireRating.rating === "number"
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rewireRating.rating,
            ratingCount: rewireRating.ratingCount || 1,
            bestRating: 5,
            worstRating: 1
          }
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };
};

const blogPostingJsonLd = (post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.description,
  datePublished: post.publishedAt,
  ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
  image: `${siteUrl}${post.ogImage}`,
  url: absoluteRouteUrl(`/rewire/blog/${post.slug}`)
});

const articleJsonLd = (article, path) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  datePublished: article.publishedAt,
  ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
  image: `${siteUrl}${article.ogImage}`,
  url: absoluteRouteUrl(path),
  author: {
    "@type": "Organization",
    name: site.companyName,
    url: siteUrl
  },
  about: {
    "@type": "SoftwareApplication",
    name: breastfeedingTracker.softwareApplication.name,
    url: absoluteRouteUrl(breastfeedingTracker.route)
  }
});

const breadcrumbJsonLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

const faqPageJsonLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
});

const rewireSoftwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: rewire.softwareApplication.name,
  applicationCategory: rewire.softwareApplication.applicationCategory,
  applicationSubCategory: rewire.softwareApplication.applicationSubCategory,
  operatingSystem: rewire.appStoreFacts.minimumOsVersion,
  description: rewire.softwareApplication.description,
  url: absoluteRouteUrl(rewire.route),
  image: `${siteUrl}${rewire.seo.ogImage}`,
  downloadUrl: rewireRating.storeUrl || rewire.appStoreFacts.appStoreUrl,
  featureList: rewire.softwareApplication.featureList,
  offers: {
    "@type": "Offer",
    ...rewire.softwareApplication.offer
  },
  ...(typeof rewireRating.rating === "number"
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rewireRating.rating,
          ratingCount: rewireRating.ratingCount || 1,
          bestRating: 5,
          worstRating: 1
        }
      }
    : {})
};

const breastfeedingSoftwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: breastfeedingTracker.softwareApplication.name,
  applicationCategory: breastfeedingTracker.softwareApplication.applicationCategory,
  applicationSubCategory:
    breastfeedingTracker.softwareApplication.applicationSubCategory,
  operatingSystem: breastfeedingTracker.softwareApplication.operatingSystem,
  description: breastfeedingTracker.softwareApplication.description,
  url: absoluteRouteUrl(breastfeedingTracker.route),
  image: `${siteUrl}${apps.find((app) => app.slug === "breast-feeding-tracker")?.icon}`,
  downloadUrl: breastfeedingTracker.appStoreUrl,
  featureList: breastfeedingTracker.softwareApplication.featureList,
  offers: {
    "@type": "Offer",
    ...breastfeedingTracker.softwareApplication.offer
  }
};

const routes = [
  {
    path: pages.home.route,
    ...pages.home.seo,
    jsonLd: [organizationJsonLd, websiteJsonLd]
  },
  {
    path: pages.apps.route,
    ...pages.apps.seo,
    jsonLd: [
      organizationJsonLd,
      webPageJsonLd(pages.apps.route, pages.apps.seo)
    ]
  },
  {
    path: rewire.route,
    ...rewire.seo,
    jsonLd: [
      organizationJsonLd,
      rewireSoftwareJsonLd,
      faqPageJsonLd(rewire.faqs),
      breadcrumbJsonLd([
        { name: site.companyName, url: siteUrl },
        {
          name: apps.find((app) => app.slug === "rewire")?.name,
          url: absoluteRouteUrl(rewire.route)
        }
      ])
    ]
  },
  {
    path: pages["rewire-blog"].route,
    ...pages["rewire-blog"].seo,
    jsonLd: [
      organizationJsonLd,
      webPageJsonLd(pages["rewire-blog"].route, pages["rewire-blog"].seo),
      breadcrumbJsonLd([
        { name: site.companyName, url: siteUrl },
        {
          name: pages["rewire-blog"].breadcrumbs.rewire,
          url: absoluteRouteUrl(rewire.route)
        },
        {
          name: pages["rewire-blog"].breadcrumbs.blog,
          url: absoluteRouteUrl(pages["rewire-blog"].route)
        }
      ])
    ]
  },
  ...rewireArticles.map((post) => {
    const path = `/rewire/blog/${post.slug}`;
    return {
      path,
      title: post.metaTitle || `${post.title} | ${site.shared.rewireArticle.titleSuffix}`,
      description: post.description,
      ogImage: post.ogImage,
      ...(post.ogImageAlt ? { ogImageAlt: post.ogImageAlt } : {}),
      jsonLd: [
        organizationJsonLd,
        blogPostingJsonLd(post),
        breadcrumbJsonLd([
          { name: site.companyName, url: siteUrl },
          {
            name: pages["rewire-blog"].breadcrumbs.rewire,
            url: absoluteRouteUrl(rewire.route)
          },
          {
            name: pages["rewire-blog"].breadcrumbs.blog,
            url: absoluteRouteUrl(pages["rewire-blog"].route)
          },
          { name: post.title, url: absoluteRouteUrl(path) }
        ])
      ]
    };
  }),
  {
    path: breastfeedingTracker.route,
    ...breastfeedingTracker.seo,
    jsonLd: [
      organizationJsonLd,
      breastfeedingSoftwareJsonLd,
      faqPageJsonLd(breastfeedingTracker.faqs),
      breadcrumbJsonLd([
        { name: site.companyName, url: siteUrl },
        {
          name: breastfeedingTracker.softwareApplication.applicationSubCategory,
          url: absoluteRouteUrl(breastfeedingTracker.route)
        }
      ])
    ]
  },
  {
    path: pages["breastfeeding-guides"].route,
    ...pages["breastfeeding-guides"].seo,
    jsonLd: [
      organizationJsonLd,
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: pages["breastfeeding-guides"].collection.name,
        description: pages["breastfeeding-guides"].collection.description,
        url: absoluteRouteUrl(pages["breastfeeding-guides"].route),
        hasPart: breastfeedingGuides.map((guide) => ({
          "@type": "Article",
          headline: guide.title,
          url: absoluteRouteUrl(
            `${pages["breastfeeding-guides"].route}/${guide.slug}`
          )
        }))
      },
      breadcrumbJsonLd([
        { name: site.companyName, url: siteUrl },
        {
          name: pages["breastfeeding-guides"].breadcrumbs.tracker,
          url: absoluteRouteUrl(breastfeedingTracker.route)
        },
        {
          name: pages["breastfeeding-guides"].breadcrumbs.guides,
          url: absoluteRouteUrl(pages["breastfeeding-guides"].route)
        }
      ])
    ]
  },
  ...breastfeedingGuides.map((guide) => {
    const path = `${pages["breastfeeding-guides"].route}/${guide.slug}`;
    return {
      path,
      title: guide.metaTitle || guide.title,
      description: guide.description,
      ogImage: guide.ogImage,
      ...(guide.ogImageAlt ? { ogImageAlt: guide.ogImageAlt } : {}),
      jsonLd: [
        organizationJsonLd,
        articleJsonLd(guide, path),
        ...(guide.faqItems.length ? [faqPageJsonLd(guide.faqItems)] : []),
        breadcrumbJsonLd([
          { name: site.companyName, url: siteUrl },
          {
            name: pages["breastfeeding-guides"].breadcrumbs.tracker,
            url: absoluteRouteUrl(breastfeedingTracker.route)
          },
          {
            name: pages["breastfeeding-guides"].breadcrumbs.guides,
            url: absoluteRouteUrl(pages["breastfeeding-guides"].route)
          },
          { name: guide.title, url: absoluteRouteUrl(path) }
        ])
      ]
    };
  }),
  {
    path: pages.about.route,
    ...pages.about.seo,
    jsonLd: [
      organizationJsonLd,
      webPageJsonLd(pages.about.route, pages.about.seo)
    ]
  },
  ...apps
    .filter((app) => app.slug !== "breast-feeding-tracker")
    .map((app) => {
      const path = `/apps/${app.slug}`;
      const application = softwareApplicationJsonLd(app, path);
      return {
        path,
        ...app.seo,
        jsonLd: app.faqs?.length
          ? [
              organizationJsonLd,
              application,
              faqPageJsonLd(app.faqs),
              breadcrumbJsonLd([
                { name: site.companyName, url: siteUrl },
                {
                  name:
                    site.navigation.items.find((item) => item.path === "/apps")?.label ||
                    site.footer.appsHeading,
                  url: absoluteRouteUrl(pages.apps.route)
                },
                { name: app.name, url: absoluteRouteUrl(path) }
              ])
            ]
          : application
      };
    }),
  ...privacyPolicies.map((policy) => {
    const path = `/privacy/${policy.slug}`;
    return {
      path,
      ...policy.seo,
      ...(policy.slug === "surge-tracker"
        ? {
            jsonLd: [
              organizationJsonLd,
              breadcrumbJsonLd([
                { name: site.companyName, url: siteUrl },
                {
                  name: site.shared.privacyPolicy.breadcrumbLabel,
                  url: absoluteRouteUrl(path)
                },
                { name: policy.appName, url: absoluteRouteUrl(path) }
              ])
            ]
          }
        : {})
    };
  }),
  ...standardPages.map((page) => {
    const path = `/${page.slug}`;
    const faqs = page.sections
      .filter((section) => section.type === "faq")
      .flatMap((section) => section.items);
    return {
      path,
      ...page.seo,
      jsonLd: [
        organizationJsonLd,
        webPageJsonLd(path, page.seo),
        ...(faqs.length ? [faqPageJsonLd(faqs)] : []),
        breadcrumbJsonLd([
          { name: site.companyName, url: siteUrl },
          { name: page.title, url: absoluteRouteUrl(path) }
        ])
      ]
    };
  })
];

const seenPaths = new Set();
for (const route of routes) {
  if (seenPaths.has(route.path)) {
    throw new Error(`Duplicate generated public route "${route.path}".`);
  }
  seenPaths.add(route.path);
}

export const publicRoutes = routes;
export const notFoundRoute = {
  path: pages["not-found"].route,
  ...pages["not-found"].seo
};

const legacyPrivacyRedirects = [
  ["rewirePrivacyPolicy.html", "/privacy/rewire"],
  ["wrenPrivacyPolicy.html", "/privacy/wren"],
  ["smartyColoursPrivacyPolicy.html", "/privacy/smarty-colours"],
  ["chatWithSantaPrivacyPolicy.html", "/privacy/chat-with-santa"],
  ["breastFeedingTrackerPrivacyPolicy.html", "/privacy/breast-feeding-tracker"]
];

export const legacyRedirects = [
  ["/apps/breast-feeding-tracker", "/breastfeeding-tracker"],
  ["/pages/portfolio/rewire.html", "/apps/rewire"],
  ["/pages/portfolio/wren.html", "/apps/wren"],
  ["/pages/portfolio/smartycolours.html", "/apps/smarty-colours"],
  ["/pages/portfolio/groGuardian.html", "/apps/gro-guardian"],
  ["/pages/portfolio/chatWithSanta.html", "/apps/chat-with-santa"],
  ["/pages/portfolio/breastFeedingTracker.html", "/breastfeeding-tracker"],
  ["/pages/privacyPolicies/rewirePrivacyPolicy.html", "/privacy/rewire"],
  ["/pages/privacyPolicies/wrenPrivacyPolicy.html", "/privacy/wren"],
  ["/pages/privacyPolicies/smartyColoursPrivacyPolicy.html", "/privacy/smarty-colours"],
  ["/pages/privacyPolicies/chatWithSantaPrivacyPolicy.html", "/privacy/chat-with-santa"],
  [
    "/pages/privacyPolicies/breastFeedingTrackerPrivacyPolicy.html",
    "/privacy/breast-feeding-tracker"
  ],
  ...legacyPrivacyRedirects.map(([file, to]) => [`/pages/privacypolicy/${file}`, to]),
  ...legacyPrivacyRedirects.map(([file, to]) => [`/pages/privacyPolicy/${file}`, to]),
  ...legacyPrivacyRedirects.map(([file, to]) => [`/pages/privacypolicies/${file}`, to])
];

function readGeneratedJson(fileName) {
  const path = join(rootDir, "src", "generated", fileName);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(
      `Could not read generated content ${path}. Run npm run generate:content first.`,
      { cause: error }
    );
  }
}

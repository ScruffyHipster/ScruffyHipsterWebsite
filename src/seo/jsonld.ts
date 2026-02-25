import type { AppConfig } from "../content/types";
import { siteConfig } from "../content/site";

export const stringifyJsonLd = (value: object) => JSON.stringify(value);

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.companyName,
  legalName: siteConfig.legalName,
  url: siteConfig.domain,
  email: siteConfig.supportEmail
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.companyName,
  url: siteConfig.domain,
  description: siteConfig.description
});

export const softwareApplicationJsonLd = (app: AppConfig, url: string) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: app.name,
  applicationCategory: "MobileApplication",
  operatingSystem: "iOS",
  description: app.shortDescription,
  url,
  image: new URL(app.icon, siteConfig.domain).toString(),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  }
});

export const breadcrumbJsonLd = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});


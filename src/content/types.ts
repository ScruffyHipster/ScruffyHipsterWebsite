export type SeoMeta = {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
};

export type FeatureCard = {
  title: string;
  body: string;
};

export type Screenshot = {
  src: string;
  alt: string;
};

export type AppConfig = {
  id: string;
  slug: string;
  name: string;
  heroTitle: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  appStoreUrl: string;
  icon: string;
  screenshots: Screenshot[];
  featureHeading: string;
  featureIntro: string;
  features: FeatureCard[];
  privacySummary: string;
  privacySlug?: string;
  yearLabel: string;
  seo: SeoMeta;
  accent: {
    from: string;
    via: string;
    to: string;
  };
};

export type PrivacyPolicyConfig = {
  slug: string;
  appName: string;
  title: string;
  lastUpdated: string;
  htmlContent: string;
  seo: SeoMeta;
};

export type SiteConfig = {
  companyName: string;
  legalName: string;
  domain: string;
  supportEmail: string;
  helloEmail: string;
  defaultOgImage: string;
  tagline: string;
  description: string;
};


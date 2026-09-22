import localeManifest from "../generated/breastfeeding-tracker-locales.json";

export type SupportedLocale = "en-GB" | "de-DE" | "fr-FR";
export type TrackerContentKind =
  | "landing"
  | "blog"
  | "editorialDisclosure"
  | "support"
  | "privacy"
  | "blogPost"
  | "guide";

type LocaleManifest = {
  locale: Exclude<SupportedLocale, "en-GB">;
  languageTag: string;
  ogLocale: string;
  prefix: string;
  appStoreCountry: string;
  currency: "EUR";
  enabled: boolean;
  routes: {
    landing: string;
    blog: string;
    editorialDisclosure: string;
    support: string;
    privacy: string;
    blogPosts: Record<string, string>;
    guides: Record<string, string>;
  };
};

const localizedTrackers = localeManifest.locales as LocaleManifest[];

export const supportedLocales: SupportedLocale[] = ["en-GB", "de-DE", "fr-FR"];
export const localizedTrackerLocales = localizedTrackers;

export function localeForPath(pathname: string): SupportedLocale {
  const normalized = normalizePath(pathname);
  return (
    localizedTrackers.find((locale) => normalized === locale.prefix || normalized.startsWith(`${locale.prefix}/`))
      ?.locale ?? "en-GB"
  );
}

export function isBreastfeedingTrackerRoute(pathname: string) {
  const normalized = normalizePath(pathname);
  return (
    normalized === "/breastfeeding-tracker" ||
    normalized.startsWith("/breastfeeding-tracker/") ||
    localizedTrackers.some(
      (locale) => normalized === locale.prefix || normalized.startsWith(`${locale.prefix}/`)
    )
  );
}

export function appStoreCountryForLocale(locale: SupportedLocale) {
  return locale === "en-GB"
    ? "gb"
    : localizedTrackers.find((candidate) => candidate.locale === locale)?.appStoreCountry ?? "gb";
}

export function openLocalizedTrackerLocales() {
  return localizedTrackers.filter((locale) => locale.enabled);
}

export function trackerLocaleLabel(locale: SupportedLocale) {
  return (
    {
      "en-GB": "English",
      "de-DE": "Deutsch",
      "fr-FR": "Français"
    } satisfies Record<SupportedLocale, string>
  )[locale];
}

export function trackerLocalePath(
  locale: SupportedLocale,
  kind: TrackerContentKind,
  translationKey?: string
) {
  if (locale === "en-GB") {
    return englishTrackerPath(kind, translationKey);
  }
  const config = localizedTrackers.find((candidate) => candidate.locale === locale);
  if (!config) return null;

  const route = config.routes;
  if (kind === "blogPost") {
    const slug = translationKey ? route.blogPosts[translationKey] : undefined;
    return slug ? `${config.prefix}/${route.blog}/${slug}` : null;
  }
  if (kind === "guide") {
    const slug = translationKey ? route.guides[translationKey] : undefined;
    return slug ? `${config.prefix}/${route.support}/${slug}` : null;
  }
  const segment = route[kind as Exclude<TrackerContentKind, "blogPost" | "guide">];
  return segment ? `${config.prefix}/${segment}` : config.prefix;
}

export function trackerHreflangAlternates(
  kind: TrackerContentKind,
  siteUrl: string,
  translationKey?: string
) {
  const englishPath = trackerLocalePath("en-GB", kind, translationKey);
  if (!englishPath || openLocalizedTrackerLocales().length === 0) {
    return [];
  }
  const toAbsoluteUrl = (path: string) => `${siteUrl}${path === "/" ? "" : `${path}/`}`;
  const localized = openLocalizedTrackerLocales()
    .map((locale) => ({
      locale: locale.locale,
      path: trackerLocalePath(locale.locale, kind, translationKey)
    }))
    .filter((entry): entry is { locale: Exclude<SupportedLocale, "en-GB">; path: string } => Boolean(entry.path))
    .map((entry) => ({ locale: entry.locale, href: toAbsoluteUrl(entry.path) }));

  return [
    { locale: "en-GB", href: toAbsoluteUrl(englishPath) },
    ...localized,
    { locale: "x-default", href: toAbsoluteUrl(englishPath) }
  ];
}

function englishTrackerPath(kind: TrackerContentKind, translationKey?: string) {
  const base = "/breastfeeding-tracker";
  switch (kind) {
    case "landing":
      return base;
    case "blog":
      return `${base}/blog`;
    case "editorialDisclosure":
      return `${base}/blog/editorial-disclosure`;
    case "support":
      return `${base}/support`;
    case "privacy":
      return "/privacy/breast-feeding-tracker";
    case "blogPost":
      return translationKey ? `${base}/blog/${translationKey}` : null;
    case "guide":
      return translationKey ? `${base}/support/${translationKey}` : null;
  }
}

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

import { breastfeedingTrackerAppStoreUrl } from "../content/breastfeedingTracker";
import { appStoreCountryForLocale, localeForPath } from "../content/trackerLocales";
import { readLandingAttribution } from "./landingAttribution";
import { trackEvent } from "./telemetrydeck";

export type AppStorePlacement = "hero" | "feature" | "guide" | "blog" | "footer";

const breastfeedingTrackerAppId = "6754637800";

export function isBreastfeedingTrackerAppStoreHref(href: string) {
  try {
    const url = new URL(href, breastfeedingTrackerAppStoreUrl);
    return (
      url.hostname === "apps.apple.com" &&
      url.pathname.split("/").some((segment) => segment === `id${breastfeedingTrackerAppId}`)
    );
  } catch {
    return false;
  }
}

export function trackBreastfeedingTrackerAppStoreClick(
  path: string,
  placement: AppStorePlacement
) {
  const landing = readLandingAttribution();
  const locale = localeForPath(path);
  trackEvent("app_store_click", {
    app: "breastfeeding-tracker",
    path,
    placement,
    landing_path: landing?.landing_path,
    utm_source: landing?.utm_source,
    utm_medium: landing?.utm_medium,
    utm_campaign: landing?.utm_campaign,
    locale
  });
}

export function localizedBreastfeedingTrackerAppStoreUrl(
  baseUrl: string,
  locale: ReturnType<typeof localeForPath>,
  campaign: string
) {
  const url = new URL(baseUrl);
  const country = appStoreCountryForLocale(locale);
  url.pathname = /^\/[a-z]{2}\//.test(url.pathname)
    ? url.pathname.replace(/^\/[a-z]{2}\//, `/${country}/`)
    : `/${country}${url.pathname}`;
  url.searchParams.set("ct", campaign);
  return url.toString();
}

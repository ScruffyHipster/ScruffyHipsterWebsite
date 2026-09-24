import { breastfeedingTrackerContent } from "./breastfeedingTracker";
import { localeForPath, reviewableTrackerLocales } from "./trackerLocales";

export function trackerLandingForPath(pathname: string) {
  const locale = localeForPath(pathname);
  const translation = reviewableTrackerLocales().find((item) => item.locale === locale);
  return translation?.sourceContent.fixed.landing ?? breastfeedingTrackerContent;
}

export function trackerLandingAssets(pathname: string) {
  const content = trackerLandingForPath(pathname);
  return "screenshotAssetPath" in content ? content.screenshotAssetPath : "/assets/breastfeeding-editorial";
}

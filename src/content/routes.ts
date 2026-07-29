import { apps } from "./apps";
import { privacyPolicies } from "./privacyPolicies";
import type { AppConfig, PrivacyPolicyConfig } from "./types";
import { standardPages } from "./standardPages";
import { canonicalPath } from "../seo/canonical";

export const APP_BASE_PATH = "/apps";
export const PRIVACY_BASE_PATH = "/privacy";
export const REWIRE_BASE_PATH = "/rewire";
export const REWIRE_BLOG_BASE_PATH = `${REWIRE_BASE_PATH}/blog`;
export const BREASTFEEDING_TRACKER_BASE_PATH = "/breastfeeding-tracker";
export const BREASTFEEDING_TRACKER_GUIDES_BASE_PATH = `${BREASTFEEDING_TRACKER_BASE_PATH}/guides`;
export const LEGACY_BREASTFEEDING_TRACKER_PATH = "/apps/breast-feeding-tracker";
const legacyPrivacyRedirects: Array<{ file: string; to: string }> = [
  { file: "rewirePrivacyPolicy.html", to: "/privacy/rewire" },
  { file: "wrenPrivacyPolicy.html", to: "/privacy/wren" },
  { file: "smartyColoursPrivacyPolicy.html", to: "/privacy/smarty-colours" },
  { file: "chatWithSantaPrivacyPolicy.html", to: "/privacy/chat-with-santa" },
  { file: "breastFeedingTrackerPrivacyPolicy.html", to: "/privacy/breast-feeding-tracker" }
];

export const appRoutePath = (app: AppConfig) =>
  canonicalPath(
    app.slug === "breast-feeding-tracker"
      ? BREASTFEEDING_TRACKER_BASE_PATH
      : `${APP_BASE_PATH}/${app.slug}`
  );
export const privacyRoutePath = (policy: PrivacyPolicyConfig) =>
  canonicalPath(`${PRIVACY_BASE_PATH}/${policy.slug}`);

export const publicRoutePaths = [
  "/",
  canonicalPath(REWIRE_BASE_PATH),
  canonicalPath(REWIRE_BLOG_BASE_PATH),
  canonicalPath(BREASTFEEDING_TRACKER_GUIDES_BASE_PATH),
  canonicalPath(APP_BASE_PATH),
  canonicalPath("/about"),
  ...apps.map(appRoutePath),
  ...privacyPolicies.map(privacyRoutePath),
  ...standardPages.map((page) => canonicalPath(`/${page.slug}`))
];

export const legacyRedirects: Array<{ from: string; to: string }> = [
  { from: LEGACY_BREASTFEEDING_TRACKER_PATH, to: BREASTFEEDING_TRACKER_BASE_PATH },
  { from: "/pages/portfolio/rewire.html", to: "/apps/rewire" },
  { from: "/pages/portfolio/wren.html", to: "/apps/wren" },
  { from: "/pages/portfolio/smartycolours.html", to: "/apps/smarty-colours" },
  { from: "/pages/portfolio/groGuardian.html", to: "/apps/gro-guardian" },
  { from: "/pages/portfolio/chatWithSanta.html", to: "/apps/chat-with-santa" },
  { from: "/pages/portfolio/breastFeedingTracker.html", to: BREASTFEEDING_TRACKER_BASE_PATH },
  { from: "/pages/privacyPolicies/rewirePrivacyPolicy.html", to: "/privacy/rewire" },
  { from: "/pages/privacyPolicies/wrenPrivacyPolicy.html", to: "/privacy/wren" },
  { from: "/pages/privacyPolicies/smartyColoursPrivacyPolicy.html", to: "/privacy/smarty-colours" },
  { from: "/pages/privacyPolicies/chatWithSantaPrivacyPolicy.html", to: "/privacy/chat-with-santa" },
  { from: "/pages/privacyPolicies/breastFeedingTrackerPrivacyPolicy.html", to: "/privacy/breast-feeding-tracker" },
  ...legacyPrivacyRedirects.map(({ file, to }) => ({ from: `/pages/privacypolicy/${file}`, to })),
  ...legacyPrivacyRedirects.map(({ file, to }) => ({ from: `/pages/privacyPolicy/${file}`, to })),
  ...legacyPrivacyRedirects.map(({ file, to }) => ({ from: `/pages/privacypolicies/${file}`, to }))
];

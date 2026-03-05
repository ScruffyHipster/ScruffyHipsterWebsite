import { apps } from "./apps";
import { privacyPolicies } from "./privacyPolicies";
import type { AppConfig, PrivacyPolicyConfig } from "./types";

export const APP_BASE_PATH = "/apps";
export const PRIVACY_BASE_PATH = "/privacy";

export const appRoutePath = (app: AppConfig) => `${APP_BASE_PATH}/${app.slug}`;
export const privacyRoutePath = (policy: PrivacyPolicyConfig) => `${PRIVACY_BASE_PATH}/${policy.slug}`;

export const publicRoutePaths = [
  "/",
  ...apps.map(appRoutePath),
  ...privacyPolicies.map(privacyRoutePath)
];

export const legacyRedirects: Array<{ from: string; to: string }> = [
  { from: "/pages/portfolio/rewire.html", to: "/apps/rewire" },
  { from: "/pages/portfolio/wren.html", to: "/apps/wren" },
  { from: "/pages/portfolio/smartycolours.html", to: "/apps/smarty-colours" },
  { from: "/pages/portfolio/groGuardian.html", to: "/apps/gro-guardian" },
  { from: "/pages/portfolio/chatWithSanta.html", to: "/apps/chat-with-santa" },
  { from: "/pages/portfolio/breastFeedingTracker.html", to: "/apps/breast-feeding-tracker" },
  { from: "/pages/privacyPolicies/rewirePrivacyPolicy.html", to: "/privacy/rewire" },
  { from: "/pages/privacyPolicies/wrenPrivacyPolicy.html", to: "/privacy/wren" },
  { from: "/pages/privacyPolicies/smartyColoursPrivacyPolicy.html", to: "/privacy/smarty-colours" },
  { from: "/pages/privacyPolicies/chatWithSantaPrivacyPolicy.html", to: "/privacy/chat-with-santa" },
  { from: "/pages/privacyPolicies/breastFeedingTrackerPrivacyPolicy.html", to: "/privacy/breast-feeding-tracker" }
];

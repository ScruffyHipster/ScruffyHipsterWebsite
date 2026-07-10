import { appsBySlug } from "./apps";

const rewire = appsBySlug.get("rewire");

if (!rewire) {
  throw new Error("Rewire app config is missing.");
}

export const rewireApp = rewire;

export const rewireAppStoreFacts = {
  appStoreUrl: "https://apps.apple.com/us/app/app-blocker-focus-rewire/id6757722922",
  appId: "6757722922",
  bundleId: "com.scruffyhipster.rewireInterrupt",
  title: "App Blocker & Focus: Rewire",
  subtitle: "Interrupt Distractions",
  developer: "Scruffy Hipster Ltd",
  categories: ["Productivity", "Utilities"],
  price: "Free",
  hasInAppPurchases: true,
  version: "1.6.4",
  releaseDate: "2026-02-04",
  currentVersionReleaseDate: "2026-07-07",
  rating: 5,
  ratingCount: 1,
  minimumOsVersion: "iOS 26.1 or later",
  contentRating: "4+",
  privacyPolicyUrl: "https://scruffyhipster.com/privacy/rewire",
  appStorePrivacyPolicyUrl: "https://scruffyhipster.com/pages/privacyPolicies/rewirePrivacyPolicy.html",
  eulaUrl: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
  releaseNotes: "Multiple improvements and bug fixes",
  assetBasePath: "/assets/rewire/app-store"
};

export const rewireScreenshots = [
  {
    src: "/assets/rewire/app-store/screenshot-1.jpg",
    alt: "Rewire screenshot showing app and website blocking setup"
  },
  {
    src: "/assets/rewire/app-store/screenshot-2.jpg",
    alt: "Rewire screenshot showing a focused Screen Time blocking flow"
  },
  {
    src: "/assets/rewire/app-store/screenshot-3.jpg",
    alt: "Rewire screenshot showing an interruption before a distracting app opens"
  },
  {
    src: "/assets/rewire/app-store/screenshot-4.jpg",
    alt: "Rewire screenshot showing focus session controls"
  },
  {
    src: "/assets/rewire/app-store/screenshot-5.jpg",
    alt: "Rewire screenshot showing distraction and focus patterns"
  },
  {
    src: "/assets/rewire/app-store/screenshot-6.jpg",
    alt: "Rewire screenshot showing privacy-first focus settings"
  }
];

export const rewireShowcaseSections = [
  {
    eyebrow: "choose what to block",
    title: "pick the apps and websites that pull you away.",
    body:
      "Create focus sessions around the feeds, sites, games, and loops that usually cost you time. Rewire works with Apple's Screen Time controls, so blocking stays inside the safeguards iOS provides.",
    image: rewireScreenshots[0]
  },
  {
    eyebrow: "timed or always-on",
    title: "start a focus window that fits the moment.",
    body:
      "Use Rewire for a study block, a work session, a social media break, or a stricter always-on setup. The goal is useful friction where distraction usually runs on autopilot.",
    image: rewireScreenshots[1]
  },
  {
    eyebrow: "the interruption",
    title: "pause before a quick check becomes lost time.",
    body:
      "When you open something blocked, Rewire interrupts the habit loop and gives you a moment to decide what you actually want to do next.",
    image: rewireScreenshots[2]
  },
  {
    eyebrow: "patterns",
    title: "review the moments your attention drifted.",
    body:
      "Simple trends show blocked attempts, interruptions, and sessions without pretending to know the full story behind every moment.",
    image: rewireScreenshots[4]
  }
];

export const rewireGuidePages = [
  {
    slug: "how-to-block-apps-on-iphone",
    title: "How to Block Apps on iPhone",
    description: "Use Apple Screen Time or a blocker like Rewire to choose distracting apps, set a focus window, and add friction before opening them.",
    keyword: "how to block apps on iPhone"
  },
  {
    slug: "how-to-block-websites-on-iphone",
    title: "How to Block Websites on iPhone",
    description: "Block distracting websites on iPhone with Screen Time content restrictions or a focus tool that includes website blocking.",
    keyword: "how to block websites on iPhone"
  },
  {
    slug: "how-to-stop-doomscrolling",
    title: "How to Stop Doomscrolling",
    description: "Reduce doomscrolling by blocking repeat triggers, adding a pause before opening feeds, and reviewing when the habit shows up.",
    keyword: "how to stop doomscrolling"
  },
  {
    slug: "best-app-blocker-for-iphone",
    title: "Best App Blocker for iPhone",
    description: "Compare iPhone app blockers by privacy, Screen Time integration, strictness, setup speed, and how clearly they interrupt distractions.",
    keyword: "best app blocker for iPhone"
  },
  {
    slug: "screen-time-app-blocker",
    title: "Screen Time App Blocker",
    description: "Understand how Screen Time app blockers work on iPhone and why Apple safeguards matter for reliable, honest blocking.",
    keyword: "screen time app blocker"
  },
  {
    slug: "social-media-blocker-iphone",
    title: "Social Media Blocker for iPhone",
    description: "Block social media on iPhone with app and website rules that reduce quick checks without turning the whole phone off.",
    keyword: "social media blocker iPhone"
  },
  {
    slug: "focus-app-for-studying",
    title: "Focus App for Studying",
    description: "Choose a study focus app that blocks the right distractions, starts quickly, and keeps privacy and friction simple.",
    keyword: "focus app for studying"
  },
  {
    slug: "app-blocker-without-tracking",
    title: "App Blocker Without Tracking",
    description: "Look for an app blocker with no accounts, no ads, no personal data collection, and clear privacy promises.",
    keyword: "app blocker without tracking"
  }
];

export const rewireFaqs = [
  {
    question: "How do I block apps on iPhone?",
    answer:
      "You can block apps with Apple's Screen Time settings or use a Screen Time based blocker like Rewire to choose apps, start a session, and add an interruption before access.",
    guideSlug: "how-to-block-apps-on-iphone"
  },
  {
    question: "Can I block websites on iPhone too?",
    answer:
      "Yes. iPhone supports website restrictions through Screen Time, and Rewire can include distracting websites in focus sessions alongside apps.",
    guideSlug: "how-to-block-websites-on-iphone"
  },
  {
    question: "Can an app blocker help stop doomscrolling?",
    answer:
      "An app blocker can help by putting friction in front of the feed before a reflex turns into a long scroll. It should support the choice, not shame it.",
    guideSlug: "how-to-stop-doomscrolling"
  },
  {
    question: "What makes a good iPhone app blocker?",
    answer:
      "Look for clear app and website blocking, fast setup, privacy-first design, Apple Screen Time integration, and friction that happens at the moment distraction starts.",
    guideSlug: "best-app-blocker-for-iphone"
  },
  {
    question: "Does Rewire track personal data?",
    answer:
      "Rewire has no accounts, no ads, no personal data collection, and anonymous analytics only. It does not need cloud sync to block distractions.",
    guideSlug: "app-blocker-without-tracking"
  },
  {
    question: "Is Rewire free?",
    answer:
      "The US App Store listing shows Rewire as free with in-app purchases. The App Store is the final source for availability and pricing.",
    guideSlug: "screen-time-app-blocker"
  }
];

export const rewireSeoTargets = [
  "app blocker",
  "app blocker iPhone",
  "website blocker iPhone",
  "block apps on iPhone",
  "screen time blocker",
  "reduce screen time",
  "stop doomscrolling",
  "focus app iPhone"
];

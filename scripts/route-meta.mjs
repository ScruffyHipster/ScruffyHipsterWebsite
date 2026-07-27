import { readFileSync } from "node:fs";
import { join } from "node:path";

export const siteUrl = process.env.VITE_SITE_URL?.replace(/\/$/, "") || "https://scruffyhipster.com";
const absoluteRouteUrl = (path) => {
  const canonicalPath = path === "/" ? "" : `${path.replace(/\/+$/, "")}/`;
  return `${siteUrl}${canonicalPath}`;
};
const rootDir = new URL("../", import.meta.url).pathname;
const rewireBlog = readGeneratedJson("rewire-blog.json", { posts: [] });
const breastfeedingTrackerGuides = readGeneratedJson("breastfeeding-tracker-guides.json", {
  posts: []
});
const rewireRating = readGeneratedJson("rewire-app-store-rating.json", {
  rating: 5,
  ratingCount: 1,
  storeUrl: "https://apps.apple.com/us/app/app-blocker-focus-rewire/id6757722922"
});
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Scruffyhipster",
  legalName: "Scruffy Hipster Ltd.",
  url: siteUrl,
  email: "support@scruffyhipster.com"
};
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Scruffyhipster",
  url: siteUrl,
  description:
    "Independent Apple software studio building quiet tools for focus, recovery, habits, and everyday systems."
};
const webPageJsonLd = (path, title, description) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  url: absoluteRouteUrl(path),
  description
});
const softwareApplicationJsonLd = ({
  path,
  name,
  description,
  image,
  operatingSystem = "iOS",
  applicationCategory = "MobileApplication",
  applicationSubCategory,
  downloadUrl,
  featureList
}) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name,
  applicationCategory,
  ...(applicationSubCategory ? { applicationSubCategory } : {}),
  operatingSystem,
  description,
  url: absoluteRouteUrl(path),
  image: `${siteUrl}${image}`,
  ...(downloadUrl ? { downloadUrl } : {}),
  ...(featureList ? { featureList } : {}),
  ...(typeof rewireRating.rating === "number" && name === "Rewire"
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
});
const blogPostingJsonLd = (post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.description,
  datePublished: post.publishedAt,
  ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
  image: `${siteUrl}${post.ogImage || "/assets/rewire/app-store/rewire-icon.jpg"}`,
  url: absoluteRouteUrl(`/rewire/blog/${post.slug}`)
});
const articleJsonLd = (article, path) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  datePublished: article.publishedAt,
  ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
  image: `${siteUrl}${article.ogImage || "/assets/breastfeeding-tracker-og.png"}`,
  url: absoluteRouteUrl(path),
  author: {
    "@type": "Organization",
    name: "Scruffyhipster",
    url: siteUrl
  },
  about: {
    "@type": "SoftwareApplication",
    name: "Breastfeeding Tracker & Timer",
    url: absoluteRouteUrl("/breastfeeding-tracker")
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
const rewireLandingFaqs = [
  {
    question: "How do I block apps on iPhone?",
    answer:
      "You can block apps with Apple's Screen Time settings or use a Screen Time based blocker like Rewire to choose apps, start a session, and add an interruption before access."
  },
  {
    question: "Can I block websites on iPhone too?",
    answer:
      "Yes. iPhone supports website restrictions through Screen Time, and Rewire can include distracting websites in focus sessions alongside apps."
  },
  {
    question: "Can an app blocker help stop doomscrolling?",
    answer:
      "An app blocker can help by putting friction in front of the feed before a reflex turns into a long scroll. It should support the choice, not shame it."
  },
  {
    question: "What makes a good iPhone app blocker?",
    answer:
      "Look for clear app and website blocking, fast setup, privacy-first design, Apple Screen Time integration, and friction that happens at the moment distraction starts."
  },
  {
    question: "Does Rewire track personal data?",
    answer:
      "Rewire has no accounts, no ads, no personal data collection, and anonymous analytics only. It does not need cloud sync to block distractions."
  },
  {
    question: "Is Rewire free?",
    answer:
      "The US App Store listing shows Rewire as free with in-app purchases. The App Store is the final source for availability and pricing."
  }
];
const breastfeedingTrackerFaqs = [
  {
    question: "Is the app designed for a newborn’s first feeds?",
    answer:
      "Yes. Its quick left and right timer, recent history, widgets, and Apple Watch controls are designed to reduce the memory load of the first few weeks. You can keep using it for as long as it remains helpful."
  },
  {
    question: "Can I track breastfeeding from Apple Watch?",
    answer:
      "Yes. The companion Apple Watch app can start and stop feeds from your wrist and sync completed sessions back to iPhone."
  },
  {
    question: "Does the Apple Watch app work when my iPhone is unavailable?",
    answer:
      "Yes. The watch can keep recording while it is offline and send completed feeds back when the devices reconnect."
  },
  {
    question: "Can I add or correct a feed after it happened?",
    answer:
      "Yes. Feed history supports adding, editing, and deleting entries. You can also adjust a running timer when the feed began before you started it."
  },
  {
    question: "Can I share feed history with a midwife?",
    answer:
      "Yes. You can create a PDF from selected feed history and choose where to save or share it. The PDF only reflects what you recorded and is not a clinical report or a substitute for professional care."
  },
  {
    question: "Does the app require an account or subscription?",
    answer:
      "No account or subscription is required. The App Store lists the app as free with an optional lifetime in-app purchase."
  },
  {
    question: "Does the tracker provide medical advice?",
    answer:
      "No. It records the timing, duration, and side you enter. Its private on-device summaries are informational and do not assess feeding or replace professional care."
  }
];
const surgeTrackerFaqs = [
  {
    question: "Is Surge Tracker a contraction timer?",
    answer:
      "Yes. Surge Tracker times the same start, end, duration, and start-to-start information commonly associated with a contraction timer, while using the word surge throughout the app."
  },
  {
    question: "Does Surge Tracker tell me when to contact my care team?",
    answer:
      "No. Surge Tracker records timing data and can remind you when recent surges match values you entered. It does not recommend timings, diagnose labour, or tell you when to seek care. Contact your care team whenever you are concerned."
  },
  {
    question: "Can I record practice surges separately?",
    answer:
      "Yes. Practice sessions are kept separate from Labour sessions and are excluded from labour pattern evaluation."
  },
  {
    question: "How does the Surge Pattern reminder work?",
    answer:
      "You enter the maximum start-to-start time, minimum surge duration, and how long the pattern should be sustained. Surge Tracker checks completed surges against those user-chosen values and shows a factual reminder when they match."
  },
  {
    question: "Does my history sync between devices?",
    answer:
      "Yes. Surge Tracker stores records locally first and uses your private iCloud database to keep them synchronized across devices signed in to your Apple Account."
  },
  {
    question: "What is included in the optional lifetime unlock?",
    answer:
      "The timer, current session, Practice mode, custom patterns, and iCloud sync remain free. The lifetime unlock adds archived session history and selected-session PDF export."
  }
];
const legacyPrivacyRedirects = [
  ["rewirePrivacyPolicy.html", "/privacy/rewire"],
  ["wrenPrivacyPolicy.html", "/privacy/wren"],
  ["smartyColoursPrivacyPolicy.html", "/privacy/smarty-colours"],
  ["chatWithSantaPrivacyPolicy.html", "/privacy/chat-with-santa"],
  ["breastFeedingTrackerPrivacyPolicy.html", "/privacy/breast-feeding-tracker"]
];

export const publicRoutes = [
  {
    path: "/",
    title: "Scruffyhipster | Software for Intentional Computing",
    description:
      "Scruffyhipster is an independent Apple software studio building quiet tools for focus, recovery, habits, and everyday systems.",
    ogImage: "/og-default.png",
    jsonLd: [organizationJsonLd, websiteJsonLd]
  },
  {
    path: "/apps",
    title: "Apps | Scruffyhipster",
    description:
      "Practical Apple platform apps from Scruffyhipster for focus, recovery, habits, and everyday systems.",
    ogImage: "/og-default.png",
    jsonLd: [
      organizationJsonLd,
      webPageJsonLd(
        "/apps",
        "Apps | Scruffyhipster",
        "Practical Apple platform apps from Scruffyhipster for focus, recovery, habits, and everyday systems."
      )
    ]
  },
  {
    path: "/rewire",
    title: "Rewire | App Blocker for iPhone",
    description:
      "Rewire is an iPhone app and website blocker for reducing screen time, stopping doomscrolling, and interrupting distracting app opens.",
    ogImage: "/assets/rewire/app-store/rewire-icon.jpg",
    jsonLd: [
      organizationJsonLd,
      softwareApplicationJsonLd({
        path: "/rewire",
        name: "Rewire",
        description:
          "An iPhone app and website blocker that uses Apple Screen Time controls to interrupt distracting app and website opens.",
        image: "/assets/rewire/app-store/rewire-icon.jpg",
        applicationCategory: "ProductivityApplication",
        applicationSubCategory: "App Blocker",
        operatingSystem: "iOS 26.1 or later",
        downloadUrl: rewireRating.storeUrl || "https://apps.apple.com/us/app/app-blocker-focus-rewire/id6757722922",
        featureList: [
          "Block distracting apps and websites",
          "Interrupt impulsive app opens with a conscious pause",
          "Timed and always-on focus sessions",
          "Simple trends for blocked attempts and focus sessions",
          "Uses Apple Screen Time and Family Controls APIs",
          "No accounts, no ads, and no personal data collection"
        ]
      }),
      faqPageJsonLd(rewireLandingFaqs),
      breadcrumbJsonLd([
        { name: "Scruffyhipster", url: siteUrl },
        { name: "Rewire", url: absoluteRouteUrl("/rewire") }
      ])
    ]
  },
  {
    path: "/rewire/blog",
    title: "Rewire Blog | Scruffyhipster",
    description:
      "Notes from Rewire about focus, app blocking, intentional friction, Screen Time, and building calmer phone habits.",
    ogImage: "/assets/rewire/app-store/rewire-icon.jpg",
    jsonLd: [
      organizationJsonLd,
      webPageJsonLd(
        "/rewire/blog",
        "Rewire Blog | Scruffyhipster",
        "Notes from Rewire about focus, app blocking, intentional friction, Screen Time, and building calmer phone habits."
      ),
      breadcrumbJsonLd([
        { name: "Scruffyhipster", url: siteUrl },
        { name: "Rewire", url: absoluteRouteUrl("/rewire") },
        { name: "Blog", url: absoluteRouteUrl("/rewire/blog") }
      ])
    ]
  },
  ...rewireBlog.posts.map((post) => ({
    path: `/rewire/blog/${post.slug}`,
    title: `${post.title} | Rewire Blog`,
    description: post.description,
    ogImage: post.ogImage || "/assets/rewire/app-store/rewire-icon.jpg",
    jsonLd: [
      organizationJsonLd,
      blogPostingJsonLd(post),
      breadcrumbJsonLd([
        { name: "Scruffyhipster", url: siteUrl },
        { name: "Rewire", url: absoluteRouteUrl("/rewire") },
        { name: "Blog", url: absoluteRouteUrl("/rewire/blog") },
        { name: post.title, url: absoluteRouteUrl(`/rewire/blog/${post.slug}`) }
      ])
    ]
  })),
  {
    path: "/breastfeeding-tracker",
    title: "Newborn Breastfeeding Timer for iPhone & Apple Watch",
    description:
      "A simple breastfeeding timer for your newborn's first weeks. Track left and right, check widgets or Apple Watch, correct missed feeds, and export a PDF.",
    ogImage: "/assets/breastfeeding-tracker-og.png",
    jsonLd: [
      organizationJsonLd,
      softwareApplicationJsonLd({
        path: "/breastfeeding-tracker",
        name: "Breastfeeding Tracker & Timer",
        description:
          "A simple breastfeeding timer for a newborn's first feeds, with one-handed left and right tracking, widgets, Apple Watch controls, editable history, and PDF export.",
        image: "/assets/BreastFeedingIcon.png",
        operatingSystem: "iOS 26.0 or later; watchOS 26.0 or later",
        applicationCategory: "MedicalApplication",
        applicationSubCategory: "Breastfeeding Tracker",
        downloadUrl: "https://apps.apple.com/app/id6754637800",
        featureList: [
          "One-handed breastfeeding timer with left and right side tracking",
          "Apple Watch companion app with offline tracking and later sync",
          "Home Screen widget, Live Activities, and Dynamic Island",
          "Late-start adjustment and manual feed entry",
          "PDF export from selected feed history",
          "Private, informational on-device summaries",
          "No account or subscription required"
        ]
      }),
      faqPageJsonLd(breastfeedingTrackerFaqs),
      breadcrumbJsonLd([
        { name: "Scruffyhipster", url: siteUrl },
        {
          name: "Breastfeeding Tracker",
          url: absoluteRouteUrl("/breastfeeding-tracker")
        }
      ])
    ]
  },
  {
    path: "/breastfeeding-tracker/guides",
    title: "Newborn Breastfeeding Timer Guides for iPhone & Apple Watch",
    description:
      "Practical help for timing newborn feeds, remembering the last side, correcting missed entries, using Apple Watch, and exporting a PDF.",
    ogImage: "/assets/breastfeeding-tracker-og.png",
    jsonLd: [
      organizationJsonLd,
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Breastfeeding Tracker Guides",
        description:
          "Practical guides to timing, correcting, reviewing, and exporting newborn breastfeeding history without schedules or medical advice.",
        url: absoluteRouteUrl("/breastfeeding-tracker/guides"),
        hasPart: breastfeedingTrackerGuides.posts.map((guide) => ({
          "@type": "Article",
          headline: guide.title,
          url: absoluteRouteUrl(`/breastfeeding-tracker/guides/${guide.slug}`)
        }))
      },
      breadcrumbJsonLd([
        { name: "Scruffyhipster", url: siteUrl },
        {
          name: "Breastfeeding Tracker",
          url: absoluteRouteUrl("/breastfeeding-tracker")
        },
        {
          name: "Guides",
          url: absoluteRouteUrl("/breastfeeding-tracker/guides")
        }
      ])
    ]
  },
  ...breastfeedingTrackerGuides.posts.map((guide) => {
    const path = `/breastfeeding-tracker/guides/${guide.slug}`;
    return {
      path,
      title: guide.metaTitle || guide.title,
      description: guide.description,
      ogImage: guide.ogImage || "/assets/breastfeeding-tracker-og.png",
      ...(guide.ogImageAlt ? { ogImageAlt: guide.ogImageAlt } : {}),
      jsonLd: [
        organizationJsonLd,
        articleJsonLd(guide, path),
        ...(guide.faqItems?.length ? [faqPageJsonLd(guide.faqItems)] : []),
        breadcrumbJsonLd([
          { name: "Scruffyhipster", url: siteUrl },
          {
            name: "Breastfeeding Tracker",
            url: absoluteRouteUrl("/breastfeeding-tracker")
          },
          {
            name: "Guides",
            url: absoluteRouteUrl("/breastfeeding-tracker/guides")
          },
          { name: guide.title, url: absoluteRouteUrl(path) }
        ])
      ]
    };
  }),
  {
    path: "/about",
    title: "About | Scruffyhipster",
    description:
      "Scruffyhipster is an independent Apple software studio building quiet tools for focus, recovery, habits, and everyday systems.",
    ogImage: "/og-default.png",
    jsonLd: [
      organizationJsonLd,
      webPageJsonLd(
        "/about",
        "About | Scruffyhipster",
        "Scruffyhipster is an independent Apple software studio building quiet tools for focus, recovery, habits, and everyday systems."
      )
    ]
  },
  {
    path: "/apps/rewire",
    title: "App & Website Blocker: Rewire | iOS Focus App",
    description:
      "Rewire is an iPhone app and website blocker that uses Screen Time controls, intentional pauses, and simple focus trends.",
    ogImage: "/assets/rewire/app-store/rewire-icon.jpg",
    jsonLd: softwareApplicationJsonLd({
      path: "/apps/rewire",
      name: "Rewire",
      description:
        "An iPhone app and website blocker that helps reduce impulsive app and website use by adding friction where distraction starts.",
      image: "/assets/rewire/app-store/rewire-icon.jpg",
      downloadUrl: "https://apps.apple.com/us/app/app-blocker-focus-rewire/id6757722922",
      featureList: [
        "Create focus sessions by choosing apps and websites to block",
        "Intentional pauses when blocked apps are opened",
        "Simple charts for block and distraction patterns",
        "Always-on or timed focus sessions",
        "Uses Apple Screen Time and Family Controls APIs",
        "No accounts, no ads, and no personal data collection"
      ]
    })
  },
  {
    path: "/apps/wren",
    title: "Wren Workout Recovery Engine | MMA & Boxing Round Timer",
    description:
      "Wren is a native iOS round timer for MMA, boxing, and grappling with clear presets and reliable audio cues.",
    ogImage: "/og-default.png",
    jsonLd: softwareApplicationJsonLd({
      path: "/apps/wren",
      name: "Wren",
      description:
        "A native iOS round timer for boxing, MMA, and grappling, with clear presets and audio cues.",
      image: "/assets/WrenLogo-iOS-Dark-1024x1024@1x.png",
      downloadUrl: "https://apps.apple.com/gb/app/wren-boxing-mma-round-timer/id6741780168",
      featureList: [
        "Round timer for warm-up, rounds, rest, and cooldown",
        "MMA, boxing, and grappling presets",
        "Clear training audio cues",
        "Optional local session logs"
      ]
    })
  },
  {
    path: "/apps/smarty-colours",
    title: "Smarty Colours | Kids Colouring App for iPad",
    description:
      "Smarty Colours is a children's colouring app for iPad with themed packs, Apple Pencil support, and a calm kid-friendly interface.",
    ogImage: "/og-default.png",
    jsonLd: softwareApplicationJsonLd({
      path: "/apps/smarty-colours",
      name: "Smarty Colours",
      description:
        "A kids colouring app for iPad with Apple Pencil support, themed packs, and a simple interface.",
      image: "/assets/smartycoloursLogo.png",
      downloadUrl: "https://apps.apple.com/gb/app/smartycolours-colouring-pages/id6749013158",
      applicationSubCategory: "Kids Colouring App",
      featureList: [
        "Themed colouring packs",
        "Apple Pencil support",
        "Simple child-friendly interface",
        "Subscription content packs"
      ]
    })
  },
  {
    path: "/apps/gro-guardian",
    title: "Gro Guardian | Simple Plant Care App",
    description:
      "Gro Guardian is a simple iPhone plant care app with watering reminders, a live light meter, and scheduled tasks.",
    ogImage: "/og-default.png",
    jsonLd: softwareApplicationJsonLd({
      path: "/apps/gro-guardian",
      name: "Gro Guardian",
      description:
        "An iPhone plant care app with reminders, scheduled tasks, and a camera-based light meter.",
      image: "/assets/groGuardianLogo.png",
      applicationSubCategory: "Plant Care App",
      featureList: [
        "Plant care dashboard",
        "Watering reminders",
        "Camera-based light meter",
        "Scheduled plant care tasks"
      ]
    })
  },
  {
    path: "/apps/chat-with-santa",
    title: "Chat with Santa | Seasonal Holiday App",
    description:
      "Chat with Santa is a simple seasonal holiday chat app for families with friendly Santa conversations.",
    ogImage: "/og-default.png",
    jsonLd: softwareApplicationJsonLd({
      path: "/apps/chat-with-santa",
      name: "Chat with Santa",
      description:
        "A seasonal chat app with a child-friendly Santa experience and a simple family-first design.",
      image: "/assets/chatWithSantaLogo.png",
      applicationSubCategory: "Holiday App",
      featureList: [
        "Seasonal family chat interface",
        "Friendly Santa replies",
        "Voice and text input",
        "No advertising or tracking tools"
      ]
    })
  },
  {
    path: "/apps/standing-desk-timer",
    title: "Standing Desk Timer for macOS | Scruffyhipster",
    description:
      "Standing Desk Timer is a quiet macOS menu bar app for sit, stand, and movement reminders with local daily totals.",
    ogImage: "/og-default.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Standing Desk Timer",
      applicationCategory: "DesktopApplication",
      applicationSubCategory: "Standing Desk Timer",
      operatingSystem: "macOS",
      url: absoluteRouteUrl("/apps/standing-desk-timer"),
      image: `${siteUrl}/assets/StandingDeskIcon-iOS-Dark-1024x1024@1x.png`,
      description:
        "A macOS menu bar app for sit, stand, and movement reminders through the workday.",
      featureList: [
        "macOS menu bar sit and stand timer",
        "Configurable sit, stand, and movement intervals",
        "Standing desk posture reminders",
        "Regular notifications or full-screen reminder overlay",
        "Optional launch at login",
        "Local daily sitting, standing, and movement totals"
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      }
    }
  },
  {
    path: "/apps/surge-tracker",
    title: "Surge Tracker | Labour Contraction Timer for iPhone",
    description:
      "Surge Tracker is a calm iPhone timer for labour and practice surges, with recent averages, custom pattern reminders, iCloud history, and PDF export.",
    ogImage: "/assets/surgeTracker/icon.png",
    jsonLd: [
      organizationJsonLd,
      softwareApplicationJsonLd({
        path: "/apps/surge-tracker",
        name: "Surge Tracker",
        description:
          "A calm iPhone timer for labour and practice surges, with recent averages, custom pattern reminders, private iCloud history, and PDF export.",
        image: "/assets/surgeTracker/icon.png",
        applicationCategory: "HealthApplication",
        applicationSubCategory: "Labour Contraction Timer",
        featureList: [
          "Tap or hold surge timing",
          "Recent surge duration and start-to-start averages",
          "User-chosen surge pattern reminders",
          "Optional sensation intensity recording",
          "Separate Labour and Practice session history",
          "Private iCloud sync",
          "Selected-session PDF reports and sharing"
        ]
      }),
      faqPageJsonLd(surgeTrackerFaqs),
      breadcrumbJsonLd([
        { name: "Scruffyhipster", url: siteUrl },
        { name: "Apps", url: absoluteRouteUrl("/apps") },
        { name: "Surge Tracker", url: absoluteRouteUrl("/apps/surge-tracker") }
      ])
    ]
  },
  {
    path: "/privacy/rewire",
    title: "Rewire Privacy Policy | Scruffyhipster",
    description: "Read the privacy policy for Rewire by Scruffyhipster.",
    ogImage: "/og-default.png"
  },
  {
    path: "/privacy/wren",
    title: "Wren Privacy Policy | Scruffyhipster",
    description: "Read the privacy policy for Wren by Scruffyhipster.",
    ogImage: "/og-default.png"
  },
  {
    path: "/privacy/smarty-colours",
    title: "Smarty Colours Privacy Policy | Scruffyhipster",
    description: "Read the privacy policy for Smarty Colours by Scruffyhipster.",
    ogImage: "/og-default.png"
  },
  {
    path: "/privacy/chat-with-santa",
    title: "Chat with Santa Privacy Policy | Scruffyhipster",
    description: "Read the privacy policy for Chat with Santa by Scruffyhipster.",
    ogImage: "/og-default.png"
  },
  {
    path: "/privacy/standing-desk-timer",
    title: "Standing Desk Timer Privacy Policy | Scruffyhipster",
    description: "Read the privacy policy for Standing Desk Timer by Scruffyhipster.",
    ogImage: "/og-default.png"
  },
  {
    path: "/privacy/breast-feeding-tracker",
    title: "Breast Feeding Tracker Privacy Policy | Scruffyhipster",
    description: "Read the privacy policy for Breast Feeding Tracker by Scruffyhipster.",
    ogImage: "/og-default.png"
  },
  {
    path: "/privacy/surge-tracker",
    title: "Surge Tracker Privacy Policy | Scruffyhipster",
    description: "Read the privacy policy for Surge Tracker by Scruffyhipster.",
    ogImage: "/assets/surgeTracker/icon.png",
    jsonLd: [
      organizationJsonLd,
      breadcrumbJsonLd([
        { name: "Scruffyhipster", url: siteUrl },
        { name: "Privacy", url: absoluteRouteUrl("/privacy/surge-tracker") },
        { name: "Surge Tracker", url: absoluteRouteUrl("/privacy/surge-tracker") }
      ])
    ]
  }
];

function readGeneratedJson(fileName, fallback) {
  try {
    return JSON.parse(readFileSync(join(rootDir, "src", "generated", fileName), "utf8"));
  } catch {
    return fallback;
  }
}

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
  ["/pages/privacyPolicies/breastFeedingTrackerPrivacyPolicy.html", "/privacy/breast-feeding-tracker"],
  ...legacyPrivacyRedirects.map(([file, to]) => [`/pages/privacypolicy/${file}`, to]),
  ...legacyPrivacyRedirects.map(([file, to]) => [`/pages/privacyPolicy/${file}`, to]),
  ...legacyPrivacyRedirects.map(([file, to]) => [`/pages/privacypolicies/${file}`, to])
];

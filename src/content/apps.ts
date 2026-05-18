import type { AppConfig } from "./types";

export const apps: AppConfig[] = [
  {
    id: "rewire",
    slug: "rewire",
    name: "Rewire",
    heroTitle: "Rewire",
    tagline:
      "Rewire adds a small pause before distraction becomes automatic.",
    shortDescription:
      "An iOS focus app that interrupts impulsive app opens with deliberate friction.",
    longDescription:
      "Rewire is built for the moment your hand moves faster than your intention. It uses Apple's Screen Time APIs to interrupt impulsive app opens and give you a brief chance to choose again.",
    appStoreUrl: "#",
    icon: "/assets/RewireIcon-iOS-Dark-1024x1024@1x.png",
    screenshots: [
      {
        src: "/assets/rewireScreenshots/6B10FF2E-73DB-42FE-B834-862E27356876_1_101_o.001.jpeg",
        alt: "Rewire focus interruption screen"
      },
      {
        src: "/assets/rewireScreenshots/A6467EF2-CA9A-49FE-AA4C-B7BB9345E689_1_101_o.002.jpeg",
        alt: "Rewire session setup screen"
      },
      {
        src: "/assets/rewireScreenshots/7FED24C9-11CA-428D-9E9C-EB0C3CE90C74_1_101_o.003.jpeg",
        alt: "Rewire app blocking screen"
      },
      {
        src: "/assets/rewireScreenshots/85904067-BAD0-4514-B44A-7B019DCBE459_1_101_o.004.jpeg",
        alt: "Rewire settings screen"
      },
      {
        src: "/assets/rewireScreenshots/B0C7FF92-D588-4969-A440-81C59F792667_1_101_o.005.jpeg",
        alt: "Rewire focus state screen"
      },
      {
        src: "/assets/rewireScreenshots/BF0DBF44-BF58-40E3-AEEA-0B2124ADEDC8_1_101_o.006.jpeg",
        alt: "Rewire focus completion screen"
      }
    ],
    featureHeading: "A pause at the point of distraction",
    featureIntro:
      "Rewire does not ask for motivation. It adds a small piece of structure where habits usually run on their own.",
    features: [
      {
        title: "Impulse Interruption",
        body: "When a blocked app is opened, Rewire creates a short pause before the next action."
      },
      {
        title: "System-Level Blocking",
        body: "Built on Apple’s Screen Time APIs, so the limit lives closer to the behaviour."
      },
      {
        title: "Always-On Focus Sessions",
        body: "Run open-ended or time-boxed sessions when you want a quieter phone."
      },
      {
        title: "Minimal by Design",
        body: "No feeds. No streak pressure. Just a tool that gets out of the way."
      }
    ],
    privacySummary:
      "Rewire is privacy-first and avoids advertising tracking. Focus sessions and app blocking decisions stay on-device.",
    privacySlug: "rewire",
    yearLabel: "2026",
    seo: {
      title: "Rewire | Focus, Reclaimed | Scruffy Hipster",
      description:
        "Rewire is an iOS focus app that adds deliberate friction before impulsive app opens.",
      keywords: ["Rewire app", "focus app iPhone", "screen time blocking", "productivity iOS"],
      ogImage: "/og-default.svg"
    },
    accent: { from: "#7fd8ff", via: "#7d99ff", to: "#b39bff" }
  },
  {
    id: "wren",
    slug: "wren",
    name: "Wren",
    heroTitle: "Wren: Workout Recovery Engine",
    tagline:
      "A clear round timer for training days that need rhythm, not clutter.",
    shortDescription:
      "A native iOS round timer for boxing, MMA, and grappling, with clear presets and audio cues.",
    longDescription:
      "Wren focuses on training flow: warm-up, rounds, rest, and cooldown. It is a dependable round timer first, with recovery features planned carefully rather than rushed in.",
    appStoreUrl: "https://apps.apple.com/gb/app/wren-boxing-mma-round-timer/id6741780168",
    icon: "/assets/WrenLogo-iOS-Dark-1024x1024@1x.png",
    screenshots: [
      { src: "/assets/wrenScreeshots/iPhone Screenshots 🇬🇧 03:10:25.001.jpeg", alt: "Wren round timer screen 1" },
      { src: "/assets/wrenScreeshots/iPhone Screenshots 🇬🇧 03:10:25.002.jpeg", alt: "Wren round timer screen 2" },
      { src: "/assets/wrenScreeshots/iPhone Screenshots 🇬🇧 03:10:25.003.jpeg", alt: "Wren round timer screen 3" },
      { src: "/assets/wrenScreeshots/iPhone Screenshots 🇬🇧 03:10:25.004.jpeg", alt: "Wren round timer screen 4" },
      { src: "/assets/wrenScreeshots/iPhone Screenshots 🇬🇧 03:10:25.005.jpeg", alt: "Wren round timer screen 5" },
      { src: "/assets/wrenScreeshots/iPhone Screenshots 🇬🇧 03:10:25.006.jpeg", alt: "Wren round timer screen 6" }
    ],
    featureHeading: "Training rhythm without extra noise",
    featureIntro:
      "Set the shape of the session, put the phone down, and let the timer do its job.",
    features: [
      {
        title: "Round Timer",
        body: "Warm-up, rounds, rest, and cooldown with a large countdown made for quick glances."
      },
      {
        title: "Discipline Presets",
        body: "Profiles for MMA, boxing, and grappling with configurable rounds, rest, and warnings."
      },
      {
        title: "Audio Cues",
        body: "Start, end, and warning sounds that are easy to understand mid-session."
      },
      {
        title: "Session Logs",
        body: "Optional local logs for people who want a simple record of training."
      }
    ],
    privacySummary:
      "Wren's MVP stores optional session logs locally. Future HealthKit features will require explicit permission.",
    privacySlug: "wren",
    yearLabel: "2026",
    seo: {
      title: "Wren Workout Recovery Engine | MMA & Boxing Round Timer",
      description:
        "Wren is a native iOS round timer for MMA, boxing, and grappling with clear presets and reliable audio cues.",
      keywords: ["MMA timer app", "boxing round timer", "grappling timer iPhone", "Wren app"],
      ogImage: "/og-default.svg"
    },
    accent: { from: "#9cf28d", via: "#67d4b6", to: "#7fd1ff" }
  },
  {
    id: "smarty-colours",
    slug: "smarty-colours",
    name: "Smarty Colours",
    heroTitle: "Smarty Colours",
    tagline:
      "A calm colouring app for iPad, made for focused creative play.",
    shortDescription:
      "A kids colouring app for iPad with Apple Pencil support, themed packs, and a simple interface.",
    longDescription:
      "Smarty Colours gives children a simple place to draw, colour, and settle into a page. The interface stays clear, the tools are easy to find, and Apple Pencil support keeps the experience feeling natural on iPad.",
    appStoreUrl: "https://apps.apple.com/gb/app/smartycolours-colouring-pages/id6749013158",
    icon: "/assets/smartycoloursLogo.png",
    screenshots: [
      { src: "/assets/smartyColoursScreenshots/iPhone Screenshots 🇬🇧 2.001.png", alt: "Smarty Colours home screen" },
      { src: "/assets/smartyColoursScreenshots/iPhone Screenshots 🇬🇧 2.002.png", alt: "Smarty Colours colouring screen" },
      { src: "/assets/smartyColoursScreenshots/iPhone Screenshots 🇬🇧 2.003.png", alt: "Smarty Colours pack selection screen 1" },
      { src: "/assets/smartyColoursScreenshots/iPhone Screenshots 🇬🇧 2.004.png", alt: "Smarty Colours pack selection screen 2" },
      { src: "/assets/smartyColoursScreenshots/iPhone Screenshots 🇬🇧 2.005.png", alt: "Smarty Colours pack selection screen 3" }
    ],
    featureHeading: "Creative play with fewer distractions",
    featureIntro:
      "The app keeps the tools obvious and the page central, so children can spend more time colouring.",
    features: [
      {
        title: "Themed Coloring Packs",
        body: "Original illustration packs with familiar subjects like animals, vehicles, robots, and dinosaurs."
      },
      {
        title: "Apple Pencil Support",
        body: "Natural drawing and colouring on iPad with Apple Pencil support."
      },
      {
        title: "Kid-Friendly Interface",
        body: "Big buttons, simple navigation, and little visual clutter."
      },
      {
        title: "Subscription Content",
        body: "A simple subscription provides the full set of packs and future additions."
      }
    ],
    privacySummary:
      "Smarty Colours collects no personal data and uses no analytics, ads, or tracking tools.",
    privacySlug: "smarty-colours",
    yearLabel: "2026",
    seo: {
      title: "Smarty Colours | Kids Colouring App for iPad",
      description:
        "Smarty Colours is a calm children's colouring app for iPad with themed packs, Apple Pencil support, and a simple interface.",
      keywords: ["kids colouring app", "iPad coloring app", "Apple Pencil children app", "Smarty Colours"],
      ogImage: "/og-default.svg"
    },
    accent: { from: "#ffd87a", via: "#ff9bcf", to: "#95c5ff" }
  },
  {
    id: "gro-guardian",
    slug: "gro-guardian",
    name: "Gro Guardian",
    heroTitle: "Gro Guardian",
    tagline:
      "A small plant care companion for watering, light, and regular attention.",
    shortDescription:
      "An iPhone plant care app with reminders, scheduled tasks, and a camera-based light meter.",
    longDescription:
      "Gro Guardian keeps plant care practical: water, rotate, feed, and check light. It is for people who like plants but do not want another complicated tracking system.",
    appStoreUrl: "#",
    icon: "/assets/groGuardianLogo.png",
    screenshots: [
      { src: "/assets/groGuardianScreenshots/GroGuardianimages.001.jpeg", alt: "Gro Guardian plant dashboard" },
      { src: "/assets/groGuardianScreenshots/GroGuardianimages.002.jpeg", alt: "Gro Guardian reminders screen" },
      { src: "/assets/groGuardianScreenshots/GroGuardianimages.003.jpeg", alt: "Gro Guardian light meter screen" },
      { src: "/assets/groGuardianScreenshots/GroGuardianimages.004.jpeg", alt: "Gro Guardian task scheduling screen" }
    ],
    featureHeading: "Plant care as a quiet routine",
    featureIntro:
      "Keep the next care task visible, use light as a guide, and let the routine stay small.",
    features: [
      {
        title: "Simple Plant Dashboard",
        body: "See each plant with its next useful action: water, rotate, feed, or check in."
      },
      {
        title: "Watering Reminders",
        body: "Simple schedules and reminders for care that is easy to forget."
      },
      {
        title: "Live Light Meter",
        body: "Use the camera to estimate light and make better placement decisions."
      },
      {
        title: "Scheduled Tasks",
        body: "Plan care, log completions, and keep the routine light."
      }
    ],
    privacySummary:
      "Gro Guardian uses camera access for the light meter and notifications for reminders. No ads or tracking are used.",
    yearLabel: "2025",
    seo: {
      title: "Gro Guardian | Simple Plant Care App",
      description:
        "Gro Guardian is a simple iPhone plant care app with watering reminders, a live light meter, and scheduled tasks.",
      keywords: ["plant care app", "watering reminders", "light meter app plants", "Gro Guardian"],
      ogImage: "/og-default.svg"
    },
    accent: { from: "#aef1a2", via: "#55dd9a", to: "#7cc8ff" }
  },
  {
    id: "chat-with-santa",
    slug: "chat-with-santa",
    name: "Chat with Santa",
    heroTitle: "Chat with Santa",
    tagline:
      "A small seasonal chat app for families during the holidays.",
    shortDescription:
      "A seasonal chat app with a child-friendly Santa experience and a simple family-first design.",
    longDescription:
      "Chat with Santa is a seasonal experiment built around a simple idea: a friendly holiday conversation, without turning the experience into a noisy feed or game.",
    appStoreUrl: "#",
    icon: "/assets/chatWithSantaLogo.png",
    screenshots: [
      { src: "/assets/chatWithSantaScreenshots/ChatWithSantaAppStoreScreenShots.001.jpeg", alt: "Chat with Santa chat screen 1" },
      { src: "/assets/chatWithSantaScreenshots/ChatWithSantaAppStoreScreenShots.002.jpeg", alt: "Chat with Santa chat screen 2" },
      { src: "/assets/chatWithSantaScreenshots/ChatWithSantaAppStoreScreenShots.003.jpeg", alt: "Chat with Santa chat screen 3" },
      { src: "/assets/chatWithSantaScreenshots/ChatWithSantaAppStoreScreenShots.004.jpeg", alt: "Chat with Santa chat screen 4" },
      { src: "/assets/chatWithSantaScreenshots/ChatWithSantaAppStoreScreenShots.005.jpeg", alt: "Chat with Santa chat screen 5" }
    ],
    featureHeading: "A lighter seasonal app",
    featureIntro:
      "A focused holiday chat experience with warm replies and a simple interface.",
    features: [
      {
        title: "Festive Chat Interface",
        body: "A clean seasonal UI with a little personality and not much else in the way."
      },
      {
        title: "AI Santa Replies",
        body: "Friendly responses written for warm, age-aware holiday conversations."
      },
      {
        title: "Voice and Text Input",
        body: "Type or speak messages for a simple hands-free option."
      },
      {
        title: "Private and Secure",
        body: "No advertising or tracking tools. Family trust is part of the design."
      }
    ],
    privacySummary:
      "Chat with Santa is designed to avoid analytics and advertising tracking, with conversations processed on-device.",
    privacySlug: "chat-with-santa",
    yearLabel: "2025",
    seo: {
      title: "Chat with Santa | Seasonal Holiday App",
      description:
        "Chat with Santa is a simple seasonal holiday chat app for families with friendly Santa conversations.",
      keywords: ["Chat with Santa app", "holiday app for kids", "Santa AI chat", "Christmas chat app"],
      ogImage: "/og-default.svg"
    },
    accent: { from: "#ffd1a6", via: "#ff8ea0", to: "#9bb1ff" }
  },
  {
    id: "standing-desk-timer",
    slug: "standing-desk-timer",
    name: "Standing Desk Timer",
    platformLabel: "macOS App",
    operatingSystem: "macOS",
    applicationCategory: "DesktopApplication",
    heroTitle: "Standing Desk Timer",
    tagline:
      "A quiet Mac menu bar timer for sit, stand, and movement habits.",
    shortDescription:
      "A macOS menu bar app for sit, stand, and movement reminders through the workday.",
    longDescription:
      "Standing Desk Timer is for people who own a sit-stand desk and still forget to use it. It keeps the current rhythm in the menu bar and gives clear prompts when it is time to switch.",
    appStoreUrl: "#",
    icon: "/assets/StandingDeskIcon-iOS-Dark-1024x1024@1x.png",
    screenshots: [
      { src: "/assets/standingDeskTimer/menu-bar-panel.png", alt: "Standing Desk Timer menu bar panel" },
      { src: "/assets/standingDeskTimer/onboarding-rhythm.png", alt: "Standing Desk Timer onboarding rhythm screen" },
      { src: "/assets/standingDeskTimer/onboarding-reminders.png", alt: "Standing Desk Timer reminders onboarding screen" },
      { src: "/assets/standingDeskTimer/reminder-overlay.png", alt: "Standing Desk Timer reminder overlay preview" }
    ],
    featureHeading: "A small rhythm for long workdays",
    featureIntro:
      "Start a posture cycle from the menu bar, get a prompt at the right time, and keep moving without adding another dashboard.",
    features: [
      {
        title: "Menu Bar Timer",
        body: "Start, pause, resume, reset, and switch posture from a compact menu bar panel."
      },
      {
        title: "Configurable Intervals",
        body: "Choose a preset rhythm or set your own sit, stand, and movement durations."
      },
      {
        title: "Posture Reminders",
        body: "Use regular macOS notifications or an overlay when it is time to stand, sit, move, snooze, or wrap up."
      },
      {
        title: "Daily Totals",
        body: "Track today’s sitting, standing, and movement time locally."
      }
    ],
    seoApplicationSubCategory: "Standing Desk Timer",
    seoFeatureList: [
      "macOS menu bar sit and stand timer",
      "Configurable sit, stand, and movement intervals",
      "Standing desk posture reminders",
      "Regular notifications or full-screen reminder overlay",
      "Optional launch at login",
      "Local daily sitting, standing, and movement totals"
    ],
    privacySummary:
      "Standing Desk Timer stores timer settings locally and uses limited anonymous TelemetryDeck analytics. No ads or cross-app tracking are used.",
    privacySlug: "standing-desk-timer",
    yearLabel: "2026",
    seo: {
      title: "Standing Desk Timer for macOS | Scruffy Hipster",
      description:
        "Standing Desk Timer is a quiet macOS menu bar app for sit, stand, and movement reminders with local daily totals.",
      keywords: [
        "standing desk timer",
        "macOS standing desk app",
        "sit stand timer Mac",
        "posture reminder macOS",
        "menu bar timer"
      ],
      ogImage: "/og-default.svg"
    },
    accent: { from: "#7bdff2", via: "#75f0b2", to: "#f7d774" }
  },
  {
    id: "breast-feeding-tracker",
    slug: "breast-feeding-tracker",
    name: "Breastfeeding Tracker & Timer",
    heroTitle: "Breastfeeding Tracker & Timer",
    tagline:
      "A fast feeding timer for iPhone and Apple Watch, built for tired hands and interrupted days.",
    shortDescription:
      "A breastfeeding tracker for iPhone and Apple Watch with a live timer, feed history, widgets, and private summaries.",
    longDescription:
      "Breastfeeding Tracker & Timer is built for the practical reality of feeding: one hand free, very little time, and no patience for fiddly logging. It keeps timing, side tracking, history, widgets, and private summaries close to hand.",
    appStoreUrl: "https://apps.apple.com/gb/app/breastfeeding-tracker-timer/id6754637800",
    icon: "/assets/BreastFeedingIcon.png",
    screenshots: [
      { src: "/assets/breastfeedingScreenShots/1.png", alt: "Breast Feeding Tracker home screen" },
      { src: "/assets/breastfeedingScreenShots/2.png", alt: "Breast Feeding Tracker feed logging screen" },
      { src: "/assets/breastfeedingScreenShots/3.png", alt: "Breast Feeding Tracker timeline screen" },
      { src: "/assets/breastfeedingScreenShots/4.png", alt: "Breast Feeding Tracker session detail screen" },
      { src: "/assets/breastfeedingScreenShots/5.png", alt: "Breast Feeding Tracker statistics screen" }
    ],
    featureHeading: "Fast logging when the moment is already busy",
    featureIntro:
      "Start quickly, save cleanly, and keep the useful details without turning feeding into admin.",
    features: [
      {
        title: "One-Tap Breastfeeding Timer",
        body: "Start a timer and choose left or right without digging through screens."
      },
      {
        title: "Live Feed Timer and Quick Save",
        body: "Keep the active feed visible, then stop and save without ceremony."
      },
      {
        title: "Feed History and Last Feed Summary",
        body: "Review timestamps, duration, side used, and the last feed at a glance."
      },
      {
        title: "Apple Watch Breastfeeding Tracking",
        body: "Start and stop feeds from Apple Watch, with offline use and sync when devices reconnect."
      },
      {
        title: "Widget, Live Activity, and Dynamic Island",
        body: "See the current timer and recent feeding context from the places you already check."
      },
      {
        title: "Private On-Device Feeding Insights",
        body: "See simple on-device summaries from recent feed history. Informational only, never medical advice."
      }
    ],
    seoApplicationSubCategory: "Breastfeeding Tracker",
    seoFeatureList: [
      "One-tap breastfeeding timer with left and right side tracking",
      "Live running timer during active feeds",
      "Apple Watch app for starting and stopping feeds",
      "Offline Apple Watch support with sync back to iPhone",
      "Feed history with timestamps, duration, and side used",
      "Home Screen widget showing feeds completed today and last side used",
      "Lock Screen Live Activity and Dynamic Island support",
      "Private on-device feeding insights from recent history"
    ],
    seoContent: {
      heading: "A breastfeeding tracker built for real-life feeding routines",
      paragraphs: [
        "Parents often search for a breastfeeding tracker for Apple Watch because they need to start or stop a feed without reaching for their phone. This app lets you track breastfeeding from your wrist, keeps active sessions synced with iPhone, and saves completed feeds when devices reconnect.",
        "It also works as a breastfeeding timer for iPhone with live progress on the Lock Screen and Dynamic Island, plus a widget that shows feeds completed today and the last side used. The result is faster logging, clearer history, and less mental load during busy feeding sessions.",
        "Recent feed data stays useful with private on-device summaries that highlight patterns like average duration, longest session, left and right balance, day versus night activity, and time between feeds. These insights are informational only and do not provide medical advice."
      ]
    },
    faqHeading: "Breastfeeding tracker FAQ",
    faqIntro:
      "These are the kinds of questions parents often ask when comparing breastfeeding trackers, breastfeeding timers, and Apple Watch feeding apps.",
    faqs: [
      {
        question: "Can I use this breastfeeding tracker on Apple Watch?",
        answer:
          "Yes. The app includes an Apple Watch companion app so you can start and stop feeds from your wrist, with active sessions and completed feeds syncing back to iPhone."
      },
      {
        question: "Does the Apple Watch app work offline?",
        answer:
          "Yes. You can use the watch app when your watch is offline, and the app syncs feeds when your iPhone reconnects."
      },
      {
        question: "Does it show a live breastfeeding timer on the Lock Screen?",
        answer:
          "Yes. The app supports Live Activities on the Lock Screen and Dynamic Island so you can keep an eye on an active feeding timer and the current side."
      },
      {
        question: "Can I see my recent feed history and last side used?",
        answer:
          "Yes. Feed history includes timestamps, duration, and side used, and the main screen highlights the last feed summary and the last side used for faster repeat logging."
      },
      {
        question: "Does the app include feeding insights?",
        answer:
          "Yes. The app creates private on-device summaries from recent history, including patterns like average duration, longest session, left and right balance, day versus night activity, and time between feeds."
      }
    ],
    privacySummary:
      "Breastfeeding Tracker & Timer is designed with privacy in mind. A dedicated privacy policy is available for full details.",
    privacySlug: "breast-feeding-tracker",
    yearLabel: "2026",
    seo: {
      title: "Breastfeeding Tracker & Timer for iPhone & Apple Watch",
      description:
        "A breastfeeding tracker and timer for iPhone and Apple Watch with feed history, widgets, Live Activities, and private on-device summaries.",
      keywords: [
        "breastfeeding tracker",
        "breast feeding tracker",
        "breastfeeding timer",
        "breastfeeding tracker apple watch",
        "breastfeeding tracker for apple watch",
        "baby feeding timer",
        "nursing tracker iphone",
        "feeding tracker widget"
      ],
      ogImage: "/og-default.svg"
    },
    accent: { from: "#ffd6e7", via: "#f7b5ff", to: "#8cd9ff" }
  }
];

export const appsBySlug = new Map(apps.map((app) => [app.slug, app]));

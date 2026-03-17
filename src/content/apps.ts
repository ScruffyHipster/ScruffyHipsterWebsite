import type { AppConfig } from "./types";

export const apps: AppConfig[] = [
  {
    id: "rewire",
    slug: "rewire",
    name: "Rewire",
    heroTitle: "Rewire",
    tagline:
      "Rewire helps you break impulsive phone habits by interrupting distraction at the moment it happens and redirecting attention back to what matters.",
    shortDescription:
      "An iOS focus app that uses system-level controls to interrupt impulsive app opens and support deliberate attention.",
    longDescription:
      "Rewire is designed to create deliberate friction at the point of distraction. Instead of relying on reminders or streaks, it uses Apple's Screen Time APIs to interrupt impulsive app opens and guide users back to their intended task.",
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
    featureHeading: "Designed to interrupt distraction, not just track it",
    featureIntro:
      "Rewire does not rely on motivation or streaks. It uses iOS system controls to create deliberate friction at the point of distraction.",
    features: [
      {
        title: "Impulse Interruption",
        body: "When a blocked app is opened, Rewire intercepts the action and forces a conscious pause before continuing."
      },
      {
        title: "System-Level Blocking",
        body: "Built on Apple’s Screen Time APIs, Rewire enforces limits at the OS level rather than fragile timers."
      },
      {
        title: "Always-On Focus Sessions",
        body: "Run open-ended or time-boxed sessions that continuously protect your attention throughout the day."
      },
      {
        title: "Minimal by Design",
        body: "No feeds, no gamified noise, and no emotional manipulation. Rewire stays out of the way and does its job."
      }
    ],
    privacySummary:
      "Rewire is privacy-first and avoids advertising tracking. Focus sessions and app blocking decisions stay on-device.",
    privacySlug: "rewire",
    yearLabel: "2026",
    seo: {
      title: "Rewire | Focus, Reclaimed | Scruffy Hipster",
      description:
        "Rewire is an iOS focus app that interrupts distraction using system-level Screen Time controls so you can regain control of your attention.",
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
      "Current MVP: a fast, configurable round timer with presets for MMA, Boxing, and Grappling, built natively with SwiftUI.",
    shortDescription:
      "A native iOS round timer for combat sports training with discipline presets and reliable gym-friendly audio cues.",
    longDescription:
      "Wren focuses on training flow: warm-up, rounds, rest, and cooldown with a clean, glanceable interface. The current MVP is a dependable round timer with future HealthKit and AI recovery insights scoped for later versions.",
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
    featureHeading: "Built for better training days",
    featureIntro:
      "Set rounds, rest, and warnings quickly, then run reliable sessions with discipline-specific presets and clear audio cues.",
    features: [
      {
        title: "Round Timer",
        body: "Warm-up, rounds, rests, and cooldown with a large, glanceable countdown UI designed for gyms."
      },
      {
        title: "Discipline Presets",
        body: "One-tap profiles for MMA, Boxing, and Grappling with configurable rounds, rest, and warnings."
      },
      {
        title: "Audio Cues",
        body: "Distinct start, end, and warning sounds with configurable volume for noisy training environments."
      },
      {
        title: "Session Logs",
        body: "Optional lightweight logging with SwiftData to support future trends and recovery insight features."
      }
    ],
    privacySummary:
      "Wren's MVP stores optional session logs locally. Future HealthKit features will require explicit permission.",
    privacySlug: "wren",
    yearLabel: "2026",
    seo: {
      title: "Wren Workout Recovery Engine | MMA & Boxing Round Timer",
      description:
        "Wren is a fast, configurable round timer for MMA, boxing, and grappling with native iOS performance and discipline presets.",
      keywords: ["MMA timer app", "boxing round timer", "grappling timer iPhone", "Wren app"],
      ogImage: "/og-default.svg"
    },
    accent: { from: "#9cf28d", via: "#67d4b6", to: "#7fd1ff" }
  },
  {
    id: "smarty-colours",
    slug: "smarty-colours",
    name: "Smarty Colours",
    heroTitle: "Smarty Colours: Children's Colouring App",
    tagline:
      "A vibrant, kid-friendly colouring app featuring themed packs like Unicorns, Dinosaurs, Pets, and Vehicles, built natively for iPad with Apple Pencil support.",
    shortDescription:
      "A bright kids colouring app for iPad with Apple Pencil support, themed packs, and a calm, clutter-free interface.",
    longDescription:
      "Smarty Colours encourages focus and imagination with beautifully illustrated pages, smooth Apple Pencil drawing, and an intuitive UI designed for children. The app balances creative play with a safe and minimal experience.",
    appStoreUrl: "https://apps.apple.com/gb/app/smartycolours-colouring-pages/id6749013158",
    icon: "/assets/smartycoloursLogo.png",
    screenshots: [
      { src: "/assets/smartyColoursScreenshots/iPhone Screenshots 🇬🇧 2.001.png", alt: "Smarty Colours home screen" },
      { src: "/assets/smartyColoursScreenshots/iPhone Screenshots 🇬🇧 2.002.png", alt: "Smarty Colours colouring screen" },
      { src: "/assets/smartyColoursScreenshots/iPhone Screenshots 🇬🇧 2.003.png", alt: "Smarty Colours pack selection screen 1" },
      { src: "/assets/smartyColoursScreenshots/iPhone Screenshots 🇬🇧 2.004.png", alt: "Smarty Colours pack selection screen 2" },
      { src: "/assets/smartyColoursScreenshots/iPhone Screenshots 🇬🇧 2.005.png", alt: "Smarty Colours pack selection screen 3" }
    ],
    featureHeading: "Designed for creativity and calm",
    featureIntro:
      "Smarty Colours supports imagination and focus with smooth Apple Pencil input and an intuitive, safe UI for kids.",
    features: [
      {
        title: "Themed Coloring Packs",
        body: "Original illustration packs including Unicorns, Dinosaurs, Pets, Farm Yard, Robots, Vehicles, and more."
      },
      {
        title: "Apple Pencil Support",
        body: "Natural drawing and coloring on iPad with Apple Pencil support for smooth creative play."
      },
      {
        title: "Kid-Friendly Interface",
        body: "Big buttons, simple navigation, and minimal clutter designed for young children."
      },
      {
        title: "Subscription Content",
        body: "Free access is limited; a yearly subscription unlocks all themed packs and future content."
      }
    ],
    privacySummary:
      "Smarty Colours collects no personal data and uses no analytics, ads, or tracking tools.",
    privacySlug: "smarty-colours",
    yearLabel: "2026",
    seo: {
      title: "Smarty Colours | Kids Colouring App for iPad",
      description:
        "Smarty Colours is a children's colouring app for iPad with themed packs, Apple Pencil support, and a calm kid-friendly interface.",
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
      "Smarter plant care with watering reminders, live light meter guidance, and scheduled tasks to keep every plant thriving.",
    shortDescription:
      "A plant care companion for iPhone with reminders, scheduled tasks, and a camera-based light meter for placement guidance.",
    longDescription:
      "Gro Guardian streamlines plant care with simple workflows for watering, rotating, and feeding. It also uses camera access for a live light meter to help place plants in the right environment.",
    appStoreUrl: "#",
    icon: "/assets/groGuardianLogo.png",
    screenshots: [
      { src: "/assets/groGuardianScreenshots/GroGuardianimages.001.jpeg", alt: "Gro Guardian plant dashboard" },
      { src: "/assets/groGuardianScreenshots/GroGuardianimages.002.jpeg", alt: "Gro Guardian reminders screen" },
      { src: "/assets/groGuardianScreenshots/GroGuardianimages.003.jpeg", alt: "Gro Guardian light meter screen" },
      { src: "/assets/groGuardianScreenshots/GroGuardianimages.004.jpeg", alt: "Gro Guardian task scheduling screen" }
    ],
    featureHeading: "Built for better plant care",
    featureIntro:
      "A simple workflow to track plants, get timely reminders, and use your camera as a light meter to find the best spot.",
    features: [
      {
        title: "Simple Plant Dashboard",
        body: "See all plants at a glance with next actions like watering, rotating, or feeding."
      },
      {
        title: "Watering Reminders",
        body: "Smart schedules and helpful notifications so you do not miss key care tasks."
      },
      {
        title: "Live Light Meter",
        body: "Use the camera to estimate light and guide plant placement in your home."
      },
      {
        title: "Scheduled Tasks",
        body: "Plan weekly care, log completions, and stay on track with lightweight routines."
      }
    ],
    privacySummary:
      "Gro Guardian uses camera access for the light meter and notifications for reminders. No ads or tracking are used.",
    yearLabel: "2025",
    seo: {
      title: "Gro Guardian | Smarter Plant Care App",
      description:
        "Gro Guardian helps you manage plant care with watering reminders, a live light meter, and scheduled tasks.",
      keywords: ["plant care app", "watering reminders", "light meter app plants", "Gro Guardian"],
      ogImage: "/og-default.svg"
    },
    accent: { from: "#aef1a2", via: "#55dd9a", to: "#7cc8ff" }
  },
  {
    id: "chat-with-santa",
    slug: "chat-with-santa",
    name: "Chat with Santa",
    heroTitle: "Chat with Santa: AI Magic",
    tagline:
      "A magical way for children and families to message and chat with Santa during the holiday season.",
    shortDescription:
      "A festive chat app with a child-friendly Santa experience, joyful design, and privacy-first on-device processing.",
    longDescription:
      "Chat with Santa is a playful seasonal app designed for delightful conversations with Santa. It focuses on a simple, warm experience with festive visuals and privacy-conscious behavior.",
    appStoreUrl: "#",
    icon: "/assets/chatWithSantaLogo.png",
    screenshots: [
      { src: "/assets/chatWithSantaScreenshots/ChatWithSantaAppStoreScreenShots.001.jpeg", alt: "Chat with Santa chat screen 1" },
      { src: "/assets/chatWithSantaScreenshots/ChatWithSantaAppStoreScreenShots.002.jpeg", alt: "Chat with Santa chat screen 2" },
      { src: "/assets/chatWithSantaScreenshots/ChatWithSantaAppStoreScreenShots.003.jpeg", alt: "Chat with Santa chat screen 3" },
      { src: "/assets/chatWithSantaScreenshots/ChatWithSantaAppStoreScreenShots.004.jpeg", alt: "Chat with Santa chat screen 4" },
      { src: "/assets/chatWithSantaScreenshots/ChatWithSantaAppStoreScreenShots.005.jpeg", alt: "Chat with Santa chat screen 5" }
    ],
    featureHeading: "Built for magical conversations",
    featureIntro:
      "A simple and joyful festive chat experience with delightful design and Santa-themed replies.",
    features: [
      {
        title: "Festive Chat Interface",
        body: "A clean, seasonal UI with playful visual details that support a magical holiday feel."
      },
      {
        title: "AI Santa Replies",
        body: "Friendly responses designed to feel warm and age-appropriate for holiday conversations."
      },
      {
        title: "Voice and Text Input",
        body: "Type or speak messages to Santa for a more accessible, hands-free experience."
      },
      {
        title: "Private and Secure",
        body: "No advertising or tracking tools. Privacy and family trust are part of the product design."
      }
    ],
    privacySummary:
      "Chat with Santa is designed to avoid analytics and advertising tracking, with conversations processed on-device.",
    privacySlug: "chat-with-santa",
    yearLabel: "2025",
    seo: {
      title: "Chat with Santa | AI Magic Holiday App",
      description:
        "Chat with Santa is a festive, privacy-first holiday chat app for families with magical Santa conversations and joyful design.",
      keywords: ["Chat with Santa app", "holiday app for kids", "Santa AI chat", "Christmas chat app"],
      ogImage: "/og-default.svg"
    },
    accent: { from: "#ffd1a6", via: "#ff8ea0", to: "#9bb1ff" }
  },
  {
    id: "breast-feeding-tracker",
    slug: "breast-feeding-tracker",
    name: "Breastfeeding Tracker & Timer",
    heroTitle: "Breastfeeding Tracker & Timer",
    tagline:
      "A one-tap breastfeeding tracker and timer for iPhone and Apple Watch with widgets, Live Activities, and private on-device feed insights.",
    shortDescription:
      "A breastfeeding tracker for iPhone and Apple Watch with a live timer, feed history, widgets, and simple on-device insights.",
    longDescription:
      "Breastfeeding Tracker & Timer is built to help parents log feeds fast, stay in sync between iPhone and Apple Watch, and review clear feeding patterns without extra friction. It supports one-tap timing, left and right side tracking, quick save flows, glanceable Lock Screen progress, and private summaries based on recent history.",
    appStoreUrl: "https://apps.apple.com/gb/app/breastfeeding-tracker-timer/id6754637800",
    icon: "/assets/BreastFeedingIcon.png",
    screenshots: [
      { src: "/assets/breastfeedingScreenShots/1.png", alt: "Breast Feeding Tracker home screen" },
      { src: "/assets/breastfeedingScreenShots/2.png", alt: "Breast Feeding Tracker feed logging screen" },
      { src: "/assets/breastfeedingScreenShots/3.png", alt: "Breast Feeding Tracker timeline screen" },
      { src: "/assets/breastfeedingScreenShots/4.png", alt: "Breast Feeding Tracker session detail screen" },
      { src: "/assets/breastfeedingScreenShots/5.png", alt: "Breast Feeding Tracker statistics screen" }
    ],
    featureHeading: "Built for fast breastfeeding tracking on iPhone and Apple Watch",
    featureIntro:
      "Track feeds in one tap, see live progress on your Lock Screen, and keep your breastfeeding timer synced across iPhone and Apple Watch.",
    features: [
      {
        title: "One-Tap Breastfeeding Timer",
        body: "Start a breastfeeding timer instantly and choose left or right at the same time, with the last-used side remembered for faster repeat logging."
      },
      {
        title: "Live Feed Timer and Quick Save",
        body: "Keep a live running timer visible during an active feed, then stop and save with a quick flow when you are done."
      },
      {
        title: "Feed History and Last Feed Summary",
        body: "Review feed history with timestamps, duration, and side used, plus a last-feed summary on the main screen for a quick check-in."
      },
      {
        title: "Apple Watch Breastfeeding Tracking",
        body: "Start and stop feeds from Apple Watch, even when the watch is offline, then sync active sessions and completed feeds back to iPhone when it reconnects."
      },
      {
        title: "Widget, Live Activity, and Dynamic Island",
        body: "See feeds completed today, the last side used, and an active breastfeeding timer on your Home Screen, Lock Screen, and Dynamic Island."
      },
      {
        title: "Private On-Device Feeding Insights",
        body: "Get informational summaries from recent feed history, including average duration, longest session, left and right balance, day versus night activity, and time between feeds."
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
        "Track feeds in one tap with a breastfeeding timer for iPhone and Apple Watch. Includes feed history, widgets, Live Activities, Dynamic Island, and private on-device feeding insights.",
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

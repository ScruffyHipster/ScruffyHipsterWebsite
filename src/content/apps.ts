import type { AppConfig } from "./types";

export const apps: AppConfig[] = [
  {
    id: "rewire",
    slug: "rewire",
    name: "Rewire",
    heroTitle: "App & Website Blocker: Rewire",
    tagline:
      "Interrupt distractions. Build focus.",
    shortDescription:
      "An iPhone app and website blocker that interrupts distraction with Screen Time based focus sessions.",
    longDescription:
      "Rewire is an app blocker and website blocker for iPhone. It uses Apple's Screen Time controls to block distracting apps and websites, add intentional friction, and give you a moment to choose before a quick check becomes lost time.",
    appStoreUrl: "https://apps.apple.com/us/app/app-blocker-focus-rewire/id6757722922",
    pressKit: {
      url: "/assets/press/rewire/rewire-press-kit.zip",
      label: "Download press kit",
      description: "Includes the Rewire press release, app icon, App Store QR code, and product notes."
    },
    icon: "/assets/rewire/app-store/rewire-icon.jpg",
    screenshots: [
      {
        src: "/assets/rewire/app-store/screenshot-1.jpg",
        alt: "Rewire app and website blocking setup"
      },
      {
        src: "/assets/rewire/app-store/screenshot-2.jpg",
        alt: "Rewire focus session powered by Screen Time"
      },
      {
        src: "/assets/rewire/app-store/screenshot-3.jpg",
        alt: "Rewire interruption before opening a distracting app"
      },
      {
        src: "/assets/rewire/app-store/screenshot-4.jpg",
        alt: "Rewire timed and always-on focus controls"
      },
      {
        src: "/assets/rewire/app-store/screenshot-5.jpg",
        alt: "Rewire focus and distraction patterns"
      },
      {
        src: "/assets/rewire/app-store/screenshot-6.jpg",
        alt: "Rewire privacy-first focus settings"
      }
    ],
    featureHeading: "How Rewire works",
    featureIntro:
      "No feeds. No ads. No tracking. Just a tool that adds structure where distraction usually runs on autopilot.",
    features: [
      {
        title: "Create a focus session",
        body: "Choose the apps and websites you want to block and start a session in seconds."
      },
      {
        title: "Intentional pauses, not permanent blocks",
        body: "When a blocked app or website is opened, Rewire interrupts the loop and prompts you to pause and decide."
      },
      {
        title: "Visualise your behaviour",
        body: "Simple charts show how often you hit blocks and when distractions happen."
      },
      {
        title: "Always-on or timed sessions",
        body: "Run Rewire in the background or set defined focus windows that fit your day."
      }
    ],
    seoFeatureList: [
      "Create focus sessions by choosing apps to block",
      "Block distracting websites alongside apps",
      "Intentional pauses when blocked apps are opened",
      "Simple charts for block and distraction patterns",
      "Always-on or timed focus sessions",
      "Uses Apple Screen Time and Family Controls APIs",
      "No accounts, no ads, and no personal data collection"
    ],
    seoContent: {
      eyebrow: "Who it is for",
      heading: "Structure, not motivation quotes",
      paragraphs: [
        "Rewire is for people who open apps and websites on autopilot: developers, students, knowledge workers, and anyone who wants a little more structure around their phone.",
        "It is not a social app. It is not a habit tracker pretending to be therapy. It is not another reminder to just be disciplined.",
        "It is a tool. Use it when you need it."
      ]
    },
    privacySummary:
      "Rewire has no user accounts, no personal data collection, no ads, and anonymous usage analytics only. It uses Apple Screen Time and Family Controls APIs, works offline, and does not bypass iOS safeguards.",
    privacySlug: "rewire",
    yearLabel: "2026",
    seo: {
      title: "App & Website Blocker: Rewire | iOS Focus App",
      description:
        "Rewire is an iPhone app and website blocker that uses Screen Time controls, intentional pauses, and simple focus trends.",
      keywords: [
        "Rewire app",
        "app and website blocker",
        "focus app iPhone",
        "screen time blocker",
        "productivity iOS",
        "impulsive app use"
      ],
      ogImage: "/assets/rewire/app-store/rewire-icon.jpg"
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
      ogImage: "/og-default.png"
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
      ogImage: "/og-default.png"
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
      ogImage: "/og-default.png"
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
      ogImage: "/og-default.png"
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
      title: "Standing Desk Timer for macOS | Scruffyhipster",
      description:
        "Standing Desk Timer is a quiet macOS menu bar app for sit, stand, and movement reminders with local daily totals.",
      keywords: [
        "standing desk timer",
        "macOS standing desk app",
        "sit stand timer Mac",
        "posture reminder macOS",
        "menu bar timer"
      ],
      ogImage: "/og-default.png"
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
      ogImage: "/og-default.png"
    },
    accent: { from: "#ffd6e7", via: "#f7b5ff", to: "#8cd9ff" }
  },
  {
    id: "surge-tracker",
    slug: "surge-tracker",
    name: "Surge Tracker",
    applicationCategory: "HealthApplication",
    heroTitle: "Surge Tracker",
    tagline: "A calm, factual timer for labour and practice surges.",
    shortDescription:
      "A calm iPhone timer for labour and practice surges, with recent averages, custom pattern reminders, private iCloud history, and PDF export.",
    longDescription:
      "Surge Tracker keeps timing clear when attention needs to stay elsewhere. Record labour or practice surges, see recent duration and start-to-start averages, and keep a factual history without turning the app into a source of medical advice.",
    appStoreUrl: "#",
    icon: "/assets/surgeTracker/icon.png",
    screenshots: [
      {
        src: "/assets/surgeTracker/main-timer.png",
        alt: "Surge Tracker labour timer showing recent surge durations, start-to-start gaps, and sensation zones"
      },
      {
        src: "/assets/surgeTracker/pattern-reminder.png",
        alt: "Surge Tracker reminder that recent surges match the user-chosen pattern"
      },
      {
        src: "/assets/surgeTracker/settings.png",
        alt: "Surge Tracker settings for a user-chosen surge pattern and optional sensation recording"
      },
      {
        src: "/assets/surgeTracker/sensation-zones.png",
        alt: "Surge Tracker calm-zone choices for recording sensation intensity after a surge"
      },
      {
        src: "/assets/surgeTracker/history.png",
        alt: "Surge Tracker history with current and archived labour and practice sessions"
      },
      {
        src: "/assets/surgeTracker/pdf-preview.png",
        alt: "Surge Tracker PDF preview containing factual surge timing data"
      }
    ],
    featureHeading: "Clear timing, without medical claims",
    featureIntro:
      "Record what happened, see the recent pattern, and keep the information ready if you choose to share it.",
    features: [
      {
        title: "Tap or Hold to Time",
        body: "Choose the recording style that feels natural, then start and end each surge from one clear control."
      },
      {
        title: "Recent Factual Averages",
        body: "See recent duration and start-to-start averages calculated from up to the latest three completed surges."
      },
      {
        title: "Your Surge Pattern",
        body: "Enter timings agreed with your care provider and receive a reminder when recorded surges match them. Surge Tracker does not recommend thresholds or provide medical guidance."
      },
      {
        title: "Optional Sensation Notes",
        body: "Record how a surge felt using calm zones or a numeric scale, or skip the prompt whenever it is not useful."
      },
      {
        title: "Labour and Practice History",
        body: "Keep Labour and Practice sessions separate, with local-first storage and private iCloud sync across your devices."
      },
      {
        title: "PDF Reports",
        body: "Create a factual report from a selected session to preview, save, or share. Archived history and PDF export are available with an optional lifetime unlock."
      }
    ],
    seoApplicationSubCategory: "Labour Contraction Timer",
    seoFeatureList: [
      "Tap or hold surge timing",
      "Recent surge duration and start-to-start averages",
      "User-chosen surge pattern reminders",
      "Optional sensation intensity recording",
      "Separate Labour and Practice session history",
      "Private iCloud sync",
      "Selected-session PDF reports and sharing"
    ],
    seoContent: {
      eyebrow: "Calm, factual support",
      heading: "A surge timer built for labour and practice",
      paragraphs: [
        "If you are looking for a contraction timer but prefer hypnobirthing language, Surge Tracker records each event as a surge. Start and stop from one clear control, then see recent duration and start-to-start averages without extra noise.",
        "The optional Surge Pattern feature checks the timings you chose yourself. The app does not supply a preset, diagnose labour, recommend when to seek care, or tell you when to contact your midwife, doctor, maternity unit, or birth team.",
        "Core timing, Practice mode, custom patterns, and private iCloud sync remain free. An optional lifetime unlock adds archived session history and selected-session PDF reports for saving or sharing."
      ]
    },
    faqHeading: "Surge Tracker FAQ",
    faqIntro:
      "Straight answers about timing, reminders, privacy, and what the app does not attempt to decide for you.",
    faqs: [
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
    ],
    privacySummary:
      "Surge records are stored locally and in your private iCloud database. Limited anonymous analytics and anonymous purchase processing do not include exact surge history.",
    privacySlug: "surge-tracker",
    yearLabel: "2026",
    seo: {
      title: "Surge Tracker | Labour Contraction Timer for iPhone",
      description:
        "Surge Tracker is a calm iPhone timer for labour and practice surges, with recent averages, custom pattern reminders, iCloud history, and PDF export.",
      keywords: [
        "Surge Tracker",
        "labour surge timer",
        "hypnobirthing timer",
        "birth timer iPhone",
        "surge pattern reminder",
        "labour timing app"
      ],
      ogImage: "/assets/surgeTracker/icon.png"
    },
    accent: { from: "#f8ecee", via: "#dda8b2", to: "#bd3c64" }
  }
];

export const appsBySlug = new Map(apps.map((app) => [app.slug, app]));

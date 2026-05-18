export const siteUrl = process.env.VITE_SITE_URL?.replace(/\/$/, "") || "https://scruffyhipster.com";
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
  url: `${siteUrl}${path}`,
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
  url: `${siteUrl}${path}`,
  image: `${siteUrl}${image}`,
  ...(downloadUrl ? { downloadUrl } : {}),
  ...(featureList ? { featureList } : {}),
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  }
});
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
    title: "Rewire | iOS Focus App",
    description:
      "Rewire is an iOS focus app that adds deliberate friction before impulsive app opens.",
    ogImage: "/og-default.png",
    jsonLd: softwareApplicationJsonLd({
      path: "/apps/rewire",
      name: "Rewire",
      description: "An iOS focus app that interrupts impulsive app opens with deliberate friction.",
      image: "/assets/RewireIcon-iOS-Dark-1024x1024@1x.png",
      featureList: [
        "Impulse interruption before blocked app opens",
        "System-level blocking with Apple Screen Time APIs",
        "Open-ended or time-boxed focus sessions",
        "Minimal focus tooling without feeds or streak pressure"
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
      url: `${siteUrl}/apps/standing-desk-timer`,
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
    path: "/apps/breast-feeding-tracker",
    title: "Breastfeeding Tracker & Timer for iPhone & Apple Watch",
    description:
      "A breastfeeding tracker and timer for iPhone and Apple Watch with feed history, widgets, Live Activities, and private on-device summaries.",
    ogImage: "/og-default.png",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Breastfeeding Tracker & Timer",
        applicationCategory: "MobileApplication",
        applicationSubCategory: "Breastfeeding Tracker",
        operatingSystem: "iOS",
        url: `${siteUrl}/apps/breast-feeding-tracker`,
        image: `${siteUrl}/assets/BreastFeedingIcon.png`,
        downloadUrl: "https://apps.apple.com/gb/app/breastfeeding-tracker-timer/id6754637800",
        description:
          "A breastfeeding tracker for iPhone and Apple Watch with a live timer, feed history, widgets, and private summaries.",
        featureList: [
          "One-tap breastfeeding timer with left and right side tracking",
          "Live running timer during active feeds",
          "Apple Watch app for starting and stopping feeds",
          "Offline Apple Watch support with sync back to iPhone",
          "Feed history with timestamps, duration, and side used",
          "Home Screen widget showing feeds completed today and last side used",
          "Lock Screen Live Activity and Dynamic Island support",
          "Private on-device feeding insights from recent history"
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Can I use this breastfeeding tracker on Apple Watch?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The app includes an Apple Watch companion app so you can start and stop feeds from your wrist, with active sessions and completed feeds syncing back to iPhone."
            }
          },
          {
            "@type": "Question",
            name: "Does the Apple Watch app work offline?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. You can use the watch app when your watch is offline, and the app syncs feeds when your iPhone reconnects."
            }
          },
          {
            "@type": "Question",
            name: "Does it show a live breastfeeding timer on the Lock Screen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The app supports Live Activities on the Lock Screen and Dynamic Island so you can keep an eye on an active feeding timer and the current side."
            }
          },
          {
            "@type": "Question",
            name: "Can I see my recent feed history and last side used?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Feed history includes timestamps, duration, and side used, and the main screen highlights the last feed summary and the last side used for faster repeat logging."
            }
          },
          {
            "@type": "Question",
            name: "Does the app include feeding insights?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The app creates private on-device summaries from recent history, including patterns like average duration, longest session, left and right balance, day versus night activity, and time between feeds."
            }
          }
        ]
      }
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
  }
];

export const legacyRedirects = [
  ["/pages/portfolio/rewire.html", "/apps/rewire"],
  ["/pages/portfolio/wren.html", "/apps/wren"],
  ["/pages/portfolio/smartycolours.html", "/apps/smarty-colours"],
  ["/pages/portfolio/groGuardian.html", "/apps/gro-guardian"],
  ["/pages/portfolio/chatWithSanta.html", "/apps/chat-with-santa"],
  ["/pages/portfolio/breastFeedingTracker.html", "/apps/breast-feeding-tracker"],
  ["/pages/privacyPolicies/rewirePrivacyPolicy.html", "/privacy/rewire"],
  ["/pages/privacyPolicies/wrenPrivacyPolicy.html", "/privacy/wren"],
  ["/pages/privacyPolicies/smartyColoursPrivacyPolicy.html", "/privacy/smarty-colours"],
  ["/pages/privacyPolicies/chatWithSantaPrivacyPolicy.html", "/privacy/chat-with-santa"],
  ["/pages/privacyPolicies/breastFeedingTrackerPrivacyPolicy.html", "/privacy/breast-feeding-tracker"],
  ...legacyPrivacyRedirects.map(([file, to]) => [`/pages/privacypolicy/${file}`, to]),
  ...legacyPrivacyRedirects.map(([file, to]) => [`/pages/privacyPolicy/${file}`, to]),
  ...legacyPrivacyRedirects.map(([file, to]) => [`/pages/privacypolicies/${file}`, to])
];

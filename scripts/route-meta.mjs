export const siteUrl = process.env.VITE_SITE_URL?.replace(/\/$/, "") || "https://scruffyhipster.com";
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
    title: "Scruffy Hipster | Bright Native iOS Apps",
    description:
      "Explore Rewire, Wren, Smarty Colours, Gro Guardian and Chat with Santa from Scruffy Hipster, an independent iOS studio.",
    ogImage: "/og-default.svg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Scruffy Hipster",
      url: siteUrl,
      description:
        "Independent iOS studio creating premium native apps with clean UX, thoughtful engineering, and playful product design."
    }
  },
  {
    path: "/apps/rewire",
    title: "Rewire | Focus, Reclaimed | Scruffy Hipster",
    description:
      "Rewire is an iOS focus app that interrupts distraction using system-level Screen Time controls so you can regain control of your attention.",
    ogImage: "/og-default.svg"
  },
  {
    path: "/apps/wren",
    title: "Wren Workout Recovery Engine | MMA & Boxing Round Timer",
    description:
      "Wren is a fast, configurable round timer for MMA, boxing, and grappling with native iOS performance and discipline presets.",
    ogImage: "/og-default.svg"
  },
  {
    path: "/apps/smarty-colours",
    title: "Smarty Colours | Kids Colouring App for iPad",
    description:
      "Smarty Colours is a children's colouring app for iPad with themed packs, Apple Pencil support, and a calm kid-friendly interface.",
    ogImage: "/og-default.svg"
  },
  {
    path: "/apps/gro-guardian",
    title: "Gro Guardian | Smarter Plant Care App",
    description:
      "Gro Guardian helps you manage plant care with watering reminders, a live light meter, and scheduled tasks.",
    ogImage: "/og-default.svg"
  },
  {
    path: "/apps/chat-with-santa",
    title: "Chat with Santa | AI Magic Holiday App",
    description:
      "Chat with Santa is a festive, privacy-first holiday chat app for families with magical Santa conversations and joyful design.",
    ogImage: "/og-default.svg"
  },
  {
    path: "/apps/breast-feeding-tracker",
    title: "Breastfeeding Tracker & Timer for iPhone & Apple Watch",
    description:
      "Track feeds in one tap with a breastfeeding timer for iPhone and Apple Watch. Includes feed history, widgets, Live Activities, Dynamic Island, and private on-device feeding insights.",
    ogImage: "/og-default.svg",
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
          "A breastfeeding tracker for iPhone and Apple Watch with a live timer, feed history, widgets, and simple on-device insights.",
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
    title: "Rewire Privacy Policy | Scruffy Hipster",
    description: "Read the privacy policy for Rewire by Scruffy Hipster.",
    ogImage: "/og-default.svg"
  },
  {
    path: "/privacy/wren",
    title: "Wren Privacy Policy | Scruffy Hipster",
    description: "Read the privacy policy for Wren by Scruffy Hipster.",
    ogImage: "/og-default.svg"
  },
  {
    path: "/privacy/smarty-colours",
    title: "Smarty Colours Privacy Policy | Scruffy Hipster",
    description: "Read the privacy policy for Smarty Colours by Scruffy Hipster.",
    ogImage: "/og-default.svg"
  },
  {
    path: "/privacy/chat-with-santa",
    title: "Chat with Santa Privacy Policy | Scruffy Hipster",
    description: "Read the privacy policy for Chat with Santa by Scruffy Hipster.",
    ogImage: "/og-default.svg"
  },
  {
    path: "/privacy/breast-feeding-tracker",
    title: "Breast Feeding Tracker Privacy Policy | Scruffy Hipster",
    description: "Read the privacy policy for Breast Feeding Tracker by Scruffy Hipster.",
    ogImage: "/og-default.svg"
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

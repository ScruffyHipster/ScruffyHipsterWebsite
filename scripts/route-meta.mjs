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
      "Rewire is a structured iOS focus tool that reduces impulsive app use with Screen Time controls, intentional pauses, and simple behaviour charts.",
    ogImage: "/og-default.png",
    jsonLd: softwareApplicationJsonLd({
      path: "/apps/rewire",
      name: "Rewire",
      description:
        "A structured iOS focus tool that helps reduce impulsive app use by adding friction where it matters.",
      image: "/assets/press/rewire/rewire-icon.png",
      downloadUrl: "https://apps.apple.com/app/id6757722922",
      featureList: [
        "Create focus sessions by choosing apps to block",
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
        { name: "Apps", url: `${siteUrl}/apps` },
        { name: "Surge Tracker", url: `${siteUrl}/apps/surge-tracker` }
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
        { name: "Privacy", url: `${siteUrl}/privacy/surge-tracker` },
        { name: "Surge Tracker", url: `${siteUrl}/privacy/surge-tracker` }
      ])
    ]
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

export const siteUrl = process.env.VITE_SITE_URL?.replace(/\/$/, "") || "https://scruffyhipster.com";

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
  }
];

export const legacyRedirects = [
  ["/pages/portfolio/rewire.html", "/apps/rewire"],
  ["/pages/portfolio/wren.html", "/apps/wren"],
  ["/pages/portfolio/smartycolours.html", "/apps/smarty-colours"],
  ["/pages/portfolio/groGuardian.html", "/apps/gro-guardian"],
  ["/pages/portfolio/chatWithSanta.html", "/apps/chat-with-santa"],
  ["/pages/privacyPolicies/rewirePrivacyPolicy.html", "/privacy/rewire"],
  ["/pages/privacyPolicies/wrenPrivacyPolicy.html", "/privacy/wren"],
  ["/pages/privacyPolicies/smartyColoursPrivacyPolicy.html", "/privacy/smarty-colours"],
  ["/pages/privacyPolicies/chatWithSantaPrivacyPolicy.html", "/privacy/chat-with-santa"]
];


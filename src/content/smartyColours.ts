// Website copy and launch state are separate from the app's store privacy and pricing.
export const smartyColours = {
  path: "/apps/smarty-colours/",
  storeUrl: "https://apps.apple.com/app/id6749013158",
  contactUrl: "mailto:support@scruffyhipster.com",
  title: "Free Colouring Pages & Online Colouring | SmartyColours",
  description: "Print 80 free colouring pages in A4 or US Letter, or colour online with friendly tools for little hands. Original pictures, no ads and no sign-up.",
  ui: {
    skip: "Skip to colouring and packs", loading: "Opening your colouring page…", close: "Close", closeSymbol: "×", back: "Go back", themeDay: "Day sky", themeNight: "Night sky",
    grown: "For grown-ups",
    gateTitle: "Ask a grown-up", gateStore: "This opens the App Store, outside SmartyColours. Answer to carry on.", gateContact: "This opens your email app, outside SmartyColours. Answer to carry on.", gateShare: "This opens your device’s share sheet. Ask a grown-up to answer first.", gateBack: "Go back to colouring",
    privacyTitle: "Privacy on this website", privacyBody: "There are no accounts, forms, ads or trackers on the SmartyColours website. Colouring stays in this browser tab. Pictures are only downloaded or shared when you choose. The app has its own privacy policy on the App Store.",
    termsTitle: "Website terms", termsBody: "SmartyColours is run by Scruffy Hipster Ltd. Online colouring is free to use. You can download and print the five free pages in each pack and save your finished pictures for personal or classroom use. Original illustrations remain the property of their creators. Please do not resell or redistribute the artwork or PDFs.",
  },
  gateQuestions: [
    { question: "What is six times seven?", answer: 42, choices: [36, 42, 48] },
    { question: "What is eight times six?", answer: 48, choices: [42, 48, 56] },
    { question: "What is seven times eight?", answer: 56, choices: [54, 56, 64] },
    { question: "What is nine times seven?", answer: 63, choices: [56, 63, 72] },
  ],
} as const;

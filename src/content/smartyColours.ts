// Website copy and launch state are separate from the app's store privacy and pricing.
export const smartyColours = {
  path: "/apps/smarty-colours/",
  storeUrl: "https://apps.apple.com/app/id6749013158",
  contactUrl: "mailto:support@scruffyhipster.com",
  title: "Free Online Colouring for Kids | SmartyColours",
  description: "Colour original SmartyColours pictures online for free. Big, friendly tools for little hands, with no ads or sign-up. Save finished pictures on your device.",
  ui: {
    skip: "Skip to colouring and packs", loading: "Opening your colouring page…", close: "Close", closeSymbol: "×", back: "Go back", themeDay: "Day sky", themeNight: "Night sky",
    grown: "For grown-ups", libraryTitle: "Pick a pack", libraryIntro: "Five free printable pages from every pack are on the way. Try the example pictures online while we prepare the packs.",
    preview: "Pack preview", fivePages: "5 free pages coming soon", size: "Paper size", a4: "A4", letter: "US Letter", download: "PDF coming soon", previewNotice: "Free PDFs are being prepared. Every pack will have five free pages, with A4 and US Letter options.",
    more: "More packs in the app", moreBody: "Explore more pictures on iPad and iPhone.", aboutApp: "About the app", colourNow: "Colour a picture", packSuffix: " colouring pack",
    gateTitle: "Ask a grown-up", gateStore: "This opens the App Store, outside SmartyColours. Answer to carry on.", gateContact: "This opens your email app, outside SmartyColours. Answer to carry on.", gateShare: "This opens your device’s share sheet. Ask a grown-up to answer first.", gateBack: "Go back to colouring",
    privacyTitle: "Privacy on this website", privacyBody: "There are no accounts, forms, ads or trackers on the SmartyColours website. Colouring stays in this browser tab. Pictures are only downloaded or shared when you choose. The app has its own privacy policy on the App Store.",
    termsTitle: "Website terms", termsBody: "SmartyColours is run by Scruffy Hipster Ltd. Online colouring is free to use. You can save your finished pictures for personal or classroom use. Original illustrations remain the property of their creators. Printable packs are being prepared and are not yet available to download.",
  },
  gateQuestions: [
    { question: "What is six times seven?", answer: 42, choices: [36, 42, 48] },
    { question: "What is eight times six?", answer: 48, choices: [42, 48, 56] },
    { question: "What is seven times eight?", answer: 56, choices: [54, 56, 64] },
    { question: "What is nine times seven?", answer: 63, choices: [56, 63, 72] },
  ],
  packs: [
    { id: "farm-yard", name: "Farm Yard", alt: "A happy cow in a sunny meadow" },
    { id: "dinosaurs", name: "Dinosaurs", alt: "A friendly baby dinosaur" },
    { id: "princesses", name: "Princesses", alt: "A princess outside a castle" },
    { id: "robots", name: "Robots", alt: "A friendly robot gardening" },
    { id: "space", name: "Space", alt: "A colourful outer space adventure" },
    { id: "automotive", name: "Automotive", alt: "A colourful ice cream van" },
    { id: "flowers", name: "Flowers", alt: "A smiling sunflower" },
    { id: "pets", name: "Pets", alt: "A friendly dog enjoying tea" },
    { id: "summer-holidays", name: "Summer Holidays", alt: "A sandcastle on the beach" },
  ],
} as const;

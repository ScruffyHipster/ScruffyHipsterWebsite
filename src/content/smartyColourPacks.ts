import catalogue from "../../content/smarty-colours/catalogue.json";
export type PaperSize = "a4" | "letter";
export type FreePack = typeof catalogue.packs[number];
export type FreePage = FreePack["pages"][number];
export const freePacks = catalogue.packs;
export const FREE_PACKS_PATH = "/apps/smarty-colours/colouring-pages/";
export const packPath = (pack: Pick<FreePack, "id">) => `${FREE_PACKS_PATH}${pack.id}/`;
export const pagePath = (pack: Pick<FreePack, "id">, page: Pick<FreePage, "slug">) => `${packPath(pack)}${page.slug}/`;
export const colourPath = (pack: Pick<FreePack, "id">, page: Pick<FreePage, "id"> = freePacks.find(item => item.id === pack.id)!.pages[0]) => `/apps/smarty-colours/?picture=${encodeURIComponent(page.id)}&pack=${encodeURIComponent(pack.id)}`;
export const packPdf = (pack: Pick<FreePack, "id">, size: PaperSize) => `/smarty-colours/pdfs/smartycolours-${pack.id}-free-pages-${size}.pdf`;
export const pagePdf = (pack: Pick<FreePack, "id">, page: Pick<FreePage, "slug">, size: PaperSize) => `/smarty-colours/pdfs/smartycolours-${pack.id}-${page.slug}-${size}.pdf`;
export const findFreePage = (id: string) => freePacks.flatMap(pack => pack.pages.map(page => ({ pack, page }))).find(item => item.page.id === id);
export const packShelves = [
  { id: "animals", title: "Animals", packs: ["farm-yard", "dinosaurs", "pets", "zoo", "under-the-sea"] },
  { id: "make-believe", title: "Make-believe", packs: ["princesses", "unicorns", "robots", "space"] },
  { id: "out-and-about", title: "Out and about", packs: ["automotive", "flowers"] },
  { id: "through-the-year", title: "Through the year", packs: ["easter", "summer-holidays", "autumn", "halloween", "christmas"] },
];
export const packCopy = {
  logoFirst: "Smarty", logoLast: "Colours", breadcrumbs: "Breadcrumbs", chevron: "›", allAppTitle: "More pictures in the app",
  home: "SmartyColours home", main: "Main", footer: "Footer", colourOnline: "Colour online", freePacks: "Free packs", grown: "For grown-ups", getApp: "Get the app", getAppLabel: "Get the app, for grown-ups", privacy: "Privacy", terms: "Terms", contact: "Contact", copyright: "No ads, no accounts, no tracking cookies. © 2026 Scruffy Hipster Ltd.",
  libraryTitle: "Free colouring packs", libraryIntro: "Every pack has five free pages to print. Every page has big shapes and thick lines that little hands can colour inside.", free: "Free", freeToPrint: "Free to print", fivePages: "5 free pages · PDF", freeFive: "Free · 5 pages", paperSize: "Paper size", a4: "A4", letter: "US Letter", formats: "A4 or US Letter", ink: "Black and white, easy on ink", noSignUp: "No sign-up", pick: "Pick a", pack: "pack", shelfIntro: "Choose a pack to see its five free pages, download them together, or colour them online.",
  downloadAll: "Download all 5 pages", bundleNote: "Five colouring pages, plus a pack cover and an app information page.", downloadPage: "Download PDF", colourIt: "Colour it", pdf: "PDF", pagesIn: "Free pages in", thisPack: "this pack", pagesIntro: "Print one page at a time, or tap Colour it to colour on screen.", morePacks: "More packs to", print: "print", allPacks: "See all packs", inApp: "In the app", moreApp: (name: string) => `More ${name} pages in the app`, moreAppBody: "Colour the rest of the pack on iPad and iPhone.", appBody: "Explore more pages from every pack, with pinch-to-zoom and Apple Pencil on iPad. Free to try, with optional in-app purchases.", appBadge: "Download on the App Store", appIcon: "SmartyColours rainbow pencil app icon", rated: "Rated 4+", pagesSuffix: " colouring pack", pageSuffix: " colouring page", printIntro: "Print this original SmartyColours picture, or colour it online. Choose A4 or US Letter paper.",
  howTitle: "How to print a pack", howIntro: "There is nothing to sign up for.", steps: [{ title: "Pick a pack", body: "Choose a theme and look through its five free pictures." }, { title: "Download the PDF", body: "Get all five colouring pages together, or one page at a time, in A4 or US Letter." }, { title: "Print and colour", body: "Print at actual size or 100%, in black and white. Leave the printer margins on." }],
  backPack: "Back to the pack", personal: "Free for use at home or in class.", unavailable: "Pick another picture", unavailableBody: "Choose a pack to find a picture to colour or print.", alternate: "Other paper size:",
};

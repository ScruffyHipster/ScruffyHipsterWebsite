import catalogue from "../../content/smarty-colours/catalogue.json";

export const smartyStudioPacks = catalogue.packs.map((pack) => ({
  id: pack.id,
  name: pack.name,
  pages: pack.pages.map((page) => ({ ...page, packId: pack.id, packName: pack.name }))
}));
export const smartyStudioPictures = smartyStudioPacks.flatMap((pack) => pack.pages);
export type SmartyStudioPicture = typeof smartyStudioPictures[number];
export function resolveStudioPicture(pictureId?: string, packId?: string): SmartyStudioPicture {
  const pack = smartyStudioPacks.find((item) => item.id === packId);
  const picture = smartyStudioPictures.find((item) => item.id === pictureId);
  if (picture && (!pack || picture.packId === pack.id)) return picture;
  return pack?.pages[0] ?? smartyStudioPacks.find((item) => item.id === "farm-yard")?.pages[0] ?? smartyStudioPictures[0];
}
export const smartyStudioColours = [
  ["Ink", "#1c2430"], ["Strawberry", "#fc3242"], ["Crown orange", "#f3862b"],
  ["Sunshine", "#fed130"], ["Grass", "#34c759"], ["Sky", "#0088fe"],
  ["Grape", "#6160f0"], ["Coral", "#eb8585"], ["Paper", "#ffffff"]
];
export const smartyStudioTools = ["Fill", "Crayon", "Paint", "Rubber"] as const;
export const smartyStudioCopy = {
  home: "Home", pickPack: "Pick a pack", startAgain: "Start again", allDone: "All done", pick: "Pick a picture",
  undo: "Undo", redo: "Redo", tools: "Tools", colours: "Colours", toolbar: "Colouring tools",
  keyboardHelp: "Keyboard: arrows move the crosshair. Space adds colour. Shift + arrows moves further.",
  preparingPicture: "Getting your picture ready…", doneTitle: "All done!", resetTitle: "Start again?", currentAlt: "Your current colouring",
  doneHelp: "Your picture is ready. Save it to keep it, or ask a grown-up to share it.",
  save: "Save picture", share: "Share", print: "Print",
  printNote: "Choose a paper size, then Print opens your device’s print options.", paperSize: "Paper size", a4: "A4", letter: "US Letter",
  printPreparing: "Preparing your print page…", printOpened: "Your print options are open.", printClosed: "Print options closed. Your colouring is still here.", printError: "The print page could not open. Your colouring is still here; try again.",
  printFrameTitle: "SmartyColours printable picture", name: "Name", planColours: "Plan your colours", brand: "SmartyColours",
  printFooter: "Colour more pictures in the SmartyColours app on iPad and iPhone", domain: catalogue.domain,
  printTitle: (title: string, pack: string) => `${title} · ${pack} pack`,
  keepColouring: "Keep colouring", resetHelp: "This clears the colours from this picture.",
  fillHint: "Tap a shape to fill it.",
  canvasLabel: (title: string) => `Colour ${title}. Use arrow keys to move the crosshair, Space or Enter to colour. Shift and arrows move further.`,
  finishedAlt: (title: string) => `Your coloured ${title.toLowerCase()} in the SmartyColours frame`,
  toolHint: (tool: string) => `Make a mark with ${tool.toLowerCase()}.`
};

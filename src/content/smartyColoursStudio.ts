export const smartyStudioPictures = [
  { id: "curly-sheep", title: "Curly sheep", alt: "Line drawing of a curly sheep with a bell in a meadow" },
  { id: "happy-cow", title: "Happy cow", alt: "Line drawing of a happy cow with a bell standing in grass" },
  { id: "friendly-dinosaur", title: "Friendly dinosaur", alt: "Line drawing of a smiling long-neck dinosaur" },
  { id: "pig-in-mud", title: "Pig in mud", alt: "Line drawing of a happy pig playing in mud" },
  { id: "robot-astronaut", title: "Robot astronaut", alt: "Line drawing of a friendly robot astronaut" },
  { id: "smiling-bulldozer", title: "Smiling bulldozer", alt: "Line drawing of a smiling bulldozer" },
  { id: "princess-and-castle", title: "Princess and castle", alt: "Line drawing of a princess beside a castle" },
  { id: "sandcastle-day", title: "Sandcastle day", alt: "Line drawing of a sandcastle on the beach" }
];
export const smartyStudioColours = [
  ["Ink", "#1c2430"], ["Strawberry", "#fc3242"], ["Crown orange", "#f3862b"],
  ["Sunshine", "#fed130"], ["Grass", "#34c759"], ["Sky", "#0088fe"],
  ["Grape", "#6160f0"], ["Coral", "#eb8585"], ["Paper", "#ffffff"]
];
export const smartyStudioTools = ["Fill", "Crayon", "Paint", "Rubber"] as const;
export const smartyStudioCopy = {
  home: "Home", startAgain: "Start again", allDone: "All done", pick: "Pick a picture",
  undo: "Undo", redo: "Redo", tools: "Tools", colours: "Colours", toolbar: "Colouring tools",
  keyboardHelp: "Keyboard: arrows move the crosshair. Space adds colour. Shift + arrows moves further.",
  doneTitle: "All done!", resetTitle: "Start again?", currentAlt: "Your current colouring",
  doneHelp: "Your picture is ready. Save it to keep it, or ask a grown-up to share it.",
  save: "Save picture", share: "Share", print: "Print",
  printNote: "Printing is being prepared. You can save your picture as a PNG today.",
  keepColouring: "Keep colouring", resetHelp: "This clears the colours from this picture.",
  fillHint: "Tap a shape to fill it.",
  canvasLabel: (title: string) => `Colour ${title}. Use arrow keys to move the crosshair, Space or Enter to colour. Shift and arrows move further.`,
  finishedAlt: (title: string) => `Your coloured ${title.toLowerCase()} in the SmartyColours frame`,
  toolHint: (tool: string) => `Make a mark with ${tool.toLowerCase()}.`
};

SmartyColours Web is the design system for the SmartyColours website: a calm, ad-free colouring site for children aged roughly 3 to 8 and the grown-ups who look after them. It borrows the iPad app's world (a bright blue sky, outlined cartoon clouds, white paper pages in thick green frames, an orange crown) and turns it into a site that can be built and changed without copying the app screen for screen.

The site has three jobs, in this order:

1. **Colour online.** A child picks a picture and colours it in the browser, then a grown-up prints it or saves it.
2. **Free packs to print.** Every pack has five free pages. Grown-ups download them one at a time or all five as one PDF. The rest of each pack lives in the app.
3. **Get the app.** Grown-ups learn that hundreds more pages live in the iPad and iPhone app.

Every page serves two readers at once. Children look at pictures and press big buttons. Grown-ups read the words. Design for the child's eye and the grown-up's decision.

## Voice

Write in British English: colour, colouring, favourite, grey, programme. Use sentence case everywhere, including buttons and page titles.

Write the product name as **SmartyColours**, one word, capital S and C. In the lockup it is set `Smarty` in `ink` and `Colours` in `sky-deep`.

There are two voices.

**Kid voice** is for buttons, tile names and anything a child presses. Two to four words, a verb first, warm and plain. One exclamation mark at most per screen.

- "Start colouring", "Pick a picture", "Colour it", "All done!", "Start again"
- Never: "Click here", "Unlock now", "Buy", "Hurry", "Don't miss out"

**Grown-up voice** is for headings and body copy aimed at parents and teachers. Calm, specific, reassuring, no hype. Say what happens and what doesn't.

- "Every pack has five free pages you can print at home or in class."
- "Nothing is uploaded. The picture stays in your browser until you save or print it."
- "Hundreds more pages on iPad and iPhone."

Mark grown-up content with the `sc-tag--grown` tag ("For grown-ups") so a child knows it is not for them. All selling copy is grown-up voice and sits behind that tag. Never aim a purchase message at a child.

Do not use emoji in the interface. Use the line icons in the Icons group.

## Colour

The palette is the app's, sampled from the icon and the app screens.

- **Ground.** Pages start with a `sky-band` hero that fades to `sky-band-low`, then continue on `ground`. Cards and panels are `surface`. At night (the dark theme) the sky band becomes the app's dark-mode night sky with yellow `star` sparkles.
- **Paper.** Colouring pages, the canvas and printables are always `paper` with `line-art` outlines, in both themes, because they are paper.
- **Frames.** Wrap pack tiles and the canvas in a `stroke-frame` border of `grass`. That green frame is the most recognisable thing in the app; keep it.
- **Action.** `crown` orange is the primary action. Use it once per view for the thing the page is for: Start colouring on the home page, Download pack on a pack page, Get the app inside the promo. Text and outline on it are `on-fill`.
- **Crayons.** `strawberry`, `crown`, `sunshine`, `grass`, `sky`, `grape`, `coral`, `line-art` and `paper` are the colouring palette. They may also appear as decorative discs (the logo's overlapping dots), but never more than three in one cluster.
- **Text.** Body text is `ink` on `ground` or `surface`; secondary text is `ink-muted`; links are `sky-deep`.
- **Text on sky.** `on-sky-band` on `sky-band` is only 3.5:1 by day, so put only headlines (24px+, or bold 19px+) directly on the sky. Running text goes on a `surface` panel or a cloud.
- Never use `strawberry` or any red to tell a child they did something wrong. There is nothing to get wrong.

## Type

- **Grandstander** (`--font-display`) is the voice of the pictures: hand-lettered, chunky, friendly. Use it for display styles, headings, tile names and kid-voice buttons (`kid-label`). Weights 700 to 800, and 900 for the wordmark only.
- **Andika** (`--font-body`) is a typeface designed for people learning to read: single-storey a and g, clear letter shapes. Use it for everything grown-ups read and for small labels. Body text is `body` (18px) and never smaller than `body-s` (16px) except tags.
- Load both from Google Fonts: `family=Andika:ital,wght@0,400;0,700;1,400&family=Grandstander:wght@600;700;800;900`.
- Hero headline `display-xl` on desktop, `display-l` under 720px. Section titles `heading-1`. Keep running text under `measure` (640px).
- Highlight one or two words in a section title with `sc-mark`, a `sunshine` crayon stroke behind the word.

## Shape and line

The interface is drawn like a colouring page.

- Outline buttons, swatches, active tools, clouds and promo cards with `stroke-outline` (3px) in `outline`, round joins.
- Give anything pressable `shadow-sticker`, a hard ink edge underneath. On press, move it down 4px and switch to `shadow-sticker-pressed`. It feels like pressing a sticker.
- Things that float over the sky (nav, canvas, panels, clouds) get `shadow-float`. Never combine a soft shadow with the sticker edge on the same element.
- Radii: `radius-m` for pack tiles, `radius-l` for panels and the canvas, `radius-xl` for big feature cards, `radius-pill` for buttons, the toolbar and the nav.
- Clouds are SVG: a `paper` fill, a `sky-pale` underside, a 4px `line-art` edge. Two or three per sky band, partly off the edge. Only one may drift, slowly, and only without `prefers-reduced-motion`.

## Layout

- Max content width `page-max` (1200px). Side gutter `space-4` on phones, `space-6` from 720px up.
- Section padding `space-8` on phones, `space-9` on desktop.
- The nav is a floating `surface` pill sitting in the sky band, not a full-width bar. Under 880px its links drop to a second row of equal tabs.
- Pack grids: 2 columns on phones and tablets; on desktop pick the count the tiles fill exactly (4 for 8 tiles, 5 for 10). Never leave one tile alone on a row. Gap `space-5`, `space-6` on desktop.
- The colouring studio is the one full-screen layout: sky backdrop, canvas centred, toolbar pinned to the bottom on phones and tablets, beside the canvas on wide screens.

## Imagery

- Use only SmartyColours artwork: pack covers (coloured) for tiles, line art for printables and the online canvas. Never stock photos, and never photos of children.
- Pack covers are square. Show them full bleed inside the grass frame.
- Show finished colouring (the coloured cow) as proof of what children make, not polished illustration.

## Motion

Gentle, short and optional.

- Buttons: the sticker press, 120ms.
- Pack tiles: tilt -1.5° and lift 3px on hover.
- Swatches: grow to 112% when picked.
- One drifting cloud per sky band.
- No flashing, no autoplaying sound, no countdowns, no confetti storms. A small sparkle when a picture is saved is the most celebration allowed.
- Respect `prefers-reduced-motion: reduce` by switching all of the above off.

## Controls for small hands

- Every control a child presses is at least `tap-kid` (64px) square. Grown-up controls are at least `tap-grown` (48px) tall.
- Tools show a picture and a word (Crayon, Paint, Fill, Rubber), because many users cannot read yet.
- Keep at least `space-2` between neighbouring kid controls so a mis-tap lands on nothing.
- Destructive actions (Start again) ask once with a picture of what will be lost and two big buttons.
- Keyboard focus uses `focus-ring` on every control.

## Iconography

The Icons group is drawn for this site on a 24px grid, 2.2 stroke, round caps and joins, no fills, to match the app's line art. Use them inline with `stroke="currentColor"` so they take `ink`, `on-fill` or `on-sky-band`. The uploaded SVG files are drawn in `line-art` (#1c2430) for use as plain images. Draw new icons the same way: one weight, rounded, no fills, no detail smaller than 2px.

Use the official Apple "Download on the App Store" badge as supplied in Logos; do not redraw or recolour it.

# SmartyColours landing page — local review, 30 October 2026

Implementation route: `/apps/smarty-colours/`. This existing route is a local integration location, not a decision about the final domain.

## Sources and scope

- [SmartyColours Web](https://claude.ai/artifact/JVBBtGbRSdPvpqvrL4hqvz): README read first; supplied component CSS and Day/Night tokens retained under `docs/smarty-colours-design/`.
- [SmartyColours Site Designs](https://claude.ai/artifact/YZBgVxnyFiDDWmcB2Pn6YY): Home desktop/phone artboards and `project/site.css` adapted faithfully. Original reference HTML is retained for comparison.
- Landing HTML lives in `src/content/smartyColoursHome.html`; component/page CSS is scoped to `.sc-page`. UI strings and pack metadata are in `src/content/smartyColours.ts`. App metadata and visible FAQs remain in `content/apps/smarty-colours.json`.
- Eight full-resolution original pack covers replace screenshot crops. Six original drawings replace the home strip's traced placeholders, with accurate names. Eight original drawings power the studio. `assets.json` records source paths and derivatives. These are preview examples, not the final five-page selections.
- Fonts and Apple’s [official badge](https://developer.apple.com/app-store/marketing/guidelines/) are served locally. Font licences are retained beside their files. App showcase derivatives remove old marketing headers and preserve actual app UI.

The current hand-off supersedes the older `SmartyColors/docs/website-seo-aso-plan.md`: every pack is to offer five free web pages; Farm Yard is not the only web-colourable pack.

## What works

- Responsive Home with Day/Night theme, clouds, orange primary action, original hero, six-picture strip, eight-pack grid, three ways, grown-up promises, app showcase and accessible native FAQ disclosures.
- Start colouring and picture links open a lazy-loaded studio. Fill is the default; Crayon, Paint, Rubber, nine colours, eight-step undo/redo, keyboard crosshair, reset confirmation and per-picture tab memory work. Phone/tablet tools stay fixed at the bottom.
- All done composes a branded 1080 × 1080 PNG. Save downloads it locally; Share first opens a rotating, shuffled grown-up question. App Store and email actions use the same gate. Internal navigation does not.
- The pack browser contains nine covers and a grown-up app card; pack previews expose A4/US Letter selection. Downloads are visibly unavailable until the launch decisions below are resolved.
- Website analytics initialization, events, pending callbacks and landing attribution are suppressed on SmartyColours routes, including navigation from other pages. Drawings are not uploaded or placed in persistent browser storage.

## Launch decisions still required

1. Choose the domain before publication. Set final canonicals/social previews, website policy destinations and printable footers/last pages together. Existing studio-site canonical infrastructure remains only for this unpublished integration.
2. Choose five original pages per pack. Build pack and individual SEO pages with final descriptive slugs; generate cover + five pages + final app page PDFs in A4 and US Letter, using the supplied PrintSheet master. This landing-page change does not generate those PDFs or the full printable library.
3. Finalise the website terms and privacy destinations. The preview provides a factual website privacy explanation and clearly identifies the terms as pending; the App Store has its own app policy.

No site, printable, store metadata, source commit or deployment was published. The draft page is `noindex,follow` and excluded from the sitemap. Existing non-Smarty routes retain their declared robots behaviour.

## Verification

`npm run check` passes: production client/SSR build, SEO/CMS checks (52 routes; 51 indexable sitemap URLs), content ownership, locale/legacy checks, existing timer checks, and the added SmartyColours tests.

`npm run test:smarty-colours` checks original-asset links, absence of prototype bindings, self-hosted fonts, gated destinations, draft indexing, FAQ markup; tests one-pixel fill boundaries, exactly three-pixel underlap, no adjacent-region bleed and outline no-ops; and exercises analytics suppression across direct entry, aliases, pending imports/events, client navigation and adult-route recovery.

Browser review covers desktop, 390 × 844 phone and tablet layouts; Day/Night themes; fill/undo/redo; picture memory; reset confirmation; All done; 1080 PNG generation/download; parent-gate dismissal and repeated questions; pack browser and disabled downloads. No physical iPad/Apple Pencil or printer test has been performed.

Vite reports a shared-bundle size advisory; the studio itself is loaded separately. Network-restricted builds use the existing Rewire rating fallback; that unrelated integration is unchanged.

## Review locally

Run `npm run dev -- --open /apps/smarty-colours/` in the website repository. Publication remains blocked by the decisions above.

## Storage

Retained approximately 5.1 MiB of new source, fonts, artwork, original design references and selected review evidence. Removed 341.1 MiB of task-created validation/build files and the temporary site copy after checking running processes and open files. No pre-existing build caches or simulators were removed. The test PNG download was moved into the review evidence.

## Release preparation — 31 October 2026

Prepared an online-colouring launch in an isolated checkout of current remote main. The original checkout's unrelated Compact and Breastfeeding changes are excluded from the release.

- Confirmed the configured pencil icon against Apple's live v1.3.7 listing. Updated the app registry/schema, header/footer/promo, local PNG export, favicon and Apple touch icon to derivatives of that source. Icon provenance is in `smarty-colours-design/icon-source.json`.
- Added route icons and British-English language to initial prerendered HTML. The four schema entities now survive hydration consistently. Added social-image alt text and an accurate online-colouring title/156-character description.
- Replaced TTF fonts with equivalent official self-hosted WOFF2s: 1,753,712 to 381,664 bytes (78.2% smaller), with the same font metrics and retained licences.
- Changed unavailable PDF claims to clearly labelled coming-soon copy. Printable-pack SEO URLs/downloads remain unfinished; this release's search footprint is the landing page.
- Production build, all validation checks and rendered browser metadata pass. No Search Console, field Core Web Vitals or ranking evidence has been obtained.

Domain confirmation is pending. No publication has occurred and `noindex,follow` remains in place until the destination is chosen, as required by the original hand-off. Browser-review screenshot: `smarty-colours-design/review/release-ready.png`.

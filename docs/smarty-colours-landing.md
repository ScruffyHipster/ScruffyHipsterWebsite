# SmartyColours website

Canonical home: https://scruffyhipster.com/apps/smarty-colours/ (approved by the user on 31 October 2026). The free library lives at `/apps/smarty-colours/colouring-pages/`.

## Design and artwork sources

- [SmartyColours Web](https://claude.ai/artifact/JVBBtGbRSdPvpqvrL4hqvz): README, components, Day/Night tokens, Grandstander/Andika fonts, kid-safe rules and printable specifications.
- [SmartyColours Site Designs](https://claude.ai/artifact/YZBgVxnyFiDDWmcB2Pn6YY): Home, Packs, PackDetail and Printable artboards. Reference files are retained in `docs/smarty-colours-design/`.
- The catalogue in `content/smarty-colours/catalogue.json` selects five original drawings from each of the app's 15 active packs, plus Flowers from the supplied design. All 16 packs are free on the web. `pack-selection.json` records source paths, hashes and native dimensions; contact sheets show the accepted selections.
- Original app covers replace screenshot crops. Studio drawings use the same 80 original pages as the PDFs. The configured rainbow pencil icon is recorded in `icon-source.json`. Apple's official App Store badge and licensed fonts are self-hosted.

## Implementation

The Home keeps its eight-pack teaser and six-picture strip. Its pack links now lead to the real library and pack pages. The library groups all 16 packs into four shelves. Each pack has a five-picture grid and a sixth grown-up app card. Each picture also has its own descriptive URL, A4/Letter download and direct colouring link.

The 192 committed PDFs contain 160 individual sheets and 32 pack bundles. A bundle has seven physical pages: cover, five free drawings, and a final grown-up app information page. Both A4 and US Letter masters use 10 mm margins, a paper-only blank Name line, rounded artwork frame, five planning circles and `scruffyhipster.com` in the footer. Original lines are vector paths traced at native resolution and reinforced to a minimum 2.5 pt; they are not raster upscales. PDFs contain no forms, outbound links or QR codes.

The lazy-loaded studio offers each pack's five pictures, Fill/Crayon/Paint/Rubber, nine colours and eight undo steps. Inactive paintings are compressed PNGs held only in tab memory; raw undo pixels stay limited to the active picture. Save composes a branded 1080 × 1080 PNG locally. Print uses a temporary same-origin A4/Letter PrintSheet. Share, App Store and email actions require the grown-up gate. Internal navigation and PDF downloads do not.

There are no accounts, data-collecting fields, advertisements, external fonts, artwork uploads or SmartyColours analytics. Privacy and terms open within the site. App selling copy is labelled for grown-ups and does not appear inside the colouring studio.

## Search

The library, 16 packs and 80 individual sheets have 97 prerendered, indexable pages. They have unique titles/descriptions, self-referencing canonicals, descriptive image alt text, social previews, breadcrumbs and appropriate CollectionPage/WebPage/ImageObject structured data. Image and PDF destinations are self-hosted. The XML sitemap includes all 97 URLs and their images; Home retains FAQPage markup matching its visible answers. Colouring query URLs canonicalise to Home.

These checks establish technical readiness. Search Console indexing, field Core Web Vitals and rankings have not been measured.

## Validation and maintenance

`npm run check` builds the client and server, prerenders 150 public routes, and runs the existing site validation plus SmartyColours fill, privacy, studio and pack checks. Pack checks verify the 16 × 5 catalogue, original image hashes, all 192 reviewed PDF hashes and paper sizes, all 97 generated routes, download links, six-card layouts and image sitemap coverage.

The development-only PDF dependencies are pinned in `scripts/PDFrequirements.dev.txt`. Website CI serves committed PDFs and needs no Python dependencies. When artwork changes, regenerate in bounded batches, then independently validate and render the saved outputs:

```sh
python scripts/generate-smarty-colours-pdfs.py --pack-offset 0 --pack-count 8
python scripts/generate-smarty-colours-pdfs.py --pack-offset 8 --pack-count 8 --validate-all
python scripts/generate-smarty-colours-pdfs.py --validate-only
```

`docs/smarty-colours-pdf-validation.json` records page counts, sizes, hashes and checks. The two printable review images show all 80 sheets and the cover/sheet/end layouts on both paper sizes. Review new outputs visually before accepting changed hashes. Remove the task-owned `/tmp/smarty-colours-pdf-work` after authoring processes finish.

Browser review covers desktop and 390 px phone layouts, Day/Night themes, paper-size persistence, five-picture pack selection, colouring memory and grown-up gate dismissal. Physical printer, iPad and Apple Pencil behaviour is not tested here. Vite retains its existing shared-bundle advisory; network-restricted validation uses the existing Rewire rating fallback.

# Rewire URL consistency audit

Audited 26 September 2026. Production evidence was collected from 32 HTTP requests covering the 12 Rewire landing/blog routes in both slash forms, legacy product and privacy addresses, the catalogue, homepage, robots.txt and sitemap.xml.

## Confirmed production state before these changes

- All 12 missing-slash Rewire URLs returned HTTP 301 to their trailing-slash version. All 12 destinations returned HTTP 200 with one matching self-canonical and index,follow.
- The sitemap listed each canonical Rewire landing/blog URL once. robots.txt allowed crawling and pointed to the correct sitemap.
- `/apps/rewire/` remained an independently indexable product page, with its own canonical and sitemap entry. Catalogue links used this older destination.
- `/pages/portfolio/rewire.html` used an immediate HTML redirect to that older product page, creating an unnecessary intermediate destination.
- The legacy privacy redirect correctly led to `/privacy/rewire/` and needed no change.

Historical slash variants in Search Console therefore do not establish a current slash redirect fault. Google-selected canonicals require URL Inspection; they cannot be inferred from the supplied CSVs.

## Fixes in this source change

- Catalogue links now lead directly to `/rewire/`.
- Both old product addresses redirect directly to `/rewire/`, and the old app page is removed from the published-route list and sitemap.
- Static redirect documents carry a destination canonical, noindex and immediate meta refresh with a JavaScript fallback. Client-side routes use replacement navigation to the same destination.
- The existing static GitHub Pages publishing architecture supplies HTML redirects for these legacy addresses; this change does not create new server-side HTTP 301 rules. The already-working slash HTTP 301 redirects are separate hosting behaviour.
- The landing footer retains the downloadable press kit previously exposed on the old product page.
- The revised shortlist and detailed comparison link to each other.

## Verification

The full build, TypeScript, SEO/CMS, content ownership and locale checks passed. The additional `npm run check:rewire-seo` command verifies all 12 canonical Rewire pages, unique sitemap URLs, both direct legacy redirects, published internal destinations, consistent slashes and shortlist sourcing/disclosure. It is included in `npm run validate`.

Browser checks confirmed the article renders at desktop and 390px phone widths, the page has no horizontal overflow, the comparison table has its own horizontal scroller, and both generated legacy product documents navigate directly to the production `/rewire/` destination.

These fixes were reviewed in the private Sites build before publication. Production observations above describe the before-change state, not a claim that Google has crawled the corrections. A repository push and a successful public deployment are separate events. Follow `docs/rewire-seo-baseline.md` after public deployment to record the actual deployment date and inspect Google's selected canonical.

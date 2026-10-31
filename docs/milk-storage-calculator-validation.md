# Milk storage calculator validation

Validated 31 October 2026 against the [approved canvas](https://claude.ai/artifact/U36StbuVuC8PGPanvKDPbo#page-98023a683c8b).

- Ported the original phone/desktop layouts, dark appearance, all result states and invitation. Original source fixtures are in `milk-storage-calculator-design/`; the automated copy check compares every static label, FAQ, rule and metadata sentence with those sources.
- Sixteen automated checks cover calendar dates, month-end/leap-year clamping, daylight saving, expiry thresholds, date input and versioned persistence. Website build, typecheck, SEO, content ownership and locale checks pass.
- Browser checks cover 390px phone, 1280px desktop and 320px narrow layouts; fridge, ice, freezer, use-soon, passed, invitation and dark states; keyboard selection; date editing; invitation dismissal and reload restoration. Reduced motion uses the specified 0.96 scale and 3.6s ambient glow. No horizontal overflow at 320px.
- Calculator inputs and dismissal made no fetch or beacon requests in the local browser trace. Data is held only in browser storage; page views and attributed App Store clicks use the existing site analytics.
- SEO: prerendered public route, canonical, index/follow, sitemap, exact approved title/description, social metadata, WebApplication/FAQ/breadcrumb structured data and a site footer link.

Compact browser screenshots and a local interaction trace were retained outside Git at `/tmp/milk-storage-calculator-validation/`. NHS guidance was checked against the source linked in the approved design on the validation date.

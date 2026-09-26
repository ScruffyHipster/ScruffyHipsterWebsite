# Breastfeeding Tracker localisation sources

`de-DE` and `fr-FR` use their own stable, human-researched slugs. Their manifests are the single source for the equivalent-route mapping used by routing, prerendering, metadata, sitemap creation and validation.

Each locale must contain a native-reviewed landing page, fixed Blog/Help/disclosure/privacy copy, eight Blog articles and seven Help articles before its release gate may be opened. Do not mark a locale ready until `translationSourcesComplete`, native editorial review, market-specific fact review and App Store localisation have all been recorded in that locale's manifest.

The English `en-GB` source remains at `content/breastfeeding-tracker/`; it is the `x-default` page and must not be duplicated or moved.

## Localized site review

Run `npm run dev` and open `/de/still-tracker/` or `/fr/suivi-allaitement/`. The header dropdown includes draft landing, Help, Blog and editorial pages in development, and preserves the equivalent article when switching languages. Production routes and language links still require the existing release gates; draft previews use `noindex,nofollow` and are excluded from public hreflang and sitemaps.

Both translations cover the current editorial design, navigation, footer, FAQ answers, accessibility labels, metadata and EUR structured offers. App Store links use the matching country and campaign. Screenshot assets under `public/assets/breastfeeding-editorial/de-DE/` and `fr-FR/` are resized from the corresponding real app snapshots, including light/dark iPhone and iPad views.

Help & Support, all seven help articles, the Blog index, all eight blog articles and the editorial policy now share the existing layouts with localized content. Navigation, related articles, contents anchors, dates, category filters, accessibility labels and App Store destinations follow the URL locale. Privacy and the studio About page still link to clearly labelled English pages.

`npm run check` now includes `check:tracker-locales`, which verifies DE/FR landing and resource routes, equivalent article keys, translated page structure, internal links, contents anchors, screenshots, metadata, App Store links and production release gates. It does not certify native editorial review, market-specific fact review or the live App Store listing.

## Editorial status

The existing shorter DE/FR article editions are retained, with localized metadata and image descriptions. The September sleep-regressions article is now included in both locales. Its linked English sources and UK-specific guidance are identified explicitly; the translation does not claim a new medical review. Internal publication reminders have been moved out of article copy; the manifest review gates remain false.

The formula-price placeholders were replaced with reader-facing local editions using BZfE, Assurance Maladie and the EU formula-composition rules, consulted on 24 September 2026. No current brand-price ranking or individualized feeding recommendation was added. This targeted source check does not complete the locale-wide fact-review gate or native editorial review.

Blog coverage is derived from the English Markdown filenames, so a newly added English article requires corresponding manifest entries and translated source files rather than silently disappearing from localized navigation.

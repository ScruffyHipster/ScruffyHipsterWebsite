Generated JSON files in this directory are written by `scripts/generate-app-content.mjs`.

They are intentionally ignored because the sources of truth are CMS-managed JSON and
Markdown under `content/`, plus fallback external rating data under
`src/content/rewireAppStoreRatingFallback.json`.

`cms-content.json` is the consolidated build interface used by React, route metadata,
prerendering, sitemap generation, and validation.

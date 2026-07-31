# ScruffyHipsterWebsite

The site is a prerendered Vite/React project hosted on GitHub Pages. Pages CMS is
the editing layer: it edits the repository files defined in `.pages.yml`, while
the existing GitHub Actions workflow continues to build and deploy the site.

## Content

- `content/cms/site.json` owns branding, navigation, footer, shared labels, and
  default SEO.
- `content/pages/*.json` owns the fixed page copy.
- `content/apps/*.json` and `content/privacy-policies/*.json` own app and policy
  records.
- `content/rewire/landing.json` and
  `content/breastfeeding-tracker/landing.json` own the specialised landing pages.
- `content/rewire-blog/*.md` and
  `content/breastfeeding-tracker/guides/*.md` own article bodies.
- `content/standard-pages/*.json` contains optional top-level pages assembled
  from controlled reusable sections.
- `public/assets/uploads/` is the destination for new CMS uploads. Existing
  assets remain available from `public/assets/`.

`npm run generate:content` validates these sources and writes the ignored
`src/generated/cms-content.json` bundle consumed by React, route metadata,
prerendering, and sitemap generation.

## Local checks

```sh
npm ci
npm run check
```

`npm run check` builds all public routes, runs TypeScript, validates content
schemas and relationships, checks assets and alt text, follows internal links,
checks the sitemap and all legacy redirects, parses JSON-LD, and rejects public
string literals added directly to React templates.

To compare a CMS-backed build with a saved pre-migration build:

```sh
npm run compare:cms -- /path/to/baseline/dist dist
```

## Pages CMS setup

1. Sign in at [Pages CMS](https://app.pagescms.org/) with GitHub and install its
   GitHub App for this repository.
2. Open the repository on the `main` branch. Pages CMS reads `.pages.yml` from
   the selected branch; the target branch is intentionally not hidden in site
   code.
3. Review Global, Fixed pages, Apps, Privacy policies, Rewire, Breastfeeding
   Tracker, and Standard pages.
4. Make a harmless copy edit and save it. The CMS commit should use the
   `content: update …` message configured in `.pages.yml`.
5. Confirm the `Deploy Website` workflow runs `npm run validate` before its
   upload/deploy steps and completes successfully.

Existing app, privacy, and article filenames cannot be renamed or deleted in
Pages CMS. A new standard page or article chooses its filename only when it is
created; that filename is its immutable slug. Published standard-page slugs are
also checked against every reserved core, app, privacy, Rewire, and
Breastfeeding Tracker route.

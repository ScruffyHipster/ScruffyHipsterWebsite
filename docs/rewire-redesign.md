# Rewire redesign and comparison editorial

Implemented 26 September 2026 in the existing Vite/React site.

## Content and routes

- `/rewire/`: product navigation, scroll-driven native session preview, real App Store screenshots, current integrations, privacy explanation, featured comparison, and FAQs.
- `/rewire/blog/`: featured comparison plus the nine existing articles.
- `/rewire/blog/rewire-vs-opal-one-sec-brick/`: disclosed maker-authored comparison with official sources, a review date, and a recommendation for Rewire when straightforward iPhone focus is the priority.
- Existing article URLs remain unchanged. Markdown headings now match the generator's one-level offset, giving articles H2 sections and working contents links. The two main app-blocker guides link to the new comparison.

Copy lives in `content/rewire/landing.json`, `content/pages/rewire-blog.json`, and `content/rewire-blog/*.md`. The existing content generator handles publication, sitemap discovery, prerendering, reading time, and contents anchors. No additional dependency is required. Shared shell changes preserve Compact and Tracker routing.

## Research boundaries

Official sources checked on 26 September 2026:

- Rewire US App Store: https://apps.apple.com/us/app/app-blocker-focus-rewire/id6757722922
- Opal: https://opalapp.com/help/why-pay-for-opal
- one sec: https://one-sec.app/ and https://one-sec.app/platforms/
- Brick: https://getbrick.com/pages/faq and https://getbrick.com/

Rewire's published listing supports Focus modes, Siri, Shortcuts, allow lists, timed/always-on sessions, iOS 26.1+, and free download with in-app purchases. The privacy copy preserves the distinction between no advertising/cross-app tracking and limited anonymous analytics. No universal cheapest/best, reliability, clinical, or measured time-saving claim is made. The comparison is documentation-based; the competitors were not hands-on tested.

The supplied Search Console screenshot suggests app-blocker/iPhone query themes. It does not establish search volume, ranking improvements, or future traffic. Keep the broad checklist URL separate from the named competitor comparison and connect them with internal links.

## Validation

Run `npm run check`: production build, TypeScript, SEO, content ownership, and Tracker locale checks. Check the landing page, blog, and comparison in desktop and mobile browser sizes. Exercise session progression in both scroll directions, session navigation, Start/Cancel/End, FAQ disclosure, article contents, and horizontal table scrolling. Production deployment and subsequent Search Console performance are separate acceptance steps.

## Native session story

The hero phone recreates `HomeView`, `SessionCard`, and `VerticalSwipePager` from the Rewire iOS repository: the warm `#f6f4f1` background, glass toolbar, session counter, centered session details, Start control, and vertical paging. Deep Work, A Good Book, and Being Present are example configurations, not user data. Start previews the active state with a paused sample timer; it does not block apps.

One sticky phone accompanies all three narrative sections. A requestAnimationFrame scroll handler reads every section position against a reading line, so scrolling down advances and scrolling up reverses reliably. Mobile sizing reserves space for the narrative; short viewports use a non-sticky preview with manual session controls. Hidden session pages are inert, clipping containers cannot scroll on focus, and reduced-motion preferences disable transitions. All public demo copy is in the CMS landing JSON.

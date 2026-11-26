# Search Console keyword plan — 26 November 2026

Source: Search Console export for scruffyhipster.com, web search, last 16 months
(1,606 impressions, 17 clicks). UK gives 12 of the 17 clicks; the US gives 864 impressions.

## What the site already ranks for

| Cluster | Key queries (impressions, avg position) | Page |
| --- | --- | --- |
| iPhone app blockers | app blocker iphone (90, 22.7), best app blocker for iphone (78, 18.3), app blocker for iphone (62, 24.4), app blocker ios (51, 25.5), iphone app blocker (43, 24.5), free app blocker iphone (22, 21.6), apps that block apps iphone (17, 30.7) | /rewire/blog/best-app-blocker-for-iphone/ (737 impressions, 0 clicks) |
| Huckleberry vs Nara | nara baby vs huckleberry (34, 9.7), nara vs huckleberry (28, 13.9, 1 click), huckleberry vs nara baby (9, 8.4, 1 click), plus nine smaller variants at positions 7.5–10 | /breastfeeding-tracker/blog/huckleberry-nara-baby-alternatives/ (68 impressions, position 6.8) |
| Best breastfeeding app | best breastfeeding app (35, 21.3), good breastfeeding apps (24, 25.3), best breastfeeding tracking app (17, 30.9), good breastfeeding app (16, 32.9), best breastfeeding tracker app (13, 50.1), best nursing tracker app (9, 45.9), breastfeeding apps free (6, 42.5) | /breastfeeding-tracker/blog/best-breastfeeding-apps/ (419 impressions, position 24.2) |

The trailing-slash duplicate of the app blocker URL (110 impressions) already 301s to the
canonical slash URL. See `docs/rewire-seo-audit.md`. No change is needed.

## Changes in this branch

1. **App blocker post**: the title, meta title and description now lead with the exact
   phrase "app blocker for iPhone" and add "free" and "iOS". Two new sections answer
   "how do apps block other apps on iPhone" (Screen Time permission) and
   "free app blockers for iPhone".
2. **Huckleberry/Nara post**: the title, meta title, H1 and opening now answer the
   head-to-head "Huckleberry vs Nara Baby" query that earns the site's clicks. It has a
   comparison table built only from the official sources already cited (checked
   26 September 2026) and a "Which is better?" FAQ. The alternatives content is unchanged.
3. **Best breastfeeding apps post**: the title and meta now include "tracker apps", the
   intro names "nursing or feeding trackers", and the "free" FAQ now answers
   "best free breastfeeding tracker app". The UK framing and the six-question FAQ count
   are kept.

## Measure

Re-export Search Console about 28 days after deployment. Compare position and CTR for
the query clusters above against this baseline. Request indexing for the three URLs
after deployment.

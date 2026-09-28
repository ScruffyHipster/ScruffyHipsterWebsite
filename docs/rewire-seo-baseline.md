# Rewire Search Console baseline and export instructions

Prepared 26 September 2026. Use the Search Console property covering `https://scruffyhipster.com/`. The private Sites preview is for reviewing changes and is not the SEO measurement target.

## What the supplied export establishes

The original Web search export covers 25 June–24 September 2026 and is not filtered to Rewire. Preserve the original seven CSVs unchanged.

| Scope | Impressions | Clicks | Notes |
| --- | ---: | ---: | --- |
| Whole property, full export period | 421 | 6 | Chart.csv total; CTR 1.43% |
| Whole property, 28 August–24 September | 359 | 3 | Last complete 28-day window in the supplied Chart.csv |
| Rewire landing and blog, full export period | 213 | 0 | Sum of the six /rewire/ rows in Pages.csv; excludes legacy app and privacy pages |
| Exact query: best app blockers, full export period | 27 | 0 | Average position 10.22; ranking URL not established by these separate exports |

The Rewire page subtotal is not a deduplicated property total. Pages.csv totals 458 impressions because its counting unit differs from Chart.csv. Queries.csv reports 293 impressions and 2 clicks; query rows do not account for all chart activity. Google can omit anonymised queries. Do not join the separate query and page tables by position, order, or matching totals.

## Export A: identify the page ranking for “best app blockers”

1. Open **Performance → Search results** for the Scruffyhipster property.
2. Select **Search type: Web**. Remove existing Page, Query, Country, Device and Search appearance filters.
3. Set a custom date range of **25 June–24 September 2026** to reproduce the supplied historical period.
4. Enable all four metrics: **Total clicks, Total impressions, Average CTR, Average position**.
5. Choose **Add filter → Query → Exact query** and enter `best app blockers`. Do not use “containing” for this first export.
6. Open the **Pages** tab. This is the query-filtered page breakdown that was missing from the original export. Leave Page unfiltered so an unexpected ranking page remains visible.
7. Use **Export → Download CSV** and keep the entire export, including Filters.csv. Store it in a folder named `best-app-blockers_exact_2026-06-25_to_2026-09-24`.
8. Repeat with the latest complete 28 days to see the current ranking URLs. Record the explicit start and end dates in the folder name.

If more than one URL appears, that is not sufficient evidence of harmful competition: compare dates and the Google-selected canonical before removing or redirecting pages.

## Export B: measure Rewire consistently

1. Return to **Performance → Search results**, with **Web** selected and all four metrics enabled.
2. Remove the exact-query filter and any Country, Device or Search appearance filter.
3. Add **Page → Custom (regex) → Matches regex** with this expression:

```text
^https://scruffyhipster\.com/rewire(/|$)
```

This selects the landing page and blog, including the root URL without its slash. It excludes `/apps/rewire/`, `/privacy/rewire/` and other apps. Unlike a simple “contains /rewire/” filter, it does not include those unrelated path prefixes.

4. For the historical baseline, set **28 August–24 September 2026** and export all CSVs. Name the folder `rewire_baseline_2026-08-28_to_2026-09-24`.
5. For the first full period after the 26 September redesign, export **27 September–24 October 2026**, once all those dates have complete data. Name it `rewire_post-redesign_2026-09-27_to_2026-10-24`.
6. Use **Date → Compare → Custom** to compare those two 28-day windows. Keep every other filter unchanged. Export the comparison separately and retain both original single-period exports.
7. Inspect **Queries**, **Pages**, and **Dates**. Review Devices and Countries only within this Rewire-filtered report, rather than reusing the original whole-site breakdowns.

The intervening 25–26 September is excluded because the supplied export stops on the 24th and deployment activity occurred on the 26th. Both comparison windows span four complete weeks. Do not compare a partial post-change week with a full 28-day period.

If the production deployment date differs, shift the post-change window to the day after the verified deployment and record that date. A Sites preview update does not mark a production SEO change. Record later shortlist/URL changes as separate events; the combined before/after comparison cannot isolate their individual effects.

## Export C: track the shortlist despite slash variants

Replace the Page filter with:

```text
^https://scruffyhipster\.com/rewire/blog/best-app-blocker-for-iphone/?$
```

Use the same date windows and open **Queries**. Export all files into a separate `rewire_shortlist` folder. Keep Query unfiltered to discover all searches that show this article. To inspect the exact opportunity only, add **Query → Exact query → best app blockers** and label that additional export distinctly.

For a broader query family, use a separate report with **Query → Custom (regex)**:

```text
^(best app blockers|best app blocker for iphone|best iphone app blocker|best app blocker iphone)$
```

Keep the exact-query report as the primary reference; changing the query mix can change the average position without an individual query improving.

## URL Inspection checks after production publication

Inspect the following URLs individually:

- `https://scruffyhipster.com/rewire/`
- `https://scruffyhipster.com/rewire/blog/best-app-blocker-for-iphone/`
- `https://scruffyhipster.com/rewire/blog/best-app-blocker-for-iphone`
- `https://scruffyhipster.com/apps/rewire/`

Record indexing status, last crawl, user-declared canonical, and Google-selected canonical when available. Use **Test live URL** for the current fetch result; the indexed report can still describe an older crawl. Redirecting old URLs should not remain separate indexed destinations after Google processes the changes. Request indexing of materially updated canonical pages if appropriate, and confirm `https://scruffyhipster.com/sitemap.xml` is submitted. Do not request indexing of the redirect pages or private Sites preview.

## What to measure

- Compare total clicks and impressions with the identical Page filter and date lengths.
- Calculate CTR as total clicks divided by total impressions, not the average of daily percentages.
- Follow average position for the same exact query and country/device settings. Lower is better, but it is an average of recorded appearances, not a guaranteed current rank.
- Record App Store CTA clicks separately if website analytics supports them. Search Console cannot establish app installs, subscriptions or conversion rate after a visit.
- Expect low counts to fluctuate. A zero-click result with a handful of impressions does not establish a messaging problem.

No Search Console settings have been changed and no authenticated reports have been exported in this task. These instructions define the repeatable measurement setup; the supplied export cannot reveal the query-to-page relationship on its own.

## References

- [Google: Performance report metrics and exports](https://support.google.com/webmasters/answer/7576553)
- [Google: filters, exact matching, regex and date comparisons](https://support.google.com/webmasters/answer/17011165)
- [Google: query and page dimensions](https://support.google.com/webmasters/answer/17011259)
- [Google: property versus page aggregation](https://support.google.com/webmasters/answer/17011364)
- [Google: canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

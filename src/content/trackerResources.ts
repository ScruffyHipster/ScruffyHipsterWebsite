import { useLocation } from "react-router-dom";
import { breastfeedingTrackerGuides, breastfeedingTrackerBlogPosts, breastfeedingTrackerContent, type BreastfeedingTrackerArticle } from "./breastfeedingTracker";
import { breastfeedingSupportPageContent, breastfeedingBlogPageContent, breastfeedingBlogDisclosurePageContent } from "./pages";
import { localeForPath, reviewableTrackerLocales, trackerLocalePath } from "./trackerLocales";
import { trackerLandingForPath } from "./trackerLanding";

type LocalizedArticle = BreastfeedingTrackerArticle & { translationKey: string };

export function useTrackerResources() {
  const { pathname } = useLocation();
  const locale = localeForPath(pathname);
  const config = reviewableTrackerLocales().find((candidate) => candidate.locale === locale);
  const source = config?.sourceContent;
  const articles = (collection: "blog" | "guides", english: BreastfeedingTrackerArticle[]): LocalizedArticle[] =>
    source ? Object.values(source[collection]).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)) as LocalizedArticle[]
      : english.map((article) => ({ ...article, translationKey: article.slug }));
  return {
    locale,
    ogLocale: config?.ogLocale ?? "en_GB",
    robots: config && !config.enabled ? "noindex,nofollow" : undefined,
    homePath: trackerLocalePath(locale, "landing")!,
    supportPath: trackerLocalePath(locale, "support")!,
    blogPath: trackerLocalePath(locale, "blog")!,
    disclosurePath: trackerLocalePath(locale, "editorialDisclosure")!,
    content: trackerLandingForPath(pathname),
    supportEmailSubject: source?.fixed.support.contact.subject ?? "Breastfeeding Tracker support",
    editorialEmailSubject: source?.fixed.editorialDisclosure.contactSubject ?? "Blog editorial feedback",
    supportPage: source?.fixed.support ?? breastfeedingSupportPageContent,
    blogPage: source?.fixed.blog ?? breastfeedingBlogPageContent,
    disclosurePage: source?.fixed.editorialDisclosure ?? breastfeedingBlogDisclosurePageContent,
    supportTemplate: source?.fixed.support.articleTemplate ?? breastfeedingTrackerContent.supportTemplate,
    guides: articles("guides", breastfeedingTrackerGuides),
    posts: articles("blog", breastfeedingTrackerBlogPosts),
    formatDate: (value: string) => new Intl.DateTimeFormat(locale, {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
    }).format(new Date(`${value}T00:00:00Z`))
  };
}

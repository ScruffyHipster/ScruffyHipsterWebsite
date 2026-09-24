import { Fragment } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { HomePage } from "../pages/HomePage";
import { AppsPage } from "../pages/AppsPage";
import { AboutPage } from "../pages/AboutPage";
import { AppDetailPage } from "../pages/AppDetailPage";
import { PrivacyPolicyPage } from "../pages/PrivacyPolicyPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RewireLandingPage } from "../pages/RewireLandingPage";
import { RewireBlogIndexPage } from "../pages/RewireBlogIndexPage";
import { RewireBlogPostPage } from "../pages/RewireBlogPostPage";
import { BreastfeedingTrackerLandingPage } from "../pages/BreastfeedingTrackerLandingPage";
import { BreastfeedingTrackerSupportPage } from "../pages/BreastfeedingTrackerSupportPage";
import { BreastfeedingTrackerSupportArticlePage } from "../pages/BreastfeedingTrackerSupportArticlePage";
import { BreastfeedingTrackerBlogPage } from "../pages/BreastfeedingTrackerBlogPage";
import { BreastfeedingTrackerBlogPostPage } from "../pages/BreastfeedingTrackerBlogPostPage";
import { BreastfeedingTrackerBlogDisclosurePage } from "../pages/BreastfeedingTrackerBlogDisclosurePage";
import { StandardPage } from "../pages/StandardPage";
import {
  BREASTFEEDING_TRACKER_BASE_PATH,
  BREASTFEEDING_TRACKER_BLOG_BASE_PATH,
  BREASTFEEDING_TRACKER_BLOG_DISCLOSURE_PATH,
  BREASTFEEDING_TRACKER_SUPPORT_BASE_PATH,
  LEGACY_BREASTFEEDING_TRACKER_GUIDES_BASE_PATH,
  LEGACY_BREASTFEEDING_TRACKER_PATH,
  legacyRedirects
} from "../content/routes";
import { reviewableTrackerLocales } from "../content/trackerLocales";
import { canonicalPath } from "../seo/canonical";

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="apps" element={<AppsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="rewire" element={<RewireLandingPage />} />
        <Route path="rewire/blog" element={<RewireBlogIndexPage />} />
        <Route path="rewire/blog/:slug" element={<RewireBlogPostPage />} />
        {reviewableTrackerLocales().map((locale) => (
          <Fragment key={locale.locale}>
            <Route path={locale.prefix} element={<BreastfeedingTrackerLandingPage key={locale.locale} />} />
            <Route path={`${locale.prefix}/${locale.routes.support}`} element={<BreastfeedingTrackerSupportPage key={locale.locale} />} />
            <Route path={`${locale.prefix}/${locale.routes.support}/:slug`} element={<BreastfeedingTrackerSupportArticlePage key={locale.locale} />} />
            <Route path={`${locale.prefix}/${locale.routes.blog}`} element={<BreastfeedingTrackerBlogPage key={locale.locale} />} />
            <Route path={`${locale.prefix}/${locale.routes.editorialDisclosure}`} element={<BreastfeedingTrackerBlogDisclosurePage key={locale.locale} />} />
            <Route path={`${locale.prefix}/${locale.routes.blog}/:slug`} element={<BreastfeedingTrackerBlogPostPage key={locale.locale} />} />
          </Fragment>
        ))}
        <Route
          path={BREASTFEEDING_TRACKER_BASE_PATH}
          element={<BreastfeedingTrackerLandingPage />}
        />
        <Route
          path={BREASTFEEDING_TRACKER_SUPPORT_BASE_PATH}
          element={<BreastfeedingTrackerSupportPage />}
        />
        <Route
          path={`${BREASTFEEDING_TRACKER_SUPPORT_BASE_PATH}/:slug`}
          element={<BreastfeedingTrackerSupportArticlePage />}
        />
        <Route
          path={BREASTFEEDING_TRACKER_BLOG_BASE_PATH}
          element={<BreastfeedingTrackerBlogPage />}
        />
        <Route
          path={BREASTFEEDING_TRACKER_BLOG_DISCLOSURE_PATH}
          element={<BreastfeedingTrackerBlogDisclosurePage />}
        />
        <Route
          path={`${BREASTFEEDING_TRACKER_BLOG_BASE_PATH}/:slug`}
          element={<BreastfeedingTrackerBlogPostPage />}
        />
        {legacyRedirects
          .filter(({ from }) => from.startsWith(LEGACY_BREASTFEEDING_TRACKER_GUIDES_BASE_PATH))
          .map(({ from, to }) => (
            <Route key={from} path={from} element={<Navigate to={canonicalPath(to)} replace />} />
          ))}
        <Route
          path={LEGACY_BREASTFEEDING_TRACKER_PATH}
          element={<Navigate to={canonicalPath(BREASTFEEDING_TRACKER_BASE_PATH)} replace />}
        />
        <Route path="apps/:slug" element={<AppDetailPage />} />
        <Route path="privacy/:slug" element={<PrivacyPolicyPage />} />
        <Route path="index.html" element={<Navigate to="/" replace />} />
        <Route path=":slug" element={<StandardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

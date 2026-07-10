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

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="apps" element={<AppsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="rewire" element={<RewireLandingPage />} />
          <Route path="rewire/blog" element={<RewireBlogIndexPage />} />
          <Route path="rewire/blog/:slug" element={<RewireBlogPostPage />} />
          <Route path="apps/:slug" element={<AppDetailPage />} />
          <Route path="privacy/:slug" element={<PrivacyPolicyPage />} />
          <Route path="index.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

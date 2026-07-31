import { Link, Outlet, useLocation } from "react-router-dom";
import { apps } from "../content/apps";
import { privacyPolicies } from "../content/privacyPolicies";
import { siteConfig } from "../content/site";
import { RouteAnalytics } from "../analytics/RouteAnalytics";
import { ScrollToTop } from "./ScrollToTop";
import {
  appRoutePath,
  BREASTFEEDING_TRACKER_BASE_PATH,
  BREASTFEEDING_TRACKER_GUIDES_BASE_PATH,
  privacyRoutePath
} from "../content/routes";
import { canonicalPath } from "../seo/canonical";

export function AppShell() {
  const location = useLocation();
  const showFooter = location.pathname !== "/";
  const normalizedPathname = location.pathname.replace(/\/+$/, "") || "/";
  const isBreastfeedingTrackerRoute =
    normalizedPathname === BREASTFEEDING_TRACKER_BASE_PATH ||
    normalizedPathname.startsWith(`${BREASTFEEDING_TRACKER_GUIDES_BASE_PATH}/`) ||
    normalizedPathname === BREASTFEEDING_TRACKER_GUIDES_BASE_PATH;

  return (
    <div className={`site-shell${isBreastfeedingTrackerRoute ? " feeding-site-shell" : ""}`}>
      <RouteAnalytics />
      <ScrollToTop />
      <div className="bg-orb bg-orb-a" aria-hidden="true" />
      <div className="bg-orb bg-orb-b" aria-hidden="true" />
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <img className="brand-mark" src={siteConfig.branding.logo} alt="" aria-hidden="true" />
            <span>{siteConfig.branding.name}</span>
          </Link>
          <nav className="pill-nav" aria-label={siteConfig.navigation.ariaLabel}>
            {siteConfig.navigation.items.map((item) => (
              <Link key={item.path} to={canonicalPath(item.path)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      {showFooter ? (
        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <p className="footer-heading">{siteConfig.footer.studioHeading}</p>
              <p className="footer-copy">{siteConfig.footer.studioDescription}</p>
            </div>
            <div>
              <p className="footer-heading">{siteConfig.footer.appsHeading}</p>
              <ul className="footer-list">
                <li>
                  <Link to={canonicalPath("/rewire")}>{siteConfig.footer.showcaseLabel}</Link>
                </li>
                {apps.map((app) => (
                  <li key={app.id}>
                    <Link to={appRoutePath(app)}>{app.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="footer-heading">{siteConfig.footer.privacyHeading}</p>
              <ul className="footer-list">
                {privacyPolicies.map((policy) => (
                  <li key={policy.slug}>
                    <Link to={privacyRoutePath(policy)}>{policy.appName}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}

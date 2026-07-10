import { Link, Outlet, useLocation } from "react-router-dom";
import { apps } from "../content/apps";
import { privacyPolicies } from "../content/privacyPolicies";
import { RouteAnalytics } from "../analytics/RouteAnalytics";
import { ScrollToTop } from "./ScrollToTop";

export function AppShell() {
  const location = useLocation();
  const showFooter = location.pathname !== "/";

  return (
    <div className="site-shell">
      <RouteAnalytics />
      <ScrollToTop />
      <div className="bg-orb bg-orb-a" aria-hidden="true" />
      <div className="bg-orb bg-orb-b" aria-hidden="true" />
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <img className="brand-mark" src="/assets/companyLogoBlob.png" alt="" aria-hidden="true" />
            <span>scruffyhipster</span>
          </Link>
          <nav className="pill-nav" aria-label="Primary">
            <Link to="/rewire">Rewire</Link>
            <Link to="/apps">Apps</Link>
            <Link to="/about">About</Link>
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
              <p className="footer-heading">scruffyhipster</p>
              <p className="footer-copy">
                Independent Apple software studio building quiet tools for focus, recovery, habits, and everyday systems.
              </p>
            </div>
            <div>
              <p className="footer-heading">Apps</p>
              <ul className="footer-list">
                <li>
                  <Link to="/rewire">Rewire showcase</Link>
                </li>
                {apps.map((app) => (
                  <li key={app.id}>
                    <Link to={`/apps/${app.slug}`}>{app.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="footer-heading">Privacy Policies</p>
              <ul className="footer-list">
                {privacyPolicies.map((policy) => (
                  <li key={policy.slug}>
                    <Link to={`/privacy/${policy.slug}`}>{policy.appName}</Link>
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

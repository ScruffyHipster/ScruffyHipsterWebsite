import { Link, Outlet } from "react-router-dom";
import { apps } from "../content/apps";
import { privacyPolicies } from "../content/privacyPolicies";
import { RouteAnalytics } from "../analytics/RouteAnalytics";
import { ScrollToTop } from "./ScrollToTop";

export function AppShell() {
  return (
    <div className="site-shell">
      <RouteAnalytics />
      <ScrollToTop />
      <div className="bg-orb bg-orb-a" aria-hidden="true" />
      <div className="bg-orb bg-orb-b" aria-hidden="true" />
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            <span className="brand-dot" aria-hidden="true" />
            <span>Scruffy Hipster</span>
          </Link>
          <nav className="pill-nav" aria-label="Primary">
            <a href="/#apps">Apps</a>
            <a href="/#about">About</a>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <p className="footer-heading">Scruffy Hipster</p>
            <p className="footer-copy">
              Independent iOS studio creating bright, native apps with a focus on quality and thoughtful product design.
            </p>
          </div>
          <div>
            <p className="footer-heading">Apps</p>
            <ul className="footer-list">
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
    </div>
  );
}

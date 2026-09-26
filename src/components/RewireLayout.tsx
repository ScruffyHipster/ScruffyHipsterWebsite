const decoration = { arrow: "↗", down: "↓", check: "✓", plus: "+" };
import type { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  rewireApp,
  rewireAppStoreFacts,
  rewireContent,
} from "../content/rewire";
import "../pages/RewireSite.css";

const c = rewireContent.editorial;
export function RewireLayout({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  return (
    <div className="rw-site">
      <Helmet>
        <meta
          name="apple-itunes-app"
          content={`app-id=${rewireAppStoreFacts.appId}`}
        />
      </Helmet>
      <a className="rw-skip" href="#rewire-content">
        {c.navigation.skip}
      </a>
      <header className="rw-header">
        <div className="rw-container rw-nav">
          <Link className="rw-brand" to="/rewire/">
            <img src={rewireApp.icon} width="36" height="36" alt="" />
            <span>{c.navigation.brand}</span>
          </Link>
          <nav aria-label={c.navigation.label}>
            {c.navigation.items.map((item) => (
              <Link
                key={item.url}
                to={item.url}
                aria-current={
                  item.url === "/rewire/blog/" && pathname.includes("/blog")
                    ? "page"
                    : undefined
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            className="rw-button rw-button-small"
            href={rewireAppStoreFacts.appStoreUrl}
          >
            {c.navigation.download}
            <span aria-hidden="true">{decoration.arrow}</span>
          </a>
        </div>
      </header>
      <main id="rewire-content" tabIndex={-1}>
        {children}
      </main>
      <section className="rw-final">
        <div className="rw-container">
          <p className="rw-eyebrow">{rewireContent.finalCta.eyebrow}</p>
          <h2>{rewireContent.finalCta.heading}</h2>
          <a
            className="rw-button rw-button-lime"
            href={rewireAppStoreFacts.appStoreUrl}
          >
            {rewireContent.finalCta.primaryLabel}
            <span aria-hidden="true">{decoration.arrow}</span>
          </a>
          <p className="rw-small">{c.availability}</p>
        </div>
      </section>
      <footer className="rw-container rw-footer">
        <div>
          <Link className="rw-brand" to="/rewire/">
            {c.navigation.brand}
          </Link>
          <p>{c.footer.tagline}</p>
        </div>
        <div className="rw-footer-links">
          {c.footer.links.map((item) => (
            <a key={item.url} href={item.url}>
              {item.label}
            </a>
          ))}
        </div>
        <Link className="rw-credit" to="/">
          {c.footer.studio}
        </Link>
      </footer>
    </div>
  );
}

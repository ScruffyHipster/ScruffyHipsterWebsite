import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

export function NotFoundPage() {
  return (
    <>
      <Seo
        path="/404"
        meta={{
          title: "Page Not Found | Scruffy Hipster",
          description: "The page you were looking for could not be found on Scruffy Hipster.",
          robots: "noindex,follow"
        }}
      />
      <section className="section-block section-pad">
        <div className="container narrow-container">
          <article className="glass-panel">
            <p className="eyebrow">404</p>
            <h1>Page not found</h1>
            <p>The link may have changed. Try the homepage or browse the app pages.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/">
                Go home
              </Link>
              <a className="btn btn-secondary" href="/#apps">
                Explore apps
              </a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

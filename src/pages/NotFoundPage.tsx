import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { notFoundPageContent } from "../content/pages";

export function NotFoundPage() {
  return (
    <>
      <Seo
        path={notFoundPageContent.route}
        meta={notFoundPageContent.seo}
      />
      <section className="section-block section-pad">
        <div className="container narrow-container">
          <article className="glass-panel">
            <p className="eyebrow">{notFoundPageContent.eyebrow}</p>
            <h1>{notFoundPageContent.heading}</h1>
            <p>{notFoundPageContent.body}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to={notFoundPageContent.primaryCta.url}>
                {notFoundPageContent.primaryCta.label}
              </Link>
              <a className="btn btn-secondary" href={notFoundPageContent.secondaryCta.url}>
                {notFoundPageContent.secondaryCta.label}
              </a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

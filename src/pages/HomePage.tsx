import { Link } from "react-router-dom";
import { siteConfig } from "../content/site";
import { homePageContent } from "../content/pages";
import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { organizationJsonLd, websiteJsonLd } from "../seo/jsonld";

export function HomePage() {
  return (
    <>
      <Seo
        path={homePageContent.route}
        meta={homePageContent.seo}
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />

      <section className="hero-shell">
        <div className="container">
          <Reveal className="hero-copy">
            <img
              className="hero-logo"
              src={siteConfig.branding.logo}
              alt={siteConfig.branding.logoAlt}
            />
            <p className="eyebrow">{homePageContent.hero.eyebrow}</p>
            <h1>{siteConfig.tagline}</h1>
            {homePageContent.hero.paragraphs.map((paragraph) => (
              <p className="lead" key={paragraph}>
                {paragraph}
              </p>
            ))}
            <div className="hero-actions">
              <Link className="btn btn-primary" to={homePageContent.hero.cta.url}>
                {homePageContent.hero.cta.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

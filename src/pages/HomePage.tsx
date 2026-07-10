import { Link } from "react-router-dom";
import { siteConfig } from "../content/site";
import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { organizationJsonLd, websiteJsonLd } from "../seo/jsonld";

export function HomePage() {
  return (
    <>
      <Seo
        path="/"
        meta={{
          title: "Scruffyhipster | Software for Intentional Computing",
          description:
            "Scruffyhipster is an independent Apple software studio building quiet productivity, focus, recovery, and behavioural tooling apps.",
          keywords: [
            "Scruffyhipster",
            "intentional computing",
            "indie app studio",
            "Apple productivity apps",
            "focus apps",
            "behavioural tools"
          ],
          ogImage: "/og-default.png"
        }}
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />

      <section className="hero-shell">
        <div className="container">
          <Reveal className="hero-copy">
            <img className="hero-logo" src="/assets/companyLogoBlob.png" alt="scruffyhipster software studio" />
            <p className="eyebrow">Independent Apple Software Studio</p>
            <h1>{siteConfig.tagline}</h1>
            <p className="lead">
              Most apps are designed to keep you engaged.
            </p>
            <p className="lead">
              I’m building software designed to help you focus, recover, create, and get back to what matters.
            </p>
            <p className="lead">
              No feeds. No dark patterns. No attention traps.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/about#contact">
                contact
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

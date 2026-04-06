import { apps } from "../content/apps";
import { siteConfig } from "../content/site";
import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { AppCard } from "../components/AppCard";
import { organizationJsonLd, websiteJsonLd } from "../seo/jsonld";

export function HomePage() {
  return (
    <>
      <Seo
        path="/"
        meta={{
          title: "Scruffy Hipster | Bright Native iOS Apps",
          description:
            "Explore Rewire, Wren, Smarty Colours, Gro Guardian and Chat with Santa from Scruffy Hipster, an independent iOS studio.",
          keywords: [
            "Scruffy Hipster",
            "iOS apps",
            "indie app studio",
            "Swift apps",
            "App Store apps"
          ],
          ogImage: "/og-default.svg"
        }}
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />

      <section className="hero-shell">
        <div className="container">
          <Reveal className="hero-copy">
            <p className="eyebrow">Independent iOS Studio</p>
            <h1>Bright, native apps with personality.</h1>
            <p className="lead">{siteConfig.description}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#apps">
                Explore Apps
              </a>
              <a className="btn btn-secondary" href="#about">
                About Scruffy Hipster
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="apps" className="section-block section-pad">
        <div className="container">
          <Reveal className="section-head">
            <h2>Apps</h2>
          </Reveal>
          <div className="app-grid">
            {apps.map((app, index) => (
              <Reveal key={app.id} delayMs={Math.min(index * 70, 300)}>
                <AppCard app={app} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section-block section-pad">
        <div className="container about-grid">
          <Reveal>
            <div className="glass-panel">
              <p className="eyebrow">Why Scruffy Hipster</p>
              <h2>Product-minded iOS craftsmanship</h2>
              <p>
                Scruffy Hipster builds focused iOS apps that feel polished, playful, and genuinely useful. From productivity tools to family apps, every product is designed to be fast, intuitive, and App Store-ready.
              </p>
              <ul className="feature-list">
                <li>Native iPhone and iPad apps built with Swift and SwiftUI</li>
                <li>Clean product pages for App Store links, metadata, and sharing</li>
                <li>Practical engineering with attention to polish and performance</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="trust-grid">
              <div className="trust-card">
                <p className="trust-label">Platform</p>
                <h3>iOS Native</h3>
                <p>
                  Built specifically for Apple platforms using native frameworks, with interfaces that feel at home on iPhone and iPad.
                </p>
              </div>
              <div className="trust-card">
                <p className="trust-label">Build Focus</p>
                <h3>Quality + Speed</h3>
                <p>
                  Fast iteration without cutting corners: solid architecture, smooth interactions, and production-ready execution.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

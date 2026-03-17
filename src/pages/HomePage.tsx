import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apps } from "../content/apps";
import { siteConfig } from "../content/site";
import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { AppCard } from "../components/AppCard";
import { organizationJsonLd, websiteJsonLd } from "../seo/jsonld";
import { appRoutePath } from "../content/routes";

export function HomePage() {
  const showcaseApps = apps.slice(0, 3);
  const breastfeedingApp = apps.find((app) => app.slug === "breast-feeding-tracker");
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    if (showcaseApps.length < 2) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveCardIndex((current) => (current + 1) % showcaseApps.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [showcaseApps.length]);

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
        <div className="container hero-grid">
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

          <Reveal className="hero-showcase" delayMs={120}>
            <div className="hero-stack">
              {showcaseApps.map((app, index) => {
                const stackOrder = (index - activeCardIndex + showcaseApps.length) % showcaseApps.length;
                const isTopCard = stackOrder === 0;
                return (
                <div
                  key={app.id}
                  className={`hero-stack-card${isTopCard ? " is-top-card" : ""}`}
                  style={
                    {
                      "--stack-order": stackOrder,
                      "--stack-depth-y": `${stackOrder * 26}px`,
                      "--stack-depth-x": `${stackOrder * 10}px`,
                      "--stack-scale": `${1 - stackOrder * 0.045}`,
                      "--stack-opacity": `${1 - stackOrder * 0.08}`,
                      "--stack-rotate":
                        stackOrder === 0 ? "-2deg" : stackOrder === 1 ? "5deg" : "-6deg"
                    } as CSSProperties
                  }
                >
                  <img src={app.icon} alt="" aria-hidden="true" />
                  <div>
                    <p>{app.name}</p>
                    <span>{app.shortDescription}</span>
                  </div>
                </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="apps" className="section-block section-pad">
        <div className="container">
          <Reveal className="section-head">
            <h2>Apps</h2>
            {breastfeedingApp ? (
              <p>
                Looking for a{" "}
                <Link to={appRoutePath(breastfeedingApp)}>breastfeeding tracker for iPhone and Apple Watch</Link>
                ? Explore{" "}
                <Link to={appRoutePath(breastfeedingApp)}>Breastfeeding Tracker &amp; Timer with widgets, Live Activities, and feed history</Link>
                .
              </p>
            ) : null}
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

      <section className="section-block section-pad">
        <div className="container">
          <Reveal className="cta-banner">
            <div>
              <p className="eyebrow">Start With the Apps</p>
              <h2>Browse the portfolio.</h2>
            </div>
            <div className="cta-banner-actions">
              {breastfeedingApp ? (
                <Link to={appRoutePath(breastfeedingApp)} className="btn btn-primary">
                  Open the breastfeeding tracker for iPhone &amp; Apple Watch
                </Link>
              ) : (
                <Link to={`/apps/${apps[0]?.slug ?? "rewire"}`} className="btn btn-primary">
                  Open an App Page
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

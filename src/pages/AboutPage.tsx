import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { organizationJsonLd, websiteJsonLd } from "../seo/jsonld";

export function AboutPage() {
  return (
    <>
      <Seo
        path="/about"
        meta={{
          title: "About | Scruffyhipster",
          description:
            "Scruffyhipster is an independent Apple software studio building quiet tools for focus, recovery, habits, and everyday systems.",
          keywords: ["Scruffyhipster", "indie Apple software studio", "intentional computing", "calm computing"],
          ogImage: "/og-default.svg"
        }}
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />

      <section className="section-block page-hero">
        <div className="container about-grid">
          <Reveal>
            <div className="glass-panel">
              <p className="eyebrow">Point of view</p>
              <h1>Less noise. More agency.</h1>
              <p>
                Scruffyhipster is an independent software studio building native apps for people who want their devices to behave a little better. The work is practical, opinionated, and deliberately small.
              </p>
              <p>
                The goal is not to make you more productive every second. It is to make useful moments easier to protect.
              </p>
              <ul className="feature-list">
                <li>Native Apple apps built with Swift, SwiftUI, and system APIs where they matter.</li>
                <li>Behaviour-first design: prompts, pauses, timers, routines, and small decisions.</li>
                <li>No noisy growth loops, fake urgency, or attention tricks.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="trust-grid">
              <div className="trust-card">
                <p className="trust-label">Platform</p>
                <h2>Native where it matters</h2>
                <p>
                  The apps are built for iPhone, iPad, Apple Watch, and Mac using Apple platform conventions instead of web-shaped compromises.
                </p>
              </div>
              <div className="trust-card">
                <p className="trust-label">Design</p>
                <h2>Friction on purpose</h2>
                <p>
                  Some tools should slow you down for half a second. A good pause can be more useful than another notification.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

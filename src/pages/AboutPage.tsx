import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { organizationJsonLd, websiteJsonLd } from "../seo/jsonld";
import { aboutPageContent } from "../content/pages";
import { siteConfig } from "../content/site";

export function AboutPage() {
  return (
    <>
      <Seo
        path={aboutPageContent.route}
        meta={aboutPageContent.seo}
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />

      <section className="section-block page-hero">
        <div className="container about-grid">
          <Reveal>
            <div className="glass-panel">
              <p className="eyebrow">{aboutPageContent.intro.eyebrow}</p>
              <h1 className="about-title">{aboutPageContent.intro.heading}</h1>
              {aboutPageContent.intro.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <ul className="feature-list">
                {aboutPageContent.intro.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delayMs={100}>
            <div className="trust-grid">
              {aboutPageContent.principles.map((principle) => (
                <div className="trust-card" key={principle.eyebrow}>
                  <p className="trust-label">{principle.eyebrow}</p>
                  <h2>{principle.heading}</h2>
                  <p>{principle.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="section-block section-pad">
        <div className="container contact-grid">
          <Reveal className="section-head">
            <p className="eyebrow">{aboutPageContent.contact.eyebrow}</p>
            <h2>{aboutPageContent.contact.heading}</h2>
            <p>{aboutPageContent.contact.body}</p>
          </Reveal>
          <Reveal delayMs={100}>
            <form
              className="contact-form"
              action={`mailto:${siteConfig.helloEmail}`}
              method="post"
              encType="text/plain"
            >
              <label>
                <span>{aboutPageContent.contact.nameLabel}</span>
                <input name="name" type="text" autoComplete="name" required />
              </label>
              <label>
                <span>{aboutPageContent.contact.emailLabel}</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                <span>{aboutPageContent.contact.messageLabel}</span>
                <textarea name="message" rows={6} required />
              </label>
              <button className="btn btn-primary" type="submit">
                {aboutPageContent.contact.buttonLabel}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

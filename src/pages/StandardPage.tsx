import { Link, useParams } from "react-router-dom";
import { NotFoundPage } from "./NotFoundPage";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { siteConfig } from "../content/site";
import {
  standardPagesBySlug,
  type StandardPageSection
} from "../content/standardPages";
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd } from "../seo/jsonld";
import { canonicalUrl } from "../seo/canonical";
import { getSiteUrl } from "../seo/metadata";

export function StandardPage() {
  const params = useParams<{ slug: string }>();
  const page = params.slug ? standardPagesBySlug.get(params.slug) : undefined;

  if (!page) {
    return <NotFoundPage />;
  }

  const path = `/${page.slug}`;
  const faqs = page.sections
    .filter((section): section is Extract<StandardPageSection, { type: "faq" }> =>
      section.type === "faq"
    )
    .flatMap((section) => section.items);

  return (
    <>
      <Seo
        path={path}
        meta={page.seo}
        jsonLd={[
          organizationJsonLd(),
          ...(faqs.length ? [faqPageJsonLd(faqs)] : []),
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: getSiteUrl() },
            { name: page.title, url: canonicalUrl(path, getSiteUrl()) }
          ])
        ]}
      />
      {page.sections.map((section, index) => (
        <StandardSection key={`${section.type}-${index}`} section={section} index={index} />
      ))}
    </>
  );
}

function StandardSection({
  section,
  index
}: {
  section: StandardPageSection;
  index: number;
}) {
  if (section.type === "hero") {
    return (
      <section className="section-block page-hero">
        <div className="container">
          <Reveal className="section-head">
            {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
            <h1>{section.heading}</h1>
            {section.body ? <p>{section.body}</p> : null}
            {section.links?.length ? <StandardLinks links={section.links} /> : null}
          </Reveal>
        </div>
      </section>
    );
  }

  if (section.type === "richText") {
    return (
      <section className="section-block section-pad">
        <div className="container narrow-container">
          <Reveal>
            {section.heading ? <h2>{section.heading}</h2> : null}
            <div
              className="standard-rich-text"
              dangerouslySetInnerHTML={{ __html: section.body }}
            />
          </Reveal>
        </div>
      </section>
    );
  }

  if (section.type === "image") {
    return (
      <section className="section-block section-pad">
        <div className="container narrow-container">
          <Reveal>
            <figure className="standard-media">
              <img src={section.src} alt={section.alt} loading="lazy" decoding="async" />
              {section.caption ? <figcaption>{section.caption}</figcaption> : null}
            </figure>
          </Reveal>
        </div>
      </section>
    );
  }

  if (section.type === "gallery") {
    return (
      <section className="section-block section-pad">
        <div className="container">
          <Reveal className="section-head">
            {section.heading ? <h2>{section.heading}</h2> : null}
          </Reveal>
          <div className="standard-gallery">
            {section.images.map((image, imageIndex) => (
              <Reveal key={image.src} delayMs={Math.min(imageIndex * 60, 240)}>
                <figure className="standard-media">
                  <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "featureList") {
    return (
      <section className="section-block section-pad">
        <div className="container">
          <Reveal className="section-head">
            {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
            {section.heading ? <h2>{section.heading}</h2> : null}
            {section.body ? <p>{section.body}</p> : null}
          </Reveal>
          <div className="feature-grid">
            {section.features.map((feature, featureIndex) => (
              <Reveal
                key={feature.title}
                delayMs={Math.min(featureIndex * 65, 240)}
              >
                <article className="feature-card">
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "cta") {
    return (
      <section className="section-block section-pad">
        <div className="container narrow-container">
          <Reveal className="glass-panel">
            {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
            <h2>{section.heading}</h2>
            {section.body ? <p>{section.body}</p> : null}
            {section.links?.length ? <StandardLinks links={section.links} /> : null}
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="section-block section-pad">
      <div className="container narrow-container">
        <Reveal className="section-head">
          {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
          {section.heading ? <h2>{section.heading}</h2> : null}
        </Reveal>
        <div className="feeding-faq-list">
          {section.items.map((item) => (
            <Reveal key={item.question} delayMs={Math.min(index * 40, 160)}>
              <details>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StandardLinks({
  links
}: {
  links: Array<{ label: string; url: string; style?: "primary" | "secondary" }>;
}) {
  return (
    <div className="hero-actions">
      {links.map((link) => {
        const className = `btn ${
          link.style === "secondary" ? "btn-secondary" : "btn-primary"
        }`;
        return link.url.startsWith("/") ? (
          <Link className={className} key={link.url} to={link.url}>
            {link.label}
          </Link>
        ) : (
          <a
            className={className}
            href={link.url}
            key={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        );
      })}
    </div>
  );
}

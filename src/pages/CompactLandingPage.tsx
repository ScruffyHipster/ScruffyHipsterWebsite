import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import content from "../../content/compact/landing.json";
import app from "../../content/apps/compact.json";
import "./CompactLandingPage.css";
import { CompactMirrorDemo } from "../components/CompactMirrorDemo";

const decoration = { arrow: "↗", down: "↓", device: "◫", light: "☼", plus: "+", ribbon: ["↗", "☼", "⌾"] };
export function CompactLandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  const story = content.steps[activeStep];

  useEffect(() => {
    const container = stepsRef.current;
    const elements = Array.from(container?.querySelectorAll<HTMLElement>("[data-step]") ?? []);
    if (!container || !elements.length) return;
    const mobile = window.matchMedia("(max-width: 760px)");
    let frame: number | null = null;
    let disposed = false;

    const update = () => {
      frame = null;
      // Read every step against one fixed reading line. IntersectionObserver
      // batches contain only changed entries, which can select an outgoing step.
      const readingLine = window.innerHeight * (mobile.matches ? 0.725 : 0.5);
      let next = 0;
      elements.forEach((element, index) => {
        if (element.getBoundingClientRect().top <= readingLine) next = index;
      });
      setActiveStep((current) => current === next ? current : next);
    };
    const scheduleUpdate = () => {
      if (!disposed && frame === null) frame = window.requestAnimationFrame(update);
    };
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(container);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    mobile.addEventListener("change", scheduleUpdate);
    void document.fonts.ready.then(scheduleUpdate);
    update();
    return () => {
      disposed = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("pageshow", scheduleUpdate);
      mobile.removeEventListener("change", scheduleUpdate);
    };
  }, []);

  return (
    <div className="cm-page">
      <Seo path="/compact" meta={app.seo} jsonLd={{ "@context": "https://schema.org", "@type": "WebPage", name: app.seo.title, description: app.seo.description }} />
      <a className="cm-skip" href="#compact-main">{content.skip}</a>
      <header className="cm-header">
        <div className="cm-nav cm-container">
          <Link className="cm-wordmark" to="/compact/"><img className="cm-app-icon" src={app.icon} alt="" width="40" height="40" />{content.brand}<span className="cm-wordmark-dot" /></Link>
          <nav aria-label={content.navLabel}>{content.nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}<a className="cm-nav-cta" href={app.appStoreUrl}>{content.availability}<span aria-hidden="true">{decoration.arrow}</span></a></nav>
        </div>
      </header>
      <main id="compact-main">
        <section className="cm-hero cm-container">
          <div className="cm-hero-copy">
            <p className="cm-eyebrow"><span className="cm-live-dot" />{content.eyebrow}</p>
            <h1>{content.headline[0]}<br /><span>{content.headline[1]}</span></h1>
            <p className="cm-intro">{content.intro}</p>
            <div className="cm-actions"><a className="cm-button" href={app.appStoreUrl}>{content.primaryCta}<span aria-hidden="true">{decoration.arrow}</span></a><a className="cm-text-link" href="#mirror-demo">{content.secondaryCta}<span aria-hidden="true">{decoration.down}</span></a></div>
            <p className="cm-platform"><span aria-hidden="true">{decoration.device}</span>{content.platform}<a className="cm-store-link" href={app.appStoreUrl}>{content.availability}</a></p>
          </div>
          <figure className="cm-demo" id="mirror-demo" aria-label={content.demo.label}>
            <div className="cm-orbit cm-orbit-one" aria-hidden="true" /><div className="cm-orbit cm-orbit-two" aria-hidden="true" />
            <div className="cm-floating-note" aria-hidden="true"><span>{decoration.arrow}</span>{content.heroNote}</div>
            <CompactMirrorDemo />
            <figcaption><strong>{content.demo.hint}</strong><span>{content.demo.caption}</span><span className="cm-demo-help">{content.demo.help}</span></figcaption>
          </figure>
        </section>
        <div className="cm-ribbon"><div className="cm-container">{content.ribbon.map((item, index) => <span key={item}><b aria-hidden="true">{decoration.ribbon[index]}</b>{item}</span>)}</div></div>
        <section className="cm-story cm-container" id="details">
          <div className="cm-section-head"><p className="cm-eyebrow">{content.storyEyebrow}</p><h2>{content.storyHeading}</h2><p>{content.storyIntro}</p></div>
          <div className="cm-story-grid">
            <div className="cm-sticky-demo" aria-hidden="true"><div className="cm-story-backdrop"><CompactMirrorDemo scene={story} interactive={false} /><span className="cm-scene-badge">{story.detail}</span></div><div className="cm-progress">{content.steps.map((step, i) => <span key={step.number} className={i === activeStep ? "is-active" : ""} />)}</div></div>
            <div className="cm-steps" ref={stepsRef}>{content.steps.map((step, index) => <article key={step.number} data-step={index} className={`cm-step${activeStep === index ? " is-active" : ""}`}><span className="cm-step-number">{step.number}</span><h3>{step.title}</h3><p>{step.body}</p><span className="cm-step-detail">{step.detail}<span aria-hidden="true">{decoration.arrow}</span></span></article>)}</div>
          </div>
        </section>
        <section className="cm-moments"><div className="cm-container"><p className="cm-eyebrow">{content.momentsEyebrow}</p><h2>{content.momentsHeading}</h2><div className="cm-moment-grid">{content.moments.map((moment, i) => <article key={moment.time} className={`cm-moment cm-moment-${i}`}><div className="cm-moment-art"><span className="cm-sun" aria-hidden="true" /><span className="cm-sun-shadow" aria-hidden="true" /><img className="cm-moment-image" src={moment.image.src} alt={moment.image.alt} width="720" height="720" loading="lazy" decoding="async" /></div><span className="cm-time">{moment.time}</span><h3>{moment.title}</h3><p>{moment.body}</p></article>)}</div></div></section>
        <section className="cm-privacy cm-container"><div className="cm-privacy-art" aria-hidden="true"><div className="cm-privacy-orbit" /><img className="cm-privacy-icon" src={app.icon} alt="" width="170" height="170" loading="lazy" decoding="async" /></div><div><p className="cm-eyebrow">{content.privacyEyebrow}</p><h2>{content.privacyHeading}</h2><p>{content.privacyBody}</p></div></section>
        <section className="cm-faq cm-container" id="questions"><p className="cm-eyebrow">{content.brand}</p><h2>{content.faqHeading}</h2><div>{content.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">{decoration.plus}</span></summary><p>{faq.answer}</p></details>)}</div></section>
        <section className="cm-closing" id="availability"><div className="cm-container"><p className="cm-eyebrow">{content.closingEyebrow}</p><h2>{content.closingHeading}</h2><p>{content.closingBody}</p><a className="cm-button" href={app.appStoreUrl}>{content.closingCta}<span aria-hidden="true">{decoration.arrow}</span></a></div></section>
      </main>
      <footer className="cm-footer cm-container"><Link className="cm-wordmark" to="/">{content.brand}<small>{content.studio}</small></Link><nav aria-label={content.footerLabel}>{content.footerLinks.map((item) => <Link key={item.href} to={item.href}>{item.label}</Link>)}</nav><span>{content.copyright}</span></footer>
    </div>
  );
}

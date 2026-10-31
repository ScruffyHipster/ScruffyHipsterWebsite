import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent, type PropsWithChildren } from "react";
import { Helmet } from "react-helmet-async";
import { smartyColours as content } from "../content/smartyColours";
import homeHtml from "../content/smartyColoursHome.html?raw";
import { appsBySlug } from "../content/apps";
import { Seo } from "../components/Seo";
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd, softwareApplicationJsonLd } from "../seo/jsonld";
import { canonicalUrl } from "../seo/canonical";
import { getSiteUrl } from "../seo/metadata";
import { siteConfig } from "../content/site";
import "./SmartyColoursLandingPage.css";

const Studio = lazy(() => import("../components/SmartyColoursStudio").then(module => ({ default: module.SmartyColoursStudio })));
type Pack = typeof content.packs[number];
type Information = "privacy" | "terms";
type Gate = { action: () => void; description: string; question: typeof content.gateQuestions[number]; choices: number[] };
let questionIndex = 0;

function Modal({ title, onClose, children, wide = false, gate = false }: PropsWithChildren<{ title: string; onClose: () => void; wide?: boolean; gate?: boolean }>) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    node?.showModal();
    return () => { node?.close(); previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className={`sc-modal${wide ? " sc-modal--wide" : ""}`} aria-labelledby="sc-dialog-title" data-sc-parent-gate={gate || undefined} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === dialog.current) onClose(); }}>
    <div className="sc-modal__body">
      <div className="sc-modal__head"><h2 id="sc-dialog-title">{title}</h2><button type="button" className="sc-btn sc-modal__close" aria-label={content.ui.close} onClick={onClose}>{content.ui.closeSymbol}</button></div>
      {children}
    </div>
  </dialog>;
}

export function SmartyColoursLandingPage() {
  const [theme, setTheme] = useState<"light" | "dark" | undefined>();
  const [picture, setPicture] = useState<string | null>(null);
  const [pack, setPack] = useState<Pack | null>(null);
  const [library, setLibrary] = useState(false);
  const [information, setInformation] = useState<Information | null>(null);
  const [paper, setPaper] = useState("a4");
  const [gate, setGate] = useState<Gate | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const app = appsBySlug.get("smarty-colours");
  const absoluteUrl = canonicalUrl(content.path, getSiteUrl());
  const structuredData = [
    organizationJsonLd(),
    ...(app ? [softwareApplicationJsonLd({
      ...app,
      shortDescription: app.structuredData?.description ?? app.shortDescription,
      seoApplicationSubCategory: app.structuredData?.applicationSubCategory ?? app.seoApplicationSubCategory,
      seoFeatureList: app.structuredData?.featureList ?? app.seoFeatureList,
    }, absoluteUrl)] : []),
    ...(app?.faqs?.length ? [faqPageJsonLd(app.faqs)] : []),
    breadcrumbJsonLd([
      { name: siteConfig.companyName, url: getSiteUrl() },
      { name: siteConfig.navigation.items.find(item => item.path === "/apps")?.label ?? "Apps", url: canonicalUrl("/apps", getSiteUrl()) },
      { name: app?.name ?? "SmartyColours", url: absoluteUrl },
    ]),
  ];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setTheme(preference.matches ? "dark" : "light");
    update(); preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  const requestGrownUp = (action: () => void, description: string) => {
    const question = content.gateQuestions[questionIndex++ % content.gateQuestions.length];
    const choices: number[] = [...question.choices];
    for (let index = choices.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [choices[index], choices[other]] = [choices[other], choices[index]];
    }
    setGate({ action, description, question, choices });
  };
  const openStudio = (id = "curly-sheep") => { setPack(null); setLibrary(false); setPicture(id); };
  const closeStudio = () => { setPicture(null); requestAnimationFrame(() => opener.current?.focus()); };
  const store = () => requestGrownUp(() => window.location.assign(content.storeUrl), content.ui.gateStore);
  const handleHomeClick = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[data-sc-action]");
    if (!link) return;
    event.preventDefault(); opener.current = link;
    switch (link.dataset.scAction) {
      case "studio": openStudio(link.dataset.picture); break;
      case "app-store": store(); break;
      case "library": setLibrary(true); break;
      case "pack": setPack(content.packs.find(item => link.hash === `#pack-${item.id}`) ?? null); break;
      case "privacy": setInformation("privacy"); break;
      case "terms": setInformation("terms"); break;
      case "contact": requestGrownUp(() => window.location.assign(content.contactUrl), content.ui.gateContact); break;
    }
  };

  const themeLabel = theme === "dark" ? content.ui.themeDay : content.ui.themeNight;
  const paperOptions = [["a4", content.ui.a4], ["letter", content.ui.letter]];
  const informationTitle = information === "privacy" ? content.ui.privacyTitle : content.ui.termsTitle;
  const informationBody = information === "privacy" ? content.ui.privacyBody : content.ui.termsBody;

  return <div className="sc-page" data-theme={theme}>
    <Seo path={content.path} meta={{ ...app?.seo, title: content.title, description: content.description, robots: app?.seo.robots ?? "noindex,follow", ogImage: "/smarty-colours/farm-yard-cover.jpg" }} jsonLd={structuredData} />
    <Helmet><body className="sc-document" /><link rel="icon" type="image/png" sizes="64x64" href="/smarty-colours/favicon-64.png" /><link rel="apple-touch-icon" sizes="180x180" href="/smarty-colours/apple-touch-icon.png" /></Helmet>
    <div hidden={picture !== null}>
      <a className="sc-skip" href="#sc-main">{content.ui.skip}</a>
      <div onClick={handleHomeClick} dangerouslySetInnerHTML={{ __html: homeHtml }} />
      <div className="wrap sc-theme-row"><button type="button" className="sc-btn" aria-pressed={theme === "dark"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{themeLabel}</button></div>
    </div>
    {picture !== null && <Suspense fallback={<p className="sc-loading" role="status">{content.ui.loading}</p>}><Studio initialPictureId={picture} onClose={closeStudio} onShareRequest={action => requestGrownUp(action, content.ui.gateShare)} /></Suspense>}
    {library && <Modal wide title={content.ui.libraryTitle} onClose={() => setLibrary(false)}>
      <p>{content.ui.libraryIntro}</p>
      <div className="sc-library-grid">{content.packs.map(item => <button type="button" className="sc-pack" key={item.id} onClick={() => { setLibrary(false); setPack(item); }}><span className="sc-pack__frame"><img src={`/smarty-colours/${item.id}-cover.jpg`} alt={item.alt} width={768} height={768} /></span><span className="sc-pack__name">{item.name}</span><span className="sc-pack__meta">{content.ui.fivePages}</span></button>)}
        <div className="sc-library-app"><span className="sc-tag sc-tag--grown">{content.ui.grown}</span><img src="/smarty-colours/pencil-app-icon.png" alt={app?.iconAlt ?? ""} width={96} height={96} /><h3>{content.ui.more}</h3><p>{content.ui.moreBody}</p><button type="button" className="sc-btn" onClick={() => { setLibrary(false); document.getElementById("app")?.scrollIntoView(); }}>{content.ui.aboutApp}</button></div>
      </div>
    </Modal>}
    {pack && <Modal title={pack.name + content.ui.packSuffix} onClose={() => setPack(null)}>
      <img className="sc-pack-preview" src={`/smarty-colours/${pack.id}-cover.jpg`} alt={pack.alt} width={768} height={768} />
      <span className="sc-tag sc-tag--free">{content.ui.fivePages}</span>
      <fieldset className="sc-paper"><legend>{content.ui.size}</legend>{paperOptions.map(([id, name]) => <label key={id}><input type="radio" name="sc-paper" value={id} checked={paper === id} onChange={() => setPaper(id)} />{name}</label>)}</fieldset>
      <button type="button" className="sc-btn sc-btn--crown" disabled aria-describedby="sc-print-status">{content.ui.download}</button><p id="sc-print-status" role="status">{content.ui.previewNotice}</p>
    </Modal>}
    {information && <Modal title={informationTitle} onClose={() => setInformation(null)}><p>{informationBody}</p></Modal>}
    {gate && <Modal gate title={content.ui.gateTitle} onClose={() => setGate(null)}>
      <span className="sc-tag sc-tag--grown">{content.ui.grown}</span><p>{gate.description}</p><p className="sc-gate__question">{gate.question.question}</p>
      <div className="sc-gate__answers">{gate.choices.map(answer => <button type="button" className="sc-btn sc-btn--kid" key={answer} onClick={() => { const action = gate.action; const correct = answer === gate.question.answer; setGate(null); if (correct) action(); }}>{answer}</button>)}</div>
      <button type="button" className="sc-btn sc-btn--quiet" onClick={() => setGate(null)}>{content.ui.gateBack}</button>
    </Modal>}
  </div>;
}

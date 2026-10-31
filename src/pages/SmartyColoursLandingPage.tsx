import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { smartyColours as content } from "../content/smartyColours";
import homeHtml from "../content/smartyColoursHome.html?raw";
import { appsBySlug } from "../content/apps";
import { Seo } from "../components/Seo";
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd, softwareApplicationJsonLd } from "../seo/jsonld";
import { canonicalUrl } from "../seo/canonical";
import { getSiteUrl } from "../seo/metadata";
import { siteConfig } from "../content/site";
import { SmartyColoursDialog, SmartyColoursGate, createSmartyGate, type SmartyGateRequest } from "../components/SmartyColoursDialog";
import { useSmartyColoursTheme } from "../components/useSmartyColoursTheme";
import { findFreePage, freePacks } from "../content/smartyColourPacks";
import "./SmartyColoursLandingPage.css";

const Studio = lazy(() => import("../components/SmartyColoursStudio").then(module => ({ default: module.SmartyColoursStudio })));
type Information = "privacy" | "terms";

export function SmartyColoursLandingPage() {
  const { theme, toggle } = useSmartyColoursTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [picture, setPicture] = useState<string | null>(null);
  const [packId, setPackId] = useState<string | undefined>();
  const [information, setInformation] = useState<Information | null>(null);
  const [gate, setGate] = useState<SmartyGateRequest | null>(null);
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
    const query = new URLSearchParams(location.search);
    const requested = query.get("picture");
    const selected = requested ? findFreePage(requested) : undefined;
    const requestedPack = query.get("pack");
    const validPack = requestedPack ? freePacks.find(item => item.id === requestedPack) : undefined;
    setPicture(selected?.page.id ?? (validPack ? validPack.pages[0].id : null));
    setPackId(selected?.pack.id ?? validPack?.id);
  }, [location.search]);

  const requestGrownUp = (action: () => void, description: string) => setGate(createSmartyGate(action, description));
  const openStudio = (id = "curly-sheep") => {
    const selected = findFreePage(id);
    if (!selected) return;
    const query = new URLSearchParams(location.search);
    query.set("picture", selected.page.id); query.set("pack", selected.pack.id);
    navigate({ pathname: content.path, search: query.toString() });
  };
  const closeStudio = () => {
    const query = new URLSearchParams(location.search); query.delete("picture"); query.delete("pack");
    setPicture(null); navigate({ pathname: content.path, search: query.toString() }, { replace: true });
    requestAnimationFrame(() => opener.current?.focus());
  };
  const store = () => requestGrownUp(() => window.location.assign(content.storeUrl), content.ui.gateStore);
  const handleHomeClick = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>("a[data-sc-action]");
    if (!link) return;
    if (["library", "pack"].includes(link.dataset.scAction ?? "") && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
    event.preventDefault(); opener.current = link;
    switch (link.dataset.scAction) {
      case "studio": openStudio(link.dataset.picture); break;
      case "app-store": store(); break;
      case "library":
      case "pack": navigate(link.pathname); break;
      case "privacy": setInformation("privacy"); break;
      case "terms": setInformation("terms"); break;
      case "contact": requestGrownUp(() => window.location.assign(content.contactUrl), content.ui.gateContact); break;
    }
  };

  const themeLabel = theme === "dark" ? content.ui.themeDay : content.ui.themeNight;
  const informationTitle = information === "privacy" ? content.ui.privacyTitle : content.ui.termsTitle;
  const informationBody = information === "privacy" ? content.ui.privacyBody : content.ui.termsBody;

  return <div className="sc-page" data-theme={theme}>
    <Seo path={content.path} meta={{ ...app?.seo, title: content.title, description: content.description, robots: app?.seo.robots ?? "noindex,follow", ogImage: "/smarty-colours/farm-yard-cover.jpg" }} jsonLd={structuredData} />
    <Helmet><body className="sc-document" /><link rel="icon" type="image/png" sizes="64x64" href="/smarty-colours/favicon-64.png" /><link rel="apple-touch-icon" sizes="180x180" href="/smarty-colours/apple-touch-icon.png" /></Helmet>
    <div hidden={picture !== null}>
      <a className="sc-skip" href="#sc-main">{content.ui.skip}</a>
      <div onClick={handleHomeClick} dangerouslySetInnerHTML={{ __html: homeHtml }} />
      <div className="wrap sc-theme-row"><button type="button" className="sc-btn" aria-pressed={theme === "dark"} onClick={toggle}>{themeLabel}</button></div>
    </div>
    {picture !== null && <Suspense fallback={<p className="sc-loading" role="status">{content.ui.loading}</p>}><Studio initialPictureId={picture} packId={packId} onClose={closeStudio} onShareRequest={action => requestGrownUp(action, content.ui.gateShare)} /></Suspense>}
    {information && <SmartyColoursDialog title={informationTitle} onClose={() => setInformation(null)}><p>{informationBody}</p></SmartyColoursDialog>}
    {gate && <SmartyColoursGate request={gate} onClose={() => setGate(null)} />}
  </div>;
}

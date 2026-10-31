import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { smartyColours as content } from "../content/smartyColours";
import { FREE_PACKS_PATH, packCopy as copy, type PaperSize } from "../content/smartyColourPacks";
import { createSmartyGate, SmartyColoursDialog, SmartyColoursGate, type SmartyGateRequest } from "./SmartyColoursDialog";
import { useSmartyColoursTheme } from "./useSmartyColoursTheme";
import "../pages/SmartyColoursLandingPage.css";
import "../pages/SmartyColoursPacks.css";
const StoreContext = createContext<() => void>(() => {});
export const useSmartyStore = () => useContext(StoreContext);
let paperPreference: PaperSize | undefined;
const paperSizes: PaperSize[] = ["a4", "letter"];
export function useSmartyPaperSize() {
  const [paper, setPaper] = useState<PaperSize>("a4");
  useEffect(() => { setPaper(paperPreference ?? (navigator.language.toLowerCase() === "en-us" ? "letter" : "a4")); }, []);
  const choose = (size: PaperSize) => { paperPreference = size; setPaper(size); };
  return { paper, choose };
}
export function SmartyPaperSize({ paper, onChange }: { paper: PaperSize; onChange: (size: PaperSize) => void }) {
  return <fieldset className="sc-pack-paper"><legend>{copy.paperSize}</legend><div className="seg">{paperSizes.map(size => { const label = size === "a4" ? copy.a4 : copy.letter; const selected = paper === size ? "on" : undefined; return <label className={selected} key={size}><input type="radio" name="smarty-paper" value={size} checked={paper === size} onChange={() => onChange(size)} />{label}</label>; })}</div></fieldset>;
}
export function SmartyClouds() {
  return <><svg className="sc-cloud sc-pack-cloud--left" viewBox="0 0 200 110" aria-hidden="true"><path className="fill" d="M40 94C17 94 10 68 28 59C24 37 50 26 65 38C71 14 109 8 121 32C135 20 161 28 159 51C181 53 187 90 161 94Z" /><path className="shade" d="M24 81C34 90 40 94 40 94H161C171 93 177 86 178 78C152 88 64 90 24 81Z" /><path className="edge" d="M40 94C17 94 10 68 28 59C24 37 50 26 65 38C71 14 109 8 121 32C135 20 161 28 159 51C181 53 187 90 161 94Z" /></svg><svg className="sc-cloud sc-pack-cloud--right" viewBox="0 0 200 110" aria-hidden="true"><path className="fill" d="M40 94C17 94 10 68 28 59C24 37 50 26 65 38C71 14 109 8 121 32C135 20 161 28 159 51C181 53 187 90 161 94Z" /><path className="edge" d="M40 94C17 94 10 68 28 59C24 37 50 26 65 38C71 14 109 8 121 32C135 20 161 28 159 51C181 53 187 90 161 94Z" /></svg></>;
}
export function SmartyPackNav() {
  const store = useSmartyStore();
  return <nav className="sc-nav" aria-label={copy.main}><Link className="sc-logo" to={content.path} aria-label={copy.home}><img src="/smarty-colours/pencil-app-icon.png" width={48} height={48} alt="" /><span>{copy.logoFirst}<b>{copy.logoLast}</b></span></Link><ul><li><Link className="sc-nav__link" to={content.path + "?picture=curly-sheep&pack=farm-yard"}>{copy.colourOnline}</Link></li><li><Link className="sc-nav__link" to={FREE_PACKS_PATH} aria-current="page">{copy.freePacks}</Link></li><li><Link className="sc-nav__link" to={content.path + "#grown-ups"}>{copy.grown}</Link></li></ul><button type="button" className="sc-btn sc-btn--crown" aria-label={copy.getAppLabel} onClick={store}>{copy.getApp}</button></nav>;
}
export function SmartyPackLayout({ children }: PropsWithChildren) {
  const { theme, toggle } = useSmartyColoursTheme(); const [gate, setGate] = useState<SmartyGateRequest | null>(null); const [information, setInformation] = useState<"privacy" | "terms" | null>(null);
  const store = () => setGate(createSmartyGate(() => window.location.assign(content.storeUrl), content.ui.gateStore));
  const themeLabel = theme === "dark" ? content.ui.themeDay : content.ui.themeNight;
  const informationTitle = information === "privacy" ? content.ui.privacyTitle : content.ui.termsTitle; const informationBody = information === "privacy" ? content.ui.privacyBody : content.ui.termsBody;
  return <div className="sc-page" data-theme={theme}><Helmet><body className="sc-document" /><link rel="icon" type="image/png" sizes="64x64" href="/smarty-colours/favicon-64.png" /><link rel="apple-touch-icon" sizes="180x180" href="/smarty-colours/apple-touch-icon.png" /></Helmet><StoreContext.Provider value={store}><a className="sc-skip" href="#sc-main">{content.ui.skip}</a><main id="sc-main">{children}</main><div className="wrap"><footer className="sc-footer"><Link className="sc-logo" to={content.path} aria-label={copy.home}><img src="/smarty-colours/pencil-app-icon.png" alt="" width={48} height={48} /><span>{copy.logoFirst}<b>{copy.logoLast}</b></span></Link><nav aria-label={copy.footer}><Link to={content.path + "?picture=curly-sheep&pack=farm-yard"}>{copy.colourOnline}</Link><Link to={FREE_PACKS_PATH}>{copy.freePacks}</Link><Link to={content.path + "#grown-ups"}>{copy.grown}</Link><button type="button" onClick={() => setInformation("privacy")}>{copy.privacy}</button><button type="button" onClick={() => setInformation("terms")}>{copy.terms}</button><button type="button" onClick={() => setGate(createSmartyGate(() => window.location.assign(content.contactUrl), content.ui.gateContact))}>{copy.contact}</button></nav><p>{copy.copyright}</p><button type="button" className="sc-btn sc-theme-switch" aria-pressed={theme === "dark"} onClick={toggle}>{themeLabel}</button></footer></div></StoreContext.Provider>{information && <SmartyColoursDialog title={informationTitle} onClose={() => setInformation(null)}><p>{informationBody}</p></SmartyColoursDialog>}{gate && <SmartyColoursGate request={gate} onClose={() => setGate(null)} />}</div>;
}

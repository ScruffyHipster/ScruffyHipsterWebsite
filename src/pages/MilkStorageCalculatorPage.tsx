import { MilkStorageCalculator } from "../components/MilkStorageCalculator";
import { BreastfeedingTrackerAppStoreLink } from "../components/AppStoreLink";
import { Seo } from "../components/Seo";
import { milkStorageCalculatorPageContent as page } from "../content/pages";
import { canonicalUrl } from "../seo/canonical";
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";

export function MilkStorageCalculatorPage() {
  const copy = page;
  const siteUrl = getSiteUrl();
  const url = canonicalUrl(page.route, siteUrl);
  return <>
    <Seo path={page.route} meta={page.seo} jsonLd={[
      organizationJsonLd(),
      { "@context": "https://schema.org", "@type": "WebApplication", name: copy.labels.milkStorageCalculator, description: page.seo.description, url, applicationCategory: "HealthApplication", operatingSystem: "Any", browserRequirements: "Requires JavaScript", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" }, isBasedOn: page.nhsUrl },
      faqPageJsonLd(page.faqs),
      breadcrumbJsonLd([{ name: copy.labels.aboutTheApp, url: canonicalUrl("/breastfeeding-tracker", siteUrl) }, { name: copy.labels.milkStorageCalculator, url }])
    ]} />
<div className="milk-page mp" style={{"minHeight": "100vh", "background": "var(--clean-slate-background)"}}>

<MilkStorageCalculator />

<main style={{"maxWidth": "720px", "margin": "0 auto", "padding": "48px 16px 24px", "display": "flex", "flexDirection": "column", "gap": "56px"}}>

<section id="how" aria-labelledby="how-title" style={{"display": "flex", "flexDirection": "column", "gap": "16px", "scrollMarginTop": "24px"}}>
<h2 id="how-title" style={{"margin": "0", "font": "var(--text-title-rounded)"}}>{copy.labels.howThisCalculatorWorks}</h2>
<p style={{"margin": "0", "font": "var(--text-body)", "color": "var(--app-text-secondary)"}}>{copy.labels.aFreeCalculatorForExpressedBreastMilkItWorksOutAUseByDateFromNhs}</p>
<ol style={{"listStyle": "none", "margin": "0", "padding": "0", "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(200px, 1fr))", "gap": "12px"}}>
<li style={{"background": "var(--app-surface)", "borderRadius": "14px", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "8px"}}>
<span aria-hidden="true" style={{"width": "28px", "height": "28px", "borderRadius": "999px", "display": "grid", "placeItems": "center", "background": "color-mix(in srgb, var(--app-primary) 12%, transparent)", "color": "var(--app-primary)", "font": "700 15px/1 var(--font-rounded)"}}>{copy.labels.step1}</span>
<h3 style={{"margin": "0", "font": "var(--text-headline-rounded)"}}>{copy.labels.chooseWhereItsStored}</h3>
<p style={{"margin": "0", "font": "var(--text-subheadline)", "color": "var(--app-text-secondary)"}}>{copy.labels.fridgeTheFridgesIceCompartmentOrTheFreezer}</p>
</li>
<li style={{"background": "var(--app-surface)", "borderRadius": "14px", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "8px"}}>
<span aria-hidden="true" style={{"width": "28px", "height": "28px", "borderRadius": "999px", "display": "grid", "placeItems": "center", "background": "color-mix(in srgb, var(--app-primary) 12%, transparent)", "color": "var(--app-primary)", "font": "700 15px/1 var(--font-rounded)"}}>{copy.labels.step2}</span>
<h3 style={{"margin": "0", "font": "var(--text-headline-rounded)"}}>{copy.labels.addTheTime}</h3>
<p style={{"margin": "0", "font": "var(--text-subheadline)", "color": "var(--app-text-secondary)"}}>{copy.labels.whenYouExpressedItForTheFridgeOrWhenItWentInTheIceCompartmentOrF}</p>
</li>
<li style={{"background": "var(--app-surface)", "borderRadius": "14px", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "8px"}}>
<span aria-hidden="true" style={{"width": "28px", "height": "28px", "borderRadius": "999px", "display": "grid", "placeItems": "center", "background": "color-mix(in srgb, var(--app-primary) 12%, transparent)", "color": "var(--app-primary)", "font": "700 15px/1 var(--font-rounded)"}}>{copy.labels.step3}</span>
<h3 style={{"margin": "0", "font": "var(--text-headline-rounded)"}}>{copy.labels.seeTheUseByDate}</h3>
<p style={{"margin": "0", "font": "var(--text-subheadline)", "color": "var(--app-text-secondary)"}}>{copy.labels.withTheTimeLeftAndHowLongItsBeenStoredUseSoonAppearsWhenTheDateI}</p>
</li>
</ol>
</section>

<section aria-labelledby="private-title" style={{"display": "flex", "gap": "12px", "alignItems": "flex-start", "background": "var(--app-surface)", "borderRadius": "14px", "padding": "14px"}}>
<span aria-hidden="true" style={{"width": "34px", "height": "34px", "display": "grid", "placeItems": "center", "color": "var(--app-primary)", "flex": "none"}}>
<svg width="22" height="22" viewBox="0 0 24 24"><rect className="mp-ico" x="5" y="10.5" width="14" height="10" rx="2.5"></rect><path className="mp-ico" d="M8 10.5V8a4 4 0 0 1 8 0v2.5"></path></svg>
</span>
<div style={{"display": "flex", "flexDirection": "column", "gap": "4px"}}>
<h2 id="private-title" style={{"margin": "0", "font": "var(--text-title3-rounded-bold)"}}>{copy.labels.privateToThisDevice}</h2>
<p style={{"margin": "0", "font": "var(--text-subheadline)", "color": "var(--app-text-secondary)"}}>{copy.labels.theCalculatorRemembersYourLastBagInThisBrowserSoItsThereWhenYouC}</p>
</div>
</section>

<section aria-labelledby="app-title" style={{"background": "var(--app-surface)", "borderRadius": "28px", "padding": "28px 20px 24px", "display": "flex", "flexDirection": "column", "alignItems": "center", "textAlign": "center", "gap": "16px"}}>
<img src={page.appIcon} alt="" width="72" height="72" style={{"width": "72px", "height": "72px", "display": "block"}} />
<div style={{"display": "flex", "flexDirection": "column", "gap": "8px", "maxWidth": "480px"}}>
<h2 id="app-title" style={{"margin": "0", "font": "var(--text-title-rounded)"}}>{copy.labels.everyBagInTheIphoneApp}</h2>
<p style={{"margin": "0", "font": "var(--text-body)", "color": "var(--app-text-secondary)"}}>{copy.labels.milkStashKeepsARunningListOfWhatsInYourFridgeAndFreezerSoYouDont}</p>
</div>
<ul style={{"listStyle": "none", "margin": "0", "padding": "0", "width": "100%", "maxWidth": "560px", "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(220px, 1fr))", "gap": "4px 16px", "textAlign": "left"}}>
<li style={{"display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "48px"}}>
<span aria-hidden="true" style={{"width": "34px", "height": "34px", "display": "grid", "placeItems": "center", "color": "var(--app-primary)", "flex": "none"}}><svg width="22" height="22" viewBox="0 0 24 24"><path className="mp-ico" d="M12 3.5c3 4 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0c0-3 2.5-6 5.5-10z"></path></svg></span>
<span style={{"font": "var(--text-subheadline-semibold)"}}>{copy.labels.fridgeAndFreezerTotalsAtAGlance}</span>
</li>
<li style={{"display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "48px"}}>
<span aria-hidden="true" style={{"width": "34px", "height": "34px", "display": "grid", "placeItems": "center", "color": "var(--app-primary)", "flex": "none"}}><svg width="22" height="22" viewBox="0 0 24 24"><path className="mp-ico" d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 20.5h4"></path></svg></span>
<span style={{"font": "var(--text-subheadline-semibold)"}}>{copy.labels.remindersBeforeMilkReachesItsStorageDate}</span>
</li>
<li style={{"display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "48px"}}>
<span aria-hidden="true" style={{"width": "34px", "height": "34px", "display": "grid", "placeItems": "center", "color": "var(--app-primary)", "flex": "none"}}><svg width="22" height="22" viewBox="0 0 24 24"><path className="mp-ico" d="M9.5 3h5M10 3v3l-2 2.5V20a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 16 20V8.5L14 6V3"></path><path className="mp-ico" d="M8 13h8"></path></svg></span>
<span style={{"font": "var(--text-subheadline-semibold)"}}>{copy.labels.useABagInABottleAndTheStashUpdates}</span>
</li>
<li style={{"display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "48px"}}>
<span aria-hidden="true" style={{"width": "34px", "height": "34px", "display": "grid", "placeItems": "center", "color": "var(--app-primary)", "flex": "none"}}><svg width="22" height="22" viewBox="0 0 24 24"><circle className="mp-ico" cx="12" cy="13" r="8"></circle><path className="mp-ico" d="M9 2.5h6M12 13V9"></path></svg></span>
<span style={{"font": "var(--text-subheadline-semibold)"}}>{copy.labels.breastfeedingPumpingAndBottleTimers}</span>
</li>
</ul>
<BreastfeedingTrackerAppStoreLink placement="milk-page" className="mp-cta" style={{"width": "100%", "maxWidth": "420px", "minHeight": "66px", "borderRadius": "14px", "display": "flex", "alignItems": "center", "justifyContent": "center", "background": "var(--app-primary)", "color": "var(--app-button-primary-foreground)", "boxShadow": "0 0 20px color-mix(in srgb, var(--app-primary) 18%, transparent)", "font": "var(--text-title2-rounded)", "textDecoration": "none"}}>{copy.labels.viewOnTheAppStore}</BreastfeedingTrackerAppStoreLink>
<p style={{"margin": "0", "font": "var(--text-footnote)", "color": "var(--app-text-secondary)", "maxWidth": "420px"}}>{copy.labels.freeToDownloadWithAnOptionalOneTimeLifetimeUnlockIMakeTheAppOnMy}</p>
</section>

<section aria-labelledby="faq-title" style={{"display": "flex", "flexDirection": "column", "gap": "12px"}}>
<h2 id="faq-title" style={{"margin": "0", "font": "var(--text-title-rounded)"}}>{copy.labels.questions}</h2>
<div style={{"background": "var(--app-surface)", "borderRadius": "24px", "padding": "0 16px"}}>
<details>
<summary style={{"minHeight": "56px", "padding": "12px 0", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "12px", "font": "var(--text-body-semibold)"}}>{copy.labels.whereDoTheDatesComeFrom}<svg className="mp-chev" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{"color": "var(--app-text-secondary)", "flex": "none"}}><path className="mp-ico" style={{"strokeWidth": "3"}} d="M9 5l7 7-7 7"></path></svg></summary>
<p style={{"margin": "0 0 16px", "font": "var(--text-subheadline)", "color": "var(--app-text-secondary)"}}>{copy.labels.fromTheNhsGuidanceOnStoringBreastMilkUpTo8DaysInAFridgeAt4COrCol}</p>
</details>
<details style={{"borderTop": ".5px solid var(--app-divider)"}}>
<summary style={{"minHeight": "56px", "padding": "12px 0", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "12px", "font": "var(--text-body-semibold)"}}>{copy.labels.whatIfImNotSureHowColdMyFridgeIs}<svg className="mp-chev" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{"color": "var(--app-text-secondary)", "flex": "none"}}><path className="mp-ico" style={{"strokeWidth": "3"}} d="M9 5l7 7-7 7"></path></svg></summary>
<p style={{"margin": "0 0 16px", "font": "var(--text-subheadline)", "color": "var(--app-text-secondary)"}}>{copy.labels.the8DaysAssume4COrColderIfYouCantBeSureAskYourMidwifeHealthVisit}</p>
</details>
<details style={{"borderTop": ".5px solid var(--app-divider)"}}>
<summary style={{"minHeight": "56px", "padding": "12px 0", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "12px", "font": "var(--text-body-semibold)"}}>{copy.labels.howLongIsDefrostedMilkGoodFor}<svg className="mp-chev" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{"color": "var(--app-text-secondary)", "flex": "none"}}><path className="mp-ico" style={{"strokeWidth": "3"}} d="M9 5l7 7-7 7"></path></svg></summary>
<p style={{"margin": "0 0 16px", "font": "var(--text-subheadline)", "color": "var(--app-text-secondary)"}}>{copy.labels.theNhsSaysToUseDefrostedMilkStraightAwayAndNeverRefreezeItThawin}</p>
</details>
<details style={{"borderTop": ".5px solid var(--app-divider)"}}>
<summary style={{"minHeight": "56px", "padding": "12px 0", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "12px", "font": "var(--text-body-semibold)"}}>{copy.labels.doesThisWorkForFormula}<svg className="mp-chev" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{"color": "var(--app-text-secondary)", "flex": "none"}}><path className="mp-ico" style={{"strokeWidth": "3"}} d="M9 5l7 7-7 7"></path></svg></summary>
<p style={{"margin": "0 0 16px", "font": "var(--text-subheadline)", "color": "var(--app-text-secondary)"}}>{copy.labels.noTheseDatesAreOnlyForExpressedBreastMilkFormulaHasItsOwnGuidanc}</p>
</details>
<details style={{"borderTop": ".5px solid var(--app-divider)"}}>
<summary style={{"minHeight": "56px", "padding": "12px 0", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "12px", "font": "var(--text-body-semibold)"}}>{copy.labels.isItFree}<svg className="mp-chev" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style={{"color": "var(--app-text-secondary)", "flex": "none"}}><path className="mp-ico" style={{"strokeWidth": "3"}} d="M9 5l7 7-7 7"></path></svg></summary>
<p style={{"margin": "0 0 16px", "font": "var(--text-subheadline)", "color": "var(--app-text-secondary)"}}>{copy.labels.yesTheresNothingToSignUpForAndNothingToInstall}</p>
</details>
</div>
</section>
</main>

<footer style={{"maxWidth": "720px", "margin": "0 auto", "padding": "8px 16px 48px", "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "12px", "textAlign": "center"}}>
<p style={{"margin": "0", "font": "var(--text-footnote)", "color": "var(--app-text-secondary)", "maxWidth": "480px"}}>{copy.labels.storageDatesAreGuidanceNotAGuaranteeAndThisCalculatorIsntMedical}</p>
<nav aria-label={copy.labels.moreFromTheApp} style={{"display": "flex", "justifyContent": "center", "gap": "4px 20px", "flexWrap": "wrap", "font": "var(--text-subheadline-semibold)"}}>
<a href="/breastfeeding-tracker/breastfeeding-timer/" style={{"minHeight": "44px", "display": "inline-flex", "alignItems": "center"}}>{copy.labels.breastfeedingTimer}</a>
<a href="/breastfeeding-tracker/" style={{"minHeight": "44px", "display": "inline-flex", "alignItems": "center"}}>{copy.labels.aboutTheApp}</a>
<a href="/breastfeeding-tracker/support/" style={{"minHeight": "44px", "display": "inline-flex", "alignItems": "center"}}>{copy.labels.helpSupport}</a>
<a href="/privacy/breast-feeding-tracker/" style={{"minHeight": "44px", "display": "inline-flex", "alignItems": "center"}}>{copy.labels.privacy}</a>
</nav>
</footer>
</div>
  </>;
}

import { Fragment, useEffect, useRef, useState } from "react";
import { BreastfeedingTrackerAppStoreLink } from "./AppStoreLink";
import { milkStorageCalculatorPageContent as page } from "../content/pages";
import { defaultMilkCalculator, milkPlaces, milkStorageStatus, milkDuration, milkLocalInput, parseMilkLocalInput, readMilkCalculator, serializeMilkCalculator, MILK_STORAGE_KEY, type MilkCalculatorState } from "./milkStorageCalculatorModel";
import "./MilkStorageCalculator.css";

/** Layout, copy and calculation behaviour are ported from the approved MilkCalc artboard. */
export function MilkStorageCalculator() {
  const copy = page;
  const [state, setState] = useState<MilkCalculatorState | null>(null);
  const current = useRef<MilkCalculatorState | null>(null);
  const [now, setNow] = useState(0);
  const [foreground, setForeground] = useState(true);
  const [motion, setMotion] = useState(false);
  const ready = state !== null;

  useEffect(() => {
    const at = Date.now();
    let restored = null;
    try { restored = readMilkCalculator(window.localStorage.getItem(MILK_STORAGE_KEY), at); } catch { /* Storage is optional. */ }
    current.current = restored ?? defaultMilkCalculator(at);
    setState(current.current);
    setNow(at);
    const visible = () => { setForeground(!document.hidden); setMotion(false); if (!document.hidden) setNow(Date.now()); };
    const interval = window.setInterval(() => { if (!document.hidden) setNow(Date.now()); }, 30_000);
    document.addEventListener("visibilitychange", visible);
    return () => { window.clearInterval(interval); document.removeEventListener("visibilitychange", visible); };
  }, []);

  function change(update: (value: MilkCalculatorState) => MilkCalculatorState) {
    if (!current.current) return;
    const next = update(current.current);
    current.current = next;
    setMotion(true);
    setNow(Date.now());
    setState(next);
    try { window.localStorage.setItem(MILK_STORAGE_KEY, serializeMilkCalculator(next)); } catch { /* Keep this visit usable if storage is blocked or full. */ }
  }
  const selected = state?.place ?? "fridge";
  const rule = copy.rules[selected];
  const status = state ? milkStorageStatus(selected, state.stored, now) : null;
  const dayFormat = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short", ...(status && new Date(status.end).getFullYear() !== new Date(now).getFullYear() ? { year: "numeric" } : {}) });
  const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
  const places = milkPlaces.map((id, index) => {
    const chosen = selected === id;
    return {
      id, pressed: chosen, label: copy.rules[id].label, name: copy.rules[id].name,
      isFridge: id === "fridge", isIce: id === "ice", isFreezer: id === "freezer",
      surfaceClass: chosen ? "mc-breathe" : "mc-glass", origin: index === 0 ? "left center" : index === 2 ? "right center" : "center",
      scale: chosen ? 1.06 : 0.96, bg: chosen ? "var(--accent)" : "var(--web-glass)", color: chosen ? "var(--app-button-primary-foreground)" : "var(--app-text)", weight: chosen ? 700 : 400, stroke: chosen ? 2.4 : 1.8,
      pick: () => {
        if (selected === id) return;
        change(value => ({ ...value, place: id }));
        try { navigator.vibrate?.(6); } catch { /* Optional haptic. */ }
      }
    };
  });
  const isFridge = selected === "fridge", isIce = selected === "ice", isFreezer = selected === "freezer";
  const anchorLabel = rule.anchor;
  const storedInput = state ? milkLocalInput(state.stored) : "";
  const nowInput = ready ? milkLocalInput(now) : undefined;
  const onStored = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stored = parseMilkLocalInput(event.target.value);
    if (stored !== null) change(value => ({ ...value, stored, interacted: true }));
  };
  const anchorNote = status?.future ? copy.futureNote : rule.note;
  const anchorNoteColor = status?.future ? "var(--app-warning)" : "var(--app-text-secondary)";
  const useByDate = status ? dayFormat.format(new Date(status.end)) : copy.durations.unknown;
  const useBySubtitle = status ? timeFormat.format(new Date(status.end)) + " · " + rule.length : copy.durations.unknown;
  const hasBadge = status?.passed || status?.soon;
  const badge = status?.passed ? copy.badges.passed : copy.badges.soon;
  const timeLeft = status ? status.passed ? copy.durations.passed : milkDuration(status.left, copy.durations) : copy.durations.unknown;
  const storedFor = state && status && !status.future ? milkDuration(now - state.stored, copy.durations) : copy.durations.unknown;
  const showInvite = state?.interacted && !state.dismissed;
  const dismissInvite = () => change(value => ({ ...value, dismissed: true }));
  const inviteClicked = dismissInvite;
  return (
<div className="mc mc-ground" data-motion={motion} data-background={!foreground} style={{"minHeight": "min(100svh, 860px)", "padding": "8px 0 32px"}}>
<div style={{"width": "100%", "maxWidth": "640px", "margin": "0 auto", "display": "flex", "flexDirection": "column"}}>

<header style={{"display": "grid", "gridTemplateColumns": "44px 1fr 44px", "alignItems": "center", "gap": "12px", "padding": "0 16px", "minHeight": "52px"}}>
<a href="/breastfeeding-tracker/" className="mc-press" aria-label={copy.labels.aboutTheIphoneApp} style={{"width": "44px", "height": "44px", "display": "grid", "placeItems": "center", "textDecoration": "none"}}>
<img src={page.appIcon} alt="" width="36" height="36" style={{"width": "36px", "height": "36px", "display": "block"}} />
</a>
<h1 style={{"margin": "0", "textAlign": "center", "font": "600 17px/22px var(--font-rounded)", "color": "var(--app-text)"}}>{copy.labels.milkStorageCalculator}</h1>
<a href="#how" className="mc-glass mc-press" aria-label={copy.labels.howThisCalculatorWorks} style={{"width": "44px", "height": "44px", "borderRadius": "999px", "display": "grid", "placeItems": "center", "color": "var(--accent)", "textDecoration": "none"}}>
<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle className="mc-icof" cx="12" cy="6.6" r="1.6"></circle><path className="mc-ico" style={{"strokeWidth": "2.2"}} d="M10 10.5h2.2V18M9.5 18h5"></path></svg>
</a>
</header>

<div style={{"padding": "16px 16px 0", "display": "flex", "flexDirection": "column", "gap": "16px"}}>

<div style={{"textAlign": "center", "font": "var(--text-title3-rounded-semibold)", "color": "var(--app-text-secondary)"}}>{copy.labels.wheresTheMilk}</div>

<div role="group" aria-label={copy.labels.whereTheMilkIsStored} style={{"display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "12px", "width": "100%", "maxWidth": "420px", "margin": "0 auto"}}>
{places.map((place) => <Fragment key={place.id}>
<button type="button" className="mc-press" onClick={place.pick} aria-pressed={place.pressed} aria-label={place.label} style={{"display": "block", "width": "100%", "aspectRatio": "1", "borderRadius": "999px"}}>
<span className={`mc-snappy ${place.surfaceClass}`} style={{"display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "4px", "width": "100%", "height": "100%", "borderRadius": "999px", "transformOrigin": place.origin, "transform": `scale(${place.scale})`, "backgroundColor": place.bg, "color": place.color}} data-selected={place.pressed}>
{place.isFridge ? <> <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><rect className="mc-ico" style={{"strokeWidth": place.stroke}} x="6" y="2.5" width="12" height="19" rx="2.5"></rect><path className="mc-ico" style={{"strokeWidth": place.stroke}} d="M6 9.5h12M9 5.5v1.5M9 12.5v3"></path></svg> </> : null}
{place.isIce ? <> <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path className="mc-ico" style={{"strokeWidth": place.stroke}} d="M12 3.5 19.5 7.8v8.4L12 20.5l-7.5-4.3V7.8z"></path><path className="mc-ico" style={{"strokeWidth": place.stroke}} d="M4.5 7.8 12 12l7.5-4.2M12 12v8.5"></path></svg> </> : null}
{place.isFreezer ? <> <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path className="mc-ico" style={{"strokeWidth": place.stroke}} d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5M9.5 4l2.5 2 2.5-2M9.5 20l2.5-2 2.5 2M4.1 10.6l3.1-.5-1.1-3M19.9 13.4l-3.1.5 1.1 3M4.1 13.4l3.1.5-1.1 3M19.9 10.6l-3.1-.5 1.1-3"></path></svg> </> : null}
<span style={{"font": `${place.weight} 17px/22px var(--font-rounded)`}}>{place.name}</span>
</span>
</button>
</Fragment>)}
</div>

<div style={{"display": "flex", "flexDirection": "column", "gap": "8px"}}>
<label style={{"background": "var(--app-surface)", "borderRadius": "24px", "padding": "0 16px", "minHeight": "60px", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "12px"}}>
<span style={{"font": "var(--text-body)", "color": "var(--app-text)", "flex": "none"}}>{anchorLabel}</span>
<input type="datetime-local" className="mc-field mc-num" value={storedInput} max={nowInput} onChange={onStored} style={{"font": "600 17px/22px var(--font-rounded)"}} disabled={!ready} />
</label>
<p aria-live="polite" style={{"margin": "0", "padding": "0 16px", "font": "var(--text-footnote)", "color": anchorNoteColor}}>{anchorNote}</p>
</div>

<section aria-label={copy.labels.useByDate} style={{"position": "relative", "overflow": "hidden", "borderRadius": "20px", "padding": "20px 14px", "display": "flex", "flexDirection": "column", "gap": "22px", "boxShadow": "var(--shadow-summary-card)", "background": "linear-gradient(135deg, var(--summary-wash-1), var(--summary-wash-2), var(--summary-wash-3)), var(--web-glass)", "WebkitBackdropFilter": "blur(18px) saturate(1.5)", "backdropFilter": "blur(18px) saturate(1.5)"}}>
<div style={{"display": "flex", "alignItems": "flex-start", "gap": "12px"}}>
<div style={{"flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "8px"}}>
<div style={{"font": "var(--text-title3-rounded-bold)"}}>{copy.labels.useBy}</div>
<div aria-live="polite" className="mc-num" style={{"font": "var(--text-large-title-rounded)", "color": "var(--app-text)"}}>{useByDate}</div>
<div className="mc-num" style={{"font": "var(--text-subheadline)", "color": "var(--app-text-secondary)"}}>{useBySubtitle}</div>
{hasBadge ? <>
<span style={{"alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "4px 8px", "borderRadius": "999px", "background": "color-mix(in srgb, var(--app-primary) 12%, transparent)", "font": "700 12px/16px var(--font-sans)", "color": "var(--app-text)"}}>
<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><circle className="mc-ico" style={{"strokeWidth": "2.4"}} cx="11" cy="12" r="7.5"></circle><path className="mc-ico" style={{"strokeWidth": "2.4"}} d="M11 8v4.2l2.6 1.6"></path><circle className="mc-icof" cx="19.5" cy="18.5" r="3.5"></circle></svg>{badge}</span>
 </> : null}
</div>
<span aria-hidden="true" style={{"flex": "none", "color": "var(--app-secondary-accent)", "opacity": ".35"}}>
{isFridge ? <> <svg width="54" height="54" viewBox="0 0 24 24"><rect className="mc-ico" x="6" y="2.5" width="12" height="19" rx="2.5"></rect><path className="mc-ico" d="M6 9.5h12M9 5.5v1.5M9 12.5v3"></path></svg> </> : null}
{isIce ? <> <svg width="54" height="54" viewBox="0 0 24 24"><path className="mc-ico" d="M12 3.5 19.5 7.8v8.4L12 20.5l-7.5-4.3V7.8z"></path><path className="mc-ico" d="M4.5 7.8 12 12l7.5-4.2M12 12v8.5"></path></svg> </> : null}
{isFreezer ? <> <svg width="54" height="54" viewBox="0 0 24 24"><path className="mc-ico" d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5M9.5 4l2.5 2 2.5-2M9.5 20l2.5-2 2.5 2M4.1 10.6l3.1-.5-1.1-3M19.9 13.4l-3.1.5 1.1 3M4.1 13.4l3.1.5-1.1 3M19.9 10.6l-3.1-.5 1.1-3"></path></svg> </> : null}
</span>
</div>
<div style={{"display": "flex", "gap": "10px"}}>
<div style={{"flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "4px", "padding": "10px", "borderRadius": "16px", "background": "var(--metric-surface)", "boxShadow": "var(--shadow-metric)", "textAlign": "center"}}>
<div style={{"font": "var(--text-metric-label)", "textTransform": "uppercase", "color": "var(--app-text-secondary)"}}>{copy.labels.timeLeft}</div>
<div className="mc-num" style={{"font": "var(--text-title3-rounded-bold)", "color": "var(--app-primary)"}}>{timeLeft}</div>
</div>
<div style={{"flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "4px", "padding": "10px", "borderRadius": "16px", "background": "var(--metric-surface)", "boxShadow": "var(--shadow-metric)", "textAlign": "center"}}>
<div style={{"font": "var(--text-metric-label)", "textTransform": "uppercase", "color": "var(--app-text-secondary)"}}>{copy.labels.storedFor}</div>
<div className="mc-num" style={{"font": "var(--text-title3-rounded-bold)"}}>{storedFor}</div>
</div>
</div>
</section>

{showInvite ? <>
<div className="mc-invite" role="region" aria-label={copy.labels.keepTrackOfEveryBag} style={{"padding": "14px 14px 14px 16px", "display": "flex", "flexDirection": "column", "gap": "12px"}}>
<div style={{"display": "flex", "gap": "12px", "alignItems": "flex-start"}}>
<img src={page.appIcon} alt="" width="44" height="44" style={{"width": "44px", "height": "44px", "flex": "none", "display": "block"}} />
<div style={{"display": "flex", "flexDirection": "column", "gap": "4px", "minWidth": "0"}}>
<div style={{"font": "var(--text-title3-rounded-bold)", "color": "var(--app-text)"}}>{copy.labels.keepTrackOfEveryBag}</div>
<div style={{"font": "var(--text-subheadline)", "color": "var(--app-text-secondary)"}}>{copy.labels.theIphoneAppsMilkStashKeepsYourFridgeAndFreezerMilkInOnePlaceAnd}</div>
</div>
</div>
<div style={{"display": "flex", "flexDirection": "column", "gap": "4px", "alignItems": "stretch"}}>
<BreastfeedingTrackerAppStoreLink placement="milk-invite" className="mc-press" onClick={inviteClicked} style={{"width": "100%", "minHeight": "44px", "borderRadius": "999px", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "6px", "background": "color-mix(in srgb, var(--accent) 12%, transparent)", "color": "var(--accent)", "font": "600 15px/20px var(--font-rounded)", "textDecoration": "none"}}>{copy.labels.viewOnTheAppStore}<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path className="mc-ico" style={{"strokeWidth": "2.2"}} d="M7 17 17 7M9 7h8v8"></path></svg></BreastfeedingTrackerAppStoreLink>
<button type="button" className="mc-press" onClick={dismissInvite} style={{"width": "100%", "minHeight": "44px", "padding": "0 14px", "borderRadius": "999px", "font": "600 15px/20px var(--font-rounded)", "color": "var(--app-text-secondary)"}}>{copy.labels.notNow}</button>
</div>
</div>
 </> : null}

<section aria-labelledby="mc-guidance-title" style={{"display": "flex", "flexDirection": "column", "gap": "8px", "paddingTop": "8px"}}>
<h2 id="mc-guidance-title" style={{"margin": "0", "padding": "0 16px", "font": "var(--text-footnote)", "color": "var(--app-text-secondary)"}}>{copy.labels.nhsStorageGuidance}</h2>
<div style={{"background": "var(--app-surface)", "borderRadius": "24px", "padding": "0 16px"}}>
<div style={{"minHeight": "56px", "padding": "12px 0", "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px"}}>
<span style={{"font": "var(--text-subheadline-semibold)"}}>{copy.labels.fridge}</span>
<span style={{"font": "var(--text-subheadline)", "color": "var(--app-text-secondary)", "textAlign": "right"}}>{copy.labels.upTo8DaysAt4COrColderAtTheBackNotTheDoor}</span>
</div>
<div style={{"minHeight": "56px", "padding": "12px 0", "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px", "borderTop": ".5px solid var(--app-divider)"}}>
<span style={{"font": "var(--text-subheadline-semibold)"}}>{copy.labels.iceCompartment}</span>
<span style={{"font": "var(--text-subheadline)", "color": "var(--app-text-secondary)", "textAlign": "right"}}>{copy.labels.upTo2Weeks}</span>
</div>
<div style={{"minHeight": "56px", "padding": "12px 0", "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px", "borderTop": ".5px solid var(--app-divider)"}}>
<span style={{"font": "var(--text-subheadline-semibold)"}}>{copy.labels.freezer}</span>
<span style={{"font": "var(--text-subheadline)", "color": "var(--app-text-secondary)", "textAlign": "right"}}>{copy.labels.upTo6MonthsAt18COrColder}</span>
</div>
<div style={{"minHeight": "56px", "padding": "12px 0", "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px", "borderTop": ".5px solid var(--app-divider)"}}>
<span style={{"font": "var(--text-subheadline-semibold)"}}>{copy.labels.defrosted}</span>
<span style={{"font": "var(--text-subheadline)", "color": "var(--app-text-secondary)", "textAlign": "right"}}>{copy.labels.useItStraightAwayNeverRefreezeIt}</span>
</div>
<div style={{"minHeight": "56px", "padding": "12px 0", "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px", "borderTop": ".5px solid var(--app-divider)"}}>
<span style={{"font": "var(--text-subheadline-semibold)"}}>{copy.labels.leftAfterAFeed}</span>
<span style={{"font": "var(--text-subheadline)", "color": "var(--app-text-secondary)", "textAlign": "right"}}>{copy.labels.throwItAway}</span>
</div>
<a href="https://www.nhs.uk/best-start-in-life/baby/feeding-your-baby/breastfeeding/expressing-your-breast-milk/storing-breast-milk/" target="_blank" rel="noopener" style={{"minHeight": "52px", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "12px", "borderTop": ".5px solid var(--app-divider)", "font": "var(--text-body)", "color": "var(--accent)", "textDecoration": "none"}}>{copy.labels.viewNhsStorageGuidance}<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path className="mc-ico" style={{"strokeWidth": "2.2"}} d="M7 17 17 7M9 7h8v8"></path></svg></a>
<p style={{"margin": "0", "padding": "10px 0 14px", "borderTop": ".5px solid var(--app-divider)", "font": "var(--text-caption)", "color": "var(--app-text)"}}>{copy.labels.storageDatesAreGuidanceNotAGuarantee}</p>
</div>
</section>

</div>
</div>
</div>
  );
}

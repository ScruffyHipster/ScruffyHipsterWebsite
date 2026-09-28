import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import content from "../../content/compact/landing.json";
import "./CompactMirrorDemo.css";

type Feature = "leftEye" | "rightEye" | "bothEyes" | "nose" | "lips";
type Panel = "features" | "zoom" | "lighting" | "settings" | "quality" | "resolution" | null;
type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left";
export type MirrorScene = { feature: string; zoom: number; light: boolean; panel?: string };
const copy = content.demo;
const clamp = (value: number) => Math.max(1, Math.min(5, Math.round(value * 100) / 100));
const zoomLabel = (value: number) => `${Number(value.toFixed(2))}${copy.zoomSuffix}`;
const targets: Record<Feature, [number, number]> = { leftEye: [.34, .37], rightEye: [.64, .37], bothEyes: [.49, .37], nose: [.49, .47], lips: [.49, .56] };

function Icon({ name }: { name: string }) {
  let paths: ReactNode;
  if (["leftEye", "rightEye", "bothEyes"].includes(name)) {
    return <svg viewBox="0 0 36 24" fill="none" aria-hidden="true"><g opacity={name === "rightEye" ? .35 : 1}><path d="M1 12Q8 3 15 12Q8 21 1 12Z" fill={name === "rightEye" ? "none" : "currentColor"} stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="12" r="2.3" fill={name === "rightEye" ? "currentColor" : "#292b2e"}/></g><g opacity={name === "leftEye" ? .35 : 1}><path d="M21 12Q28 3 35 12Q28 21 21 12Z" fill={name === "leftEye" ? "none" : "currentColor"} stroke="currentColor" strokeWidth="1.4"/><circle cx="28" cy="12" r="2.3" fill={name === "leftEye" ? "currentColor" : "#292b2e"}/></g></svg>;
  }
  switch (name) {
    case "sun": paths = <><circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1m0-15.6-2.1 2.1M6.3 17.7l-2.1 2.1"/></>; break;
    case "sliders": paths = <><path d="M2 5h5m5 0h10M2 12h12m5 0h3M2 19h3m5 0h12"/><circle cx="9.5" cy="5" r="2.5"/><circle cx="16.5" cy="12" r="2.5"/><circle cx="7.5" cy="19" r="2.5"/></>; break;
    case "viewfinder": paths = <path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3"/>; break;
    case "unlock": paths = <><rect x="3" y="11" width="12" height="10" rx="2"/><path d="M9 11V7a5 5 0 0 1 10 0v2"/></>; break;
    case "nose": paths = <path d="M10 3c-2 1-1 8-5 13-3 5 3 6 7 4 4 2 10 1 7-4-4-5-3-12-5-13-1-1-3-1-4 0ZM7 19c0-3 3-3 5-1 2-2 5-2 5 1"/>; break;
    case "lips": paths = <><path d="M2 12c4-2 6-6 10-3 4-3 6 1 10 3-5 10-15 10-20 0Z"/><path d="M2 12c6-1 8 3 10 1 2 2 4-2 10-1"/></>; break;
    case "gear": paths = <><path d="m10 2-.7 2.5-2 .8L5 4 3 6l1.3 2.3-.8 2L1 11v3l2.5.7.8 2L3 19l2 2 2.3-1.3 2 .8L10 23h3l.7-2.5 2-.8L18 21l2-2-1.3-2.3.8-2L22 14v-3l-2.5-.7-.8-2L20 6l-2-2-2.3 1.3-2-.8L13 2Z"/><circle cx="11.5" cy="12.5" r="4"/></>; break;
    case "camera": paths = <><path d="M3 7h4l2-3h6l2 3h4v14H3Z"/><circle cx="12" cy="13" r="4"/></>; break;
    case "check": paths = <path d="m4 12 5 5L21 5"/>; break;
    case "chevron": paths = <path d="m9 5 7 7-7 7"/>; break;
    case "back": paths = <path d="m15 5-7 7 7 7"/>; break;
    default: paths = <path d="m5 5 14 14M19 5 5 19"/>;
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths}</svg>;
}

export function CompactMirrorDemo({ scene, interactive = true }: { scene?: MirrorScene; interactive?: boolean }) {
  const [feature, setFeature] = useState<Feature | null>(null);
  const [zoom, setZoom] = useState(1);
  const [light, setLight] = useState(false);
  const [mode, setMode] = useState("halo");
  const [brightness, setBrightness] = useState(.75);
  const [warmth, setWarmth] = useState(.5);
  const [panel, setPanel] = useState<Panel>(null);
  const [corner, setCorner] = useState<Corner>("bottom-right");
  const [previewDrag, setPreviewDrag] = useState<{ x: number; y: number } | null>(null);
  const [resolution, setResolution] = useState("1080p");
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ scale: .74, height: 844 });
  const shell = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement | null>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const zoomPress = useRef<{ timer?: ReturnType<typeof setTimeout>; x: number; zoom: number; held: boolean; cancelled: boolean } | null>(null);
  const suppressClick = useRef(false);
  const rulerDrag = useRef<{ x: number; zoom: number } | null>(null);
  const previewStart = useRef<{ x: number; y: number; centerX: number; centerY: number } | null>(null);
  const touches = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);
  const surfaceDrag = useRef<{ x: number; y: number; panX: number; panY: number; moved: boolean } | null>(null);
  const uid = useId();
  const sheetOpen = panel === "lighting" || panel === "settings" || panel === "quality" || panel === "resolution";
  const locked = feature !== null;
  const featuresOpen = panel === "features";
  const zoomOpen = panel === "zoom";
  const lightingOpen = panel === "lighting";
  const settingsOpen = panel === "settings";
  const qualityOpen = panel === "quality";
  const canGoBack = panel === "quality" || panel === "resolution";
  const previewLeft = previewDrag ? previewDrag.x < 195 : corner.endsWith("left");
  const isBox = light && mode === "lightBox";
  const previewBounds = { left: isBox ? 26 : 16, right: isBox ? 364 : 374, top: isBox ? size.height / 2 + 32 : 123, bottom: size.height - (isBox ? 58 : 50) };
  const previewWidth = Math.min(156, (previewBounds.right - previewBounds.left) * .38, (previewBounds.bottom - previewBounds.top) * .36);
  const previewHeight = previewWidth / .75;
  const previewCenter = previewDrag ?? { x: corner.endsWith("left") ? previewBounds.left + previewWidth / 2 : previewBounds.right - previewWidth / 2, y: corner.startsWith("top") ? previewBounds.top + previewHeight / 2 : previewBounds.bottom - previewHeight / 2 };
  const previewStyle = { left: previewCenter.x - previewWidth / 2, top: previewCenter.y - previewHeight / 2, width: previewWidth, height: previewHeight };
  const selected = copy.features.find((item) => item.id === feature);
  const title = panel === "lighting" ? copy.lightSettings : qualityOpen ? copy.cameraQuality : panel === "resolution" ? copy.resolution : copy.settings;
  const rgb = [warmth < .5 ? .8 + warmth * .4 : 1, warmth < .5 ? .9 + warmth * .2 : 1 - (warmth - .5) * .3, warmth < .5 ? 1 : 1 - (warmth - .5) * .8].map((v) => Math.round(v * brightness * 255)).join(",");
  const point = feature ? targets[feature] : [.5, .5];
  const cameraWidth = isBox ? 370 : 390;
  const cameraHeight = isBox ? size.height / 2 - 67 : size.height;
  const focusX = .5 + (point[0] - .5) * Math.max(1, cameraHeight * 2 / 3 / cameraWidth);
  const focusY = .5 + (point[1] - .5) * Math.max(1, cameraWidth * 1.5 / cameraHeight);
  const label = zoomLabel(zoom);
  const sheetClose = panel === "lighting" ? copy.done : copy.close;
  const style = { "--native-scale": size.scale, "--native-height": `${size.height}px`, "--mirror-zoom": zoom, "--focus-x": `${focusX * 100}%`, "--focus-y": `${focusY * 100}%`, "--light-rgb": rgb, "--mirror-pan-x": `${pan.x}px`, "--mirror-pan-y": `${pan.y}px` } as CSSProperties;

  useEffect(() => {
    if (!shell.current) return;
    const resize = () => { if (shell.current) { const scale = shell.current.clientWidth / 390; setSize({ scale, height: shell.current.clientHeight / scale }); } };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(shell.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!scene) return;
    setFeature(scene.feature === "face" ? null : scene.feature as Feature);
    setZoom(scene.zoom); setLight(scene.light); setMode("halo"); setPanel((scene.panel || null) as Panel); setPan({ x: 0, y: 0 });
  }, [scene]);
  useEffect(() => () => { if (zoomPress.current?.timer) clearTimeout(zoomPress.current.timer); }, []);
  useEffect(() => {
    if (!interactive || !sheetOpen) return;
    lastFocus.current = document.activeElement as HTMLElement;
    sheet.current?.focus({ preventScroll: true });
    return () => { lastFocus.current?.focus({ preventScroll: true }); };
  }, [sheetOpen, interactive]);
  useEffect(() => { if (sheetOpen && interactive) sheet.current?.focus({ preventScroll: true }); }, [panel, sheetOpen, interactive]);
  useEffect(() => { if (panel === "zoom" && interactive) ruler.current?.focus({ preventScroll: true }); }, [panel, interactive]);

  function choose(target: Feature) { setFeature(target); setZoom((value) => Math.max(2, value)); setPanel(null); setPan({ x: 0, y: 0 }); }
  function toggleLight() { setLight(!light); setPanel(null); }
  function openPanel(next: Panel) { setPanel((current) => current === next ? null : next); }
  function startZoom(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    suppressClick.current = false;
    const press = { x: event.clientX, zoom, held: false, cancelled: false, timer: undefined as ReturnType<typeof setTimeout> | undefined };
    press.timer = setTimeout(() => { if (!press.cancelled) { press.held = true; suppressClick.current = true; setPanel("zoom"); } }, 350);
    zoomPress.current = press;
  }
  function moveZoom(event: PointerEvent<HTMLButtonElement>) {
    const press = zoomPress.current;
    if (!press) return;
    const dx = (event.clientX - press.x) / size.scale;
    if (press.held) setZoom(clamp(press.zoom - dx / 120));
    else if (Math.abs(dx) > 20) { press.cancelled = true; suppressClick.current = true; clearTimeout(press.timer); }
  }
  function endZoom() { if (zoomPress.current) clearTimeout(zoomPress.current.timer); zoomPress.current = null; }
  function cycleZoom() {
    if (suppressClick.current) { suppressClick.current = false; return; }
    setZoom([1, 2, 3, 5].find((preset) => preset > zoom + .001) ?? 1); setPanel(null);
  }
  function moveRuler(event: PointerEvent<HTMLDivElement>) { if (rulerDrag.current) setZoom(clamp(rulerDrag.current.zoom - (event.clientX - rulerDrag.current.x) / size.scale / 120)); }
  function movePreview(event: PointerEvent<HTMLButtonElement>) {
    const start = previewStart.current;
    if (!start) return;
    setPreviewDrag({
      x: Math.max(previewBounds.left + previewWidth / 2, Math.min(previewBounds.right - previewWidth / 2, start.centerX + (event.clientX - start.x) / size.scale)),
      y: Math.max(previewBounds.top + previewHeight / 2, Math.min(previewBounds.bottom - previewHeight / 2, start.centerY + (event.clientY - start.y) / size.scale)),
    });
  }
  function finishPreview() {
    if (previewDrag) setCorner(`${previewDrag.y < (previewBounds.top + previewBounds.bottom) / 2 ? "top" : "bottom"}-${previewDrag.x < 195 ? "left" : "right"}` as Corner);
    previewStart.current = null; setPreviewDrag(null);
  }
  function startSurface(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    touches.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    surfaceDrag.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y, moved: false };
    if (touches.current.size === 2) { const [a, b] = [...touches.current.values()]; pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom }; }
  }
  function moveSurface(event: PointerEvent<HTMLDivElement>) {
    if (!touches.current.has(event.pointerId)) return;
    touches.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (touches.current.size === 2 && pinch.current) {
      const [a, b] = [...touches.current.values()]; setZoom(clamp(pinch.current.zoom * Math.hypot(a.x - b.x, a.y - b.y) / Math.max(1, pinch.current.distance)));
      if (surfaceDrag.current) surfaceDrag.current.moved = true;
    } else if (surfaceDrag.current) {
      const dx = (event.clientX - surfaceDrag.current.x) / size.scale;
      const dy = (event.clientY - surfaceDrag.current.y) / size.scale;
      if (Math.hypot(dx, dy) > 8) {
        surfaceDrag.current.moved = true;
        if (!locked) { const maxX = 195 * (zoom - 1); const maxY = size.height * (zoom - 1) / 2; setPan({ x: Math.max(-maxX, Math.min(maxX, surfaceDrag.current.panX + dx)), y: Math.max(-maxY, Math.min(maxY, surfaceDrag.current.panY + dy)) }); }
      }
    }
  }
  function finishSurface(event: PointerEvent<HTMLDivElement>) {
    if (surfaceDrag.current && !surfaceDrag.current.moved && touches.current.size === 1 && zoom === 1) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      if (y > .28 && y < .62) choose(y < .42 ? (x < .43 ? "leftEye" : x > .57 ? "rightEye" : "bothEyes") : y < .51 ? "nose" : "lips");
    }
    touches.current.delete(event.pointerId); pinch.current = null; surfaceDrag.current = null;
  }
  function trapSheet(event: React.KeyboardEvent) {
    if (event.key === "Escape") { event.preventDefault(); setPanel(null); }
    if (event.key !== "Tab") return;
    const focusable = Array.from(sheet.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input,a[href]') ?? []);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === sheet.current)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  return <div className={`cm-phone cm-native-phone${locked ? " cm-native-locked" : ""}${previewLeft ? " cm-preview-left" : ""}${light ? " cm-native-lit" : ""}${isBox ? " cm-native-lightbox" : ""}`} style={style} ref={shell}>
    <div className="cm-native-screen" ref={(node) => { screen.current = node; if (!interactive) node?.setAttribute("inert", ""); }}>
      <div className="cm-native-light-panel" aria-hidden="true" />
      <div className="cm-native-camera" onPointerDown={startSurface} onPointerMove={moveSurface} onPointerUp={finishSurface} onPointerCancel={() => { touches.current.clear(); pinch.current = null; surfaceDrag.current = null; }}>
        <img src="/assets/compact/portrait.webp" alt={copy.portraitAlt} draggable={false} width="1024" height="1536" />
        <div className="cm-native-halo" aria-hidden="true" />
      </div>
      <div className="cm-native-status" aria-hidden="true"><span>{copy.statusTime}</span><span className="cm-native-island"/><span className="cm-native-system-icons"><svg viewBox="0 0 18 12"><path d="M1 11V8h2v3m3 0V5h2v6m3 0V2h2v9m3 0V0h2v11" fill="currentColor"/></svg><svg viewBox="0 0 18 14"><path d="M1 4Q9-2 17 4M4 7Q9 3 14 7m-7 3q2-2 4 0" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="12" r="1" fill="currentColor"/></svg><span className="cm-native-battery"/></span></div>
      <button type="button" className="cm-native-glass cm-native-settings" aria-label={copy.settings} onClick={() => openPanel("settings")}><Icon name="gear"/></button>
      {locked && <button type="button" className={`cm-native-preview${previewDrag ? " cm-preview-dragging" : ""}`} style={previewStyle} aria-label={copy.previewLabel} title={copy.previewHint} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); previewStart.current = { x: event.clientX, y: event.clientY, centerX: previewCenter.x, centerY: previewCenter.y }; }} onPointerMove={movePreview} onPointerUp={finishPreview} onPointerCancel={() => { previewStart.current = null; setPreviewDrag(null); }} onKeyDown={(event) => { if (event.key.startsWith("Arrow")) { event.preventDefault(); setCorner(`${event.key === "ArrowUp" ? "top" : event.key === "ArrowDown" ? "bottom" : corner.split("-")[0]}-${event.key === "ArrowLeft" ? "left" : event.key === "ArrowRight" ? "right" : corner.split("-")[1]}` as Corner); } }}><img src="/assets/compact/portrait.webp" alt="" draggable={false}/><span className="cm-native-reticle" style={{ left: `${point[0] * 100}%`, top: `${point[1] * 100}%`, width: `${100 / zoom}%`, height: `${100 / zoom}%` }}/></button>}
      <div className="cm-native-controls" onKeyDown={(event) => { if (event.key === "Escape") setPanel(null); }}>
        {featuresOpen && <div className="cm-native-features" role="group" aria-label={copy.featuresLabel}>{copy.features.map((item) => <button type="button" className="cm-native-glass" key={item.id} aria-label={item.label} title={item.label} aria-pressed={feature === item.id} onClick={() => choose(item.id as Feature)}><Icon name={item.id}/></button>)}</div>}
        {zoomOpen && <div className="cm-native-ruler-panel cm-native-glass"><div className="cm-native-ruler" ref={ruler} role="slider" tabIndex={0} aria-label={copy.preciseZoom} aria-valuemin={1} aria-valuemax={5} aria-valuenow={zoom} aria-valuetext={label} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); rulerDrag.current = { x: event.clientX, zoom }; }} onPointerMove={moveRuler} onPointerUp={() => { rulerDrag.current = null; }} onPointerCancel={() => { rulerDrag.current = null; }} onKeyDown={(event) => { const amount = ["ArrowUp", "ArrowRight"].includes(event.key) ? .1 : ["ArrowDown", "ArrowLeft"].includes(event.key) ? -.1 : 0; if (amount || ["Home", "End"].includes(event.key)) { event.preventDefault(); setZoom(event.key === "Home" ? 1 : event.key === "End" ? 5 : clamp(zoom + amount)); } }}><div aria-hidden="true">{Array.from({ length: 41 }, (_, i) => { const value = (i + 10) / 10; const distance = (value - zoom) * 120; const radius = 136; if (Math.abs(distance) > radius * 1.45) return null; const softness = Math.min(1, Math.max(0, (Math.abs(distance) / radius - .58) / .42)); return <span className={`cm-native-tick${i % 10 === 0 ? " cm-whole-tick" : ""}`} key={i} style={{ left: `${50 + Math.sin(distance / radius) * 46}%`, opacity: (value <= zoom ? 1 : .32) * (1 - softness * .85), filter: `blur(${softness * 2.5}px)` }}>{i % 10 === 0 && <span>{zoomLabel(value)}</span>}</span>; })}</div></div><div className="cm-native-pointer" aria-hidden="true"/><div className="cm-native-ruler-footer"><output>{label}</output><button type="button" onClick={() => setPanel(null)}>{copy.done}</button></div></div>}
        <div className="cm-native-button-row">
          <button type="button" className="cm-native-glass" aria-label={copy.light} title={copy.light} aria-pressed={light} onClick={toggleLight}><Icon name="sun"/></button>
          {light && <button type="button" className="cm-native-glass" aria-label={copy.lightSettings} title={copy.lightSettings} onClick={() => openPanel("lighting")}><Icon name="sliders"/></button>}
          <button type="button" className="cm-native-glass cm-native-zoom" aria-label={`${copy.zoom}, ${label}`} title={copy.zoomHint} onPointerDown={startZoom} onPointerMove={moveZoom} onPointerUp={endZoom} onPointerCancel={() => { endZoom(); suppressClick.current = true; }} onContextMenu={(event) => { event.preventDefault(); setPanel("zoom"); }} onClick={cycleZoom} onKeyDown={(event) => { if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); setPanel("zoom"); } }}>{label}</button>
          <button type="button" className="cm-native-glass" aria-label={copy.featureLock} title={copy.featureLock} aria-expanded={panel === "features"} onClick={() => openPanel("features")}><Icon name={panel === "features" ? "close" : "viewfinder"}/></button>
          {locked && <button type="button" className="cm-native-glass" aria-label={`${copy.unlock} ${selected?.label}`} title={copy.unlock} onClick={() => { setFeature(null); setPanel(null); setPan({ x: 0, y: 0 }); }}><Icon name="unlock"/></button>}
        </div>
      </div>
      {sheetOpen && <><button className="cm-native-scrim" type="button" tabIndex={-1} aria-label={copy.close} onClick={() => setPanel(null)}/><div className={`cm-native-sheet${panel !== "lighting" ? " cm-native-settings-sheet" : ""}`} role="dialog" aria-modal="true" aria-labelledby={`${uid}-sheet-title`} ref={sheet} tabIndex={-1} onKeyDown={trapSheet}><div className="cm-native-grabber" aria-hidden="true"/><header>{canGoBack && <button className="cm-native-back" type="button" aria-label={copy.back} onClick={() => setPanel(panel === "resolution" ? "quality" : "settings")}><Icon name="back"/></button>}<h4 id={`${uid}-sheet-title`}>{title}</h4><button type="button" className="cm-native-done" onClick={() => setPanel(null)}>{sheetClose}</button></header><div className="cm-native-sheet-body">
        {lightingOpen ? <><fieldset><legend>{copy.lightStyle}</legend><div className="cm-native-form-group"><div className="cm-native-segments">{copy.modes.map((option) => <button key={option.id} type="button" aria-pressed={mode === option.id} onClick={() => setMode(option.id)}>{option.label}</button>)}</div></div></fieldset><fieldset><legend>{copy.brightness}</legend><div className="cm-native-form-group"><input type="range" aria-label={copy.lightBrightness} min="0" max="1" step=".01" value={brightness} style={{ "--range-fill": `${brightness * 100}%` } as CSSProperties} onChange={(event) => setBrightness(Number(event.target.value))}/></div></fieldset><fieldset><legend>{copy.warmth}</legend><div className="cm-native-form-group"><input type="range" aria-label={copy.lightWarmth} min="0" max="1" step=".01" value={warmth} style={{ "--range-fill": `${warmth * 100}%` } as CSSProperties} onChange={(event) => { const value = Number(event.target.value); setWarmth(value <= .05 ? 0 : value >= .95 ? 1 : Math.abs(value - .5) <= .05 ? .5 : value); }}/><div className="cm-native-warmth-labels">{copy.warmthOptions.map((option) => <span key={option.id}>{option.label}</span>)}</div></div></fieldset></> : settingsOpen ? <><fieldset><legend>{copy.camera}</legend><button type="button" className="cm-native-form-group cm-native-form-row" onClick={() => setPanel("quality")}><Icon name="camera"/>{copy.cameraQuality}<Icon name="chevron"/></button></fieldset><fieldset><legend>{copy.premium}</legend><div className="cm-native-form-group cm-native-form-row"><Icon name="check"/>{copy.premiumUnlocked}</div></fieldset><fieldset><legend>{copy.about}</legend><div className="cm-native-form-group cm-native-about">{copy.aboutItems.map((item) => <span key={item}>{item}</span>)}</div></fieldset><p className="cm-native-settings-note">{copy.settingsNote}</p></> : qualityOpen ? <button className="cm-native-form-group cm-native-form-row" type="button" onClick={() => setPanel("resolution")}>{copy.resolution}<span>{resolution}</span><Icon name="chevron"/></button> : <><div className="cm-native-form-group cm-native-resolutions">{copy.resolutions.map((option) => <button key={option.label} type="button" aria-pressed={resolution === option.label} onClick={() => setResolution(option.label)}><span>{option.label}<small>{option.detail}</small></span>{resolution === option.label && <Icon name="check"/>}</button>)}</div><p className="cm-native-settings-note">{copy.resolutionNote}</p></>}
      </div></div></>}
      <div className="cm-native-home" aria-hidden="true"/>
    </div>
  </div>;
}

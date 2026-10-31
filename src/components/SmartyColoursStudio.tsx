import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type CSSProperties } from "react";
import "./SmartyColoursStudio.css";

const SIZE = 1000;
const HISTORY_LIMIT = 8;
import { smartyStudioPictures, smartyStudioPacks, resolveStudioPicture, smartyStudioColours as colours, smartyStudioTools, smartyStudioCopy as copy, type SmartyStudioPicture } from "../content/smartyColoursStudio";
import { printSmartyPicture, type SmartyPaperSize } from "./smartyColoursPrint";
export { smartyStudioPictures } from "../content/smartyColoursStudio";
type Tool = "Fill" | "Crayon" | "Paint" | "Rubber";
type Point = { x: number; y: number };
type ActivePicture = { id: string; canvas: HTMLCanvasElement | null; ready: boolean; dirty: boolean; undo: ImageData[]; redo: ImageData[] };
// Inactive colouring is compressed PNG in tab memory. Only the active picture has raw undo pixels.
// Refreshing clears it all; nothing is uploaded or written to browser storage.
const picturesInThisTab = new Map<string, string>();
function newActivePicture(id: string): ActivePicture {
  return { id, canvas: null, ready: false, dirty: false, undo: [], redo: [] };
}
/** Drop raw history when a picture leaves the canvas, keeping only its compressed colours. */
function parkActivePicture(active: ActivePicture, cache: Map<string, string>): boolean {
  if (!active.ready || !active.canvas) return true;
  try {
    if (active.dirty) {
      const png = active.canvas.toDataURL("image/png");
      if (!png.startsWith("data:image/png;base64,")) return false;
      cache.set(active.id, png);
    }
  } catch { return false; }
  active.undo = []; active.redo = []; active.ready = false; active.dirty = false; active.canvas = null;
  return true;
}
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("The picture could not load.")); image.src = src;
  });
}
function snapshot(canvas: HTMLCanvasElement) { return canvas.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, SIZE, SIZE); }
function capHistory(memory: ActivePicture) {
  while (memory.undo.length + memory.redo.length > HISTORY_LIMIT) memory.undo.shift();
}
function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
  context.beginPath(); context.moveTo(x + radius, y); context.arcTo(x + w, y, x + w, y + h, radius);
  context.arcTo(x + w, y + h, x, y + h, radius); context.arcTo(x, y + h, x, y, radius); context.arcTo(x, y, x + w, y, radius); context.closePath();
}

/** Scanline fill uses the original outlines as boundaries, independently of paint already on the page. */
function fillRegion(canvas: HTMLCanvasElement, boundary: Uint8Array, point: Point, hex: string): boolean {
  const x0 = Math.max(0, Math.min(SIZE - 1, Math.floor(point.x)));
  const y0 = Math.max(0, Math.min(SIZE - 1, Math.floor(point.y)));
  const start = y0 * SIZE + x0;
  if (boundary[start]) return false;
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  const image = context.getImageData(0, 0, SIZE, SIZE);
  const rgb = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  const visited = new Uint8Array(SIZE * SIZE), edges: number[] = [], stack = [start];
  const paint = (index: number) => {
    const p = index * 4; image.data[p] = rgb[0]; image.data[p + 1] = rgb[1]; image.data[p + 2] = rgb[2]; image.data[p + 3] = 255;
  };
  while (stack.length) {
    const seed = stack.pop()!;
    if (visited[seed] || boundary[seed]) continue;
    const y = Math.floor(seed / SIZE), row = y * SIZE;
    let x = seed - row;
    while (x > 0 && !visited[row + x - 1] && !boundary[row + x - 1]) x--;
    let aboveRun = false, belowRun = false;
    for (; x < SIZE && !visited[row + x] && !boundary[row + x]; x++) {
      const index = row + x; visited[index] = 1; paint(index);
      if ((x > 0 && boundary[index - 1]) || (x < SIZE - 1 && boundary[index + 1]) || (y > 0 && boundary[index - SIZE]) || (y < SIZE - 1 && boundary[index + SIZE])) edges.push(index);
      const above = y > 0 && !boundary[index - SIZE] && !visited[index - SIZE];
      const below = y < SIZE - 1 && !boundary[index + SIZE] && !visited[index + SIZE];
      if (above && !aboveRun) stack.push(index - SIZE);
      if (below && !belowRun) stack.push(index + SIZE);
      aboveRun = above; belowRun = below;
    }
  }
  // Extend only beneath existing line pixels, never into a neighbouring white region.
  for (const seed of edges) {
    const sy = Math.floor(seed / SIZE), sx = seed - sy * SIZE;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const x = sx + dx, y = sy + dy;
      if (dx * dx + dy * dy <= 9 && x >= 0 && x < SIZE && y >= 0 && y < SIZE && boundary[y * SIZE + x]) paint(y * SIZE + x);
    }
  }
  context.putImageData(image, 0, 0); return true;
}

const iconNames = { home: "Home", undo: "Undo", redo: "Redo", fill: "Fill", rubber: "Rubber", paint: "Paint", crayon: "Crayon", share: "Share", save: "Save", print: "Print", done: "Done" };
function StudioIcon({ name }: { name: string }) {
  const shared = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared}>
    {name === iconNames.home ? <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h5v-7h4v7h5V10" /></> :
      name === iconNames.undo ? <><path d="m8 4-5 5 5 5" /><path d="M4 9h10a6 6 0 0 1 0 12" /></> :
      name === iconNames.redo ? <><path d="m16 4 5 5-5 5" /><path d="M20 9H10a6 6 0 0 0 0 12" /></> :
      name === iconNames.fill ? <><path d="m9 3 9 9-7 7a3 3 0 0 1-4 0l-3-3a3 3 0 0 1 0-4l7-7" /><path d="m4 11 13 0" /><path d="M20 14s-2 3-2 4a2 2 0 0 0 4 0c0-1-2-4-2-4Z" /></> :
      name === iconNames.rubber ? <><path d="m9 20-6-6L14 3l7 7-10 10H9Z" /><path d="m8 9 7 7M10 20h11" /></> :
      name === iconNames.paint ? <><path d="m13 13 7-9-1-1-9 7 3 3Z" /><path d="M11 12c-5-2-3 5-8 7 6 4 12-1 8-7Z" /></> :
      name === iconNames.crayon ? <><path d="m4 20 2-6L17 3l4 4-11 11-6 2Z" /><path d="m6 14 4 4M14 6l4 4" /></> :
      name === iconNames.share ? <><path d="M12 15V3m-4 4 4-4 4 4" /><path d="M5 11v9h14v-9" /></> :
      name === iconNames.save ? <><path d="M12 3v12m-4-4 4 4 4-4" /><path d="M4 16v5h16v-5" /></> :
      name === iconNames.print ? <><path d="M7 9V3h10v6M7 17H4V9h16v8h-3" /><path d="M7 14h10v7H7z" /></> :
      name === iconNames.done ? <path d="m4 12 5 5L20 6" /> : <path d="M5 5l14 14M5 19 19 5" />}
  </svg>;
}

/** Native Tab visits only the checked radio in a named group. Match that order when wrapping focus. */
function studioTabStops(scope: HTMLElement | null): HTMLElement[] {
  const controls = Array.from(scope?.querySelectorAll<HTMLElement>('button:not(:disabled), select:not(:disabled), input:not(:disabled), [href], canvas[tabindex="0"]') ?? [])
    .filter((element) => element.offsetParent !== null);
  return controls.filter((element) => {
    if (!(element instanceof HTMLInputElement) || element.type !== "radio" || !element.name) return true;
    const group = controls.filter((candidate): candidate is HTMLInputElement => candidate instanceof HTMLInputElement && candidate.type === "radio" && candidate.name === element.name && candidate.form === element.form);
    return element === (group.find((candidate) => candidate.checked) ?? group[0]);
  });
}
type StudioProps = { initialPictureId?: string; packId?: string; onClose: () => void; onShareRequest: (action: () => void) => void };
type FinishedPicture = { shareImage: string; printImage: string; picture: SmartyStudioPicture };
function pngBlob(dataUrl: string): Blob {
  const encoded = dataUrl.split(",")[1];
  const bytes = atob(encoded), values = new Uint8Array(bytes.length);
  for (let index = 0; index < bytes.length; index++) values[index] = bytes.charCodeAt(index);
  return new Blob([values], { type: "image/png" });
}
export function SmartyColoursStudio({ initialPictureId, packId, onClose, onShareRequest }: StudioProps) {
  const initial = resolveStudioPicture(initialPictureId, packId);
  const [pictureId, setPictureId] = useState(initial.id), [tool, setTool] = useState<Tool>("Fill"), [colour, setColour] = useState("#fed130");
  const [exporting, setExporting] = useState(false);
  const exportingRef = useRef(false);
  const [ready, setReady] = useState(false), [status, setStatus] = useState("Loading your picture…"), [, setRevision] = useState(0);
  const [done, setDone] = useState<FinishedPicture | null>(null), [confirmReset, setConfirmReset] = useState<string | null>(null);
  const [paper, setPaper] = useState<SmartyPaperSize>(() => typeof navigator !== "undefined" && /^en-US\b/i.test(navigator.language) ? "letter" : "a4");
  const [keyboardPoint, setKeyboardPoint] = useState<Point | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null), rootRef = useRef<HTMLDivElement>(null), closeRef = useRef<HTMLButtonElement>(null);
  const boundaryRef = useRef<Uint8Array | null>(null), originalRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef<ActivePicture>(newActivePicture(initial.id));
  const drawingRef = useRef<{ id: string; pointer: number; point: Point; before: ImageData } | null>(null);
  const actionDialogRef = useRef<HTMLDivElement>(null), cursorRef = useRef<Point>({ x: 500, y: 500 });
  const hadOverlay = useRef(false);
  const mountedRef = useRef(false), exportRequest = useRef(0), requestedProps = useRef(`${packId ?? ""}:${initialPictureId ?? ""}`);
  const printCleanup = useRef<(() => void) | null>(null), downloadUrls = useRef(new Set<string>());
  const picture = smartyStudioPictures.find((item) => item.id === pictureId) ?? initial;
  const pack = smartyStudioPacks.find((item) => item.id === picture.packId)!;
  const memory = activeRef.current;
  const refreshHistory = () => setRevision((value) => value + 1);

  function rememberChange(before: ImageData, notify = true) {
    const active = activeRef.current;
    if (!active.ready) return;
    active.undo.push(before); active.redo = []; active.dirty = true; capHistory(active);
    if (notify) refreshHistory();
  }
  function commitStroke(notify = true) {
    const drawing = drawingRef.current; drawingRef.current = null;
    if (drawing && drawing.id === activeRef.current.id) rememberChange(drawing.before, notify);
  }
  function persistActive(): boolean {
    const active = activeRef.current;
    if (!active.ready || !active.canvas) return true;
    commitStroke(false);
    return parkActivePicture(active, picturesInThisTab);
  }
  function selectPicture(id: string) {
    const next = smartyStudioPictures.find((item) => item.id === id);
    if (!next || next.id === activeRef.current.id) return;
    if (!persistActive()) { setStatus("Your colours could not be kept yet. Save your picture before choosing another one."); return; }
    exportRequest.current++; printCleanup.current?.(); printCleanup.current = null;
    activeRef.current = newActivePicture(next.id); boundaryRef.current = null; originalRef.current = null;
    setReady(false); setDone(null); setConfirmReset(null); setKeyboardPoint(null); setStatus("Loading your picture…");
    const context = canvasRef.current?.getContext("2d");
    if (context) { context.fillStyle = "white"; context.fillRect(0, 0, SIZE, SIZE); }
    setPictureId(next.id);
  }
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
    mountedRef.current = true; closeRef.current?.focus();
    return () => {
      mountedRef.current = false; exportRequest.current++; persistActive();
      printCleanup.current?.(); printCleanup.current = null;
      for (const url of downloadUrls.current) URL.revokeObjectURL(url);
      downloadUrls.current.clear(); boundaryRef.current = null; originalRef.current = null;
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);
  useEffect(() => {
    let cancelled = false;
    const active = activeRef.current;
    active.canvas = canvasRef.current; active.ready = false;
    setReady(false); boundaryRef.current = null; originalRef.current = null; setStatus("Loading your picture…");
    const remembered = picturesInThisTab.get(pictureId);
    Promise.all([
      loadImage(picture.image),
      remembered ? loadImage(remembered).catch(() => { picturesInThisTab.delete(pictureId); return null; }) : Promise.resolve(null)
    ]).then(([image, saved]) => {
      if (cancelled || !mountedRef.current || activeRef.current !== active || !active.canvas) return;
      // Contain portrait originals too: the boundary mask, overlay and exported art use identical coordinates.
      const lineArt = document.createElement("canvas"); lineArt.width = SIZE; lineArt.height = SIZE;
      const context = lineArt.getContext("2d", { willReadFrequently: true })!;
      context.fillStyle = "white"; context.fillRect(0, 0, SIZE, SIZE);
      const scale = Math.min(SIZE / image.naturalWidth, SIZE / image.naturalHeight);
      const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
      context.drawImage(image, (SIZE - width) / 2, (SIZE - height) / 2, width, height);
      const data = context.getImageData(0, 0, SIZE, SIZE).data, boundary = new Uint8Array(SIZE * SIZE);
      for (let p = 0; p < boundary.length; p++) { const offset = p * 4; boundary[p] = 0.2126 * data[offset] + 0.7152 * data[offset + 1] + 0.0722 * data[offset + 2] < 150 ? 1 : 0; }
      const colourContext = active.canvas.getContext("2d", { willReadFrequently: true })!;
      colourContext.fillStyle = "white"; colourContext.fillRect(0, 0, SIZE, SIZE);
      if (saved) colourContext.drawImage(saved, 0, 0, SIZE, SIZE);
      boundaryRef.current = boundary; originalRef.current = lineArt; active.ready = true;
      setReady(true); setStatus(saved ? "Your colours are back. Keep colouring." : copy.fillHint); refreshHistory();
    }).catch(() => { if (!cancelled && mountedRef.current && activeRef.current === active) setStatus("This picture could not load. Pick another picture to carry on."); });
    return () => { cancelled = true; };
  }, [pictureId, picture.image]);
  useEffect(() => {
    const signature = `${packId ?? ""}:${initialPictureId ?? ""}`;
    if (requestedProps.current === signature) return;
    requestedProps.current = signature; selectPicture(resolveStudioPicture(initialPictureId, packId).id);
  }, [initialPictureId, packId]);
  useEffect(() => {
    const overlay = Boolean(done || confirmReset);
    const background = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(".sc-studio__top, .sc-studio__body") ?? []);
    for (const element of background) (element as HTMLElement & { inert: boolean }).inert = overlay;
    if (overlay) actionDialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    else if (hadOverlay.current) closeRef.current?.focus();
    hadOverlay.current = overlay;
    return () => { for (const element of background) (element as HTMLElement & { inert: boolean }).inert = false; };
  }, [done, confirmReset]);

  function history(direction: "undo" | "redo") {
    const active = activeRef.current;
    if (!active.ready || !active.canvas || drawingRef.current) return;
    const source = active[direction], target = active[direction === "undo" ? "redo" : "undo"];
    const next = source.pop(); if (!next) return;
    target.push(snapshot(active.canvas)); active.canvas.getContext("2d")!.putImageData(next, 0, 0);
    active.dirty = true; refreshHistory(); setStatus(direction === "undo" ? "Last mark undone." : "Mark put back.");
  }
  function pointerPoint(event: PointerEvent<HTMLCanvasElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: Math.max(0, Math.min(SIZE - 1, (event.clientX - rect.left) / rect.width * SIZE)), y: Math.max(0, Math.min(SIZE - 1, (event.clientY - rect.top) / rect.height * SIZE)) };
  }
  function stroke(from: Point, to: Point) {
    const context = canvasRef.current!.getContext("2d")!;
    context.save(); context.lineCap = "round"; context.lineJoin = "round";
    context.strokeStyle = tool === "Rubber" ? "#ffffff" : colour;
    context.lineWidth = tool === "Rubber" ? 46 : tool === "Paint" ? 36 : 16;
    context.globalAlpha = tool === "Crayon" ? 0.82 : 1;
    const line = (a: Point, b: Point) => { context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x + 0.01, b.y + 0.01); context.stroke(); };
    line(from, to);
    if (tool === "Crayon") {
      context.lineWidth = 3; context.globalAlpha = 0.28;
      for (let i = 0; i < 4; i++) {
        const dx = (Math.random() - 0.5) * 13, dy = (Math.random() - 0.5) * 13;
        line({ x: from.x + dx, y: from.y + dy }, { x: to.x + dx + Math.random() * 2, y: to.y + dy + Math.random() * 2 });
      }
    }
    context.restore();
  }
  function pointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (exportingRef.current || !activeRef.current.ready || !canvasRef.current || drawingRef.current || event.button !== 0 || !event.isPrimary) return;
    event.preventDefault(); event.currentTarget.focus(); setKeyboardPoint(null);
    const point = pointerPoint(event), before = snapshot(canvasRef.current);
    if (tool === "Fill") {
      if (boundaryRef.current && fillRegion(canvasRef.current, boundaryRef.current, point, colour)) { rememberChange(before); setStatus("Shape coloured."); }
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId); stroke(point, point);
    drawingRef.current = { id: activeRef.current.id, pointer: event.pointerId, point, before };
  }
  function pointerMove(event: PointerEvent<HTMLCanvasElement>) {
    const drawing = drawingRef.current;
    if (!drawing || drawing.pointer !== event.pointerId || drawing.id !== activeRef.current.id || !activeRef.current.ready) return;
    const point = pointerPoint(event); stroke(drawing.point, point); drawing.point = point;
  }
  function finishStroke(event: PointerEvent<HTMLCanvasElement>) {
    if (drawingRef.current?.pointer !== event.pointerId) return;
    commitStroke();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function canvasKey(event: KeyboardEvent<HTMLCanvasElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); history(event.shiftKey ? "redo" : "undo"); return; }
    const moves: Record<string, Point> = { ArrowLeft: { x: -10, y: 0 }, ArrowRight: { x: 10, y: 0 }, ArrowUp: { x: 0, y: -10 }, ArrowDown: { x: 0, y: 10 } };
    if (moves[event.key]) {
      event.preventDefault(); const move = moves[event.key], step = event.shiftKey ? 5 : 1;
      cursorRef.current = { x: Math.max(0, Math.min(999, cursorRef.current.x + move.x * step)), y: Math.max(0, Math.min(999, cursorRef.current.y + move.y * step)) };
      setKeyboardPoint({ ...cursorRef.current }); return;
    }
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault(); if (exportingRef.current || !activeRef.current.ready || !canvasRef.current) return;
      const before = snapshot(canvasRef.current), point = cursorRef.current;
      if (tool === "Fill") { if (boundaryRef.current && fillRegion(canvasRef.current, boundaryRef.current, point, colour)) rememberChange(before); }
      else { stroke(point, point); rememberChange(before); }
      setKeyboardPoint({ ...point }); setStatus("Colour added at the crosshair.");
    }
  }
  function keepColouring() {
    printCleanup.current?.(); printCleanup.current = null;
    setDone(null); setConfirmReset(null); setStatus(tool === "Fill" ? copy.fillHint : copy.toolHint(tool));
  }
  function closeStudio() {
    if (!persistActive()) { setStatus("Your colours could not be kept yet. Save your picture before going home."); return; }
    onClose();
  }
  function trapFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (document.querySelector('[data-sc-parent-gate="true"]')) return;
    if (event.key === "Escape") {
      if (event.target instanceof HTMLSelectElement) return;
      event.preventDefault(); if (done || confirmReset) keepColouring(); else closeStudio(); return;
    }
    if (event.key !== "Tab") return;
    const scope = (done || confirmReset) ? actionDialogRef.current : rootRef.current;
    const controls = studioTabStops(scope);
    if (!controls.length) return;
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || !scope?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !scope?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
  }
  function compositeArtwork(): HTMLCanvasElement {
    if (!activeRef.current.ready || !activeRef.current.canvas || !originalRef.current) throw new Error("The picture is still loading.");
    const art = document.createElement("canvas"); art.width = SIZE; art.height = SIZE;
    const context = art.getContext("2d")!; context.fillStyle = "white"; context.fillRect(0, 0, SIZE, SIZE);
    context.drawImage(activeRef.current.canvas, 0, 0); context.globalCompositeOperation = "multiply"; context.drawImage(originalRef.current, 0, 0);
    return art;
  }
  async function shareCard(requested: number): Promise<FinishedPicture | null> {
    const art = compositeArtwork(), selected = picture;
    const printImage = art.toDataURL("image/png");
    // Release the temporary raw bitmap before waiting on fonts or another decode.
    art.width = 0; art.height = 0;
    await document.fonts.ready;
    if (!mountedRef.current || requested !== exportRequest.current) return null;
    const frozenArtwork = await loadImage(printImage);
    if (!mountedRef.current || requested !== exportRequest.current) return null;
    const card = document.createElement("canvas"); card.width = 1080; card.height = 1080;
    const context = card.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, 0, 1080); gradient.addColorStop(0, "#0088fe"); gradient.addColorStop(1, "#01a4cd"); context.fillStyle = gradient; context.fillRect(0, 0, 1080, 1080);
    roundedRect(context, 98, 42, 884, 884, 48); context.fillStyle = "#34c759"; context.fill();
    context.save(); roundedRect(context, 112, 56, 856, 856, 36); context.clip(); context.drawImage(frozenArtwork, 112, 56, 856, 856); context.restore();
    try { const icon = await loadImage("/smarty-colours/pencil-app-icon.png"); context.drawImage(icon, 48, 959, 70, 70); } catch { /* The text lockup remains readable if the decorative icon fails. */ }
    context.fillStyle = "white"; context.font = '900 43px "Grandstander", sans-serif'; context.fillText("SmartyColours", 130, 1006);
    context.textAlign = "right"; context.font = '800 29px "Grandstander", sans-serif'; context.fillText("Coloured by a", 1032, 987); context.fillText("little artist", 1032, 1023);
    return { shareImage: card.toDataURL("image/png"), printImage, picture: selected };
  }
  async function showDone() {
    if (!activeRef.current.ready || exportingRef.current) return;
    commitStroke(); exportingRef.current = true; setExporting(true); setStatus(copy.preparingPicture);
    const requested = ++exportRequest.current, id = activeRef.current.id;
    try {
      const finished = await shareCard(requested);
      if (finished && mountedRef.current && requested === exportRequest.current && activeRef.current.id === id) { setDone(finished); setStatus(""); }
    } catch { if (mountedRef.current && requested === exportRequest.current) setStatus("Your picture is still here. Try All done again when it has finished loading."); }
    finally { exportingRef.current = false; if (mountedRef.current) setExporting(false); }
  }
  function downloadPicture() {
    if (!done) return;
    try {
      const url = URL.createObjectURL(pngBlob(done.shareImage)), link = document.createElement("a");
      downloadUrls.current.add(url); link.href = url; link.download = `smartycolours-${done.picture.id}.png`; document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => { URL.revokeObjectURL(url); downloadUrls.current.delete(url); }, 1000); setStatus("Your picture download has started.");
    } catch { setStatus("The picture could not be saved. Your colouring is still here; try again."); }
  }
  function requestShare() {
    if (!done) return;
    try {
      const file = new File([pngBlob(done.shareImage)], `smartycolours-${done.picture.id}.png`, { type: "image/png" });
      onShareRequest(() => {
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          void navigator.share({ files: [file], title: "My SmartyColours picture" }).catch((error: unknown) => {
            if (!(error instanceof DOMException && error.name === "AbortError")) downloadPicture();
          });
        } else downloadPicture();
      });
    } catch { setStatus("Your picture could not be prepared. Try Save picture."); }
  }
  function requestPrint() {
    if (!done) return;
    printCleanup.current?.();
    printCleanup.current = printSmartyPicture({ title: done.picture.title, packName: done.picture.packName, alt: done.picture.alt, image: done.printImage, size: paper }, (message) => { if (mountedRef.current) setStatus(message); });
  }
  function requestReset() {
    if (!activeRef.current.ready) return;
    commitStroke(); setConfirmReset(compositeArtwork().toDataURL("image/png"));
  }
  function reset() {
    const active = activeRef.current;
    if (!active.ready || !active.canvas) return;
    const before = snapshot(active.canvas), context = active.canvas.getContext("2d")!;
    context.fillStyle = "white"; context.fillRect(0, 0, SIZE, SIZE); rememberChange(before); setConfirmReset(null); setStatus("A fresh page, ready to colour."); closeRef.current?.focus();
  }
  const overlayOpen = Boolean(done || confirmReset);
  return <div className="sc-studio sc-sky" role="dialog" aria-modal="true" aria-labelledby="sc-studio-title" ref={rootRef} onKeyDown={trapFocus}>
    <header className="sc-studio__top" aria-hidden={overlayOpen || undefined}>
      <button className="sc-btn sc-btn--kid" onClick={closeStudio} ref={closeRef} aria-label={copy.home}><StudioIcon name="Home" /><span>{copy.home}</span></button>
      <h1 id="sc-studio-title">{picture.title}</h1>
      <div className="sc-studio__top-actions"><button className="sc-btn sc-btn--kid" onClick={requestReset} disabled={!ready}>{copy.startAgain}</button><button className="sc-btn sc-btn--kid sc-btn--sunshine" onClick={() => void showDone()} disabled={!ready || exporting} aria-busy={exporting}><StudioIcon name="Done" />{copy.allDone}</button></div>
    </header>
    <div className="sc-studio__body" aria-hidden={overlayOpen || undefined}>
      <aside className="sc-studio__picture-panel">
        <label className="sc-studio__pack-picker"><span>{copy.pickPack}</span><select value={picture.packId} onChange={(event) => { const selected = smartyStudioPacks.find((item) => item.id === event.target.value); if (selected) selectPicture(selected.pages[0].id); }}>{smartyStudioPacks.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <nav className="sc-studio__pictures" aria-label={copy.pick}>
          <h2>{copy.pick}</h2>
          {pack.pages.map((item) => <button className="sc-studio__picture" aria-label={item.title} aria-pressed={item.id === pictureId} key={item.id} onClick={() => selectPicture(item.id)}><img src={item.image} alt="" width="1024" height="1024" loading="lazy" /><span>{item.title}</span></button>)}
        </nav>
      </aside>
      <div className="sc-studio__stage">
        <div className="sc-studio__canvas">
          <canvas width={SIZE} height={SIZE} ref={canvasRef} tabIndex={0} aria-label={copy.canvasLabel(picture.title)} aria-describedby="sc-studio-keyboard-help" onKeyDown={canvasKey} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={finishStroke} onPointerCancel={finishStroke} onLostPointerCapture={finishStroke} onFocus={() => setKeyboardPoint({ ...cursorRef.current })} onBlur={() => setKeyboardPoint(null)} />
          <img src={picture.image} alt={picture.alt} width="1000" height="1000" draggable={false} />
          {keyboardPoint && <span className="sc-studio__crosshair" style={{ left: `${keyboardPoint.x / 10}%`, top: `${keyboardPoint.y / 10}%` }} aria-hidden="true" />}
        </div>
        <p className="sc-studio__status" role="status" aria-live="polite">{status || (tool === smartyStudioTools[0] ? copy.fillHint : copy.toolHint(tool))}</p>
        <p id="sc-studio-keyboard-help" className="sc-studio__keyboard-help">{copy.keyboardHelp}</p>
      </div>
      <div className="sc-studio__tools"><div className="sc-toolbar" role="toolbar" aria-label={copy.toolbar}>
        <div className="sc-studio__tools-row"><div className="sc-studio__history"><button className="sc-tool" onClick={() => history("undo")} disabled={!ready || !memory.undo.length}><StudioIcon name="Undo" /><span>{copy.undo}</span></button><button className="sc-tool" onClick={() => history("redo")} disabled={!ready || !memory.redo.length}><StudioIcon name="Redo" /><span>{copy.redo}</span></button></div>
        <div className="sc-studio__tool-group" role="group" aria-label={copy.tools}>{smartyStudioTools.map((item) => <button className="sc-tool" key={item} aria-pressed={tool === item} onClick={() => { setTool(item); setStatus(item === "Fill" ? copy.fillHint : copy.toolHint(item)); }}><StudioIcon name={item} /><span>{item}</span></button>)}</div>
        </div><div className="sc-palette" role="group" aria-label={copy.colours}>{colours.map(([name, value]) => <button className="sc-swatch" key={name} aria-label={name} aria-pressed={colour === value} style={{ "--swatch-colour": value } as CSSProperties} onClick={() => { setColour(value); setStatus(`${name} picked.`); }} />)}</div>
      </div></div>
    </div>
    {(done || confirmReset) && <div className="sc-studio__overlay"><div className="sc-studio__action-dialog" role="dialog" aria-modal="true" aria-labelledby="sc-studio-dialog-title" ref={actionDialogRef}>
      <h2 id="sc-studio-dialog-title">{done ? copy.doneTitle : copy.resetTitle}</h2>
      <img className="sc-studio__finished-art" src={done?.shareImage ?? confirmReset!} alt={done ? copy.finishedAlt(done.picture.title) : copy.currentAlt} />
      {done ? <><p>{copy.doneHelp}</p><fieldset className="sc-studio__paper"><legend>{copy.paperSize}</legend><label><input type="radio" name="sc-studio-paper" checked={paper === "a4"} onChange={() => setPaper("a4")} />{copy.a4}</label><label><input type="radio" name="sc-studio-paper" checked={paper === "letter"} onChange={() => setPaper("letter")} />{copy.letter}</label></fieldset><div className="sc-studio__done-actions"><button className="sc-btn sc-btn--kid sc-btn--crown" onClick={downloadPicture}><StudioIcon name="Save" />{copy.save}</button><button className="sc-btn sc-btn--kid" onClick={requestShare}><StudioIcon name="Share" />{copy.share}</button><button className="sc-btn sc-btn--kid" onClick={requestPrint} aria-describedby="sc-studio-print-note"><StudioIcon name="Print" />{copy.print}</button></div><p id="sc-studio-print-note">{copy.printNote}</p><p role="status" aria-live="polite">{status}</p><button className="sc-btn sc-btn--kid" onClick={keepColouring}>{copy.keepColouring}</button></> : <><p>{copy.resetHelp}</p><button className="sc-btn sc-btn--kid sc-btn--sunshine" onClick={keepColouring}>{copy.keepColouring}</button><button className="sc-btn sc-btn--kid" onClick={reset}>{copy.startAgain}</button></>}
    </div></div>}
  </div>;
}

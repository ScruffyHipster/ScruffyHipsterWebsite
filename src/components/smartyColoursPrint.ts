import { smartyStudioCopy as copy } from "../content/smartyColoursStudio";

export type SmartyPaperSize = "a4" | "letter";
export type SmartyPrintPicture = { title: string; packName: string; alt: string; image: string; size: SmartyPaperSize };

export function escapePrintText(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export function createSmartyPrintDocument(picture: SmartyPrintPicture): string {
  if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(picture.image)) throw new Error("Printing requires a local PNG picture.");
  const size = picture.size === "letter" ? "letter" : "a4";
  const title = escapePrintText(copy.printTitle(picture.title, picture.packName));
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><link rel="stylesheet" href="/smarty-colours/print-sheet.css"><style>@page{size:${size === "letter" ? "Letter" : "A4"};margin:0}</style></head><body data-size="${size}"><article class="sc-print-sheet"><header class="sc-print-head"><div class="sc-print-brand"><img src="/smarty-colours/pencil-app-icon.png" alt=""><strong>${escapePrintText(copy.brand)}</strong></div><div class="sc-print-name">${escapePrintText(copy.name)} <span></span></div></header><div class="sc-print-art"><img src="${picture.image}" alt="${escapePrintText(picture.alt)}"></div><footer class="sc-print-footer"><div class="sc-print-copy"><strong>${title}</strong><p>${escapePrintText(copy.printFooter)}<br>${escapePrintText(copy.domain)}</p></div><div class="sc-print-dots" aria-label="${escapePrintText(copy.planColours)}"><i></i><i></i><i></i><i></i><i></i></div></footer></article></body></html>`;
}

/** The artwork stays in this same-origin, temporary frame; no request uploads it. */
export function printSmartyPicture(picture: SmartyPrintPicture, onStatus: (message: string) => void): () => void {
  const previousFocus = document.activeElement as HTMLElement | null;
  const frame = document.createElement("iframe");
  frame.title = copy.printFrameTitle;
  frame.dataset.scPrintFrame = "true";
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  Object.assign(frame.style, { position: "fixed", width: "1px", height: "1px", left: "-10000px", top: "0", border: "0" });
  let disposed = false;
  let loadingTimeout: number | undefined;
  let fallbackTimeout: number | undefined;
  let printWindow: Window | null = null;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    window.clearTimeout(loadingTimeout); window.clearTimeout(fallbackTimeout);
    printWindow?.removeEventListener("afterprint", finished);
    frame.onload = null; frame.remove();
    if (previousFocus?.isConnected) previousFocus.focus();
  };
  const finished = () => { if (disposed) return; dispose(); onStatus(copy.printClosed); };
  const failed = () => { if (disposed) return; dispose(); onStatus(copy.printError); };
  onStatus(copy.printPreparing);
  frame.onload = () => {
    void (async () => {
      const doc = frame.contentDocument; printWindow = frame.contentWindow;
      if (!doc || !printWindow || !doc.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')?.sheet) throw new Error("Print layout did not load.");
      await doc.fonts.ready;
      await Promise.all(Array.from(doc.images).map((image) => image.decode()));
      if (disposed || !frame.isConnected) return;
      window.clearTimeout(loadingTimeout);
      printWindow.addEventListener("afterprint", finished, { once: true });
      // A bounded fallback also cleans up browsers that omit afterprint on cancellation.
      fallbackTimeout = window.setTimeout(finished, 120000);
      onStatus(copy.printOpened); printWindow.focus(); printWindow.print();
    })().catch(() => { if (!disposed) failed(); });
  };
  try {
    frame.srcdoc = createSmartyPrintDocument(picture);
    loadingTimeout = window.setTimeout(failed, 30000);
    document.body.append(frame);
  } catch { failed(); }
  return dispose;
}

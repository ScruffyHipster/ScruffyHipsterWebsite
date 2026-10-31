import { useEffect, useRef, type PropsWithChildren } from "react";
import { smartyColours as content } from "../content/smartyColours";
export function SmartyColoursDialog({ title, onClose, children, wide = false, gate = false }: PropsWithChildren<{ title: string; onClose: () => void; wide?: boolean; gate?: boolean }>) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const node = dialog.current; const previous = document.activeElement as HTMLElement | null; node?.showModal(); return () => { node?.close(); previous?.focus(); }; }, []);
  return <dialog ref={dialog} className={`sc-modal${wide ? " sc-modal--wide" : ""}`} aria-labelledby="sc-dialog-title" data-sc-parent-gate={gate || undefined} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === dialog.current) onClose(); }}><div className="sc-modal__body"><div className="sc-modal__head"><h2 id="sc-dialog-title">{title}</h2><button type="button" className="sc-btn sc-modal__close" aria-label={content.ui.close} onClick={onClose}>{content.ui.closeSymbol}</button></div>{children}</div></dialog>;
}
export type SmartyGateRequest = { action: () => void; description: string; question: typeof content.gateQuestions[number]; choices: number[] };
let questionIndex = 0;
export function createSmartyGate(action: () => void, description: string): SmartyGateRequest {
  const question = content.gateQuestions[questionIndex++ % content.gateQuestions.length]; const choices: number[] = [...question.choices];
  for (let index = choices.length - 1; index > 0; index--) { const other = Math.floor(Math.random() * (index + 1)); [choices[index], choices[other]] = [choices[other], choices[index]]; }
  return { action, description, question, choices };
}
export function SmartyColoursGate({ request, onClose }: { request: SmartyGateRequest; onClose: () => void }) {
  return <SmartyColoursDialog gate title={content.ui.gateTitle} onClose={onClose}><span className="sc-tag sc-tag--grown">{content.ui.grown}</span><p>{request.description}</p><p className="sc-gate__question">{request.question.question}</p><div className="sc-gate__answers">{request.choices.map(answer => <button type="button" className="sc-btn sc-btn--kid" key={answer} onClick={() => { const action = request.action; const correct = answer === request.question.answer; onClose(); if (correct) action(); }}>{answer}</button>)}</div><button type="button" className="sc-btn sc-btn--quiet" onClick={onClose}>{content.ui.gateBack}</button></SmartyColoursDialog>;
}

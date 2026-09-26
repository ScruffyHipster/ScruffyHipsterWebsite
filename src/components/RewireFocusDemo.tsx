const decoration = { arrow: "↗", down: "↓", check: "✓", plus: "+" };
import { useEffect, useRef, useState } from "react";
import { rewireContent } from "../content/rewire";

const c = rewireContent.editorial.demo;
export function RewireFocusDemo() {
  const [intention, setIntention] = useState(0);
  const [stage, setStage] = useState<"ready" | "paused" | "done">("ready");
  const actionRef = useRef<HTMLButtonElement>(null);
  const previousStage = useRef(stage);
  useEffect(() => {
    if (previousStage.current !== stage)
      actionRef.current?.focus({ preventScroll: true });
    previousStage.current = stage;
  }, [stage]);
  const isReady = stage === "ready";
  const isPaused = stage === "paused";
  const appSymbols = ["◎", "▷", "≋"];
  return (
    <div className="rw-demo" aria-label={c.label}>
      <div className="rw-orbit" aria-hidden="true" />
      <div className="rw-orbit rw-orbit-outer" aria-hidden="true" />
      <div className="rw-focus-card">
        <div className="rw-card-top">
          <span className="rw-status-dot" />
          <span>{isReady ? c.status : isPaused ? c.paused : c.done}</span>
          <span aria-hidden="true">{decoration.arrow}</span>
        </div>
        <div className="rw-loop-mark" aria-hidden="true">
          <svg viewBox="0 0 160 130" fill="none">
            {[0, 45, 90, 135].map((rotation) => (
              <ellipse
                key={rotation}
                cx="80"
                cy="65"
                rx="59"
                ry="26"
                stroke="currentColor"
                strokeWidth="2"
                transform={`rotate(${rotation} 80 65)`}
              />
            ))}
          </svg>
        </div>
        <div className="rw-demo-content" aria-live="polite">
          <p className="rw-demo-kicker">
            {isReady ? c.heading : c.options[intention]}
          </p>
          <h2>
            {isReady
              ? c.options[intention]
              : isPaused
                ? c.pauseTitle
                : c.doneTitle}
          </h2>
          <p>{isReady ? c.ready : isPaused ? c.pauseBody : c.doneBody}</p>
        </div>
        {isReady ? (
          <div className="rw-distractions">
            {c.apps.map((app, index) => (
              <button
                key={app}
                ref={index === 0 ? actionRef : undefined}
                onClick={() => setStage("paused")}
                aria-label={`${c.openLabel} ${app}`}
              >
                <span aria-hidden="true">{appSymbols[index]}</span>
                {app}
              </button>
            ))}
          </div>
        ) : (
          <button
            ref={actionRef}
            className="rw-demo-action"
            onClick={() => setStage(isPaused ? "done" : "ready")}
          >
            {isPaused ? c.breakLabel : c.resetLabel}
            <span aria-hidden="true">{decoration.arrow}</span>
          </button>
        )}
      </div>
      <div className="rw-intentions">
        {c.options.map((option, index) => (
          <button
            key={option}
            aria-pressed={intention === index}
            onClick={() => {
              setIntention(index);
              setStage("ready");
            }}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="rw-demo-caption">{c.caption}</p>
    </div>
  );
}

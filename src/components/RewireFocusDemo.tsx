import { useEffect, useRef, useState, type ReactNode } from "react";
import { rewireContent } from "../content/rewire";

const c = rewireContent.editorial.demo;
const symbols = { slash: "/", clock: "9:41", down: "↓", play: "▶", stop: "■" };
const paths = {
  gear: "M10 2h4l.7 3 2 .9 2.8-.9 2 3.5-2.2 2.1v2.8l2.2 2.1-2 3.5-2.8-.9-2 .9-.7 3h-4l-.7-3-2-.9-2.8.9-2-3.5 2.2-2.1v-2.8L2.5 8.5l2-3.5 2.8.9 2-.9.7-3Z M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
  crown: "m3 6 4 4 5-7 5 7 4-4-2 13H5L3 6Z M6 22h12",
  chart: "M3 3v18h18 M6 15l4-5 4 3 7-8",
  plus: "M12 4v16 M4 12h16",
  hand: "M7 12V6a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-6a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v7c0 5-3 7-6 7-3 0-5-2-7-5l-3-4c-1-2 1-3 2-2l2 2Z",
  shield: "M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Z M8 12l3 3 5-6",
};
function Icon({ name }: { name: keyof typeof paths }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

/** Native HomeView / SessionCard recreation, driven by page scroll (no nested scroll trap). */
export function RewireFocusDemo({ children }: { children: ReactNode }) {
  const storyRef = useRef<HTMLElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [startedSession, setStartedSession] = useState<number | null>(null);
  const [scale, setScale] = useState(0.75);
  const started = startedSession === active;

  useEffect(() => {
    const story = storyRef.current;
    const phone = phoneRef.current;
    if (!story || !phone) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const device = deviceRef.current;
      const sticky = device && getComputedStyle(device).position === "sticky";
      const deviceBottom = device?.getBoundingClientRect().bottom ?? 0;
      const readingLine =
        mobile && sticky
          ? Math.min(
              window.innerHeight - 45,
              deviceBottom + (window.innerHeight - deviceBottom) * 0.35,
            )
          : window.innerHeight * 0.55;
      let next = 0;
      // Inspect every step on every frame: partial intersection entries can bounce backwards.
      story
        .querySelectorAll<HTMLElement>("[data-session-step]")
        .forEach((step, index) => {
          if (step.getBoundingClientRect().top <= readingLine) next = index;
        });
      if (!mobile || sticky) setActive(next);
      setScale(phone.clientWidth / 390);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(story);
    observer.observe(phone);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    let mounted = true;
    void document.fonts.ready.then(() => {
      if (mounted) schedule();
    });
    update();
    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
    };
  }, []);

  useEffect(() => {
    setStartedSession(null);
  }, [active]);

  const goToSession = (index: number) => {
    const step = storyRef.current?.querySelectorAll<HTMLElement>(
      "[data-session-step]",
    )[index];
    const device = deviceRef.current;
    if (!step || !device) return;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const sticky = getComputedStyle(device).position === "sticky";
    if (mobile && !sticky) {
      setActive(index);
      return;
    }
    const top = parseFloat(getComputedStyle(device).top) || 0;
    const offset =
      mobile && sticky
        ? top + device.offsetHeight + 16
        : window.innerHeight * 0.4;
    window.scrollTo({
      top: window.scrollY + step.getBoundingClientRect().top - offset,
      behavior: "instant",
    });
  };

  return (
    <section className="rw-container rw-hero rw-session-story" ref={storyRef}>
      {children}
      <div className="rw-story-device" ref={deviceRef} aria-label={c.label}>
        <div className="rw-native-backdrop">
          <div className="rw-native-phone" ref={phoneRef}>
            <div
              className="rw-native-canvas"
              style={{ transform: `scale(${scale})` }}
            >
              <div className="rw-native-status" aria-hidden="true">
                <span>{symbols.clock}</span>
                <i />
                <svg
                  className="rw-native-signal"
                  viewBox="0 0 64 18"
                  fill="currentColor"
                >
                  <path d="M0 12h3v4H0zm5-3h3v7H5zm5-4h3v11h-3zm5-4h3v15h-3z" />
                  <path
                    d="M23 6q7-7 14 0M26 9q4-4 8 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="30" cy="13" r="1.6" />
                  <rect
                    x="42"
                    y="3"
                    width="18"
                    height="12"
                    rx="3"
                    fill="none"
                    stroke="currentColor"
                  />
                  <rect x="44" y="5" width="14" height="8" rx="1" />
                  <path d="M62 7v4" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="rw-native-toolbar" aria-hidden="true">
                <span className="rw-native-glass rw-native-circle">
                  <Icon name="gear" />
                </span>
                <span className="rw-native-glass rw-native-counter">
                  {c.sessionLabel} {active + 1}
                  {symbols.slash}
                  {c.sessions.length}
                </span>
                <span className="rw-native-glass rw-native-circle">
                  <Icon name="crown" />
                </span>
              </div>
              <div className="rw-native-pages">
                {c.sessions.map((item, index) => {
                  const current = active === index;
                  const running = started && current;
                  const alwaysOn = item.seconds === 0;
                  const isAllowList = item.mode === "allow";
                  return (
                    <div
                      className="rw-native-page"
                      key={item.name}
                      aria-hidden={!current}
                      {...(!current ? { inert: "" } : {})}
                      style={{
                        transform: `translateY(${(index - active) * 100}%)`,
                      }}
                    >
                      <div className="rw-native-session">
                        <h2>{item.name}</h2>
                        <p className="rw-native-duration">
                          {running
                            ? alwaysOn
                              ? c.stateLabel
                              : c.remainingLabel
                            : item.duration}
                        </p>
                        {running ? (
                          <p className="rw-native-timer">
                            {alwaysOn ? c.activeLabel : item.timer}
                          </p>
                        ) : (
                          <div className="rw-native-count">
                            <Icon name={isAllowList ? "shield" : "hand"} />
                            <p>
                              <strong>{item.count}</strong>{" "}
                              {isAllowList ? c.allowed : c.blocked}
                            </p>
                          </div>
                        )}
                        <button
                          className="rw-native-glass rw-native-start"
                          tabIndex={current ? 0 : -1}
                          onClick={() =>
                            setStartedSession(running ? null : index)
                          }
                        >
                          {running ? (alwaysOn ? c.end : c.cancel) : c.start}
                          <span aria-hidden="true">
                            {running ? symbols.stop : symbols.play}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rw-native-bottom" aria-hidden="true">
                <span className="rw-native-glass rw-native-circle">
                  <Icon name="chart" />
                </span>
                <span className="rw-native-glass rw-native-circle">
                  <Icon name="plus" />
                </span>
              </div>
              <div className="rw-native-home" aria-hidden="true" />
            </div>
          </div>
        </div>
        <nav className="rw-session-nav" aria-label={c.navigationLabel}>
          {c.sessions.map((item, index) => (
            <button
              key={item.name}
              aria-label={item.name}
              aria-current={active === index ? "step" : undefined}
              onClick={() => goToSession(index)}
            >
              <span>{item.number}</span>
            </button>
          ))}
        </nav>
        <p className="rw-demo-caption" aria-live="polite">
          {started
            ? c.sessions[active].seconds
              ? c.runningCaption
              : c.activeCaption
            : c.caption}
        </p>
        <p className="rw-scroll-cue">
          {c.scrollHint}
          <span aria-hidden="true">{symbols.down}</span>
        </p>
      </div>
      <div className="rw-story-steps" id="how-it-works">
        {c.sessions.map((item, index) => (
          <article
            className="rw-story-step"
            key={item.name}
            data-session-step={index}
            data-active={active === index}
          >
            <p className="rw-eyebrow">
              <span className="rw-number">{item.number}</span>
              {item.name}
            </p>
            <h2>{item.heading}</h2>
            <p>{item.body}</p>
            <span className="rw-story-detail">{item.detail}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

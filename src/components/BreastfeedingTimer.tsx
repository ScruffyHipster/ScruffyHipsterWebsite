import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode
} from "react";
import { Link } from "react-router-dom";
import { BreastfeedingTrackerAppStoreLink } from "./AppStoreLink";
import { BreastfeedingTimerStore } from "./breastfeedingTimerStore";
import type { breastfeedingTimerPageContent } from "../content/pages";
import * as model from "./breastfeedingTimerModel";
import type { Draft, Feed, Side, StoredTimer } from "./breastfeedingTimerModel";
import "./BreastfeedingTimer.css";

type TimerCopy = typeof breastfeedingTimerPageContent.timer;
type SheetKind = "history" | "start" | "compose";
type SheetState = {
  kind: SheetKind;
  open: boolean;
  back: SheetKind | null;
  draft: Draft | null;
  editId: string | null;
  startDraft: number;
  confirmClear: boolean;
  confirmDelete: boolean;
};

const closedSheet: SheetState = {
  kind: "history",
  open: false,
  back: null,
  draft: null,
  editId: null,
  startDraft: 0,
  confirmClear: false,
  confirmDelete: false
};

const MINUTE = 60_000;

function vibrate(duration: number) {
  try {
    navigator.vibrate?.(duration);
  } catch {
    // Vibration is optional and unsupported on iPhone.
  }
}

type IconName =
  | "info" | "play" | "stop" | "pause" | "switch" | "history" | "plus" | "minus"
  | "close" | "check" | "chevron" | "external" | "child";

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const shapes: Record<IconName, ReactNode> = {
    info: <><circle className="bfw-fill" cx="12" cy="6.6" r="1.6" /><path className="bfw-stroke" d="M10 10.5h2.2V18M9.5 18h5" /></>,
    play: <path className="bfw-fill" d="M6.5 4.4v15.2c0 .9 1 1.4 1.7.9l11.8-7.6c.7-.4.7-1.4 0-1.8L8.2 3.5c-.7-.5-1.7 0-1.7.9z" />,
    stop: <rect className="bfw-fill" x="4.5" y="4.5" width="15" height="15" rx="3" />,
    pause: <><rect className="bfw-fill" x="6" y="4.5" width="4.2" height="15" rx="1.3" /><rect className="bfw-fill" x="13.8" y="4.5" width="4.2" height="15" rx="1.3" /></>,
    switch: <path className="bfw-stroke" d="M4 8h15M15.5 4.5 19 8l-3.5 3.5M20 16H5M8.5 12.5 5 16l3.5 3.5" />,
    history: <><rect className="bfw-fill" x="4.6" y="10.5" width="3.4" height="7.5" rx="1" /><rect className="bfw-fill" x="10.3" y="5" width="3.4" height="13" rx="1" /><rect className="bfw-fill" x="16" y="8" width="3.4" height="10" rx="1" /><rect className="bfw-fill" x="3" y="19.6" width="18" height="1.8" rx=".9" /></>,
    plus: <path className="bfw-stroke" d="M12 5v14M5 12h14" />,
    minus: <path className="bfw-stroke" d="M6 12h12" />,
    close: <path className="bfw-stroke" d="M6 6l12 12M18 6 6 18" />,
    check: <path className="bfw-stroke bfw-stroke-heavy" d="M5 12.5l4.5 4.5L19 7.5" />,
    chevron: <path className="bfw-stroke bfw-stroke-heavy" d="M9 5l7 7-7 7" />,
    external: <path className="bfw-stroke" d="M7 17 17 7M9 7h8v8" />,
    child: <><circle className="bfw-fill" cx="12" cy="4.8" r="2.4" /><path className="bfw-fill" d="M8.2 9.4c0-.9.7-1.6 1.6-1.6h4.4c.9 0 1.6.7 1.6 1.6v5.1c0 .6-.4 1-1 1h-.6V21c0 .6-.4 1-1 1h-.6c-.6 0-1-.4-1-1v-3.6h-.2V21c0 .6-.4 1-1 1h-.6c-.6 0-1-.4-1-1v-5.5h-.6c-.6 0-1-.4-1-1z" /></>
  };
  return (
    <svg className="bfw-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {shapes[name]}
    </svg>
  );
}

function SideChoice({
  side,
  selected,
  lastUsed,
  glyph,
  name,
  label,
  lastUsedLabel,
  onPick
}: {
  side: Side;
  selected: boolean;
  lastUsed: boolean;
  glyph: string;
  name: string;
  label: string;
  lastUsedLabel: string;
  onPick: () => void;
}) {
  return (
    <div className="bfw-choice" data-side={side} data-selected={selected}>
      <button
        type="button"
        className="bfw-press bfw-choice-button"
        aria-pressed={selected}
        aria-label={label}
        onClick={onPick}
      >
        <span className="bfw-choice-surface">
          <span className="bfw-choice-glyph">{glyph}</span>
          <span className="bfw-choice-name">{name}</span>
        </span>
      </button>
      <span className="bfw-choice-tag">
        {lastUsed ? <span className="bfw-glass bfw-last-used">{lastUsedLabel}</span> : null}
      </span>
    </div>
  );
}

function Stepper({
  value,
  lessLabel,
  moreLabel,
  onLess,
  onMore
}: {
  value: string;
  lessLabel: string;
  moreLabel: string;
  onLess: () => void;
  onMore: () => void;
}) {
  return (
    <div className="bfw-stepper">
      <button type="button" className="bfw-glass bfw-press bfw-round bfw-round-small bfw-accent-ink" aria-label={lessLabel} onClick={onLess}>
        <Icon name="minus" size={16} />
      </button>
      <output className="bfw-stepper-value bfw-num" aria-live="polite">{value}</output>
      <button type="button" className="bfw-glass bfw-press bfw-round bfw-round-small bfw-accent-ink" aria-label={moreLabel} onClick={onMore}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

export function BreastfeedingTimer({
  copy,
  appIcon,
  aboutPath,
  howHref
}: {
  copy: TimerCopy;
  appIcon: string;
  aboutPath: string;
  howHref: string;
}) {
  const [store] = useState(() => new BreastfeedingTimerStore());
  const [timer, setTimer] = useState<StoredTimer>(model.emptyTimer);
  const [sheet, setSheet] = useState<SheetState>(closedSheet);
  const [now, setNow] = useState(0);
  const [ready, setReady] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [motion, setMotion] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const baseTitle = useRef<string | null>(null);
  const durations = copy.durations;
  const hs = copy.historySheet;
  const ss = copy.startTimeSheet;
  const cs = copy.composeSheet;
  const timeFormat = useMemo(
    () => new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }),
    []
  );
  const dayFormat = useMemo(
    () => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }),
    []
  );
  const time = (ms: number) => timeFormat.format(new Date(ms));
  const sideName = (side: Side) => (side === "L" ? copy.left : copy.right);
  const active = timer.active;
  const isRunning = !!active && !active.pausedAt;

  // Restore the saved timer after hydration so the server and first client render match.
  useEffect(() => {
    let storage: Storage | null = null;
    try { storage = window.localStorage; } catch { /* Browser storage is optional. */ }
    store.connect(storage, navigator.locks ?? null);
    const unsubscribe = store.subscribe(setTimer);
    setNow(Date.now());
    setReady(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== model.STORAGE_KEY && event.key !== null) return;
      setMotion(false);
      store.refresh();
      setNow(Date.now());
    };
    const onVisible = () => {
      setForeground(!document.hidden);
      setMotion(false);
      if (!document.hidden) store.refresh();
    };
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [store]);

  useEffect(() => {
    if (!ready) return;
    const tick = () => setNow(Date.now());
    tick();
    const interval = window.setInterval(tick, isRunning ? 250 : 15_000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [ready, isRunning]);

  // Show the running time in the tab title, and restore the page title afterwards.
  useEffect(() => {
    if (!ready) return;
    if (!active) {
      if (baseTitle.current !== null) {
        document.title = baseTitle.current;
        baseTitle.current = null;
      }
      return;
    }
    if (baseTitle.current === null) baseTitle.current = document.title;
    document.title = model.fill(active.pausedAt ? copy.documentTitlePaused : copy.documentTitle, {
      time: model.clock(model.elapsedMs(active, now)),
      side: sideName(active.side)
    });
  });
  useEffect(
    () => () => {
      if (baseTitle.current !== null) document.title = baseTitle.current;
    },
    []
  );

  const inviteVisible = ready && timer.invite && !active;
  // While a sheet is open: hold the page still, keep focus inside, and return it afterwards.
  useEffect(() => {
    if (!sheet.open) return;
    const returnFocus = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const column = columnRef.current;
    root.style.overflow = "hidden";
    column?.setAttribute("inert", "");
    const outside = column?.closest(".bfw-page")?.querySelectorAll(".bfw-content, .bfw-footer");
    outside?.forEach((element) => element.setAttribute("inert", ""));
    return () => {
      root.style.overflow = previousOverflow;
      column?.removeAttribute("inert");
      outside?.forEach((element) => element.removeAttribute("inert"));
      returnFocus?.focus?.({ preventScroll: true });
    };
  }, [sheet.open]);
  useEffect(() => {
    if (sheet.open) sheetRef.current?.focus({ preventScroll: true });
  }, [sheet.open, sheet.kind]);

  const update = (change: (current: StoredTimer, at: number) => StoredTimer) => {
    const at = Date.now();
    setMotion(true);
    setNow(at);
    store.commit((current) => change(current, at));
  };

  const pick = (side: Side) => {
    if (timer.active || timer.side === side) return;
    update((current) => current.active ? current : ({ ...current, side }));
    vibrate(6);
  };

  const primary = () => {
    // Capture the rendered intent. Repeated clicks cannot toggle a stale Start into Stop,
    // or stop a replacement feed started in another tab.
    const activeId = timer.active?.id;
    const id = crypto.randomUUID();
    update((current, at) => activeId
      ? current.active?.id === activeId ? model.stopFeed(current, at) : current
      : model.startFeed(current, at, id));
    vibrate(12);
  };

  const switchSide = () => {
    const id = active?.id;
    const target = model.otherSide(active?.side ?? timer.side);
    update((current, at) => current.active?.id === id && current.active?.side !== target
      ? model.switchSide(current, at) : current);
  };
  const togglePause = () => {
    const id = active?.id;
    const paused = active?.pausedAt;
    update((current, at) => current.active?.id === id && current.active?.pausedAt === paused
      ? model.togglePause(current, at) : current);
  };

  const openSheet = (kind: SheetKind, extra: Partial<SheetState> = {}) => {
    setMotion(true);
    setSheet((current) => ({
      ...current,
      kind,
      open: true,
      confirmClear: false,
      confirmDelete: false,
      ...extra
    }));
  };

  const closeSheet = () => {
    setSheet((current) =>
      current.back
        ? { ...current, kind: current.back, back: null, editId: null, draft: null, confirmDelete: false }
        : { ...current, open: false, back: null, confirmClear: false, confirmDelete: false }
    );
  };

  const onSheetKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      closeSheet();
      return;
    }
    if (event.key !== "Tab" || !sheetRef.current) return;
    const focusable = [
      ...sheetRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input, [tabindex]:not([tabindex='-1'])"
      )
    ].filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === sheetRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const newDraft = () => model.newDraft(timer.side, Date.now());
  const openAdd = (fromHistory: boolean) =>
    openSheet("compose", { back: fromHistory ? "history" : null, editId: null, draft: newDraft() });
  const openEdit = (feed: Feed) =>
    openSheet("compose", {
      back: sheet.open && sheet.kind === "history" ? "history" : null,
      editId: feed.id,
      draft: model.draftFromFeed(feed)
    });

  /* ---------- derived view values ---------- */
  const lastFeed = timer.feeds[0];
  const lastSide = lastFeed ? model.finalSide(lastFeed) : null;
  const elapsed = model.elapsedMs(active, now);
  const longerName = copy.right.length >= copy.left.length ? copy.right : copy.left;

  const todayKey = model.dayKey(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = model.dayKey(yesterday.getTime());
  const todays = timer.feeds.filter((feed) => model.dayKey(feed.start) === todayKey);
  const todayMs = todays.reduce((total, feed) => total + feed.ms, 0);
  const days: Array<{ key: string; feeds: Feed[] }> = [];
  for (const feed of [...timer.feeds].sort((a, b) => b.start - a.start)) {
    const key = model.dayKey(feed.start);
    const group = days[days.length - 1];
    if (group && group.key === key) group.feeds.push(feed);
    else days.push({ key, feeds: [feed] });
  }
  const dayTitle = (key: string, ms: number) =>
    key === todayKey ? hs.today : key === yesterdayKey ? hs.yesterday : dayFormat.format(new Date(ms));

  const startDraft = sheet.startDraft || active?.start || now;
  const startValid = !!active && model.isStartValid(active, startDraft, now);
  let startNote = "";
  if (active) {
    if (startValid) {
      const pausedSoFar = active.pausedTotal + (active.pausedAt ? now - active.pausedAt : 0);
      startNote = model.fill(ss.feedingFor, {
        duration: model.written(Math.max(0, now - startDraft - pausedSoFar), durations)
      });
    } else if (startDraft > model.latestStart(active, now)) {
      startNote = model.fill(ss.chooseBefore, { time: time(model.latestStart(active, now) + MINUTE - 1) });
    } else {
      startNote = ss.chooseRecent;
    }
  }

  const draft = sheet.draft ?? model.newDraft(timer.side, now);
  const draftValid = model.isDraftValid(draft, now);
  const draftNote =
    draft.l + draft.r === 0 && !model.hasOriginalAmounts(draft)
      ? cs.needMinutes
      : model.draftEnd(draft) > now + 30_000
        ? cs.futureEnd
        : model.fill(cs.summary, {
            duration: model.written(model.hasOriginalAmounts(draft) && draft.original ? draft.original.ms : (draft.l + draft.r) * MINUTE, durations),
            time: time(model.draftEnd(draft))
          });
  const adjustDraft = (key: "l" | "r", delta: number) =>
    setSheet((current) => {
      const base = current.draft ?? draft;
      return {
        ...current,
        draft: { ...base, [key]: Math.max(0, Math.min(Math.max(model.MAX_DRAFT_MINUTES, base[key]), base[key] + delta)) }
      };
    });

  const saveCompose = () => {
    if (!draftValid) return;
    const editing = sheet.editId;
    update((current, at) => model.saveDraft(current, draft, editing, at));
    setSheet((current) =>
      current.back
        ? { ...current, kind: current.back, back: null, draft: null, editId: null }
        : { ...current, open: false, back: null }
    );
    vibrate(10);
  };

  const deleteEditing = () => {
    const id = sheet.editId;
    if (id) update((current) => model.deleteFeed(current, id));
    setSheet((current) =>
      current.back
        ? { ...current, kind: current.back, back: null, draft: null, editId: null, confirmDelete: false }
        : { ...current, open: false, back: null, confirmDelete: false }
    );
  };

  const showsHistory = sheet.kind === "history";
  const showsStartTime = sheet.kind === "start";
  const showsCompose = sheet.kind === "compose";
  const sheetTitle =
    sheet.kind === "history" ? hs.title : sheet.kind === "start" ? ss.title : sheet.editId ? cs.editTitle : cs.addTitle;

  return (
    <div
      className="bfw"
      data-ready={ready}
      data-background={!foreground}
      data-motion={motion}
      data-mode={active ? "running" : "idle"}
      data-side={timer.side}
      data-paused={!!active?.pausedAt}
    >
      <div className="bfw-column" ref={columnRef}>
        <header className="bfw-bar">
          <Link className="bfw-press bfw-bar-icon" to={aboutPath} aria-label={copy.aboutAppLabel}>
            <img src={appIcon} alt="" width="36" height="36" />
          </Link>
          <h1 className="bfw-title">{copy.heading}</h1>
          <a className="bfw-glass bfw-press bfw-round bfw-accent-ink" href={howHref} aria-label={copy.howLinkLabel}>
            <Icon name="info" />
          </a>
        </header>

        <div className="bfw-stage">
          <section className="bfw-layer bfw-idle" aria-label={copy.idleRegionLabel} aria-hidden={!!active}>
            {lastFeed ? (
              <div className="bfw-last">
                <p className="bfw-last-label">{copy.lastFeed}</p>
                <p className="bfw-last-value bfw-num">{model.ago(lastFeed.end, now, durations)}</p>
              </div>
            ) : (
              <div className="bfw-empty">
                <span className="bfw-empty-icon"><Icon name="child" size={40} /></span>
                <p className="bfw-empty-title">{copy.emptyTitle}</p>
                <p className="bfw-empty-body">{copy.emptyBody}</p>
              </div>
            )}

            {inviteVisible ? (
              <div className="bfw-invite" role="region" aria-label={copy.invite.title}>
                <div className="bfw-invite-main">
                  <img src={appIcon} alt="" width="44" height="44" />
                  <div>
                    <p className="bfw-invite-title">{copy.invite.title}</p>
                    <p className="bfw-invite-body">{copy.invite.body}</p>
                  </div>
                </div>
                <div className="bfw-invite-actions">
                  <BreastfeedingTrackerAppStoreLink
                    className="bfw-press bfw-tinted-button"
                    placement="timer-invite"
                    onClick={() =>
                      update((current) => ({ ...current, invite: false, cooldown: model.INVITE_ACCEPT_COOLDOWN }))
                    }
                  >
                    {copy.invite.action}
                    <Icon name="external" size={14} />
                  </BreastfeedingTrackerAppStoreLink>
                  <button
                    type="button"
                    className="bfw-press bfw-text-button"
                    onClick={() => {
                      update((current) => ({ ...current, invite: false, cooldown: model.INVITE_DISMISS_COOLDOWN }));
                    }}
                  >
                    {copy.invite.dismiss}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="bfw-spacer-top" />
            <div className="bfw-choices" role="group" aria-label={copy.sidesLabel}>
              <SideChoice
                side="L"
                selected={timer.side === "L"}
                lastUsed={lastSide === "L"}
                glyph={copy.leftShort}
                name={copy.left}
                label={model.fill(copy.sideLabel, { side: copy.left })}
                lastUsedLabel={copy.lastUsed}
                onPick={() => pick("L")}
              />
              <SideChoice
                side="R"
                selected={timer.side === "R"}
                lastUsed={lastSide === "R"}
                glyph={copy.rightShort}
                name={copy.right}
                label={model.fill(copy.sideLabel, { side: copy.right })}
                lastUsedLabel={copy.lastUsed}
                onPick={() => pick("R")}
              />
            </div>
            <div className="bfw-spacer-bottom" />
          </section>

          <section className="bfw-layer bfw-running" aria-label={copy.runningRegionLabel} aria-hidden={!active}>
            <p className="bfw-active-heading">
              <span className="bfw-active-dot" aria-hidden="true" />
              {model.fill(copy.activeHeading, { side: sideName(active?.side ?? timer.side) })}
            </p>
            <div className="bfw-timer-block">
              <p className="bfw-paused" aria-hidden={!active?.pausedAt}>{copy.paused}</p>
              <p
                className="bfw-timer bfw-num"
                role="timer"
                aria-label={model.fill(active?.pausedAt ? copy.pausedLabel : copy.elapsedLabel, {
                  duration: model.spoken(elapsed, durations)
                })}
              >
                {model.clock(elapsed)}
              </p>
              <button
                type="button"
                className="bfw-glass bfw-press bfw-started"
                aria-label={model.fill(copy.changeStartTime, { time: active ? time(active.start) : "" })}
                onClick={() => active && openSheet("start", { startDraft: active.start })}
              >
                {active ? model.fill(copy.startedAt, { time: time(active.start) }) : null}
              </button>
            </div>
            <div className="bfw-controls">
              <button type="button" className="bfw-glass bfw-press bfw-capsule" onClick={switchSide}>
                <Icon name="switch" size={18} />
                <span>{model.fill(copy.switchTo, { side: sideName(model.otherSide(active?.side ?? timer.side)) })}</span>
              </button>
              <button type="button" className="bfw-glass bfw-press bfw-capsule" onClick={togglePause}>
                <Icon name={active?.pausedAt ? "play" : "pause"} size={18} />
                <span>{active?.pausedAt ? copy.resume : copy.pause}</span>
              </button>
            </div>
          </section>
        </div>

        <div className="bfw-bottom">
          <button
            type="button"
            className="bfw-press bfw-primary"
            aria-label={active ? copy.stopLabel : model.fill(copy.startLabel, { side: sideName(timer.side) })}
            onClick={primary}
          >
            <span className="bfw-primary-labels" aria-hidden="true">
              <span className="bfw-primary-label bfw-primary-start">
                <Icon name="play" size={20} />
                <span className="bfw-primary-words">
                  <span>{copy.start}</span>
                  <span className="bfw-side-names">
                    <span className="bfw-side-sizer">{longerName}</span>
                    <span className="bfw-side-name" data-name="L">{copy.left}</span>
                    <span className="bfw-side-name" data-name="R">{copy.right}</span>
                  </span>
                </span>
              </span>
              <span className="bfw-primary-label bfw-primary-stop">
                <Icon name="stop" size={18} />
                <span>{copy.stop}</span>
              </span>
            </span>
          </button>
          <div className="bfw-toolbar">
            <button type="button" className="bfw-glass bfw-press bfw-round bfw-round-large bfw-accent-ink" aria-label={copy.history} onClick={() => openSheet("history", { back: null })}>
              <Icon name="history" />
            </button>
            <button type="button" className="bfw-glass bfw-press bfw-round bfw-round-large bfw-accent-ink" aria-label={copy.addFeed} onClick={() => openAdd(false)}>
              <Icon name="plus" />
            </button>
          </div>
        </div>
      </div>

      <div className="bfw-overlay" data-open={sheet.open} aria-hidden={!sheet.open}>
        <div className="bfw-scrim" aria-hidden="true" onClick={closeSheet} />
        <div
          className="bfw-sheet"
          data-kind={sheet.kind}
          role="dialog"
          aria-modal="true"
          aria-label={sheetTitle}
          tabIndex={-1}
          ref={sheetRef}
          onKeyDown={onSheetKeyDown}
        >
          <div className="bfw-grabber" aria-hidden="true" />

          {showsHistory ? (
            <>
              <div className="bfw-sheet-bar">
                <button type="button" className="bfw-glass bfw-press bfw-round" aria-label={copy.close} onClick={closeSheet}>
                  <Icon name="close" size={18} />
                </button>
                <h2 className="bfw-sheet-title">{hs.title}</h2>
                <button type="button" className="bfw-glass bfw-press bfw-round bfw-accent-ink" aria-label={hs.addLabel} onClick={() => openAdd(true)}>
                  <Icon name="plus" size={20} />
                </button>
              </div>
              <div className="bfw-sheet-scroll">
                <div className="bfw-summary">
                  <div className="bfw-summary-head">
                    <div>
                      <p className="bfw-summary-title">{hs.summaryTitle}</p>
                      <p className="bfw-summary-subtitle">{hs.summarySubtitle}</p>
                    </div>
                    <span className="bfw-summary-mark"><Icon name="child" size={54} /></span>
                  </div>
                  <div className="bfw-metrics">
                    <div className="bfw-metric">
                      <p className="bfw-metric-label">{hs.feeds}</p>
                      <p className="bfw-metric-value bfw-metric-lead bfw-num">{todays.length}</p>
                    </div>
                    <div className="bfw-metric">
                      <p className="bfw-metric-label">{hs.total}</p>
                      <p className="bfw-metric-value bfw-num">{model.written(todayMs, durations)}</p>
                    </div>
                    <div className="bfw-metric">
                      <p className="bfw-metric-label">{hs.average}</p>
                      <p className="bfw-metric-value bfw-num">
                        {todays.length ? model.written(todayMs / todays.length, durations) : hs.noValue}
                      </p>
                    </div>
                  </div>
                </div>

                {days.map((day) => {
                  const first = day.feeds[day.feeds.length - 1];
                  const latest = day.feeds[0];
                  const count = day.feeds.length;
                  return (
                    <section className="bfw-day" key={day.key} aria-label={dayTitle(day.key, first.start)}>
                      <div className="bfw-day-header">
                        <div>
                          <h3 className="bfw-day-title">{dayTitle(day.key, first.start)}</h3>
                          <p className="bfw-day-range bfw-num">
                            {model.fill(hs.range, { start: time(first.start), end: time(latest.end) })}
                          </p>
                        </div>
                        <p className="bfw-day-count bfw-num" aria-label={count === 1 ? hs.feedCountOne : model.fill(hs.feedCount, { count })}>
                          {count}
                        </p>
                      </div>
                      <div className="bfw-group">
                        {day.feeds.map((feed) => {
                          const both = model.sideMs(feed, "L") > 0 && model.sideMs(feed, "R") > 0;
                          const sides = both ? hs.both : sideName(model.sideMs(feed, "R") > 0 ? "R" : "L");
                          const detail = model.fill(hs.detail, { sides, duration: model.written(feed.ms, durations) });
                          const segments = feed.segs
                            .filter((segment) => segment.ms > 0)
                            .map((segment) => model.fill(hs.segment, { side: sideName(segment.side), duration: model.written(segment.ms, durations) }))
                            .join(", ");
                          return (
                            <button
                              type="button"
                              className="bfw-row"
                              key={feed.id}
                              aria-label={model.fill(hs.rowLabel, { time: time(feed.start), detail: both ? segments : detail })}
                              onClick={() => openEdit(feed)}
                            >
                              <span className="bfw-row-time bfw-num">{time(feed.start)}</span>
                              <span className="bfw-row-text">
                                <span className="bfw-row-title">{hs.activity}</span>
                                <span className="bfw-row-detail">{detail}</span>
                                {both ? <span className="bfw-row-detail">{segments}</span> : null}
                              </span>
                              <Icon name="chevron" size={12} />
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}

                {timer.feeds.length === 0 ? (
                  <div className="bfw-history-empty">
                    <p className="bfw-empty-title">{hs.emptyTitle}</p>
                    <p className="bfw-empty-body">{hs.emptyBody}</p>
                  </div>
                ) : null}

                <div className="bfw-history-footer">
                  <p>{hs.storageNote}</p>
                  {timer.feeds.length > 0 && !sheet.confirmClear ? (
                    <button
                      type="button"
                      className="bfw-press bfw-warning-button"
                      onClick={() => setSheet((current) => ({ ...current, confirmClear: true }))}
                    >
                      {hs.clearAll}
                    </button>
                  ) : null}
                  {sheet.confirmClear ? (
                    <div className="bfw-confirm" role="alert">
                      <p className="bfw-confirm-title">{hs.clearConfirm}</p>
                      <div className="bfw-confirm-actions">
                        <button type="button" className="bfw-press bfw-text-button" onClick={() => setSheet((current) => ({ ...current, confirmClear: false }))}>
                          {copy.cancel}
                        </button>
                        <button
                          type="button"
                          className="bfw-press bfw-text-button bfw-text-warning"
                          onClick={() => {
                            update((current) => ({ ...current, feeds: [], invite: false }));
                            setSheet((current) => ({ ...current, confirmClear: false }));
                          }}
                        >
                          {hs.clear}
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {timer.feeds.length > 0 ? (
                    <p className="bfw-history-app">
                      {hs.appNote}{" "}
                      <BreastfeedingTrackerAppStoreLink placement="timer-history">{hs.appAction}</BreastfeedingTrackerAppStoreLink>
                    </p>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}

          {showsStartTime ? (
            <>
              <div className="bfw-sheet-bar">
                <button type="button" className="bfw-glass bfw-press bfw-round" aria-label={copy.cancel} onClick={closeSheet}>
                  <Icon name="close" size={18} />
                </button>
                <h2 className="bfw-sheet-title">{ss.title}</h2>
                <button
                  type="button"
                  className="bfw-press bfw-round bfw-confirm-button"
                  aria-label={copy.done}
                  disabled={!startValid}
                  onClick={() => {
                    if (!startValid) return;
                    update((current, at) => (current.active?.id === active?.id && current.active && model.isStartValid(current.active, startDraft, at) ? { ...current, active: { ...current.active, start: startDraft } } : current));
                    setSheet((current) => ({ ...current, open: false }));
                  }}
                >
                  <Icon name="check" size={18} />
                </button>
              </div>
              <div className="bfw-start-body">
                <div className="bfw-start-row">
                  <button
                    type="button"
                    className="bfw-glass bfw-press bfw-round bfw-round-medium bfw-accent-ink"
                    aria-label={ss.earlier}
                    onClick={() => setSheet((current) => ({ ...current, startDraft: startDraft - MINUTE }))}
                  >
                    <Icon name="minus" size={20} />
                  </button>
                  <input
                    type="time"
                    className="bfw-time-input bfw-num"
                    aria-label={ss.inputLabel}
                    value={model.timeInputValue(startDraft)}
                    onChange={(event) => {
                      const value = model.parseTimeInput(event.target.value, Date.now());
                      if (value !== null) setSheet((current) => ({ ...current, startDraft: value }));
                    }}
                  />
                  <button
                    type="button"
                    className="bfw-glass bfw-press bfw-round bfw-round-medium bfw-accent-ink"
                    aria-label={ss.later}
                    onClick={() => setSheet((current) => ({ ...current, startDraft: startDraft + MINUTE }))}
                  >
                    <Icon name="plus" size={20} />
                  </button>
                </div>
                <p className="bfw-start-note" data-invalid={!startValid} aria-live="polite">{startNote}</p>
              </div>
            </>
          ) : null}

          {showsCompose ? (
            <>
              <div className="bfw-sheet-bar">
                <button type="button" className="bfw-glass bfw-press bfw-round" aria-label={copy.cancel} onClick={closeSheet}>
                  <Icon name="close" size={18} />
                </button>
                <h2 className="bfw-sheet-title">{sheet.editId ? cs.editTitle : cs.addTitle}</h2>
                <button
                  type="button"
                  className="bfw-press bfw-round bfw-confirm-button"
                  aria-label={copy.save}
                  disabled={!draftValid}
                  onClick={saveCompose}
                >
                  <Icon name="check" size={18} />
                </button>
              </div>
              <div className="bfw-sheet-scroll bfw-compose">
                <p className="bfw-section-label">{cs.section}</p>
                <div className="bfw-group">
                  <label className="bfw-form-row">
                    <span>{cs.started}</span>
                    <input
                      type="datetime-local"
                      className="bfw-field bfw-num"
                      value={model.localInputValue(draft.start)}
                      max={model.localInputValue(now)}
                      onChange={(event) => {
                        const value = model.parseLocalInput(event.target.value);
                        if (value !== null) setSheet((current) => ({ ...current, draft: { ...(current.draft ?? draft), start: value } }));
                      }}
                    />
                  </label>
                  <div className="bfw-form-row">
                    <span>{copy.left}</span>
                    <Stepper
                      value={model.fill(cs.minutes, { minutes: draft.l })}
                      lessLabel={cs.lessLeft}
                      moreLabel={cs.moreLeft}
                      onLess={() => adjustDraft("l", -1)}
                      onMore={() => adjustDraft("l", 1)}
                    />
                  </div>
                  <div className="bfw-form-row">
                    <span>{copy.right}</span>
                    <Stepper
                      value={model.fill(cs.minutes, { minutes: draft.r })}
                      lessLabel={cs.lessRight}
                      moreLabel={cs.moreRight}
                      onLess={() => adjustDraft("r", -1)}
                      onMore={() => adjustDraft("r", 1)}
                    />
                  </div>
                </div>
                <p className="bfw-form-note" data-invalid={!draftValid} aria-live="polite">{draftNote}</p>
                {sheet.editId && !sheet.confirmDelete ? (
                  <button
                    type="button"
                    className="bfw-press bfw-delete-button"
                    onClick={() => setSheet((current) => ({ ...current, confirmDelete: true }))}
                  >
                    {cs.delete}
                  </button>
                ) : null}
                {sheet.editId && sheet.confirmDelete ? (
                  <div className="bfw-confirm bfw-confirm-card" role="alert">
                    <p className="bfw-confirm-title">{cs.deleteConfirm}</p>
                    <div className="bfw-confirm-actions">
                      <button type="button" className="bfw-press bfw-text-button" onClick={() => setSheet((current) => ({ ...current, confirmDelete: false }))}>
                        {copy.cancel}
                      </button>
                      <button type="button" className="bfw-press bfw-text-button bfw-text-warning" onClick={deleteEditing}>
                        {cs.deleteAction}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

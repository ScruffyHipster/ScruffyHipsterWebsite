export type Side = "L" | "R";
export type Segment = { side: Side; ms: number };
export type Feed = { id: string; start: number; end: number; ms: number; segs: Segment[] };
export type ActiveFeed = {
  id: string;
  start: number;
  side: Side;
  segs: Segment[];
  pausedAt: number | null;
  pausedTotal: number;
};
export type Draft = { id: string; start: number; l: number; r: number; first: Side; original?: Feed };
export type StoredTimer = {
  feeds: Feed[];
  active: ActiveFeed | null;
  side: Side;
  invite: boolean;
  cooldown: number;
};

export type DurationCopy = {
  seconds: string;
  minutes: string;
  hours: string;
  hoursMinutes: string;
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  hoursMinutesAgo: string;
  dayAgo: string;
  daysAgo: string;
  spokenHour: string;
  spokenHours: string;
  spokenMinute: string;
  spokenMinutes: string;
  spokenSecond: string;
  spokenSeconds: string;
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
export const STORAGE_KEY = "scruffyhipster.breastfeeding-timer.v1";
export const MAX_DRAFT_MINUTES = 180;
/** Saves before the app invitation can appear again after "Not now". */
export const INVITE_DISMISS_COOLDOWN = 3;
/** Saves before the app invitation can appear again after opening the App Store. */
export const INVITE_ACCEPT_COOLDOWN = 10;

export const emptyTimer = (): StoredTimer => ({
  feeds: [],
  active: null,
  side: "L",
  invite: false,
  cooldown: 0
});

export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  );
}

export function otherSide(side: Side): Side {
  return side === "L" ? "R" : "L";
}

export function elapsedMs(active: ActiveFeed | null, now: number) {
  if (!active) return 0;
  const paused = active.pausedTotal + (active.pausedAt !== null ? Math.max(0, now - active.pausedAt) : 0);
  return Math.max(0, now - active.start - paused);
}

export function closedMs(active: ActiveFeed) {
  return active.segs.reduce((total, segment) => total + segment.ms, 0);
}

export function finalSide(feed: Feed | undefined): Side {
  return feed?.segs[feed.segs.length - 1]?.side ?? "L";
}

export function sideMs(feed: Feed, side: Side) {
  return feed.segs.reduce((total, segment) => total + (segment.side === side ? segment.ms : 0), 0);
}

export function mergeSegments(segments: Segment[]) {
  const merged: Segment[] = [];
  for (const segment of segments) {
    if (segment.ms <= 0) continue;
    const last = merged[merged.length - 1];
    if (last && last.side === segment.side) {
      last.ms += segment.ms;
    } else {
      merged.push({ side: segment.side, ms: segment.ms });
    }
  }
  return merged;
}

/** The latest start that leaves the current side's segment at zero. */
export function latestStart(active: ActiveFeed, now: number) {
  const open = Math.max(0, elapsedMs(active, now) - closedMs(active));
  return Math.min(now, active.start + open);
}

export function isStartValid(active: ActiveFeed, start: number, now: number) {
  return Number.isFinite(start) && start <= latestStart(active, now) && start >= now - 12 * HOUR;
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function startFeed(timer: StoredTimer, now: number, id = newId()): StoredTimer {
  if (timer.active) return timer;
  return {
    ...timer,
    active: { id, start: now, side: timer.side, segs: [], pausedAt: null, pausedTotal: 0 }
  };
}

export function switchSide(timer: StoredTimer, now: number): StoredTimer {
  const active = timer.active;
  if (!active) return timer;
  const open = Math.max(0, elapsedMs(active, now) - closedMs(active));
  const side = otherSide(active.side);
  return {
    ...timer,
    side,
    active: {
      ...active,
      side,
      segs: open > 0 ? [...active.segs, { side: active.side, ms: open }] : active.segs
    }
  };
}

export function togglePause(timer: StoredTimer, now: number): StoredTimer {
  const active = timer.active;
  if (!active) return timer;
  return {
    ...timer,
    active: active.pausedAt !== null
      ? { ...active, pausedAt: null, pausedTotal: active.pausedTotal + (now - active.pausedAt) }
      : { ...active, pausedAt: now }
  };
}

function withInvite(timer: StoredTimer): Pick<StoredTimer, "invite" | "cooldown"> {
  return timer.cooldown <= 0
    ? { invite: true, cooldown: 0 }
    : { invite: timer.invite, cooldown: timer.cooldown - 1 };
}

export function stopFeed(timer: StoredTimer, now: number): StoredTimer {
  const active = timer.active;
  if (!active) return timer;
  const total = elapsedMs(active, now);
  let segs = mergeSegments([
    ...active.segs,
    { side: active.side, ms: Math.max(0, total - closedMs(active)) }
  ]);
  // Keep the finishing side even if Stop follows a switch immediately.
  if (segs[segs.length - 1]?.side !== active.side) segs.push({ side: active.side, ms: 0 });
  if (!segs.length) segs = [{ side: active.side, ms: total }];
  const feed: Feed = { id: active.id, start: active.start, end: now, ms: total, segs };
  return {
    ...timer,
    ...withInvite(timer),
    active: null,
    side: active.side,
    feeds: [feed, ...timer.feeds.filter((item) => item.id !== feed.id)].sort((a, b) => b.end - a.end)
  };
}

export function newDraft(side: Side, now: number): Draft {
  const start = Math.floor((now - 15 * MINUTE) / MINUTE) * MINUTE;
  return { id: newId(), start, l: side === "L" ? 15 : 0, r: side === "R" ? 15 : 0, first: side };
}

export function draftFromFeed(feed: Feed): Draft {
  return {
    id: feed.id,
    original: feed,
    start: feed.start,
    l: Math.round(sideMs(feed, "L") / MINUTE),
    r: Math.round(sideMs(feed, "R") / MINUTE),
    first: feed.segs[0]?.side ?? "L"
  };
}

export function hasOriginalAmounts(draft: Draft) {
  return !!draft.original && draft.l === Math.round(sideMs(draft.original, "L") / MINUTE) &&
    draft.r === Math.round(sideMs(draft.original, "R") / MINUTE);
}

export function draftEnd(draft: Draft) {
  return hasOriginalAmounts(draft) && draft.original
    ? draft.original.end + (draft.start - draft.original.start)
    : draft.start + (draft.l + draft.r) * MINUTE;
}

export function isDraftValid(draft: Draft, now: number) {
  return Number.isFinite(draft.start) && Number.isInteger(draft.l) && Number.isInteger(draft.r) &&
    draft.l >= 0 && draft.r >= 0 && (draft.l + draft.r > 0 || hasOriginalAmounts(draft)) && draftEnd(draft) <= now + 30_000;
}

export function saveDraft(timer: StoredTimer, draft: Draft, editId: string | null, now: number): StoredTimer {
  if (!isDraftValid(draft, now)) return timer;
  const existing = timer.feeds.find((feed) => feed.id === (editId ?? draft.id));
  if ((editId && !existing) || (!editId && existing)) return timer;
  // Opening and saving an edit must not round seconds away or lose switch order.
  if (editId && draft.original && hasOriginalAmounts(draft)) {
    if (draft.start === draft.original.start) return timer;
    const offset = draft.start - draft.original.start;
    const moved = { ...draft.original, start: draft.start, end: draft.original.end + offset };
    if (moved.end > now + 30_000) return timer;
    return { ...timer, feeds: timer.feeds.map((feed) => feed.id === editId ? moved : feed).sort((a, b) => b.end - a.end) };
  }
  const order: Array<[Side, number]> = draft.first === "R"
    ? [["R", draft.r], ["L", draft.l]]
    : [["L", draft.l], ["R", draft.r]];
  const segs = mergeSegments(order.map(([side, minutes]) => ({ side, ms: minutes * MINUTE })));
  const ms = (draft.l + draft.r) * MINUTE;
  const feed: Feed = { id: editId ?? draft.id, start: draft.start, end: draft.start + ms, ms, segs };
  const feeds = [...timer.feeds.filter((item) => item.id !== feed.id), feed]
    .sort((a, b) => b.end - a.end);
  return {
    ...timer,
    ...(editId ? {} : withInvite(timer)),
    feeds,
    side: feeds[0]?.id === feed.id && !timer.active ? finalSide(feed) : timer.side
  };
}

export function deleteFeed(timer: StoredTimer, id: string): StoredTimer {
  return { ...timer, feeds: timer.feeds.filter((feed) => feed.id !== id) };
}

/* ---------- formatting ---------- */

const pad = (value: number) => String(value).padStart(2, "0");

export function clock(ms: number) {
  const total = Math.floor(Math.max(0, ms) / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total / 60) % 60;
  const seconds = total % 60;
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

export function written(ms: number, copy: DurationCopy) {
  const total = Math.floor(Math.max(0, ms) / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total / 60) % 60;
  if (hours > 0 && minutes > 0) return fill(copy.hoursMinutes, { hours, minutes });
  if (hours > 0) return fill(copy.hours, { hours });
  if (total > 0 && total < 60) return fill(copy.seconds, { seconds: total });
  return fill(copy.minutes, { minutes });
}

export function ago(from: number, now: number, copy: DurationCopy) {
  const minutes = Math.floor(Math.max(0, now - from) / MINUTE);
  if (minutes < 1) return copy.justNow;
  if (minutes < 60) return fill(copy.minutesAgo, { minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const remainder = minutes % 60;
    return remainder === 0
      ? fill(copy.hoursAgo, { hours })
      : fill(copy.hoursMinutesAgo, { hours, minutes: remainder });
  }
  const days = Math.floor(hours / 24);
  return days === 1 ? copy.dayAgo : fill(copy.daysAgo, { days });
}

export function spoken(ms: number, copy: DurationCopy) {
  const total = Math.floor(Math.max(0, ms) / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total / 60) % 60;
  const seconds = total % 60;
  const parts: string[] = [];
  if (hours) parts.push(fill(hours === 1 ? copy.spokenHour : copy.spokenHours, { count: hours }));
  if (minutes) parts.push(fill(minutes === 1 ? copy.spokenMinute : copy.spokenMinutes, { count: minutes }));
  if (seconds || !parts.length) {
    parts.push(fill(seconds === 1 ? copy.spokenSecond : copy.spokenSeconds, { count: seconds }));
  }
  return parts.join(", ");
}

export function dayKey(ms: number) {
  const date = new Date(ms);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function localInputValue(ms: number) {
  const date = new Date(ms);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseLocalInput(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day, hours, minutes] = match.map(Number);
  const date = new Date(year, month - 1, day, hours, minutes);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day &&
    date.getHours() === hours && date.getMinutes() === minutes ? date.getTime() : null;
}

export function timeInputValue(ms: number) {
  const date = new Date(ms);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** A time of day on or before now; a time later than now means yesterday. */
export function parseTimeInput(value: string, now: number) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  if (Number(match[1]) > 23 || Number(match[2]) > 59) return null;
  const date = new Date(now);
  date.setHours(Number(match[1]), Number(match[2]), 0, 0);
  const time = date.getTime();
  if (time > now) date.setDate(date.getDate() - 1);
  return date.getTime();
}

/* ---------- storage ---------- */

const isSide = (value: unknown): value is Side => value === "L" || value === "R";
const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

function readSegments(value: unknown): Segment[] | null {
  if (!Array.isArray(value)) return null;
  const segments = value.filter(
    (segment): segment is Segment => isSide(segment?.side) && isNumber(segment?.ms) && segment.ms >= 0
  );
  return segments.length === value.length ? segments : null;
}

function readFeed(value: unknown): Feed | null {
  if (!value || typeof value !== "object") return null;
  const feed = value as Record<string, unknown>;
  const segs = readSegments(feed.segs);
  if (typeof feed.id !== "string" || !isNumber(feed.start) || !isNumber(feed.end) || !isNumber(feed.ms) || feed.ms < 0 || feed.end < feed.start || !segs?.length || Math.abs(segs.reduce((sum, segment) => sum + segment.ms, 0) - feed.ms) > 1) {
    return null;
  }
  return { id: feed.id, start: feed.start, end: feed.end, ms: feed.ms, segs };
}

function readActive(value: unknown): ActiveFeed | null {
  if (!value || typeof value !== "object") return null;
  const active = value as Record<string, unknown>;
  const segs = readSegments(active.segs);
  if (
    typeof active.id !== "string" || !isNumber(active.start) || !isSide(active.side) || !segs ||
    !(active.pausedAt === null || isNumber(active.pausedAt)) || !isNumber(active.pausedTotal) || active.pausedTotal < 0
  ) {
    return null;
  }
  return {
    id: active.id,
    start: active.start,
    side: active.side,
    segs,
    pausedAt: active.pausedAt as number | null,
    pausedTotal: active.pausedTotal
  };
}

export function readStoredTimer(raw: string | null): StoredTimer | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (data?.v !== 1) return null;
    const feeds = Array.isArray(data.feeds)
      ? data.feeds.map(readFeed).filter((feed): feed is Feed => feed !== null)
      : [];
    return {
      feeds: [...new Map(feeds.map((feed) => [feed.id, feed])).values()].sort((a, b) => b.end - a.end),
      active: readActive(data.active),
      side: isSide(data.side) ? data.side : "L",
      invite: data.invite === true,
      cooldown: isNumber(data.cooldown) ? Math.max(0, Math.floor(data.cooldown)) : 0
    };
  } catch {
    return null;
  }
}

export function loadStoredTimer(): StoredTimer | null {
  try {
    return readStoredTimer(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function serializeTimer(timer: StoredTimer) {
  return JSON.stringify({ v: 1, ...timer });
}

export function saveStoredTimer(timer: StoredTimer) {
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeTimer(timer));
  } catch {
    // Storage can be unavailable (private browsing, blocked site data); the timer still works for this visit.
  }
}

export type MilkPlace = "fridge" | "ice" | "freezer";
export type MilkCalculatorState = {
  place: MilkPlace;
  stored: number;
  interacted: boolean;
  dismissed: boolean;
};
export const MILK_STORAGE_KEY = "milk-storage-calculator-v1";
export const milkPlaces: MilkPlace[] = ["fridge", "ice", "freezer"];
const HOUR = 3_600_000;

export function defaultMilkCalculator(now: number): MilkCalculatorState {
  return { place: "fridge", stored: Math.floor(now / 60_000) * 60_000, interacted: false, dismissed: false };
}

// The approved calculator uses local calendar days and clamps calendar months at month-end.
export function milkStorageDeadline(place: MilkPlace, stored: number) {
  const date = new Date(stored);
  if (place === "freezer") {
    const day = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + 6);
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    date.setDate(Math.min(day, last));
  } else {
    date.setDate(date.getDate() + (place === "ice" ? 14 : 8));
  }
  return date.getTime();
}

export function milkStorageStatus(place: MilkPlace, stored: number, now: number) {
  const end = milkStorageDeadline(place, stored);
  const left = end - now;
  const passed = left <= 0;
  return { end, left, passed, soon: !passed && left <= (place === "freezer" ? 7 : 1) * 24 * HOUR, future: stored > now + 60_000 };
}

type DurationCopy = { days: string; dayHours: string; day: string; hours: string; minutes: string; justNow: string };
export function milkDuration(ms: number, copy: DurationCopy) {
  const minutes = Math.floor(Math.max(0, ms) / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days >= 2) return copy.days.replace("{count}", String(days));
  if (days === 1) return hours % 24 ? copy.dayHours.replace("{count}", String(hours % 24)) : copy.day;
  if (hours >= 1) return copy.hours.replace("{count}", String(hours));
  return minutes < 1 ? copy.justNow : copy.minutes.replace("{count}", String(minutes));
}

export function milkLocalInput(ms: number) {
  const date = new Date(ms);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
export function parseMilkLocalInput(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day, hours, minutes] = match.map(Number);
  const date = new Date(year, month - 1, day, hours, minutes);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && date.getHours() === hours && date.getMinutes() === minutes ? date.getTime() : null;
}
export function readMilkCalculator(raw: string | null, now: number): MilkCalculatorState | null {
  try {
    const data = JSON.parse(raw ?? "null");
    if (!data || data.v !== 1 || !milkPlaces.includes(data.place) || !Number.isFinite(data.stored) || data.stored > now || !Number.isFinite(new Date(data.stored).getTime())) return null;
    return { place: data.place, stored: data.stored, interacted: !!data.interacted, dismissed: !!data.dismissed };
  } catch { return null; }
}
export function serializeMilkCalculator(state: MilkCalculatorState) {
  return JSON.stringify({ v: 1, ...state });
}

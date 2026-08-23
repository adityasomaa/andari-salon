/**
 * Date helpers pinned to the salon's own timezone.
 *
 * A visitor in Jakarta, Tokyo or London must see the same "today" the salon
 * does, and the server must reject a past date using the salon's clock rather
 * than the server's. Everything here works on plain "YYYY-MM-DD" strings so
 * client and server can agree without shipping a date library.
 */

import { SITE } from "@/config/site";

export const DAY_NAMES_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
export const DAY_NAMES_LONG = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
];
export const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/** ISO date ("YYYY-MM-DD") for "now" in the salon's timezone. */
export function todayISO(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidISODate(value: string): boolean {
  const m = ISO_RE.exec(value);
  if (!m) return false;
  const [, y, mo, d] = m;
  const year = Number(y);
  const month = Number(mo);
  const day = Number(d);
  if (month < 1 || month > 12 || day < 1) return false;
  return day <= daysInMonth(year, month - 1);
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/** Day of week 0..6 (Sunday first) for an ISO date, timezone independent. */
export function weekdayOf(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Lexicographic comparison is correct for zero-padded ISO dates. */
export function isBefore(a: string, b: string): boolean {
  return a < b;
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(
    dt.getUTCDate(),
  ).padStart(2, "0")}`;
}

/** "Senin, 25 Agustus 2026" */
export function formatLongID(iso: string): string {
  if (!isValidISODate(iso)) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${DAY_NAMES_LONG[weekdayOf(iso)]}, ${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

/** "25 Agu 2026", for tight layouts. */
export function formatShortID(iso: string): string {
  if (!isValidISODate(iso)) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTH_NAMES[m - 1].slice(0, 3)} ${y}`;
}

export type CalendarCell = {
  iso: string;
  day: number;
  /** Belongs to the month being displayed rather than a neighbouring one. */
  inMonth: boolean;
  isToday: boolean;
  disabled: boolean;
};

/**
 * Six-row grid for a month, Monday first (Indonesian convention).
 * Always 42 cells so the popover never changes height between months.
 */
export function buildMonthGrid(
  year: number,
  monthIndex: number,
  opts: { min: string; max: string; today: string },
): CalendarCell[] {
  const firstOfMonth = new Date(Date.UTC(year, monthIndex, 1));
  // getUTCDay() is Sunday-first; shift so Monday is column 0.
  const leading = (firstOfMonth.getUTCDay() + 6) % 7;
  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i += 1) {
    const dt = new Date(Date.UTC(year, monthIndex, 1 - leading + i));
    const iso = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(
      dt.getUTCDate(),
    ).padStart(2, "0")}`;
    cells.push({
      iso,
      day: dt.getUTCDate(),
      inMonth: dt.getUTCMonth() === ((monthIndex % 12) + 12) % 12,
      isToday: iso === opts.today,
      disabled: iso < opts.min || iso > opts.max,
    });
  }
  return cells;
}

export function monthLabel(year: number, monthIndex: number): string {
  return `${MONTH_NAMES[((monthIndex % 12) + 12) % 12]} ${year}`;
}

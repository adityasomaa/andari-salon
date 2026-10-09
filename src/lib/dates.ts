/**
 * Date helpers pinned to the salon's own timezone.
 *
 * A visitor in Jakarta, Tokyo or London must see the same "today" the salon
 * does, and the server must reject a past date using the salon's clock rather
 * than the server's. Everything here works on plain "YYYY-MM-DD" strings so
 * client and server can agree without shipping a date library.
 *
 * Names are written out per language rather than taken from Intl, so the
 * server and the browser can never render a date differently and trip a
 * hydration mismatch.
 */

import type { Locale } from "@/config/i18n";
import { SITE } from "@/config/site";

const NAMES: Record<Locale, { days: string[]; weekHeader: string[]; months: string[] }> = {
  id: {
    days: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    // Monday first, matching the grid.
    weekHeader: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    months: [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ],
  },
  en: {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    weekHeader: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
  },
};

export function weekHeader(locale: Locale): string[] {
  return NAMES[locale].weekHeader;
}

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

/** "Senin, 25 Agustus 2026" / "Monday, 25 August 2026" */
export function formatLong(iso: string, locale: Locale): string {
  if (!isValidISODate(iso)) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const n = NAMES[locale];
  return `${n.days[weekdayOf(iso)]}, ${d} ${n.months[m - 1]} ${y}`;
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
 * Six-row grid for a month, Monday first (Indonesian convention, kept for
 * English too so the calendar does not change shape between languages).
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

export function monthLabel(year: number, monthIndex: number, locale: Locale): string {
  return `${NAMES[locale].months[((monthIndex % 12) + 12) % 12]} ${year}`;
}

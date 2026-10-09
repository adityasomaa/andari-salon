"use client";

/**
 * Custom date field. No `<input type="date">` anywhere.
 *
 * Behaviour the brief calls out specifically:
 *   - the calendar opens from a click anywhere on the field, not just an icon
 *   - past dates are refused, and the same rule runs again on the server
 *   - the popover is portalled, so an `overflow: hidden` ancestor cannot clip it
 *   - it sits on the shared `--z-popover` token, never a raw z-index
 *   - it holds a scroll lock while open and releases it on close, which is
 *     also what pauses Lenis
 *
 * Keyboard follows the grid pattern: arrows move a day at a time, PageUp and
 * PageDown move a month, Home and End jump to the ends of the week, Enter or
 * Space commits, Escape closes and returns focus to the field.
 */

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BOOKING_WINDOW_DAYS } from "@/config/services";
import { useClientValue } from "@/lib/use-client-value";
import {
  addDaysISO,
  buildMonthGrid,
  formatLong,
  monthLabel,
  todayISO,
  weekHeader,
} from "@/lib/dates";
import { cn } from "@/lib/utils";

import { useCopy, useLocale } from "./locale-context";
import { useTemplate } from "./template-context";
import { useScrollLock, useUIState } from "./ui-state";

type Props = {
  id: string;
  value: string | null;
  onChange: (iso: string) => void;
  placeholder: string;
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
};

const POPOVER_ID_PREFIX = "datepicker:";

export function DatePicker({
  id,
  value,
  onChange,
  placeholder,
  labelledBy,
  describedBy,
  invalid,
}: Props) {
  const popoverId = `${POPOVER_ID_PREFIX}${id}`;
  const template = useTemplate();
  const locale = useLocale();
  const T = useCopy().datePicker;
  const { requestPopover, closePopover, openPopover, menuOpen } = useUIState();

  const [wantOpen, setWantOpen] = useState(false);
  // Resolved in the timezone of the salon. useSyncExternalStore rather than an
  // effect, so the server pass and the first client pass agree and there is no
  // extra render just to learn what the date is.
  const today = useClientValue(() => todayISO(), todayISO());
  const [cursor, setCursor] = useState<string>(value ?? today);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; drop: "down" | "up" } | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Derived from the shared UI state, so the mobile menu or another popup
  // taking over closes this one without an effect.
  const open = wantOpen && openPopover === popoverId && !menuOpen;

  useScrollLock(open);

  // Portals need a DOM target, so nothing renders through createPortal on
  // the server pass.
  const mounted = useClientValue(() => true, false);

  const min = today;
  const max = useMemo(() => addDaysISO(today, BOOKING_WINDOW_DAYS), [today]);

  const [year, monthIndex] = useMemo(() => {
    const [y, m] = cursor.split("-").map(Number);
    return [y, m - 1] as const;
  }, [cursor]);

  const cells = useMemo(
    () => buildMonthGrid(year, monthIndex, { min, max, today }),
    [year, monthIndex, min, max, today],
  );

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const panelH = 400;
    const below = window.innerHeight - r.bottom;
    const drop: "down" | "up" = below < panelH && r.top > below ? "up" : "down";
    const width = Math.min(Math.max(r.width, 320), window.innerWidth - 24);
    let left = r.left;
    // Keep the panel inside the viewport. Without this it is the single most
    // reliable way to create a horizontal scrollbar on a 375px screen.
    if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
    if (left < 12) left = 12;
    setRect({ top: drop === "down" ? r.bottom + 8 : r.top - 8, left, width, drop });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    const sync = () => place();
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [open, place]);

  const openCalendar = useCallback(() => {
    if (menuOpen) return;
    const start = value && value >= min && value <= max ? value : min;
    setCursor(start);
    requestPopover(popoverId);
    setWantOpen(true);
  }, [menuOpen, value, min, max, requestPopover, popoverId]);

  const close = useCallback(
    (refocus = true) => {
      setWantOpen(false);
      closePopover(popoverId);
      if (refocus) triggerRef.current?.focus();
    },
    [closePopover, popoverId],
  );

  // Move focus into the grid so arrow keys work straight away.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      gridRef.current?.querySelector<HTMLElement>('[data-focus="true"]')?.focus();
    }, 20);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      close(false);
    };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, [open, close]);

  const clampCursor = useCallback(
    (iso: string) => {
      if (iso < min) return min;
      if (iso > max) return max;
      return iso;
    },
    [min, max],
  );

  function onGridKeyDown(e: React.KeyboardEvent) {
    const map: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    if (e.key in map) {
      e.preventDefault();
      setCursor((c) => clampCursor(addDaysISO(c, map[e.key])));
      return;
    }
    if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      const dir = e.key === "PageUp" ? -1 : 1;
      const [y, m, d] = cursor.split("-").map(Number);
      const next = new Date(Date.UTC(y, m - 1 + dir, Math.min(d, 28)));
      setCursor(
        clampCursor(
          `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(
            next.getUTCDate(),
          ).padStart(2, "0")}`,
        ),
      );
      return;
    }
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const dow = (new Date(`${cursor}T00:00:00Z`).getUTCDay() + 6) % 7;
      setCursor(clampCursor(addDaysISO(cursor, e.key === "Home" ? -dow : 6 - dow)));
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (cursor >= min && cursor <= max) {
        onChange(cursor);
        close();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  const canPrev = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01` > min;
  const canNext = `${year}-${String(monthIndex + 1).padStart(2, "0")}-28` < max;

  function shiftMonth(dir: number) {
    const next = new Date(Date.UTC(year, monthIndex + dir, 1));
    const iso = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-01`;
    setCursor(clampCursor(iso));
  }

  const panel =
    mounted && rect
      ? createPortal(
          <AnimatePresence>
            {open ? (
              <motion.div
                ref={panelRef}
                data-template={template?.key}
                role="dialog"
                aria-modal="false"
                aria-label={T.dialog}
                initial={{ opacity: 0, y: rect.drop === "down" ? -8 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: rect.drop === "down" ? -6 : 6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="fixed p-4 shadow-[0_24px_60px_-24px_rgba(20,20,15,0.5)]"
                style={{
                  zIndex: "var(--z-popover)",
                  top: rect.drop === "down" ? rect.top : undefined,
                  bottom: rect.drop === "up" ? window.innerHeight - rect.top : undefined,
                  left: rect.left,
                  width: rect.width,
                  background: "var(--t-surface)",
                  border: "1px solid var(--t-line-strong)",
                  borderRadius: "var(--t-radius-sm)",
                }}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <NavBtn
                    label={T.prev}
                    disabled={!canPrev}
                    onClick={() => shiftMonth(-1)}
                    dir="prev"
                  />
                  <div aria-live="polite" className="text-[length:var(--t-small)] font-medium">
                    {monthLabel(year, monthIndex, locale)}
                  </div>
                  <NavBtn
                    label={T.next}
                    disabled={!canNext}
                    onClick={() => shiftMonth(1)}
                    dir="next"
                  />
                </div>

                <div className="mb-1 grid grid-cols-7 gap-0.5">
                  {weekHeader(locale).map((d) => (
                    <div
                      key={d}
                      aria-hidden
                      className="py-1 text-center text-[0.68rem] tracking-[0.08em] uppercase"
                      style={{ color: "var(--t-fg-faint)" }}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                <div
                  ref={gridRef}
                  role="grid"
                  aria-label={monthLabel(year, monthIndex, locale)}
                  onKeyDown={onGridKeyDown}
                  className="grid grid-cols-7 gap-0.5"
                >
                  {cells.map((cell) => {
                    const isCursor = cell.iso === cursor;
                    const isSelected = cell.iso === value;
                    return (
                      <button
                        key={cell.iso}
                        type="button"
                        role="gridcell"
                        data-focus={isCursor || undefined}
                        data-iso={cell.iso}
                        aria-selected={isSelected}
                        aria-current={cell.isToday ? "date" : undefined}
                        aria-label={formatLong(cell.iso, locale)}
                        disabled={cell.disabled}
                        tabIndex={isCursor ? 0 : -1}
                        onClick={() => {
                          onChange(cell.iso);
                          close();
                        }}
                        onFocus={() => setCursor(cell.iso)}
                        className={cn(
                          "relative flex aspect-square min-h-9 items-center justify-center text-[0.9rem] transition-colors",
                          cell.disabled && "cursor-not-allowed opacity-30",
                          !cell.inMonth && !cell.disabled && "opacity-45",
                        )}
                        style={{
                          borderRadius: "var(--t-radius-sm)",
                          background: isSelected
                            ? "var(--t-accent)"
                            : isCursor
                              ? "var(--t-accent-soft)"
                              : "transparent",
                          color: isSelected ? "var(--t-accent-fg)" : "var(--t-fg)",
                          fontWeight: isSelected || cell.isToday ? 500 : 400,
                        }}
                      >
                        {cell.day}
                        {cell.isToday && !isSelected ? (
                          <span
                            aria-hidden
                            className="absolute bottom-1 size-1 rounded-full"
                            style={{ background: "var(--t-accent)" }}
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                <p
                  className="mt-3 text-[0.75rem] leading-relaxed"
                  style={{ color: "var(--t-fg-faint)" }}
                >
                  {T.unavailableBefore(formatLong(min, locale))}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${labelledBy} ${id}`}
        aria-describedby={describedBy}
        // aria-invalid is not a supported attribute on role=button. The error
        // is already announced through aria-describedby; data-invalid only
        // drives the border colour.
        data-invalid={invalid || undefined}
        // The whole field is the trigger, not a small icon inside it.
        onClick={() => (open ? close() : openCalendar())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!open) openCalendar();
          }
        }}
        className="t-field flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <CalendarIcon />
          <span
            className="truncate"
            style={{ color: value ? "var(--t-fg)" : "var(--t-fg-faint)" }}
          >
            {value ? formatLong(value, locale) : placeholder}
          </span>
        </span>
      </button>
      {panel}
    </>
  );
}

function NavBtn({
  label,
  onClick,
  disabled,
  dir,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  dir: "prev" | "next";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-9 items-center justify-center transition-opacity disabled:opacity-30"
      style={{ border: "1px solid var(--t-line)", borderRadius: "var(--t-radius-sm)" }}
    >
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className="size-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        style={{ transform: dir === "next" ? "rotate(180deg)" : undefined }}
      >
        <path d="M7.5 2.5 4 6l3.5 3.5" />
      </svg>
    </button>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      style={{ color: "var(--t-fg-faint)" }}
    >
      <rect x="2" y="3.5" width="12" height="10.5" rx="1" />
      <path d="M2 6.5h12M5.5 2v3M10.5 2v3" />
    </svg>
  );
}



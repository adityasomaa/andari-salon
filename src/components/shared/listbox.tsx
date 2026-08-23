"use client";

/**
 * A real ARIA listbox, not a styled `<select>`.
 *
 * Implements the collapsed-listbox pattern in full:
 *   ArrowUp / ArrowDown   move the active option, opening if closed
 *   Home / End            jump to first / last enabled option
 *   printable characters  type-ahead over option labels, with a 700ms buffer
 *   Enter / Space         commit the active option
 *   Escape                close without committing, focus returns to trigger
 *   Tab                   close and let focus move on
 *   click outside         close
 *
 * The popup is portalled to <body> so a parent with `overflow: hidden` cannot
 * clip it, it sits on the shared `--z-popover` token, and it holds a scroll
 * lock while open, which is also what pauses Lenis.
 */

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useClientValue } from "@/lib/use-client-value";
import { cn } from "@/lib/utils";

import { useTemplate } from "./template-context";
import { useScrollLock, useUIState } from "./ui-state";

export type ListboxOption = {
  value: string;
  label: string;
  /** Optional second line, e.g. the category a service belongs to. */
  meta?: string;
  disabled?: boolean;
};

export type ListboxGroup = {
  label: string;
  options: ListboxOption[];
};

type Props = {
  id: string;
  value: string | null;
  onChange: (value: string) => void;
  groups: ListboxGroup[];
  placeholder: string;
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
  className?: string;
  /** Rendered inside the trigger before the label. */
  icon?: React.ReactNode;
};

function flatten(groups: ListboxGroup[]): ListboxOption[] {
  return groups.flatMap((g) => g.options);
}

export function Listbox({
  id,
  value,
  onChange,
  groups,
  placeholder,
  labelledBy,
  describedBy,
  invalid,
  className,
  icon,
}: Props) {
  const options = flatten(groups);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const [wantOpen, setWantOpen] = useState(false);
  const [active, setActive] = useState(Math.max(0, selectedIndex));
  const [rect, setRect] = useState<{ top: number; left: number; width: number; drop: "down" | "up" } | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ buffer: "", at: 0 });
  const listId = `${id}-listbox`;
  const reactId = useId();

  const template = useTemplate();
  const { requestPopover, closePopover, openPopover, menuOpen } = useUIState();

  // Derived rather than synced. The shared UI state is the single source of
  // truth for which popup owns the screen, so another popup or the mobile menu
  // opening closes this one with no effect round trip.
  const open = wantOpen && openPopover === id && !menuOpen;

  useScrollLock(open);

  // Portals need a DOM target, so nothing renders through createPortal on
  // the server pass.
  const mounted = useClientValue(() => true, false);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const below = window.innerHeight - r.bottom;
    const drop: "down" | "up" = below < 260 && r.top > below ? "up" : "down";
    setRect({
      top: drop === "down" ? r.bottom + 8 : r.top - 8,
      left: r.left,
      width: r.width,
      drop,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    const onScrollOrResize = () => place();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, place]);

  const openList = useCallback(
    (startAt?: number) => {
      if (menuOpen) return; // never open behind the mobile menu
      requestPopover(id);
      setActive(startAt ?? (selectedIndex >= 0 ? selectedIndex : firstEnabled(options)));
      setWantOpen(true);
    },
    [menuOpen, requestPopover, id, selectedIndex, options],
  );

  const close = useCallback(
    (refocus = true) => {
      setWantOpen(false);
      closePopover(id);
      if (refocus) triggerRef.current?.focus();
    },
    [closePopover, id],
  );

  const commit = useCallback(
    (index: number) => {
      const opt = options[index];
      if (!opt || opt.disabled) return;
      onChange(opt.value);
      close();
    },
    [options, onChange, close],
  );

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (listRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      close(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open, close]);

  function move(delta: number) {
    setActive((cur) => step(options, cur, delta));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else move(1);
        return;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList(lastEnabled(options));
        else move(-1);
        return;
      case "Home":
        if (!open) return;
        e.preventDefault();
        setActive(firstEnabled(options));
        return;
      case "End":
        if (!open) return;
        e.preventDefault();
        setActive(lastEnabled(options));
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!open) openList();
        else commit(active);
        return;
      case "Escape":
        if (open) {
          e.preventDefault();
          close();
        }
        return;
      case "Tab":
        if (open) close(false);
        return;
      default:
        break;
    }

    // Type-ahead over the visible labels.
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now();
      const state = typeahead.current;
      state.buffer = now - state.at > 700 ? e.key : state.buffer + e.key;
      state.at = now;
      const needle = state.buffer.toLowerCase();
      const from = open ? active : selectedIndex;
      const found = searchFrom(options, needle, from);
      if (found >= 0) {
        e.preventDefault();
        if (!open) {
          onChange(options[found].value);
        } else {
          setActive(found);
        }
      }
    }
  }

  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  const popup =
    mounted && rect
      ? createPortal(
          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{ opacity: 0, y: rect.drop === "down" ? -6 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: rect.drop === "down" ? -4 : 4 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                // Portalled out of the page tree, so it re-declares the template
                // scope in order to inherit the right --t-* tokens.
                data-template={template?.key}
                className="fixed"
                style={{
                  zIndex: "var(--z-popover)",
                  top: rect.drop === "down" ? rect.top : undefined,
                  bottom: rect.drop === "up" ? window.innerHeight - rect.top : undefined,
                  left: rect.left,
                  width: rect.width,
                }}
              >
                <ul
                  ref={listRef}
                  id={listId}
                  role="listbox"
                  aria-labelledby={labelledBy}
                  tabIndex={-1}
                  className="max-h-[min(22rem,60svh)] overflow-y-auto py-1 shadow-[0_18px_50px_-20px_rgba(43,42,32,0.45)]"
                  style={{
                    background: "var(--t-surface)",
                    border: "1px solid var(--t-line-strong)",
                    borderRadius: "var(--t-radius-sm)",
                  }}
                >
                  {groups.map((group, gi) => {
                    const offset = groups.slice(0, gi).reduce((n, g) => n + g.options.length, 0);
                    return (
                      <li key={group.label} role="presentation">
                        {groups.length > 1 ? (
                          <div
                            role="presentation"
                            className="t-label px-4 pt-3 pb-1.5"
                            style={{ color: "var(--t-fg-faint)" }}
                          >
                            {group.label}
                          </div>
                        ) : null}
                        <ul role="group" aria-label={group.label}>
                          {group.options.map((opt, oi) => {
                            const index = offset + oi;
                            const isActive = index === active;
                            const isSelected = opt.value === value;
                            return (
                              <li
                                key={opt.value}
                                id={`${reactId}-opt-${index}`}
                                role="option"
                                data-index={index}
                                aria-selected={isSelected}
                                aria-disabled={opt.disabled || undefined}
                                onPointerEnter={() => !opt.disabled && setActive(index)}
                                onClick={() => commit(index)}
                                className={cn(
                                  "cursor-pointer px-4 py-2.5 text-[length:var(--t-body)] leading-snug",
                                  opt.disabled && "cursor-not-allowed opacity-50",
                                )}
                                style={{
                                  background: isActive ? "var(--t-accent-soft)" : "transparent",
                                  color: isSelected ? "var(--t-fg)" : "var(--t-fg-muted)",
                                  fontWeight: isSelected ? 500 : 400,
                                }}
                              >
                                <span className="flex items-center justify-between gap-3">
                                  <span>{opt.label}</span>
                                  {isSelected ? <Tick /> : null}
                                </span>
                                {opt.meta ? (
                                  <span
                                    className="mt-0.5 block text-[0.78em]"
                                    style={{ color: "var(--t-fg-faint)" }}
                                  >
                                    {opt.meta}
                                  </span>
                                ) : null}
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
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
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        // Focus stays on the trigger while the popup is open, so the active
        // option has to be announced from here, not from the listbox.
        aria-activedescendant={open ? `${reactId}-opt-${active}` : undefined}
        aria-labelledby={`${labelledBy} ${id}`}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        data-invalid={invalid || undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className={cn("t-field flex items-center justify-between gap-3 text-left", className)}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {icon}
          <span
            className="truncate"
            style={{ color: selected ? "var(--t-fg)" : "var(--t-fg-faint)" }}
          >
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <Chevron open={open} />
      </button>
      {popup}
    </>
  );
}

/* ------------------------------------------------------------- helpers */

function firstEnabled(options: ListboxOption[]) {
  const i = options.findIndex((o) => !o.disabled);
  return i < 0 ? 0 : i;
}
function lastEnabled(options: ListboxOption[]) {
  for (let i = options.length - 1; i >= 0; i -= 1) if (!options[i].disabled) return i;
  return 0;
}
function step(options: ListboxOption[], from: number, delta: number) {
  let i = from;
  for (let n = 0; n < options.length; n += 1) {
    i = Math.min(options.length - 1, Math.max(0, i + delta));
    if (!options[i].disabled) return i;
    if (i === 0 || i === options.length - 1) break;
  }
  return from;
}
function searchFrom(options: ListboxOption[], needle: string, from: number) {
  if (!needle) return -1;
  const n = options.length;
  for (let k = 1; k <= n; k += 1) {
    const i = (from + k + n) % n;
    const o = options[i];
    if (!o.disabled && o.label.toLowerCase().startsWith(needle)) return i;
  }
  return -1;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className="size-3 shrink-0 transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : undefined, color: "var(--t-fg-faint)" }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

function Tick() {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 6.4 4.7 9 10 3.4" />
    </svg>
  );
}

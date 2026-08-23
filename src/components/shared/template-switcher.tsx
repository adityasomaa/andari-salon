"use client";

/**
 * Floating preview control for jumping between the three templates.
 *
 * This is scaffolding, not part of any design. It is rendered only while
 * PREVIEW_MODE is true in src/config/preview.ts; flipping that one flag
 * removes it from every page.
 *
 * Placement rules it has to respect:
 *   - it sits on `--z-template-switcher`, above the sticky header and below
 *     the mobile menu
 *   - it anchors bottom-right and the primary booking CTA never lives there,
 *     so it cannot cover the main action
 *   - collapsed it is a single 48px target; the expanded panel is width-capped
 *     to the viewport so it cannot widen the page at 375px
 *   - `pointer-events` is off on the wrapper and only on for the control
 *     itself, so it never swallows taps meant for the page behind it
 */

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { COPY } from "@/config/copy";
import { PREVIEW_MODE } from "@/config/preview";
import { TEMPLATES } from "@/config/site";
import { cn } from "@/lib/utils";

import { useTransition } from "./page-transition";
import { useTemplate } from "./template-context";
import { useUIState } from "./ui-state";

export function TemplateSwitcher() {
  const template = useTemplate();
  const pathname = usePathname();
  const { menuOpen } = useUIState();
  const { go } = useTransition();
  const [wantOpen, setWantOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Derived: the mobile menu owns the screen while it is open.
  const open = wantOpen && !menuOpen;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setWantOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setWantOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown, true);
    };
  }, [open]);

  if (!PREVIEW_MODE || menuOpen) return null;

  /** Same sub-page on the other template, so comparison stays like for like. */
  const subPath = template ? pathname.slice(template.base.length) : "";

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed right-3 bottom-3 flex flex-col items-end gap-2 sm:right-5 sm:bottom-5"
      style={{ zIndex: "var(--z-template-switcher)" }}
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-[min(17rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl p-2 shadow-[0_20px_50px_-22px_rgba(20,20,15,0.6)]"
            style={{
              background: "#14140f",
              color: "#edeae5",
              border: "1px solid rgba(182,179,156,0.28)",
            }}
          >
            <p className="px-3 pt-2 pb-1 text-[0.625rem] tracking-[0.28em] text-[#b6b39c] uppercase">
              {COPY.switcher.label}
            </p>
            <ul className="grid gap-0.5">
              {TEMPLATES.map((t) => {
                const active = template?.id === t.id;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setWantOpen(false);
                        go(`${t.href}${subPath}`);
                      }}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                        active ? "bg-[#26251d]" : "hover:bg-[#1c1c16]",
                      )}
                    >
                      <span className="text-[0.7rem] tracking-[0.18em] text-[#b6b39c] tabular-nums">
                        {t.number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.85rem]">{t.name}</span>
                      </span>
                      {active ? (
                        <span className="size-1.5 shrink-0 rounded-full bg-[#b6b39c]" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="px-3 pt-1.5 pb-2 text-[0.7rem] leading-relaxed text-[#999678]">
              {COPY.switcher.hint}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setWantOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? COPY.switcher.close : COPY.switcher.open}
        className="pointer-events-auto flex h-12 items-center gap-2 rounded-full px-4 shadow-[0_14px_32px_-16px_rgba(20,20,15,0.7)] transition-transform active:translate-y-px"
        style={{
          background: "#14140f",
          color: "#edeae5",
          border: "1px solid rgba(182,179,156,0.28)",
        }}
      >
        <span className="text-[0.7rem] tracking-[0.2em] tabular-nums">
          {template?.number ?? "00"}
        </span>
        <span aria-hidden className="h-3 w-px bg-[rgba(182,179,156,0.35)]" />
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        >
          <rect x="1.5" y="2.5" width="5" height="11" rx="0.5" />
          <rect x="9.5" y="2.5" width="5" height="11" rx="0.5" />
        </svg>
      </button>
    </div>
  );
}

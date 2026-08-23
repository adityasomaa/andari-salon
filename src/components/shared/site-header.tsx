"use client";

/**
 * Sticky header and mobile menu, one implementation with three layouts.
 *
 *   t1  wordmark left, nav pushed to the far right, hairline underline, no fill
 *   t2  wordmark left, nav in a rounded pill, filled booking button
 *   t3  wordmark centred at rest, nav split either side, wide tracking
 *
 * Desktop nav is always a single line and the bar is capped at 72px.
 * Opening the mobile menu closes every popover, which is what guarantees the
 * calendar can never appear over the menu.
 */

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { COPY } from "@/config/copy";
import { NAV } from "@/config/site";
import { cn } from "@/lib/utils";

import { Wordmark } from "./logo";
import { TransitionLink, useTransition } from "./page-transition";
import { useTemplate } from "./template-context";
import { useScrollLock, useUIState } from "./ui-state";
import { WhatsAppLink } from "./whatsapp-link";

export function SiteHeader() {
  const template = useTemplate();
  const key = template?.key ?? "t1";
  const base = template?.base ?? "";
  const pathname = usePathname();
  const { menuOpen, setMenuOpen } = useUIState();
  const { go } = useTransition();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useScrollLock(menuOpen);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      // Focus trap while the menu owns the screen.
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    }, 120);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [menuOpen, setMenuOpen]);

  const items = NAV.map((n) => ({
    ...n,
    href: `${base}${n.href}`,
    current: n.href === "" ? pathname === base : pathname === `${base}${n.href}`,
  }));

  const tone = key === "t3" ? "bone" : "olive";

  return (
    <>
      <header
        className="sticky top-0 w-full"
        style={{
          zIndex: "var(--z-sticky-header)",
          background: key === "t3" ? "rgba(20,20,15,0.82)" : "rgba(251,250,247,0.82)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--t-line)",
        }}
      >
        <div
          className={cn(
            "t-shell flex h-[64px] items-center gap-4 lg:h-[72px]",
            key === "t3" ? "justify-between" : "justify-between",
          )}
        >
          {/* t3 splits the nav either side of a centred wordmark. */}
          {key === "t3" ? (
            <nav aria-label={COPY.nav.menuLabel} className="hidden flex-1 lg:block">
              <ul className="flex items-center gap-8">
                {items.slice(0, 2).map((item) => (
                  <NavItem key={item.key} item={item} variant={key} />
                ))}
              </ul>
            </nav>
          ) : null}

          <TransitionLink
            href={base || "/"}
            className={cn("shrink-0", key === "t3" && "lg:mx-auto")}
            aria-label={`${COPY.brand.logoAlt}, beranda`}
          >
            <Wordmark tone={tone} width={key === "t2" ? 132 : 150} className="w-[112px] sm:w-[132px] lg:w-[150px]" priority />
          </TransitionLink>

          {key === "t3" ? (
            <nav aria-label="" className="hidden flex-1 justify-end lg:flex">
              <ul className="flex items-center gap-8">
                {items.slice(2).map((item) => (
                  <NavItem key={item.key} item={item} variant={key} />
                ))}
              </ul>
            </nav>
          ) : (
            <nav aria-label={COPY.nav.menuLabel} className="hidden lg:block">
              <ul
                className={cn(
                  "flex items-center",
                  key === "t1" ? "gap-10" : "gap-1 rounded-full px-2 py-1.5",
                )}
                style={
                  key === "t2"
                    ? { background: "var(--t-accent-soft)" }
                    : undefined
                }
              >
                {items.map((item) => (
                  <NavItem key={item.key} item={item} variant={key} />
                ))}
              </ul>
            </nav>
          )}

          <div className="flex items-center gap-2">
            {key === "t2" ? (
              <WhatsAppLink
                className="t-btn t-btn-primary hidden !min-h-11 !px-5 !py-2.5 lg:inline-flex"
                buttonLabel="WhatsApp di header"
              >
                WhatsApp
              </WhatsAppLink>
            ) : null}

            <button
              ref={toggleRef}
              type="button"
              className="flex size-11 items-center justify-center lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? COPY.nav.close : COPY.nav.open}
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                border: key === "t1" ? "none" : "1px solid var(--t-line-strong)",
                borderRadius: "var(--t-radius-pill)",
              }}
            >
              <Burger open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={COPY.nav.menuLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 flex flex-col lg:hidden"
            style={{ zIndex: "var(--z-mobile-menu)", background: "var(--t-bg)" }}
          >
            <div className="t-shell flex h-[64px] shrink-0 items-center justify-between">
              <Wordmark tone={tone} width={112} className="w-[112px]" />
              <button
                type="button"
                className="flex size-11 items-center justify-center"
                aria-label={COPY.nav.close}
                onClick={() => {
                  setMenuOpen(false);
                  toggleRef.current?.focus();
                }}
                style={{ border: "1px solid var(--t-line-strong)", borderRadius: "var(--t-radius-pill)" }}
              >
                <Burger open />
              </button>
            </div>

            <nav aria-label={COPY.nav.menuLabel} className="t-shell flex-1 overflow-y-auto pt-4 pb-10">
              <ul className="grid">
                {items.map((item, i) => (
                  <motion.li
                    key={item.key}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.34, delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    style={{ borderBottom: "1px solid var(--t-line)" }}
                  >
                    <a
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.button !== 0) return;
                        e.preventDefault();
                        setMenuOpen(false);
                        go(item.href);
                      }}
                      className="flex items-baseline justify-between gap-4 py-5"
                    >
                      <span
                        className="text-[clamp(1.6rem,7vw,2.4rem)] leading-tight"
                        style={{
                          fontWeight: item.current ? 500 : 300,
                          color: item.current ? "var(--t-fg)" : "var(--t-fg-muted)",
                        }}
                      >
                        {item.label}
                      </span>
                      <span className="t-label tabular-nums">{`0${i + 1}`}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-8"
              >
                <WhatsAppLink
                  className="t-btn t-btn-primary w-full"
                  buttonLabel="WhatsApp di menu"
                  onClick={() => setMenuOpen(false)}
                >
                  Hubungi lewat WhatsApp
                </WhatsAppLink>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  item,
  variant,
}: {
  item: { href: string; label: string; current: boolean };
  variant: "t1" | "t2" | "t3";
}) {
  return (
    <li>
      <TransitionLink
        href={item.href}
        aria-current={item.current ? "page" : undefined}
        className={cn(
          "relative inline-flex items-center transition-colors",
          variant === "t1" && "py-2 text-[0.8125rem] tracking-[0.12em] uppercase",
          variant === "t2" && "rounded-full px-4 py-2 text-[0.9rem]",
          variant === "t3" && "py-2 text-[0.7rem] tracking-[0.24em] uppercase",
        )}
        style={{
          color: item.current ? "var(--t-fg)" : "var(--t-fg-muted)",
          fontWeight: item.current ? 500 : 400,
          background: variant === "t2" && item.current ? "var(--t-surface)" : undefined,
        }}
      >
        {item.label}
        {variant !== "t2" && item.current ? (
          <span
            aria-hidden
            className="absolute inset-x-0 -bottom-0.5 h-px"
            style={{ background: "var(--t-fg)" }}
          />
        ) : null}
      </TransitionLink>
    </li>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-3 w-5">
      <span
        className="absolute left-0 block h-px w-full transition-transform duration-300"
        style={{
          background: "currentColor",
          top: open ? "50%" : 0,
          transform: open ? "rotate(45deg)" : "none",
        }}
      />
      <span
        className="absolute left-0 block h-px w-full transition-transform duration-300"
        style={{
          background: "currentColor",
          bottom: open ? "50%" : 0,
          transform: open ? "rotate(-45deg)" : "none",
        }}
      />
    </span>
  );
}

"use client";

/**
 * Sticky header and mobile menu.
 *
 * Wordmark left, nav in a rounded pill, then the language switch and a filled
 * Booking button that opens WhatsApp with the booking greeting.
 *
 * Desktop nav is always a single line and the bar is capped at 72px.
 * Opening the mobile menu closes every popover, which is what guarantees the
 * calendar can never appear over the menu.
 */

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { href } from "@/config/i18n";

import { LanguageSwitch } from "./language-switch";
import { useCopy, useLocale } from "./locale-context";
import { Wordmark } from "./logo";
import { TransitionLink, useTransition } from "./page-transition";
import { useScrollLock, useUIState } from "./ui-state";
import { WhatsAppLink } from "./whatsapp-link";

export function SiteHeader() {
  const copy = useCopy();
  const locale = useLocale();
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

  const items = copy.nav.items.map((n) => {
    const target = href(n.key, locale);
    return { ...n, href: target, current: pathname === target };
  });

  return (
    <>
      <header
        className="sticky top-0 w-full"
        style={{
          zIndex: "var(--z-sticky-header)",
          background: "rgba(251,250,247,0.82)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--t-line)",
        }}
      >
        <div className="t-shell flex h-[64px] items-center justify-between gap-3 lg:h-[72px]">
          <TransitionLink href={href("home", locale)} className="shrink-0" aria-label={copy.nav.homeAria}>
            <Wordmark tone="olive" width={132} className="w-[112px] sm:w-[132px] xl:w-[150px]" priority />
          </TransitionLink>

          <nav aria-label={copy.nav.menuLabel} className="hidden lg:block">
            <ul
              className="flex items-center gap-0.5 rounded-full px-1.5 py-1.5 xl:gap-1 xl:px-2"
              style={{ background: "var(--t-accent-soft)" }}
            >
              {items.map((item) => (
                <li key={item.key}>
                  <TransitionLink
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className="relative inline-flex items-center rounded-full px-3 py-2 text-[0.88rem] whitespace-nowrap transition-colors xl:px-4 xl:text-[0.9rem]"
                    style={{
                      color: item.current ? "var(--t-fg)" : "var(--t-fg-muted)",
                      fontWeight: item.current ? 500 : 400,
                      background: item.current ? "var(--t-surface)" : undefined,
                    }}
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitch />

            <WhatsAppLink
              intent="booking"
              className="t-btn t-btn-primary hidden !min-h-11 !px-5 !py-2.5 lg:inline-flex"
            >
              {copy.nav.booking}
            </WhatsAppLink>

            <button
              ref={toggleRef}
              type="button"
              className="flex size-11 items-center justify-center lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? copy.nav.close : copy.nav.open}
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                border: "1px solid var(--t-line-strong)",
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
            aria-label={copy.nav.menuLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 flex flex-col lg:hidden"
            style={{ zIndex: "var(--z-mobile-menu)", background: "var(--t-bg)" }}
          >
            <div className="t-shell flex h-[64px] shrink-0 items-center justify-between gap-3">
              <Wordmark tone="olive" width={112} className="w-[112px]" />
              <div className="flex items-center gap-2">
                <LanguageSwitch />
                <button
                  type="button"
                  className="flex size-11 items-center justify-center"
                  aria-label={copy.nav.close}
                  onClick={() => {
                    setMenuOpen(false);
                    toggleRef.current?.focus();
                  }}
                  style={{ border: "1px solid var(--t-line-strong)", borderRadius: "var(--t-radius-pill)" }}
                >
                  <Burger open />
                </button>
              </div>
            </div>

            <nav aria-label={copy.nav.menuLabel} className="t-shell flex-1 overflow-y-auto pt-4 pb-10">
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
                      className="flex items-baseline justify-between gap-4 py-5 short:py-3.5"
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
                  intent="booking"
                  className="t-btn t-btn-primary w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  {copy.nav.bookingLong}
                </WhatsAppLink>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
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

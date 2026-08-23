"use client";

/**
 * Cookie consent that actually gates something.
 *
 * There is no third-party analytics on this site, so the thing being gated is
 * a first-party page-view ping to /api/pageview. It fires only while
 * `analytics` consent is granted, stops the moment consent is withdrawn, and
 * the footer link reopens the panel so a choice can be changed.
 *
 * Layering: it uses `--z-cookie`, which sits above popovers and below the skip
 * link, and it hides itself entirely while the mobile menu is open so it can
 * neither cover the menu nor swallow taps meant for the floating controls.
 */

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { COPY } from "@/config/copy";
import { LEGAL_NAV, TEMPLATES } from "@/config/site";
import { templateInfo } from "@/lib/template";
import { makeCachedSnapshot, useClientValue } from "@/lib/use-client-value";
import { cn } from "@/lib/utils";

import { useUIState } from "./ui-state";

/**
 * The panel lives above the template tree, in the root layout, so it cannot
 * read the template React context. It derives the scope from the URL instead,
 * which is where the template identity already lives, and falls back to t1 on
 * the chooser and the legal pages.
 */
function useTemplateScope(): "t1" | "t2" | "t3" {
  const pathname = usePathname();
  const match = TEMPLATES.find((t) => pathname.startsWith(t.href));
  return match ? templateInfo(match.id).key : "t1";
}

const STORE_KEY = "andari.cookie-consent.v1";

export type Consent = { necessary: true; analytics: boolean; at: string };

type Api = {
  consent: Consent | null;
  open: () => void;
  set: (analytics: boolean) => void;
};

const Ctx = createContext<Api | null>(null);

export function useCookieConsent(): Api {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCookieConsent must be used inside CookieConsentProvider");
  return ctx;
}

function read(): Consent | null {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (typeof parsed?.analytics !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Cached so useSyncExternalStore sees a stable reference between renders. */
const storedConsent = makeCachedSnapshot(read);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  // Read from storage without an effect, then held in state so that choosing
  // an option updates the tree immediately.
  const initial = useClientValue(() => storedConsent.get(), null);
  const [chosen, setChosen] = useState<Consent | null>(null);
  const consent = chosen ?? initial;

  const [panelOpen, setPanelOpen] = useState(false);
  // The panel is client-only: it depends on localStorage, so rendering it on
  // the server would flash the wrong state.
  const hydrated = useClientValue(() => true, false);

  useEffect(() => {
    if (storedConsent.get()) return;
    // Let the entry loader finish before asking.
    const t = window.setTimeout(() => setPanelOpen(true), 1900);
    return () => window.clearTimeout(t);
  }, []);

  const set = useCallback((analytics: boolean) => {
    const next: Consent = { necessary: true, analytics, at: new Date().toISOString() };
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      /* storage blocked: the choice simply does not persist */
    }
    storedConsent.invalidate();
    setChosen(next);
    setPanelOpen(false);
  }, []);

  const open = useCallback(() => setPanelOpen(true), []);

  const api = useMemo<Api>(() => ({ consent, open, set }), [consent, open, set]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <AnalyticsGate enabled={Boolean(consent?.analytics)} />
      {hydrated ? <CookiePanel open={panelOpen} onClose={() => setPanelOpen(false)} /> : null}
    </Ctx.Provider>
  );
}

/**
 * The gated behaviour. Sends one first-party ping per page while consent is
 * granted, and nothing at all otherwise. Withdrawing consent unmounts this and
 * the pings stop immediately.
 */
function AnalyticsGate({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const send = () => {
      void fetch("/api/pageview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: window.location.pathname, ref: document.referrer || null }),
        signal: controller.signal,
        keepalive: true,
      }).catch(() => {});
    };
    send();
    window.addEventListener("popstate", send);
    return () => {
      controller.abort();
      window.removeEventListener("popstate", send);
    };
  }, [enabled]);
  return null;
}

function CookiePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { consent, set } = useCookieConsent();
  const { menuOpen } = useUIState();
  const scope = useTemplateScope();
  const [detail, setDetail] = useState(false);
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && consent) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, consent, onClose]);

  const C = COPY.cookies;

  return (
    <AnimatePresence>
      {open && !menuOpen ? (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          // Re-declares the template scope so .t-btn and the --t-* tokens
          // resolve; the panel renders outside the template subtree.
          data-template={scope}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          // Anchored bottom-left with a right-side gap on small screens so it
          // never sits under the floating template switcher or eats its taps.
          className="fixed bottom-3 left-3 w-[min(30rem,calc(100vw-1.5rem))] sm:bottom-5 sm:left-5"
          style={{ zIndex: "var(--z-cookie)" }}
        >
          <div
            className="p-5 shadow-[0_24px_60px_-28px_rgba(20,20,15,0.55)] sm:p-6"
            style={{
              background: "var(--t-surface, #fbfaf7)",
              color: "var(--t-fg, #2b2a20)",
              border: "1px solid var(--t-line-strong, rgba(87,85,64,0.35))",
              borderRadius: "var(--t-radius-sm, 4px)",
            }}
          >
            <h2 id="cookie-title" className="text-[0.95rem] font-medium">
              {C.title}
            </h2>
            <p
              className="mt-2 text-[0.85rem] leading-relaxed"
              style={{ color: "var(--t-fg-muted, #575540)" }}
            >
              {C.body}
            </p>

            <AnimatePresence initial={false}>
              {detail ? (
                <motion.div
                  key="detail"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid gap-3 text-[0.82rem]">
                    <Toggle
                      title={C.necessaryTitle}
                      body={C.necessaryBody}
                      checked
                      disabled
                      onChange={() => {}}
                    />
                    <Toggle
                      title={C.analyticsTitle}
                      body={C.analyticsBody}
                      checked={analytics}
                      onChange={setAnalytics}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {detail ? (
                <button type="button" className="t-btn t-btn-primary" onClick={() => set(analytics)}>
                  {C.save}
                </button>
              ) : (
                <>
                  <button type="button" className="t-btn t-btn-primary" onClick={() => set(true)}>
                    {C.accept}
                  </button>
                  <button type="button" className="t-btn t-btn-ghost" onClick={() => set(false)}>
                    {C.reject}
                  </button>
                </>
              )}
              <button
                type="button"
                className="ms-auto text-[0.8rem] underline underline-offset-4"
                onClick={() => setDetail((d) => !d)}
                aria-expanded={detail}
              >
                {C.manage}
              </button>
            </div>

            <p className="mt-4 text-[0.75rem]" style={{ color: "var(--t-fg-faint, #6f6c52)" }}>
              {LEGAL_NAV.map((l, i) => (
                <span key={l.href}>
                  {i > 0 ? " · " : ""}
                  <a href={l.href} className="underline underline-offset-4">
                    {l.label}
                  </a>
                </span>
              ))}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Toggle({
  title,
  body,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-start gap-3 p-3"
      style={{ border: "1px solid var(--t-line, rgba(87,85,64,0.2))", borderRadius: "var(--t-radius-sm, 4px)" }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors",
          disabled && "opacity-50",
        )}
        style={{
          background: checked ? "var(--t-accent, #575540)" : "var(--t-line-strong, rgba(87,85,64,0.35))",
        }}
      >
        <span
          className="absolute top-1 size-4 rounded-full transition-[left] duration-200"
          style={{ left: checked ? "1.25rem" : "0.25rem", background: "var(--t-surface, #fff)" }}
        />
      </button>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="block" style={{ color: "var(--t-fg-muted, #575540)" }}>
          {body}
        </span>
      </span>
    </div>
  );
}

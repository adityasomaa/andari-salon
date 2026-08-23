"use client";

/**
 * Loaders and page transitions.
 *
 * Two loaders per template: an entry loader on first paint or when landing on
 * home, and a curtain for navigations between pages.
 *
 * Sequence, in this order, every time:
 *   1. page closes   the curtain covers the viewport
 *   2. content swaps behind the curtain
 *   3. scroll jumps to the top, still behind the curtain
 *   4. page opens    the curtain retracts
 *
 * The one rule that matters for reliability: never advance the sequence on
 * requestAnimationFrame alone. A backgrounded tab stops firing rAF, and the
 * curtain then stays up forever. Every step races a setTimeout against rAF and
 * continues on whichever lands first.
 */

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

import { useTemplate } from "./template-context";
import { useUIState } from "./ui-state";

/* ------------------------------------------------------------ timing util */

/**
 * Resolve after `ms`, using whichever of setTimeout or rAF fires first.
 *
 * setTimeout is throttled but never stopped in a background tab, rAF is
 * stopped outright. Racing them means the sequence always completes.
 */
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      if (raf !== null) cancelAnimationFrame(raf);
      resolve();
    };
    const timer = window.setTimeout(finish, ms);
    const started = performance.now();
    let raf: number | null = requestAnimationFrame(function tick(now) {
      if (now - started >= ms) finish();
      else raf = requestAnimationFrame(tick);
    });
  });
}

/* ---------------------------------------------------------------- context */

type TransitionApi = {
  /** Navigate with the close, swap, scroll, open sequence. */
  go: (href: string) => void;
  busy: boolean;
};

const Ctx = createContext<TransitionApi | null>(null);

export function useTransition(): TransitionApi {
  const ctx = useContext(Ctx);
  return ctx ?? { go: (href) => { window.location.href = href; }, busy: false };
}

/* ----------------------------------------------------------------- timing */

const TIMING = {
  t1: { close: 620, hold: 150, open: 720, entry: 1500 },
  t2: { close: 460, hold: 120, open: 520, entry: 1250 },
  t3: { close: 760, hold: 200, open: 900, entry: 1750 },
} as const;

/* --------------------------------------------------------------- provider */

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const template = useTemplate();
  const key = template?.key ?? "t1";
  const timing = TIMING[key];

  const router = useRouter();
  const pathname = usePathname();
  const { addLock, setMenuOpen, closePopover } = useUIState();

  const [phase, setPhase] = useState<"entry" | "idle" | "closing" | "opening">("entry");
  // "entry" is the arrival loader, shown on first paint and whenever the
  // visitor navigates to this template's home. "curtain" is the shorter
  // between-pages transition.
  const [mode, setMode] = useState<"entry" | "curtain">("entry");
  const busyRef = useRef(false);
  const releaseRef = useRef<null | (() => void)>(null);

  // Entry loader. Runs on first mount of a template and whenever the visitor
  // arrives at that template's home page.
  useEffect(() => {
    let cancelled = false;
    const release = addLock();
    releaseRef.current = release;
    (async () => {
      await wait(timing.entry);
      if (cancelled) return;
      setPhase("idle");
      release();
      releaseRef.current = null;
    })();
    return () => {
      cancelled = true;
      release();
    };
    // Intentionally once per template mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = useCallback(
    (href: string) => {
      if (busyRef.current) return;
      const target = href.split("#")[0];
      if (target === pathname) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      busyRef.current = true;
      setMenuOpen(false);
      closePopover();

      // Arriving at home gets the arrival loader; everything else gets the
      // shorter between-pages curtain.
      const isHome = Boolean(template) && target === template!.base;
      const nextMode: "entry" | "curtain" = isHome ? "entry" : "curtain";
      setMode(nextMode);
      const closeMs = isHome ? timing.entry * 0.55 : timing.close;
      const openMs = isHome ? timing.entry * 0.5 : timing.open;

      (async () => {
        const release = addLock();
        // 1. page closes
        setPhase("closing");
        await wait(closeMs);

        // 2. content changes, entirely behind the curtain
        router.push(target);
        await wait(timing.hold);

        // 3. scroll to top, still covered
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        await wait(60);

        // 4. page opens
        setPhase("opening");
        await wait(openMs);
        setPhase("idle");
        release();
        busyRef.current = false;
      })();
    },
    [pathname, router, addLock, setMenuOpen, closePopover, timing, template],
  );

  const api = useMemo<TransitionApi>(() => ({ go, busy: phase !== "idle" }), [go, phase]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <Curtain phase={phase} variant={key} timing={timing} mode={mode} />
    </Ctx.Provider>
  );
}

/* ---------------------------------------------------------------- curtain */

type Phase = "entry" | "idle" | "closing" | "opening";

function Curtain({
  phase,
  variant,
  timing,
  mode,
}: {
  phase: Phase;
  variant: "t1" | "t2" | "t3";
  timing: (typeof TIMING)[keyof typeof TIMING];
  mode: "entry" | "curtain";
}) {
  const visible = phase !== "idle";
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="curtain"
          aria-hidden
          className="fixed inset-0 grain-clip"
          style={{ zIndex: "var(--z-curtain)", pointerEvents: "all" }}
          initial={false}
        >
          {variant === "t1" ? (
            <T1Curtain phase={phase} timing={timing} entry={mode === "entry"} />
          ) : variant === "t2" ? (
            <T2Curtain phase={phase} timing={timing} entry={mode === "entry"} />
          ) : (
            <T3Curtain phase={phase} timing={timing} entry={mode === "entry"} />
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

type CurtainProps = {
  phase: Phase;
  timing: (typeof TIMING)[keyof typeof TIMING];
  entry: boolean;
};

/**
 * Template 1: a single sheet of paper that slides up, with a hairline that
 * draws across it. Slow, quiet, no colour beyond the ground.
 */
function T1Curtain({ phase, timing, entry }: CurtainProps) {
  const closing = phase === "closing";
  const isEntry = phase === "entry";
  const sec = (ms: number) => ms / 1000;

  return (
    <motion.div
      className="absolute inset-0 flex items-end justify-start"
      style={{ background: "var(--color-paper)" }}
      initial={isEntry ? { y: 0 } : { y: "100%" }}
      animate={closing || isEntry ? { y: 0 } : { y: "-100%" }}
      transition={{
        duration: isEntry ? sec(timing.entry) * 0.55 : closing ? sec(timing.close) : sec(timing.open),
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <div className="w-full px-[clamp(1.5rem,5vw,6rem)] pb-[clamp(2rem,6vw,4rem)]">
        <motion.div
          className="h-px w-full origin-left"
          style={{ background: "var(--color-olive)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: isEntry ? sec(timing.entry) * 0.8 : sec(timing.close) * 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        {entry ? (
          <motion.p
            className="mt-4 text-[0.6875rem] tracking-[0.28em] uppercase"
            style={{ color: "var(--color-olive)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Andari Salon
          </motion.p>
        ) : null}
      </div>
    </motion.div>
  );
}

/**
 * Template 2: two rounded panels that close from the edges and part again,
 * with a small pulsing monogram dot. Livelier, shorter.
 */
function T2Curtain({ phase, timing }: CurtainProps) {
  const closing = phase === "closing";
  const isEntry = phase === "entry";
  const sec = (ms: number) => ms / 1000;
  const dur = isEntry ? sec(timing.entry) * 0.5 : closing ? sec(timing.close) : sec(timing.open);

  return (
    <div className="absolute inset-0">
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-x-0 h-[52%]"
          style={{
            background: "var(--color-sand)",
            top: i === 0 ? 0 : undefined,
            bottom: i === 1 ? 0 : undefined,
            borderBottomLeftRadius: i === 0 ? "32px" : undefined,
            borderBottomRightRadius: i === 0 ? "32px" : undefined,
            borderTopLeftRadius: i === 1 ? "32px" : undefined,
            borderTopRightRadius: i === 1 ? "32px" : undefined,
          }}
          initial={isEntry ? { y: "0%" } : { y: i === 0 ? "-100%" : "100%" }}
          animate={
            closing || isEntry ? { y: "0%" } : { y: i === 0 ? "-101%" : "101%" }
          }
          transition={{ duration: dur, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
        />
      ))}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing || isEntry ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          className="block size-3 rounded-full"
          style={{ background: "var(--color-olive)" }}
          animate={{ scale: [1, 1.55, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

/**
 * Template 3: the ground simply darkens to full, a single hairline crosses it,
 * and it lifts. Almost no movement, which is the point.
 */
function T3Curtain({ phase, timing, entry }: CurtainProps) {
  const closing = phase === "closing";
  const isEntry = phase === "entry";
  const sec = (ms: number) => ms / 1000;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: "var(--color-night)" }}
      initial={isEntry ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: closing || isEntry ? 1 : 0 }}
      transition={{
        duration: isEntry ? 0.01 : closing ? sec(timing.close) * 0.8 : sec(timing.open),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="w-[min(28rem,70vw)]">
        <motion.div
          className="h-px w-full origin-center"
          style={{ background: "var(--color-olive-pale)" }}
          initial={{ scaleX: 0, opacity: 0.7 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: isEntry ? sec(timing.entry) * 0.75 : sec(timing.close),
            ease: [0.16, 1, 0.3, 1],
          }}
        />
        {entry ? (
          <motion.p
            className="mt-5 text-center text-[0.625rem] tracking-[0.42em] uppercase"
            style={{ color: "var(--color-olive-pale)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.35 }}
          >
            Andari Salon
          </motion.p>
        ) : null}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------- link */

/** Internal link that plays the transition instead of a hard navigation. */
export function TransitionLink({
  href,
  children,
  className,
  onNavigate,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const { go } = useTransition();
  return (
    <a
      href={href}
      className={cn(className)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onNavigate?.();
        go(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

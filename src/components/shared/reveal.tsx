"use client";

/**
 * Reveal primitives, adapted from componentry.dev's `text-animate`.
 *
 * Changes made against the upstream component:
 *
 *  - Accessibility. Upstream splits text into spans with no accessible name,
 *    so a screen reader reads a headline one letter at a time. Here the
 *    wrapper carries `aria-label` once and every fragment is `aria-hidden`.
 *  - Overflow safety. Upstream relies on the caller wrapping it in
 *    `overflow-hidden`, which then breaks IntersectionObserver on the same
 *    subtree. `useInView` sits on a wrapper that is never clipped, and the
 *    clipping mask is an inner element.
 *  - Motion is expressed through the active template's `--t-dur` / `--t-ease`
 *    tokens instead of fixed numbers, so the same component is slow and blurry
 *    in template 1 and springy in template 2.
 *  - `prefers-reduced-motion` renders the final state with no animation.
 */

import { motion, useInView, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Motion components are created once at module scope. `motion.create(Tag)`
 * called during render returns a brand new component type on every pass, which
 * remounts the whole subtree and loses its animation state.
 */
const MOTION: Record<Tag, ElementType> = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
};

export type Tag = "div" | "span" | "p" | "h1" | "h2" | "h3";

export type RevealKind =
  | "fade"
  | "rise"
  | "blur-rise"
  | "spring-rise"
  | "mask-up"
  | "letter-rise"
  | "letter-fade";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

const VARIANTS: Record<RevealKind, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  rise: {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  },
  "blur-rise": {
    hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "spring-rise": {
    hidden: { opacity: 0, y: 22, scale: 0.985 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
  "mask-up": {
    hidden: { y: "110%" },
    show: { y: "0%" },
  },
  "letter-rise": {
    hidden: { opacity: 0, y: "70%" },
    show: { opacity: 1, y: "0%" },
  },
  "letter-fade": {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
};

/** Per-template motion feel, read from CSS custom properties at mount. */
function useTemplateMotion() {
  const [tokens, setTokens] = useState({ duration: 0.7, stagger: 0.06 });
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    const ms = (v: string, fallback: number) => {
      const raw = cs.getPropertyValue(v).trim();
      if (!raw) return fallback;
      const n = parseFloat(raw);
      return raw.endsWith("ms") ? n / 1000 : n;
    };
    setTokens({ duration: ms("--t-dur", 0.7), stagger: ms("--t-stagger", 0.06) });
  }, []);
  return { ref, ...tokens };
}

type RevealProps = {
  children: ReactNode;
  kind?: RevealKind;
  as?: Tag;
  className?: string;
  delay?: number;
  once?: boolean;
  /** Fraction of the element that must be visible before it fires. */
  amount?: number;
};

/**
 * Element reveal. The observed wrapper is never the clipped element, because
 * an IntersectionObserver inside an `overflow: hidden` ancestor can report a
 * ratio of 0 forever and the reveal then never runs.
 */
export function Reveal({
  children,
  kind = "rise",
  as: Tag = "div",
  className,
  delay = 0,
  once = true,
  amount = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount, margin: "0px 0px -8% 0px" });
  const reduced = usePrefersReducedMotion();
  const { ref: probe, duration } = useTemplateMotion();
  const MotionTag = MOTION[Tag];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <span ref={probe} aria-hidden className="pointer-events-none absolute size-0" />
      <MotionTag
        initial={reduced ? "show" : "hidden"}
        animate={reduced || inView ? "show" : "hidden"}
        variants={VARIANTS[kind]}
        transition={{
          duration: reduced ? 0 : duration,
          delay: reduced ? 0 : delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </MotionTag>
    </div>
  );
}

type SplitTextProps = {
  text: string;
  /** Forwarded to the rendered element, e.g. for aria-labelledby targets. */
  id?: string;
  kind?: Extract<RevealKind, "letter-rise" | "letter-fade">;
  /** Split point. Words keep line breaking sane on long headlines. */
  by?: "letter" | "word";
  as?: Tag;
  className?: string;
  segmentClassName?: string;
  delay?: number;
  once?: boolean;
};

/**
 * Headline that animates in pieces.
 *
 * The whole string is announced once through `aria-label` and every fragment
 * is `aria-hidden`, so assistive tech reads a sentence rather than a stream of
 * letters. Pass a real element through `as` (h1, h2, p) so the label lands on
 * something with a role that exposes it.
 */
export function SplitText({
  text,
  id,
  kind = "letter-rise",
  by = "letter",
  as: Tag = "span",
  className,
  segmentClassName,
  delay = 0,
  once = true,
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: 0.25 });
  const reduced = usePrefersReducedMotion();
  const { ref: probe, duration, stagger } = useTemplateMotion();
  const MotionTag = MOTION[Tag];

  const words = text.split(" ");
  const clipped = kind === "letter-rise";

  return (
    <div ref={ref} id={id} className={cn("relative", className)}>
      <span ref={probe} aria-hidden className="pointer-events-none absolute size-0" />
      <MotionTag
        aria-label={text}
        className="split-text"
        initial={reduced ? "show" : "hidden"}
        animate={reduced || inView ? "show" : "hidden"}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay } },
        }}
      >
        {words.map((word, wi) => (
          <span
            key={`${word}-${wi}`}
            aria-hidden
            className="inline-block whitespace-pre"
            style={clipped ? { overflow: "hidden", paddingBottom: "0.12em" } : undefined}
          >
            {(by === "word" ? [word] : Array.from(word)).map((piece, pi) => (
              <motion.span
                key={`${piece}-${pi}`}
                className={cn("inline-block", segmentClassName)}
                variants={VARIANTS[kind]}
                transition={{
                  duration: reduced ? 0 : duration * 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {piece}
              </motion.span>
            ))}
            {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </span>
        ))}
      </MotionTag>
    </div>
  );
}

/** Hairline that draws itself in. Template 3 leans on this instead of movement. */
export function RuleDraw({
  className,
  delay = 0,
  vertical = false,
}: {
  className?: string;
  delay?: number;
  vertical?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = usePrefersReducedMotion();
  const { ref: probe, duration } = useTemplateMotion();

  return (
    <div ref={ref} className={cn("relative", vertical ? "w-px" : "h-px", className)}>
      <span ref={probe} aria-hidden className="pointer-events-none absolute size-0" />
      <motion.div
        aria-hidden
        className="size-full origin-left"
        style={{
          background: "var(--t-line-strong)",
          transformOrigin: vertical ? "top" : "left",
        }}
        initial={reduced ? undefined : { scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }}
        animate={
          reduced || inView ? { scaleX: 1, scaleY: 1 } : { scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }
        }
        transition={{ duration: reduced ? 0 : duration * 1.3, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

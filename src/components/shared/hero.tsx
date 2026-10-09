"use client";

/**
 * Hero. Exactly one screen tall.
 *
 *   height  100svh, not 100vh, so hiding mobile browser chrome does not
 *           resize it mid-scroll
 *   graphic centred behind a compact stack; a static layer, never bound to
 *           scroll
 *   content the same four parts as every other section, in the same order
 */

import { Art } from "./art";
import { CtaLink } from "./cta-link";
import { useCopy } from "./locale-context";
import { Reveal, SplitText } from "./reveal";

export function Hero() {
  const copy = useCopy().hero;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex h-hero flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--t-bg)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <Art name="hero" priority decorative sizes="100vw" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            // Clean pool behind the type, motif left readable at the edges.
            background:
              "radial-gradient(78% 62% at 50% 46%, var(--t-bg) 0%, color-mix(in oklab, var(--t-bg) 86%, transparent) 52%, color-mix(in oklab, var(--t-bg) 45%, transparent) 100%)",
          }}
        />
      </div>

      <div className="t-shell relative flex w-full flex-col items-center gap-5 text-center">
        <Reveal kind="spring-rise">
          <span
            className="t-label inline-flex items-center rounded-full px-4 py-2"
            style={{ background: "var(--t-surface)", color: "var(--t-fg-muted)" }}
          >
            {copy.label}
          </span>
        </Reveal>

        <SplitText
          as="h1"
          id="hero-heading"
          text={copy.headline}
          by="word"
          kind="letter-rise"
          className="t-display max-w-[17ch]"
        />

        <Reveal kind="spring-rise" delay={0.2}>
          <p className="t-body mx-auto max-w-[46ch] text-center">{copy.description}</p>
        </Reveal>

        {copy.cta ? (
          <Reveal kind="spring-rise" delay={0.3}>
            <CtaLink cta={copy.cta} variant="primary" />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

"use client";

/**
 * Hero. Exactly one screen tall in all three templates.
 *
 *   height  100svh, not 100vh, so hiding mobile browser chrome does not
 *           resize it mid-scroll
 *   graphic no scroll-linked scale anywhere; it is a static layer that the
 *           content scrolls away from
 *   content the same four parts as every other section, in the same order
 *
 * Layouts:
 *   t1  graphic bleeding off the right edge, headline hard left, huge, thin
 *   t2  graphic centred behind a compact stack, everything rounded
 *   t3  graphic as a low-contrast ground, content in a hairline frame
 */

import { COPY } from "@/config/copy";
import type { TemplateId } from "@/config/site";

import { Art } from "./art";
import { CtaLink } from "./cta-link";
import { Reveal, RuleDraw, SplitText } from "./reveal";
import { templateInfo } from "./template-context";

export function Hero({ template }: { template: TemplateId }) {
  const key = templateInfo(template).key;
  const copy = COPY.hero;

  if (key === "t1") {
    return (
      <section
        aria-labelledby="hero-heading"
        className="relative flex h-hero flex-col justify-end overflow-hidden"
        style={{ background: "var(--t-bg)" }}
      >
        {/* Static layer. No transform is bound to scroll. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[62%] sm:w-[52%]">
          <Art template={template} name="hero" priority decorative sizes="60vw" />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--t-bg) 0%, color-mix(in oklab, var(--t-bg) 55%, transparent) 42%, transparent 78%)",
            }}
          />
        </div>

        <div className="t-shell relative w-full pb-[clamp(3rem,8vh,6rem)]">
          <div className="flex items-baseline gap-6 pb-[clamp(1.5rem,4vh,3rem)]">
            <Reveal kind="fade">
              <span className="t-label">{copy.label}</span>
            </Reveal>
            <RuleDraw className="flex-1 translate-y-[-0.35em]" delay={0.1} />
          </div>

          <SplitText
            as="h1"
            id="hero-heading"
            text={copy.headline}
            by="letter"
            kind="letter-rise"
            className="t-display max-w-[18ch]"
          />

          <div className="mt-[clamp(1.5rem,4vh,2.5rem)] grid gap-6 lg:grid-cols-12">
            <Reveal kind="blur-rise" delay={0.35} className="lg:col-span-5">
              <p className="t-body">{copy.description}</p>
            </Reveal>
            <Reveal kind="fade" delay={0.5} className="lg:col-span-4 lg:col-start-9">
              <CtaLink cta={copy.cta} variant="quiet" />
            </Reveal>
          </div>
        </div>
      </section>
    );
  }

  if (key === "t2") {
    return (
      <section
        aria-labelledby="hero-heading"
        className="relative flex h-hero flex-col items-center justify-center overflow-hidden"
        style={{ background: "var(--t-bg)" }}
      >
        <div className="pointer-events-none absolute inset-0">
          <Art template={template} name="hero" priority decorative sizes="100vw" />
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

          <Reveal kind="spring-rise" delay={0.3}>
            <CtaLink cta={copy.cta} variant="primary" />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex h-hero items-center overflow-hidden"
      style={{ background: "var(--t-bg)" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <Art template={template} name="hero" priority decorative sizes="100vw" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in oklab, var(--t-bg) 70%, transparent), color-mix(in oklab, var(--t-bg) 40%, transparent) 45%, var(--t-bg) 96%)",
        }}
      />

      <div className="t-shell relative w-full">
        <div
          className="grid gap-[clamp(1.5rem,4vh,2.5rem)] p-[clamp(1.5rem,4vw,3.5rem)]"
          style={{ border: "1px solid var(--t-line)", borderRadius: "var(--t-radius)" }}
        >
          <div className="flex items-center gap-4">
            <Reveal kind="fade">
              <span
                className="t-label inline-flex items-center px-3 py-1.5"
                style={{ border: "1px solid var(--t-line)", borderRadius: "var(--t-radius-sm)" }}
              >
                {copy.label}
              </span>
            </Reveal>
            <RuleDraw className="flex-1" delay={0.25} />
          </div>

          <SplitText
            as="h1"
            id="hero-heading"
            text={copy.headline}
            by="word"
            kind="letter-fade"
            className="t-display max-w-[24ch]"
          />

          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_1px_minmax(0,0.8fr)] md:items-start">
            <Reveal kind="fade" delay={0.35}>
              <p className="t-body">{copy.description}</p>
            </Reveal>
            <div aria-hidden className="hidden md:block md:h-full" style={{ background: "var(--t-line)" }} />
            <Reveal kind="fade" delay={0.5}>
              <CtaLink cta={copy.cta} variant="primary" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

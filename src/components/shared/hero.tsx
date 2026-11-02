"use client";

/**
 * Hero. Exactly one screen tall.
 *
 *   height  100svh, not 100vh, so hiding mobile browser chrome does not
 *           resize it mid-scroll
 *   photo   the client's image, a static layer never bound to scroll. Full
 *           bleed on desktop. On a phone it fills only the top of the hero:
 *           full bleed there would crop to a giant face, so it stays at a
 *           scale that shows the whole face, anchored right where the face is
 *   wash    the page ground fades over the photo where the text sits: from
 *           the left on desktop, up from the bottom on a phone. The flowing
 *           hair runs under the text, so this is what keeps the type legible
 *   content the same four parts as every other section, in the same order
 */

import Image from "next/image";

import { CtaLink } from "./cta-link";
import { useCopy, useLocale } from "./locale-context";
import { Reveal, SplitText } from "./reveal";

const ALT = {
  id: "Model dengan rambut panjang cokelat kemerahan yang tergerai",
  en: "A model with long, flowing auburn hair",
};

export function Hero() {
  const copy = useCopy().hero;
  const locale = useLocale();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex h-hero flex-col justify-end overflow-hidden lg:justify-center"
      style={{ background: "var(--t-bg)" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60%] lg:inset-0 lg:h-full">
        <Image
          src="/photos/hero.webp"
          alt={ALT[locale]}
          fill
          priority
          sizes="100vw"
          unoptimized
          className="object-cover object-right lg:object-[right_30%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,var(--t-bg)_10%,transparent_44%)] lg:bg-[linear-gradient(to_right,var(--t-bg)_28%,color-mix(in_oklab,var(--t-bg)_78%,transparent)_44%,transparent_66%)]"
        />
      </div>

      <div className="t-shell relative flex w-full flex-col items-center gap-5 pb-[clamp(2rem,6vh,3.5rem)] text-center lg:items-start lg:pb-0 lg:text-left">
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
          className="t-display max-w-[17ch] lg:max-w-[13ch]"
        />

        <Reveal kind="spring-rise" delay={0.2}>
          <p className="t-body mx-auto max-w-[46ch] text-center lg:mx-0 lg:max-w-[38ch] lg:text-left">
            {copy.description}
          </p>
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

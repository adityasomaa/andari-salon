"use client";

/**
 * Every section opens with the same four parts in the same order: label,
 * headline, description, CTA. A rounded chip sits above a centred stack.
 */

import type { ReactNode } from "react";

import type { SectionCopy } from "@/config/copy";
import { cn } from "@/lib/utils";

import { CtaLink } from "./cta-link";
import { Reveal, SplitText } from "./reveal";

type Props = {
  copy: SectionCopy;
  /** Heading level. Sections use h2; page headers pass h1. */
  as?: "h1" | "h2";
  /** Animate the headline per letter. Reserved for the largest headings. */
  splitHeadline?: boolean;
  className?: string;
  /** Rendered after the description and CTA. */
  children?: ReactNode;
  /** Hide the CTA where the section itself is the action, e.g. the form. */
  hideCta?: boolean;
  ctaVariant?: "primary" | "ghost";
};

export function SectionHeader({
  copy,
  as = "h2",
  splitHeadline = false,
  className,
  children,
  hideCta = false,
  ctaVariant,
}: Props) {
  const Heading = as;

  const headline = splitHeadline ? (
    <SplitText
      as={Heading}
      text={copy.headline}
      by="letter"
      kind="letter-rise"
      className={cn(as === "h1" ? "t-display" : "t-h2")}
    />
  ) : (
    <Reveal kind="spring-rise">
      <Heading className={cn(as === "h1" ? "t-display" : "t-h2", "text-balance-tight")}>
        {copy.headline}
      </Heading>
    </Reveal>
  );

  return (
    <header className={cn("flex flex-col items-center gap-5 text-center", className)}>
      <Reveal kind="spring-rise">
        <span
          className="t-label inline-flex items-center rounded-full px-4 py-2"
          style={{ background: "var(--t-accent-soft)", color: "var(--t-fg-muted)" }}
        >
          {copy.label}
        </span>
      </Reveal>
      <div className="max-w-3xl">{headline}</div>
      <div className="flex max-w-2xl flex-col items-center gap-6">
        <Reveal kind="spring-rise" delay={0.08}>
          <p className="t-body mx-auto text-center">{copy.description}</p>
        </Reveal>
        {hideCta || !copy.cta ? null : (
          <Reveal kind="fade" delay={0.16}>
            <CtaLink cta={copy.cta} variant={ctaVariant} />
          </Reveal>
        )}
      </div>
      {children}
    </header>
  );
}

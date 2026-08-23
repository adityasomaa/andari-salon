"use client";

/**
 * Every section on every template opens with the same four parts in the same
 * order: label, headline, description, CTA.
 *
 * The parts are fixed; the arrangement is not. Each template supplies its own
 * `variant`, and the label in particular is treated very differently in each
 * so the three do not all read as the same uppercase eyebrow:
 *
 *   t1  numbered index with a rule that runs to the edge of the column
 *   t2  rounded chip sitting above a centred stack
 *   t3  index boxed by a hairline, with a vertical divider before the headline
 */

import type { ReactNode } from "react";

import type { SectionCopy } from "@/config/copy";
import { cn } from "@/lib/utils";

import { CtaLink } from "./cta-link";
import { Reveal, RuleDraw, SplitText } from "./reveal";
import { useTemplate } from "./template-context";

type Props = {
  copy: SectionCopy;
  /** Overrides the numeric index shown by the t1 and t3 label treatments. */
  index?: string;
  /** Heading level. Sections use h2; page headers pass h1. */
  as?: "h1" | "h2";
  /** Animate the headline per letter. Reserved for the largest headings. */
  splitHeadline?: boolean;
  className?: string;
  /** Rendered after the description, before the CTA. */
  children?: ReactNode;
  /** Hide the CTA where the section itself is the action, e.g. the form. */
  hideCta?: boolean;
  ctaVariant?: "primary" | "ghost" | "quiet";
};

export function SectionHeader({
  copy,
  index,
  as = "h2",
  splitHeadline = false,
  className,
  children,
  hideCta = false,
  ctaVariant,
}: Props) {
  const template = useTemplate();
  const key = template?.key ?? "t1";
  const Heading = as;

  const headline = splitHeadline ? (
    <SplitText
      as={Heading}
      text={copy.headline}
      by="letter"
      kind={key === "t3" ? "letter-fade" : "letter-rise"}
      className={cn(as === "h1" ? "t-display" : "t-h2")}
    />
  ) : (
    <Reveal kind={key === "t1" ? "blur-rise" : key === "t2" ? "spring-rise" : "fade"}>
      <Heading className={cn(as === "h1" ? "t-display" : "t-h2", "text-balance-tight")}>
        {copy.headline}
      </Heading>
    </Reveal>
  );

  const description = (
    <Reveal
      kind={key === "t1" ? "blur-rise" : key === "t2" ? "spring-rise" : "fade"}
      delay={0.08}
    >
      <p className="t-body">{copy.description}</p>
    </Reveal>
  );

  const cta =
    hideCta || !copy.cta ? null : (
      <Reveal kind="fade" delay={0.16}>
        <CtaLink cta={copy.cta} variant={ctaVariant} />
      </Reveal>
    );

  // ---------------------------------------------------- t1: ruled index
  if (key === "t1") {
    return (
      <header className={cn("grid gap-[var(--t-stack)]", className)}>
        <div className="flex items-baseline gap-6">
          <span className="t-label shrink-0">
            {index ? `${index} ` : ""}
            {copy.label}
          </span>
          <RuleDraw className="flex-1 translate-y-[-0.35em]" />
        </div>
        <div className="grid gap-[var(--t-stack)] lg:grid-cols-12">
          <div className="lg:col-span-7">{headline}</div>
          <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:col-start-9 lg:pt-3">
            {description}
            {cta}
          </div>
        </div>
        {children}
      </header>
    );
  }

  // ---------------------------------------------------- t2: chip, centred
  if (key === "t2") {
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
          <div className="[&_.t-body]:mx-auto [&_.t-body]:text-center">{description}</div>
          {cta}
        </div>
        {children}
      </header>
    );
  }

  // ---------------------------------------------------- t3: hairline frame
  return (
    <header className={cn("grid gap-[var(--t-stack)]", className)}>
      <div className="flex items-center gap-4">
        <span
          className="t-label inline-flex items-center px-3 py-1.5"
          style={{ border: "1px solid var(--t-line)", borderRadius: "var(--t-radius-sm)" }}
        >
          {index ?? copy.label}
        </span>
        {index ? <span className="t-label">{copy.label}</span> : null}
        <RuleDraw className="flex-1" />
      </div>
      <div className="grid gap-[var(--t-stack)] md:grid-cols-[minmax(0,1fr)_1px_minmax(0,0.85fr)] md:gap-10">
        <div>{headline}</div>
        <div aria-hidden className="hidden md:block" style={{ background: "var(--t-line)" }} />
        <div className="flex flex-col items-start gap-7">
          {description}
          {cta}
        </div>
      </div>
      {children}
    </header>
  );
}

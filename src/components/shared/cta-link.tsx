"use client";

/**
 * A CTA is either an internal page, an in-page anchor, or a WhatsApp message.
 * Callers describe intent through the shared `Cta` type and this decides which
 * it is, so no page has to branch on it.
 */

import Link from "next/link";

import type { Cta } from "@/config/copy";
import { href } from "@/config/i18n";
import { cn } from "@/lib/utils";

import { useLocale } from "./locale-context";
import { WhatsAppLink } from "./whatsapp-link";

type Variant = "primary" | "ghost";

export function CtaLink({
  cta,
  variant = "primary",
  className,
}: {
  cta: Cta;
  variant?: Variant;
  className?: string;
}) {
  const locale = useLocale();
  const classes = cn(
    "t-btn",
    variant === "primary" ? "t-btn-primary" : "t-btn-ghost",
    className,
  );

  if (cta.wa) {
    return (
      <WhatsAppLink className={classes} intent={cta.wa}>
        {cta.label}
        <Arrow />
      </WhatsAppLink>
    );
  }

  const target = cta.to ? href(cta.to, locale) : (cta.href ?? href("home", locale));
  return (
    <Link href={target} className={classes}>
      {cta.label}
      <Arrow />
    </Link>
  );
}

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}

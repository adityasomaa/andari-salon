"use client";

/**
 * A CTA is either an internal route or a WhatsApp message. Callers describe
 * intent through the shared `Cta` type and this decides which of the two it
 * is, so no page has to branch on it.
 */

import Link from "next/link";

import type { Cta } from "@/config/copy";
import { cn } from "@/lib/utils";

import { useHref, useTemplate } from "./template-context";
import { WhatsAppLink } from "./whatsapp-link";

type Variant = "primary" | "ghost" | "quiet";

export function CtaLink({
  cta,
  variant,
  className,
}: {
  cta: Cta;
  variant?: Variant;
  className?: string;
}) {
  const template = useTemplate();
  const resolve = useHref();
  // Template 1's default CTA is a ruled link rather than a filled button.
  const v: Variant = variant ?? (template?.key === "t1" ? "quiet" : "primary");
  const classes = cn(
    "t-btn",
    v === "primary" && "t-btn-primary",
    v === "ghost" && "t-btn-ghost",
    v === "quiet" && (template?.key === "t1" ? "t-btn-quiet" : "t-btn-ghost"),
    className,
  );

  if (cta.whatsapp) {
    return (
      <WhatsAppLink className={classes}>
        {cta.label}
        <Arrow />
      </WhatsAppLink>
    );
  }

  return (
    <Link href={resolve(cta.href)} className={classes}>
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

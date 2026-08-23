"use client";

/**
 * The only way this site links to WhatsApp.
 *
 * Every button that opens WhatsApp goes through here, so every message the
 * salon receives automatically carries the page it came from, the label of the
 * control that was pressed, and which preview was open. No caller has to
 * remember to pass that.
 *
 * The href is composed after mount so it reflects the real browser URL
 * (including the preview domain the client is actually looking at). Before
 * hydration it falls back to the configured origin, so the link is never dead.
 */

import type { ReactNode } from "react";

import { SITE } from "@/config/site";
import { useClientValue } from "@/lib/use-client-value";
import { buildGeneralMessage, waHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

import { useTemplate } from "./template-context";

type Props = {
  /** Shown inside the link, and sent to the salon as "Tombol: ...". */
  children: ReactNode;
  /** Overrides the label sent in the message when the visible text is an icon. */
  buttonLabel?: string;
  /** Ready-made message. Used by the booking form, which composes server side. */
  message?: string;
  className?: string;
  /** Extra path appended to the fallback origin during server rendering. */
  fallbackPath?: string;
  onClick?: () => void;
  "aria-label"?: string;
  "data-testid"?: string;
};

export function WhatsAppLink({
  children,
  buttonLabel,
  message,
  className,
  fallbackPath = "",
  onClick,
  ...rest
}: Props) {
  const template = useTemplate();
  const label =
    buttonLabel ?? (typeof children === "string" ? children : rest["aria-label"] ?? "WhatsApp");

  const pageUrl = useClientValue(
    () => window.location.href.split("#")[0],
    `${SITE.url}${fallbackPath}`,
  );

  const href =
    message !== undefined
      ? waHref(message)
      : waHref(
          buildGeneralMessage({
            pageUrl,
            buttonLabel: label,
            templateId: template?.id ?? null,
          }),
        );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
      onClick={onClick}
      data-wa-button={label}
      {...rest}
    >
      {children}
    </a>
  );
}

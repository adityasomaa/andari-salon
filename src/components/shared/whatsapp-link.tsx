"use client";

/**
 * The only way this site links to WhatsApp.
 *
 * Every button that opens WhatsApp goes through here, so the greetings are
 * written in one place (COPY.wa, in both languages) and the number can never
 * drift from the one in src/config/site.ts.
 *
 * The message is just the message: no page URL, no button label.
 */

import type { ReactNode } from "react";

import type { WaIntent } from "@/config/copy";
import { waHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

import { useCopy } from "./locale-context";

type Props = {
  children: ReactNode;
  /** Which pre-written greeting to open with. Defaults to a general question. */
  intent?: WaIntent;
  /** Ready-made message, e.g. one composed server side. Wins over `intent`. */
  message?: string;
  /** Another branch's number, in wa.me form. Defaults to the main salon. */
  number?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  "aria-label"?: string;
  "data-testid"?: string;
};

export function WhatsAppLink({ children, intent = "general", message, number, className, onClick, ...rest }: Props) {
  const copy = useCopy();
  const href = waHref(message ?? copy.wa[intent], number);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
      onClick={onClick}
      {...rest}
    >
      {children}
    </a>
  );
}

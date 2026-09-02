"use client";

/**
 * The only way this site links to WhatsApp.
 *
 * Every button that opens WhatsApp goes through here, so the greeting is
 * written in one place and the number can never drift from the one in
 * src/config/site.ts.
 *
 * The message is just the message. It used to carry the page URL, the button
 * label and which preview was open; that made sense while three designs were
 * being compared side by side, but it reads like machine output to whoever
 * receives it, so it is gone.
 */

import type { ReactNode } from "react";

import { buildGeneralMessage, waHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /**
   * Ready-made message. The booking form passes one composed server side;
   * everything else gets the generic greeting.
   */
  message?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  "aria-label"?: string;
  "data-testid"?: string;
};

export function WhatsAppLink({ children, message, className, onClick, ...rest }: Props) {
  const href = waHref(message ?? buildGeneralMessage());

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

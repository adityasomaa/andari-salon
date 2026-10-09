"use client";

/**
 * Address, map and opening-hours status.
 *
 * A salon is a place people travel to, so the address is copyable in one tap,
 * the map is a real embed, and Google Maps opens in a new tab. The hours slot
 * says plainly that hours are not published yet rather than inventing them.
 */

import { useEffect, useState } from "react";

import { ADDRESS, CONTACT, SOCIALS } from "@/config/site";
import { cn } from "@/lib/utils";

import { useCopy } from "./locale-context";
import { Reveal } from "./reveal";
import { HoursText } from "./site-footer";
import { WhatsAppLink } from "./whatsapp-link";

export function LocationBlock({
  showContacts = false,
  className,
}: {
  /** Contact page also lists WhatsApp and Instagram here. */
  showContacts?: boolean;
  className?: string;
}) {
  const copy = useCopy();
  const L = copy.location_block;

  const details = (
    <div className="grid gap-7">
      <div className="grid gap-2">
        <p className="t-label">{L.addressTitle}</p>
        <address className="t-body text-[length:var(--t-body)] not-italic">{ADDRESS.full}</address>
        <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2">
          <CopyAddress />
          <a
            href={ADDRESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[length:var(--t-small)] underline underline-offset-4"
          >
            {L.openMaps}
          </a>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="t-label">{L.hoursTitle}</p>
        <HoursText />
      </div>

      {showContacts ? (
        <div className="grid gap-2">
          <p className="t-label">{copy.footer.contactTitle}</p>
          <ul className="grid gap-1.5 text-[length:var(--t-body)]">
            <li>
              <WhatsAppLink className="underline underline-offset-4">
                WhatsApp {CONTACT.whatsappDisplay}
              </WhatsAppLink>
            </li>
            {SOCIALS.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {s.label} {s.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className={cn("t-card grid gap-8 overflow-hidden p-5 sm:p-8 lg:grid-cols-2 lg:items-center", className)}>
      <Reveal kind="spring-rise">{details}</Reveal>
      <Reveal kind="spring-rise" delay={0.1}>
        <div
          className="relative aspect-[4/3] w-full overflow-hidden"
          style={{ borderRadius: "var(--t-radius)", border: "1px solid var(--t-line-strong)" }}
        >
          <iframe
            src={ADDRESS.mapsEmbedUrl}
            title={L.mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 size-full border-0"
          />
        </div>
      </Reveal>
    </div>
  );
}

function CopyAddress() {
  const L = useCopy().location_block;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(ADDRESS.full);
          setCopied(true);
        } catch {
          // Clipboard blocked: select the address so it can be copied by hand.
          const node = document.querySelector("address");
          if (node) {
            const range = document.createRange();
            range.selectNodeContents(node);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }
      }}
      className="inline-flex items-center gap-2 text-[length:var(--t-small)] underline underline-offset-4"
    >
      <span aria-live="polite">{copied ? L.copiedAddress : L.copyAddress}</span>
    </button>
  );
}

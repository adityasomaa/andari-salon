"use client";

/**
 * Address, map and opening-hours status.
 *
 * A salon is a place people travel to, so the address is copyable in one tap,
 * the map is a real embed, and Google Maps opens in a new tab. The hours slot
 * says plainly that hours are not published yet rather than inventing them.
 */

import { useEffect, useState } from "react";

import { COPY } from "@/config/copy";
import { ADDRESS, CONTACT, SOCIALS } from "@/config/site";
import type { TemplateId } from "@/config/site";
import { cn } from "@/lib/utils";

import { HoursText } from "./site-footer";
import { Reveal } from "./reveal";
import { templateInfo } from "./template-context";
import { WhatsAppLink } from "./whatsapp-link";

export function LocationBlock({
  template,
  showContacts = false,
  className,
}: {
  template: TemplateId;
  /** Contact page also lists WhatsApp and Instagram here. */
  showContacts?: boolean;
  className?: string;
}) {
  const key = templateInfo(template).key;

  const details = (
    <div className="grid gap-7">
      <div className="grid gap-2">
        <p className="t-label">{COPY.location_block.addressTitle}</p>
        <address className="t-body text-[length:var(--t-body)] not-italic">{ADDRESS.full}</address>
        <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2">
          <CopyAddress />
          <a
            href={ADDRESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[length:var(--t-small)] underline underline-offset-4"
          >
            {COPY.location_block.openMaps}
          </a>
        </div>
      </div>

      <div className="grid gap-2">
        <p className="t-label">{COPY.location_block.hoursTitle}</p>
        <HoursText />
      </div>

      {showContacts ? (
        <div className="grid gap-2">
          <p className="t-label">{COPY.footer.contactTitle}</p>
          <ul className="grid gap-1.5 text-[length:var(--t-body)]">
            <li>
              <WhatsAppLink className="underline underline-offset-4" buttonLabel="Nomor WhatsApp di halaman kontak">
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

  const map = (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        key === "t1" ? "aspect-[4/3]" : key === "t2" ? "aspect-[4/3]" : "aspect-[3/2]",
      )}
      style={{
        borderRadius: "var(--t-radius)",
        border: key === "t1" ? "1px solid var(--t-line)" : "1px solid var(--t-line-strong)",
        // t3 keeps the map from glaring against a near-black page.
        filter: key === "t3" ? "grayscale(1) invert(0.92) hue-rotate(180deg) contrast(0.86)" : undefined,
      }}
    >
      <iframe
        src={ADDRESS.mapsEmbedUrl}
        title={COPY.location_block.mapTitle}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full border-0"
      />
    </div>
  );

  if (key === "t2") {
    return (
      <div className={cn("t-card grid gap-8 overflow-hidden p-5 sm:p-8 lg:grid-cols-2 lg:items-center", className)}>
        <Reveal kind="spring-rise">{details}</Reveal>
        <Reveal kind="spring-rise" delay={0.1}>
          {map}
        </Reveal>
      </div>
    );
  }

  if (key === "t3") {
    return (
      <div className={cn("grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14", className)}>
        <Reveal kind="fade">{details}</Reveal>
        <Reveal kind="fade" delay={0.12}>
          {map}
        </Reveal>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-10 lg:grid-cols-12 lg:gap-8", className)}>
      <Reveal kind="blur-rise" className="lg:col-span-4">
        {details}
      </Reveal>
      <Reveal kind="blur-rise" delay={0.1} className="lg:col-span-7 lg:col-start-6">
        {map}
      </Reveal>
    </div>
  );
}

function CopyAddress() {
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
      <span aria-live="polite">
        {copied ? COPY.location_block.copiedAddress : COPY.location_block.copyAddress}
      </span>
    </button>
  );
}

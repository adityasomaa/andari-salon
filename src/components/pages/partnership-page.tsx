"use client";

/**
 * Kemitraan. No partnership programme has been defined yet, so the page does
 * not describe one. It invites a proposal over WhatsApp and says what to put
 * in it, which is useful today and stays true once a programme exists.
 */

import { Art } from "@/components/shared/art";
import { useCopy } from "@/components/shared/locale-context";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { WhatsAppLink } from "@/components/shared/whatsapp-link";

export function PartnershipPage() {
  const { partnership: P } = useCopy();

  return (
    <section className="t-section" style={{ background: "var(--t-bg)" }}>
      <div className="t-shell grid gap-[clamp(2.5rem,6vw,4.5rem)]">
        <SectionHeader copy={P} as="h1" splitHeadline hideCta />

        <Reveal kind="spring-rise">
          <div className="t-card grid overflow-hidden lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="grid content-center gap-5 p-6 sm:p-10">
              <p className="text-[length:var(--t-h3)] font-medium">{P.briefTitle}</p>
              <ol className="grid gap-3">
                {P.briefItems.map((item, i) => (
                  <li key={item} className="flex items-baseline gap-3">
                    <span
                      className="t-label inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 tabular-nums"
                      style={{ background: "var(--t-accent-soft)" }}
                    >
                      {`0${i + 1}`}
                    </span>
                    <span className="t-body">{item}</span>
                  </li>
                ))}
              </ol>
              <div className="pt-2">
                <WhatsAppLink intent="partnership" className="t-btn t-btn-primary">
                  {P.cta?.label}
                </WhatsAppLink>
              </div>
              <p className="text-[length:var(--t-small)]" style={{ color: "var(--t-fg-faint)" }}>
                {P.briefNote}
              </p>
            </div>
            <div className="relative min-h-[14rem]">
              <div className="absolute inset-0">
                <Art name="column-2" decorative sizes="(min-width: 1024px) 36vw, 100vw" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

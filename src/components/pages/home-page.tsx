"use client";

/**
 * Home. Hero, services summary, location and hours, booking entry. Nothing
 * else: no story section, no manifesto, no invented credentials.
 */

import { COPY } from "@/config/copy";
import type { TemplateId } from "@/config/site";

import { Art } from "@/components/shared/art";
import { Hero } from "@/components/shared/hero";
import { LocationBlock } from "@/components/shared/location-block";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { SampleNotice, ServicesBlock } from "@/components/shared/services-block";
import { templateInfo } from "@/components/shared/template-context";

export function HomePage({ template }: { template: TemplateId }) {
  const key = templateInfo(template).key;

  return (
    <>
      <Hero template={template} />

      <section className="t-section" style={{ background: key === "t2" ? "var(--t-bg-alt)" : "var(--t-bg)" }}>
        <div className="t-shell grid gap-[clamp(2.5rem,6vw,5rem)]">
          <SectionHeader copy={COPY.servicesSummary} index="01" />
          <SampleNotice className={key === "t2" ? "mx-auto max-w-2xl" : undefined} />
          <ServicesBlock template={template} variant="summary" />
        </div>
      </section>

      <section className="t-section" style={{ background: "var(--t-bg)" }}>
        <div className="t-shell grid gap-[clamp(2.5rem,6vw,5rem)]">
          <SectionHeader copy={COPY.location} index="02" />
          <LocationBlock template={template} />
        </div>
      </section>

      <BookingEntry template={template} />
    </>
  );
}

/**
 * The door into booking. Each template frames it differently: t1 sets it
 * against a bleeding band, t2 wraps it in a rounded panel, t3 boxes it in a
 * hairline with the band as a low-contrast ground.
 */
function BookingEntry({ template }: { template: TemplateId }) {
  const key = templateInfo(template).key;

  if (key === "t2") {
    return (
      <section className="t-section" style={{ background: "var(--t-bg-alt)" }}>
        <div className="t-shell">
          <div className="t-card relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <Art template={template} name="band" decorative sizes="100vw" />
            </div>
            <div className="relative grid gap-8 p-6 sm:p-12">
              <SectionHeader copy={COPY.bookingEntry} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (key === "t3") {
    return (
      <section className="t-section relative overflow-hidden" style={{ background: "var(--t-bg)" }}>
        <div className="pointer-events-none absolute inset-0 opacity-45">
          <Art template={template} name="band" decorative sizes="100vw" />
        </div>
        <div className="t-shell relative">
          <div
            className="grid gap-[clamp(2rem,5vw,3.5rem)] p-[clamp(1.5rem,4vw,3.5rem)]"
            style={{ border: "1px solid var(--t-line)", borderRadius: "var(--t-radius)", background: "color-mix(in oklab, var(--t-bg) 82%, transparent)" }}
          >
            <SectionHeader copy={COPY.bookingEntry} index="03" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="t-section relative" style={{ background: "var(--t-bg)" }}>
      <div className="t-shell grid gap-[clamp(2.5rem,6vw,5rem)]">
        <SectionHeader copy={COPY.bookingEntry} index="03" />
        <Reveal kind="blur-rise">
          <div className="relative aspect-[16/6] w-full overflow-hidden">
            <Art template={template} name="band" decorative sizes="100vw" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

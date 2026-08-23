"use client";

/** Booking. Page header, then the form. The form is the section's action, so
 *  the header's own CTA is suppressed rather than duplicated. */

import { COPY } from "@/config/copy";
import type { TemplateId } from "@/config/site";

import { Art } from "@/components/shared/art";
import { BookingForm } from "@/components/shared/booking-form";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { templateInfo } from "@/components/shared/template-context";

export function BookingPage({ template }: { template: TemplateId }) {
  const key = templateInfo(template).key;

  return (
    <section className="t-section" style={{ background: "var(--t-bg)" }}>
      <div className="t-shell grid gap-[clamp(2.5rem,6vw,4.5rem)]">
        <SectionHeader copy={COPY.booking} index="01" as="h1" splitHeadline hideCta />

        {key === "t1" ? (
          <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-12">
            <div className="lg:col-span-7">
              <BookingForm />
            </div>
            <Reveal kind="blur-rise" delay={0.1} className="hidden lg:col-span-4 lg:col-start-9 lg:block">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Art template={template} name="column-1" decorative sizes="30vw" />
              </div>
            </Reveal>
          </div>
        ) : key === "t2" ? (
          <div className="t-card p-5 sm:p-8 lg:p-10">
            <BookingForm />
          </div>
        ) : (
          <div className="grid gap-[clamp(2rem,5vw,3.5rem)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-14">
            <div
              className="p-[clamp(1.25rem,3vw,2.5rem)]"
              style={{ border: "1px solid var(--t-line)", borderRadius: "var(--t-radius)" }}
            >
              <BookingForm />
            </div>
            <Reveal kind="fade" delay={0.1} className="hidden lg:block">
              <div className="relative aspect-[3/4] w-full overflow-hidden" style={{ border: "1px solid var(--t-line)" }}>
                <Art template={template} name="column-1" decorative sizes="30vw" />
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

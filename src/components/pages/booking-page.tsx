"use client";

/** Booking. Page header, then the form. The form is the section's action, so
 *  the header's own CTA is suppressed rather than duplicated. */

import { BookingForm } from "@/components/shared/booking-form";
import { useCopy } from "@/components/shared/locale-context";
import { SectionHeader } from "@/components/shared/section-header";

export function BookingPage() {
  const copy = useCopy();

  return (
    <section className="t-section" style={{ background: "var(--t-bg)" }}>
      <div className="t-shell grid gap-[clamp(2.5rem,6vw,4.5rem)]">
        <SectionHeader copy={copy.booking} as="h1" splitHeadline hideCta />
        <div className="t-card p-5 sm:p-8 lg:p-10">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}

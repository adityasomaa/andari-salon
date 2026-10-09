"use client";

/** Treatment. Page header, then the full menu with prices, by group. */

import { useCopy } from "@/components/shared/locale-context";
import { SectionHeader } from "@/components/shared/section-header";
import { SampleNotice, ServicesBlock } from "@/components/shared/services-block";

export function ServicesPage() {
  const copy = useCopy();

  return (
    <>
      <section className="t-section" style={{ background: "var(--t-bg)" }}>
        <div className="t-shell grid gap-[clamp(2.5rem,6vw,4.5rem)]">
          <SectionHeader copy={copy.services} as="h1" splitHeadline />
          <SampleNotice className="mx-auto max-w-2xl" />
        </div>
      </section>

      <section className="pb-[var(--t-section-y)]" style={{ background: "var(--t-bg-alt)" }}>
        <div className="t-shell" style={{ paddingTop: "clamp(2rem,5vw,4rem)" }}>
          <ServicesBlock variant="full" />
        </div>
      </section>
    </>
  );
}

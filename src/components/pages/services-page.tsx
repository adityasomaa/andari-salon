"use client";

/** Layanan. Page header, sample notice, then the full list by category. */

import { COPY } from "@/config/copy";
import type { TemplateId } from "@/config/site";

import { Art } from "@/components/shared/art";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { SampleNotice, ServicesBlock } from "@/components/shared/services-block";
import { templateInfo } from "@/components/shared/template-context";

export function ServicesPage({ template }: { template: TemplateId }) {
  const key = templateInfo(template).key;

  return (
    <>
      <section className="t-section" style={{ background: "var(--t-bg)" }}>
        <div className="t-shell grid gap-[clamp(2.5rem,6vw,4.5rem)]">
          <SectionHeader copy={COPY.services} index="01" as="h1" splitHeadline />
          <SampleNotice className={key === "t2" ? "mx-auto max-w-2xl" : "max-w-3xl"} />
        </div>
      </section>

      {key === "t1" ? (
        <section className="pb-[var(--t-section-y)]">
          <div className="t-shell grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-12">
            <Reveal kind="blur-rise" className="lg:col-span-3">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Art template={template} name="column-0" decorative sizes="(min-width: 1024px) 24vw, 90vw" />
              </div>
            </Reveal>
            <div className="lg:col-span-9">
              <ServicesBlock template={template} variant="full" />
            </div>
          </div>
        </section>
      ) : (
        <section className="pb-[var(--t-section-y)]" style={{ background: key === "t2" ? "var(--t-bg-alt)" : "var(--t-bg)" }}>
          <div className="t-shell" style={{ paddingTop: key === "t2" ? "clamp(2rem,5vw,4rem)" : 0 }}>
            <ServicesBlock template={template} variant="full" />
          </div>
        </section>
      )}
    </>
  );
}

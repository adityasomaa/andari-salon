"use client";

/** Kontak. Address, map, hours status, WhatsApp and Instagram. Nothing else:
 *  no email, no phone line, no social icons pointing at empty accounts. */

import { COPY } from "@/config/copy";
import type { TemplateId } from "@/config/site";

import { Art } from "@/components/shared/art";
import { LocationBlock } from "@/components/shared/location-block";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { templateInfo } from "@/components/shared/template-context";

export function ContactPage({ template }: { template: TemplateId }) {
  const key = templateInfo(template).key;

  return (
    <>
      <section className="t-section" style={{ background: "var(--t-bg)" }}>
        <div className="t-shell grid gap-[clamp(2.5rem,6vw,4.5rem)]">
          <SectionHeader copy={COPY.contact} index="01" as="h1" splitHeadline />
          <LocationBlock template={template} showContacts />
        </div>
      </section>

      {key === "t1" ? (
        <section className="pb-[var(--t-section-y)]">
          <div className="t-shell">
            <Reveal kind="blur-rise">
              <div className="relative aspect-[16/6] w-full overflow-hidden">
                <Art template={template} name="band" decorative sizes="100vw" />
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  );
}

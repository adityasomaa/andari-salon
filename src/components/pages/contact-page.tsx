"use client";

/** Kontak. Address, map, hours status, WhatsApp and Instagram. Nothing else:
 *  no email, no phone line, no social icons pointing at empty accounts. */

import { useCopy } from "@/components/shared/locale-context";
import { LocationBlock } from "@/components/shared/location-block";
import { SectionHeader } from "@/components/shared/section-header";

export function ContactPage() {
  const copy = useCopy();

  return (
    <section className="t-section" style={{ background: "var(--t-bg)" }}>
      <div className="t-shell grid gap-[clamp(2.5rem,6vw,4.5rem)]">
        <SectionHeader copy={copy.contact} as="h1" splitHeadline />
        <LocationBlock showContacts />
      </div>
    </section>
  );
}

"use client";

/**
 * Produk. The professional products the salon uses, one card per brand
 * line with the client's photo, then the brands from the proposal that have
 * no photo yet. Availability questions go to WhatsApp.
 */

import Image from "next/image";

import { useCopy, useLocale } from "@/components/shared/locale-context";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { SampleNotice } from "@/components/shared/services-block";
import { OTHER_BRANDS, PRODUCTS_ARE_SAMPLE, PRODUCT_GROUPS } from "@/config/products";

export function ProductsPage() {
  const copy = useCopy();
  const locale = useLocale();

  return (
    <>
      <section className="t-section" style={{ background: "var(--t-bg)" }}>
        <div className="t-shell grid gap-[clamp(2.5rem,6vw,4.5rem)]">
          <SectionHeader copy={copy.products} as="h1" splitHeadline />
          <SampleNotice text={copy.products.sampleNotice} show={PRODUCTS_ARE_SAMPLE} className="mx-auto max-w-2xl" />
        </div>
      </section>

      <section className="pb-[var(--t-section-y)]" style={{ background: "var(--t-bg-alt)" }}>
        <div className="t-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ paddingTop: "clamp(2rem,5vw,4rem)" }}>
          {PRODUCT_GROUPS.map((g, i) => (
            <Reveal key={g.id} kind="spring-rise" delay={(i % 4) * 0.06} className="h-full">
              <article className="t-card h-full overflow-hidden">
                <div className="relative aspect-square overflow-hidden" style={{ background: "#fff" }}>
                  <Image
                    src={`/photos/products/${g.photo}.webp`}
                    alt={g.alt[locale]}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="grid gap-2 p-5">
                  <h2 className="text-[length:var(--t-h3)] font-medium">{g.brand}</h2>
                  <p className="t-body text-[length:var(--t-small)]">{g.note[locale]}</p>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal kind="spring-rise" delay={0.18} className="h-full">
            <article className="t-card grid h-full content-center gap-4 p-6">
              <h2 className="text-[length:var(--t-h3)] font-medium">{copy.products.otherTitle}</h2>
              <ul className="flex flex-wrap gap-1.5">
                {OTHER_BRANDS.map((b) => (
                  <li
                    key={b}
                    className="rounded-full px-3 py-1.5 text-[0.82rem]"
                    style={{ background: "var(--t-bg-alt)", color: "var(--t-fg-muted)" }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}

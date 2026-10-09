"use client";

/**
 * Produk. The salon has not said which products it carries, so this lists
 * the ordinary kinds of take-home hair care as a labelled sample, with no
 * brands and no prices, and routes every question to WhatsApp.
 */

import { Art, type ArtName } from "@/components/shared/art";
import { useCopy, useLocale } from "@/components/shared/locale-context";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { SampleNotice } from "@/components/shared/services-block";
import { PRODUCTS_ARE_SAMPLE, PRODUCT_GROUPS } from "@/config/products";

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
            <Reveal key={g.id} kind="spring-rise" delay={i * 0.06}>
              <article className="t-card h-full overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <Art
                    name={`tile-${(i % 4) as 0 | 1 | 2 | 3}` as ArtName}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw"
                    decorative
                  />
                </div>
                <div className="grid gap-2 p-5">
                  <span
                    className="t-label inline-flex w-fit items-center rounded-full px-3 py-1 tabular-nums"
                    style={{ background: "var(--t-accent-soft)" }}
                  >
                    {g.number}
                  </span>
                  <h2 className="text-[length:var(--t-h3)] font-medium">{g.name[locale]}</h2>
                  <p className="t-body text-[length:var(--t-small)]">{g.note[locale]}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

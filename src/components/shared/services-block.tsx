"use client";

/**
 * The treatment menu, in two densities.
 *
 * `summary` is the home-page version: one card per group with the item names
 * as chips. `full` is the treatment page: every item with its price. Items
 * priced by hair length show all four prices under the name, with the sheet's
 * own column headings.
 */

import {
  LENGTHS,
  LENGTH_LABELS,
  SERVICES_ARE_SAMPLE,
  SERVICE_CATEGORIES,
  formatRupiah,
  type Service,
} from "@/config/services";
import type { Locale } from "@/config/i18n";
import { cn } from "@/lib/utils";

import { Art, type ArtName } from "./art";
import { useCopy, useLocale } from "./locale-context";
import { Reveal } from "./reveal";

/** Dashed notice above a list whose contents are still placeholders. */
export function SampleNotice({
  text,
  show = SERVICES_ARE_SAMPLE,
  className,
}: {
  /** Defaults to the treatment-list notice. */
  text?: string;
  show?: boolean;
  className?: string;
}) {
  const copy = useCopy();
  if (!show) return null;
  return (
    <Reveal kind="fade" className={className}>
      <p
        className="p-4 text-[length:var(--t-small)] leading-relaxed sm:p-5"
        style={{
          border: "1px dashed var(--t-line-strong)",
          borderRadius: "var(--t-radius-sm)",
          color: "var(--t-fg-muted)",
        }}
        data-testid="sample-notice"
      >
        {text ?? copy.services.sampleNotice}
      </p>
    </Reveal>
  );
}

export function ServicesBlock({
  variant,
  className,
}: {
  variant: "summary" | "full";
  className?: string;
}) {
  const locale = useLocale();

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", variant === "summary" && "lg:grid-cols-3", className)}>
      {SERVICE_CATEGORIES.map((c, i) => (
        <Reveal key={c.id} kind="spring-rise" delay={(i % 3) * 0.06}>
          <article className="t-card group h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1">
            <div className={cn("relative overflow-hidden", variant === "summary" ? "aspect-[16/7]" : "aspect-[16/6]")}>
              <Art
                name={`tile-${(i % 4) as 0 | 1 | 2 | 3}` as ArtName}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                decorative
              />
            </div>
            <div className="grid gap-3 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span
                  className="t-label inline-flex items-center rounded-full px-3 py-1 tabular-nums"
                  style={{ background: "var(--t-accent-soft)" }}
                >
                  {c.number}
                </span>
                <h3 className="text-[length:var(--t-h3)] font-medium">{c.name[locale]}</h3>
              </div>
              <p className="t-body text-[length:var(--t-small)]">{c.summary[locale]}</p>

              {variant === "full" ? (
                <ul className="mt-1 grid">
                  {c.items.map((s) => (
                    <li key={s.id} className="py-3" style={{ borderTop: "1px solid var(--t-line)" }}>
                      <PriceRow service={s} locale={locale} />
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {c.items.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-full px-3 py-1.5 text-[0.8rem]"
                      style={{ background: "var(--t-bg-alt)", color: "var(--t-fg-muted)" }}
                    >
                      {s.name[locale]}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

function PriceRow({ service: s, locale }: { service: Service; locale: Locale }) {
  const name = (
    <span className="grid gap-0.5">
      <span className="text-[0.95rem] font-medium">{s.name[locale]}</span>
      {s.note ? (
        <span className="text-[0.82rem]" style={{ color: "var(--t-fg-faint)" }}>
          {s.note[locale]}
        </span>
      ) : null}
    </span>
  );

  if (typeof s.price === "number") {
    return (
      <div className="flex items-baseline justify-between gap-4">
        {name}
        <span className="shrink-0 text-[0.92rem] tabular-nums">{formatRupiah(s.price)}</span>
      </div>
    );
  }

  const prices = s.price;
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-4">
        {name}
        {s.from ? (
          <span className="t-label shrink-0" style={{ color: "var(--t-fg-faint)" }}>
            {locale === "en" ? "Starting from" : "Mulai dari"}
          </span>
        ) : null}
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 min-[420px]:grid-cols-4">
        {LENGTHS.map((l) => (
          <div key={l} className="grid gap-0.5">
            <dt className="text-[0.72rem]" style={{ color: "var(--t-fg-faint)" }}>
              {LENGTH_LABELS[l]}
            </dt>
            <dd className="text-[0.88rem] tabular-nums">{formatRupiah(prices[l])}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

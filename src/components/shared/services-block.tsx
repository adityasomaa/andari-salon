"use client";

/**
 * The service list, in two densities and three layouts.
 *
 * `summary` is the home-page version, four category cards. `full` is the
 * services page, every item under its category. Same data either way.
 *
 * A newly opened salon has no menu yet, so the sample notice is not fine
 * print: it sits at the top of the list, in normal reading size.
 *
 * Layouts:
 *   t1  ruled rows, no card chrome, numbers in the margin
 *   t2  rounded cards on a tinted ground, tile graphic per category
 *   t3  hairline-boxed rows with a thin index column
 */

import { COPY } from "@/config/copy";
import { SERVICES_ARE_SAMPLE, SERVICE_CATEGORIES } from "@/config/services";
import type { TemplateId } from "@/config/site";
import { cn } from "@/lib/utils";

import { Art, type ArtName } from "./art";
import { Reveal, RuleDraw } from "./reveal";
import { templateInfo } from "./template-context";

export function SampleNotice({ className }: { className?: string }) {
  if (!SERVICES_ARE_SAMPLE) return null;
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
        {COPY.services.sampleNotice}
      </p>
    </Reveal>
  );
}

export function ServicesBlock({
  template,
  variant,
  className,
}: {
  template: TemplateId;
  variant: "summary" | "full";
  className?: string;
}) {
  const key = templateInfo(template).key;

  if (key === "t1") return <T1 variant={variant} className={className} />;
  if (key === "t2") return <T2 template={template} variant={variant} className={className} />;
  return <T3 variant={variant} className={className} />;
}

/* ------------------------------------------------------ t1, ruled rows */

function T1({
  variant,
  className,
}: {
  variant: "summary" | "full";
  className?: string;
}) {
  return (
    <div className={cn("grid", className)}>
      {SERVICE_CATEGORIES.map((c, i) => (
        <Reveal key={c.id} kind="blur-rise" delay={i * 0.05}>
          <div
            className="grid gap-6 py-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-12 lg:gap-8"
            style={{ borderTop: "1px solid var(--t-line)" }}
          >
            <div className="flex items-baseline gap-5 lg:col-span-4">
              <span className="t-label tabular-nums">{c.number}</span>
              <h3 className="text-[length:var(--t-h3)] leading-tight font-normal">{c.name}</h3>
            </div>

            <p className="t-body text-[length:var(--t-small)] lg:col-span-3">{c.summary}</p>

            {variant === "full" ? (
              <ul className="grid gap-3 lg:col-span-5">
                {c.items.map((s) => (
                  <li key={s.id} className="grid gap-1">
                    <span className="text-[length:var(--t-body)]">{s.name}</span>
                    <span className="text-[0.85rem]" style={{ color: "var(--t-fg-faint)" }}>
                      {s.note}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[length:var(--t-small)] lg:col-span-5" style={{ color: "var(--t-fg-faint)" }}>
                {c.items.map((s) => s.name).join(" · ")}
              </p>
            )}
          </div>
        </Reveal>
      ))}
      <hr className="t-rule" />
    </div>
  );
}

/* -------------------------------------------------- t2, rounded cards */

function T2({
  template,
  variant,
  className,
}: {
  template: TemplateId;
  variant: "summary" | "full";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        variant === "summary" ? "sm:grid-cols-2" : "sm:grid-cols-2",
        className,
      )}
    >
      {SERVICE_CATEGORIES.map((c, i) => (
        <Reveal key={c.id} kind="spring-rise" delay={i * 0.06}>
          <article className="t-card group h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1">
            <div className="relative aspect-[16/9] overflow-hidden" style={{ borderRadius: "0" }}>
              <Art
                template={template}
                name={`tile-${i as 0 | 1 | 2 | 3}` as ArtName}
                sizes="(min-width: 640px) 40vw, 92vw"
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
                <h3 className="text-[length:var(--t-h3)] font-medium">{c.name}</h3>
              </div>
              <p className="t-body text-[length:var(--t-small)]">{c.summary}</p>

              {variant === "full" ? (
                <ul className="mt-1 grid gap-2.5">
                  {c.items.map((s) => (
                    <li
                      key={s.id}
                      className="grid gap-0.5 pt-2.5"
                      style={{ borderTop: "1px solid var(--t-line)" }}
                    >
                      <span className="text-[0.95rem] font-medium">{s.name}</span>
                      <span className="text-[0.85rem]" style={{ color: "var(--t-fg-faint)" }}>
                        {s.note}
                      </span>
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
                      {s.name}
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

/* --------------------------------------------- t3, hairline framed rows */

function T3({
  variant,
  className,
}: {
  variant: "summary" | "full";
  className?: string;
}) {
  return (
    <div className={cn("grid gap-px", className)} style={{ background: "var(--t-line)" }}>
      {SERVICE_CATEGORIES.map((c, i) => (
        <Reveal key={c.id} kind="fade" delay={i * 0.08}>
          <div
            className="grid gap-6 p-[clamp(1.25rem,3vw,2.5rem)] md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10"
            style={{ background: "var(--t-bg)" }}
          >
            <div className="flex items-start gap-4 md:block">
              <span className="t-label tabular-nums">{c.number}</span>
              <RuleDraw className="mt-3 hidden w-8 md:block" delay={0.1} />
            </div>

            <div className="grid gap-2">
              <h3 className="text-[length:var(--t-h3)] font-normal tracking-[0.02em]">{c.name}</h3>
              <p className="t-body text-[length:var(--t-small)]">{c.summary}</p>
            </div>

            {variant === "full" ? (
              <ul className="grid gap-0">
                {c.items.map((s, j) => (
                  <li
                    key={s.id}
                    className="grid gap-0.5 py-3"
                    style={{ borderTop: j === 0 ? "none" : "1px solid var(--t-line)" }}
                  >
                    <span className="text-[length:var(--t-body)]">{s.name}</span>
                    <span className="text-[0.82rem]" style={{ color: "var(--t-fg-faint)" }}>
                      {s.note}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[length:var(--t-small)] leading-relaxed" style={{ color: "var(--t-fg-faint)" }}>
                {c.items.map((s) => s.name).join(", ")}
              </p>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

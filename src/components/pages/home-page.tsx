"use client";

/**
 * Home. Hero, about, treatment summary, location and hours, booking entry.
 * No manifesto, no invented credentials.
 */

import { Art } from "@/components/shared/art";
import { CtaLink } from "@/components/shared/cta-link";
import { Hero } from "@/components/shared/hero";
import { useCopy } from "@/components/shared/locale-context";
import { LocationBlock } from "@/components/shared/location-block";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { SampleNotice, ServicesBlock } from "@/components/shared/services-block";

export function HomePage() {
  const copy = useCopy();

  return (
    <>
      <Hero />

      <About />

      <section className="t-section" style={{ background: "var(--t-bg-alt)" }}>
        <div className="t-shell grid gap-[clamp(2.5rem,6vw,5rem)]">
          <SectionHeader copy={copy.servicesSummary} />
          <SampleNotice className="mx-auto max-w-2xl" />
          <ServicesBlock variant="summary" />
        </div>
      </section>

      <section className="t-section" style={{ background: "var(--t-bg)" }}>
        <div className="t-shell grid gap-[clamp(2.5rem,6vw,5rem)]">
          <SectionHeader copy={copy.location} />
          <LocationBlock />
        </div>
      </section>

      <section className="t-section" style={{ background: "var(--t-bg-alt)" }}>
        <div className="t-shell">
          <div className="t-card relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <Art name="band" decorative sizes="100vw" />
            </div>
            <div className="relative grid gap-8 p-6 sm:p-12">
              <SectionHeader copy={copy.bookingEntry} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * Tentang Andari Salon. Text beside a graphic that holds the place of a photo
 * of the salon until the client's photos arrive.
 */
function About() {
  const { about } = useCopy();

  return (
    <section id="tentang" aria-labelledby="about-heading" className="t-section" style={{ background: "var(--t-bg)" }}>
      <div className="t-shell">
        <div className="t-card grid overflow-hidden lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="grid content-center gap-5 p-6 sm:p-10 lg:p-14">
            <Reveal kind="spring-rise">
              <span
                className="t-label inline-flex w-fit items-center rounded-full px-4 py-2"
                style={{ background: "var(--t-accent-soft)", color: "var(--t-fg-muted)" }}
              >
                {about.label}
              </span>
            </Reveal>
            <Reveal kind="spring-rise" delay={0.05}>
              <h2 id="about-heading" className="t-h2 text-balance-tight">
                {about.headline}
              </h2>
            </Reveal>
            {about.body.map((p, i) => (
              <Reveal key={i} kind="spring-rise" delay={0.1 + i * 0.05}>
                <p className="t-body">{p}</p>
              </Reveal>
            ))}
            <Reveal kind="fade" delay={0.2}>
              <CtaLink cta={about.cta} variant="ghost" />
            </Reveal>
          </div>
          <Reveal kind="fade" className="relative min-h-[16rem] lg:min-h-full">
            <div className="absolute inset-0">
              <Art name="column-0" decorative sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

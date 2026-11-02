"use client";

/**
 * Home. Hero, about, treatment summary, location and hours, booking entry.
 * No manifesto, no invented credentials.
 */

import Image from "next/image";

import { CtaLink } from "@/components/shared/cta-link";
import { Hero } from "@/components/shared/hero";
import { useCopy, useLocale } from "@/components/shared/locale-context";
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
          {/* The client's banner keeps its middle empty for this text. It is
              too wide to crop on a phone, so there it sits above the text
              as a strip, and only overlaps from lg up. The card is white to
              match the banner's ground. */}
          <div className="t-card relative overflow-hidden" style={{ background: "#fff" }}>
            <div className="pointer-events-none relative aspect-[1419/403] w-full lg:absolute lg:inset-0 lg:aspect-auto">
              <Image
                src="/photos/booking-banner.webp"
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1280px) 1200px, 100vw"
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="relative mx-auto grid gap-8 p-6 sm:p-10 lg:max-w-[50%] lg:py-14">
              <SectionHeader copy={copy.bookingEntry} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * Tentang Andari Salon. Text beside the client's photo of the shopfront.
 */
function About() {
  const { about } = useCopy();
  const locale = useLocale();

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
          <div className="relative min-h-[20rem] lg:min-h-full">
            <Image
              src="/photos/exterior.webp"
              alt={locale === "en" ? "The Andari Salon shopfront and sign" : "Tampak depan dan papan nama Andari Salon"}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

/**
 * Kemitraan. Built from the client's partnership proposal: what Andari is,
 * what a partner gets, the investment and the client's own projection, the
 * eleven-step process, the branches, real interior photos, testimonials, and
 * the partnership team's contact.
 *
 * Partnership enquiries go to the partnership team's WhatsApp, not the
 * salon's booking number. The detailed proposal is offered on request rather
 * than published, because that is the order the proposal itself describes.
 */

import Image from "next/image";

import { useCopy, useLocale } from "@/components/shared/locale-context";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { WhatsAppLink } from "@/components/shared/whatsapp-link";
import {
  INVESTMENT,
  PARTNERSHIP_TEXT,
  PHOTOS,
  PLANNED_AREAS,
  PROJECTION,
  TESTIMONIALS,
} from "@/config/partnership";
import { formatRupiah } from "@/config/services";
import {
  ADDRESS,
  BRANCH_GLOGOR,
  CONTACT,
  MAIN_BRANCH_AREA,
  PARTNERSHIP_CONTACT,
} from "@/config/site";
import { cn } from "@/lib/utils";

export function PartnershipPage() {
  const copy = useCopy();
  const locale = useLocale();
  const T = PARTNERSHIP_TEXT[locale];

  return (
    <>
      <section className="t-section" style={{ background: "var(--t-bg)" }}>
        <div className="t-shell grid gap-8">
          <SectionHeader copy={copy.partnership} as="h1" splitHeadline hideCta />
          <Reveal kind="fade" delay={0.15}>
            <ContactButtons className="justify-center" />
          </Reveal>
        </div>
      </section>

      {/* About */}
      <Band alt>
        <Reveal kind="spring-rise">
          <div className="t-card grid overflow-hidden lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="grid content-center gap-5 p-6 sm:p-10 lg:p-14">
              <Chip>{T.about.label}</Chip>
              <h2 className="t-h2 text-balance-tight">{T.about.headline}</h2>
              {T.about.body.map((p) => (
                <p key={p.slice(0, 24)} className="t-body">
                  {p}
                </p>
              ))}
            </div>
            <div className="relative min-h-[18rem]">
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
        </Reveal>
      </Band>

      {/* Support */}
      <Band>
        <Title label={T.support.label} headline={T.support.headline} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {T.support.items.map((item, i) => (
            <Reveal key={item.title} kind="spring-rise" delay={(i % 3) * 0.06}>
              <li className="t-card grid h-full content-start gap-3 p-6">
                <Num>{i + 1}</Num>
                <h3 className="text-[length:var(--t-h3)] font-medium">{item.title}</h3>
                <p className="t-body text-[length:var(--t-small)]">{item.body}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Band>

      {/* Investment and projection */}
      <Band alt>
        <Title label={T.investment.label} headline={T.investment.headline} description={T.investment.description} />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <Reveal kind="spring-rise">
            <div className="t-card grid gap-1 p-6 sm:p-8">
              <dl className="grid">
                {INVESTMENT.items.map((item) => (
                  <Row key={item.amount + item.label.id} label={item.label[locale]} value={formatRupiah(item.amount)} />
                ))}
                <Row label={T.investment.totalLabel} value={formatRupiah(INVESTMENT.total)} strong />
              </dl>
              <div
                className="mt-4 grid gap-1 p-4"
                style={{ background: "var(--t-accent-soft)", borderRadius: "var(--t-radius-sm)" }}
              >
                <p className="flex items-baseline justify-between gap-4 font-medium">
                  <span>{T.investment.depositLabel}</span>
                  <span className="tabular-nums">{formatRupiah(INVESTMENT.deposit)}</span>
                </p>
                <p className="text-[length:var(--t-small)]" style={{ color: "var(--t-fg-muted)" }}>
                  {T.investment.depositNote}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal kind="spring-rise" delay={0.08}>
            <div className="t-card grid gap-5 p-6 sm:p-8">
              <div className="grid gap-1">
                <h3 className="text-[length:var(--t-h3)] font-medium">{T.projection.headline}</h3>
                <p className="text-[length:var(--t-small)]" style={{ color: "var(--t-fg-muted)" }}>
                  {T.projection.assumptions}
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {PROJECTION.scenarios.map((s) => (
                  <div
                    key={s.key}
                    className="grid content-start gap-2 p-4"
                    style={{ border: "1px solid var(--t-line-strong)", borderRadius: "var(--t-radius-sm)" }}
                  >
                    <p className="t-label">{T.projection.scenarioLabels[s.key]}</p>
                    <dl className="grid gap-1.5 text-[0.85rem] md:gap-2">
                      <Stat label={T.projection.rows.guests} value={`${s.guestsPerDay} ${T.projection.perDay}`} />
                      <Stat label={T.projection.rows.revenue} value={formatRupiah(s.revenueMonth)} />
                      <Stat label={T.projection.rows.cost} value={formatRupiah(s.costMonth)} />
                      <Stat label={T.projection.rows.net} value={formatRupiah(s.netMonth)} strong />
                      <Stat label={T.projection.rows.roi} value={`${s.roiYearPercent}%`} />
                      <Stat label={T.projection.rows.payback} value={`${s.paybackMonths} ${T.projection.months}`} />
                    </dl>
                  </div>
                ))}
              </div>
              <p className="text-[0.8rem] leading-relaxed" style={{ color: "var(--t-fg-muted)" }}>
                {T.projection.costNote}
              </p>
              <p
                className="p-3 text-[0.8rem] leading-relaxed"
                style={{ border: "1px dashed var(--t-line-strong)", borderRadius: "var(--t-radius-sm)", color: "var(--t-fg-muted)" }}
                data-testid="projection-disclaimer"
              >
                {T.projection.disclaimer}
              </p>
            </div>
          </Reveal>
        </div>
      </Band>

      {/* Process */}
      <Band>
        <Title label={T.steps.label} headline={T.steps.headline} />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {T.steps.items.map((step, i) => (
            <Reveal key={step} kind="spring-rise" delay={(i % 3) * 0.05}>
              <li className="t-card flex h-full items-center gap-4 p-4 sm:p-5">
                <Num>{i + 1}</Num>
                <span className="font-medium">{step}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </Band>

      {/* Branches */}
      <Band alt>
        <Title label={T.branches.label} headline={T.branches.headline} />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { area: MAIN_BRANCH_AREA, address: ADDRESS.full, maps: ADDRESS.mapsUrl },
            { area: BRANCH_GLOGOR.area, address: BRANCH_GLOGOR.address, maps: BRANCH_GLOGOR.mapsUrl },
          ].map((b, i) => (
            <Reveal key={b.area} kind="spring-rise" delay={i * 0.06}>
              <div className="t-card grid h-full content-start gap-2 p-6">
                <h3 className="text-[length:var(--t-h3)] font-medium">
                  {T.branches.branchPrefix} {b.area}
                </h3>
                <address className="t-body text-[length:var(--t-small)] not-italic">{b.address}</address>
                <a
                  href={b.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 w-fit text-[length:var(--t-small)] underline underline-offset-4"
                >
                  {copy.location_block.openMaps}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal kind="spring-rise">
          <div className="t-card grid gap-4 p-6 sm:p-8">
            <h3 className="text-[length:var(--t-h3)] font-medium">{T.branches.plannedTitle}</h3>
            <p className="text-[length:var(--t-small)]" style={{ color: "var(--t-fg-muted)" }}>
              {T.branches.plannedNote}
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {PLANNED_AREAS.map((a) => (
                <li
                  key={a}
                  className="rounded-full px-3 py-1.5 text-[0.82rem]"
                  style={{ background: "var(--t-bg-alt)", color: "var(--t-fg-muted)" }}
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Band>

      {/* Interior */}
      <Band>
        <Title label={T.gallery.label} headline={T.gallery.headline} />
        <div className="grid gap-3 md:grid-cols-3 md:grid-rows-2">
          <div className="relative aspect-[4/5] overflow-hidden md:row-span-2 md:aspect-auto">
            <Photo
              src="/photos/styling.webp"
              alt={locale === "en" ? "Styling chairs in front of lit arched mirrors" : "Kursi styling di depan cermin melengkung berlampu"}
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          </div>
          {PHOTOS.map((p) => (
            <div key={p.src} className="relative aspect-[16/9] overflow-hidden">
              <Photo src={p.src} alt={p.alt[locale]} sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
          ))}
        </div>
      </Band>

      {/* Testimonials */}
      <Band alt>
        <Title label={T.testimonials.label} headline={T.testimonials.headline} description={T.testimonials.note} />
        <ul className="grid gap-4 sm:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} kind="spring-rise" delay={(i % 2) * 0.06}>
              <li className="t-card grid h-full content-start gap-3 p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{t.name}</p>
                  <Stars label={locale === "en" ? "5 out of 5 stars" : "5 dari 5 bintang"} />
                </div>
                <blockquote lang="id" className="t-body text-[length:var(--t-small)]">
                  {t.text}
                </blockquote>
              </li>
            </Reveal>
          ))}
        </ul>
      </Band>

      {/* Contact */}
      <Band>
        <Reveal kind="spring-rise">
          <div className="t-card grid gap-6 p-6 text-center sm:p-12">
            <div className="grid justify-items-center gap-4">
              <Chip>{T.contact.label}</Chip>
              <h2 className="t-h2 text-balance-tight">{T.contact.headline}</h2>
              <p className="t-body mx-auto max-w-xl">{T.contact.description}</p>
            </div>
            <dl className="mx-auto grid w-full max-w-md gap-2 text-left text-[length:var(--t-small)]">
              <Row label={T.contact.whatsapp} value={PARTNERSHIP_CONTACT.whatsappDisplay} />
              <Row label={T.contact.email} value={PARTNERSHIP_CONTACT.email} />
              <Row label={T.contact.instagram} value={CONTACT.instagramHandle} />
            </dl>
            <ContactButtons className="justify-center" />
          </div>
        </Reveal>
      </Band>
    </>
  );
}

/* ------------------------------------------------------------- pieces */

function ContactButtons({ className }: { className?: string }) {
  const T = PARTNERSHIP_TEXT[useLocale()];
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <WhatsAppLink
        className="t-btn t-btn-primary"
        number={PARTNERSHIP_CONTACT.whatsappE164}
        message={T.waMessage}
        data-testid="partnership-wa"
      >
        {T.ctaPrimary}
      </WhatsAppLink>
      <a href={`mailto:${PARTNERSHIP_CONTACT.email}`} className="t-btn t-btn-ghost">
        {T.ctaEmail}
      </a>
    </div>
  );
}

function Band({ alt = false, children }: { alt?: boolean; children: React.ReactNode }) {
  return (
    <section className="t-section" style={{ background: alt ? "var(--t-bg-alt)" : "var(--t-bg)" }}>
      <div className="t-shell grid gap-[clamp(2rem,5vw,3.5rem)]">{children}</div>
    </section>
  );
}

function Title({ label, headline, description }: { label: string; headline: string; description?: string }) {
  return (
    <Reveal kind="spring-rise">
      <header className="flex flex-col items-center gap-4 text-center">
        <Chip>{label}</Chip>
        <h2 className="t-h2 text-balance-tight max-w-3xl">{headline}</h2>
        {description ? <p className="t-body mx-auto max-w-2xl text-center">{description}</p> : null}
      </header>
    </Reveal>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="t-label inline-flex w-fit items-center rounded-full px-4 py-2"
      style={{ background: "var(--t-accent-soft)", color: "var(--t-fg-muted)" }}
    >
      {children}
    </span>
  );
}

function Num({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[0.85rem] font-medium tabular-nums"
      style={{ background: "var(--t-accent)", color: "var(--t-accent-fg)" }}
    >
      {children}
    </span>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 py-3"
      style={{ borderTop: "1px solid var(--t-line)" }}
    >
      <dt style={{ color: strong ? "var(--t-fg)" : "var(--t-fg-muted)", fontWeight: strong ? 500 : 400 }}>{label}</dt>
      <dd className="shrink-0 tabular-nums" style={{ fontWeight: strong ? 500 : 400 }}>
        {value}
      </dd>
    </div>
  );
}

function Stat({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 md:grid md:gap-0.5">
      <dt className="text-[0.75rem]" style={{ color: "var(--t-fg-faint)" }}>
        {label}
      </dt>
      <dd className="tabular-nums" style={{ fontWeight: strong ? 600 : 400 }}>
        {value}
      </dd>
    </div>
  );
}

function Photo({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized
      className="object-cover"
      style={{ borderRadius: "var(--t-radius)" }}
    />
  );
}

function Stars({ label }: { label: string }) {
  return (
    <span role="img" aria-label={label} className="flex shrink-0 gap-0.5" style={{ color: "var(--t-accent)" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} aria-hidden viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
          <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

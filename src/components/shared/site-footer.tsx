"use client";

/**
 * Footer, so every page ends on an action.
 *
 * The CTA swaps target when the visitor is already on the page it points at:
 * on /booking, "Booking sekarang" would send them nowhere, so it becomes a
 * direct WhatsApp message instead.
 *
 * Also the second place the address and the opening-hours status appear, since
 * a salon is somewhere people physically go.
 */

import { usePathname } from "next/navigation";

import { COPY } from "@/config/copy";
import { ADDRESS, CONTACT, LEGAL_NAV, NAV, OPENING_HOURS, SITE, SOCIALS } from "@/config/site";
import { cn } from "@/lib/utils";

import { useCookieConsent } from "./cookie-consent";
import { Wordmark } from "./logo";
import { TransitionLink } from "./page-transition";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";
import { useTemplate } from "./template-context";

export function SiteFooter() {
  const template = useTemplate();
  const key = template?.key ?? "t1";
  const base = template?.base ?? "";
  const pathname = usePathname();
  const { open: openCookies } = useCookieConsent();

  const bookingHref = `${base}/booking`;
  const onBooking = pathname === bookingHref;

  // Already on the destination: point somewhere useful instead.
  const ctaCopy = onBooking
    ? {
        label: COPY.footerCta.label,
        headline: COPY.footerCta.alt.headline,
        description: COPY.footerCta.alt.description,
        cta: COPY.footerCta.alt.cta,
      }
    : {
        label: COPY.footerCta.label,
        headline: COPY.footerCta.headline,
        description: COPY.footerCta.description,
        cta: COPY.footerCta.cta,
      };

  const navItems = NAV.map((n) => ({ ...n, href: `${base}${n.href}` }));

  return (
    <footer
      className="relative"
      style={{ background: key === "t2" ? "var(--t-bg-alt)" : "var(--t-bg)", borderTop: "1px solid var(--t-line)" }}
    >
      <div className="t-shell" style={{ paddingBlock: "var(--t-section-y)" }}>
        <SectionHeader
          copy={ctaCopy}
          index={key === "t1" ? "05" : undefined}
          ctaVariant={key === "t1" ? "quiet" : "primary"}
        />
      </div>

      <div className="t-shell">
        <hr className="t-rule" />
      </div>

      <div className="t-shell grid gap-10 py-12 lg:grid-cols-12 lg:gap-8">
        <div className={cn("lg:col-span-4")}>
          <Wordmark tone={key === "t3" ? "bone" : "olive"} width={150} className="w-[140px]" />
          <p className="t-body mt-4 max-w-xs text-[length:var(--t-small)]">{COPY.brand.tagline}</p>
        </div>

        <FooterCol title={COPY.footer.addressTitle} className="lg:col-span-3">
          <address className="t-body text-[length:var(--t-small)] not-italic">
            {ADDRESS.line1}
            <br />
            {ADDRESS.village}, {ADDRESS.district}
            <br />
            {ADDRESS.city}, {ADDRESS.province} {ADDRESS.postalCode}
          </address>
          <a
            href={ADDRESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-[length:var(--t-small)] underline underline-offset-4"
          >
            {COPY.location_block.openMaps}
          </a>
        </FooterCol>

        <FooterCol title={COPY.footer.contactTitle} className="lg:col-span-2">
          <ul className="grid gap-1.5 text-[length:var(--t-small)]">
            <li>
              <a
                href={`https://wa.me/${CONTACT.whatsappE164}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                {CONTACT.whatsappDisplay}
              </a>
            </li>
            {SOCIALS.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {s.handle}
                </a>
              </li>
            ))}
          </ul>

          <p className="t-label mt-5">{COPY.footer.hoursTitle}</p>
          <HoursText className="mt-1.5" />
        </FooterCol>

        <FooterCol title={COPY.footer.navTitle} className="lg:col-span-3">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
            <ul className="grid gap-1.5 text-[length:var(--t-small)]">
              {navItems.map((n) => (
                <li key={n.key}>
                  <TransitionLink href={n.href} className="hover:underline hover:underline-offset-4">
                    {n.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
            <ul className="grid gap-1.5 text-[length:var(--t-small)]">
              {LEGAL_NAV.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:underline hover:underline-offset-4">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openCookies}
                  className="text-left hover:underline hover:underline-offset-4"
                >
                  {COPY.cookies.settingsLink}
                </button>
              </li>
            </ul>
          </div>
        </FooterCol>
      </div>

      <div className="t-shell">
        <hr className="t-rule" />
        <div className="flex flex-wrap items-center justify-between gap-3 py-6 text-[0.78rem]" style={{ color: "var(--t-fg-faint)" }}>
          <p>
            {new Date().getFullYear()} {COPY.footer.rights}
          </p>
          <p>{SITE.url.replace("https://", "")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal kind="fade" className={className}>
      <p className="t-label mb-3">{title}</p>
      {children}
    </Reveal>
  );
}

/**
 * Opening hours are not known. This prints that plainly rather than guessing,
 * and switches to a real schedule the moment OPENING_HOURS is filled in.
 */
export function HoursText({ className }: { className?: string }) {
  if (OPENING_HOURS.status === "unset") {
    return (
      <div className={cn("text-[length:var(--t-small)]", className)}>
        <p style={{ color: "var(--t-fg-muted)" }}>{OPENING_HOURS.unknownLabel}</p>
        <p className="mt-0.5" style={{ color: "var(--t-fg-faint)" }}>
          {OPENING_HOURS.unknownHint}
        </p>
      </div>
    );
  }
  return (
    <ul className={cn("grid gap-1 text-[length:var(--t-small)]", className)}>
      {OPENING_HOURS.days.map((d) => (
        <li key={d.day} className="flex justify-between gap-4">
          <span>{d.label}</span>
          <span className="tabular-nums" style={{ color: "var(--t-fg-muted)" }}>
            {d.opens}–{d.closes}
          </span>
        </li>
      ))}
    </ul>
  );
}

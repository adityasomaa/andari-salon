"use client";

/**
 * The link-in-bio page.
 *
 * Wears template 2's clothes: warm sand ground, 24px cards, pill controls,
 * medium weight, centred and compact, springy motion. It declares
 * `data-template="t2"` itself rather than going through TemplateShell, because
 * a link hub wants no site navigation, no footer and no preview switcher.
 *
 * Every row comes from src/config/links.ts. WhatsApp rows go through the same
 * WhatsAppLink component as the rest of the site, so a message sent from here
 * still says which page and which button it came from.
 */

import Link from "next/link";

import { Art } from "@/components/shared/art";
import { Wordmark } from "@/components/shared/logo";
import { Reveal } from "@/components/shared/reveal";
import { HoursText } from "@/components/shared/site-footer";
import { WhatsAppLink } from "@/components/shared/whatsapp-link";
import { COPY } from "@/config/copy";
import { HUB, type HubLink } from "@/config/links";
import { ADDRESS, LEGAL_NAV } from "@/config/site";
import { cn } from "@/lib/utils";

export function LinkHub() {
  return (
    <div data-template="t2" className="min-h-screen-svh" style={{ background: "var(--t-bg)" }}>
      <main id="main" className="mx-auto w-full max-w-[30rem] px-5 pt-10 pb-16 sm:pt-14">
        <header className="flex flex-col items-center text-center">
          {/* Same generated family as the site, kept small so it frames rather
              than competes with the list. */}
          <Reveal kind="spring-rise">
            <div
              className="relative mb-7 h-28 w-full overflow-hidden sm:h-32"
              style={{ borderRadius: "var(--t-radius)" }}
            >
              <Art template="template-2" name="band" decorative sizes="(min-width: 640px) 30rem, 92vw" />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(80% 120% at 50% 50%, color-mix(in oklab, var(--t-bg) 55%, transparent), transparent 75%)",
                }}
              />
            </div>
          </Reveal>

          <Reveal kind="spring-rise" delay={0.05}>
            <Wordmark tone="olive" width={190} className="w-[168px] sm:w-[190px]" priority />
          </Reveal>

          <Reveal kind="spring-rise" delay={0.1}>
            <p className="t-label mt-4">{HUB.tagline}</p>
          </Reveal>

          <Reveal kind="spring-rise" delay={0.15}>
            <p className="t-body mx-auto mt-2 text-center text-[length:var(--t-small)]">{HUB.intro}</p>
          </Reveal>
        </header>

        <nav aria-label="Tautan Andari Salon" className="mt-8">
          <ul className="grid gap-3">
            {HUB.links.map((link, i) => (
              <li key={link.id}>
                <Reveal kind="spring-rise" delay={0.2 + i * 0.05}>
                  <Row link={link} />
                </Reveal>
              </li>
            ))}
          </ul>
        </nav>

        <Reveal kind="spring-rise" delay={0.55}>
          <section
            className="t-card mt-8 p-5"
            aria-label={`${HUB.addressTitle} dan ${HUB.hoursTitle}`}
          >
            <p className="t-label">{HUB.addressTitle}</p>
            <address className="t-body mt-1.5 text-[length:var(--t-small)] not-italic">
              {ADDRESS.full}
            </address>

            <p className="t-label mt-5">{HUB.hoursTitle}</p>
            <HoursText className="mt-1.5" />
          </section>
        </Reveal>

        <Reveal kind="fade" delay={0.65}>
          <footer
            className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-[0.78rem]"
            style={{ color: "var(--t-fg-faint)" }}
          >
            {LEGAL_NAV.map((l) => (
              <Link key={l.href} href={l.href} className="underline underline-offset-4">
                {l.label}
              </Link>
            ))}
            <span>
              {new Date().getFullYear()} {COPY.footer.rights}
            </span>
          </footer>
        </Reveal>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ row */

function Row({ link }: { link: HubLink }) {
  const inner = (
    <>
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
        style={{
          background: link.primary ? "color-mix(in oklab, var(--t-accent-fg) 22%, transparent)" : "var(--t-accent-soft)",
          color: link.primary ? "var(--t-accent-fg)" : "var(--t-fg-muted)",
        }}
      >
        <Icon kind={link.kind} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[0.98rem] leading-snug font-medium">{link.label}</span>
        <span
          className="mt-0.5 block text-[0.82rem] leading-snug"
          style={{ color: link.primary ? "color-mix(in oklab, var(--t-accent-fg) 78%, transparent)" : "var(--t-fg-faint)" }}
        >
          {link.note}
        </span>
      </span>

      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      >
        <path d="M2 8h11M9 4l4 4-4 4" />
      </svg>
    </>
  );

  const className = cn(
    "group flex w-full items-center gap-3.5 p-4 text-left transition-[transform,box-shadow,background-color] duration-300",
    "hover:-translate-y-0.5 active:translate-y-0",
  );

  const style: React.CSSProperties = link.primary
    ? {
        background: "var(--t-accent)",
        color: "var(--t-accent-fg)",
        border: "1px solid var(--t-accent)",
        borderRadius: "var(--t-radius)",
      }
    : {
        background: "var(--t-surface)",
        color: "var(--t-fg)",
        border: "1px solid var(--t-line)",
        borderRadius: "var(--t-radius)",
      };

  if (link.kind === "whatsapp") {
    return (
      <WhatsAppLink
        className={className}
        style={style}
        buttonLabel={link.buttonLabel ?? link.label}
        fallbackPath="/booking"
      >
        {inner}
      </WhatsAppLink>
    );
  }

  const external = link.href?.startsWith("http");
  if (external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={link.href ?? "/"} className={className} style={style}>
      {inner}
    </Link>
  );
}

/* ----------------------------------------------------------------- icons */

function Icon({ kind }: { kind: HubLink["kind"] }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "size-[18px]",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (kind === "whatsapp") {
    return (
      <svg {...common} fill="currentColor" stroke="none">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.38-1.99-1.23-.74-.65-1.23-1.46-1.38-1.71-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.72 2.62 4.16 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.47-.29Z" />
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "maps") {
    return (
      <svg {...common}>
        <path d="M12 21s7-5.4 7-10.5A7 7 0 0 0 5 10.5C5 15.6 12 21 12 21Z" />
        <circle cx="12" cy="10.5" r="2.5" />
      </svg>
    );
  }
  if (kind === "form") {
    return (
      <svg {...common}>
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 9.5h17M8.5 3v4M15.5 3v4" />
        <path d="M8.5 14.5l2 2 4.5-4.5" />
      </svg>
    );
  }
  if (kind === "services") {
    return (
      <svg {...common}>
        <path d="M4 5h16M4 12h16M4 19h10" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9h16.8M3.6 15h16.8" />
      <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
    </svg>
  );
}

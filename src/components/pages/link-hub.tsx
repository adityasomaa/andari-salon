"use client";

/**
 * The link-in-bio page.
 *
 * One screen, no scrolling. Wordmark, one line, a stack of pills, nothing
 * else: no banner graphic, no address card, no site chrome. Anything that
 * would push the page past the fold has been cut rather than shrunk.
 *
 * Height uses 100svh, not 100vh. On a phone, 100vh is the height with the
 * browser chrome hidden, so a 100vh page is taller than what you can actually
 * see and scrolls by exactly the height of the address bar. svh is the
 * smallest viewport height, which is the one that guarantees it fits.
 *
 * The page is deliberately not `overflow: hidden`. It fits at normal text
 * size, so there is nothing to scroll to; if someone enlarges text well past
 * default, scrolling is how they reach the last row, and trapping it would
 * lock them out of it.
 *
 * Template 2's tokens: warm sand ground, pill controls, medium weight,
 * springy motion. Rows come from src/config/links.ts, one Hub per salon.
 */

import Link from "next/link";
import { useId, useRef } from "react";

import { Wordmark } from "@/components/shared/logo";
import { WhatsAppLink } from "@/components/shared/whatsapp-link";
import { useCopy } from "@/components/shared/locale-context";
import { href } from "@/config/i18n";
import type { Hub, HubChoice, HubLink } from "@/config/links";

export function LinkHub({ hub }: { hub: Hub }) {
  const copy = useCopy();
  return (
    <div
      data-template="t2"
      className="flex min-h-[100svh] flex-col items-center justify-center px-5 py-6 squat:py-4"
      style={{ background: "var(--t-bg)" }}
    >
      <main
        id="main"
        className="flex w-full max-w-[26rem] flex-col items-center squat:max-w-[40rem]"
        style={{ animation: "hub-in 520ms cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <Wordmark
          tone="olive"
          width={190}
          className="w-[150px] short:w-[128px] sm:w-[176px]"
          priority
        />

        <p className="t-label mt-3 short:mt-2 squat:mt-1.5">{hub.tagline}</p>

        <nav aria-label={hub.label} className="mt-7 w-full short:mt-5 squat:mt-4">
          <ul className="grid gap-2.5 short:gap-2 squat:grid-cols-2">
            {hub.links.map((link) => (
              <li key={link.id}>
                <Row link={link} />
              </li>
            ))}
          </ul>
        </nav>

        <p
          className="mt-6 flex flex-wrap items-center justify-center gap-x-3 text-[0.72rem] short:mt-4 squat:mt-3"
          style={{ color: "var(--t-fg-faint)" }}
        >
          {copy.legalNav.map((l) => (
            <Link key={l.key} href={href(l.key, "id")} className="underline underline-offset-4">
              {l.label}
            </Link>
          ))}
        </p>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ row */

const ROW_CLASS =
  "flex w-full items-center justify-center gap-2.5 px-5 text-[0.95rem] font-medium " +
  "h-[52px] short:h-[46px] short:text-[0.9rem] " +
  "transition-transform duration-200 hover:-translate-y-px active:translate-y-0";

function Row({ link }: { link: HubLink }) {
  const style: React.CSSProperties = {
    borderRadius: "var(--t-radius-pill)",
    ...(link.primary
      ? {
          background: "var(--t-accent)",
          color: "var(--t-accent-fg)",
          border: "1px solid var(--t-accent)",
        }
      : {
          background: "var(--t-surface)",
          color: "var(--t-fg)",
          border: "1px solid var(--t-line-strong)",
        }),
  };

  const inner = (
    <>
      <Icon kind={link.kind} />
      <span>{link.label}</span>
    </>
  );

  if (link.choices) {
    return (
      <ChoiceRow title={link.choices.title} items={link.choices.items} kind={link.kind} style={style}>
        {inner}
      </ChoiceRow>
    );
  }

  if (link.kind === "whatsapp") {
    return (
      <WhatsAppLink className={ROW_CLASS} style={style} message={link.message} number={link.number}>
        {inner}
      </WhatsAppLink>
    );
  }

  if (link.href?.startsWith("http")) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={ROW_CLASS} style={style}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={link.href ?? "/"} className={ROW_CLASS} style={style}>
      {inner}
    </Link>
  );
}

/* ------------------------------------------------------- branch chooser */

/**
 * A row that opens a short list, e.g. "which branch?". Native <dialog> with
 * showModal(): the browser supplies the top layer, the backdrop, Escape to
 * close, focus moved inside and returned to the row on close, so none of
 * that is re-implemented here, and it sits above everything without a
 * z-index of its own.
 */
function ChoiceRow({
  title,
  items,
  kind,
  style,
  children,
}: {
  title: string;
  items: HubChoice[];
  kind: HubLink["kind"];
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        className={ROW_CLASS}
        style={style}
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        {children}
      </button>

      <dialog
        ref={ref}
        aria-labelledby={titleId}
        data-template="t2"
        className="hub-sheet m-auto w-[min(26rem,calc(100vw-2.5rem))] p-0"
        // A click on the backdrop lands on the dialog element itself.
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        style={{
          background: "var(--t-bg)",
          color: "var(--t-fg)",
          border: "1px solid var(--t-line-strong)",
          borderRadius: "var(--t-radius)",
        }}
      >
        <div className="grid gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <p id={titleId} className="text-[1.05rem] font-medium">
              {title}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Tutup"
              className="flex size-10 shrink-0 items-center justify-center"
              style={{ border: "1px solid var(--t-line-strong)", borderRadius: "var(--t-radius-pill)" }}
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <ul className="grid gap-2.5">
            {items.map((c) => {
              const body = (
                <>
                  <Icon kind={kind} />
                  <span className="grid min-w-0 gap-0.5 text-left">
                    <span className="font-medium">{c.label}</span>
                    {c.detail ? (
                      <span className="text-[0.75rem] leading-snug" style={{ color: "var(--t-fg-muted)" }}>
                        {c.detail}
                      </span>
                    ) : null}
                  </span>
                </>
              );
              const cls = "flex w-full items-center gap-3 px-4 py-3 text-[0.92rem]";
              const cstyle: React.CSSProperties = {
                background: "var(--t-surface)",
                border: "1px solid var(--t-line-strong)",
                borderRadius: "var(--t-radius-sm)",
              };
              return (
                <li key={c.label}>
                  {c.number || c.message ? (
                    <WhatsAppLink className={cls} style={cstyle} message={c.message} number={c.number} onClick={close}>
                      {body}
                    </WhatsAppLink>
                  ) : (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className={cls} style={cstyle} onClick={close}>
                      {body}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </dialog>
    </>
  );
}

/* ----------------------------------------------------------------- icons */

function Icon({ kind }: { kind: HubLink["kind"] }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "size-[17px] shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
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
  if (kind === "partnership") {
    return (
      <svg {...common}>
        <path d="M8 11l2.5 2.5a1.8 1.8 0 0 0 2.5 0l4-4" />
        <path d="M3 9l4-4 4 2 2-1 4 1 4 4-7 7-2-2-2 2-7-7z" />
      </svg>
    );
  }
  if (kind === "review") {
    return (
      <svg {...common}>
        <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
      </svg>
    );
  }
  if (kind === "services") {
    return (
      <svg {...common}>
        <path d="M4 6h16M4 12h16M4 18h10" />
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

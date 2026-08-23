import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Art } from "@/components/shared/art";
import { Wordmark } from "@/components/shared/logo";
import { COPY } from "@/config/copy";
import { LIVE_TEMPLATE, PREVIEW_MODE } from "@/config/preview";
import { LEGAL_NAV, SITE, TEMPLATES } from "@/config/site";

/**
 * The chooser.
 *
 * This page is for the client and the studio, not for salon visitors, so it is
 * deliberately plain: it is not one of the three designs and should not be
 * read as one. When PREVIEW_MODE is turned off it stops existing and `/`
 * redirects to whichever template was chosen.
 */

export const metadata: Metadata = {
  title: COPY.chooser.title,
  description: COPY.chooser.lead,
  robots: { index: false, follow: false },
  alternates: { canonical: SITE.url },
};

export default function ChooserPage() {
  if (!PREVIEW_MODE) redirect(`/${LIVE_TEMPLATE}`);

  return (
    <div className="min-h-screen-svh bg-[#f3f1ea] text-[#2b2a20]">
      <main id="main" className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-20">
        <header className="grid gap-6">
          <Wordmark tone="olive" width={180} className="w-[150px] sm:w-[180px]" priority />
          <div className="grid max-w-2xl gap-3">
            <h1 className="text-[clamp(1.6rem,3.4vw,2.4rem)] leading-tight font-medium tracking-tight">
              {COPY.chooser.title}
            </h1>
            <p className="text-[0.98rem] leading-relaxed text-[#4a4740]">{COPY.chooser.lead}</p>
          </div>
        </header>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {TEMPLATES.map((t) => (
            <li key={t.id}>
              <Link
                href={t.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#57554033] bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(43,42,32,0.5)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-[#57554022]">
                  <Art
                    template={t.id}
                    name="hero"
                    decorative
                    sizes="(min-width: 768px) 32vw, 90vw"
                    className="size-full object-cover"
                  />
                </div>
                <div className="grid flex-1 gap-2.5 p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-[0.7rem] tracking-[0.22em] text-[#6f6c52] tabular-nums">
                      {t.number}
                    </span>
                    <h2 className="text-[1.05rem] font-medium">{t.name}</h2>
                  </div>
                  <p className="text-[0.9rem] leading-relaxed text-[#4a4740]">{t.blurb}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[0.85rem] font-medium text-[#575540]">
                    {COPY.chooser.openLabel}
                    <svg
                      aria-hidden
                      viewBox="0 0 16 16"
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    >
                      <path d="M2 8h11M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <footer className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#57554022] pt-6 text-[0.82rem] text-[#6f6c52]">
          <p>{COPY.chooser.note}</p>
          <nav className="flex gap-4">
            {LEGAL_NAV.map((l) => (
              <Link key={l.href} href={l.href} className="underline underline-offset-4">
                {l.label}
              </Link>
            ))}
          </nav>
        </footer>
      </main>
    </div>
  );
}

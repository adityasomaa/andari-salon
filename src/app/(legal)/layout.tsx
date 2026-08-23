import Link from "next/link";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/shared/logo";
import { COPY } from "@/config/copy";
import { LEGAL_NAV, SITE } from "@/config/site";

/**
 * One set of legal pages, shared by all three templates. They carry no design
 * opinion of their own, and no invented numbers, dates, company entities or
 * jurisdictions.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen-svh bg-[#fbfaf7] text-[#2b2a20]">
      <header className="border-b border-[#57554022]">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-5">
          <Link href="/" aria-label={`${SITE.name}, beranda`}>
            <Wordmark tone="olive" width={130} className="w-[120px]" />
          </Link>
          <nav className="flex gap-4 text-[0.82rem]">
            {LEGAL_NAV.map((l) => (
              <Link key={l.href} href={l.href} className="underline underline-offset-4">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto w-full max-w-3xl px-6 py-12 [&_h2]:mt-10 [&_h2]:text-[1.15rem] [&_h2]:font-medium [&_li]:leading-relaxed [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-[#4a4740] [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:ps-5 [&_ul]:text-[#4a4740]"
      >
        {children}
      </main>

      <footer className="mx-auto w-full max-w-3xl px-6 pb-12 text-[0.8rem] text-[#6f6c52]">
        <p>
          {new Date().getFullYear()} {COPY.footer.rights}
        </p>
      </footer>
    </div>
  );
}

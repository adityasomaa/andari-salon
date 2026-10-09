"use client";

/**
 * ID / EN toggle.
 *
 * Plain anchors, not client-side links: the two languages are two root
 * layouts (they set different `<html lang>`), and crossing root layouts is a
 * full page load in Next anyway. Each link goes to the same page in the other
 * language, not to its home.
 */

import { usePathname } from "next/navigation";

import { LOCALES, LOCALE_META, translatePath } from "@/config/i18n";
import { cn } from "@/lib/utils";

import { useCopy, useLocale } from "./locale-context";

export function LanguageSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  const copy = useCopy();
  const pathname = usePathname();

  return (
    <nav aria-label={copy.nav.language} className={cn("shrink-0", className)}>
      <ul
        className="flex items-center gap-0.5 p-0.5"
        style={{ border: "1px solid var(--t-line-strong)", borderRadius: "var(--t-radius-pill)" }}
      >
        {LOCALES.map((l) => {
          const current = l === locale;
          const meta = LOCALE_META[l];
          return (
            <li key={l}>
              <a
                href={translatePath(pathname, l)}
                hrefLang={meta.htmlLang}
                lang={meta.htmlLang}
                aria-current={current ? "true" : undefined}
                className="inline-flex h-9 min-w-10 items-center justify-center px-2.5 text-[0.75rem] font-medium tracking-[0.06em] transition-colors"
                style={{
                  borderRadius: "var(--t-radius-pill)",
                  background: current ? "var(--t-accent)" : "transparent",
                  color: current ? "var(--t-accent-fg)" : "var(--t-fg-muted)",
                }}
              >
                {meta.short}
                <span className="sr-only">, {meta.name}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

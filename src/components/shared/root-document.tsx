import type { ReactNode } from "react";

import { getCopy } from "@/config/copy";
import { LOCALE_META, type Locale } from "@/config/i18n";
import { localBusinessJsonLd } from "@/lib/seo";

import { CookieConsentProvider } from "./cookie-consent";
import { LocaleProvider } from "./locale-context";
import { SmoothScroll } from "./smooth-scroll";
import { UIStateProvider } from "./ui-state";

/**
 * `<html>` and `<body>` for both root layouts.
 *
 * Indonesian and English are two root layouts, app/(id) and app/(en), because
 * that is what lets each page ship the right `<html lang>` from the server
 * without a proxy rewriting every request. Everything they share lives here.
 */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={LOCALE_META[locale].htmlLang} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          // Static, generated from config. No user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(locale)) }}
        />
        <a href="#main" className="skip-link">
          {getCopy(locale).nav.skip}
        </a>
        <LocaleProvider locale={locale}>
          <UIStateProvider>
            <CookieConsentProvider>
              <SmoothScroll />
              {children}
            </CookieConsentProvider>
          </UIStateProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}

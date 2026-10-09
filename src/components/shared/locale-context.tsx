"use client";

/**
 * Which language the current page is in.
 *
 * Set once by each root layout, (id) or (en), so every client component below
 * it can read its strings without the locale being passed down by hand.
 */

import { createContext, useContext, type ReactNode } from "react";

import { getCopy, type Copy } from "@/config/copy";
import { DEFAULT_LOCALE, type Locale } from "@/config/i18n";

const Ctx = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <Ctx.Provider value={locale}>{children}</Ctx.Provider>;
}

export function useLocale(): Locale {
  return useContext(Ctx);
}

export function useCopy(): Copy {
  return getCopy(useContext(Ctx));
}

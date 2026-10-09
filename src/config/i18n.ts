/**
 * Languages and the URL of every page in each of them.
 *
 * Indonesian is the default and lives at the root. English lives under /en.
 * Slugs are translated rather than shared, so an English visitor reads
 * /en/products, not /en/produk.
 *
 * Every internal link in the site is written as a route key ("products"), not
 * a path, and resolved here. That keeps the two languages from drifting, and
 * it is what lets the language switch land on the same page in the other
 * language instead of dumping the visitor on the home page.
 */

export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "id";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export const LOCALE_META = {
  id: { htmlLang: "id", og: "id_ID", short: "ID", name: "Bahasa Indonesia" },
  en: { htmlLang: "en", og: "en_US", short: "EN", name: "English" },
} as const satisfies Record<Locale, { htmlLang: string; og: string; short: string; name: string }>;

export const ROUTES = {
  home: { id: "/", en: "/en" },
  treatment: { id: "/treatment", en: "/en/treatments" },
  products: { id: "/produk", en: "/en/products" },
  partnership: { id: "/kemitraan", en: "/en/partnership" },
  contact: { id: "/kontak", en: "/en/contact" },
  booking: { id: "/reservasi", en: "/en/book" },
  privacy: { id: "/privacy", en: "/en/privacy" },
  terms: { id: "/terms", en: "/en/terms" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof ROUTES;

export const ROUTE_KEYS = Object.keys(ROUTES) as RouteKey[];

export function href(key: RouteKey, locale: Locale): string {
  return ROUTES[key][locale];
}

/** The route a pathname belongs to, in whichever language. */
export function routeOf(pathname: string): { key: RouteKey; locale: Locale } | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  for (const key of ROUTE_KEYS) {
    for (const locale of LOCALES) {
      if (ROUTES[key][locale] === clean) return { key, locale };
    }
  }
  return null;
}

/** The same page in another language, or that language's home. */
export function translatePath(pathname: string, to: Locale): string {
  const match = routeOf(pathname);
  return match ? ROUTES[match.key][to] : ROUTES.home[to];
}

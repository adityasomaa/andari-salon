import type { Metadata, Viewport } from "next";

import { getCopy } from "@/config/copy";
import { LOCALES, LOCALE_META, ROUTES, type Locale, type RouteKey } from "@/config/i18n";
import { hubUrl, type Hub } from "@/config/links";
import { ALL_SERVICES, formatRupiah } from "@/config/services";
import { ADDRESS, CONTACT, OPENING_HOURS, SITE } from "@/config/site";

type PageKey = keyof ReturnType<typeof getCopy>["pages"] & RouteKey;

export function absoluteUrl(path: string): string {
  return path === "/" ? SITE.url : `${SITE.url}${path}`;
}

/** hreflang map for a route: both languages, Indonesian as the default. */
export function languageAlternates(key: RouteKey): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LOCALES) out[l] = absoluteUrl(ROUTES[key][l]);
  out["x-default"] = absoluteUrl(ROUTES[key].id);
  return out;
}

/** Shared by both root layouts. */
export function rootMetadata(locale: Locale): Metadata {
  const copy = getCopy(locale);
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: copy.pages.home.metaTitle,
      template: `%s · ${SITE.name}`,
    },
    description: copy.brand.description,
    applicationName: SITE.name,
    // The site icon is the traced monogram, transparent, no background plate.
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    },
    manifest: "/site.webmanifest",
    formatDetection: { telephone: false },
  };
}

export const VIEWPORT: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Pinch zoom stays available. Never disable it.
  maximumScale: 5,
  themeColor: "#fbfaf7",
};

/** Page metadata: title, canonical, the other language, social cards. */
export function pageMetadata(page: PageKey, locale: Locale): Metadata {
  const p = getCopy(locale).pages[page];
  const url = absoluteUrl(ROUTES[page][locale]);
  // The home title already contains the brand name, so it opts out of the
  // root layout's "%s · Andari Salon" template rather than saying it twice.
  const title = page === "home" ? { absolute: p.metaTitle } : p.metaTitle;
  return {
    title,
    description: p.metaDescription,
    alternates: { canonical: url, languages: languageAlternates(page) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: LOCALE_META[locale].og,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_META[l].og),
      url,
      title: p.metaTitle,
      description: p.metaDescription,
      images: [{ url: `${SITE.url}/og.png`, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.metaTitle,
      description: p.metaDescription,
      images: [`${SITE.url}/og.png`],
    },
  };
}

/**
 * LocalBusiness structured data.
 *
 * openingHoursSpecification is deliberately absent until real hours exist.
 * Publishing a guess here is worse than publishing nothing: search results
 * would show "Open now" for a salon that is shut.
 */
export function localBusinessJsonLd(locale: Locale) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${SITE.url}#business`,
    name: SITE.name,
    description: getCopy(locale).brand.description,
    url: absoluteUrl(ROUTES.home[locale]),
    telephone: `+${CONTACT.whatsappE164}`,
    // From the price list itself, so it can never drift from the menu.
    priceRange: menuPriceRange(),
    currenciesAccepted: "IDR",
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.line1,
      addressLocality: `${ADDRESS.village}, ${ADDRESS.district}`,
      addressRegion: ADDRESS.province,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.country,
    },
    areaServed: `${ADDRESS.city}, ${ADDRESS.province}`,
    sameAs: [CONTACT.instagramUrl],
    image: `${SITE.url}/og.png`,
    logo: `${SITE.url}/brand/logo-olive.svg`,
  };

  if (OPENING_HOURS.status === "published" && OPENING_HOURS.days.length > 0) {
    data.openingHoursSpecification = OPENING_HOURS.days.map((d) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: d.day,
      opens: d.opens,
      closes: d.closes,
    }));
  }

  return data;
}

function menuPriceRange(): string {
  const all = ALL_SERVICES.filter((s) => s.bookable).flatMap((s) =>
    typeof s.price === "number" ? [s.price] : Object.values(s.price),
  );
  return `${formatRupiah(Math.min(...all))} – ${formatRupiah(Math.max(...all))}`;
}
/** Metadata for a link hub page. Indonesian only, indexable. */
export function hubMetadata(hub: Hub): Metadata {
  const url = hubUrl(hub);
  const { title, description } = hub.meta;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: LOCALE_META.id.og,
      url,
      title,
      description,
      images: [{ url: `${SITE.url}/og.png`, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE.url}/og.png`] },
  };
}
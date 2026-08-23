import type { Metadata } from "next";

import { COPY } from "@/config/copy";
import { ADDRESS, CONTACT, OPENING_HOURS, SITE, TEMPLATES } from "@/config/site";
import { PREVIEW_MODE } from "@/config/preview";

type PageKey = keyof typeof COPY.pages;

/**
 * Page metadata. All three templates describe the same business, so the same
 * titles and descriptions are used; only the canonical differs.
 *
 * While the site is in preview the template routes are marked noindex. They
 * are three versions of one business, and letting search engines index all of
 * them would be duplicate content for a salon that has not launched.
 */
export function pageMetadata(page: PageKey, path: string, isTemplateRoute = true): Metadata {
  const p = COPY.pages[page];
  const url = `${SITE.url}${path}`;
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: { canonical: url },
    robots:
      PREVIEW_MODE && isTemplateRoute
        ? { index: false, follow: true }
        : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "id_ID",
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
export function localBusinessJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${SITE.url}#business`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: `+${CONTACT.whatsappE164}`,
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

export const TEMPLATE_PATHS = TEMPLATES.flatMap((t) => [
  t.href,
  `${t.href}/layanan`,
  `${t.href}/booking`,
  `${t.href}/kontak`,
]);

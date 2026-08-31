import type { Metadata } from "next";

import { LinkHub } from "@/components/pages/link-hub";
import { HUB } from "@/config/links";
import { SITE } from "@/config/site";

/**
 * The link-in-bio page, at the slug that goes in the Instagram profile.
 *
 * Indexable and in the sitemap even while the three template previews are
 * noindex, because this page is not one of the previews: it is a real,
 * finished page with one version of itself.
 */
export const metadata: Metadata = {
  title: { absolute: HUB.meta.title },
  description: HUB.meta.description,
  alternates: { canonical: HUB.url },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "id_ID",
    url: HUB.url,
    title: HUB.meta.title,
    description: HUB.meta.description,
    images: [{ url: `${SITE.url}/og.png`, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: HUB.meta.title,
    description: HUB.meta.description,
    images: [`${SITE.url}/og.png`],
  },
};

export default function BookingLinksPage() {
  return <LinkHub />;
}

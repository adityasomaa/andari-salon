/**
 * The link hub served at /booking.
 *
 * This is the page meant to sit in the Instagram bio: one short list of every
 * way to reach the salon. Add, remove or reorder entries here and the page
 * follows. Nothing else needs editing.
 *
 * Same rule as the rest of the site: every destination is a channel that
 * actually exists. No placeholder rows, no icons pointing at empty accounts.
 */

import { ADDRESS, CONTACT, SITE } from "./site";
import { LIVE_TEMPLATE, PREVIEW_MODE } from "./preview";

export type LinkKind = "whatsapp" | "instagram" | "site" | "maps" | "form" | "services";

export type HubLink = {
  id: string;
  kind: LinkKind;
  label: string;
  /** One short line under the label. Never a claim. */
  note: string;
  /** Absolute URL, or a path on this site. WhatsApp rows leave this empty. */
  href?: string;
  /** Sent to the salon as "Tombol: ..." when the row opens WhatsApp. */
  buttonLabel?: string;
  /** Rendered larger, at the top of the list. One row at most. */
  primary?: boolean;
};

/**
 * The site's own pages live under the chosen template while the three previews
 * coexist, so links into the site resolve through here rather than being
 * written out by hand.
 */
export function sitePath(path: string): string {
  return PREVIEW_MODE ? `/${LIVE_TEMPLATE}${path}` : path || "/";
}

export const HUB = {
  /** Shown under the wordmark. */
  tagline: "Salon rambut di Denpasar Barat",
  intro: "Semua cara menghubungi kami ada di sini.",

  links: [
    {
      id: "wa-booking",
      kind: "whatsapp",
      label: "Booking lewat WhatsApp",
      note: "Kirim tanggal dan jam yang Anda inginkan.",
      buttonLabel: "Booking dari halaman tautan",
      primary: true,
    },
    {
      id: "form",
      kind: "form",
      label: "Isi formulir booking",
      note: "Pilih layanan, tanggal, dan jam dulu, baru kirim.",
      href: sitePath("/booking"),
    },
    {
      id: "layanan",
      kind: "services",
      label: "Lihat layanan",
      note: "Potong, pewarnaan, perawatan rambut, dan lainnya.",
      href: sitePath("/layanan"),
    },
    {
      id: "instagram",
      kind: "instagram",
      label: `Instagram ${CONTACT.instagramHandle}`,
      note: "Kabar terbaru dari salon.",
      href: CONTACT.instagramUrl,
    },
    {
      id: "maps",
      kind: "maps",
      label: "Lokasi di Google Maps",
      note: ADDRESS.line1 + ", " + ADDRESS.village,
      href: ADDRESS.mapsUrl,
    },
    {
      id: "website",
      kind: "site",
      label: "Website Andari Salon",
      note: "Layanan, lokasi, dan jam buka.",
      href: sitePath(""),
    },
  ] satisfies HubLink[],

  /** Small print under the list. */
  addressTitle: "Alamat",
  hoursTitle: "Jam buka",
  copy: "Salin alamat",
  copied: "Alamat tersalin",

  meta: {
    title: "Tautan Andari Salon",
    description: `Booking, Instagram, lokasi, dan website Andari Salon. ${ADDRESS.line1}, ${ADDRESS.village}, ${ADDRESS.district}.`,
  },

  /** Canonical for this page. */
  get url(): string {
    return `${SITE.url}/booking`;
  },
} as const;

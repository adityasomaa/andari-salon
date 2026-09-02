/**
 * The link hub served at /booking.
 *
 * This is the page meant to sit in the Instagram bio: the shortest possible
 * list of ways to reach the salon, sized to fit one screen without scrolling.
 * Add, remove or reorder entries here and the page follows.
 *
 * Keep the list short. The page is built to fit a phone screen exactly, so
 * every row added is height taken from somewhere else. Six is comfortable,
 * eight is the practical ceiling.
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
  /** Kept to one short line: it has to sit on a single row on a 360px phone. */
  label: string;
  /** Absolute URL, or a path on this site. WhatsApp rows leave this empty. */
  href?: string;
  /**
   * Overrides the greeting for a WhatsApp row. Use it when the row promises
   * something more specific than "I have a question", so the message matches
   * the button that was pressed.
   */
  message?: string;
  /** Filled rather than outlined. One row at most. */
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
  tagline: "Salon rambut di Denpasar Barat",

  links: [
    {
      id: "wa-booking",
      kind: "whatsapp",
      label: "Booking lewat WhatsApp",
      message: `Halo ${SITE.name}, saya ingin booking.`,
      primary: true,
    },
    {
      id: "form",
      kind: "form",
      label: "Isi formulir booking",
      href: sitePath("/booking"),
    },
    {
      id: "layanan",
      kind: "services",
      label: "Lihat layanan",
      href: sitePath("/layanan"),
    },
    {
      id: "instagram",
      kind: "instagram",
      label: CONTACT.instagramHandle,
      href: CONTACT.instagramUrl,
    },
    {
      id: "maps",
      kind: "maps",
      label: "Lokasi di Google Maps",
      href: ADDRESS.mapsUrl,
    },
    {
      id: "website",
      kind: "site",
      label: "Website Andari Salon",
      href: sitePath(""),
    },
  ] satisfies HubLink[],

  meta: {
    title: "Tautan Andari Salon",
    description: `Booking, Instagram, lokasi, dan website Andari Salon. ${ADDRESS.line1}, ${ADDRESS.village}, ${ADDRESS.district}.`,
  },

  /** Canonical for this page. */
  get url(): string {
    return `${SITE.url}/booking`;
  },
} as const;

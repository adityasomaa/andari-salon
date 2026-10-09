/**
 * The link hub served at /booking.
 *
 * This is the page meant to sit in the Instagram bio: the shortest possible
 * list of ways to reach the salon, sized to fit one screen without scrolling.
 * Add, remove or reorder entries here and the page follows.
 *
 * Indonesian only. It is one screen of buttons for the salon's own Instagram
 * audience; the site it links to has the language switch.
 *
 * Keep the list short. The page is built to fit a phone screen exactly, so
 * every row added is height taken from somewhere else. Six is comfortable,
 * eight is the practical ceiling.
 *
 * Same rule as the rest of the site: every destination is a channel that
 * actually exists. No placeholder rows, no icons pointing at empty accounts.
 */

import { getCopy } from "./copy";
import { href } from "./i18n";
import { ADDRESS, CONTACT, SITE } from "./site";

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

export const HUB = {
  tagline: "Salon rambut di Denpasar Barat",

  links: [
    {
      id: "wa-booking",
      kind: "whatsapp",
      label: "Booking lewat WhatsApp",
      message: getCopy("id").wa.booking,
      primary: true,
    },
    {
      id: "form",
      kind: "form",
      label: "Isi formulir booking",
      href: href("booking", "id"),
    },
    {
      id: "treatment",
      kind: "services",
      label: "Lihat treatment",
      href: href("treatment", "id"),
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
      href: href("home", "id"),
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

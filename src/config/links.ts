/**
 * The link hubs: one-screen pages meant for an Instagram bio.
 *
 *   /booking  the main salon
 *   /glogor   the Glogor Carik branch
 *
 * Each is the shortest possible list of ways to reach that salon, sized to
 * fit one screen without scrolling. Add, remove or reorder entries here and
 * the page follows. Indonesian only: they are for each salon's own Instagram
 * audience, and the site they link to has the language switch.
 *
 * Keep each list short. The page is built to fit a phone screen exactly, so
 * every row added is height taken from somewhere else. Six is comfortable,
 * eight is the practical ceiling.
 *
 * Same rule as the rest of the site: every destination is a channel that
 * actually exists. No placeholder rows, no icons pointing at empty accounts.
 */

import { getCopy } from "./copy";
import { href } from "./i18n";
import { ADDRESS, BRANCH_GLOGOR, CONTACT, SITE } from "./site";

export type LinkKind = "whatsapp" | "instagram" | "site" | "maps" | "form" | "services" | "review";

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
  /** WhatsApp number for this row, wa.me form. Defaults to the main salon. */
  number?: string;
  /** Filled rather than outlined. One row at most. */
  primary?: boolean;
};

export type Hub = {
  path: string;
  /** The line under the wordmark. */
  tagline: string;
  /** Accessible name for the list of links. */
  label: string;
  links: HubLink[];
  meta: { title: string; description: string };
};

export const HUB: Hub = {
  path: "/booking",
  tagline: "Salon rambut di Denpasar Barat",
  label: "Tautan Andari Salon",

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
  ],

  meta: {
    title: "Tautan Andari Salon",
    description: `Booking, Instagram, lokasi, dan website Andari Salon. ${ADDRESS.line1}, ${ADDRESS.village}, ${ADDRESS.district}.`,
  },
};

/**
 * The Glogor Carik branch. Its own WhatsApp, Instagram, map and Google review
 * link. No booking-form row: the form sends to the main salon's number, so it
 * would route a Glogor booking to the wrong place. No treatment row either,
 * until it is confirmed the branch uses the same price list.
 */
export const HUB_GLOGOR: Hub = {
  path: "/glogor",
  tagline: `Cabang ${BRANCH_GLOGOR.area}`,
  label: `Tautan ${BRANCH_GLOGOR.name}`,

  links: [
    {
      id: "wa-booking",
      kind: "whatsapp",
      label: "Booking lewat WhatsApp",
      message: `Halo ${BRANCH_GLOGOR.name}, saya ingin booking.`,
      number: BRANCH_GLOGOR.whatsappE164,
      primary: true,
    },
    {
      id: "instagram",
      kind: "instagram",
      label: BRANCH_GLOGOR.instagramHandle,
      href: BRANCH_GLOGOR.instagramUrl,
    },
    {
      id: "maps",
      kind: "maps",
      label: "Lokasi di Google Maps",
      href: BRANCH_GLOGOR.mapsUrl,
    },
    {
      id: "review",
      kind: "review",
      label: "Tulis ulasan di Google",
      href: BRANCH_GLOGOR.reviewUrl,
    },
    {
      id: "website",
      kind: "site",
      label: "Website Andari Salon",
      href: href("home", "id"),
    },
  ],

  meta: {
    title: `Tautan ${BRANCH_GLOGOR.name}`,
    description: `Booking, Instagram, lokasi, dan ulasan ${BRANCH_GLOGOR.name}, cabang ${BRANCH_GLOGOR.area}.`,
  },
};

export function hubUrl(hub: Hub): string {
  return `${SITE.url}${hub.path}`;
}

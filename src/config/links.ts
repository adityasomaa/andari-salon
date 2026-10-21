/**
 * The link hubs: one-screen pages meant for an Instagram bio.
 *
 *   /booking        the official hub, covering every branch
 *   /monang-maning  the Monang Maning branch
 *   /glogor         the Glogor Carik branch
 *
 * The official hub follows the shape the client pointed to (TM Facial Glow's
 * /booking): "Booking" and "Lokasi" open a short list of branches, each with
 * its own WhatsApp or map, instead of guessing which branch someone means.
 *
 * Each list is the shortest possible set of ways to reach the salon, sized to
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
import { ADDRESS, BRANCH_GLOGOR, BRANCH_MONANG_MANING, CONTACT, MAIN_BRANCH_AREA, SITE } from "./site";

export type LinkKind =
  | "whatsapp"
  | "instagram"
  | "site"
  | "maps"
  | "form"
  | "services"
  | "review"
  | "partnership";

/** One entry in a row's branch list. */
export type HubChoice = {
  label: string;
  /** A second line, e.g. the address. */
  detail?: string;
  href?: string;
  /** WhatsApp choices: the greeting and the branch's number. */
  message?: string;
  number?: string;
};

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
  /** When set, the row opens this list instead of going anywhere itself. */
  choices?: { title: string; items: HubChoice[] };
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

/** Every branch, in one place, for the official hub's branch lists. */
export const BRANCHES = [
  {
    area: MAIN_BRANCH_AREA,
    name: `${SITE.name} ${MAIN_BRANCH_AREA}`,
    address: ADDRESS.full,
    whatsappE164: CONTACT.whatsappE164,
    mapsUrl: ADDRESS.mapsUrl,
  },
  {
    area: BRANCH_GLOGOR.area,
    name: BRANCH_GLOGOR.name,
    address: BRANCH_GLOGOR.address,
    whatsappE164: BRANCH_GLOGOR.whatsappE164,
    mapsUrl: BRANCH_GLOGOR.mapsUrl,
  },
];

const bookingGreeting = (name: string) => `Halo ${name}, saya ingin booking.`;

export const HUB_OFFICIAL: Hub = {
  path: "/booking",
  tagline: "Salon rambut di Denpasar",
  label: "Tautan resmi Andari Salon",

  links: [
    {
      id: "booking",
      kind: "whatsapp",
      label: "Booking treatment",
      primary: true,
      choices: {
        title: "Booking di cabang mana?",
        items: BRANCHES.map((b) => ({
          label: `Cabang ${b.area}`,
          detail: b.address,
          message: bookingGreeting(b.name),
          number: b.whatsappE164,
        })),
      },
    },
    {
      id: "treatment",
      kind: "services",
      label: "Menu treatment & harga",
      href: href("treatment", "id"),
    },
    {
      id: "location",
      kind: "maps",
      label: "Lokasi cabang",
      choices: {
        title: "Lokasi cabang",
        items: BRANCHES.map((b) => ({ label: `Cabang ${b.area}`, detail: b.address, href: b.mapsUrl })),
      },
    },
    {
      id: "partnership",
      kind: "partnership",
      label: "Kemitraan Andari Salon",
      href: href("partnership", "id"),
    },
    {
      id: "instagram",
      kind: "instagram",
      label: CONTACT.instagramHandle,
      href: CONTACT.instagramUrl,
    },
    {
      id: "website",
      kind: "site",
      label: "Tentang Andari Salon",
      href: href("home", "id"),
    },
  ],

  meta: {
    title: "Tautan resmi Andari Salon",
    description: `Booking, menu treatment, lokasi cabang ${BRANCHES.map((b) => b.area).join(" dan ")}, dan kemitraan Andari Salon.`,
  },
};

/** The Monang Maning branch: the salon at ADDRESS. */
export const HUB_MONANG_MANING: Hub = {
  path: "/monang-maning",
  tagline: `Cabang ${MAIN_BRANCH_AREA}`,
  label: `Tautan Andari Salon ${MAIN_BRANCH_AREA}`,

  links: [
    {
      id: "wa-booking",
      kind: "whatsapp",
      label: "Booking lewat WhatsApp",
      message: getCopy("id").wa.booking,
      primary: true,
    },
    {
      // The site's booking form sends to this branch's number.
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
      label: BRANCH_MONANG_MANING.instagramHandle,
      href: BRANCH_MONANG_MANING.instagramUrl,
    },
    {
      id: "maps",
      kind: "maps",
      label: "Lokasi di Google Maps",
      href: ADDRESS.mapsUrl,
    },
    {
      id: "review",
      kind: "review",
      label: "Tulis ulasan di Google",
      href: BRANCH_MONANG_MANING.reviewUrl,
    },
    {
      id: "website",
      kind: "site",
      label: "Website Andari Salon",
      href: href("home", "id"),
    },
  ],

  meta: {
    title: `Tautan Andari Salon ${MAIN_BRANCH_AREA}`,
    description: `Booking, Instagram, lokasi, dan ulasan Andari Salon cabang ${MAIN_BRANCH_AREA}. ${ADDRESS.line1}, ${ADDRESS.village}, ${ADDRESS.district}.`,
  },
};

/**
 * The Glogor Carik branch. Its own WhatsApp, Instagram, map and Google review
 * link. No booking-form row: the form sends to the Monang Maning number, so
 * it would route a Glogor booking to the wrong place. No treatment row either,
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
      message: bookingGreeting(BRANCH_GLOGOR.name),
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

export const HUBS = [HUB_OFFICIAL, HUB_MONANG_MANING, HUB_GLOGOR];

export function hubUrl(hub: Hub): string {
  return `${SITE.url}${hub.path}`;
}

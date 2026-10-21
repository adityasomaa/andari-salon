/**
 * Every fact about the business lives here. Nothing else in the codebase is
 * allowed to hard-code a phone number, a handle, an address or an opening
 * hour, and every page reads from this one file.
 *
 * Rule for this project: if a value is not confirmed by the owner, it is not
 * invented. It is marked unknown and surfaced as unknown.
 */

export const SITE = {
  name: "Andari Salon",
  shortName: "Andari",
  /** Production origin. Update here and metadata, sitemap and robots follow. */
  url: "https://andarisalon.id",
  /** Bali is UTC+8. Used for "is this date in the past" on client and server. */
  timeZone: "Asia/Makassar",
} as const;

export const CONTACT = {
  /** As the owner writes it. */
  whatsappDisplay: "085218958623",
  /** International form, for wa.me links only. */
  whatsappE164: "6285218958623",
  instagramHandle: "@andarisalon.id",
  instagramUrl: "https://instagram.com/andarisalon.id",
} as const;

export const ADDRESS = {
  line1: "Jl. Gunung Rinjani No.4",
  village: "Tegal Kertha",
  district: "Kec. Denpasar Barat",
  city: "Kota Denpasar",
  province: "Bali",
  postalCode: "80112",
  country: "ID",
  get full(): string {
    return `${this.line1}, ${this.village}, ${this.district}, ${this.city}, ${this.province} ${this.postalCode}`;
  },
  /** Search query, not a fabricated pin. */
  get mapsQuery(): string {
    return encodeURIComponent(`${SITE.name}, ${this.line1}, ${this.village}, ${this.district}, ${this.city}, ${this.province} ${this.postalCode}`);
  },
  /** The salon's own Google Maps place, as the client sent it. */
  mapsUrl: "https://maps.app.goo.gl/YNhBcVnGeUhVjTrq5",
  get mapsEmbedUrl(): string {
    return `https://maps.google.com/maps?q=${this.mapsQuery}&z=16&output=embed`;
  },
} as const;

/**
 * OPENING HOURS ARE NOT KNOWN YET.
 *
 * The owner has not supplied them. Guessing them is the one mistake here that
 * costs a real customer a wasted trip, so:
 *   - `status` stays "unset" until real hours arrive
 *   - the UI prints COPY.hours.unknownLabel instead of a schedule
 *   - LocalBusiness structured data omits openingHoursSpecification entirely
 *
 * To fill them in: set `status: "published"` and list `days`. Day names come
 * from the copy file in each language. Nothing else needs to change; the UI
 * and the JSON-LD both switch over.
 */
export const OPENING_HOURS: OpeningHours = {
  status: "unset",
  days: [],
};

export type OpeningHoursDay = {
  /** schema.org DayOfWeek short form, e.g. "Mo". */
  day: "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su";
  /** "HH:MM" 24h. */
  opens: string;
  closes: string;
};

export type OpeningHours = {
  status: "unset" | "published";
  days: OpeningHoursDay[];
};

/** What the partnership proposal calls the main salon at ADDRESS. */
export const MAIN_BRANCH_AREA = "Monang Maning";

/**
 * The Monang Maning branch's own channels, as the client sent them. Its
 * WhatsApp is the salon's (CONTACT) and its address is ADDRESS; the brand
 * Instagram stays @andarisalon.id on the site and the official hub.
 */
export const BRANCH_MONANG_MANING = {
  instagramHandle: "@andarisalon.monangmaning",
  instagramUrl: "https://www.instagram.com/andarisalon.monangmaning/",
  reviewUrl: "https://g.page/r/CUTBk9-0B_2SEAE/review",
} as const;

/**
 * The Glogor Carik branch, as the client sent it. The address comes from the
 * partnership proposal (PROPOSAL KEMITRAAN ANDARI SALON.pdf, page 5).
 */
export const BRANCH_GLOGOR = {
  name: "Andari Salon Glogor",
  area: "Glogor Carik",
  address: "Jl. Taman Pancing Timur, Jl. Budi Permata, Pemogan, Kec. Denpasar Selatan, Kota Denpasar, Bali 80221",
  whatsappDisplay: "082345649490",
  whatsappE164: "6282345649490",
  instagramHandle: "@andarisalon.glogor",
  instagramUrl: "https://www.instagram.com/andarisalon.glogor/",
  mapsUrl: "https://maps.app.goo.gl/57mdKgfP8k957zQs5",
  reviewUrl: "https://g.page/r/Cawlfo-ytEBTECE/review",
} as const;

/**
 * The partnership team's own contact, from the proposal's last page. A
 * different WhatsApp from the salon's: bookings go to CONTACT, partnership
 * enquiries come here. The proposal also names a Facebook page and a TikTok
 * account, but without links, so they are not linked anywhere.
 */
export const PARTNERSHIP_CONTACT = {
  whatsappDisplay: "0822-6630-7929",
  whatsappE164: "6282266307929",
  email: "andarisalon13@gmail.com",
} as const;

/** Instagram is the only social account. No other icons anywhere. */
export const SOCIALS = [
  {
    key: "instagram",
    label: "Instagram",
    handle: CONTACT.instagramHandle,
    href: CONTACT.instagramUrl,
  },
] as const;

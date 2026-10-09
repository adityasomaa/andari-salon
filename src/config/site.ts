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
  get mapsUrl(): string {
    return `https://www.google.com/maps/search/?api=1&query=${this.mapsQuery}`;
  },
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

/** Instagram is the only social account. No other icons anywhere. */
export const SOCIALS = [
  {
    key: "instagram",
    label: "Instagram",
    handle: CONTACT.instagramHandle,
    href: CONTACT.instagramUrl,
  },
] as const;

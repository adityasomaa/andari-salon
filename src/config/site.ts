/**
 * Every fact about the business lives here. Nothing else in the codebase is
 * allowed to hard-code a phone number, a handle, an address or an opening
 * hour, and the three templates all read from this one file.
 *
 * Rule for this project: if a value is not confirmed by the owner, it is not
 * invented. It is marked unknown and surfaced as unknown.
 */

export const SITE = {
  name: "Andari Salon",
  shortName: "Andari",
  /** Production origin. Update here and metadata, sitemap and robots follow. */
  url: "https://andari-salon.vercel.app",
  locale: "id-ID",
  /** Bali is UTC+8. Used for "is this date in the past" on client and server. */
  timeZone: "Asia/Makassar",
  description:
    "Andari Salon adalah salon rambut yang baru dibuka di Tegal Kertha, Denpasar Barat. Lihat layanan, lokasi, dan cara booking.",
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
 *   - the UI prints `unknownLabel` instead of a schedule
 *   - LocalBusiness structured data omits openingHoursSpecification entirely
 *
 * To fill them in: set `status: "published"` and list `days`. Nothing else in
 * the codebase needs to change; the UI and the JSON-LD both switch over.
 */
export const OPENING_HOURS: OpeningHours = {
  status: "unset",
  unknownLabel: "Jam buka belum kami umumkan.",
  unknownHint: "Tanyakan lewat WhatsApp untuk jam hari ini.",
  days: [],
};

export type OpeningHoursDay = {
  /** schema.org DayOfWeek short form, e.g. "Mo". */
  day: "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su";
  label: string;
  /** "HH:MM" 24h. */
  opens: string;
  closes: string;
};

export type OpeningHours = {
  status: "unset" | "published";
  unknownLabel: string;
  unknownHint: string;
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

export const TEMPLATES = [
  {
    id: "template-1",
    number: "01",
    name: "Editorial Tenang",
    href: "/template-1",
    blurb:
      "Ruang kosong lebar, tipografi besar, garis rambut, gerak yang nyaris tidak terasa.",
  },
  {
    id: "template-2",
    number: "02",
    name: "Hangat dan Ramah",
    href: "/template-2",
    blurb:
      "Sudut membulat, komposisi padat, kartu layanan menonjol, gerak yang lebih hidup.",
  },
  {
    id: "template-3",
    number: "03",
    name: "Gelap dan Mewah",
    href: "/template-3",
    blurb:
      "Latar gelap, kontras tinggi, aksen setipis rambut, gerak paling minim.",
  },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export const NAV = [
  { href: "", label: "Beranda", key: "home" },
  { href: "/layanan", label: "Layanan", key: "layanan" },
  { href: "/booking", label: "Booking", key: "booking" },
  { href: "/kontak", label: "Kontak", key: "kontak" },
] as const;

export const LEGAL_NAV = [
  { href: "/privacy", label: "Kebijakan Privasi" },
  { href: "/terms", label: "Syarat Layanan" },
] as const;

/**
 * THE TREATMENT MENU, with prices.
 *
 * Transcribed from the salon's own price list (two "PRICE LIST" sheets sent
 * by the client). Names follow the sheet, which mixes English and Indonesian;
 * the English site translates only the Indonesian words. Two spellings were
 * normalised: "Keratine" to Keratin and "Loreal" to L'Oréal.
 *
 * Prices are rupiah. Treatments priced by hair length carry four prices; hair
 * colouring is marked `from`, because the sheet lists those as "Start From".
 *
 * Ids stay the same in both languages, since they are what the booking form
 * sends. Add-ons are listed but not bookable on their own.
 */

import type { Locale } from "./i18n";

/** True while the list is a placeholder. The sample banner follows it. */
export const SERVICES_ARE_SAMPLE = false;

/** A string in each language. */
export type Localized = Record<Locale, string>;

export const LENGTHS = ["short", "medium", "long", "extraLong"] as const;
export type HairLength = (typeof LENGTHS)[number];
export type LengthPrices = Record<HairLength, number>;

/** The sheet's own column headings, used in both languages. */
export const LENGTH_LABELS: Record<HairLength, string> = {
  short: "Short",
  medium: "Medium",
  long: "Long",
  extraLong: "Extra Long",
};

export type Service = {
  /** Stable id, used as the booking form value. */
  id: string;
  name: Localized;
  /** Only where the price list itself carries a note. */
  note?: Localized;
  price: number | LengthPrices;
  /** "Start from" pricing. */
  from?: boolean;
};

export type ServiceCategory = {
  id: string;
  number: string;
  name: Localized;
  /** One line describing what the group covers. */
  summary: Localized;
  /** False for add-ons, which go on top of another treatment. */
  bookable: boolean;
  items: Service[];
};

const same = (s: string): Localized => ({ id: s, en: s });
const lengths = (short: number, medium: number, long: number, extraLong: number): LengthPrices => ({
  short,
  medium,
  long,
  extraLong,
});

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "hair-cut",
    number: "01",
    name: same("Hair Cut"),
    summary: {
      id: "Potong rambut, dengan atau tanpa cuci dan penataan.",
      en: "Cuts, with or without a wash and styling.",
    },
    bookable: true,
    items: [
      { id: "hair-cut-poni", name: { id: "Hair Cut Poni", en: "Fringe Cut" }, price: 25000 },
      { id: "hair-cut", name: same("Hair Cut"), price: 100000 },
      { id: "hair-cut-cuci", name: { id: "Hair Cut + Cuci", en: "Hair Cut + Wash" }, price: 135000 },
      {
        id: "hair-cut-cuci-catok",
        name: { id: "Hair Cut + Cuci + Catok", en: "Hair Cut + Wash + Iron" },
        price: 165000,
      },
      {
        id: "hair-cut-cuci-blow",
        name: { id: "Hair Cut + Cuci + Blow", en: "Hair Cut + Wash + Blow-dry" },
        price: 175000,
      },
    ],
  },
  {
    id: "wash-styling",
    number: "02",
    name: same("Hair Wash & Styling"),
    summary: {
      id: "Keramas dengan pilihan produk, catok, dan blow.",
      en: "Washes with a choice of products, ironing and blow-drying.",
    },
    bookable: true,
    items: [
      { id: "keramas-cbd", name: { id: "Keramas by CBD", en: "Hair Wash by CBD" }, price: 45000 },
      { id: "keramas-loreal", name: { id: "Keramas by L'Oréal", en: "Hair Wash by L'Oréal" }, price: 75000 },
      {
        id: "keramas-loreal-prolonger",
        name: { id: "Keramas by L'Oréal Prolonger", en: "Hair Wash by L'Oréal Prolonger" },
        price: 100000,
      },
      {
        id: "keramas-matrix",
        name: { id: "Keramas by Matrix Food For Soft", en: "Hair Wash by Matrix Food For Soft" },
        price: 120000,
      },
      { id: "keramas-catok", name: { id: "Keramas + Catok", en: "Hair Wash + Iron" }, price: 70000 },
      {
        id: "keramas-catok-vitamin",
        name: { id: "Keramas + Catok + Vitamin", en: "Hair Wash + Iron + Vitamin" },
        price: 80000,
      },
      { id: "catok", name: { id: "Catok", en: "Hair Iron" }, price: 30000 },
      { id: "curly-blow", name: { id: "Curly/Blow", en: "Curls/Blow-dry" }, price: 40000 },
      { id: "dry-blow", name: same("Dry Blow"), price: 65000 },
    ],
  },
  {
    id: "hair-colouring",
    number: "03",
    name: same("Hair Colouring"),
    summary: {
      id: "Harga mulai dari, menurut panjang rambut.",
      en: "Starting prices, by hair length.",
    },
    bookable: true,
    items: [
      { id: "colour-essential", name: same("Essential"), price: lengths(350000, 500000, 650000, 800000), from: true },
      { id: "colour-highlight", name: same("Highlight"), price: lengths(600000, 700000, 800000, 950000), from: true },
      { id: "colour-balayage", name: same("Balayage"), price: lengths(650000, 850000, 950000, 1200000), from: true },
      { id: "colour-ombre", name: same("Ombre"), price: lengths(600000, 700000, 800000, 1000000), from: true },
    ],
  },
  {
    id: "hair-treatment",
    number: "04",
    name: same("Hair Treatment"),
    summary: { id: "Harga menurut panjang rambut.", en: "Priced by hair length." },
    bookable: true,
    items: [
      { id: "smoothing", name: same("Smoothing"), price: lengths(350000, 450000, 600000, 700000) },
      { id: "keratin", name: same("Keratin"), price: lengths(500000, 600000, 700000, 850000) },
      { id: "perm", name: same("Perm"), price: lengths(450000, 600000, 900000, 1200000) },
    ],
  },
  {
    id: "hair-care",
    number: "05",
    name: same("Hair Care"),
    summary: { id: "Masker, hair spa, dan creambath.", en: "Masks, hair spa and creambath." },
    bookable: true,
    items: [
      { id: "hair-mask", name: same("Hair Mask"), price: 75000 },
      { id: "hair-mask-catok", name: { id: "Hair Mask + Catok", en: "Hair Mask + Iron" }, price: 105000 },
      {
        id: "hair-spa-massage",
        name: { id: "Hair Spa + Massage Bahu + Tangan", en: "Hair Spa + Shoulder and Hand Massage" },
        price: 150000,
      },
      { id: "creambath", name: same("Creambath"), price: 90000 },
    ],
  },
  {
    id: "add-ons",
    number: "06",
    name: same("Add Ons"),
    summary: { id: "Tambahan untuk treatment lain.", en: "Extras added to another treatment." },
    bookable: false,
    items: [
      { id: "hair-vitamin", name: same("Hair Vitamin"), price: 10000 },
      { id: "hair-extension", name: same("Hair Extension"), price: 50000 },
      {
        id: "creambath-mask-thick",
        name: same("Creambath + Hair Mask"),
        note: { id: "Untuk rambut tebal dan extra long", en: "For thick and extra long hair" },
        price: 10000,
      },
    ],
  },
];

/** Flat list in category order. */
export const ALL_SERVICES: Array<Service & { categoryId: string; categoryName: Localized; bookable: boolean }> =
  SERVICE_CATEGORIES.flatMap((c) =>
    c.items.map((s) => ({ ...s, categoryId: c.id, categoryName: c.name, bookable: c.bookable })),
  );

/** What the booking form accepts. Add-ons are excluded. */
export const SERVICE_IDS = ALL_SERVICES.filter((s) => s.bookable).map((s) => s.id);

export function findService(id: string) {
  return ALL_SERVICES.find((s) => s.id === id);
}

/** "Rp 75.000". Grouped by hand so server and browser always agree. */
export function formatRupiah(n: number): string {
  return `Rp ${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** One-line price: "Rp 75.000", or the range across hair lengths. */
export function priceSummary(s: Service, locale: Locale): string {
  if (typeof s.price === "number") return formatRupiah(s.price);
  const values = LENGTHS.map((l) => (s.price as LengthPrices)[l]);
  const range = `${formatRupiah(Math.min(...values))} – ${formatRupiah(Math.max(...values))}`;
  if (!s.from) return range;
  return locale === "en" ? `From ${range}` : `Mulai ${range}`;
}

/**
 * Bookable slots. Deliberately a fixed grid rather than real availability:
 * we do not know the opening hours, so these are offered as a request the
 * salon confirms over WhatsApp, and the UI says exactly that.
 */
export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00",
] as const;

/** How far ahead the calendar allows booking. */
export const BOOKING_WINDOW_DAYS = 90;

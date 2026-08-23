/**
 * SAMPLE SERVICE LIST.
 *
 * The real menu has not been supplied yet. Everything below is placeholder
 * content and is labelled as such in the UI (see COPY.services.sampleNotice).
 * No prices, no durations, no result claims: those are the details that would
 * actively mislead a customer if guessed.
 *
 * When the real list arrives, replace the `items` arrays and set
 * SERVICES_ARE_SAMPLE to false. The sample banner disappears on its own.
 */

export const SERVICES_ARE_SAMPLE = true;

export type Service = {
  /** Stable id, used as the booking form value and in the WhatsApp message. */
  id: string;
  name: string;
  /** Neutral description of the act itself. Never an outcome promise. */
  note: string;
};

export type ServiceCategory = {
  id: string;
  number: string;
  name: string;
  /** One line describing what the group covers. */
  summary: string;
  items: Service[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "potong-penataan",
    number: "01",
    name: "Potong dan Penataan",
    summary: "Memotong, mencuci, dan menata rambut.",
    items: [
      { id: "potong-rambut", name: "Potong Rambut", note: "Potong sesuai panjang dan bentuk yang Anda minta." },
      { id: "cuci-blow", name: "Cuci dan Blow", note: "Cuci rambut lalu dikeringkan dan ditata dengan hair dryer." },
      { id: "catok-penataan", name: "Catok dan Penataan", note: "Menata rambut lurus atau bergelombang dengan catok." },
      { id: "sanggul", name: "Sanggul", note: "Menata rambut untuk acara." },
      { id: "potong-poni", name: "Potong Poni", note: "Merapikan bagian poni saja." },
    ],
  },
  {
    id: "pewarnaan",
    number: "02",
    name: "Pewarnaan",
    summary: "Mengubah atau merapikan warna rambut.",
    items: [
      { id: "warna-menyeluruh", name: "Pewarnaan Menyeluruh", note: "Mewarnai seluruh bagian rambut." },
      { id: "highlight", name: "Highlight", note: "Mewarnai sebagian helai rambut." },
      { id: "sentuh-akar", name: "Sentuh Ulang Akar", note: "Mewarnai bagian akar yang sudah tumbuh." },
      { id: "bleaching", name: "Bleaching", note: "Mencerahkan warna dasar rambut." },
    ],
  },
  {
    id: "perawatan-rambut",
    number: "03",
    name: "Perawatan Rambut",
    summary: "Perawatan pada batang rambut.",
    items: [
      { id: "creambath", name: "Creambath", note: "Perawatan dengan krim disertai pijat kepala." },
      { id: "hair-spa", name: "Hair Spa", note: "Perawatan rambut dengan uap." },
      { id: "masker-rambut", name: "Masker Rambut", note: "Pemakaian masker pada batang rambut." },
      { id: "smoothing", name: "Smoothing", note: "Meluruskan rambut dengan bahan pelurus." },
      { id: "keratin", name: "Perawatan Keratin", note: "Perawatan rambut berbahan keratin." },
    ],
  },
  {
    id: "perawatan-lain",
    number: "04",
    name: "Perawatan Lain",
    summary: "Perawatan kulit kepala dan lainnya.",
    items: [
      { id: "perawatan-kulit-kepala", name: "Perawatan Kulit Kepala", note: "Membersihkan dan merawat bagian kulit kepala." },
      { id: "hair-tonic", name: "Hair Tonic", note: "Pemakaian tonik pada kulit kepala." },
      { id: "pijat-kepala", name: "Pijat Kepala", note: "Pijat pada kepala, leher, dan bahu." },
      { id: "konsultasi", name: "Konsultasi", note: "Membicarakan pilihan layanan sebelum memutuskan." },
    ],
  },
];

/** Flat list in category order, for the booking dropdown. */
export const ALL_SERVICES: Array<Service & { categoryId: string; categoryName: string }> =
  SERVICE_CATEGORIES.flatMap((c) =>
    c.items.map((s) => ({ ...s, categoryId: c.id, categoryName: c.name })),
  );

export const SERVICE_IDS = ALL_SERVICES.map((s) => s.id);

export function findService(id: string) {
  return ALL_SERVICES.find((s) => s.id === id);
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

/**
 * The partnership page, from the client's own proposal
 * (PROPOSAL KEMITRAAN ANDARI SALON 149jt.pdf, 2026: the "Essential" package,
 * which replaced the earlier Rp 250 jt version).
 *
 * Numbers are transcribed exactly as the proposal states them, not
 * recomputed, so the page and the proposal a prospect receives can never
 * disagree. The projection is the client's, and the page says so next to it.
 *
 * Deliberately left out: the monthly cost line items (they are in the
 * proposal, which the page offers on request), the Facebook and TikTok
 * accounts (named without links), and the proposal's rendered interior
 * images (only real photos of the salon are used, in public/photos).
 */

import type { Locale } from "./i18n";
import type { Localized } from "./services";

export type Scenario = {
  key: "low" | "medium" | "high";
  guestsPerDay: number;
  revenueMonth: number;
  costMonth: number;
  netMonth: number;
  roiYearPercent: number;
  paybackMonths: number;
};

export const INVESTMENT = {
  items: [
    { label: { id: "Peralatan salon", en: "Salon equipment" }, amount: 80_000_000 },
    { label: { id: "Produk salon", en: "Salon products" }, amount: 39_000_000 },
    {
      label: {
        id: "Perizinan, trainer, marketing, iklan, dan lain-lain",
        en: "Permits, trainer, marketing, advertising and more",
      },
      amount: 30_000_000,
    },
  ] as Array<{ label: Localized; amount: number }>,
  total: 149_000_000,
  deposit: 5_000_000,
  /** The proposal's "Biaya Sudah Termasuk" page. */
  included: [
    { id: "Pengurusan perizinan Andari Salon", en: "Andari Salon permits" },
    { id: "Budget marketing (KOL/Mediagram)", en: "Marketing budget (KOL/Mediagram)" },
    { id: "Iklan", en: "Advertising" },
    { id: "Laptop", en: "Laptop" },
    { id: "HP", en: "Mobile phone" },
    { id: "Iklan lowongan staff", en: "Staff recruitment ads" },
    { id: "Ongkos kirim barang", en: "Shipping of goods" },
    { id: "Opening set up, training, dan akomodasi", en: "Opening set-up, training and accommodation" },
  ] as Localized[],
};

export const PROJECTION = {
  chairs: 8,
  pricePerTreatment: 80_000,
  scenarios: [
    { key: "low", guestsPerDay: 20, revenueMonth: 48_000_000, costMonth: 32_979_667, netMonth: 15_020_333, roiYearPercent: 121, paybackMonths: 10 },
    { key: "medium", guestsPerDay: 28, revenueMonth: 67_200_000, costMonth: 40_923_667, netMonth: 26_276_333, roiYearPercent: 212, paybackMonths: 6 },
    { key: "high", guestsPerDay: 32, revenueMonth: 76_800_000, costMonth: 43_995_667, netMonth: 32_804_333, roiYearPercent: 264, paybackMonths: 5 },
  ] as Scenario[],
};

/** Areas named on the proposal's "Coming Soon 20+ Cabang" map. */
export const PLANNED_AREAS = [
  "Dalung", "Ayani", "Panjer", "Pedungan", "Sesetan",
  "Tohpati", "Sanur", "Hayam Wuruk", "Kerobokan",
  "Nusa Dua", "Nangka Utara", "Abiansemal", "Gianyar",
  "Jimbaran", "Bangli", "Karangasem", "Klungkung",
  "Singaraja", "Seririt", "Negara", "Tabanan",
];

/**
 * Customer testimonials from the proposal, verbatim. They stay in the
 * language they were written in on both versions of the site.
 */
export const TESTIMONIALS = [
  {
    name: "Marsha V.",
    text: "Nemu hidden gem salon di Denpasar yang tempatnya bagus banget! Aku coba hair spa & nail artnya. Hasilnya bagus banget, staffnya juga ramah sekali, aku di handlenya sama kak Echa (Nail) dan Rani, Yuli dan Astrid (Hair). Recommended sekali.",
  },
  {
    name: "Anggi Komink",
    text: "Wow gk nyesel bgt nyalon dsni @andarisalon tempat keren estetik karyawan ramah bgt bs diajak sharing 🙂 rekomend bgt buat kalian wajib ksni yaa bestis",
  },
  {
    name: "nez nezinez",
    text: "Pertama kali ksini dan happy bbget sama pelayanan dan hasil haircut nya terima kasih smuanyaaa",
  },
  {
    name: "Sintia ds",
    text: "Pelayanannya ramah, tempatnya nyaman dan bersih. Hasilnya juga bagus dan bikin puas. Recommended banget! ✨",
  },
];

export const PHOTOS = [
  { src: "/photos/interior-1.webp", w: 752, h: 339, alt: { id: "Area styling Andari Salon dengan cermin melengkung berlampu", en: "Andari Salon styling area with lit arched mirrors" } },
  { src: "/photos/interior-2.webp", w: 751, h: 339, alt: { id: "Deretan kursi salon dan wastafel keramas", en: "A row of salon chairs and the wash basins" } },
  { src: "/photos/lounge.webp", w: 752, h: 340, alt: { id: "Sofa ruang tunggu", en: "The waiting-area sofa" } },
  { src: "/photos/reception.webp", w: 751, h: 340, alt: { id: "Meja resepsionis berlogo Andari Salon", en: "The reception desk with the Andari Salon logo" } },
] as Array<{ src: string; w: number; h: number; alt: Localized }>;

type Text = {
  about: { label: string; headline: string; body: string[] };
  support: { label: string; headline: string; items: Array<{ title: string; body: string }> };
  investment: {
    label: string;
    headline: string;
    description: string;
    totalLabel: string;
    depositLabel: string;
    depositNote: string;
    includedTitle: string;
    excludedNote: string;
  };
  projection: {
    headline: string;
    assumptions: string;
    scenarioLabels: Record<Scenario["key"], string>;
    rows: {
      guests: string;
      revenue: string;
      cost: string;
      net: string;
      roi: string;
      payback: string;
    };
    perDay: string;
    months: string;
    costNote: string;
    disclaimer: string;
  };
  steps: { label: string; headline: string; items: string[] };
  branches: {
    label: string;
    headline: string;
    branchPrefix: string;
    plannedTitle: string;
    plannedNote: string;
  };
  gallery: { label: string; headline: string };
  testimonials: { label: string; headline: string; note?: string };
  contact: {
    label: string;
    headline: string;
    description: string;
    whatsapp: string;
    email: string;
    instagram: string;
  };
  ctaPrimary: string;
  ctaEmail: string;
  waMessage: string;
};

export const PARTNERSHIP_TEXT: Record<Locale, Text> = {
  id: {
    about: {
      label: "Tentang",
      headline: "Salon yang dibangun untuk bertumbuh.",
      body: [
        "Didirikan pada 2026, Andari Salon adalah bisnis di bidang kecantikan yang hadir untuk menjawab kebutuhan masyarakat akan perawatan diri, dengan visi untuk terus berkembang dan memperluas jangkauan layanan.",
        "Industri kecantikan punya ruang untuk terus tumbuh seiring kebutuhan orang akan perawatan diri. Lewat kemitraan, Andari mengajak Anda ikut membangun bisnis yang bertumbuh, menjangkau pasar yang lebih luas, dan mengembangkan peluang usaha ke depan.",
      ],
    },
    support: {
      label: "Dukungan",
      headline: "Yang Anda dapatkan sebagai mitra.",
      items: [
        {
          title: "Andari Apps",
          body: "Aplikasi kasir dan laporan yang sama dengan Andari: pesanan, stok, pembelian, dan laporan dalam satu tempat.",
        },
        {
          title: "Marketing",
          body: "Budget marketing (KOL/Mediagram) dan iklan, termasuk iklan lowongan staff, sudah termasuk dalam paket.",
        },
        {
          title: "Pengurusan izin",
          body: "Perizinan cabang Andari Salon diurus sebagai bagian dari paket.",
        },
        {
          title: "Supply produk treatment",
          body: "Produk profesional untuk treatment, seperti CBD, Matrix, L'Oréal, dan Makarizo, beserta alat dan perlengkapan salon.",
        },
        {
          title: "Penentuan lokasi",
          body: "Pendampingan memilih lokasi, termasuk survei ruko yang sesuai.",
        },
        {
          title: "Standar SDM dan training",
          body: "Struktur tim (Admin, Lead Hairdresser, dan tiga Asisten Hairdresser) serta pelatihan staff sebelum grand opening.",
        },
      ],
    },
    investment: {
      label: "Investasi",
      headline: "Paket Kemitraan Essential.",
      description: "Estimasi investasi untuk membuka satu cabang Andari Salon, menurut proposal kemitraan.",
      totalLabel: "Total paket",
      depositLabel: "Tanda jadi",
      depositNote: "Dibayarkan setelah meeting, sebelum survei ruko.",
      includedTitle: "Sudah termasuk",
      excludedNote:
        "Belum termasuk biaya lokasi usaha dan renovasi. Pendampingan renovasi tersedia secara opsional dengan biaya tambahan.",
    },
    projection: {
      headline: "Proyeksi per bulan",
      assumptions: "Asumsi: 8 kursi hair, rata-rata Rp 80.000 per treatment, 30 hari operasional.",
      scenarioLabels: { low: "Rendah", medium: "Sedang", high: "Tinggi" },
      rows: {
        guests: "Pelanggan",
        revenue: "Omzet",
        cost: "Pengeluaran",
        net: "Laba bersih mitra",
        roi: "ROI per tahun",
        payback: "Estimasi balik modal",
      },
      perDay: "per hari",
      months: "bulan",
      costNote:
        "Pengeluaran sudah termasuk gaji dan insentif tim, listrik dan wifi, iklan dan marketing (5% omzet), brand fee (7% omzet), sewa ruko per bulan, produk, pengiriman, dan perawatan.",
      disclaimer:
        "Angka di atas adalah proyeksi Andari Salon berdasarkan asumsi tersebut, bukan jaminan hasil. Hasil sebenarnya bergantung pada lokasi, pasar, dan operasional cabang. Rincian lengkapnya ada di proposal.",
    },
    steps: {
      label: "Alur",
      headline: "Alur kemitraan.",
      items: [
        "Anda menghubungi tim kemitraan Andari Salon",
        "Menerima proposal dan jadwal meeting",
        "Meeting bersama tim Andari",
        "Pembayaran tanda jadi Rp 5.000.000",
        "Survei ruko yang sesuai",
        "Tanda tangan kontrak resmi",
        "Pembayaran biaya renovasi ruko",
        "Renovasi ruko",
        "Pelatihan staff",
        "Pelunasan seluruh biaya kemitraan",
        "Grand opening",
      ],
    },
    branches: {
      label: "Cabang",
      headline: "Cabang yang sudah berjalan.",
      branchPrefix: "Andari Salon Cabang",
      plannedTitle: "Segera: 20+ cabang di Bali",
      plannedNote: "Area yang sedang direncanakan:",
    },
    gallery: { label: "Interior", headline: "Interior Andari Salon." },
    testimonials: { label: "Testimoni", headline: "Kata pelanggan kami." },
    contact: {
      label: "Kontak",
      headline: "Hubungi tim kemitraan.",
      description: "Untuk informasi kemitraan lebih lengkap dan proposal, hubungi kami lewat WhatsApp atau email.",
      whatsapp: "WhatsApp kemitraan",
      email: "Email",
      instagram: "Instagram",
    },
    ctaPrimary: "Minta proposal kemitraan",
    ctaEmail: "Kirim email",
    waMessage: "Halo Andari Salon, saya tertarik dengan kemitraan dan ingin meminta proposalnya.",
  },

  en: {
    about: {
      label: "About",
      headline: "A salon built to grow.",
      body: [
        "Founded in 2026, Andari Salon is a beauty business that answers people's need for personal care, with a vision of growing steadily and widening the reach of its services.",
        "The beauty industry keeps growing as people look after themselves. Through partnership, Andari invites you to build that business with us: one that grows, reaches a wider market, and opens new opportunities ahead.",
      ],
    },
    support: {
      label: "Support",
      headline: "What you get as a partner.",
      items: [
        {
          title: "Andari Apps",
          body: "The same point-of-sale and reporting app Andari uses: orders, stock, purchasing and reporting in one place.",
        },
        {
          title: "Marketing",
          body: "A marketing budget (KOL/Mediagram) and advertising, including staff recruitment ads, are part of the package.",
        },
        {
          title: "Permits",
          body: "Permits for the Andari Salon branch are handled as part of the package.",
        },
        {
          title: "Treatment product supply",
          body: "Professional treatment products such as CBD, Matrix, L'Oréal and Makarizo, along with salon tools and equipment.",
        },
        {
          title: "Choosing a location",
          body: "Help choosing the location, including a survey of suitable shop-houses.",
        },
        {
          title: "Staff standards and training",
          body: "A team structure (Admin, Lead Hairdresser and three Assistant Hairdressers) and staff training before the grand opening.",
        },
      ],
    },
    investment: {
      label: "Investment",
      headline: "The Essential Partnership Package.",
      description: "The estimated investment to open one Andari Salon branch, according to the partnership proposal.",
      totalLabel: "Package total",
      depositLabel: "Deposit",
      depositNote: "Paid after the meeting, before the shop-house survey.",
      includedTitle: "Already included",
      excludedNote:
        "Not included: the cost of the business premises and renovation. Renovation support is available as an option at extra cost.",
    },
    projection: {
      headline: "Monthly projection",
      assumptions: "Assumes 8 hair chairs, an average of Rp 80.000 per treatment, and 30 operating days.",
      scenarioLabels: { low: "Low", medium: "Medium", high: "High" },
      rows: {
        guests: "Customers",
        revenue: "Revenue",
        cost: "Expenses",
        net: "Partner net profit",
        roi: "ROI per year",
        payback: "Estimated payback",
      },
      perDay: "per day",
      months: "months",
      costNote:
        "Expenses include team salaries and incentives, electricity and wifi, advertising and marketing (5% of revenue), a brand fee (7% of revenue), monthly shop-house rent, products, delivery and maintenance.",
      disclaimer:
        "These figures are Andari Salon's projection under the assumptions above, not a guarantee. Actual results depend on location, market and how the branch is run. The full breakdown is in the proposal.",
    },
    steps: {
      label: "Process",
      headline: "How the partnership works.",
      items: [
        "You contact the Andari Salon partnership team",
        "You receive the proposal and a meeting time",
        "Meeting with the Andari team",
        "Deposit of Rp 5.000.000",
        "Survey of a suitable shop-house",
        "Signing the formal contract",
        "Payment for the shop-house renovation",
        "Shop-house renovation",
        "Staff training",
        "Settlement of the full partnership fee",
        "Grand opening",
      ],
    },
    branches: {
      label: "Branches",
      headline: "Branches already open.",
      branchPrefix: "Andari Salon",
      plannedTitle: "Coming soon: 20+ branches across Bali",
      plannedNote: "Areas being planned:",
    },
    gallery: { label: "Interior", headline: "Inside Andari Salon." },
    testimonials: {
      label: "Reviews",
      headline: "What our customers say.",
      note: "Reviews are shown in Indonesian, as they were written.",
    },
    contact: {
      label: "Contact",
      headline: "Talk to the partnership team.",
      description: "For full partnership details and the proposal, reach us on WhatsApp or by email.",
      whatsapp: "Partnership WhatsApp",
      email: "Email",
      instagram: "Instagram",
    },
    ctaPrimary: "Request the partnership proposal",
    ctaEmail: "Send an email",
    waMessage: "Hello Andari Salon, I am interested in a partnership and would like to request the proposal.",
  },
};

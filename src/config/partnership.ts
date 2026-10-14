/**
 * The partnership page, from the client's own proposal
 * (PROPOSAL KEMITRAAN ANDARI SALON.pdf, 2026).
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
    {
      label: { id: "Sewa ruko (per tahun)", en: "Shop-house rent (per year)" },
      amount: 50_000_000,
    },
    {
      label: {
        id: "Renovasi, desain interior, furnitur, dan elektronik",
        en: "Renovation, interior design, furniture and electronics",
      },
      amount: 100_000_000,
    },
    {
      label: {
        id: "Peralatan salon, produk, marketing, iklan, dan lain-lain",
        en: "Salon equipment, products, marketing, advertising and more",
      },
      amount: 100_000_000,
    },
  ] as Array<{ label: Localized; amount: number }>,
  total: 250_000_000,
  deposit: 5_000_000,
};

export const PROJECTION = {
  chairs: 8,
  pricePerTreatment: 80_000,
  scenarios: [
    { key: "low", guestsPerDay: 20, revenueMonth: 48_000_000, costMonth: 36_819_667, netMonth: 11_180_333, roiYearPercent: 54, paybackMonths: 22 },
    { key: "medium", guestsPerDay: 28, revenueMonth: 67_200_000, costMonth: 46_299_667, netMonth: 20_900_333, roiYearPercent: 100, paybackMonths: 12 },
    { key: "high", guestsPerDay: 32, revenueMonth: 76_800_000, costMonth: 50_139_667, netMonth: 26_660_333, roiYearPercent: 128, paybackMonths: 9 },
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
          title: "Sistem kasir dan laporan",
          body: "Cabang memakai POS Hero, sistem yang sama dengan Andari: pesanan, stok, pembelian, dan laporan dalam satu tempat.",
        },
        {
          title: "Struktur tim yang jelas",
          body: "Satu Admin (administrasi, kasir, laporan, data pelanggan), satu Lead Hairdresser yang menjaga kualitas layanan rambut, dan tiga Asisten Hairdresser.",
        },
        {
          title: "Pelatihan staff",
          body: "Tim cabang dilatih sebelum grand opening, sebagai bagian dari alur kemitraan.",
        },
        {
          title: "Menu dan produk",
          body: "Menu treatment Andari Salon, dengan produk profesional seperti CBD, Matrix, L'Oréal, dan Makarizo.",
        },
        {
          title: "Renovasi dan interior",
          body: "Renovasi ruko dan desain interior sudah masuk dalam alur dan estimasi biaya kemitraan.",
        },
      ],
    },
    investment: {
      label: "Investasi",
      headline: "Estimasi investasi awal.",
      description: "Gambaran biaya untuk membuka satu cabang, menurut proposal kemitraan Andari Salon.",
      totalLabel: "Total estimasi",
      depositLabel: "Tanda jadi",
      depositNote: "Dibayarkan setelah meeting, sebelum survei ruko.",
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
        "Pengeluaran sudah termasuk gaji dan insentif tim, listrik dan wifi, iklan dan marketing (5% omzet), management fee (15% omzet), sewa ruko yang dicicil per bulan, produk, pengiriman, dan perawatan.",
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
          title: "Point-of-sale and reporting",
          body: "Each branch runs POS Hero, the same system Andari uses: orders, stock, purchasing and reporting in one place.",
        },
        {
          title: "A clear team structure",
          body: "One Admin (administration, cashier, reporting, customer data), one Lead Hairdresser responsible for service quality, and three Assistant Hairdressers.",
        },
        {
          title: "Staff training",
          body: "The branch team is trained before the grand opening, as part of the partnership process.",
        },
        {
          title: "Menu and products",
          body: "The Andari Salon treatment menu, with professional products such as CBD, Matrix, L'Oréal and Makarizo.",
        },
        {
          title: "Renovation and interior",
          body: "Shop-house renovation and interior design are part of the partnership process and its cost estimate.",
        },
      ],
    },
    investment: {
      label: "Investment",
      headline: "Estimated initial investment.",
      description: "What it costs to open one branch, according to the Andari Salon partnership proposal.",
      totalLabel: "Estimated total",
      depositLabel: "Deposit",
      depositNote: "Paid after the meeting, before the shop-house survey.",
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
        "Expenses include team salaries and incentives, electricity and wifi, advertising and marketing (5% of revenue), a management fee (15% of revenue), shop-house rent spread monthly, products, delivery and maintenance.",
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

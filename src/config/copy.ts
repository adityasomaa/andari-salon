/**
 * Every visible string, in both languages.
 *
 * Indonesian is written first and is the source; English mirrors it key for
 * key, and the `Copy` type makes a missing English string a type error rather
 * than a blank on the page.
 *
 * Editorial rules held throughout, because the salon has just opened:
 *   no prices beyond the salon's own price list (src/config/services.ts),
 *   no ratings, no customer counts, no years in business,
 *   no testimonials, no stylist names, no "best" or "certified",
 *   no promises about results, and no pretending to have a track record.
 *
 * Each section carries the same four parts in the same order:
 *   label -> headline -> description -> cta
 * SectionHeader renders them.
 *
 * Links are route keys (see src/config/i18n.ts), never written-out paths, so
 * the same copy object works in either language.
 */

import { ADDRESS, CONTACT, SITE } from "./site";
import type { Locale, RouteKey } from "./i18n";

/** Which pre-written WhatsApp greeting a button opens with. */
export type WaIntent = "general" | "booking" | "products" | "partnership";

export type Cta = {
  label: string;
  /** An internal page. */
  to?: RouteKey;
  /** An in-page anchor or an absolute URL. */
  href?: string;
  /** Opens WhatsApp with this greeting instead of navigating. */
  wa?: WaIntent;
};

export type SectionCopy = {
  label: string;
  headline: string;
  description: string;
  cta?: Cta;
};

type NavItem = { key: RouteKey; label: string };

const COPY_ID = {
  brand: {
    tagline: "Salon rambut di Denpasar Barat",
    description:
      "Andari Salon adalah salon rambut di Tegal Kertha, Denpasar Barat. Lihat treatment, produk, lokasi, dan cara booking.",
  },

  pages: {
    home: {
      metaTitle: "Andari Salon, salon rambut di Denpasar Barat",
      metaDescription: `Andari Salon di ${ADDRESS.village}, Denpasar Barat. Lihat treatment, produk, lokasi, dan cara booking lewat WhatsApp.`,
    },
    treatment: {
      metaTitle: "Treatment",
      metaDescription:
        "Menu dan harga treatment Andari Salon: hair cut, hair wash & styling, hair colouring, hair treatment, dan hair care.",
    },
    products: {
      metaTitle: "Produk",
      metaDescription:
        "Produk perawatan rambut di Andari Salon. Tanyakan ketersediaannya lewat WhatsApp.",
    },
    partnership: {
      metaTitle: "Kemitraan",
      metaDescription: "Ajukan kerja sama dengan Andari Salon lewat WhatsApp.",
    },
    contact: {
      metaTitle: "Kontak",
      metaDescription: `Alamat Andari Salon: ${ADDRESS.full}. Hubungi lewat WhatsApp atau Instagram ${CONTACT.instagramHandle}.`,
    },
    booking: {
      metaTitle: "Booking",
      metaDescription:
        "Pilih treatment, tanggal, dan jam, lalu kirim permintaan booking Andari Salon lewat WhatsApp.",
    },
    privacy: {
      metaTitle: "Kebijakan Privasi",
      metaDescription: `Kebijakan privasi ${SITE.name}.`,
    },
    terms: {
      metaTitle: "Syarat Layanan",
      metaDescription: `Syarat layanan situs ${SITE.name}.`,
    },
  },

  hero: {
    label: "Baru dibuka",
    headline: "Ruang untuk merawat rambut Anda.",
    description:
      "Andari Salon baru saja membuka pintunya. Lihat treatment-nya, lalu pilih tanggal dan jam yang cocok untuk Anda.",
    cta: { label: "Booking sekarang", to: "booking" },
  } as SectionCopy,

  /**
   * Home: about. A first draft written from what is actually known (where the
   * salon is, what it does, how booking works). The owner's own story and
   * photos replace it when they arrive.
   */
  about: {
    label: "Tentang",
    headline: "Tentang Andari Salon.",
    body: [
      `Andari Salon adalah salon rambut di ${ADDRESS.line1}, ${ADDRESS.village}, Denpasar Barat. Kami mengerjakan potong rambut, keramas dan penataan, pewarnaan, serta hair treatment dan hair care.`,
      "Jadwal kunjungan diatur lebih dulu lewat WhatsApp, jadi Anda bisa memilih hari dan jam sebelum datang. Foto ruang dan cerita lengkap kami menyusul di sini.",
    ],
    cta: { label: "Lihat treatment", to: "treatment" } as Cta,
  },

  /** Home: treatment summary. */
  servicesSummary: {
    label: "Treatment",
    headline: "Treatment di Andari Salon.",
    description:
      "Hair cut, keramas dan penataan, pewarnaan, hair treatment, dan hair care. Harga lengkapnya ada di halaman treatment.",
    cta: { label: "Lihat semua treatment", to: "treatment" },
  } as SectionCopy,

  /** Home: location and hours block. */
  location: {
    label: "Lokasi dan jam buka",
    headline: `${ADDRESS.line1}, Denpasar Barat.`,
    description:
      "Kami berada di Tegal Kertha, Denpasar Barat. Alamat lengkap dan petanya ada di halaman kontak.",
    cta: { label: "Lihat peta dan alamat", to: "contact" },
  } as SectionCopy,

  /** Home: entry point into booking. */
  bookingEntry: {
    label: "Booking",
    headline: "Pilih treatment, tanggal, dan jam.",
    description:
      "Isian formulir disusun menjadi satu pesan WhatsApp, lengkap dengan pilihan Anda.",
    cta: { label: "Mulai booking", to: "booking" },
  } as SectionCopy,

  /** Treatment page header. */
  services: {
    label: "Treatment",
    headline: "Menu dan harga.",
    description:
      "Harga dalam rupiah. Hair colouring dan hair treatment dihitung menurut panjang rambut; harga hair colouring adalah harga mulai dari.",
    cta: { label: "Booking treatment", to: "booking" } as Cta,
    sampleNotice:
      "Contoh isi. Daftar treatment yang sebenarnya belum kami rilis, jadi nama di bawah ini masih bisa berubah.",
  },

  /** Products page header. */
  products: {
    label: "Produk",
    headline: "Produk perawatan rambut.",
    description:
      "Produk yang kami pakai dan sediakan di salon akan tampil di sini. Untuk sekarang, tanyakan ketersediaannya lewat WhatsApp.",
    cta: { label: "Tanya produk lewat WhatsApp", wa: "products" } as Cta,
    sampleNotice:
      "Contoh isi. Daftar produk dan mereknya belum kami rilis, jadi kelompok di bawah ini masih bisa berubah.",
  },

  /** Partnership page. */
  partnership: {
    label: "Kemitraan",
    headline: "Bekerja sama dengan Andari Salon.",
    description:
      "Punya usaha, acara, atau ide kolaborasi? Ceritakan rencana Anda lewat WhatsApp, lalu kami balas untuk membicarakannya.",
    cta: { label: "Ajukan kerja sama", wa: "partnership" } as Cta,
    briefTitle: "Supaya bisa langsung kami bahas, sertakan:",
    briefItems: [
      "Nama Anda dan nama usaha atau instansi",
      "Bentuk kerja sama yang Anda bayangkan",
      "Waktu atau periode yang Anda rencanakan",
      "Kontak yang bisa kami hubungi",
    ],
    briefNote: "Detail program kemitraan Andari Salon akan kami umumkan di halaman ini.",
  },

  /** Booking page header. */
  booking: {
    label: "Booking",
    headline: "Atur jadwal kunjungan Anda.",
    description:
      "Isi nama, nomor WhatsApp, treatment, tanggal, dan jam. Isian itu disusun menjadi pesan WhatsApp yang siap dikirim.",
    cta: { label: "Kirim lewat WhatsApp", href: "#form-booking" },
  } as SectionCopy,

  /** Contact page header. */
  contact: {
    label: "Kontak",
    headline: "Alamat, WhatsApp, dan Instagram.",
    description: `Andari Salon ada di ${ADDRESS.line1}, ${ADDRESS.village}, ${ADDRESS.district}. Sapa kami lewat WhatsApp atau Instagram.`,
    cta: { label: "Hubungi lewat WhatsApp", wa: "general" },
  } as SectionCopy,

  /**
   * Footer CTA. Present on every page so each page ends with an action.
   * `alt` is used when the visitor is already on the page `cta` points at.
   */
  footerCta: {
    label: "Langkah berikutnya",
    headline: "Siap memilih jadwal?",
    description: "Pilih treatment, tanggal, dan jam. Pesannya terkirim lewat WhatsApp.",
    cta: { label: "Booking sekarang", to: "booking" } as Cta,
    alt: {
      headline: "Ada yang ingin ditanyakan?",
      description: "Kirim pesan langsung, atau lihat alamat dan petanya di halaman kontak.",
      cta: { label: "Hubungi lewat WhatsApp", wa: "general" } as Cta,
    },
  },

  form: {
    legend: "Formulir booking",
    name: {
      label: "Nama",
      hint: "Nama yang kami panggil saat Anda datang.",
      placeholder: "Contoh: Ayu Pratiwi",
    },
    phone: {
      label: "Nomor WhatsApp",
      hint: "Boleh ditulis 08xx atau +62, dengan spasi atau tanda hubung. Nomor luar negeri pakai kode negara.",
      placeholder: "08xxxxxxxxxx",
    },
    service: {
      label: "Treatment",
      hint: "Pilih satu. Tambahan (add ons) bisa ditulis di catatan.",
      sampleHint: "Daftar ini masih contoh.",
      placeholder: "Pilih treatment",
    },
    date: {
      label: "Tanggal",
      hint: "Tanggal yang sudah lewat tidak bisa dipilih.",
      placeholder: "Pilih tanggal",
    },
    time: {
      label: "Jam",
      hint: "Pilih salah satu slot.",
      placeholder: "Pilih jam",
    },
    notes: {
      label: "Catatan",
      hint: "Boleh dikosongkan.",
      placeholder: "Hal lain yang perlu kami tahu",
    },
    submit: "Susun pesan WhatsApp",
    submitting: "Menyusun pesan",
    successTitle: "Pesan Anda siap.",
    successBody:
      "Tekan tombol di bawah untuk membuka WhatsApp. Isi pesannya sudah lengkap dan masih bisa Anda ubah sebelum dikirim.",
    successOpen: "Buka WhatsApp",
    successReset: "Ubah isian",
    errorTitle: "Ada isian yang perlu diperbaiki.",
    errorNetwork: "Pesan gagal disusun. Coba sekali lagi.",
    confirmNote:
      "Mengirim formulir ini belum mengunci jadwal. Kami balas lewat WhatsApp untuk memastikannya.",
  },

  datePicker: {
    dialog: "Pilih tanggal",
    prev: "Bulan sebelumnya",
    next: "Bulan berikutnya",
    unavailableBefore: (date: string) => `Tanggal sebelum ${date} tidak tersedia.`,
  },

  location_block: {
    addressTitle: "Alamat",
    hoursTitle: "Jam buka",
    copyAddress: "Salin alamat",
    copiedAddress: "Alamat tersalin",
    openMaps: "Buka di Google Maps",
    mapTitle: "Peta lokasi Andari Salon",
  },

  hours: {
    unknownLabel: "Jam buka belum kami umumkan.",
    unknownHint: "Tanyakan lewat WhatsApp untuk jam hari ini.",
    days: {
      Mo: "Senin",
      Tu: "Selasa",
      We: "Rabu",
      Th: "Kamis",
      Fr: "Jumat",
      Sa: "Sabtu",
      Su: "Minggu",
    },
  },

  cookies: {
    title: "Cookie",
    body:
      "Kami memakai cookie yang diperlukan agar situs berjalan. Cookie pengukuran kunjungan hanya aktif kalau Anda mengizinkannya.",
    accept: "Izinkan semua",
    reject: "Hanya yang diperlukan",
    manage: "Atur",
    save: "Simpan pilihan",
    necessaryTitle: "Diperlukan",
    necessaryBody: "Menyimpan pilihan cookie Anda. Tidak bisa dimatikan.",
    analyticsTitle: "Pengukuran kunjungan",
    analyticsBody: "Menghitung halaman yang dibuka. Mati sampai Anda mengizinkan.",
    settingsLink: "Pengaturan cookie",
  },

  nav: {
    open: "Buka menu",
    close: "Tutup menu",
    skip: "Lewati ke konten utama",
    menuLabel: "Menu utama",
    homeAria: "Andari Salon, beranda",
    items: [
      { key: "home", label: "Beranda" },
      { key: "treatment", label: "Treatment" },
      { key: "products", label: "Produk" },
      { key: "partnership", label: "Kemitraan" },
      { key: "contact", label: "Kontak" },
    ] as NavItem[],
    /** The header button. Opens WhatsApp with the booking greeting. */
    booking: "Booking",
    bookingLong: "Booking lewat WhatsApp",
    language: "Pilih bahasa",
  },

  legalNav: [
    { key: "privacy", label: "Kebijakan Privasi" },
    { key: "terms", label: "Syarat Layanan" },
  ] as NavItem[],

  footer: {
    addressTitle: "Alamat",
    contactTitle: "Kontak",
    hoursTitle: "Jam buka",
    navTitle: "Halaman",
    bookingForm: "Formulir booking",
    rights: "Andari Salon",
  },

  /** WhatsApp messages. The message is the message: no URL, no page tag. */
  wa: {
    general: `Halo ${SITE.name}, saya ingin bertanya.`,
    booking: `Halo ${SITE.name}, saya ingin booking.`,
    products: `Halo ${SITE.name}, saya ingin bertanya tentang produk.`,
    partnership: `Halo ${SITE.name}, saya ingin mengajukan kerja sama.`,
    fields: {
      name: "Nama",
      phone: "WhatsApp",
      service: "Treatment",
      date: "Tanggal",
      time: "Jam",
      notes: "Catatan",
    },
  },
};

export type Copy = typeof COPY_ID;

const COPY_EN: Copy = {
  brand: {
    tagline: "Hair salon in West Denpasar, Bali",
    description:
      "Andari Salon is a hair salon in Tegal Kertha, West Denpasar, Bali. See treatments, products, location, and how to book.",
  },

  pages: {
    home: {
      metaTitle: "Andari Salon, hair salon in West Denpasar, Bali",
      metaDescription: `Andari Salon in ${ADDRESS.village}, West Denpasar, Bali. See treatments, products, location, and how to book on WhatsApp.`,
    },
    treatment: {
      metaTitle: "Treatments",
      metaDescription:
        "Andari Salon treatment menu and prices: hair cut, hair wash & styling, hair colouring, hair treatment and hair care.",
    },
    products: {
      metaTitle: "Products",
      metaDescription: "Hair care products at Andari Salon. Ask about availability on WhatsApp.",
    },
    partnership: {
      metaTitle: "Partnership",
      metaDescription: "Propose a partnership with Andari Salon on WhatsApp.",
    },
    contact: {
      metaTitle: "Contact",
      metaDescription: `Andari Salon's address: ${ADDRESS.full}. Message us on WhatsApp or Instagram ${CONTACT.instagramHandle}.`,
    },
    booking: {
      metaTitle: "Booking",
      metaDescription:
        "Choose a treatment, date and time, then send your Andari Salon booking request on WhatsApp.",
    },
    privacy: {
      metaTitle: "Privacy Policy",
      metaDescription: `${SITE.name} privacy policy.`,
    },
    terms: {
      metaTitle: "Terms of Use",
      metaDescription: `Terms of use for the ${SITE.name} website.`,
    },
  },

  hero: {
    label: "Newly opened",
    headline: "A place to care for your hair.",
    description:
      "Andari Salon has just opened its doors. Browse the treatments, then pick a date and time that suits you.",
    cta: { label: "Book now", to: "booking" },
  },

  about: {
    label: "About",
    headline: "About Andari Salon.",
    body: [
      `Andari Salon is a hair salon on ${ADDRESS.line1}, ${ADDRESS.village}, West Denpasar. We do cuts, washes and styling, colour, and hair treatments and care.`,
      "Visits are arranged ahead over WhatsApp, so you can choose the day and time before you come. Photos of the space and the rest of our story are on their way.",
    ],
    cta: { label: "See treatments", to: "treatment" },
  },

  servicesSummary: {
    label: "Treatments",
    headline: "Treatments at Andari Salon.",
    description:
      "Cuts, washes and styling, colour, hair treatments and hair care. Full prices are on the treatments page.",
    cta: { label: "See all treatments", to: "treatment" },
  },

  location: {
    label: "Location and hours",
    headline: `${ADDRESS.line1}, West Denpasar.`,
    description:
      "We are in Tegal Kertha, West Denpasar. The full address and a map are on the contact page.",
    cta: { label: "See map and address", to: "contact" },
  },

  bookingEntry: {
    label: "Booking",
    headline: "Choose a treatment, date and time.",
    description: "The form turns your choices into one WhatsApp message, ready to send.",
    cta: { label: "Start booking", to: "booking" },
  },

  services: {
    label: "Treatments",
    headline: "Menu and prices.",
    description:
      "Prices are in Indonesian rupiah. Hair colouring and hair treatments are priced by hair length; colouring prices are starting prices.",
    cta: { label: "Book a treatment", to: "booking" },
    sampleNotice:
      "Sample content. The final treatment menu has not been released yet, so the names below may still change.",
  },

  products: {
    label: "Products",
    headline: "Hair care products.",
    description:
      "The products we use and stock at the salon will be listed here. For now, ask us about availability on WhatsApp.",
    cta: { label: "Ask about products on WhatsApp", wa: "products" },
    sampleNotice:
      "Sample content. The product list and brands have not been released yet, so the groups below may still change.",
  },

  partnership: {
    label: "Partnership",
    headline: "Work with Andari Salon.",
    description:
      "Running a business, planning an event, or have an idea for a collaboration? Tell us about it on WhatsApp and we will reply to talk it through.",
    cta: { label: "Propose a partnership", wa: "partnership" },
    briefTitle: "So we can discuss it straight away, include:",
    briefItems: [
      "Your name and the name of your business or organisation",
      "The kind of collaboration you have in mind",
      "The timing or period you are planning for",
      "How we can reach you",
    ],
    briefNote: "Details of the Andari Salon partnership programme will be announced on this page.",
  },

  booking: {
    label: "Booking",
    headline: "Plan your visit.",
    description:
      "Fill in your name, WhatsApp number, treatment, date and time. We turn it into a WhatsApp message that is ready to send.",
    cta: { label: "Send on WhatsApp", href: "#form-booking" },
  },

  contact: {
    label: "Contact",
    headline: "Address, WhatsApp and Instagram.",
    description: `Andari Salon is at ${ADDRESS.line1}, ${ADDRESS.village}, West Denpasar. Say hello on WhatsApp or Instagram.`,
    cta: { label: "Message us on WhatsApp", wa: "general" },
  },

  footerCta: {
    label: "Next step",
    headline: "Ready to pick a time?",
    description: "Choose a treatment, date and time. The message goes out over WhatsApp.",
    cta: { label: "Book now", to: "booking" },
    alt: {
      headline: "Have a question?",
      description: "Send us a message, or find the address and map on the contact page.",
      cta: { label: "Message us on WhatsApp", wa: "general" },
    },
  },

  form: {
    legend: "Booking form",
    name: {
      label: "Name",
      hint: "The name we will call you when you arrive.",
      placeholder: "e.g. Ayu Pratiwi",
    },
    phone: {
      label: "WhatsApp number",
      hint: "Include the country code if it is not an Indonesian number, e.g. +61 412 345 678.",
      placeholder: "+61 412 345 678",
    },
    service: {
      label: "Treatment",
      hint: "Choose one. Add-ons can go in the notes.",
      sampleHint: "This list is still a sample.",
      placeholder: "Choose a treatment",
    },
    date: {
      label: "Date",
      hint: "Past dates cannot be chosen.",
      placeholder: "Choose a date",
    },
    time: {
      label: "Time",
      hint: "Pick one of the slots.",
      placeholder: "Choose a time",
    },
    notes: {
      label: "Notes",
      hint: "Optional.",
      placeholder: "Anything else we should know",
    },
    submit: "Prepare WhatsApp message",
    submitting: "Preparing message",
    successTitle: "Your message is ready.",
    successBody:
      "Press the button below to open WhatsApp. The message is complete, and you can still edit it before sending.",
    successOpen: "Open WhatsApp",
    successReset: "Edit details",
    errorTitle: "Some fields need fixing.",
    errorNetwork: "The message could not be prepared. Please try again.",
    confirmNote:
      "Sending this form does not lock in the time yet. We will reply on WhatsApp to confirm it.",
  },

  datePicker: {
    dialog: "Choose a date",
    prev: "Previous month",
    next: "Next month",
    unavailableBefore: (date: string) => `Dates before ${date} are not available.`,
  },

  location_block: {
    addressTitle: "Address",
    hoursTitle: "Opening hours",
    copyAddress: "Copy address",
    copiedAddress: "Address copied",
    openMaps: "Open in Google Maps",
    mapTitle: "Map showing Andari Salon",
  },

  hours: {
    unknownLabel: "Opening hours have not been announced yet.",
    unknownHint: "Ask on WhatsApp for today's hours.",
    days: {
      Mo: "Monday",
      Tu: "Tuesday",
      We: "Wednesday",
      Th: "Thursday",
      Fr: "Friday",
      Sa: "Saturday",
      Su: "Sunday",
    },
  },

  cookies: {
    title: "Cookies",
    body:
      "We use the cookies the site needs to work. Visit measurement only runs if you allow it.",
    accept: "Allow all",
    reject: "Necessary only",
    manage: "Manage",
    save: "Save choices",
    necessaryTitle: "Necessary",
    necessaryBody: "Stores your cookie choice. Cannot be turned off.",
    analyticsTitle: "Visit measurement",
    analyticsBody: "Counts which pages are opened. Off until you allow it.",
    settingsLink: "Cookie settings",
  },

  nav: {
    open: "Open menu",
    close: "Close menu",
    skip: "Skip to main content",
    menuLabel: "Main menu",
    homeAria: "Andari Salon, home",
    items: [
      { key: "home", label: "Home" },
      { key: "treatment", label: "Treatments" },
      { key: "products", label: "Products" },
      { key: "partnership", label: "Partnership" },
      { key: "contact", label: "Contact" },
    ],
    booking: "Booking",
    bookingLong: "Book on WhatsApp",
    language: "Choose language",
  },

  legalNav: [
    { key: "privacy", label: "Privacy Policy" },
    { key: "terms", label: "Terms of Use" },
  ],

  footer: {
    addressTitle: "Address",
    contactTitle: "Contact",
    hoursTitle: "Opening hours",
    navTitle: "Pages",
    bookingForm: "Booking form",
    rights: "Andari Salon",
  },

  wa: {
    general: `Hello ${SITE.name}, I have a question.`,
    booking: `Hello ${SITE.name}, I would like to book.`,
    products: `Hello ${SITE.name}, I would like to ask about your products.`,
    partnership: `Hello ${SITE.name}, I would like to propose a partnership.`,
    fields: {
      name: "Name",
      phone: "WhatsApp",
      service: "Treatment",
      date: "Date",
      time: "Time",
      notes: "Notes",
    },
  },
};

const COPIES: Record<Locale, Copy> = { id: COPY_ID, en: COPY_EN };

export function getCopy(locale: Locale): Copy {
  return COPIES[locale];
}

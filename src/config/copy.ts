/**
 * Every visible string, shared verbatim by all three templates.
 *
 * The three previews must differ in design only. If the words differ, the
 * client ends up comparing copy instead of layout, which defeats the point.
 *
 * Editorial rules held throughout, because the salon has just opened:
 *   no prices, no ratings, no customer counts, no years in business,
 *   no testimonials, no stylist names, no "best" or "certified",
 *   no promises about results, and no pretending to have a track record.
 *
 * Each section carries the same four parts in the same order:
 *   label -> headline -> description -> cta
 * SectionHeader renders them; each template decides how they look.
 */

import { ADDRESS, CONTACT } from "./site";

export type Cta = {
  label: string;
  /** Path relative to the template root, or an absolute URL. */
  href: string;
  /** Present when the CTA should open WhatsApp rather than navigate. */
  whatsapp?: boolean;
};

export type SectionCopy = {
  label: string;
  headline: string;
  description: string;
  cta: Cta;
};

export const COPY = {
  brand: {
    tagline: "Salon rambut di Denpasar Barat",
    /** Used for alt text on the wordmark. Never claims to be a photo. */
    logoAlt: "Andari Salon",
  },

  pages: {
    home: {
      title: "Andari Salon",
      metaTitle: "Andari Salon, salon rambut baru di Denpasar Barat",
      metaDescription: `Andari Salon baru dibuka di ${ADDRESS.village}, ${ADDRESS.district.replace("Kec. ", "")}. Lihat layanan, lokasi, dan cara booking lewat WhatsApp.`,
    },
    layanan: {
      title: "Layanan",
      metaTitle: "Layanan",
      metaDescription:
        "Kelompok layanan Andari Salon: potong dan penataan, pewarnaan, perawatan rambut, dan perawatan lain. Daftar isinya masih contoh.",
    },
    booking: {
      title: "Booking",
      metaTitle: "Booking",
      metaDescription:
        "Pilih layanan, tanggal, dan jam, lalu kirim permintaan booking Andari Salon lewat WhatsApp.",
    },
    kontak: {
      title: "Kontak",
      metaTitle: "Kontak",
      metaDescription: `Alamat Andari Salon: ${ADDRESS.full}. Hubungi lewat WhatsApp atau Instagram ${CONTACT.instagramHandle}.`,
    },
  },

  hero: {
    label: "Baru dibuka",
    headline: "Salon rambut baru di Denpasar Barat.",
    description:
      "Andari Salon baru saja membuka pintunya. Lihat layanannya, lalu pilih tanggal dan jam yang cocok untuk Anda.",
    cta: { label: "Booking lewat WhatsApp", href: "/booking" },
  } satisfies SectionCopy,

  /** Home: services summary. */
  servicesSummary: {
    label: "Layanan",
    headline: "Empat kelompok layanan.",
    description:
      "Potong dan penataan, pewarnaan, perawatan rambut, dan perawatan lain. Isi setiap kelompok masih berupa contoh.",
    cta: { label: "Lihat semua layanan", href: "/layanan" },
  } satisfies SectionCopy,

  /** Home: location and hours block. */
  location: {
    label: "Lokasi dan jam buka",
    headline: `${ADDRESS.line1}, ${ADDRESS.district.replace("Kec. ", "")}.`,
    description:
      "Kami berada di Tegal Kertha, Denpasar Barat. Alamat lengkap dan petanya ada di halaman kontak.",
    cta: { label: "Lihat peta dan alamat", href: "/kontak" },
  } satisfies SectionCopy,

  /** Home: entry point into booking. */
  bookingEntry: {
    label: "Booking",
    headline: "Pilih layanan, tanggal, dan jam.",
    description:
      "Isian formulir disusun menjadi satu pesan WhatsApp, lengkap dengan pilihan Anda.",
    cta: { label: "Mulai booking", href: "/booking" },
  } satisfies SectionCopy,

  /** Layanan page header. */
  services: {
    label: "Layanan",
    headline: "Daftar layanan.",
    description:
      "Isi daftar ini masih contoh. Kami perbarui begitu daftar resminya siap.",
    cta: { label: "Booking layanan", href: "/booking" },
    sampleNotice:
      "Contoh isi. Daftar layanan yang sebenarnya belum kami rilis, jadi nama di bawah ini masih bisa berubah.",
  },

  /** Booking page header. */
  booking: {
    label: "Booking",
    headline: "Atur jadwal kunjungan Anda.",
    description:
      "Isi nama, nomor WhatsApp, layanan, tanggal, dan jam. Isian itu disusun menjadi pesan WhatsApp yang siap dikirim.",
    cta: { label: "Kirim lewat WhatsApp", href: "#form-booking" },
  } satisfies SectionCopy,

  /** Kontak page header. */
  contact: {
    label: "Kontak",
    headline: "Alamat, WhatsApp, dan Instagram.",
    description: `Andari Salon ada di ${ADDRESS.line1}, ${ADDRESS.village}, ${ADDRESS.district}. Sapa kami lewat WhatsApp atau Instagram.`,
    cta: { label: "Hubungi lewat WhatsApp", href: "#", whatsapp: true },
  } satisfies SectionCopy,

  /**
   * Footer CTA. Present on every page so each page ends with an action.
   * `alt` is used when the visitor is already on the page `cta` points at.
   */
  footerCta: {
    label: "Langkah berikutnya",
    headline: "Siap memilih jadwal?",
    description: "Pilih layanan, tanggal, dan jam. Pesannya terkirim lewat WhatsApp.",
    cta: { label: "Booking sekarang", href: "/booking" },
    alt: {
      headline: "Ada yang ingin ditanyakan?",
      description: "Kirim pesan langsung, atau lihat alamat dan petanya di halaman kontak.",
      cta: { label: "Hubungi lewat WhatsApp", href: "#", whatsapp: true } as Cta,
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
      hint: "Boleh diawali 08 atau 62.",
      placeholder: "08xxxxxxxxxx",
    },
    service: {
      label: "Layanan",
      hint: "Pilih satu. Bisa diubah saat kami balas.",
      placeholder: "Pilih layanan",
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

  location_block: {
    addressTitle: "Alamat",
    hoursTitle: "Jam buka",
    copyAddress: "Salin alamat",
    copiedAddress: "Alamat tersalin",
    openMaps: "Buka di Google Maps",
    mapTitle: "Peta lokasi Andari Salon",
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
  },

  switcher: {
    label: "Pratinjau template",
    hint: "Alat pratinjau, bukan bagian dari situs.",
    open: "Ganti template",
    close: "Tutup pemilih template",
  },

  chooser: {
    title: "Andari Salon, tiga arah desain",
    lead:
      "Tiga situs utuh dengan isi yang sama persis. Yang berbeda hanya desain dan cara menyusunnya. Buka satu per satu, lalu bandingkan.",
    note:
      "Halaman ini alat bantu untuk memilih, bukan bagian dari situs salon.",
    openLabel: "Buka",
  },

  footer: {
    addressTitle: "Alamat",
    contactTitle: "Kontak",
    hoursTitle: "Jam buka",
    navTitle: "Halaman",
    legalTitle: "Ketentuan",
    rights: "Andari Salon",
    builtNote: "Situs ini masih dalam pratinjau.",
  },
} as const;

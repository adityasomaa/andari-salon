import type { Metadata } from "next";

import { ADDRESS, CONTACT, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: `Kebijakan privasi ${SITE.name}.`,
  alternates: { canonical: `${SITE.url}/privacy` },
};

/**
 * Standard language only. No invented dates, retention periods, processor
 * names or legal entities: the business has just opened and none of that has
 * been decided yet.
 */
export default function PrivacyPage() {
  return (
    <article>
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] leading-tight font-medium tracking-tight">
        Kebijakan Privasi
      </h1>
      <p>
        Halaman ini menjelaskan data apa yang situs {SITE.name} kumpulkan dan bagaimana data
        itu dipakai. Bahasanya sengaja dibuat sederhana.
      </p>

      <h2>Data yang Anda kirim sendiri</h2>
      <p>
        Formulir booking di situs ini tidak menyimpan data ke basis data mana pun. Isian Anda
        disusun menjadi satu pesan WhatsApp, lalu pesan itu dibuka di aplikasi WhatsApp Anda.
        Anda yang menekan kirim. Sebelum Anda menekan kirim, kami belum menerima apa pun.
      </p>
      <ul>
        <li>Nama yang Anda tulis</li>
        <li>Nomor WhatsApp yang Anda tulis</li>
        <li>Layanan, tanggal, dan jam yang Anda pilih</li>
        <li>Catatan tambahan, kalau Anda mengisinya</li>
        <li>Alamat halaman tempat formulir itu dibuka</li>
      </ul>
      <p>
        Setelah pesan terkirim, isinya ada di percakapan WhatsApp antara Anda dan kami, dan
        tunduk pada ketentuan WhatsApp.
      </p>

      <h2>Cookie</h2>
      <p>
        Situs ini menyimpan satu pilihan di peramban Anda, yaitu jawaban Anda pada panel
        cookie. Penyimpanan itu diperlukan supaya panelnya tidak muncul terus menerus, dan
        tidak bisa dimatikan.
      </p>
      <p>
        Pengukuran kunjungan mati sampai Anda mengizinkannya. Kalau Anda mengizinkan, situs
        mengirim satu permintaan ke alamat di server situs ini sendiri setiap kali sebuah
        halaman dibuka. Tidak ada layanan pihak ketiga yang dilibatkan. Anda bisa mengubah
        pilihan itu kapan saja lewat tautan Pengaturan cookie di footer.
      </p>

      <h2>Peta</h2>
      <p>
        Halaman kontak memuat peta dari Google Maps. Saat peta itu tampil, peramban Anda
        terhubung ke server Google, dan Google dapat menerima data teknis seperti alamat IP
        Anda. Hal itu di luar kendali kami.
      </p>

      <h2>Berbagi data</h2>
      <p>
        Kami tidak menjual data Anda dan tidak membagikannya untuk keperluan iklan.
      </p>

      <h2>Hak Anda</h2>
      <p>
        Anda boleh meminta kami menghapus percakapan WhatsApp Anda dengan kami. Kirim
        permintaannya lewat WhatsApp ke {CONTACT.whatsappDisplay}.
      </p>

      <h2>Menghubungi kami</h2>
      <p>
        {SITE.name}, {ADDRESS.full}. WhatsApp {CONTACT.whatsappDisplay}. Instagram{" "}
        {CONTACT.instagramHandle}.
      </p>

      <h2>Perubahan</h2>
      <p>
        Kalau isi halaman ini berubah, versi terbarunya langsung tampil di halaman ini.
      </p>
    </article>
  );
}

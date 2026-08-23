import type { Metadata } from "next";

import { ADDRESS, CONTACT, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Syarat Layanan",
  description: `Syarat layanan situs ${SITE.name}.`,
  alternates: { canonical: `${SITE.url}/terms` },
};

/**
 * Standard language only. No prices, no cancellation windows, no guarantees:
 * none of those have been set, and printing a guess would be a promise the
 * salon never made.
 */
export default function TermsPage() {
  return (
    <article>
      <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] leading-tight font-medium tracking-tight">
        Syarat Layanan
      </h1>
      <p>
        Syarat berikut berlaku untuk pemakaian situs {SITE.name}. Dengan memakai situs ini,
        Anda menyetujuinya.
      </p>

      <h2>Isi situs</h2>
      <p>
        Situs ini menampilkan keterangan umum tentang salon kami. {SITE.name} baru dibuka,
        dan sebagian isinya masih berupa contoh. Daftar layanan yang tampil sekarang adalah
        contoh dan belum tentu sama dengan daftar akhirnya.
      </p>

      <h2>Booking</h2>
      <p>
        Formulir booking di situs ini menyusun sebuah pesan WhatsApp. Mengirim pesan itu
        berarti mengajukan permintaan jadwal, bukan mengunci jadwal. Jadwal baru berlaku
        setelah kami membalas dan menyepakatinya bersama Anda.
      </p>
      <ul>
        <li>Isi keterangan yang benar supaya kami bisa menghubungi Anda kembali.</li>
        <li>Kalau rencana Anda berubah, beri tahu kami lewat WhatsApp.</li>
        <li>Kami dapat menolak atau menawarkan waktu lain kalau jadwalnya berbenturan.</li>
      </ul>

      <h2>Harga</h2>
      <p>
        Situs ini tidak mencantumkan harga. Tanyakan langsung lewat WhatsApp atau saat Anda
        berada di salon.
      </p>

      <h2>Pemakaian yang wajar</h2>
      <p>
        Jangan memakai situs ini untuk mengirim spam, mencoba merusak layanannya, atau
        mengambil isinya secara otomatis dalam jumlah besar.
      </p>

      <h2>Hak atas isi</h2>
      <p>
        Nama, logo, tulisan, dan gambar di situs ini milik {SITE.name}. Jangan dipakai ulang
        tanpa izin kami.
      </p>

      <h2>Tautan ke pihak lain</h2>
      <p>
        Situs ini menautkan ke WhatsApp, Instagram, dan Google Maps. Layanan itu punya
        ketentuannya sendiri dan berada di luar kendali kami.
      </p>

      <h2>Batas tanggung jawab</h2>
      <p>
        Kami berusaha menjaga isi situs ini tetap benar, tetapi tidak menjamin situs selalu
        dapat diakses atau bebas dari kekeliruan. Kalau Anda menemukan keterangan yang salah,
        beri tahu kami.
      </p>

      <h2>Menghubungi kami</h2>
      <p>
        {SITE.name}, {ADDRESS.full}. WhatsApp {CONTACT.whatsappDisplay}. Instagram{" "}
        {CONTACT.instagramHandle}.
      </p>
    </article>
  );
}

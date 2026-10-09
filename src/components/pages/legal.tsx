import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitch } from "@/components/shared/language-switch";
import { Wordmark } from "@/components/shared/logo";
import { getCopy } from "@/config/copy";
import { href, type Locale } from "@/config/i18n";
import { ADDRESS, CONTACT, SITE } from "@/config/site";

/**
 * The legal pages, in both languages. They carry no design opinion of their
 * own, and no invented numbers, dates, company entities or jurisdictions.
 */
export function LegalShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const copy = getCopy(locale);
  return (
    <div data-template="t2" className="min-h-screen-svh bg-[#fbfaf7] text-[#2b2a20]">
      <header className="border-b border-[#57554022]">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link href={href("home", locale)} aria-label={copy.nav.homeAria}>
            <Wordmark tone="olive" width={130} className="w-[120px]" />
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <nav className="flex gap-4 text-[0.82rem]">
              {copy.legalNav.map((l) => (
                <Link key={l.key} href={href(l.key, locale)} className="underline underline-offset-4">
                  {l.label}
                </Link>
              ))}
            </nav>
            <LanguageSwitch />
          </div>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto w-full max-w-3xl px-6 py-12 [&_h2]:mt-10 [&_h2]:text-[1.15rem] [&_h2]:font-medium [&_li]:leading-relaxed [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-[#4a4740] [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:ps-5 [&_ul]:text-[#4a4740]"
      >
        {children}
      </main>

      <footer className="mx-auto w-full max-w-3xl px-6 pb-12 text-[0.8rem] text-[#6f6c52]">
        <p>
          {new Date().getFullYear()} {copy.footer.rights}
        </p>
      </footer>
    </div>
  );
}

const H1 = "text-[clamp(1.6rem,4vw,2.2rem)] leading-tight font-medium tracking-tight";

function ContactLine() {
  return (
    <p>
      {SITE.name}, {ADDRESS.full}. WhatsApp {CONTACT.whatsappDisplay}. Instagram{" "}
      {CONTACT.instagramHandle}.
    </p>
  );
}

export function PrivacyContent({ locale }: { locale: Locale }) {
  if (locale === "en") {
    return (
      <article>
        <h1 className={H1}>Privacy Policy</h1>
        <p>
          This page explains what data the {SITE.name} website collects and how it is used. It
          is written in plain language on purpose.
        </p>

        <h2>Data you send yourself</h2>
        <p>
          The booking form does not store anything in a database. What you fill in is put
          together into one WhatsApp message, which then opens in your WhatsApp app. You are the
          one who presses send. Until you do, we have received nothing.
        </p>
        <ul>
          <li>The name you write</li>
          <li>The WhatsApp number you write</li>
          <li>The treatment, date and time you choose</li>
          <li>Any notes, if you add them</li>
        </ul>
        <p>
          Once the message is sent, it sits in the WhatsApp conversation between you and us and
          is subject to WhatsApp&apos;s own terms.
        </p>

        <h2>Cookies</h2>
        <p>
          The site stores one choice in your browser: your answer in the cookie panel. That is
          needed so the panel does not keep reappearing, and it cannot be turned off.
        </p>
        <p>
          Visit measurement is off until you allow it. If you allow it, the site sends one request
          to an address on this site&apos;s own server each time a page is opened. No third-party
          service is involved. You can change that choice at any time through the Cookie settings
          link in the footer.
        </p>

        <h2>Maps</h2>
        <p>
          The contact page shows a map from Google Maps. When it loads, your browser connects to
          Google&apos;s servers, and Google may receive technical data such as your IP address.
          That is outside our control.
        </p>

        <h2>Sharing data</h2>
        <p>We do not sell your data and do not share it for advertising.</p>

        <h2>Your rights</h2>
        <p>
          You may ask us to delete your WhatsApp conversation with us. Send the request on
          WhatsApp to {CONTACT.whatsappDisplay}.
        </p>

        <h2>Contacting us</h2>
        <ContactLine />

        <h2>Changes</h2>
        <p>If this page changes, the latest version appears here straight away.</p>
      </article>
    );
  }

  return (
    <article>
      <h1 className={H1}>Kebijakan Privasi</h1>
      <p>
        Halaman ini menjelaskan data apa yang situs {SITE.name} kumpulkan dan bagaimana data itu
        dipakai. Bahasanya sengaja dibuat sederhana.
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
        <li>Treatment, tanggal, dan jam yang Anda pilih</li>
        <li>Catatan tambahan, kalau Anda mengisinya</li>
      </ul>
      <p>
        Setelah pesan terkirim, isinya ada di percakapan WhatsApp antara Anda dan kami, dan
        tunduk pada ketentuan WhatsApp.
      </p>

      <h2>Cookie</h2>
      <p>
        Situs ini menyimpan satu pilihan di peramban Anda, yaitu jawaban Anda pada panel cookie.
        Penyimpanan itu diperlukan supaya panelnya tidak muncul terus menerus, dan tidak bisa
        dimatikan.
      </p>
      <p>
        Pengukuran kunjungan mati sampai Anda mengizinkannya. Kalau Anda mengizinkan, situs
        mengirim satu permintaan ke alamat di server situs ini sendiri setiap kali sebuah halaman
        dibuka. Tidak ada layanan pihak ketiga yang dilibatkan. Anda bisa mengubah pilihan itu
        kapan saja lewat tautan Pengaturan cookie di footer.
      </p>

      <h2>Peta</h2>
      <p>
        Halaman kontak memuat peta dari Google Maps. Saat peta itu tampil, peramban Anda
        terhubung ke server Google, dan Google dapat menerima data teknis seperti alamat IP Anda.
        Hal itu di luar kendali kami.
      </p>

      <h2>Berbagi data</h2>
      <p>Kami tidak menjual data Anda dan tidak membagikannya untuk keperluan iklan.</p>

      <h2>Hak Anda</h2>
      <p>
        Anda boleh meminta kami menghapus percakapan WhatsApp Anda dengan kami. Kirim
        permintaannya lewat WhatsApp ke {CONTACT.whatsappDisplay}.
      </p>

      <h2>Menghubungi kami</h2>
      <ContactLine />

      <h2>Perubahan</h2>
      <p>Kalau isi halaman ini berubah, versi terbarunya langsung tampil di halaman ini.</p>
    </article>
  );
}

export function TermsContent({ locale }: { locale: Locale }) {
  if (locale === "en") {
    return (
      <article>
        <h1 className={H1}>Terms of Use</h1>
        <p>
          These terms apply to your use of the {SITE.name} website. By using the site, you agree
          to them.
        </p>

        <h2>Site content</h2>
        <p>
          This site shows general information about our salon. {SITE.name} has just opened, and
          some of the content, such as the product page, is still a sample.
        </p>

        <h2>Booking</h2>
        <p>
          The booking form puts together a WhatsApp message. Sending that message is a request
          for a time, not a confirmed booking. A booking only stands once we have replied and
          agreed it with you.
        </p>
        <ul>
          <li>Give correct details so we can get back to you.</li>
          <li>If your plans change, let us know on WhatsApp.</li>
          <li>We may decline or offer another time if the slot clashes.</li>
        </ul>

        <h2>Prices</h2>
        <p>
          Prices on this site are in Indonesian rupiah and follow the salon&apos;s price list.
          Hair colouring prices are starting prices. Confirm the final price on WhatsApp or at
          the salon.
        </p>

        <h2>Fair use</h2>
        <p>
          Do not use this site to send spam, to try to break it, or to copy its content
          automatically in bulk.
        </p>

        <h2>Ownership of content</h2>
        <p>
          The name, logo, text and images on this site belong to {SITE.name}. Do not reuse them
          without our permission.
        </p>

        <h2>Links to others</h2>
        <p>
          This site links to WhatsApp, Instagram and Google Maps. Those services have their own
          terms and are outside our control.
        </p>

        <h2>Limits of liability</h2>
        <p>
          We try to keep this site accurate, but we cannot guarantee it is always available or
          free of mistakes. If you spot something wrong, please tell us.
        </p>

        <h2>Contacting us</h2>
        <ContactLine />
      </article>
    );
  }

  return (
    <article>
      <h1 className={H1}>Syarat Layanan</h1>
      <p>
        Syarat berikut berlaku untuk pemakaian situs {SITE.name}. Dengan memakai situs ini, Anda
        menyetujuinya.
      </p>

      <h2>Isi situs</h2>
      <p>
        Situs ini menampilkan keterangan umum tentang salon kami. {SITE.name} baru dibuka, dan
        sebagian isinya, misalnya halaman produk, masih berupa contoh.
      </p>

      <h2>Booking</h2>
      <p>
        Formulir booking di situs ini menyusun sebuah pesan WhatsApp. Mengirim pesan itu berarti
        mengajukan permintaan jadwal, bukan mengunci jadwal. Jadwal baru berlaku setelah kami
        membalas dan menyepakatinya bersama Anda.
      </p>
      <ul>
        <li>Isi keterangan yang benar supaya kami bisa menghubungi Anda kembali.</li>
        <li>Kalau rencana Anda berubah, beri tahu kami lewat WhatsApp.</li>
        <li>Kami dapat menolak atau menawarkan waktu lain kalau jadwalnya berbenturan.</li>
      </ul>

      <h2>Harga</h2>
      <p>
        Harga di situs ini dalam rupiah dan mengikuti daftar harga salon. Harga hair colouring
        adalah harga mulai dari. Pastikan harga akhirnya lewat WhatsApp atau saat Anda berada di
        salon.
      </p>

      <h2>Pemakaian yang wajar</h2>
      <p>
        Jangan memakai situs ini untuk mengirim spam, mencoba merusak layanannya, atau mengambil
        isinya secara otomatis dalam jumlah besar.
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
        Kami berusaha menjaga isi situs ini tetap benar, tetapi tidak menjamin situs selalu dapat
        diakses atau bebas dari kekeliruan. Kalau Anda menemukan keterangan yang salah, beri tahu
        kami.
      </p>

      <h2>Menghubungi kami</h2>
      <ContactLine />
    </article>
  );
}

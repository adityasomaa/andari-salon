import type { Metadata } from "next";

import { ROUTES } from "@/config/i18n";
import { SITE } from "@/config/site";

import "./globals.css";

/**
 * 404 for any URL no route matches. With two root layouts there is no single
 * layout to render a not-found page inside, so this one brings its own
 * document. It cannot know which language the visitor wanted, so it says it
 * in both.
 */
export const metadata: Metadata = {
  title: `404 · ${SITE.name}`,
};

export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body>
        <main
          id="main"
          data-template="t2"
          className="flex min-h-screen-svh flex-col items-center justify-center gap-6 px-6 text-center"
          style={{ background: "var(--t-bg)", color: "var(--t-fg)" }}
        >
          <p className="t-label">404</p>
          <h1 className="t-h2">Halaman tidak ditemukan.</h1>
          <p className="t-body" lang="en">
            Page not found.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href={ROUTES.home.id} className="t-btn t-btn-primary">
              Ke beranda
            </a>
            <a href={ROUTES.home.en} hrefLang="en" lang="en" className="t-btn t-btn-ghost">
              Go to home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}

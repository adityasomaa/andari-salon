import type { Metadata, Viewport } from "next";

import { CookieConsentProvider } from "@/components/shared/cookie-consent";
import { SmoothScroll } from "@/components/shared/smooth-scroll";
import { UIStateProvider } from "@/components/shared/ui-state";
import { COPY } from "@/config/copy";
import { SITE } from "@/config/site";
import { localBusinessJsonLd } from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: COPY.pages.home.metaTitle,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  // The site icon is the traced monogram, transparent, no background plate.
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Pinch zoom stays available. Never disable it.
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#14140f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // Static, generated from config. No user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {COPY.nav.skip}
        </a>
        <UIStateProvider>
          <CookieConsentProvider>
            <SmoothScroll />
            {children}
          </CookieConsentProvider>
        </UIStateProvider>
      </body>
    </html>
  );
}

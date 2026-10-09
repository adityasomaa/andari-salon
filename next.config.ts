import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Vercel's Image Optimization quota is exhausted on this account. With the
     * optimizer on, every /_next/image request answers 402 and the whole site
     * renders blank. Every image here is either a generated SVG sized for its
     * slot or a small traced logo, so there is nothing for an optimizer to do.
     */
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Two root layouts, (id) and (en), leave no single layout to render a
    // 404 inside, so app/global-not-found.tsx provides its own document.
    globalNotFound: true,
  },
  /**
   * The three design previews are gone; the chosen one now lives at the root.
   * Anything still linking to a preview, or to the old "Layanan" slug, lands
   * on the page it meant.
   */
  async redirects() {
    const previews = ["/template-1", "/template-2", "/template-3"];
    const pages: Array<[string, string]> = [
      ["", "/"],
      ["/layanan", "/treatment"],
      ["/booking", "/reservasi"],
      ["/kontak", "/kontak"],
    ];
    return [
      ...previews.flatMap((p) =>
        pages.map(([from, to]) => ({ source: `${p}${from}`, destination: to, permanent: true })),
      ),
      { source: "/layanan", destination: "/treatment", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/art/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/brand/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;

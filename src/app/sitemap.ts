import type { MetadataRoute } from "next";

import { LOCALES, ROUTES, ROUTE_KEYS } from "@/config/i18n";
import { HUB } from "@/config/links";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

/**
 * Every page in both languages, each entry naming its counterpart, plus the
 * Indonesian-only link hub.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const legal = new Set(["privacy", "terms"]);

  const pages = ROUTE_KEYS.flatMap((key) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(ROUTES[key][locale]),
      lastModified: now,
      changeFrequency: key === "home" ? ("weekly" as const) : ("monthly" as const),
      priority: key === "home" ? (locale === "id" ? 1 : 0.9) : legal.has(key) ? 0.3 : 0.7,
      alternates: { languages: languageAlternates(key) },
    })),
  );

  return [
    ...pages,
    { url: HUB.url, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}

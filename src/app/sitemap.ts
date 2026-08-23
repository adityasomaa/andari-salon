import type { MetadataRoute } from "next";

import { LIVE_TEMPLATE, PREVIEW_MODE } from "@/config/preview";
import { SITE } from "@/config/site";
import { TEMPLATE_PATHS } from "@/lib/seo";

/**
 * While previewing, the three templates are three versions of one business, so
 * only the chooser and the legal pages are listed. Once a template is picked
 * and PREVIEW_MODE is off, that template's four pages become the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const legal = ["/privacy", "/terms"];

  const paths = PREVIEW_MODE
    ? ["/", ...legal]
    : [
        "/",
        ...TEMPLATE_PATHS.filter((p) => p.startsWith(`/${LIVE_TEMPLATE}`)),
        ...legal,
      ];

  return paths.map((path) => ({
    url: `${SITE.url}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}

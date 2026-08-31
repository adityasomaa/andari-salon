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

  // The link hub is a finished page with one version of itself, so it is
  // listed whether or not the three previews are still running.
  const paths = PREVIEW_MODE
    ? ["/", "/booking", ...legal]
    : [
        "/",
        "/booking",
        ...TEMPLATE_PATHS.filter((p) => p.startsWith(`/${LIVE_TEMPLATE}`)),
        ...legal,
      ];

  return paths.map((path) => ({
    url: `${SITE.url}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/booking" ? "weekly" : "monthly",
    priority: path === "/booking" ? 1 : path === "/" ? 0.9 : 0.6,
  }));
}

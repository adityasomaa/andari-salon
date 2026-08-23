import type { MetadataRoute } from "next";

import { PREVIEW_MODE } from "@/config/preview";
import { SITE } from "@/config/site";

/**
 * The preview routes are excluded while three designs coexist, so search
 * engines never see the same salon three times. Flipping PREVIEW_MODE opens
 * everything up.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: PREVIEW_MODE
      ? [{ userAgent: "*", allow: "/", disallow: ["/template-1", "/template-2", "/template-3", "/api/"] }]
      : [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}

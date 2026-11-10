import type { Metadata } from "next";

import { LinkHub } from "@/components/pages/link-hub";
import { HUB_TOHPATI } from "@/config/links";
import { hubMetadata } from "@/lib/seo";

/** Link-in-bio page for the Tohpati branch. */
export const metadata: Metadata = hubMetadata(HUB_TOHPATI);

export default function Page() {
  return <LinkHub hub={HUB_TOHPATI} />;
}

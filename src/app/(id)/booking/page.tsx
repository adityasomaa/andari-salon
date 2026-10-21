import type { Metadata } from "next";

import { LinkHub } from "@/components/pages/link-hub";
import { HUB_OFFICIAL } from "@/config/links";
import { hubMetadata } from "@/lib/seo";

/** The official link hub, covering every branch. The slug for the brand's Instagram bio. */
export const metadata: Metadata = hubMetadata(HUB_OFFICIAL);

export default function Page() {
  return <LinkHub hub={HUB_OFFICIAL} />;
}
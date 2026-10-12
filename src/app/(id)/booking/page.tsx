import type { Metadata } from "next";

import { LinkHub } from "@/components/pages/link-hub";
import { HUB } from "@/config/links";
import { hubMetadata } from "@/lib/seo";

/** Link-in-bio page for the main salon, the slug that goes in its Instagram profile. */
export const metadata: Metadata = hubMetadata(HUB);

export default function Page() {
  return <LinkHub hub={HUB} />;
}
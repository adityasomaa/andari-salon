import type { Metadata } from "next";

import { LinkHub } from "@/components/pages/link-hub";
import { HUB_MONANG_MANING } from "@/config/links";
import { hubMetadata } from "@/lib/seo";

/** Link-in-bio page for the Monang Maning branch. */
export const metadata: Metadata = hubMetadata(HUB_MONANG_MANING);

export default function Page() {
  return <LinkHub hub={HUB_MONANG_MANING} />;
}
import type { Metadata } from "next";

import { LinkHub } from "@/components/pages/link-hub";
import { HUB_GLOGOR } from "@/config/links";
import { hubMetadata } from "@/lib/seo";

/** Link-in-bio page for the Glogor Carik branch, the slug that goes in its Instagram profile. */
export const metadata: Metadata = hubMetadata(HUB_GLOGOR);

export default function Page() {
  return <LinkHub hub={HUB_GLOGOR} />;
}
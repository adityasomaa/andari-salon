import type { Metadata } from "next";

import { PartnershipPage } from "@/components/pages/partnership-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("partnership", "en");

export default function Page() {
  return <PartnershipPage />;
}

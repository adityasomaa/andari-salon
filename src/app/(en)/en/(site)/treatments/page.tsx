import type { Metadata } from "next";

import { ServicesPage } from "@/components/pages/services-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("treatment", "en");

export default function Page() {
  return <ServicesPage />;
}

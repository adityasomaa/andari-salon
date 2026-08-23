import type { Metadata } from "next";

import { ServicesPage } from "@/components/pages/services-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("layanan", "/template-2/layanan");

export default function Page() {
  return <ServicesPage template="template-2" />;
}

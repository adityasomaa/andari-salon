import type { Metadata } from "next";

import { ContactPage } from "@/components/pages/contact-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("contact", "en");

export default function Page() {
  return <ContactPage />;
}

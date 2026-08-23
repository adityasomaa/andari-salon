import type { Metadata } from "next";

import { ContactPage } from "@/components/pages/contact-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("kontak", "/template-3/kontak");

export default function Page() {
  return <ContactPage template="template-3" />;
}

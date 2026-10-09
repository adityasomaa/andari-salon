import type { Metadata } from "next";

import { TermsContent } from "@/components/pages/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("terms", "en");

export default function Page() {
  return <TermsContent locale="en" />;
}

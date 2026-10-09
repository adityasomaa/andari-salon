import type { Metadata } from "next";

import { TermsContent } from "@/components/pages/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("terms", "id");

export default function Page() {
  return <TermsContent locale="id" />;
}

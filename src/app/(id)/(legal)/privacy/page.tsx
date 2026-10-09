import type { Metadata } from "next";

import { PrivacyContent } from "@/components/pages/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("privacy", "id");

export default function Page() {
  return <PrivacyContent locale="id" />;
}

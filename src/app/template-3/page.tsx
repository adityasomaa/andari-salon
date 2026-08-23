import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("home", "/template-3");

export default function Page() {
  return <HomePage template="template-3" />;
}

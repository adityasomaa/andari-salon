import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("home", "id");

export default function Page() {
  return <HomePage />;
}

import type { Metadata } from "next";

import { BookingPage } from "@/components/pages/booking-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("booking", "en");

export default function Page() {
  return <BookingPage />;
}

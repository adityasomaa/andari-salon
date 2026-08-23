import type { Metadata } from "next";

import { BookingPage } from "@/components/pages/booking-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("booking", "/template-3/booking");

export default function Page() {
  return <BookingPage template="template-3" />;
}

import type { ReactNode } from "react";

import { RootDocument } from "@/components/shared/root-document";
import { rootMetadata, VIEWPORT } from "@/lib/seo";

import "../globals.css";

export const metadata = rootMetadata("en");
export const viewport = VIEWPORT;

export default function RootLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}

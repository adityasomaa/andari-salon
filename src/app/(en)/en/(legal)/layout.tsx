import type { ReactNode } from "react";

import { LegalShell } from "@/components/pages/legal";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return <LegalShell locale="en">{children}</LegalShell>;
}

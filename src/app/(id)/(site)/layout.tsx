import type { ReactNode } from "react";

import { TemplateShell } from "@/components/shared/template-shell";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <TemplateShell>{children}</TemplateShell>;
}

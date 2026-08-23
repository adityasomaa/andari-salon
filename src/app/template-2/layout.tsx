import type { ReactNode } from "react";

import { TemplateShell } from "@/components/shared/template-shell";

export default function Layout({ children }: { children: ReactNode }) {
  return <TemplateShell id="template-2">{children}</TemplateShell>;
}

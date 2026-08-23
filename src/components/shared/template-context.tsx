"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { TemplateId } from "@/config/site";
import { templateInfo, type TemplateInfo } from "@/lib/template";

export type { TemplateInfo };
export { templateInfo };

const Ctx = createContext<TemplateInfo | null>(null);

export function TemplateProvider({
  id,
  children,
}: {
  id: TemplateId;
  children: ReactNode;
}) {
  return <Ctx.Provider value={templateInfo(id)}>{children}</Ctx.Provider>;
}

/** Null outside a template, e.g. on the chooser and the legal pages. */
export function useTemplate(): TemplateInfo | null {
  return useContext(Ctx);
}

/** Resolve a template-relative href. Absolute URLs and hashes pass through. */
export function useHref() {
  const t = useTemplate();
  return (href: string) => {
    if (!href) return t ? t.base : "/";
    if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) return href;
    return t ? `${t.base}${href}` : href;
  };
}

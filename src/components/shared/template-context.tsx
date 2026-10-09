"use client";

import { createContext, useContext, type ReactNode } from "react";

import { TEMPLATE_KEY, type TemplateInfo } from "@/lib/template";

export type { TemplateInfo };

const VALUE: TemplateInfo = { key: TEMPLATE_KEY };

const Ctx = createContext<TemplateInfo | null>(null);

export function TemplateProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={VALUE}>{children}</Ctx.Provider>;
}

/** Null outside the site shell, e.g. on the legal pages and the link hub. */
export function useTemplate(): TemplateInfo | null {
  return useContext(Ctx);
}

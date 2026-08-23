"use client";

import type { ReactNode } from "react";

import type { TemplateId } from "@/config/site";

import { PageTransitionProvider } from "./page-transition";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { TemplateProvider, templateInfo } from "./template-context";
import { TemplateSwitcher } from "./template-switcher";

/**
 * Everything a template page sits inside.
 *
 * `data-template` is the only switch: it selects one of the three token sets
 * in src/styles/templates.css, and every shared component reads from those
 * tokens rather than hard-coded values. That is what lets one set of
 * components render three genuinely different sites, and what keeps one
 * template's styling from reaching another's.
 */
export function TemplateShell({ id, children }: { id: TemplateId; children: ReactNode }) {
  const info = templateInfo(id);
  return (
    <TemplateProvider id={id}>
      <div data-template={info.key} className="flex min-h-screen-svh flex-col">
        <PageTransitionProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <TemplateSwitcher />
        </PageTransitionProvider>
      </div>
    </TemplateProvider>
  );
}

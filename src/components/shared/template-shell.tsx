"use client";

import type { ReactNode } from "react";

import { TEMPLATE_KEY } from "@/lib/template";

import { PageTransitionProvider } from "./page-transition";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { TemplateProvider } from "./template-context";

/**
 * Everything a site page sits inside: header, footer, page transitions.
 *
 * `data-template` selects the design's token set in src/styles/templates.css;
 * every shared component reads from those tokens rather than hard-coded values.
 */
export function TemplateShell({ children }: { children: ReactNode }) {
  return (
    <TemplateProvider>
      <div data-template={TEMPLATE_KEY} className="flex min-h-screen-svh flex-col">
        <PageTransitionProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </PageTransitionProvider>
      </div>
    </TemplateProvider>
  );
}

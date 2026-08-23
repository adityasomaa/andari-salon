/**
 * Template identity, kept out of any "use client" module so server components
 * (the Art component in particular) can resolve a template's CSS scope key
 * without pulling the whole React context in.
 */

import { TEMPLATES, type TemplateId } from "@/config/site";

export type TemplateKey = "t1" | "t2" | "t3";

export type TemplateInfo = {
  id: TemplateId;
  /** Short key used for the `data-template` attribute and CSS scoping. */
  key: TemplateKey;
  /** Route prefix, e.g. "/template-1". */
  base: string;
  number: string;
  name: string;
};

const KEYS: Record<TemplateId, TemplateKey> = {
  "template-1": "t1",
  "template-2": "t2",
  "template-3": "t3",
};

export function templateInfo(id: TemplateId): TemplateInfo {
  const t = TEMPLATES.find((x) => x.id === id)!;
  return { id, key: KEYS[id], base: `/${id}`, number: t.number, name: t.name };
}

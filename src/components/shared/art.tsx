"use client";

import Image from "next/image";

import type { Locale } from "@/config/i18n";
import { TEMPLATE_KEY } from "@/lib/template";
import { cn } from "@/lib/utils";

import { useLocale } from "./locale-context";

/**
 * Generated placeholder graphics, from scripts/build-art.mjs. They hold the
 * places where the salon's own photos go once they arrive.
 *
 * Alt text describes what the graphic actually is: an abstract generated
 * pattern. None of these depict a person or a real haircut and the alt text
 * never suggests otherwise.
 */

export type ArtName = "hero" | "band" | `column-${0 | 1 | 2}` | `tile-${0 | 1 | 2 | 3}`;

const DESCRIPTIONS: Record<Locale, Record<ArtName, string>> = {
  id: {
    hero: "Ilustrasi garis, helai yang jatuh dari satu belahan",
    band: "Ilustrasi garis, jalinan gelombang mendatar",
    "column-0": "Ilustrasi garis, tirai helai yang jatuh",
    "column-1": "Ilustrasi garis, lengkung yang bertumpuk",
    "column-2": "Ilustrasi garis, gelombang yang berjalinan",
    "tile-0": "Ilustrasi garis, helai yang jatuh",
    "tile-1": "Ilustrasi garis, lengkung yang bertumpuk",
    "tile-2": "Ilustrasi garis, gelombang mendatar",
    "tile-3": "Ilustrasi garis, busur sisir",
  },
  en: {
    hero: "Line illustration, strands falling from a parting",
    band: "Line illustration, interlaced horizontal waves",
    "column-0": "Line illustration, a curtain of falling strands",
    "column-1": "Line illustration, stacked curves",
    "column-2": "Line illustration, interwoven waves",
    "tile-0": "Line illustration, falling strands",
    "tile-1": "Line illustration, stacked curves",
    "tile-2": "Line illustration, horizontal waves",
    "tile-3": "Line illustration, comb arcs",
  },
};

const SIZES: Record<ArtName, [number, number]> = {
  hero: [1200, 1560],
  band: [1600, 560],
  "column-0": [900, 1200],
  "column-1": [900, 1200],
  "column-2": [900, 1200],
  "tile-0": [800, 800],
  "tile-1": [800, 800],
  "tile-2": [800, 800],
  "tile-3": [800, 800],
};

export function Art({
  name,
  className,
  priority = false,
  decorative = false,
  sizes = "100vw",
}: {
  name: ArtName;
  className?: string;
  priority?: boolean;
  /** True where the graphic sits behind text and adds no information. */
  decorative?: boolean;
  sizes?: string;
}) {
  const locale = useLocale();
  const [w, h] = SIZES[name];
  return (
    <Image
      src={`/art/${TEMPLATE_KEY}-${name}.svg`}
      alt={decorative ? "" : DESCRIPTIONS[locale][name]}
      aria-hidden={decorative || undefined}
      width={w}
      height={h}
      sizes={sizes}
      priority={priority}
      // Vercel image optimisation is not available on this account, and an
      // optimiser 402 would blank every graphic in production. These are SVGs
      // generated at the right size, so there is nothing to optimise anyway.
      unoptimized
      className={cn("size-full object-cover", className)}
    />
  );
}

import Image from "next/image";

import { cn } from "@/lib/utils";

import type { TemplateId } from "@/config/site";
import { templateInfo } from "@/lib/template";

/**
 * Generated placeholder graphics, from scripts/build-art.mjs.
 *
 * Alt text describes what the graphic actually is: an abstract generated
 * pattern. None of these depict a person or a real haircut and the alt text
 * never suggests otherwise.
 */

export type ArtName = "hero" | "band" | `column-${0 | 1 | 2}` | `tile-${0 | 1 | 2 | 3}`;

const DESCRIPTIONS: Record<string, string> = {
  hero: "Ilustrasi garis, helai yang jatuh dari satu belahan",
  band: "Ilustrasi garis, jalinan gelombang mendatar",
  "column-0": "Ilustrasi garis, tirai helai yang jatuh",
  "column-1": "Ilustrasi garis, lengkung yang bertumpuk",
  "column-2": "Ilustrasi garis, gelombang yang berjalinan",
  "tile-0": "Ilustrasi garis, helai yang jatuh",
  "tile-1": "Ilustrasi garis, lengkung yang bertumpuk",
  "tile-2": "Ilustrasi garis, gelombang mendatar",
  "tile-3": "Ilustrasi garis, busur sisir",
};

const SIZES: Record<string, [number, number]> = {
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
  template,
  name,
  className,
  priority = false,
  decorative = false,
  sizes = "100vw",
}: {
  template: TemplateId;
  name: ArtName;
  className?: string;
  priority?: boolean;
  /** True where the graphic sits behind text and adds no information. */
  decorative?: boolean;
  sizes?: string;
}) {
  const key = templateInfo(template).key;
  const [w, h] = SIZES[name];
  return (
    <Image
      src={`/art/${key}-${name}.svg`}
      alt={decorative ? "" : DESCRIPTIONS[name]}
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

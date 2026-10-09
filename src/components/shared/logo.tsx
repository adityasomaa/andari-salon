import Image from "next/image";

import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The wordmark, always as traced vector.
 *
 * Two files, one per ground. The source PNG is never referenced: it stores a
 * cream RGB value beneath its transparent pixels, so any pipeline that drops
 * alpha instead of compositing paints a box behind the logo. On the dark
 * template that box is the single most visible thing on the page.
 */

const WORDMARK_RATIO = 592 / 167.25;
const MONOGRAM_RATIO = 1;

type Tone = "olive" | "bone" | "ink";

export function Wordmark({
  tone = "olive",
  width = 168,
  className,
  priority = false,
}: {
  tone?: Tone;
  width?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/brand/logo-${tone}.svg`}
      alt={SITE.name}
      width={width}
      height={Math.round(width / WORDMARK_RATIO)}
      className={cn("h-auto w-full", className)}
      priority={priority}
      unoptimized
    />
  );
}

export function Monogram({
  tone = "olive",
  size = 40,
  className,
}: {
  tone?: Tone;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={`/brand/monogram-${tone}.svg`}
      alt=""
      aria-hidden
      width={size}
      height={Math.round(size / MONOGRAM_RATIO)}
      className={cn(className)}
      unoptimized
    />
  );
}

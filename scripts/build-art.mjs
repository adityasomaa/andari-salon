/**
 * Deterministic generative placeholder graphics.
 *
 * The salon has no photography yet. Rather than stock images or picsum, every
 * visual on the site is generated here from a seeded PRNG, so the same seed
 * always produces the same file and the whole set can be regenerated after a
 * palette change.
 *
 * Nothing drawn here pretends to be a person, a face or a real haircut. The
 * vocabulary is abstract and deliberately small, four motifs shared by all
 * three templates:
 *
 *   fall   a curtain of strands falling from a soft parting
 *   coil   nested open curves, the shape a curl leaves behind
 *   weave  dense flowing lines that interleave into a band
 *   ring   thin concentric arcs, a comb sweep seen end on
 *
 * One family, three dialects. Template 1 draws it sparse and off centre in a
 * lot of empty paper, template 2 sets it on soft discs that bleed past the
 * frame, template 3 thins every stroke and boxes it in a hairline.
 *
 *   node scripts/build-art.mjs
 *
 * Output: public/art/<template>-<name>.svg  +  public/art/manifest.json
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, "public", "art");

/* ------------------------------------------------------------------ prng */

/** mulberry32: small, fast, identical across runs and platforms. */
function prng(seedText) {
  let h = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i += 1) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n) => Math.round(n * 100) / 100;
const lerp = (a, b, t) => a + (b - a) * t;

/* --------------------------------------------------------------- palettes */

const PALETTES = {
  t1: { bg: "#fbfaf7", bg2: "#f3f1ea", wash: "#efece3", ink: "#575540", soft: "#8d8a6e", faint: "#d9d6c6" },
  t2: { bg: "#f3f1ea", bg2: "#e9e5d9", wash: "#e2dccc", ink: "#575540", soft: "#8d8a6e", faint: "#ddd8c8" },
  t3: { bg: "#14140f", bg2: "#1c1c16", wash: "#20201a", ink: "#b6b39c", soft: "#8d8a6e", faint: "#26251d" },
};

/** Per-template drawing dialect. */
const DIALECT = {
  t1: { density: 0.62, weight: 1.05, opacity: 0.5, offset: 0.58, discs: false, frame: false, speck: 150 },
  t2: { density: 1.15, weight: 1.85, opacity: 0.4, offset: 0.5, discs: true, frame: false, speck: 130 },
  t3: { density: 0.9, weight: 0.65, opacity: 0.55, offset: 0.5, discs: false, frame: true, speck: 240 },
};

/* -------------------------------------------------------------- primitives */

/**
 * A curtain of strands. Origins spread along a gently sagging parting rather
 * than converging on one point, which is what stops it reading as a broom.
 * Strand length varies so the bottom edge is layered, not flat.
 */
function fall(rand, p, o) {
  const {
    w, h, count, top = 0, partX = 0.5, partWidth = 0.9, sag = 0.06,
    sweep = 0.22, weight, opacity, colour, minLen = 0.55,
  } = o;
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    // Origin along the parting arc.
    const ox = w * (partX - partWidth / 2) + w * partWidth * t;
    const dx = (ox - w * partX) / (w * partWidth * 0.5 || 1);
    const oy = top + h * sag * (1 - dx * dx) * -1 + (rand() - 0.5) * 8;

    // Strands sweep away from the parting; sign follows which side they start.
    const dir = dx >= 0 ? 1 : -1;
    const strength = Math.abs(dx) * 0.55 + 0.45;
    const len = h * lerp(minLen, 1.06, rand() * rand() + 0.25);
    const swing = w * sweep * strength * dir * (0.5 + rand());

    const c1x = ox + swing * 0.25 + (rand() - 0.5) * w * 0.03;
    const c1y = oy + len * 0.34;
    const c2x = ox + swing * 0.8 + (rand() - 0.5) * w * 0.05;
    const c2y = oy + len * 0.72;
    const ex = ox + swing + (rand() - 0.5) * w * 0.04;
    const ey = oy + len;

    const sw = weight * (0.45 + rand() * 1.05);
    const op = opacity * (0.28 + rand() * 0.85);
    out.push(
      `<path d="M${r2(ox)} ${r2(oy)}C${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(ex)} ${r2(ey)}" fill="none" stroke="${colour ?? p.ink}" stroke-width="${r2(sw)}" stroke-opacity="${r2(op)}" stroke-linecap="round"/>`,
    );
  }
  return out.join("");
}

/** Nested open curves. Reads as a curl without describing one literally. */
function coil(rand, p, o) {
  const { cx, cy, rings, rMin, rMax, turn = 0.62, weight, opacity, colour } = o;
  const out = [];
  for (let i = 0; i < rings; i += 1) {
    const t = rings === 1 ? 0 : i / (rings - 1);
    const rad = lerp(rMin, rMax, t);
    const phase = turn * Math.PI * 2 * t + rand() * 0.08;
    const span = Math.PI * (1.05 + t * 0.55);
    const steps = 26;
    let d = "";
    for (let s = 0; s <= steps; s += 1) {
      const a = phase + (span * s) / steps;
      const wob = 1 + Math.sin(a * 3 + i) * 0.045;
      const x = cx + rad * wob * Math.cos(a);
      const y = cy + rad * wob * Math.sin(a) * 0.82;
      d += `${s === 0 ? "M" : "L"}${r2(x)} ${r2(y)}`;
    }
    out.push(
      `<path d="${d}" fill="none" stroke="${colour ?? p.ink}" stroke-width="${r2(weight * (0.55 + rand() * 0.8))}" stroke-opacity="${r2(opacity * (0.3 + rand() * 0.8))}" stroke-linecap="round"/>`,
    );
  }
  return out.join("");
}

/** Dense flowing lines whose phases drift, so they interleave into a band. */
function weave(rand, p, o) {
  const { w, h, rows, amp, freq = 1.6, weight, opacity, colour, band = 1 } = o;
  const out = [];
  const top = h * (1 - band) * 0.5;
  const usable = h * band;
  for (let i = 0; i < rows; i += 1) {
    const t = rows === 1 ? 0.5 : i / (rows - 1);
    const y0 = top + usable * t;
    const phase = t * Math.PI * 2 * 0.9 + rand() * 0.4;
    const a = amp * (0.35 + Math.sin(t * Math.PI) * 0.9);
    const steps = 22;
    let d = "";
    for (let s = 0; s <= steps; s += 1) {
      const x = (w * s) / steps;
      const y = y0 + Math.sin((x / w) * Math.PI * 2 * freq + phase) * a;
      d += `${s === 0 ? "M" : "L"}${r2(x)} ${r2(y)}`;
    }
    out.push(
      `<path d="${d}" fill="none" stroke="${colour ?? p.soft}" stroke-width="${r2(weight * (0.5 + rand() * 0.7))}" stroke-opacity="${r2(opacity * (0.25 + rand() * 0.8))}"/>`,
    );
  }
  return out.join("");
}

/** Thin concentric arcs, deliberately off centre so it is not a rainbow. */
function ring(rand, p, o) {
  const { cx, cy, rings, rMin, rMax, from, to, weight, opacity, colour } = o;
  const out = [];
  for (let i = 0; i < rings; i += 1) {
    const t = rings === 1 ? 0 : i / (rings - 1);
    const rad = lerp(rMin, rMax, t);
    const a0 = ((from + (rand() - 0.5) * 14) * Math.PI) / 180;
    const a1 = ((to + (rand() - 0.5) * 14) * Math.PI) / 180;
    const x0 = cx + rad * Math.cos(a0);
    const y0 = cy + rad * Math.sin(a0);
    const x1 = cx + rad * Math.cos(a1);
    const y1 = cy + rad * Math.sin(a1);
    const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
    out.push(
      `<path d="M${r2(x0)} ${r2(y0)}A${r2(rad)} ${r2(rad)} 0 ${large} 1 ${r2(x1)} ${r2(y1)}" fill="none" stroke="${colour ?? p.ink}" stroke-width="${r2(weight * (0.5 + rand() * 0.8))}" stroke-opacity="${r2(opacity * (0.22 + rand() * 0.7))}" stroke-linecap="round"/>`,
    );
  }
  return out.join("");
}

function speckle(rand, p, { w, h, count, colour, maxR = 0.8, opacity = 0.18 }) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    out.push(
      `<circle cx="${r2(rand() * w)}" cy="${r2(rand() * h)}" r="${r2(0.25 + rand() * maxR)}" fill="${colour ?? p.soft}" fill-opacity="${r2(opacity * (0.2 + rand() * 0.85))}"/>`,
    );
  }
  return out.join("");
}

function disc(cx, cy, r, fill, opacity) {
  return `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fill="${fill}" fill-opacity="${opacity}"/>`;
}

function grainDefs(id, opacity) {
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" result="n"/><feColorMatrix in="n" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="${opacity}"/></feComponentTransfer></filter>`;
}

function svgDoc(w, h, body, id, grainOpacity) {
  const gid = `g-${id}`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">` +
    `<defs>${grainDefs(gid, grainOpacity)}</defs>` +
    body +
    `<rect width="${w}" height="${h}" filter="url(#${gid})" opacity="0.45" style="mix-blend-mode:overlay"/>` +
    `</svg>`
  );
}

/* ------------------------------------------------------------ compositions */

function hero(tpl, seed) {
  const p = PALETTES[tpl];
  const d = DIALECT[tpl];
  const rand = prng(seed);
  const w = 1200;
  const h = 1560;
  let b = `<rect width="${w}" height="${h}" fill="${p.bg}"/>`;

  if (tpl === "t1") {
    // Wide, sparse curtain that runs off both edges. Two horizon rules
    // divide the field so the emptiness reads as composed, not unfinished.
    b += disc(w * 0.72, h * 0.3, w * 0.5, p.wash, 0.55);
    b += fall(rand, p, {
      w, h: h * 0.98, count: Math.round(200 * d.density), top: -30,
      partX: 0.58, partWidth: 1.24, sag: 0.05, sweep: 0.3,
      weight: d.weight, opacity: d.opacity, minLen: 0.45,
    });
    b += `<line x1="0" y1="${r2(h * 0.7)}" x2="${w}" y2="${r2(h * 0.7)}" stroke="${p.ink}" stroke-opacity="0.16"/>`;
    b += `<line x1="0" y1="${r2(h * 0.88)}" x2="${w}" y2="${r2(h * 0.88)}" stroke="${p.ink}" stroke-opacity="0.1"/>`;
    b += weave(rand, p, { w, h, rows: 4, amp: 22, freq: 0.85, weight: 0.8, opacity: 0.35, band: 0.22, colour: p.faint });
  } else if (tpl === "t2") {
    // Overlapping discs with a fuller, softer curtain and a woven base.
    b += disc(w * 0.5, h * 0.36, w * 0.46, p.bg2, 1);
    b += disc(w * 0.22, h * 0.62, w * 0.3, p.wash, 0.85);
    b += disc(w * 0.84, h * 0.72, w * 0.26, p.faint, 0.8);
    b += fall(rand, p, {
      w, h: h * 0.86, count: Math.round(150 * d.density), top: -20,
      partX: 0.5, partWidth: 1.05, sag: 0.08, sweep: 0.26,
      weight: d.weight, opacity: d.opacity, minLen: 0.5,
    });
    b += coil(rand, p, {
      cx: w * 0.5, cy: h * 0.68, rings: 10,
      rMin: w * 0.12, rMax: w * 0.4, turn: 0.42,
      weight: d.weight * 0.8, opacity: 0.38,
    });
    b += weave(rand, p, { w, h, rows: 7, amp: 26, freq: 1.2, weight: 1.3, opacity: 0.3, band: 0.3 });
  } else {
    // Almost nothing: a hairline frame, one coil, one whisper of a curtain.
    b += `<rect x="${r2(w * 0.055)}" y="${r2(h * 0.04)}" width="${r2(w * 0.89)}" height="${r2(h * 0.92)}" fill="none" stroke="${p.ink}" stroke-opacity="0.15"/>`;
    b += coil(rand, p, {
      cx: w * 0.5, cy: h * 0.46, rings: 30,
      rMin: w * 0.06, rMax: w * 0.42, turn: 0.78,
      weight: d.weight, opacity: d.opacity,
    });
    b += fall(rand, p, {
      w, h: h * 0.94, count: Math.round(90 * d.density), top: -10,
      partX: 0.5, partWidth: 1.1, sag: 0.04, sweep: 0.2,
      weight: d.weight * 0.8, opacity: 0.32, minLen: 0.4,
    });
    b += `<line x1="${r2(w * 0.055)}" y1="${r2(h * 0.74)}" x2="${r2(w * 0.945)}" y2="${r2(h * 0.74)}" stroke="${p.ink}" stroke-opacity="0.18"/>`;
  }

  b += speckle(rand, p, { w, h, count: d.speck * 2, colour: tpl === "t3" ? p.ink : undefined, opacity: tpl === "t3" ? 0.22 : 0.16 });
  return svgDoc(w, h, b, `${tpl}-hero`, 0.13);
}

const COLUMN_MOTIF = ["fall", "coil", "weave"];

function column(tpl, seed, i) {
  const p = PALETTES[tpl];
  const d = DIALECT[tpl];
  const rand = prng(seed);
  const w = 900;
  const h = 1200;
  const motif = COLUMN_MOTIF[i % COLUMN_MOTIF.length];
  let b = `<rect width="${w}" height="${h}" fill="${i % 2 ? p.bg2 : p.bg}"/>`;

  if (d.discs) b += disc(w * (0.3 + i * 0.18), h * (0.3 + i * 0.1), w * (0.34 + i * 0.04), p.wash, 0.85);
  if (d.frame) b += `<rect x="${w * 0.07}" y="${h * 0.05}" width="${w * 0.86}" height="${h * 0.9}" fill="none" stroke="${p.ink}" stroke-opacity="0.16"/>`;

  if (motif === "fall") {
    b += fall(rand, p, {
      w, h: h * 1.02, count: Math.round(140 * d.density), top: -25,
      partX: d.offset + i * 0.05, partWidth: 1.15, sag: 0.06, sweep: 0.26,
      weight: d.weight, opacity: d.opacity, minLen: 0.42,
    });
  } else if (motif === "coil") {
    b += coil(rand, p, {
      cx: w * (0.46 + (d.offset - 0.5) * 0.4), cy: h * 0.46, rings: Math.round(26 * d.density),
      rMin: w * 0.07, rMax: w * 0.44, turn: 0.7,
      weight: d.weight, opacity: d.opacity,
    });
    b += fall(rand, p, {
      w, h: h * 0.5, count: Math.round(40 * d.density), top: h * 0.62,
      partX: 0.5, partWidth: 1.1, sag: 0.02, sweep: 0.14,
      weight: d.weight * 0.7, opacity: 0.3, minLen: 0.5,
    });
  } else {
    b += weave(rand, p, {
      w, h, rows: Math.round(26 * d.density), amp: 44, freq: 1.35,
      weight: d.weight, opacity: d.opacity, band: 0.86, colour: p.ink,
    });
  }

  b += speckle(rand, p, { w, h, count: d.speck, colour: tpl === "t3" ? p.ink : undefined });
  return svgDoc(w, h, b, `${tpl}-column-${i}`, 0.11);
}

const TILE_MOTIF = ["fall", "coil", "weave", "ring"];

function tile(tpl, seed, i) {
  const p = PALETTES[tpl];
  const d = DIALECT[tpl];
  const rand = prng(seed);
  const s = 800;
  const motif = TILE_MOTIF[i % TILE_MOTIF.length];
  let b = `<rect width="${s}" height="${s}" fill="${i % 2 ? p.bg2 : p.bg}"/>`;

  if (d.discs) b += disc(s * (0.28 + i * 0.14), s * 0.66, s * 0.44, p.wash, 0.85);
  if (d.frame) b += `<rect x="${s * 0.08}" y="${s * 0.08}" width="${s * 0.84}" height="${s * 0.84}" fill="none" stroke="${p.ink}" stroke-opacity="0.18"/>`;

  const cx = s * (tpl === "t1" ? 0.6 : 0.5);

  if (motif === "fall") {
    b += fall(rand, p, {
      w: s, h: s * 1.04, count: Math.round(90 * d.density), top: -14,
      partX: cx / s, partWidth: 1.2, sag: 0.07, sweep: 0.3,
      weight: d.weight, opacity: d.opacity, minLen: 0.4,
    });
  } else if (motif === "coil") {
    b += coil(rand, p, {
      cx, cy: s * 0.5, rings: Math.round(20 * d.density),
      rMin: s * 0.08, rMax: s * 0.4, turn: 0.66,
      weight: d.weight, opacity: d.opacity,
    });
  } else if (motif === "weave") {
    b += weave(rand, p, {
      w: s, h: s, rows: Math.round(24 * d.density), amp: 34, freq: 1.5,
      weight: d.weight, opacity: d.opacity, band: 0.82, colour: p.ink,
    });
  } else {
    b += ring(rand, p, {
      cx: cx + s * 0.06, cy: s * 0.62, rings: Math.round(18 * d.density),
      rMin: s * 0.1, rMax: s * 0.46, from: 186, to: 322,
      weight: d.weight, opacity: d.opacity,
    });
    b += fall(rand, p, {
      w: s, h: s * 0.4, count: Math.round(26 * d.density), top: -6,
      partX: 0.5, partWidth: 0.9, sag: 0.04, sweep: 0.12,
      weight: d.weight * 0.7, opacity: 0.3, minLen: 0.6,
    });
  }

  b += speckle(rand, p, { w: s, h: s, count: Math.round(d.speck * 0.8), colour: tpl === "t3" ? p.ink : undefined });
  return svgDoc(s, s, b, `${tpl}-tile-${i}`, 0.1);
}

function band(tpl, seed) {
  const p = PALETTES[tpl];
  const d = DIALECT[tpl];
  const rand = prng(seed);
  const w = 1600;
  const h = 560;
  let b = `<rect width="${w}" height="${h}" fill="${p.bg2}"/>`;
  if (d.discs) {
    b += disc(w * 0.18, h * 0.5, h * 0.62, p.wash, 0.8);
    b += disc(w * 0.82, h * 0.45, h * 0.5, p.faint, 0.75);
  }
  b += weave(rand, p, {
    w, h, rows: Math.round(30 * d.density), amp: 30, freq: 1.1,
    weight: d.weight * 0.85, opacity: d.opacity * 0.8, band: 0.92, colour: p.ink,
  });
  b += ring(rand, p, {
    cx: w * 0.5, cy: h * 1.25, rings: Math.round(14 * d.density),
    rMin: h * 0.5, rMax: h * 1.5, from: 205, to: 335,
    weight: d.weight * 0.7, opacity: 0.3,
  });
  b += speckle(rand, p, { w, h, count: d.speck, colour: tpl === "t3" ? p.ink : undefined });
  return svgDoc(w, h, b, `${tpl}-band`, 0.1);
}

/* ---------------------------------------------------------------- output */

mkdirSync(OUT, { recursive: true });
const manifest = [];

for (const tpl of ["t1", "t2", "t3"]) {
  const files = {
    [`${tpl}-hero.svg`]: hero(tpl, `andari/${tpl}/hero/v2`),
    [`${tpl}-band.svg`]: band(tpl, `andari/${tpl}/band/v2`),
  };
  for (let i = 0; i < 3; i += 1) files[`${tpl}-column-${i}.svg`] = column(tpl, `andari/${tpl}/column/${i}/v2`, i);
  for (let i = 0; i < 4; i += 1) files[`${tpl}-tile-${i}.svg`] = tile(tpl, `andari/${tpl}/tile/${i}/v2`, i);

  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(OUT, name), content, "utf8");
    manifest.push({ file: `/art/${name}`, bytes: content.length });
  }
}

writeFileSync(
  join(OUT, "manifest.json"),
  `${JSON.stringify({ generatedBy: "scripts/build-art.mjs", deterministic: true, files: manifest }, null, 2)}\n`,
  "utf8",
);

const total = manifest.reduce((a, m) => a + m.bytes, 0);
console.log(`${manifest.length} graphics, ${(total / 1024).toFixed(0)} KB total`);

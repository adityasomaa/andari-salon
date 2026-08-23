/**
 * Static audits that must hold before anything ships.
 *
 *  1. Zero raw z-index values. Every layer references the single scale in
 *     globals.css, and the scale itself is in the order the brief requires.
 *  2. Every colour pair the three templates actually use clears WCAG AA 4.5:1.
 *  3. No component hard-codes the WhatsApp number, the Instagram handle or the
 *     address: those live in one config file and nowhere else.
 *  4. No opening hours have been invented anywhere.
 *
 *   node scripts/audit-tokens.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC = join(ROOT, "src");

const failures = [];
const notes = [];

/* --------------------------------------------------------------- helpers */

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if ([".ts", ".tsx", ".css"].includes(extname(p))) out.push(p);
  }
  return out;
}

const files = walk(SRC);
const read = (p) => readFileSync(p, "utf8");

/* ------------------------------------------------- 1. z-index discipline */

const Z_SCALE = [
  "--z-below",
  "--z-base",
  "--z-raised",
  "--z-content",
  "--z-sticky-header",
  "--z-template-switcher",
  "--z-mobile-menu",
  "--z-popover",
  "--z-cookie",
  "--z-curtain",
  "--z-skip-link",
];

const globals = read(join(SRC, "app", "globals.css"));
const declared = {};
for (const token of Z_SCALE) {
  const m = new RegExp(`${token}:\\s*(-?\\d+);`).exec(globals);
  if (!m) failures.push(`z-index token ${token} is not declared in globals.css`);
  else declared[token] = Number(m[1]);
}

const ORDER = [
  "--z-content",
  "--z-sticky-header",
  "--z-template-switcher",
  "--z-mobile-menu",
  "--z-popover",
  "--z-cookie",
  "--z-skip-link",
];
for (let i = 1; i < ORDER.length; i += 1) {
  const a = declared[ORDER[i - 1]];
  const b = declared[ORDER[i]];
  if (!(a < b)) failures.push(`z scale out of order: ${ORDER[i - 1]}(${a}) must be below ${ORDER[i]}(${b})`);
}
if (!(declared["--z-cookie"] < declared["--z-curtain"] && declared["--z-curtain"] < declared["--z-skip-link"])) {
  failures.push("--z-curtain must sit between the cookie banner and the skip link");
}

// Raw z-index anywhere but the scale declaration itself.
// The value is captured whole and trimmed in JS: a lookahead after `\s*`
// backtracks to zero width and lets `var(--z-...)` through.
const RAW_Z = /(?:^|[^-\w])z-index\s*:([^;{}]+)/gm;
const RAW_TW_Z = /(?:^|["'\s])z-(?:\d+|\[[^\]]+\]|auto)(?=["'\s])/g;
for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const text = read(file);
  if (rel.endsWith("app/globals.css")) {
    // The scale declaration lives here; everything else must reference it.
    const body = text.replace(/:root\s*\{[\s\S]*?\}/, "");
    for (const m of body.matchAll(RAW_Z)) {
      const value = m[1].trim();
      if (!value.startsWith("var(--z-")) failures.push(`${rel}: raw z-index "${value}"`);
    }
    continue;
  }
  for (const m of text.matchAll(RAW_Z)) {
    const value = m[1].trim();
    if (!value.startsWith("var(--z-")) failures.push(`${rel}: raw z-index "${value}"`);
  }
  for (const m of text.matchAll(RAW_TW_Z)) {
    failures.push(`${rel}: Tailwind z utility "${m[0].trim()}", use the --z-* scale`);
  }
}

/* ------------------------------------------------------- 2. AA contrast */

function srgb(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}
function lum(hex) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}
function ratio(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const P = {
  olive: "#575540",
  oliveDeep: "#3f3d2e",
  oliveDark: "#2b2a20",
  oliveMid: "#6f6c52",
  oliveSoft: "#999678",
  olivePale: "#b6b39c",
  oliveWash: "#d9d6c6",
  ink: "#322f28",
  inkSoft: "#4a4740",
  paper: "#fbfaf7",
  paper2: "#f3f1ea",
  sand: "#e9e5d9",
  sandDeep: "#ddd8c8",
  bone: "#edeae5",
  night: "#14140f",
  night2: "#1c1c16",
  night3: "#26251d",
  errLight: "#8f2f23",
  errDark: "#e8a99b",
};

/** Every foreground/background pair the three templates put on screen. */
const PAIRS = [
  // t1: fg, fg-muted, fg-faint over bg and bg-alt
  ["t1 fg / bg", P.oliveDark, P.paper],
  ["t1 fg-muted / bg", P.olive, P.paper],
  ["t1 fg-faint / bg", P.oliveMid, P.paper],
  ["t1 fg / bg-alt", P.oliveDark, P.paper2],
  ["t1 fg-muted / bg-alt", P.olive, P.paper2],
  ["t1 fg-faint / bg-alt", P.oliveMid, P.paper2],
  ["t1 fg-muted / accent-soft", P.olive, P.sand],
  ["t1 accent-fg / accent", P.paper, P.olive],
  ["t1 error / bg", P.errLight, P.paper],
  ["t1 error / bg-alt", P.errLight, P.paper2],
  // t2
  ["t2 fg / bg", P.oliveDark, P.paper2],
  ["t2 fg-muted / bg", P.inkSoft, P.paper2],
  ["t2 fg-faint / bg", P.olive, P.paper2],
  ["t2 fg / bg-alt", P.oliveDark, P.sand],
  ["t2 fg-muted / bg-alt", P.inkSoft, P.sand],
  ["t2 fg-faint / bg-alt", P.olive, P.sand],
  ["t2 fg / surface", P.oliveDark, P.paper],
  ["t2 fg-muted / surface", P.inkSoft, P.paper],
  ["t2 fg-faint / surface", P.olive, P.paper],
  ["t2 fg-muted / accent-soft", P.inkSoft, P.sandDeep],
  ["t2 accent-fg / accent", P.paper, P.olive],
  ["t2 error / surface", P.errLight, P.paper],
  ["t2 error / bg", P.errLight, P.paper2],
  // t3
  ["t3 fg / bg", P.bone, P.night],
  ["t3 fg-muted / bg", P.olivePale, P.night],
  ["t3 fg-faint / bg", P.oliveSoft, P.night],
  ["t3 fg / surface", P.bone, P.night2],
  ["t3 fg-muted / surface", P.olivePale, P.night2],
  ["t3 fg-faint / surface", P.oliveSoft, P.night2],
  ["t3 fg / surface-2", P.bone, P.night3],
  ["t3 fg-muted / surface-2", P.olivePale, P.night3],
  ["t3 fg-faint / surface-2", P.oliveSoft, P.night3],
  ["t3 accent-fg / accent", P.night, P.olivePale],
  ["t3 error / bg", P.errDark, P.night],
  ["t3 error / surface", P.errDark, P.night2],
  // preview switcher, which carries its own fixed palette
  ["switcher fg / bg", P.bone, P.night],
  ["switcher muted / bg", P.olivePale, P.night],
  ["switcher hint / bg", P.oliveSoft, P.night],
  ["switcher hint / hover", P.oliveSoft, P.night2],
  // chooser page
  ["chooser fg / bg", P.oliveDark, P.paper2],
  ["chooser body / card", P.inkSoft, "#ffffff"],
  ["chooser muted / bg", P.oliveMid, P.paper2],
];

let worst = { name: "", value: Infinity };
for (const [name, fg, bg] of PAIRS) {
  const r = ratio(fg, bg);
  if (r < worst.value) worst = { name, value: r };
  if (r < 4.5) failures.push(`contrast ${name}: ${fg} on ${bg} is ${r.toFixed(2)}:1, needs 4.5:1`);
}
notes.push(`${PAIRS.length} colour pairs checked, lowest ${worst.value.toFixed(2)}:1 (${worst.name})`);

/* ------------------------------------------- 3. contact details in config */

const CONTACT_PATTERNS = [
  [/085218958623/, "the WhatsApp number"],
  [/6285218958623/, "the WhatsApp number in wa.me form"],
  [/andarisalon\.id/, "the Instagram handle"],
  [/Gunung Rinjani/, "the street address"],
];
for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  if (rel === "src/config/site.ts") continue;
  const text = read(file);
  for (const [re, what] of CONTACT_PATTERNS) {
    if (re.test(text)) failures.push(`${rel}: hard-codes ${what}; read it from src/config/site.ts`);
  }
}

/* --------------------------------------------- 4. no invented opening hours */

const site = read(join(SRC, "config", "site.ts"));
if (!/status:\s*"unset"/.test(site)) {
  notes.push("OPENING_HOURS.status is no longer 'unset'; confirm real hours were supplied");
}
const HOURS_SHAPE = /\b(?:0?\d|1\d|2[0-3])[.:]\d{2}\s*(?:-|–|sampai|s\/d|until)\s*(?:0?\d|1\d|2[0-3])[.:]\d{2}\b/;
for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  if (rel.includes("config/services")) continue; // the slot grid is not opening hours
  const text = read(file);
  const m = HOURS_SHAPE.exec(text);
  if (m) failures.push(`${rel}: looks like an invented opening-hours range "${m[0]}"`);
}

/* ------------------------------------------------------------------ report */

for (const n of notes) console.log(`note  ${n}`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("\nall static audits passed");

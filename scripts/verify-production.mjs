/**
 * Production smoke test. Checks what can be checked over HTTP: every route
 * answers, every asset the pages reference exists, and the server-side booking
 * rules actually hold when the browser is bypassed entirely.
 *
 *   node scripts/verify-production.mjs [origin]
 *
 * Defaults to the configured production origin. Exits non-zero on any failure,
 * so it is usable as a deploy gate.
 *
 * What it deliberately does NOT cover, because it needs a real browser:
 * horizontal overflow (scripts/audit-overflow.js), the mobile menu, the
 * calendar popover, and anything about motion.
 */

const ORIGIN = process.argv[2] ?? "https://andarisalon.id";

const PAGES_ID = ["/", "/treatment", "/produk", "/kemitraan", "/kontak", "/reservasi", "/privacy", "/terms"];
const PAGES_EN = ["/en", "/en/treatments", "/en/products", "/en/partnership", "/en/contact", "/en/book", "/en/privacy", "/en/terms"];

const ROUTES = [...PAGES_ID, ...PAGES_EN, "/booking", "/robots.txt", "/sitemap.xml"];

/** Old preview and slug URLs, and where they must land. */
const REDIRECTS = [
  ["/template-1", "/"],
  ["/template-2", "/"],
  ["/template-3/kontak", "/kontak"],
  ["/template-2/layanan", "/treatment"],
  ["/template-1/booking", "/reservasi"],
  ["/layanan", "/treatment"],
];

const ASSETS = [
  "/og.png",
  "/icon.svg",
  "/favicon.ico",
  "/apple-icon.png",
  "/site.webmanifest",
  "/brand/logo-olive.svg",
  "/brand/logo-bone.svg",
  "/brand/monogram-olive.svg",
  "/fonts/NeueMontreal-Light.woff2",
  "/fonts/NeueMontreal-Regular.woff2",
  "/fonts/NeueMontreal-Medium.woff2",
  "/fonts/NeueMontreal-Bold.woff2",
  ...["t2"].flatMap((t) => [
    `/art/${t}-hero.svg`,
    `/art/${t}-band.svg`,
    ...[0, 1, 2].map((i) => `/art/${t}-column-${i}.svg`),
    ...[0, 1, 2, 3].map((i) => `/art/${t}-tile-${i}.svg`),
  ]),
];

const failures = [];
const notes = [];
const ok = (msg) => notes.push(`  ok   ${msg}`);
const bad = (msg) => failures.push(msg);

function isoDaysFromNow(days) {
  const d = new Date(Date.now() + days * 86400000);
  return d.toISOString().slice(0, 10);
}

async function head(path) {
  const res = await fetch(`${ORIGIN}${path}`, { redirect: "follow" });
  return { status: res.status, type: res.headers.get("content-type") ?? "", res };
}

async function checkRoutes() {
  for (const path of ROUTES) {
    const { status, res } = await head(path);
    if (status !== 200) {
      bad(`route ${path} answered ${status}`);
      continue;
    }
    // A login wall would answer 200 with Vercel's SSO page.
    const body = await res.text();
    if (/Authentication Required|vercel\.com\/sso-api/i.test(body)) {
      bad(`route ${path} is behind Vercel authentication`);
    }
  }
  ok(`${ROUTES.length} routes answered 200 with no auth wall`);
}

async function checkAssets() {
  for (const path of ASSETS) {
    const { status } = await head(path);
    if (status !== 200) bad(`asset ${path} answered ${status}`);
  }
  ok(`${ASSETS.length} assets answered 200`);
}

async function post(body) {
  const res = await fetch(`${ORIGIN}/api/booking`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json() };
}

const VALID = {
  name: "Ayu Pratiwi",
  phone: "081234567890",
  serviceId: "smoothing",
  date: isoDaysFromNow(3),
  time: "11:30",
  notes: "Alergi produk beraroma kuat.",
  website: "",
};

async function checkBooking() {
  // 1. the happy path composes a complete message
  const good = await post(VALID);
  if (good.status !== 200 || !good.json.ok) {
    bad(`valid booking rejected: ${good.status} ${JSON.stringify(good.json.errors)}`);
  } else {
    const m = good.json.message;
    const required = [
      "Halo Andari Salon, saya ingin booking.",
      "Ayu Pratiwi",
      "081234567890",
      "Treatment: Smoothing (Hair Treatment)",
      "11:30",
      "Alergi produk beraroma kuat.",
    ];
    for (const needle of required) {
      if (!m.includes(needle)) bad(`WhatsApp message is missing "${needle}"`);
    }
    if (!good.json.href.startsWith("https://wa.me/6285218958623?text=")) {
      bad(`wa.me link is wrong: ${good.json.href.slice(0, 60)}`);
    }
    ok("WhatsApp message carries every field the visitor filled in");

    // The message is the message: no URL, no button label, no template tag,
    // nothing that reads as machine output to whoever receives it.
    const forbidden = [
      ["http://", "a URL"],
      ["https://", "a URL"],
      ["Dikirim dari", "the provenance header"],
      ["Halaman:", "the page line"],
      ["Tombol:", "the button line"],
      ["Template:", "the template line"],
      [ORIGIN.replace(/^https?:\/\//, ""), "the site host"],
    ];
    for (const [needle, what] of forbidden) {
      if (m.includes(needle)) bad(`WhatsApp message still contains ${what}: "${needle}"`);
    }
    const lastLine = m.trim().split("\n").pop();
    if (!/^(Catatan|Jam):/.test(lastLine)) {
      bad(`WhatsApp message ends on an unexpected line: "${lastLine}"`);
    }
    ok("WhatsApp message carries no URL, button label or template tag");
  }

  // 1b. the English form produces an English message
  {
    const r = await post({ ...VALID, locale: "en", phone: "+61 412 345 678", serviceId: "hair-cut-cuci" });
    if (r.status !== 200 || !r.json.ok) {
      bad(`English booking with a foreign number rejected: ${r.status} ${JSON.stringify(r.json.errors)}`);
    } else {
      for (const needle of ["Hello Andari Salon, I would like to book.", "Name: Ayu Pratiwi", "WhatsApp: +61412345678", "Treatment: Hair Cut + Wash (Hair Cut)", "Time: 11:30"]) {
        if (!r.json.message.includes(needle)) bad(`English WhatsApp message is missing "${needle}"`);
      }
      ok("English form composes an English message and accepts a +country-code number");
    }
    const e = await post({ ...VALID, locale: "en", name: "" });
    if (!/name/i.test(e.json.errors?.name ?? "") || /Nama/.test(e.json.errors?.name ?? "")) {
      bad(`English validation error is not in English: ${JSON.stringify(e.json.errors)}`);
    } else ok("validation errors follow the visitor's language");
    const x = await post({ ...VALID, locale: "fr" });
    if (x.status !== 422) bad(`unknown locale accepted (status ${x.status})`);
  }

  // 2. provenance fields are no longer part of the contract at all
  {
    const r = await post({ ...VALID, pageUrl: `${ORIGIN}/x`, templateId: "template-2" });
    if (r.status !== 422) {
      bad(`server accepted removed provenance fields (status ${r.status})`);
    }
    ok("removed provenance fields are rejected rather than silently ignored");
  }

  // 3. server-side rejections, with the browser bypassed entirely
  const rejects = [
    ["past date", { date: isoDaysFromNow(-1) }, "date"],
    ["far future date", { date: isoDaysFromNow(400) }, "date"],
    ["malformed date", { date: "2026-13-45" }, "date"],
    ["unknown service", { serviceId: "cukur-kumis" }, "serviceId"],
    ["add-on booked on its own", { serviceId: "hair-vitamin" }, "serviceId"],
    ["off-grid time", { time: "03:17" }, "time"],
    ["empty name", { name: "" }, "name"],
    ["digits-only name", { name: "12345" }, "name"],
    ["nonsense phone", { phone: "12345" }, "phone"],
    ["foreign number without +", { phone: "1 415 555 0100" }, "phone"],
    ["too-short foreign number", { phone: "+1 415" }, "phone"],
  ];
  for (const [label, patch, field] of rejects) {
    const r = await post({ ...VALID, ...patch });
    if (r.status !== 422 || !r.json.errors?.[field]) {
      bad(`server accepted ${label} (status ${r.status}, errors ${JSON.stringify(r.json.errors)})`);
    }
  }
  ok(`${rejects.length} invalid payloads rejected server side`);

  // 4. phone formats people actually type
  const phones = [
    "081234567890",
    "0812-3456-7890",
    "0812 3456 7890",
    "+62 812 3456 7890",
    "+6281234567890",
    "6281234567890",
    "0812.3456.7890",
    "(0812) 3456 7890",
  ];
  for (const phone of phones) {
    const r = await post({ ...VALID, phone });
    if (r.status !== 200 || !r.json.ok) {
      bad(`phone format rejected: "${phone}" -> ${JSON.stringify(r.json.errors)}`);
    } else if (!r.json.message.includes("WhatsApp: 081234567890")) {
      bad(`phone "${phone}" was not normalised in the message`);
    }
  }
  ok(`${phones.length} phone formats accepted and normalised to 081234567890`);

  // 5. honeypot: answered politely, but nothing is composed
  const bot = await post({ ...VALID, website: "http://spam.example" });
  if (bot.status !== 200 || bot.json.href !== null) bad("honeypot submission was not neutralised");
  else ok("honeypot submission produces no link");

  // 6. GET is not a booking channel
  const g = await fetch(`${ORIGIN}/api/booking`);
  if (g.status !== 405) bad(`GET /api/booking answered ${g.status}, expected 405`);
}

async function checkRedirects() {
  for (const [from, to] of REDIRECTS) {
    const res = await fetch(`${ORIGIN}${from}`, { redirect: "manual" });
    const loc = res.headers.get("location") ?? "";
    if (res.status !== 308 || new URL(loc, ORIGIN).pathname !== to) {
      bad(`${from} should 308 to ${to}, got ${res.status} -> ${loc}`);
    }
  }
  ok(`${REDIRECTS.length} old preview URLs redirect permanently to their new pages`);

  const missing = await fetch(`${ORIGIN}/halaman-yang-tidak-ada`);
  if (missing.status !== 404) bad(`unknown URL answered ${missing.status}, expected 404`);
  else ok("unknown URLs answer 404");
}

async function checkSeo() {
  const SITE = "https://andarisalon.id";
  const robots = await (await fetch(`${ORIGIN}/robots.txt`)).text();
  if (/Disallow: \/template/.test(robots)) bad("robots.txt still mentions the preview routes");
  if (!robots.includes(`${SITE}/sitemap.xml`)) bad("robots.txt does not point at the sitemap");

  const sitemap = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  for (const path of [...PAGES_ID, ...PAGES_EN, "/booking"]) {
    const url = path === "/" ? SITE : `${SITE}${path}`;
    if (!sitemap.includes(`<loc>${url}</loc>`)) bad(`sitemap is missing ${url}`);
  }
  if (sitemap.includes("/template-")) bad("sitemap still lists a preview route");
  if (!sitemap.toLowerCase().includes(`hreflang="en"`)) bad("sitemap carries no hreflang alternates");

  const en = await (await fetch(`${ORIGIN}/en/products`)).text();
  if (!/<html[^>]*lang="en"/.test(en)) bad("/en pages do not declare lang=en");
  if (!en.toLowerCase().includes(`hreflang="id" href="${SITE}/produk"`)) bad("/en/products does not point at its Indonesian page");
  if (!en.includes("Hair care products.")) bad("/en/products is not in English");
  ok("English pages declare lang=en and link their Indonesian counterparts");

  const home = await (await fetch(`${ORIGIN}/`)).text();
  if (!/<html[^>]*lang="id"/.test(home)) bad("Indonesian pages do not declare lang=id");
  if (!home.toLowerCase().includes(`hreflang="en" href="${SITE}/en"`)) bad("home does not point at its English page");
  for (const needle of ["Treatment", "Produk", "Kemitraan", "Tentang Andari Salon", ">Booking<"]) {
    if (!home.includes(needle)) bad(`home is missing "${needle}"`);
  }

  const menu = await (await fetch(`${ORIGIN}/treatment`)).text();
  for (const needle of ["Rp 350.000", "Rp 1.200.000", "Hair Cut Poni", "Keramas by Matrix Food For Soft", "Balayage"]) {
    if (!menu.includes(needle)) bad(`treatment page is missing "${needle}"`);
  }
  ok("treatment page carries the price list");
  if (!home.includes('"@type":"HairSalon"')) bad("LocalBusiness structured data is missing");
  if (home.includes("openingHoursSpecification")) {
    bad("structured data publishes opening hours, which are not known yet");
  }
  if (!home.includes("Jl. Gunung Rinjani No.4")) bad("structured data is missing the street address");
  if (!home.includes("+6285218958623")) bad("structured data is missing the WhatsApp number");
  if (!home.includes("instagram.com/andarisalon.id")) bad("structured data is missing Instagram");
  if (home.includes('name="robots" content="noindex')) bad("the home page is noindex");
  ok("robots, sitemap and structured data are consistent");

  // Opening hours must not be invented anywhere in the rendered HTML either.
  if (/\b(0?\d|1\d|2[0-3])[.:]\d{2}\s*(?:-|–)\s*(0?\d|1\d|2[0-3])[.:]\d{2}\b/.test(home)) {
    bad("the home page renders something that looks like an opening-hours range");
  }
  if (!home.includes("Jam buka belum kami umumkan")) bad("the unknown-hours notice is not shown");
  ok("opening hours are shown as not yet published, and never invented");
}

async function main() {
  console.log(`verifying ${ORIGIN}\n`);
  await checkRoutes();
  await checkAssets();
  await checkBooking();
  await checkRedirects();
  await checkSeo();

  for (const n of notes) console.log(n);
  if (failures.length) {
    console.error(`\n${failures.length} failure(s):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log("\nproduction verification passed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

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

const ORIGIN = process.argv[2] ?? "https://andari-salon.vercel.app";

const TEMPLATES = ["/template-1", "/template-2", "/template-3"];
const SUBPAGES = ["", "/layanan", "/booking", "/kontak"];

const ROUTES = [
  "/",
  "/privacy",
  "/terms",
  "/robots.txt",
  "/sitemap.xml",
  ...TEMPLATES.flatMap((t) => SUBPAGES.map((s) => `${t}${s}`)),
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
  ...["t1", "t2", "t3"].flatMap((t) => [
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
  pageUrl: `${ORIGIN}/template-1/booking`,
  templateId: "template-1",
  buttonLabel: "Susun pesan WhatsApp",
};

async function checkBooking() {
  // 1. the happy path composes a complete message
  const good = await post(VALID);
  if (good.status !== 200 || !good.json.ok) {
    bad(`valid booking rejected: ${good.status} ${JSON.stringify(good.json.errors)}`);
  } else {
    const m = good.json.message;
    const required = [
      "Ayu Pratiwi",
      "081234567890",
      "Smoothing",
      "Perawatan Rambut",
      "11:30",
      "Alergi produk beraroma kuat.",
      `${ORIGIN}/template-1/booking`,
      "Susun pesan WhatsApp",
      "01 Editorial Tenang",
    ];
    for (const needle of required) {
      if (!m.includes(needle)) bad(`WhatsApp message is missing "${needle}"`);
    }
    if (!good.json.href.startsWith("https://wa.me/6285218958623?text=")) {
      bad(`wa.me link is wrong: ${good.json.href.slice(0, 60)}`);
    }
    ok("WhatsApp message carries every field, the page URL and the template");
  }

  // 2. the template tag follows the template the visitor was on
  for (const [id, label] of [
    ["template-2", "02 Hangat dan Ramah"],
    ["template-3", "03 Gelap dan Mewah"],
  ]) {
    const r = await post({ ...VALID, templateId: id, pageUrl: `${ORIGIN}/${id}/booking` });
    if (!r.json.message?.includes(label)) bad(`message for ${id} does not say "${label}"`);
    if (!r.json.message?.includes(`${ORIGIN}/${id}/booking`)) bad(`message for ${id} has the wrong page URL`);
  }
  ok("template tag and page URL follow the template the form was on");

  // 3. server-side rejections, with the browser bypassed entirely
  const rejects = [
    ["past date", { date: isoDaysFromNow(-1) }, "date"],
    ["far future date", { date: isoDaysFromNow(400) }, "date"],
    ["malformed date", { date: "2026-13-45" }, "date"],
    ["unknown service", { serviceId: "cukur-kumis" }, "serviceId"],
    ["off-grid time", { time: "03:17" }, "time"],
    ["empty name", { name: "" }, "name"],
    ["digits-only name", { name: "12345" }, "name"],
    ["nonsense phone", { phone: "12345" }, "phone"],
    ["non-Indonesian phone", { phone: "+1 415 555 0100" }, "phone"],
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

async function checkSeo() {
  const robots = await (await fetch(`${ORIGIN}/robots.txt`)).text();
  for (const t of TEMPLATES) {
    if (!robots.includes(`Disallow: ${t}`)) bad(`robots.txt does not disallow ${t} while previewing`);
  }
  if (!robots.includes(`${ORIGIN}/sitemap.xml`)) bad("robots.txt does not point at the sitemap");

  const sitemap = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  for (const t of TEMPLATES) {
    if (sitemap.includes(`${ORIGIN}${t}`)) bad(`sitemap lists ${t} while previewing`);
  }

  const home = await (await fetch(`${ORIGIN}/template-1`)).text();
  if (!home.includes('"@type":"HairSalon"')) bad("LocalBusiness structured data is missing");
  if (home.includes("openingHoursSpecification")) {
    bad("structured data publishes opening hours, which are not known yet");
  }
  if (!home.includes("Jl. Gunung Rinjani No.4")) bad("structured data is missing the street address");
  if (!home.includes("+6285218958623")) bad("structured data is missing the WhatsApp number");
  if (!home.includes("instagram.com/andarisalon.id")) bad("structured data is missing Instagram");
  if (!home.includes('name="robots" content="noindex')) bad("template routes are not noindex while previewing");
  ok("robots, sitemap and structured data are consistent with preview mode");

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

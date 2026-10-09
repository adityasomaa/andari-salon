# Andari Salon

Website for a hair salon in Tegal Kertha, Denpasar Barat, in Indonesian and
English.

**Live:** https://andarisalon.id
(also reachable at https://andari-salon.vercel.app,
https://andarisalon.vercel.app and https://andarisalon.onyxcreative.asia,
all of which canonicalise to andarisalon.id)

The project started as three competing design directions. The client chose
**Template 2, Hangat dan Ramah** (warm sand ground, 24px rounded cards, pill
controls, centred compositions, springy motion), and that design now is the
site, at the root. The old preview URLs (`/template-1`, `/template-2`,
`/template-3` and their sub-pages, plus `/layanan`) answer a permanent 308 to
the matching new page.

---

## Pages

| | Indonesian | English |
|---|---|---|
| Home (hero, about, treatment summary, location, booking entry) | `/` | `/en` |
| Treatment menu with prices | `/treatment` | `/en/treatments` |
| Products | `/produk` | `/en/products` |
| Partnership | `/kemitraan` | `/en/partnership` |
| Contact | `/kontak` | `/en/contact` |
| Booking form | `/reservasi` | `/en/book` |
| Privacy, terms | `/privacy`, `/terms` | `/en/privacy`, `/en/terms` |
| Link hub for the Instagram bio | `/booking` | (Indonesian only) |

Header: Beranda, Treatment, Produk, Kemitraan, Kontak, the ID/EN switch, and a
filled **Booking** button that opens WhatsApp with the booking greeting. The
booking *form* is reached from the hero, the home booking section, the footer
CTA and the link hub.

## Two languages

- Every page URL is listed once, in `src/config/i18n.ts` (`ROUTES`). Internal
  links are written as route keys (`"products"`) and resolved there, so the two
  languages cannot drift and the language switch lands on the same page in the
  other language.
- Every visible string is in `src/config/copy.ts`: Indonesian first, English
  mirroring it key for key. The `Copy` type makes a missing English string a
  type error.
- Treatment names, product groups, dates, form errors, alt text, the cookie
  panel, the legal pages and the WhatsApp messages are all translated. A visitor
  on the English site sends an English WhatsApp message.
- The two languages are two root layouts, `src/app/(id)` and `src/app/(en)`, so
  each page ships the right `<html lang>` from the server. Crossing between them
  is a full page load, which is why the switch uses plain anchors.
- Each page carries `hreflang` alternates for both languages (Indonesian is
  `x-default`), and the sitemap lists both.
- With two root layouts there is no single layout to render a 404 inside, so
  `src/app/global-not-found.tsx` (Next's `globalNotFound` experiment) brings its
  own document and says it in both languages.
- The booking form also accepts foreign numbers written with a `+` country code,
  since English readers are often on foreign SIMs. Indonesian numbers are still
  normalised to the 08 form; a number with no `+` that is not Indonesian is
  still refused.

## The link hub at /booking

`/booking` is the page for the Instagram bio: the wordmark, one line, and a
stack of pills. Nothing else. It fits one screen and does not scroll: height is
`100svh` (not `100vh`, which on a phone is taller than what you can see), and a
`squat` breakpoint splits the rows into two columns when held sideways. Rows
live in `src/config/links.ts`. It is Indonesian only.

---

## What you need to fill in

**Opening hours are not set.** They are the one thing here that would actively
cost the salon a customer if guessed, so nothing guesses them. The site prints
"Jam buka belum kami umumkan" with a note to ask on WhatsApp, and the
LocalBusiness structured data omits `openingHoursSpecification`. To fill them
in, edit `OPENING_HOURS` in `src/config/site.ts`:

```ts
export const OPENING_HOURS: OpeningHours = {
  status: "published",          // was "unset"
  days: [
    { day: "Mo", opens: "09:00", closes: "19:00" },
    // ...
  ],
};
```

Day names come from the copy file in each language; nothing else changes.

**The treatment menu is real.** `src/config/services.ts` is transcribed from
the salon's two price-list sheets: six groups, single prices, and Short /
Medium / Long / Extra Long prices for hair treatment and hair colouring
(colouring marked "start from"). Two spellings were normalised: "Keratine" to
Keratin, "Loreal" to L'Oréal. Add-ons are listed but not bookable on their own;
the form tells visitors to put them in the notes.

**Products are sample content.** No product list was supplied, so
`src/config/products.ts` lists ordinary kinds of take-home hair care with no
brands or prices, and the page says it is a sample. Replace the groups and set
`PRODUCTS_ARE_SAMPLE = false`.

**About text and photos are a first draft.** The "Tentang Andari Salon" section
on the home page is written only from known facts (where the salon is, what it
does, how booking works). The client's own text and photos replace it and the
generated graphics when they arrive.

**Partnership has no programme yet.** The page invites a proposal on WhatsApp
and lists what to include; it does not describe terms that do not exist.

---

## Content rules held throughout

No rating, customer count, year founded, testimonial, stylist name, "best" or
"certified", or promise about how anything will turn out. Prices appear only as
the salon's own price list states them.

Every fact about the business lives in `src/config/site.ts` and nowhere else.
`npm run audit` fails the build if a component hard-codes the WhatsApp number,
the Instagram handle or the street address.

Contact details, exactly as supplied and not extended:

| | |
|---|---|
| WhatsApp | 085218958623 (`6285218958623` for wa.me) |
| Instagram | [@andarisalon.id](https://instagram.com/andarisalon.id) |
| Address | Jl. Gunung Rinjani No.4, Tegal Kertha, Kec. Denpasar Barat, Kota Denpasar, Bali 80112 |

There is no email address on the site, because none was given.

Some shared components (page transitions, date picker, listbox) still carry
branches for the two designs that were not chosen. They are unreachable and
safe to prune.

---

## Brand assets

The supplied `andari salon.png` does carry an alpha channel, but underneath
every transparent pixel it stores a cream RGB value. Anything that drops alpha
instead of compositing it, which is what a lot of tooling does by default,
therefore paints a solid cream box. On the dark template that box would be the
most visible thing on the page.

So nothing references the PNG. `scripts/trace-logo.py` traces its alpha channel
into vectors and `scripts/verify-logo.py` checks the result, comparing
antialiased coverage against the source (currently 0.009 mean absolute error,
stroke weight within 0.5%) and asserting that no asset paints its own
background.

- `public/brand/logo-{olive,bone,ink,current}.svg` — the wordmark, one per ground
- `public/brand/monogram-*.svg` — the leading A, which is a bare chevron in this
  typeface, used as the site icon because the wordmark is far too wide to read
  at 16px
- `public/icon.svg` — the monogram, following the browser's colour scheme so it
  does not vanish against a dark tab strip. No background plate at any size.
- `public/og.png` — the wordmark on paper over the same generated line motif the
  pages use

Palette, measured from the file where its alpha is fully opaque, not invented:

| token | value | measured from |
|---|---|---|
| `--color-olive` | `#575540` | ANDARI wordmark, median of 9502 opaque pixels |
| `--color-ink` | `#322f28` | SALON lockup, median of 683 opaque pixels |

Everything else in the palette is a tint or shade of those two hues.

**Type** is Neue Montreal, converted to WOFF2 and self-hosted in four upright
weights. The brief named the Regular; the three templates lean on different
weights of the same family (300 for templates 1 and 3, 500 for template 2)
rather than introducing a second typeface.

---

## Imagery

There is no photography yet, and nothing here pretends there is. Every visual
is generated by `scripts/build-art.mjs` from a seeded PRNG, so the same seed
always produces the same file and the whole set can be regenerated after a
palette change. Nothing depicts a person, a face or a real haircut, and no alt
text suggests otherwise.

Four abstract motifs shared by all three templates, each rendered in that
template's own dialect: `fall` (a curtain of strands from a soft parting),
`coil` (nested open curves), `weave` (interleaving flowing lines) and `ring`
(off-centre concentric arcs).

---

## Components taken from componentry.dev

Pulled from the shadcn registry at `https://componentry.dev/r/{name}.json` and
adapted rather than dropped in:

- **`text-animate`** became `src/components/shared/reveal.tsx`. Upstream splits
  text into spans with no accessible name, so a screen reader reads a headline
  one letter at a time; here the element carries `aria-label` once and every
  fragment is `aria-hidden`. Motion values were re-expressed through the active
  template's `--t-dur` and `--t-stagger` tokens, so one component is slow and
  blurry in template 1 and springy in template 2. `motion.create()` was hoisted
  to module scope, since calling it during render returns a new component type
  each pass and remounts the subtree.
- **`noise-texture`** informed the grain treatment, but its own implementation
  scales a canvas by 2 or 3 with `transform-origin: top left` and no clipping,
  which spills the canvas across the entire page. The grain here is an SVG
  `feTurbulence` layer baked into each generated graphic, and any canvas surface
  is wrapped in `.grain-clip` (`contain: paint` plus `overflow: hidden`).

Deliberately rejected, with reasons, rather than forced into the design:
`testimonial-marquee` and `pricing-01/02` would require inventing testimonials
and prices, both of which the brief forbids; `matrix-rain`, `ascii-effect`,
`mac-keyboard`, `circuit-board`, `flight-status-card`, `github-calendar`,
`split-flap-display`, `webgl-liquid`, `liquid-chrome`, `dither-*` and `pixel-*`
belong to a loud technical aesthetic that has nothing to do with a calm salon.

---

## Checks

```bash
npm run assets     # regenerate logo, fonts, icons, OG image and graphics
npm run audit      # static audits, see below
npm run typecheck
npm run lint
npm run build
npm run verify     # smoke-test production over HTTP
```

`npm run audit` (`scripts/audit-tokens.mjs`) fails on:

1. any raw `z-index` or Tailwind `z-*` utility. There is one z scale, declared
   once in `globals.css`, and the audit also checks it is in the required order.
2. any colour pair the design tokens put on screen falling under WCAG AA
   4.5:1. Currently 42 pairs are checked; the lowest is 4.71:1.
3. any component hard-coding the WhatsApp number, Instagram handle or address.
4. anything anywhere that looks like an invented opening-hours range.

`npm run verify` (`scripts/verify-production.mjs`) checks all 19 routes and the
assets answer 200 with no auth wall, that the old preview URLs 308 to their new
pages, that the booking endpoint rejects past dates, unknown services, add-ons
on their own, off-grid times and bad phone numbers when the browser is bypassed
entirely, that eight real-world phone formats are accepted and normalised, that
the English form produces an English message and English errors, that the
honeypot is neutralised, that both languages declare their `lang` and point at
each other, that the treatment page carries the price list, and that robots,
sitemap and structured data agree.

`scripts/audit-overflow.js` is a browser snippet that finds the specific
element causing horizontal overflow, rather than just reporting that the page
is too wide. After the language split, 16 routes were checked at 360, 768, 1024
and 1440 (64 combinations): zero overflow, and the header never wraps or
overlaps at 1024 in either language.

---

## Notes on some deliberate decisions

**The z scale and the calendar.** The brief asks for the order
`content < sticky header < template switcher < mobile menu < calendar < cookie
banner < skip link`, and separately that the calendar never cover the mobile
menu. Those two point opposite ways. The scale in `globals.css` follows the
stated order, and the components guarantee the outcome instead: opening the
mobile menu closes every popover, and the calendar trigger is inert while the
menu is open, so the two are never on screen together.

**Page transitions never wait on requestAnimationFrame alone.** rAF stops in a
backgrounded tab, so a curtain that advances on rAF stays up forever. Every
step races a `setTimeout` against rAF and continues on whichever lands first.
This was verified in an actually-backgrounded tab, where rAF never fires: the
sequence still completed and released the scroll lock, just stretched to about
four seconds by timer throttling. The same reasoning removed
`AnimatePresence mode="wait"` from the booking form, where it had held the
success panel behind an exit animation that never finished, and removed the
cookie banner's exit animation, during which it painted over the mobile menu.

**Lenis is narrow on purpose.** It runs only at `min-width: 1024px` with a fine
pointer, and stops whenever anything holds a scroll lock, which covers the
calendar, the dropdowns, the mobile menu and the transition curtain. Touch
devices keep native scrolling.

**WhatsApp messages carry the message and nothing else.** They used to append
a provenance block naming the page URL, the button pressed and which preview
was open. That was useful while three designs were being compared, but it reads
like machine output to whoever receives it, so it is gone: no URL, no button
label, no template tag. `npm run verify` asserts their absence rather than
trusting it.

**Booking is validated twice.** The browser validates for fast feedback, then
`/api/booking` runs the identical schema again and composes the WhatsApp
message server side, so a client that skips the browser pass cannot talk the
site into producing a message for a past date or a service that does not exist.
"Today" is resolved in `Asia/Makassar` on both sides, so a visitor in another
timezone sees the same today the salon does.

**Submitting does not open WhatsApp by script.** It shows the composed message
for review with a real link to send it. A scripted `window.open` after an async
fetch is popup-blocked often enough to matter, and letting people read what
they are about to send is better anyway.

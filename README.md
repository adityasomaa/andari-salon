# Andari Salon

Three complete design directions for a salon that has just opened in Tegal
Kertha, Denpasar Barat. One deployment, one content layer, three different
sites on top of it.

**Live:** https://andari-salon.vercel.app
(also reachable at https://andarisalon.vercel.app and, once DNS propagates,
https://andarisalon.onyxcreative.asia)

- `/` is the chooser. Three cards, one per direction. It is a tool for picking,
  not part of any design, and it disappears when preview mode is switched off.
- `/template-1`, `/template-2`, `/template-3` are three whole sites. Each has
  home, layanan, booking and kontak.
- A small floating control at the bottom right jumps between the three on the
  same sub-page, so the same screen can be compared side by side.

---

## The link hub at /booking

`/booking` is the page for the Instagram bio: one short list of every way to
reach the salon. It wears template 2's clothes (warm sand, 24px cards, pill
controls, springy motion) but has no site navigation, no footer and no preview
switcher, because a link hub wants none of those.

Rows live in `src/config/links.ts`. Add, remove or reorder entries there and
the page follows; nothing else needs editing. The WhatsApp row goes through the
same `WhatsAppLink` component as the rest of the site, so a message sent from
the hub still tells the salon which page and which button it came from.

Links into the site resolve through `sitePath()`, which points at the chosen
template while the three previews coexist and at the flat paths once
`PREVIEW_MODE` is off. Unlike the previews, this page is indexed and listed in
the sitemap: it is a finished page with only one version of itself.

Note the name collision to keep in mind: `/booking` is this link hub, while the
actual booking form lives at `/template-N/booking`. If the site is ever
flattened, rename one of the two.

---

## The three directions

**Template 1, Editorial Tenang.** A paper-white page built on an asymmetric
twelve-column grid, held together by hairlines rather than boxes. The headline
is set enormous and hairline-thin (Neue Montreal Light, up to 7rem) and sits
hard left while the description and the call to action are pushed to the far
right of the same row, so the eye crosses a lot of empty paper to read one
sentence. Nothing has a rounded corner anywhere: the radius is 0 throughout,
service groups are separated by ruled lines instead of cards, and the primary
button is an underlined link rather than a filled shape. Section spacing is the
most generous of the three. Motion is slow and almost subliminal, a 720ms blur
that clears as elements rise a few pixels. It is the direction to pick if the
salon wants to read as quiet, considered and a little bit gallery.

**Template 2, Hangat dan Ramah.** Everything soft. The ground is a warm sand,
cards are 24px rounded and the controls are full pills, including the
navigation, which sits in a rounded capsule with a filled WhatsApp button
beside it. The composition is centred and noticeably denser than template 1:
sections are about half as tall, the type is smaller and set in Medium rather
than Light, and the four service groups are the loudest thing on the home page,
each one a card with its own generated graphic, a numbered chip and its
services as tappable pills. Motion is the liveliest of the three, short 420ms
springs with a small lift on hover. It is the direction to pick if the salon
wants to feel approachable and easy, closer to a neighbourhood place than a
studio.

**Template 3, Gelap dan Mewah.** A near-black olive-tinted page where almost
nothing is filled in. Structure comes from single-pixel hairlines: the hero
sits inside a thin frame, section labels are boxed in a hairline, and the
service rows are separated by 1px gaps rather than borders. The type is the
smallest of the three but the most widely tracked, and section labels run at
0.42em letter-spacing, which is what does the work instead of size. Line
height is deliberately looser than the other two because light type on a dark
ground reads thinner. Corners are 2px, just enough to register as intentional.
Motion is the most restrained: opacity and hairlines that draw themselves,
nothing that moves position, over the longest durations of the three. It is the
direction to pick if the salon wants to feel expensive and still.

Stack the three, make the colours identical, and they still do not look alike:
the layouts are asymmetric versus centred versus split-and-framed, the display
type runs roughly 112px versus 72px versus 56px at desktop, the corner radii
are 0 versus 24 versus 2, and the motion is slow-blur versus spring versus
opacity-only.

---

## What you need to fill in

**Opening hours are not set.** They are the one thing here that would actively
cost the salon a customer if guessed, so nothing guesses them. Right now every
template prints "Jam buka belum kami umumkan" with a note to ask on WhatsApp,
and the LocalBusiness structured data omits `openingHoursSpecification`
entirely rather than publishing a wrong "Open now" to Google.

To fill them in, edit `OPENING_HOURS` in `src/config/site.ts`:

```ts
export const OPENING_HOURS: OpeningHours = {
  status: "published",          // was "unset"
  unknownLabel: "...",          // leave as is, no longer shown
  unknownHint: "...",
  days: [
    { day: "Mo", label: "Senin", opens: "09:00", closes: "19:00" },
    // ...
  ],
};
```

Nothing else needs changing. The footer, the location block and the structured
data all switch over on their own.

**The service list is sample content.** Everything in
`src/config/services.ts` is a placeholder and the site says so, in normal
reading size, at the top of the list on both the home page and the services
page. Replace the `items` arrays and set `SERVICES_ARE_SAMPLE = false`; the
notice removes itself. There are deliberately no prices and no durations
anywhere, because none were supplied.

---

## Turning a preview into the real site

Once a direction is chosen, open `src/config/preview.ts`:

```ts
export const PREVIEW_MODE = false;
export const LIVE_TEMPLATE = "template-2";   // whichever was picked
```

That one flag:

- removes the floating template switcher from every page
- redirects `/` to the chosen template instead of showing the chooser
- puts the chosen template's four pages into the sitemap and stops
  disallowing them in robots.txt, and drops the `noindex`
- stops tagging WhatsApp messages with which template they came from

The other two templates keep working at their URLs; delete their route folders
under `src/app/` if you want them gone.

---

## Content rules held throughout

The salon opened days ago, so the site has no track record to show and does not
pretend otherwise. Nowhere in the copy is there a price, a rating, a customer
count, a year founded, a testimonial, a stylist name, a "best" or "certified",
or a promise about how anything will turn out. What replaces social proof is
plainness: what is offered, where it is, when it opens (once known), and how to
book.

All three templates read their words from the same `src/config/copy.ts`. That
is on purpose, and worth keeping: if the copy differed, comparing the three
would turn into comparing the writing instead of the design.

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
2. any colour pair the three templates put on screen falling under WCAG AA
   4.5:1. Currently 42 pairs are checked; the lowest is 4.71:1.
3. any component hard-coding the WhatsApp number, Instagram handle or address.
4. anything anywhere that looks like an invented opening-hours range.

`npm run verify` (`scripts/verify-production.mjs`) checks all 17 routes and 33
assets answer 200 with no auth wall, that the booking endpoint rejects past
dates, unknown services, off-grid times and bad phone numbers when the browser
is bypassed entirely, that eight real-world phone formats are accepted and
normalised, that the honeypot is neutralised, and that robots, sitemap and
structured data all agree with preview mode.

`scripts/audit-overflow.js` is a browser snippet that finds the specific
element causing horizontal overflow, rather than just reporting that the page
is too wide. It was run across 15 routes at 375, 768 and 1440, all three
templates included: 45 combinations, zero offenders.

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

"""
Site icons and the Open Graph image, both built from the real logo.

Site icon: the wordmark is far too wide to read at 16px, so the icon is the
leading A of ANDARI, taken from the traced vector rather than redrawn, with
padding around it. It has no background plate at any size, per the brief, and
the SVG version follows the browser's colour scheme so the olive mark does not
disappear against a dark tab strip.

OG image: the wordmark itself, on the paper ground, over the same generated
line motif the site uses. No stock photography.

  python scripts/build-icons.py

Output: public/icon.svg, public/favicon.ico, public/apple-icon.png,
        public/og.png, public/site.webmanifest
"""

from __future__ import annotations

import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _svgraster import rasterise, tinted, viewbox  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = os.path.join(ROOT, "public", "brand")
PUB = os.path.join(ROOT, "public")
FONT = os.path.join(ROOT, "assets", "source", "fonts", "NeueMontreal-Regular.ttf")

OLIVE = (87, 85, 64)
INK = (50, 47, 40)
BONE = (237, 234, 229)
PAPER = (251, 250, 247)
PAPER_2 = (243, 241, 234)

ICO_SIZES = [16, 32, 48, 64, 128, 256]


def read(name: str) -> str:
    with open(os.path.join(BRAND, name), encoding="utf-8") as f:
        return f.read()


def build_icon_svg() -> None:
    """Theme-aware monogram. Transparent, no plate, no rect."""
    src = read("monogram-current.svg")
    vw, vh = viewbox(src)
    body = src.split(">", 1)[1].rsplit("</svg>", 1)[0]
    doc = (
        '<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {vw:.2f} {vh:.2f}">'
        "<style>"
        ":root{color:#575540}"
        "@media (prefers-color-scheme:dark){:root{color:#edeae5}}"
        "</style>"
        f"{body}</svg>"
    )
    with open(os.path.join(PUB, "icon.svg"), "w", encoding="utf-8") as f:
        f.write(doc)


def build_favicon() -> None:
    """Multi-size ICO with a real alpha channel, no background plate."""
    src = read("monogram-current.svg")
    frames = []
    for size in ICO_SIZES:
        mask = rasterise(src, size)
        img = Image.new("RGBA", (size, size), (*OLIVE, 0))
        solid = Image.new("RGBA", (size, size), (*OLIVE, 255))
        img = Image.composite(solid, img, mask.point(lambda v: 255 if v > 8 else 0))
        img.putalpha(mask)
        frames.append(img)
    frames[-1].save(
        os.path.join(PUB, "favicon.ico"),
        format="ICO",
        sizes=[(s, s) for s in ICO_SIZES],
        append_images=frames[:-1],
    )


def build_apple_icon() -> None:
    src = read("monogram-current.svg")
    img = tinted(src, 180, OLIVE)
    img.save(os.path.join(PUB, "apple-icon.png"))
    for size in (192, 512):
        tinted(src, size, OLIVE).save(os.path.join(PUB, f"icon-{size}.png"))


def build_og() -> None:
    """1200x630, wordmark on paper, over the generated line motif."""
    W, H = 1200, 630
    canvas = Image.new("RGB", (W, H), PAPER)

    # A soft panel on the right, echoing the site's own hero composition.
    panel = Image.new("RGB", (W, H), PAPER_2)
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).ellipse([W * 0.52, -H * 0.5, W * 1.45, H * 1.35], fill=255)
    canvas.paste(panel, (0, 0), mask.filter(__import__("PIL.ImageFilter", fromlist=["x"]).GaussianBlur(60)))

    draw = ImageDraw.Draw(canvas)

    # The generated strand motif, drawn straight into the raster so the OG
    # image belongs to the same visual family as the pages.
    import math

    seed = 20260823
    def rnd():
        nonlocal seed
        seed = (1103515245 * seed + 12345) % (1 << 31)
        return seed / (1 << 31)

    for i in range(150):
        t = i / 149
        ox = W * 0.60 + (t - 0.5) * W * 0.78
        dx = (ox - W * 0.60) / (W * 0.39)
        length = H * (0.55 + rnd() * 0.62)
        swing = W * 0.16 * (abs(dx) * 0.6 + 0.4) * (1 if dx >= 0 else -1) * (0.5 + rnd())
        pts = []
        for s in range(19):
            u = s / 18
            x = ox + swing * (u ** 1.6)
            y = -30 + length * u
            pts.append((x, y))
        shade = int(178 + rnd() * 52)
        draw.line(pts, fill=(shade, shade - 2, shade - 18), width=1)

    # Scrim so the motif stays behind the type rather than through it.
    scrim = Image.new("RGBA", (W, H), (*PAPER, 0))
    sdraw = ImageDraw.Draw(scrim)
    for x in range(W):
        u = x / W
        a = int(max(0.0, min(1.0, (0.72 - u) / 0.62)) * 235)
        sdraw.line([(x, 0), (x, H)], fill=(*PAPER, a))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), scrim).convert("RGB")
    draw = ImageDraw.Draw(canvas)

    # Wordmark, composited from the traced vector so it stays transparent.
    word = tinted(read("logo-current.svg"), 640, OLIVE)
    canvas.paste(word, (86, int(H * 0.36)), word)

    # Hairline and caption, in the site's own typeface.
    draw.line([(86, H * 0.36 - 46), (W - 86, H * 0.36 - 46)], fill=(87, 85, 64, 60), width=1)
    try:
        font_small = ImageFont.truetype(FONT, 26)
        font_label = ImageFont.truetype(FONT, 19)
    except OSError:
        font_small = ImageFont.load_default()
        font_label = ImageFont.load_default()

    draw.text((86, H * 0.36 - 92), "SALON RAMBUT   /   DENPASAR BARAT", font=font_label, fill=(111, 108, 82))
    draw.text(
        (86, H * 0.36 + 640 / (592 / 167.25) + 46),
        "Jl. Gunung Rinjani No.4, Tegal Kertha, Denpasar Barat, Bali",
        font=font_small,
        fill=INK,
    )

    canvas.save(os.path.join(PUB, "og.png"), optimize=True)


def build_manifest() -> None:
    manifest = {
        "name": "Andari Salon",
        "short_name": "Andari",
        "description": "Salon rambut di Tegal Kertha, Denpasar Barat.",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#fbfaf7",
        "theme_color": "#fbfaf7",
        "icons": [
            {"src": "/icon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any"},
            {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
        ],
    }
    with open(os.path.join(PUB, "site.webmanifest"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")


def main() -> None:
    os.makedirs(PUB, exist_ok=True)
    build_icon_svg()
    build_favicon()
    build_apple_icon()
    build_og()
    build_manifest()
    for name in ("icon.svg", "favicon.ico", "apple-icon.png", "icon-192.png", "icon-512.png", "og.png", "site.webmanifest"):
        path = os.path.join(PUB, name)
        print(f"{name:<22} {os.path.getsize(path) // 1024}K")


if __name__ == "__main__":
    main()

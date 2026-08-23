"""
Rasterise the traced SVGs back to PNG and diff them against the source mask.

This is the guard for the one mistake that would be most expensive here: a
logo that carries a white box, or a counter that got filled in by a bad trace.
Rings are XOR-composited to emulate SVG fill-rule="evenodd".

  python scripts/verify-logo.py
"""

from __future__ import annotations

import os
import re
import sys

import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = os.path.join(ROOT, "public", "brand")
SRC = os.path.join(ROOT, "assets", "source", "andari-salon.png")
OUTDIR = os.path.join(ROOT, "assets", "verify")

PATH_RE = re.compile(r'<path d="([^"]+)"')
VIEWBOX_RE = re.compile(r'viewBox="([^"]+)"')
TRANSLATE_RE = re.compile(r"translate\(([-\d.]+) ([-\d.]+)\)")


def rings_of(d: str) -> list[list[tuple[float, float]]]:
    rings = []
    for chunk in d.split("M"):
        chunk = chunk.strip()
        if not chunk:
            continue
        chunk = chunk.rstrip("Z")
        pts = []
        for pair in chunk.split("L"):
            pair = pair.strip()
            if not pair:
                continue
            x, y = pair.split()
            pts.append((float(x), float(y)))
        if len(pts) >= 3:
            rings.append(pts)
    return rings


def render(svg_path: str, scale: float) -> Image.Image:
    svg = open(svg_path, encoding="utf-8").read()
    vb = [float(v) for v in VIEWBOX_RE.search(svg).group(1).split()]
    w, h = int(round(vb[2] * scale)), int(round(vb[3] * scale))
    tr = TRANSLATE_RE.search(svg)
    ox, oy = (float(tr.group(1)), float(tr.group(2))) if tr else (0.0, 0.0)

    acc = np.zeros((h, w), dtype=bool)
    for d in PATH_RE.findall(svg):
        for ring in rings_of(d):
            layer = Image.new("1", (w, h), 0)
            ImageDraw.Draw(layer).polygon(
                [((x + ox) * scale, (y + oy) * scale) for x, y in ring], fill=1
            )
            acc ^= np.asarray(layer, dtype=bool)  # evenodd
    return Image.fromarray((acc * 255).astype(np.uint8), mode="L")


def main() -> int:
    os.makedirs(OUTDIR, exist_ok=True)
    failures = []

    # 1. wordmark fidelity: compare antialiased coverage, not a hard mask.
    # Binarising a hairline stroke throws away most of the signal, so the
    # vector is rendered 4x and box-filtered back down to a coverage map.
    src_alpha = np.asarray(Image.open(SRC).convert("RGBA")).astype(np.float64)[..., 3] / 255.0
    ys, xs = np.nonzero(src_alpha >= 0.5)
    ref = src_alpha[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]
    h, w = ref.shape

    big = np.asarray(render(os.path.join(BRAND, "logo-olive.svg"), 4.0)) > 127
    big = big[: h * 4, : w * 4]
    if big.shape != (h * 4, w * 4):
        pad = np.zeros((h * 4, w * 4), dtype=bool)
        pad[: big.shape[0], : big.shape[1]] = big
        big = pad
    got = big.reshape(h, 4, w, 4).mean(axis=(1, 3))

    mae = float(np.abs(got - ref).mean())
    area = float(got.sum() / ref.sum())
    print(f"wordmark coverage MAE {mae:.5f}   stroke area ratio {area:.4f}")
    if mae > 0.015:
        failures.append(f"wordmark coverage MAE too high: {mae:.5f}")
    if not (0.97 <= area <= 1.03):
        failures.append(f"wordmark stroke weight drifted: ratio {area:.4f}")

    Image.fromarray(
        np.dstack(
            [
                (np.clip(ref - got, 0, 1) * 255).astype(np.uint8),
                (np.minimum(ref, got) * 255).astype(np.uint8),
                (np.clip(got - ref, 0, 1) * 255).astype(np.uint8),
            ]
        )
    ).save(os.path.join(OUTDIR, "wordmark-diff.png"))

    # 2. no opaque background anywhere in any asset
    for name in sorted(os.listdir(BRAND)):
        if not name.endswith(".svg"):
            continue
        svg = open(os.path.join(BRAND, name), encoding="utf-8").read()
        if "<rect" in svg or "background" in svg:
            failures.append(f"{name} contains a background element")
        img = render(os.path.join(BRAND, name), 1.0)
        arr = np.asarray(img) > 127
        cov = arr.mean()
        # The monogram is padded, so its border ring must be completely clear.
        # The wordmark is cropped to its own bbox, where glyphs touch the edge
        # by definition, so only its coverage is meaningful.
        print(f"{name:<26} ink coverage {cov * 100:5.1f}%")
        if name.startswith("monogram"):
            border = np.concatenate([arr[0], arr[-1], arr[:, 0], arr[:, -1]])
            if border.any():
                failures.append(f"{name} paints its padding ring, not transparent")
        if cov > 0.6:
            failures.append(f"{name} coverage {cov:.2f} looks like a filled box")

    # 3. monogram legibility at favicon size
    small = render(os.path.join(BRAND, "monogram-olive.svg"), 32 / 157.44)
    sm = np.asarray(small) > 127
    print(f"monogram at 32px: {sm.shape}, ink {sm.mean() * 100:.1f}%")
    if not (0.04 < sm.mean() < 0.5):
        failures.append(f"monogram ink at 32px is {sm.mean():.3f}, outside 4-50%")

    # visual proofs on both grounds
    for ground, bg in (("light", (247, 246, 243)), ("dark", (18, 18, 15))):
        canvas = Image.new("RGB", (760, 260), bg)
        for fname, pos in (
            ("logo-olive.svg" if ground == "light" else "logo-bone.svg", (60, 40)),
            ("monogram-olive.svg" if ground == "light" else "monogram-bone.svg", (60, 150)),
        ):
            mask = render(os.path.join(BRAND, fname), 0.6 if "logo" in fname else 0.5)
            ink = (87, 85, 64) if ground == "light" else (237, 234, 229)
            canvas.paste(Image.new("RGB", mask.size, ink), pos, mask)
        canvas.save(os.path.join(OUTDIR, f"proof-{ground}.png"))

    if failures:
        print("\nFAILED:")
        for f in failures:
            print("  -", f)
        return 1
    print("\nall logo asset checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())

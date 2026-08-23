"""
Minimal rasteriser for the polygon-only SVGs this project generates.

Not a general SVG renderer. It handles exactly what scripts/trace-logo.py
emits: `M x y L x y ... Z` subpaths filled with fill-rule="evenodd", optionally
inside a single `translate()` group. Rings are XOR-composited, which is what
evenodd means, and the result is returned as an alpha mask.
"""

from __future__ import annotations

import re

import numpy as np
from PIL import Image, ImageDraw

PATH_RE = re.compile(r'<path d="([^"]+)"')
VIEWBOX_RE = re.compile(r'viewBox="([^"]+)"')
TRANSLATE_RE = re.compile(r"translate\(([-\d.]+) ([-\d.]+)\)")

# 4x supersample then box-filter, so edges are antialiased.
SS = 4


def _rings(d: str) -> list[list[tuple[float, float]]]:
    out = []
    for chunk in d.split("M"):
        chunk = chunk.strip().rstrip("Z")
        if not chunk:
            continue
        pts = []
        for pair in chunk.split("L"):
            pair = pair.strip()
            if not pair:
                continue
            x, y = pair.split()
            pts.append((float(x), float(y)))
        if len(pts) >= 3:
            out.append(pts)
    return out


def viewbox(svg_text: str) -> tuple[float, float]:
    vb = [float(v) for v in VIEWBOX_RE.search(svg_text).group(1).split()]
    return vb[2], vb[3]


def rasterise(svg_text: str, width: int) -> Image.Image:
    """Return an 'L' mode alpha mask `width` px wide, aspect preserved."""
    vw, vh = viewbox(svg_text)
    height = max(1, int(round(width * vh / vw)))
    scale = (width / vw) * SS

    tr = TRANSLATE_RE.search(svg_text)
    ox, oy = (float(tr.group(1)), float(tr.group(2))) if tr else (0.0, 0.0)

    big_w, big_h = width * SS, height * SS
    acc = np.zeros((big_h, big_w), dtype=bool)
    for d in PATH_RE.findall(svg_text):
        for ring in _rings(d):
            layer = Image.new("1", (big_w, big_h), 0)
            ImageDraw.Draw(layer).polygon(
                [((x + ox) * scale, (y + oy) * scale) for x, y in ring], fill=1
            )
            acc ^= np.asarray(layer, dtype=bool)

    cov = acc.reshape(height, SS, width, SS).mean(axis=(1, 3))
    return Image.fromarray((cov * 255).astype(np.uint8), mode="L")


def tinted(svg_text: str, width: int, rgb: tuple[int, int, int]) -> Image.Image:
    """RGBA image of the mark in `rgb`, transparent everywhere else."""
    mask = rasterise(svg_text, width)
    img = Image.new("RGBA", mask.size, (*rgb, 0))
    img.putalpha(mask)
    solid = Image.new("RGBA", mask.size, (*rgb, 255))
    solid.putalpha(mask)
    return solid

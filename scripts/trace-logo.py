"""
Trace the source Andari Salon wordmark PNG into clean, transparent,
recolourable SVG assets.

The supplied PNG does carry an alpha channel, but under every transparent
pixel it stores a cream RGB value (236,233,228). Anything that drops alpha
instead of compositing, which is what PIL's convert("RGB") and a lot of
tooling does, therefore produces a solid cream box. Nothing in the site
references the raw PNG: every surface uses the vectors produced here, and
verify-logo.py enforces that they stay transparent.

  input   assets/source/andari-salon.png
  output  public/brand/*.svg  (wordmark + monogram, four ink variants)
          public/brand/logo-meta.json

Deterministic: identical input always produces identical output.

  python scripts/trace-logo.py
"""

from __future__ import annotations

import json
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "source", "andari-salon.png")
OUT = os.path.join(ROOT, "public", "brand")

# Measured from the source file where alpha is fully opaque, not invented.
# See README > Brand palette.
OLIVE = "#575540"  # ANDARI wordmark, median of 9502 opaque pixels
INK = "#322F28"  # SALON lockup, median of 683 opaque pixels
BONE = "#EDEAE5"  # light-on-dark counterpart of OLIVE

SS = 4  # supersample factor applied to the alpha ramp before thresholding
CUT = 0.55  # ink threshold after supersampling; tuned so stroke weight matches
EPS = 1.6  # Douglas-Peucker tolerance, in supersampled pixels


def load_alpha() -> np.ndarray:
    """Ink coverage in 0..1, taken straight from the source alpha channel."""
    im = Image.open(SRC).convert("RGBA")
    return np.asarray(im).astype(np.float64)[..., 3] / 255.0


def supersample(alpha: np.ndarray, factor: int) -> np.ndarray:
    h, w = alpha.shape
    img = Image.fromarray((alpha * 255).astype(np.uint8), mode="L")
    img = img.resize((w * factor, h * factor), Image.LANCZOS)
    return np.asarray(img).astype(np.float64) / 255.0


def trace_rings(mask: np.ndarray) -> list[list[tuple[float, float]]]:
    """
    Follow the pixel-grid boundary of a binary mask and return closed rings.

    Every filled pixel contributes its uncovered edges as directed segments
    (interior kept on one consistent side), then segments are chained head to
    tail. Outer contours and counters both fall out of this, so the caller can
    render the whole glyph set as one evenodd path.
    """
    h, w = mask.shape
    pad = np.zeros((h + 2, w + 2), dtype=bool)
    pad[1:-1, 1:-1] = mask

    ys, xs = np.nonzero(pad)
    up = ~pad[ys - 1, xs]
    down = ~pad[ys + 1, xs]
    left = ~pad[ys, xs - 1]
    right = ~pad[ys, xs + 1]

    out: dict[tuple[int, int], list[tuple[int, int]]] = {}

    def add(a: tuple[int, int], b: tuple[int, int]) -> None:
        out.setdefault(a, []).append(b)

    for x, y in zip(xs[up].tolist(), ys[up].tolist()):
        add((x + 1, y), (x, y))
    for x, y in zip(xs[down].tolist(), ys[down].tolist()):
        add((x, y + 1), (x + 1, y + 1))
    for x, y in zip(xs[left].tolist(), ys[left].tolist()):
        add((x, y), (x, y + 1))
    for x, y in zip(xs[right].tolist(), ys[right].tolist()):
        add((x + 1, y + 1), (x + 1, y))

    def step(cur, prev):
        """Pick the next vertex, disambiguating corner-touching pixels.

        Where two diagonal pixels meet at a single point, a vertex carries two
        outgoing edges. Taking either one at random makes the ring cross itself
        and evenodd then punches a hole in solid ink. Always turning the same
        way keeps the two regions apart.
        """
        cands = out.get(cur)
        if not cands:
            return None
        if len(cands) == 1:
            nxt = cands.pop()
        else:
            dix, diy = (cur[0] - prev[0], cur[1] - prev[1]) if prev else (0, 0)
            best, best_i = None, 0
            for i, c in enumerate(cands):
                dox, doy = c[0] - cur[0], c[1] - cur[1]
                cross = dix * doy - diy * dox
                if best is None or cross < best:
                    best, best_i = cross, i
            nxt = cands.pop(best_i)
        if not cands:
            del out[cur]
        return nxt

    rings: list[list[tuple[float, float]]] = []
    while out:
        start = next(iter(out))
        ring = [start]
        prev = None
        cur = start
        while True:
            nxt = step(cur, prev)
            if nxt is None or nxt == start:
                break
            ring.append(nxt)
            prev, cur = cur, nxt
        if len(ring) >= 4:
            rings.append([(float(px - 1), float(py - 1)) for px, py in ring])
    return rings


def drop_collinear(ring: list[tuple[float, float]]) -> list[tuple[float, float]]:
    keep = []
    n = len(ring)
    for i in range(n):
        a, b, c = ring[i - 1], ring[i], ring[(i + 1) % n]
        cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
        if abs(cross) > 1e-9:
            keep.append(b)
    return keep if len(keep) >= 3 else ring


def _rdp_open(pts: np.ndarray, eps: float) -> np.ndarray:
    if len(pts) < 3:
        return pts
    start, end = pts[0], pts[-1]
    d = end - start
    norm = float(np.hypot(d[0], d[1]))
    rel = pts - start
    if norm < 1e-9:
        dist = np.hypot(rel[:, 0], rel[:, 1])
    else:
        dist = np.abs(d[0] * rel[:, 1] - d[1] * rel[:, 0]) / norm
    idx = int(np.argmax(dist))
    if dist[idx] > eps:
        left = _rdp_open(pts[: idx + 1], eps)
        right = _rdp_open(pts[idx:], eps)
        return np.vstack([left[:-1], right])
    return np.vstack([start, end])


def simplify(ring: list[tuple[float, float]], eps: float) -> list[tuple[float, float]]:
    """Douglas-Peucker over a closed ring, split at its two extreme points."""
    if len(ring) < 5:
        return ring
    pts = np.asarray(ring, dtype=float)
    centre = pts.mean(axis=0)
    i0 = int(np.argmax(((pts - centre) ** 2).sum(axis=1)))
    i1 = int(np.argmax(((pts - pts[i0]) ** 2).sum(axis=1)))
    lo, hi = sorted((i0, i1))
    if hi - lo < 2 or (len(pts) - (hi - lo)) < 2:
        return ring
    arc_a = _rdp_open(pts[lo : hi + 1], eps)
    arc_b = _rdp_open(np.vstack([pts[hi:], pts[: lo + 1]]), eps)
    merged = [tuple(p) for p in arc_a[:-1]] + [tuple(p) for p in arc_b[:-1]]
    return merged if len(merged) >= 3 else ring


def to_path(
    rings: list[list[tuple[float, float]]],
    scale: float,
    ox: float,
    oy: float,
    prec: int = 2,
) -> str:
    chunks = []
    for ring in rings:
        if len(ring) < 3:
            continue
        pts = [((x - ox) * scale, (y - oy) * scale) for x, y in ring]
        chunks.append(
            "M" + "L".join(f"{x:.{prec}f} {y:.{prec}f}" for x, y in pts) + "Z"
        )
    return "".join(chunks)


def build_rings(mask: np.ndarray, eps: float) -> list[list[tuple[float, float]]]:
    rings = []
    for ring in trace_rings(mask):
        ring = drop_collinear(ring)
        ring = simplify(ring, eps)
        if len(ring) >= 3:
            rings.append(ring)
    return rings


def bbox(mask: np.ndarray) -> tuple[int, int, int, int]:
    ys, xs = np.nonzero(mask)
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def svg(view_w: float, view_h: float, layers: list[tuple[str, str]]) -> str:
    body = "".join(
        f'<path d="{d}" fill="{fill}" fill-rule="evenodd"/>' for d, fill in layers
    )
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {view_w:.2f} {view_h:.2f}">{body}</svg>'
    )


def main() -> None:
    if not os.path.exists(SRC):
        sys.exit(f"missing source image: {SRC}")
    os.makedirs(OUT, exist_ok=True)

    alpha = load_alpha()
    flat = alpha >= 0.5

    # The lockup sits below a clear horizontal gap; split the two bands there.
    rows = np.nonzero(flat.any(axis=1))[0]
    gap = None
    prev = rows[0]
    for r in rows[1:]:
        if r - prev > 3:
            gap = (prev + r) // 2
        prev = r
    if gap is None:
        sys.exit("could not locate the gap between ANDARI and SALON")

    hi = supersample(alpha, SS) >= CUT
    gap_hi = gap * SS

    word_hi = hi.copy()
    word_hi[gap_hi:] = False
    sub_hi = hi.copy()
    sub_hi[:gap_hi] = False

    x0, y0, x1, y1 = bbox(hi)
    width = (x1 - x0) / SS
    height = (y1 - y0) / SS
    scale = 1.0 / SS

    word_rings = build_rings(word_hi, EPS)
    sub_rings = build_rings(sub_hi, EPS)
    d_word = to_path(word_rings, scale, x0, y0)
    d_sub = to_path(sub_rings, scale, x0, y0)

    lockups = {
        "logo-olive.svg": [(d_word, OLIVE), (d_sub, INK)],
        "logo-bone.svg": [(d_word, BONE), (d_sub, BONE)],
        "logo-ink.svg": [(d_word, INK), (d_sub, INK)],
        "logo-current.svg": [(d_word, "currentColor"), (d_sub, "currentColor")],
    }
    for name, layers in lockups.items():
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            f.write(svg(width, height, layers))

    # ---- monogram from the leading A of the wordmark ----
    cols = np.nonzero(word_hi.any(axis=0))[0]
    groups: list[list[int]] = [[int(cols[0])]]
    prev_c = int(cols[0])
    for c in cols[1:].tolist():
        if c - prev_c > 4 * SS:
            groups.append([])
        groups[-1].append(c)
        prev_c = c
    ax0, ax1 = groups[0][0], groups[0][-1] + 1

    a_hi = np.zeros_like(word_hi)
    a_hi[:, ax0:ax1] = word_hi[:, ax0:ax1]
    _, ay0, _, ay1 = bbox(a_hi)

    a_rings = build_rings(a_hi, EPS * 0.7)
    d_a = to_path(a_rings, scale, ax0, ay0)
    a_w = (ax1 - ax0) / SS
    a_h = (ay1 - ay0) / SS

    # Square canvas with breathing room, so the mark survives a 16px favicon.
    pad = 0.22
    side = max(a_w, a_h) * (1 + pad * 2)
    dx = (side - a_w) / 2
    dy = (side - a_h) / 2
    for name, colour in (
        ("monogram-olive.svg", OLIVE),
        ("monogram-bone.svg", BONE),
        ("monogram-ink.svg", INK),
        ("monogram-current.svg", "currentColor"),
    ):
        inner = (
            f'<g transform="translate({dx:.2f} {dy:.2f})">'
            f'<path d="{d_a}" fill="{colour}" fill-rule="evenodd"/></g>'
        )
        doc = (
            '<svg xmlns="http://www.w3.org/2000/svg" '
            f'viewBox="0 0 {side:.2f} {side:.2f}">{inner}</svg>'
        )
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
            f.write(doc)

    meta = {
        "source": "assets/source/andari-salon.png",
        "wordmark": {"width": round(width, 2), "height": round(height, 2)},
        "monogram": {"side": round(side, 2)},
        "palette": {"olive": OLIVE, "ink": INK, "bone": BONE},
        "rings": {
            "wordmark": len(word_rings),
            "lockup": len(sub_rings),
            "monogram": len(a_rings),
        },
    }
    with open(os.path.join(OUT, "logo-meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
        f.write("\n")
    print(json.dumps(meta, indent=2))


if __name__ == "__main__":
    main()

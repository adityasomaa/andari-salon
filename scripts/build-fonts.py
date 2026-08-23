"""
Convert the licensed Neue Montreal TTFs to self-hosted WOFF2.

The brief names NeueMontreal-Regular.ttf, and also asks the three templates to
differ in weight. Four upright weights of the same family cover that without
introducing a second typeface.

  input   assets/source/fonts/*.ttf
  output  public/fonts/*.woff2

  python scripts/build-fonts.py
"""

from __future__ import annotations

import os
import sys

from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "source", "fonts")
OUT = os.path.join(ROOT, "public", "fonts")

FACES = [
    ("NeueMontreal-Light.ttf", "NeueMontreal-Light.woff2", 300),
    ("NeueMontreal-Regular.ttf", "NeueMontreal-Regular.woff2", 400),
    ("NeueMontreal-Medium.ttf", "NeueMontreal-Medium.woff2", 500),
    ("NeueMontreal-Bold.ttf", "NeueMontreal-Bold.woff2", 700),
]


def main() -> int:
    os.makedirs(OUT, exist_ok=True)
    missing = []
    for src_name, out_name, weight in FACES:
        src = os.path.join(SRC, src_name)
        if not os.path.exists(src):
            missing.append(src_name)
            continue
        font = TTFont(src)
        font.flavor = "woff2"
        dst = os.path.join(OUT, out_name)
        font.save(dst)
        upm = font["head"].unitsPerEm
        print(
            f"{out_name:<32} weight {weight}  upm {upm}  "
            f"{os.path.getsize(src) // 1024}K -> {os.path.getsize(dst) // 1024}K"
        )
        font.close()
    if missing:
        print("missing sources:", ", ".join(missing), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

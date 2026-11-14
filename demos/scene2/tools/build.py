#!/usr/bin/env python3
"""
OFF-WORLD // SCENE 02 — MARS : "THE THREE WITNESSES"

Builds the shippable single-file game from the authoring parts in src/.

    python3 tools/build.py

Outputs:
    scene2-mars.html      the whole game, one file, zero dependencies
    assets/sprites/*.png  the pixel art, exported as real image files

The pixel art lives in ONE place — the `offworldArt` JSON block inside
scene2-mars.html — so editing the HTML is safe, and `build_sprites.py`
can always re-export PNGs from it.
"""

import json
import os
import re
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, "src")
OUT = os.path.join(ROOT, "scene2-mars.html")

def read(name):
    with open(os.path.join(SRC, name), "r", encoding="utf-8") as fh:
        return fh.read()

def main():
    part1 = read("part1.html")
    art = json.load(open(os.path.join(SRC, "art.json"), "r", encoding="utf-8"))
    part2 = read("part2.js")
    part3 = read("part3.js")
    part4 = read("part4.js")

    art_json = json.dumps(art, indent=1, ensure_ascii=False)
    art_json = art_json.replace("</", "<\\/")

    html = part1.replace("__ART__", art_json)
    html += part2 + "\n" + part3 + "\n" + part4 + "\n</script>\n</body>\n</html>\n"

    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(html)
    size = os.path.getsize(OUT)
    print("built %s  (%.1f KB)" % (os.path.relpath(OUT, ROOT), size / 1024.0))

    # export the sprite sheets from the built HTML (single source of truth)
    r = subprocess.run(
        [sys.executable, os.path.join(HERE, "build_sprites.py"), "--src", OUT],
        cwd=ROOT,
    )
    if r.returncode != 0:
        print("WARNING: sprite export failed", file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())

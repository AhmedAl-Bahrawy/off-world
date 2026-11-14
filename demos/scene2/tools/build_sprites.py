#!/usr/bin/env python3
"""
OFF-WORLD // SCENE 02 — MARS
Sprite pipeline.

The pixel art lives in ONE place: the `OFFWORLD_ART` JSON block inside
`scene2-mars.html`. This tool reads that block and renders real PNG assets
into `assets/sprites/` so the art is usable outside the game too
(spritesheets, editing, remix).

Usage:
    python3 tools/build_sprites.py                 # read from scene2-mars.html
    python3 tools/build_sprites.py --src art.json  # read from a loose json

Outputs:
    assets/sprites/<group>.png      one sheet per group
    assets/sprites/contact-sheet.png  every sprite, big, for eyeballing
"""

import argparse
import json
import os
import re
import sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_DIR = os.path.join(ROOT, "assets", "sprites")

GROUPS = {
    "player": ["curi_idle", "curi_run", "curi_jump", "curi_fall", "curi_land", "curi_dig", "coper_idle"],
    "guardians": ["vigil", "siegfried", "sojourner", "gusto"],
    "world": ["rock", "rock2", "boulder", "ice", "cactus", "bone", "sign", "lamp", "antenna", "flag", "goalpost"],
    "items": ["shard", "bit", "cell", "tube"],
    "enemies": ["mite", "wasp", "goon"],
}

# frame counts per sprite (must match the art)
def frames_of(entry):
    return entry["frames"]


def hex_to_rgba(value, fallback=(255, 0, 255, 255)):
    if value is None:
        return (0, 0, 0, 0)
    v = value.lstrip("#")
    if len(v) == 3:
        v = "".join(c * 2 for c in v)
    try:
        return (int(v[0:2], 16), int(v[2:4], 16), int(v[4:6], 16), 255)
    except ValueError:
        return fallback


def load_art(src_path):
    """Extract the art JSON from either a raw json file or the game HTML."""
    with open(src_path, "r", encoding="utf-8") as fh:
        blob = fh.read()
    if src_path.endswith(".html"):
        m = re.search(
            r'<script id="offworldArt" type="application/json">(.*?)</script>',
            blob,
            re.S,
        )
        if not m:
            sys.exit("ERROR: no <script id=\"offworldArt\"> block found in " + src_path)
        blob = m.group(1)
    return json.loads(blob)


def render_sprite(pal, entry, scale=1):
    """Render every frame of one sprite into a horizontal strip image."""
    frames = frames_of(entry)
    w = entry["w"]
    h = entry["h"]
    strip = Image.new("RGBA", (w * len(frames) * scale, h * scale), (0, 0, 0, 0))
    px = strip.load()
    for fi, frame in enumerate(frames):
        for y in range(h):
            row = frame[y] if y < len(frame) else ""
            row = row.ljust(w, ".")[:w]
            for x, ch in enumerate(row):
                if ch == "." or ch not in pal:
                    continue
                rgba = pal[ch]
                for sy in range(scale):
                    for sx in range(scale):
                        px[(fi * w + x) * scale + sx, y * scale + sy] = rgba
    return strip


def render_annotated(pal, entry, scale=6):
    """Big version with the eye anchors marked, for art review."""
    frames = frames_of(entry)
    w = entry["w"]
    h = entry["h"]
    strip = Image.new("RGBA", (w * len(frames) * scale, h * scale), (18, 20, 44, 255))
    px = strip.load()
    for fi, frame in enumerate(frames):
        for y in range(h):
            row = frame[y] if y < len(frame) else ""
            row = row.ljust(w, ".")[:w]
            for x, ch in enumerate(row):
                if ch == "." or ch not in pal:
                    continue
                rgba = pal[ch]
                for sy in range(scale):
                    for sx in range(scale):
                        px[(fi * w + x) * scale + sx, y * scale + sy] = rgba
    for fi in range(len(frames)):
        ox = fi * w * scale
        for ex, ey in entry.get("eyes", []):
            cx = ox + ex * scale + scale // 2
            cy = ey * scale + scale // 2
            r = scale
            for dy in range(-r, r + 1):
                for dx in range(-r, r + 1):
                    if dx * dx + dy * dy <= r * r:
                        x, y = cx + dx, cy + dy
                        if 0 <= x < strip.width and 0 <= y < strip.height:
                            px[x, y] = (255, 64, 96, 255)
    return strip


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=os.path.join(ROOT, "scene2-mars.html"))
    ap.add_argument("--scale", type=int, default=4)
    args = ap.parse_args()

    art = load_art(args.src)
    pal = {k: hex_to_rgba(v) for k, v in art["palette"].items()}
    sprites = art["sprites"]

    os.makedirs(OUT_DIR, exist_ok=True)

    # per-group sheets
    for group, names in GROUPS.items():
        used = [n for n in names if n in sprites]
        if not used:
            continue
        sheets = [render_sprite(pal, sprites[n], args.scale) for n in used]
        W = max(s.width for s in sheets)
        H = sum(s.height for s in sheets) + 6 * len(sheets)
        sheet = Image.new("RGBA", (W, H), (10, 12, 30, 255))
        y = 0
        for s in sheets:
            sheet.paste(s, (0, y), s)
            y += s.height + 6
        path = os.path.join(OUT_DIR, "sheet-%s.png" % group)
        sheet.save(path)
        print("wrote", os.path.relpath(path, ROOT), sheet.size)

    # contact sheet (annotated) for review
    rows = []
    for group, names in GROUPS.items():
        for n in names:
            if n in sprites:
                rows.append((group, n, render_annotated(pal, sprites[n], 5)))
    if rows:
        W = max(r[2].width for r in rows) + 220
        H = sum(r[2].height + 14 for r in rows)
        sheet = Image.new("RGBA", (W, H), (10, 12, 30, 255))
        y = 0
        for group, name, img in rows:
            sheet.paste(img, (200, y), img)
            y += img.height + 14
        path = os.path.join(OUT_DIR, "contact-sheet.png")
        sheet.save(path)
        print("wrote", os.path.relpath(path, ROOT), sheet.size)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Exports the one art preview the repo keeps:

    python3 tools/build_sprites.py   ->   assets/sprites/contact-sheet.png

Reads the pixel art straight from js/04-art.js (the single source of
truth) and renders every sprite's first frame at 4x with labels.
"""
import json, os, re
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

src = open(os.path.join(ROOT, 'js', '04-art.js'), encoding='utf-8').read()
m = re.search(r'const ART = (.*?);\s*$', src, re.S)
art = json.loads(m.group(1))
pal = art['palette']

SCALE, COLS = 4, 8
names = sorted(art['sprites'])
cw = max(art['sprites'][n]['w'] for n in names) * SCALE + 16
ch = max(art['sprites'][n]['h'] for n in names) * SCALE + 30
rows = (len(names) + COLS - 1) // COLS
img = Image.new('RGB', (COLS * cw, rows * ch), (14, 18, 38))
d = ImageDraw.Draw(img)

for i, name in enumerate(names):
    e = art['sprites'][name]
    x0 = (i % COLS) * cw + 8
    y0 = (i // COLS) * ch + 8
    for fy, row in enumerate(e['frames'][0]):
        row = row.ljust(e['w'], '.')[:e['w']]
        for fx, ch_ in enumerate(row[:e['w']]):
            col = pal.get(ch_)
            if not col:
                continue
            d.rectangle([x0 + fx*SCALE, y0 + fy*SCALE,
                         x0 + fx*SCALE + SCALE - 1, y0 + fy*SCALE + SCALE - 1],
                        fill=col)
    d.text((x0, y0 + e['h']*SCALE + 6), name, fill=(154, 163, 208))

out = os.path.join(ROOT, 'assets', 'sprites', 'contact-sheet.png')
os.makedirs(os.path.dirname(out), exist_ok=True)
img.save(out)
print('contact-sheet.png written:', img.size)

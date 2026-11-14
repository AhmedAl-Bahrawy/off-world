#!/usr/bin/env python3
"""
OFF-WORLD // SCENE 02 — MARS : "THE THREE WITNESSES"

Bundles the readable project (index.html + css/style.css + js/*.js) into
the shippable single file:

    python3 tools/build.py   ->   scene2-mars.html

The single file works offline, from file://, off a USB stick. The js/
sources stay the readable, editable truth.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

def read(*p):
    with open(os.path.join(ROOT, *p), encoding='utf-8') as fh:
        return fh.read()

def main():
    html = read('index.html')
    css = read('css', 'style.css')
    html = html.replace(
        '<link rel="stylesheet" href="css/style.css">',
        '<style>\n' + css + '</style>')
    def inline(m):
        code = read(*m.group(1).split('/'))
        return '<script>\n' + code + '</script>'
    html, n = re.subn(r'<script src="(js/[^"]+)"></script>', inline, html)
    out = os.path.join(ROOT, 'scene2-mars.html')
    with open(out, 'w', encoding='utf-8') as fh:
        fh.write(html)
    print(f'scene2-mars.html written ({n} scripts inlined, {len(html)} bytes)')

if __name__ == '__main__':
    main()

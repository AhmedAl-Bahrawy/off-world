#!/usr/bin/env python3
"""
One-shot asset acquisition for the Off-World / Voyager experience.

Downloads every third-party asset into `public/assets/...` and records the
source URL, author and licence for each one into `public/assets/manifest.json`.
Nothing in the running app points at a remote host afterwards.

Re-run with --refresh to re-download; otherwise existing files are skipped.
"""
import json
import os
import subprocess
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PUB = os.path.join(ROOT, 'public', 'assets')
UA = 'OffWorldVoyager/1.0 (https://example.org/off-world; dev@example.org)'
HEADERS = {'User-Agent': UA}

COMMONS = 'https://commons.wikimedia.org/wiki/Special:FilePath/'


def get(url: str, binary: bool = True, tries: int = 4):
    """Download via curl — Wikimedia's CDN rejects urllib's redirect chain."""
    delay = 2.0
    for attempt in range(tries):
        proc = subprocess.run(
            ['curl', '-sSL', '--fail', '--max-time', '180', '-A', UA, url],
            capture_output=True,
        )
        if proc.returncode == 0 and proc.stdout:
            return proc.stdout if binary else proc.stdout.decode('utf-8')
        if attempt == tries - 1:
            raise RuntimeError(f'GET failed: {url} :: {proc.stderr.decode()[:300]}')
        print(f'    retry {attempt + 1}/{tries - 1}; sleeping {delay}s')
        time.sleep(delay)
        delay *= 2
    return None


def commons_meta(title: str) -> dict:
    """Author + licence metadata for a Commons file."""
    params = urllib.parse.urlencode({
        'action': 'query',
        'format': 'json',
        'titles': f'File:{title}',
        'prop': 'imageinfo',
        'iiprop': 'extmetadata|size|mime',
    })
    url = 'https://commons.wikimedia.org/w/api.php?' + params
    data = json.loads(get(url, binary=False))
    pages = data.get('query', {}).get('pages', {})
    for page in pages.values():
        info = (page.get('imageinfo') or [{}])[0]
        meta = info.get('extmetadata', {})
        clean = {}
        for k, v in meta.items():
            val = str(v.get('value', ''))
            # Strip the wiki markup Commons stores.
            for tag in ('<br>', '<br/>', '<br />'):
                val = val.replace(tag, ' ')
            if '<' in val and '>' in val and val.startswith('<a'):
                val = val.split('href="', 1)[-1].split('"', 1)[0]
            clean[k] = ' '.join(str(val).split())[:220]
        return {
            'license': clean.get('LicenseShortName', ''),
            'licenseUrl': clean.get('LicenseUrl', ''),
            'author': clean.get('Artist', ''),
            'credit': clean.get('Credit', ''),
            'descriptionUrl': info.get('descriptionurl', ''),
            'width': info.get('width'),
            'height': info.get('height'),
            'mime': info.get('mime'),
        }
    return {}


def commons_url(title: str, width: int | None = None) -> str:
    url = COMMONS + urllib.parse.quote(title.replace(' ', '_'))
    if width:
        url += f'?width={width}'
    return url


# --------------------------------------------------------------------------
# Asset table: (id, commons file title, target path, width, category, license note)
# --------------------------------------------------------------------------
COMMONS_ASSETS = [
    ('earth-day', 'Blue Marble Next Generation + topography + bathymetry.jpg',
     'textures/earth-day.jpg', 2048, 'textures'),
    ('earth-lights', "Earth's City Lights by DMSP, 1994-1995 (medium).png",
     'textures/earth-lights.png', 2048, 'textures'),
    ('mars-map', 'Mars Viking MDIM21 ClrMosaic 1km.jpg',
     'textures/mars-map.jpg', 2048, 'textures'),
    ('milky-way', 'ESO_-_Milky_Way.jpg',
     'images/milky-way.jpg', 2400, 'images'),
    ('voyager-reference', 'Voyager spacecraft.jpg',
     'images/voyager-reference.jpg', 900, 'images'),
    ('golden-record', 'The Sounds of Earth Record Cover - GPN-2000-001978.jpg',
     'images/golden-record.jpg', 900, 'images'),
    ('pale-blue-dot', 'Pale Blue Dot.png',
     'images/pale-blue-dot.png', 700, 'images'),
]

LUCIDE_ICONS = [
    'arrow-right', 'audio-waveform', 'camera', 'check', 'cpu', 'disc-3',
    'droplets', 'image', 'magnet', 'message-circle', 'move', 'music', 'search',
    'satellite-dish', 'snowflake', 'x', 'zap',
]

# Assets fetched from a different origin, recorded here so the manifest stays
# the single inventory of everything third-party in the project.
MODELS = [
    {
        'id': 'voyager-1',
        'path': 'assets/models/voyager-1.glb',
        'category': 'models',
        'source': 'https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/v/Voyager.glb',
        'sourcePage': 'https://science.nasa.gov/resource/voyager-3d-model/',
        'license': 'Public domain (NASA media usage guidelines)',
        'licenseUrl': 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
        'author': 'NASA Visualization Technology Applications and Development (VTAD)',
        'credit': 'NASA/VTAD',
        'notes': 'Optimised with gltf-transform (webp textures, 727 KB). '
                'Model space is ~1 unit = 1 m.',
    },
]

AUDIO = [
    {
        'id': 'ambience-space-wind',
        'path': 'assets/audio/ambience/space-wind.ogg',
        'category': 'audio/ambience',
        'source': 'https://opengameart.org/sites/default/files/space-wind_0.mp3',
        'sourcePage': 'https://opengameart.org/content/space-winds',
        'license': 'CC0 1.0',
        'licenseUrl': 'https://creativecommons.org/publicdomain/zero/1.0/',
        'author': 'OpenGameArt contributors (MySFX / BlackCortex CC0 collection)',
        'credit': '',
        'notes': 'Trimmed to a 48.6 s seamless loop, mono, 59 kbps Vorbis.',
    },
    {
        'id': 'ambience-voyage-bed',
        'path': 'assets/audio/ambience/voyage-bed.ogg',
        'category': 'audio/ambience',
        'source': 'https://opengameart.org/sites/default/files/OutThere_0.ogg',
        'sourcePage': 'https://opengameart.org/content/space-music-out-there',
        'license': 'CC0 1.0',
        'licenseUrl': 'https://creativecommons.org/publicdomain/zero/1.0/',
        'author': 'yd (OpenGameArt)',
        'credit': '',
        'notes': 'Steady 58–116 s section, looped, mono, 54 kbps Vorbis. '
                'Used only under the voyage chapter.',
    },
]


def main() -> int:
    refresh = '--refresh' in sys.argv
    os.makedirs(os.path.join(PUB, 'textures'), exist_ok=True)
    os.makedirs(os.path.join(PUB, 'images'), exist_ok=True)
    os.makedirs(os.path.join(PUB, 'icons'), exist_ok=True)
    entries = []

    for aid, title, rel, width, category in COMMONS_ASSETS:
        dest = os.path.join(PUB, rel)
        print(f'* {aid}: {title}')
        if not (refresh and os.path.exists(dest)):
            data = get(commons_url(title, width))
            with open(dest, 'wb') as f:
                f.write(data)
            time.sleep(1.6)
        meta = commons_meta(title)
        entries.append({
            'id': aid,
            'path': f'assets/{rel}',
            'category': category,
            'source': commons_url(title),
            'sourcePage': meta.get('descriptionUrl', ''),
            'license': meta.get('license', ''),
            'licenseUrl': meta.get('licenseUrl', ''),
            'author': meta.get('author', ''),
            'credit': meta.get('credit', ''),
            'bytes': os.path.getsize(dest),
        })
        print(f"    -> {rel}  ({meta.get('license')} / {meta.get('author')})")

    # Lucide icons (ISC licence) — vendored so the UI never hits a CDN.
    icon_base = 'https://cdn.jsdelivr.net/npm/lucide-static@0.468.0/icons/'
    for name in LUCIDE_ICONS:
        dest = os.path.join(PUB, 'icons', f'{name}.svg')
        print(f'* icon: {name}')
        if not (refresh and os.path.exists(dest)):
            data = get(icon_base + name + '.svg')
            with open(dest, 'wb') as f:
                f.write(data)
            time.sleep(0.25)
        entries.append({
            'id': f'icon-{name}',
            'path': f'assets/icons/{name}.svg',
            'category': 'icons',
            'source': icon_base + name + '.svg',
            'sourcePage': 'https://github.com/lucide-icons/lucide',
            'license': 'ISC',
            'licenseUrl': 'https://github.com/lucide-icons/lucide/blob/main/LICENSE',
            'author': 'Lucide Contributors',
            'credit': '',
            'bytes': os.path.getsize(dest),
        })

    manifest_path = os.path.join(PUB, 'manifest.json')
    for extra in MODELS + AUDIO:
        dest = os.path.join(PUB, extra['path'])
        entry = dict(extra)
        entry['bytes'] = os.path.getsize(dest) if os.path.exists(dest) else 0
        entries.append(entry)

    manifest = {'generated': time.strftime('%Y-%m-%d'), 'assets': entries}
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    print(f'\nmanifest: {manifest_path} ({len(entries)} assets)')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

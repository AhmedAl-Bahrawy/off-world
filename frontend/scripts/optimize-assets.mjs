#!/usr/bin/env node
/**
 * Optimises the downloaded raster assets for the web.
 *
 * Source files come straight from Wikimedia at full resolution; this pass
 * resizes them to the size the app actually draws and re-encodes them, which
 * takes public/assets from ~11 MB down to ~1 MB without a visible change.
 *
 * Run:  node scripts/optimize-assets.mjs
 */
import { readFile, writeFile, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from '/workspace/tools/node_modules/sharp/lib/index.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS = path.join(ROOT, 'public', 'assets')
/** `--manifest-only` refreshes the manifest without re-encoding anything. */
const MANIFEST_ONLY = process.argv.includes('--manifest-only')

/** [file, width, quality, outFile | null (in-place)] */
const JOBS = [
  ['textures/earth-day.jpg', 2048, 82, 'earth-day.jpg'],
  ['textures/earth-lights.png', 2048, 80, 'earth-lights.jpg'],
  ['textures/mars-map.jpg', 2048, 82, 'mars-map.jpg'],
  ['images/milky-way.jpg', 1920, 76, 'milky-way.jpg'],
  ['images/voyager-reference.jpg', 900, 82, 'voyager-reference.jpg'],
  ['images/golden-record.jpg', 900, 84, 'golden-record.jpg'],
  ['images/pale-blue-dot.png', 700, 88, 'pale-blue-dot.jpg'],
]

let before = 0
let after = 0

for (const [rel, width, quality, outName] of JOBS) {
  const src = path.join(ASSETS, rel)
  const raw = await readFile(src)
  before += raw.length

  const img = sharp(raw)
  const meta = await img.metadata()
  const isPng = rel.endsWith('.png')
  const target = path.join(path.dirname(src), outName)

  let pipeline = sharp(raw).resize({ width, withoutEnlargement: true })
  if (isPng) {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:4:4' })
  } else {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true, progressive: true })
  }

  const buf = await pipeline.toBuffer()
  await writeFile(target, buf)
  if (target !== src) await unlink(src)
  after += buf.length
  console.log(
    `${rel}  ${meta.width}x${meta.height} -> ${width}px  ` +
      `${(raw.length / 1024).toFixed(0)} KB -> ${(buf.length / 1024).toFixed(0)} KB` +
      (target !== src ? `  (${path.basename(target)})` : ''),
  )
}

if (MANIFEST_ONLY) {
  console.log('\n(manifest-only run — no re-encoding)')
}

console.log(
  `\nTotal: ${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024 / 1024).toFixed(2)} MB`,
)

// Keep the manifest in step with the files on disk: two rasters change
// extension (png -> jpg) and every entry's byte size changes.
const manifestPath = path.join(ASSETS, 'manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf-8'))
const renamed = new Map()
for (const [rel, , , outName] of JOBS) {
  if (path.basename(rel) !== outName) {
    renamed.set(`assets/${rel}`, `assets/${path.join(path.dirname(rel), outName)}`)
  }
}
for (const asset of manifest.assets) {
  if (renamed.has(asset.path)) asset.path = renamed.get(asset.path)
  const abs = path.join(ASSETS, path.relative('assets', asset.path))
  try {
    asset.bytes = (await stat(abs)).size
  } catch {
    /* entry without a file on disk — leave the recorded size alone */
  }
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`manifest updated: ${manifestPath}`)

import * as THREE from 'three'
import { seeded } from '../lib/motion'

const textureLoader = new THREE.TextureLoader()

/* ------------------------------------------------------------------ */
/* Real imagery (public domain, NASA)                                  */
/* ------------------------------------------------------------------ */

/** Blue Marble Next Generation — albedo, equirectangular. */
export const EARTH_MAP = textureLoader.load('/assets/textures/earth-day.jpg')
/** DMSP city lights — night side, same projection as the albedo map. */
export const EARTH_LIGHTS = textureLoader.load('/assets/textures/earth-lights.jpg')

for (const t of [EARTH_MAP, EARTH_LIGHTS]) {
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
}

/* ------------------------------------------------------------------ */
/* Procedural planet textures                                          */
/* ------------------------------------------------------------------ */

/**
 * Smooth value noise on a wrapping latitude/longitude grid, so the result
 * tiles seamlessly across the sphere's UV seam.
 */
function makeNoise(seed: number) {
  const rand = seeded(seed)
  const size = 256
  const grid = new Float32Array(size * size)
  for (let i = 0; i < grid.length; i++) grid[i] = rand()

  const at = (x: number, y: number) => grid[(y & (size - 1)) * size + (x & (size - 1))]
  const smooth = (t: number) => t * t * (3 - 2 * t)

  /** fBm sampled in UV space. */
  return (u: number, v: number, octaves = 5) => {
    let sum = 0
    let amp = 1
    let norm = 0
    let freq = 4
    for (let o = 0; o < octaves; o++) {
      const x = u * freq
      const y = v * freq
      const xi = Math.floor(x)
      const yi = Math.floor(y)
      const tx = smooth(x - xi)
      const ty = smooth(y - yi)
      const a = at(xi, yi)
      const b = at(xi + 1, yi)
      const c = at(xi, yi + 1)
      const d = at(xi + 1, yi + 1)
      sum += amp * (a * (1 - tx) * (1 - ty) + b * tx * (1 - ty) + c * (1 - tx) * ty + d * tx * ty)
      norm += amp
      amp *= 0.5
      freq *= 2
    }
    return sum / norm
  }
}

/**
 * Build an equirectangular planet surface on a canvas.
 *
 * Used for the fictional worlds (Kalamith) and for the cloud shell, where no
 * public-domain equivalent exists. The noise is seeded, so the same world is
 * produced on every load.
 */
export function planetTexture(opts: {
  sea: string
  land: string
  land2: string
  polar: string
  seed: number
  /** 0..1 — how much of the surface is covered by land. */
  coverage?: number
  size?: number
}) {
  const { sea, land, land2, polar, seed } = opts
  const coverage = opts.coverage ?? 0.5
  const W = opts.size ?? 1024
  const H = W / 2
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const g = canvas.getContext('2d')!

  const noise = makeNoise(seed)
  const detail = makeNoise(seed + 977)

  const img = g.createImageData(W, H)
  const seaC = new THREE.Color(sea)
  const landC = new THREE.Color(land)
  const land2C = new THREE.Color(land2)
  const polarC = new THREE.Color(polar)

  for (let y = 0; y < H; y++) {
    const v = y / H
    // Latitude: 0 at the equator, 1 at the poles.
    const lat = Math.abs(v - 0.5) * 2
    for (let x = 0; x < W; x++) {
      const u = x / W
      const h = noise(u, v, 6)
      const d = detail(u, v, 4)
      const edge = h + (d - 0.5) * 0.22
      const t = Math.max(0, Math.min(1, (edge - (1 - coverage)) * 6))

      const c = landC.clone().lerp(land2C, Math.min(1, Math.max(0, (d - 0.35) * 2.2)))
      const out = seaC.clone().lerp(c, t)
      // Polar caps fade in over the last 12% of latitude.
      const ice = Math.max(0, Math.min(1, (lat - 0.86) / 0.14))
      out.lerp(polarC, ice * 0.9)

      const i = (y * W + x) * 4
      img.data[i] = out.r * 255
      img.data[i + 1] = out.g * 255
      img.data[i + 2] = out.b * 255
      img.data[i + 3] = 255
    }
  }
  g.putImageData(img, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

/** Cloud shell: white blobs on black, sampled as a single channel. */
export const CLOUD_MAP = planetTexture({
  sea: '#000000',
  land: '#ffffff',
  land2: '#c8d8ee',
  polar: '#ffffff',
  seed: 4242,
  coverage: 0.62,
  size: 1024,
})

/**
 * The Kalamith home world: a violet ocean world with pale mineral continents.
 * Fictional, so it is generated rather than sourced.
 */
export const KALAMITH_MAP = planetTexture({
  sea: '#2a1444',
  land: '#8f6fd6',
  land2: '#d9b4ff',
  polar: '#efe4ff',
  seed: 1601,
  coverage: 0.46,
})

/**
 * Planetary ring: a banded annulus drawn as a 1D strip. The texture wraps
 * around the ring so the banding reads as material rather than as a gradient.
 */
export const RING_MAP = (() => {
  const W = 512
  const H = 8
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const g = canvas.getContext('2d')!
  const noise = makeNoise(77)
  const img = g.createImageData(W, H)
  for (let x = 0; x < W; x++) {
    const u = x / W
    const bands = noise(u, 0.5, 4)
    const gaps = Math.abs(Math.sin(u * 26)) < 0.14 ? 0.25 : 1
    const a = Math.max(0, Math.min(1, (bands - 0.32) * 2.4)) * gaps
    for (let y = 0; y < H; y++) {
      const i = (y * W + x) * 4
      img.data[i] = 226
      img.data[i + 1] = 196
      img.data[i + 2] = 255
      img.data[i + 3] = a * 255
    }
  }
  g.putImageData(img, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  return texture
})()

/**
 * Big glowing planet-name label drawn with the Orbitron face. Because web
 * fonts load asynchronously, `draw` is exposed so the caller can re-stamp the
 * canvas once `document.fonts` is ready.
 */
export function labelTexture(text: string, color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 96
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace

  const draw = () => {
    const g = canvas.getContext('2d')!
    g.clearRect(0, 0, canvas.width, canvas.height)
    g.font = '800 38px Orbitron, sans-serif'
    g.textAlign = 'center'
    g.fillStyle = color
    g.shadowColor = color
    g.shadowBlur = 16
    g.fillText(text, 320, 58)
    texture.needsUpdate = true
  }

  draw()
  return { texture, draw }
}

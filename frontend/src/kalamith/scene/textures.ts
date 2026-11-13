import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

/** User-supplied Earth artwork and the matching custom Kalamith surface. */
export const EARTH_MAP = textureLoader.load('/visuals/earth.svg')
export const KALAMITH_MAP = textureLoader.load('/visuals/kalamith.svg')

/**
 * Procedural planet textures, pre-rendered ONCE at module load with 2D canvas
 * and reused for the whole session (no per-frame or per-mount cost).
 *
 * `land` blobs are scattered over a `sea` base; the same routine draws the
 * cloud layer (white blobs on black, later blended additively).
 */

function planetTexture(land: string, sea: string, blobClusters: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const g = canvas.getContext('2d')!

  g.fillStyle = sea
  g.fillRect(0, 0, 1024, 512)

  g.fillStyle = land
  for (let i = 0; i < blobClusters; i++) {
    const cx = Math.random() * 1024
    const cy = 90 + Math.random() * 330
    for (let j = 0; j < 16; j++) {
      g.beginPath()
      g.arc(
        cx + (Math.random() - 0.5) * 110,
        cy + (Math.random() - 0.5) * 60,
        8 + Math.random() * 28,
        0,
        7,
      )
      g.fill()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export const CLOUD_MAP = planetTexture('#ffffff', '#000000', 22)

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

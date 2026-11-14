import { Vector3 } from 'three'

/** True when the user asked the OS to reduce motion. */
export const RM =
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Shared mutable values written by the story script and read every frame by
 * render loops. Keeping them outside React state avoids re-renders at 60 fps.
 */
export const motion = {
  /** Starfield drift: eased value + the target the story sets per scene. */
  starSpeed: 0.05,
  starTarget: 0.05,
  /** Live ship world position — updated by <Ship/>, read by <Beam/>. */
  shipPos: new Vector3(),
  /** Live earth group position — updated by <Earth/>, read by <Beam/>. */
  earthPos: new Vector3(0, -13, 0),
}

/**
 * Deterministic pseudo-noise in [-1, 1].
 *
 * Frame loops must not call `Math.random()` — the flicker would differ
 * between runs and could not be reasoned about. This hashes the frame time
 * instead, so the motion is smooth, repeatable and cheap.
 */
export function flicker(t: number, seed = 0) {
  const x = Math.sin(t * 12.9898 + seed * 78.233) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

/** Seeded PRNG (mulberry32) for one-off generation that must be repeatable. */
export function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

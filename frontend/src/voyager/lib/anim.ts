import { RM } from './motion'
import type { PerspectiveCamera } from 'three'

/**
 * Shared animation constants — the single source of truth for how the
 * experience moves. Keeping them here (instead of duplicated per file)
 * makes the whole app feel like one family and lets the pacing be
 * tuned in one place.
 */

/** Long scene-transition tween (planet/ship/camera repositioning). */
export const SCENE_TWEEN = { duration: RM ? 0 : 2.4, ease: 'power3.inOut' } as const

/** Scene-transition duration only (when a custom ease is needed). */
export const SCENE_DUR = RM ? 0 : 2.4

/** HUD window chrome: open / close timings (seconds). */
export const WIN_OPEN = {
  frame: 0.34,
  childStagger: 0.05,
  childDelay: 0.1,
  childDur: 0.32,
} as const

export const WIN_CLOSE = {
  dur: 0.22,
  /** Slightly longer than `dur` so the animation finishes before unmount. */
  removeAfter: 260,
} as const

/** Multiplier applied to GSAP durations when the OS wants reduced motion. */
export const D = RM ? 0 : 1

/**
 * Scale factor applied to scene actors so they stay framed on narrow
 * viewports. Every actor uses this so they agree on how much to shrink.
 */
export const aspectScale = (camera: PerspectiveCamera) =>
  0.6 + 0.4 * Math.min(1, camera.aspect / 1.5)

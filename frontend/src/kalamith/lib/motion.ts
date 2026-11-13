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
  earthPos: new Vector3(0, -9.6, 0),
}

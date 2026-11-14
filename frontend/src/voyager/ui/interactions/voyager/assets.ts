/**
 * Every external asset used by the Voyager 1 scene lives here.
 *
 * All of them are vendored under `public/assets` — the experience makes no
 * third-party requests at runtime. `public/assets/manifest.json` records the
 * source, author and licence for every file referenced here.
 *
 * All of them are optional: each slot has a CSS-gradient placeholder
 * underneath, so a missing file never breaks the view.
 */

/** Static image assets. */
export const IMAGES = {
  /** Reference photo of the spacecraft (top-right "echo" frame). */
  voyager: '/assets/images/voyager-reference.jpg',
  /** The Golden Record cover (shown when the record is inspected). */
  record: '/assets/images/golden-record.jpg',
  /** Earth as seen by Voyager 1. */
  paleBlueDot: '/assets/images/pale-blue-dot.jpg',
}

/** Vendored lucide icon set (ISC licence) served as plain .svg files. */
export const ICON_BASE = '/assets/icons/'

/** The 3D model of Voyager 1 (NASA/VTAD, public domain). */
export const VOYAGER_MODEL = '/assets/models/voyager-1.glb'

/**
 * Optional equirectangular Mars map. If it fails to load, a procedural
 * canvas texture is used instead.
 */
export const MARS_MAP_URL = '/assets/textures/mars-map.jpg'

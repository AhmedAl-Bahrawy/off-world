/**
 * Every external asset used by the Voyager 1 scene lives here.
 * All of them are optional: each slot has a CSS-gradient placeholder underneath,
 * so a dead link never breaks the view. Swap any URL (or point it at /public).
 *
 * Wikimedia `Special:FilePath` resolves by file NAME, so it survives re-hashing.
 */
const commons = (file: string, width = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`

/** lucide icon set served as plain .svg files from jsDelivr. */
export const ICON_BASE = 'https://cdn.jsdelivr.net/npm/lucide-static@0.468.0/icons/'

export const IMAGES = {
  /** Full-screen background, far layer (Milky Way). */
  bgSky: commons('ESO_-_Milky_Way.jpg', 2400),
  /** Reference photo of the spacecraft (top-right "echo" frame). */
  voyager: commons('Voyager_spacecraft_model.png', 900),
  /** The Golden Record cover (shown when the record is inspected). */
  record: commons('The_Sounds_of_Earth_-_GPN-2000-001976.jpg', 900),
  /** Earth as seen by Voyager 1. */
  paleBlueDot: commons('Pale_Blue_Dot.png', 700),
}

/**
 * Optional equirectangular Mars map. If it fails to load, a procedural
 * canvas texture is used instead. Set to '' to skip the request.
 */
export const MARS_MAP_URL = commons('Mars_viking_colorized.jpg', 2048)

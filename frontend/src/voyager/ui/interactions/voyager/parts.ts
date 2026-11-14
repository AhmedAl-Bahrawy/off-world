export type PartId = 'antenna' | 'platform' | 'bus' | 'rtg' | 'boom' | 'record'
export type Mode = 'dark' | 'explore' | 'transit' | 'mars'

export interface Part {
  id: PartId
  label: string
  /** One short line. */
  fact: string
  icon: string
  /**
   * Hotspot position in the MODEL's own coordinate space (the NASA glTF
   * frame: +Y is up through the high-gain antenna, the science boom runs to
   * −Z and the RTG boom to +Z). The scene transforms it with the model, so
   * these values never need to know about scaling or orientation.
   */
  anchor: [number, number, number]
  /** Camera distance when focused. */
  dist: number
  /**
   * Vertical camera offset relative to the part. Negative looks up from
   * below, positive looks down from above — the dish is only readable from
   * above and the Golden Record only from below.
   */
  pitch: number
}

/**
 * The six components of Voyager 1, measured off the NASA model rather than
 * guessed: the antenna and record sit on the spin axis, the bus on its lower
 * prism, the scan platform at the end of the science boom, the RTGs at the
 * end of the generator boom and the magnetometer boom runs 12 m out.
 */
export const PARTS: Part[] = [
  {
    id: 'antenna',
    label: 'DISH · 3.7 m',
    fact: 'Talks to Earth.',
    icon: 'satellite-dish',
    anchor: [0, 1.3, 0],
    dist: 3.4,
    pitch: 3.1,
  },
  {
    id: 'platform',
    label: 'SCAN PLATFORM',
    fact: 'Cameras. Sensors.',
    icon: 'camera',
    anchor: [0, 0, -3.89],
    dist: 3.2,
    pitch: 0.3,
  },
  {
    id: 'bus',
    label: 'BUS',
    fact: 'Brains and electronics.',
    icon: 'cpu',
    anchor: [0.59, 0.41, 0.59],
    dist: 3.4,
    pitch: -0.2,
  },
  {
    id: 'rtg',
    label: '3 × RTG',
    fact: 'Heat becomes power.',
    icon: 'zap',
    anchor: [0, -0.09, 3.8],
    dist: 3.2,
    pitch: -0.1,
  },
  {
    id: 'boom',
    label: 'MAGNETOMETER',
    fact: 'Long boom. Clean signal.',
    icon: 'magnet',
    anchor: [0.05, 3.3, 7.3],
    dist: 3.6,
    pitch: 0.6,
  },
  {
    id: 'record',
    label: 'GOLDEN RECORD',
    fact: 'A portrait of Earth.',
    icon: 'disc-3',
    anchor: [0, 0.69, 0],
    dist: 2.5,
    pitch: -1.5,
  },
]

export const RECORD_CHIPS = [
  { icon: 'image', label: '115' },
  { icon: 'message-circle', label: '55' },
  { icon: 'audio-waveform', label: 'EARTH' },
  { icon: 'music', label: '90′' },
]

/** Mutable bridge between the React UI and the render loop (no re-renders). */
export interface Ctl {
  mode: Mode
  /** 0..1 power while holding the charge ring. */
  power: number
  /** Part currently focused (camera is on it). */
  focus: PartId | null
  /** Hovered part (3D or DOM). */
  hover: PartId | null
  hotEls: Partial<Record<PartId, HTMLElement | null>>
  marsPin: HTMLElement | null
}

export interface SceneApi {
  focus: (id: PartId) => void
  overview: () => void
  toMars: (onArrive: () => void) => void
}

export const makeCtl = (): Ctl => ({
  mode: 'dark',
  power: 0,
  focus: null,
  hover: null,
  hotEls: {},
  marsPin: null,
})

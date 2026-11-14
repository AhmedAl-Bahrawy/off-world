export type PartId = 'antenna' | 'platform' | 'bus' | 'rtg' | 'boom' | 'record'
export type Mode = 'dark' | 'explore' | 'transit' | 'mars'

export interface Part {
  id: PartId
  label: string
  /** One short line. */
  fact: string
  icon: string
  /** Hotspot position in Voyager-local space. */
  anchor: [number, number, number]
  /** Camera distance when focused. */
  dist: number
}

export const PARTS: Part[] = [
  { id: 'antenna', label: 'DISH · 3.7 m', fact: 'Talks to Earth.', icon: 'satellite-dish', anchor: [0.9, 1.5, 0.9], dist: 6.5 },
  { id: 'platform', label: 'SCAN PLATFORM', fact: 'Cameras. Sensors.', icon: 'camera', anchor: [-2.5, 0.1, 0], dist: 4.8 },
  { id: 'bus', label: 'BUS', fact: 'Brains and electronics.', icon: 'cpu', anchor: [0.2, 0.55, -0.85], dist: 4.6 },
  { id: 'rtg', label: '3 × RTG', fact: 'Heat becomes power.', icon: 'zap', anchor: [3.1, 0.1, 0], dist: 5.2 },
  { id: 'boom', label: 'MAGNETOMETER', fact: 'Long boom. Clean signal.', icon: 'magnet', anchor: [-1.7, -0.2, -4.0], dist: 6.2 },
  { id: 'record', label: 'GOLDEN RECORD', fact: 'A portrait of Earth.', icon: 'disc-3', anchor: [0, 0.15, 1.05], dist: 4.2 },
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
  /** 0..1 record sliding out of its cover. */
  recordOut: number
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
  recordOut: 0,
  hotEls: {},
  marsPin: null,
})

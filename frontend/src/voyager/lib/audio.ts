/**
 * WebAudio engine for the Off-World experience.
 *
 * Design:
 *  - ONE AudioContext for the whole session, created lazily on the first
 *    user gesture and reused for every replay (a context per replay used to
 *    leak oscillators until the browser's ~6-context cap silently killed all
 *    audio).
 *  - Four buses — ambience, ui, transition, narrative — under a master gain,
 *    so a single mute/volume control governs everything.
 *  - Real CC0 space ambience (vendored in /public/assets/audio) is layered
 *    over a synthesised drone; if a file fails to load the drone carries the
 *    scene on its own and nothing breaks.
 *  - Interface sounds are synthesised: they are short, need to be
 *    sample-accurate and cost no download.
 *
 * Everything is wrapped in try/catch: audio is optional, never fatal.
 */

type Bus = 'ambience' | 'ui' | 'transition' | 'narrative'

const BUS_LEVEL: Record<Bus, number> = {
  ambience: 0.5,
  ui: 0.85,
  transition: 0.9,
  narrative: 0.9,
}

const AUDIO = {
  wind: '/assets/audio/ambience/space-wind.ogg',
  voyage: '/assets/audio/ambience/voyage-bed.ogg',
}

let actx: AudioContext | null = null
let master: GainNode | null = null
const buses: Partial<Record<Bus, GainNode>> = {}

let muted = false
let started = false

const buffers = new Map<string, AudioBuffer>()
const loading = new Map<string, Promise<AudioBuffer | null>>()
const lastCue = new Map<string, number>()

let ambienceSource: AudioBufferSourceNode | null = null
let voyageSource: AudioBufferSourceNode | null = null
let droneNodes: AudioNode[] = []
let noiseBuffer: AudioBuffer | null = null

/* ------------------------------------------------------------------ */
/* Context & graph                                                     */
/* ------------------------------------------------------------------ */

function ensureContext(): AudioContext | null {
  if (actx) return actx
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!Ctor) return null
    actx = new Ctor()

    master = actx.createGain()
    master.gain.value = muted ? 0 : 1
    master.connect(actx.destination)

    for (const key of Object.keys(BUS_LEVEL) as Bus[]) {
      const g = actx.createGain()
      g.gain.value = BUS_LEVEL[key]
      g.connect(master)
      buses[key] = g
    }

    // Two seconds of white noise, reused by every noise-based effect.
    const len = Math.floor(actx.sampleRate * 2)
    noiseBuffer = actx.createBuffer(1, len, actx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    let seed = 12345
    for (let i = 0; i < len; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      data[i] = (seed / 0x3fffffff - 1) * 0.6
    }
    return actx
  } catch {
    actx = null
    master = null
    return null
  }
}

function bus(name: Bus): GainNode | null {
  return buses[name] ?? null
}

/* ------------------------------------------------------------------ */
/* Buffers                                                             */
/* ------------------------------------------------------------------ */

function loadBuffer(url: string): Promise<AudioBuffer | null> {
  const cached = buffers.get(url)
  if (cached) return Promise.resolve(cached)
  const inFlight = loading.get(url)
  if (inFlight) return inFlight

  const ctx = ensureContext()
  if (!ctx) return Promise.resolve(null)

  const p = fetch(url)
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
    .then((buf) => ctx.decodeAudioData(buf))
    .then((decoded) => {
      buffers.set(url, decoded)
      loading.delete(url)
      return decoded
    })
    .catch(() => {
      loading.delete(url)
      return null
    })

  loading.set(url, p)
  return p
}
/* ------------------------------------------------------------------ */
/* Ambience                                                            */
/* ------------------------------------------------------------------ */

/**
 * The bed under the whole experience: the real CC0 space-wind loop plus a
 * low synthesised drone that keeps the floor under the mix even before the
 * file has finished downloading.
 */
function startAmbience() {
  const ctx = ensureContext()
  if (!ctx) return
  const out = bus('ambience')
  if (!out) return

  if (!droneNodes.length) {
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 180
    filter.Q.value = 0.8

    const gain = ctx.createGain()
    gain.gain.value = 0.05
    filter.connect(gain)
    gain.connect(out)

    for (const f of [46, 69.3, 92.5]) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      const g = ctx.createGain()
      g.gain.value = f === 46 ? 0.9 : 0.32
      osc.connect(g)
      g.connect(filter)
      osc.start()
      droneNodes.push(osc, g)
    }

    // A breath of filtered noise so the bed is not perfectly static.
    if (noiseBuffer) {
      const src = ctx.createBufferSource()
      src.buffer = noiseBuffer
      src.loop = true
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 420
      bp.Q.value = 0.7
      const g = ctx.createGain()
      g.gain.value = 0.035
      src.connect(bp)
      bp.connect(g)
      g.connect(out)
      src.start()
      droneNodes.push(src, bp, g)
    }
  }

  if (!ambienceSource) {
    void loadBuffer(AUDIO.wind).then((buf) => {
      if (!buf || !actx || ambienceSource) return
      const src = actx.createBufferSource()
      src.buffer = buf
      src.loop = true
      const g = actx.createGain()
      g.gain.value = 0
      src.connect(g)
      g.connect(bus('ambience')!)
      src.start()
      g.gain.setTargetAtTime(0.34, actx.currentTime, 1.6)
      ambienceSource = src
    })
  }

  out.gain.setTargetAtTime(BUS_LEVEL.ambience, ctx.currentTime, 0.8)
}

/** Fade the ambience bed out (used when the player returns to the title). */
export function stopAmbience() {
  const ctx = actx
  const out = bus('ambience')
  if (!ctx || !out) return
  out.gain.setTargetAtTime(0, ctx.currentTime, 0.4)
}

/** The voyage bed only plays while the ship is actually travelling. */
export function setVoyageBed(on: boolean) {
  const ctx = ensureContext()
  if (!ctx) return
  const out = bus('ambience')
  if (!out) return

  if (on && !voyageSource) {
    void loadBuffer(AUDIO.voyage).then((buf) => {
      if (!buf || !actx || voyageSource) return
      const src = actx.createBufferSource()
      src.buffer = buf
      src.loop = true
      const g = actx.createGain()
      g.gain.value = 0
      src.connect(g)
      g.connect(bus('ambience')!)
      src.start()
      g.gain.setTargetAtTime(0.5, actx.currentTime, 2.4)
      voyageSource = src
    })
  } else if (!on && voyageSource) {
    const src = voyageSource
    voyageSource = null
    const ctx = actx
    if (!ctx) return
    try {
      const g = ctx.createGain()
      g.gain.value = 1
      g.connect(bus('ambience')!)
      g.gain.setTargetAtTime(0, ctx.currentTime, 0.6)
      setTimeout(() => {
        try {
          src.stop()
          src.disconnect()
          g.disconnect()
        } catch {
          /* already stopped */
        }
      }, 2200)
    } catch {
      /* ignore */
    }
  }
}

/* ------------------------------------------------------------------ */
/* Public controls                                                     */
/* ------------------------------------------------------------------ */

/** Start (or resume) the soundscape. Must be called from a user gesture. */
export function startAudio() {
  try {
    const ctx = ensureContext()
    if (!ctx) return
    if (ctx.state === 'suspended') void ctx.resume()
    if (!started) {
      started = true
      startAmbience()
    } else {
      bus('ambience')?.gain.setTargetAtTime(BUS_LEVEL.ambience, ctx.currentTime, 0.8)
    }
  } catch {
    actx = null
  }
}

/** Fully stop the soundscape (used on replay so the next run starts clean). */
export function stopAudio() {
  try {
    void actx?.close()
  } catch {
    /* ignore */
  }
  actx = null
  master = null
  for (const key of Object.keys(buses) as Bus[]) delete buses[key]
  ambienceSource = null
  voyageSource = null
  droneNodes = []
  started = false
}

export function isMuted() {
  return muted
}

/** Mute/unmute the whole experience (everything, including the ambience). */
export function setMuted(next: boolean) {
  muted = next
  if (master && actx) {
    try {
      master.gain.setTargetAtTime(muted ? 0 : 1, actx.currentTime, 0.05)
    } catch {
      /* ignore */
    }
  }
}

/* ------------------------------------------------------------------ */
/* Synthesised cues                                                    */
/* ------------------------------------------------------------------ */

/** Short UI blip at `fr` Hz. */
export function blip(fr = 600, v = 0.04) {
  const ctx = actx
  if (!ctx || muted) return
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const t = ctx.currentTime
    osc.type = 'square'
    osc.frequency.setValueAtTime(fr, t)
    gain.gain.setValueAtTime(v, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11)
    osc.connect(gain)
    gain.connect(bus('ui')!)
    osc.start()
    osc.stop(t + 0.12)
  } catch {
    /* ignore */
  }
}

/** Two-tone confirmation used by choices and discovered components. */
export function confirm() {
  const ctx = actx
  if (!ctx || muted) return
  try {
    const t = ctx.currentTime
    for (const [i, f] of [660, 990].entries()) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0, t + i * 0.07)
      gain.gain.linearRampToValueAtTime(0.05, t + i * 0.07 + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.22)
      osc.connect(gain)
      gain.connect(bus('ui')!)
      osc.start(t + i * 0.07)
      osc.stop(t + i * 0.07 + 0.24)
    }
  } catch {
    /* ignore */
  }
}

/** Low impact used when a system fails or a chapter turns dark. */
export function impact() {
  const ctx = actx
  if (!ctx || muted || !noiseBuffer) return
  try {
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(900, t)
    lp.frequency.exponentialRampToValueAtTime(90, t + 0.8)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.16, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
    src.connect(lp)
    lp.connect(gain)
    gain.connect(bus('transition')!)
    src.start(t)
    src.stop(t + 1)

    const osc = ctx.createOscillator()
    const og = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(90, t)
    osc.frequency.exponentialRampToValueAtTime(36, t + 0.7)
    og.gain.setValueAtTime(0.14, t)
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.8)
    osc.connect(og)
    og.connect(bus('transition')!)
    osc.start(t)
    osc.stop(t + 0.85)
  } catch {
    /* ignore */
  }
}

/**
 * A rising sweep that marks a chapter change or a scene reveal.
 * `to` is the top frequency in Hz.
 */
export function riser(to = 900, seconds = 1.6) {
  const ctx = actx
  if (!ctx || muted) return
  try {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(160, t)
    filter.frequency.exponentialRampToValueAtTime(to * 1.6, t + seconds)
    filter.Q.value = 1.6
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(70, t)
    osc.frequency.exponentialRampToValueAtTime(to, t + seconds)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.07, t + seconds * 0.75)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + seconds)
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(bus('transition')!)
    osc.start(t)
    osc.stop(t + seconds + 0.05)
  } catch {
    /* ignore */
  }
}

/**
 * The distress transmission: the classic beacon pattern, heard as a short
 * arithmetic series of pings that climbs before the message goes out.
 */
export function transmissionBeeps(count = 8) {
  const ctx = actx
  if (!ctx || muted) return
  try {
    const t0 = ctx.currentTime
    for (let i = 0; i < count; i++) {
      const t = t0 + i * 0.26
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 420 + i * 58
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.075, t + 0.012)
      gain.gain.setValueAtTime(0.075, t + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
      osc.connect(gain)
      gain.connect(bus('narrative')!)
      osc.start(t)
      osc.stop(t + 0.22)
    }
  } catch {
    /* ignore */
  }
}

/** The drive spinning up: a rising tone under filtered noise. */
export function driveSpinUp(seconds = 2.4) {
  const ctx = actx
  if (!ctx || muted || !noiseBuffer) return
  try {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(48, t)
    osc.frequency.exponentialRampToValueAtTime(320, t + seconds)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.05, t + seconds * 0.8)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + seconds)
    osc.connect(gain)
    gain.connect(bus('narrative')!)
    osc.start(t)
    osc.stop(t + seconds + 0.05)

    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.setValueAtTime(300, t)
    bp.frequency.exponentialRampToValueAtTime(2600, t + seconds)
    bp.Q.value = 3
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0.0001, t)
    ng.gain.exponentialRampToValueAtTime(0.03, t + seconds * 0.6)
    ng.gain.exponentialRampToValueAtTime(0.0001, t + seconds)
    src.connect(bp)
    bp.connect(ng)
    ng.connect(bus('narrative')!)
    src.start(t)
    src.stop(t + seconds + 0.05)
  } catch {
    /* ignore */
  }
}

/**
 * Named cues. Repeats of the same cue inside `cooldown` are dropped, so a
 * burst of clicks can never stack into a wall of sound.
 */
export function cue(name: string, cooldown = 0.06) {
  if (!actx || muted) return
  const now = actx.currentTime
  const last = lastCue.get(name) ?? -Infinity
  if (now - last < cooldown) return
  lastCue.set(name, now)

  switch (name) {
    case 'chapter':
      riser(760, 1.5)
      break
    case 'dark':
      impact()
      break
    case 'confirm':
      confirm()
      break
    case 'transmission':
      transmissionBeeps()
      break
    case 'drive':
      driveSpinUp()
      break
    case 'discover':
      riser(1400, 1.1)
      break
    case 'ui':
      blip(880, 0.03)
      break
    default:
      blip(660, 0.03)
  }
}

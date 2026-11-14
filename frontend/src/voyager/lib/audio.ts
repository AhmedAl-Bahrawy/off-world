/**
 * WebAudio: a low engine hum plus short square-wave UI blips.
 *
 * One AudioContext is created lazily and reused for the whole session —
 * creating a new context per replay used to leak oscillators until the
 * browser's ~6-context cap silently killed all audio. Everything is
 * wrapped in try/catch: audio is optional, never fatal.
 */

let actx: AudioContext | null = null
let humGain: GainNode | null = null
let muted = false

/** Start (or resume) the ambient hum. Must be called from a user gesture. */
export function startAudio() {
  try {
    if (!actx) {
      actx = new AudioContext()
      const filter = actx.createBiquadFilter()
      humGain = actx.createGain()
      filter.frequency.value = 160
      humGain.gain.value = 0.03
      filter.connect(humGain)
      humGain.connect(actx.destination)
      for (const f of [55, 82.4]) {
        const osc = actx.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.value = f
        osc.connect(filter)
        osc.start()
      }
    }
    if (actx.state === 'suspended') void actx.resume()
  } catch {
    actx = null
    humGain = null
  }
}

/** Fully stop the hum (used on replay so the next run starts clean). */
export function stopAudio() {
  try {
    void actx?.close()
  } catch {
    /* ignore */
  }
  actx = null
  humGain = null
}

export function isMuted() {
  return muted
}

/** Mute/unmute the whole experience (hum + blips). */
export function setMuted(next: boolean) {
  muted = next
  if (humGain && actx) {
    try {
      humGain.gain.setTargetAtTime(muted ? 0 : 0.03, actx.currentTime, 0.05)
    } catch {
      /* ignore */
    }
  }
}

/** Short UI blip at `fr` Hz. */
export function blip(fr = 600, v = 0.04) {
  if (!actx || muted) return
  try {
    const osc = actx.createOscillator()
    const gain = actx.createGain()
    const t = actx.currentTime
    osc.type = 'square'
    osc.frequency.value = fr
    gain.gain.setValueAtTime(v, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
    osc.connect(gain)
    gain.connect(actx.destination)
    osc.start()
    osc.stop(t + 0.13)
  } catch {
    /* ignore */
  }
}

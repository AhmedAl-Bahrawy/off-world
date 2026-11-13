/**
 * WebAudio: a low engine hum plus short square-wave UI blips.
 * Everything is wrapped in try/catch — audio is optional, never fatal.
 */

let actx: AudioContext | null = null

/** Start the ambient hum. Must be called from a user gesture. */
export function startAudio() {
  try {
    actx = new AudioContext()
    const filter = actx.createBiquadFilter()
    const gain = actx.createGain()
    filter.frequency.value = 160
    gain.gain.value = 0.03
    filter.connect(gain)
    gain.connect(actx.destination)
    for (const f of [55, 82.4]) {
      const osc = actx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = f
      osc.connect(filter)
      osc.start()
    }
  } catch {
    /* no audio available — stay silent */
  }
}

/** Short UI blip at `fr` Hz. */
export function blip(fr = 600, v = 0.04) {
  if (!actx) return
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

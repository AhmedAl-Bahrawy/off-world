import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useKalamith } from '../state/store'
import { startAudio, blip } from '../lib/audio'
import { RM } from '../lib/motion'

/**
 * Entry screen ("A MESSAGE FROM EARTH"). Click or Enter starts the experience:
 * boots the audio engine, fades the gate out, flips the phase to "playing".
 */
export function Gate() {
  const [leaving, setLeaving] = useState(false)
  const leavingRef = useRef(false)

  const start = () => {
    if (leavingRef.current) return
    leavingRef.current = true
    startAudio()
    blip(660)
    setLeaving(true)
    setTimeout(() => useKalamith.getState().startGame(), 900)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') start()
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  // Entrance: children rise into place.
  useEffect(() => {
    if (RM) return
    gsap.from('.kx-gate > *', {
      y: 34,
      opacity: 0,
      stagger: 0.12,
      duration: 1,
      ease: 'power3.out',
    })
  }, [])

  return (
    <div
      className="kx-gate"
      style={leaving ? { opacity: 0, pointerEvents: 'none' } : undefined}
    >
      <small>A MESSAGE FROM EARTH</small>
      <span className="ln" />
      <h1>KALAMITH</h1>
      <p>The last signal of humanity. Sound on.</p>
      <button className="open" onClick={start}>
        <span>CLICK</span>
        <span>TO OPEN</span>
      </button>
      <div className="kx-enter">PRESS ENTER</div>
    </div>
  )
}

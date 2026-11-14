import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { RM } from '../lib/motion'

type GateProps = { onStart: () => void }

/** Minimal Voyager mission welcome; entry is also available from the nav. */
export function Gate({ onStart }: GateProps) {
  // Leaving/starting are local: a replay remounts the gate (keyed by
  // generation), so both reset without any effect bookkeeping.
  const [leaving, setLeaving] = useState(false)
  const [starting, setStarting] = useState(false)
  const onStartRef = useRef(onStart)

  useEffect(() => {
    onStartRef.current = onStart
  }, [onStart])

  const start = () => {
    if (starting) return
    setStarting(true)
    setLeaving(true)
    onStartRef.current()
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        // Never hijack keys aimed at an interactive element.
        const target = event.target as HTMLElement | null
        if (target?.closest('button, a, input, textarea, select')) return
        event.preventDefault()
        onStartRef.current()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (RM) return
    const ctx = gsap.context(() => {
      gsap.from('.kx-gate > *', {
        y: 24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main id="home" className={`kx-gate ${leaving ? 'leaving' : ''}`} aria-label="Voyager mission introduction">
      <div className="hero-copy">
        <p className="eyebrow">OFF-WORLD TRANSMISSION · 2231</p>
        <h1>VOYAGER</h1>
        <p className="hero-subtitle">A signal from the edge of silence.</p>
        <button className="open" type="button" onClick={start}>
          ENTER THE MISSION <span aria-hidden="true">↗</span>
        </button>
        <p className="entry-hint">CLICK TO BEGIN <span>·</span> OR PRESS ENTER</p>
      </div>
      <div className="hero-index" aria-hidden="true"><span>01</span><i /><span>05</span></div>
    </main>
  )
}

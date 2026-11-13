import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { RM } from '../lib/motion'

type GateProps = { leaving: boolean; onStart: () => void }

/** Minimal Voyager mission welcome; entry is also available from the nav. */
export function Gate({ leaving, onStart }: GateProps) {
  const startRef = useRef(onStart)
  startRef.current = onStart

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (event.target instanceof HTMLButtonElement) return
        event.preventDefault()
        startRef.current()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (RM) return
    const ctx = gsap.context(() => {
      gsap.from('.kx-gate > *', {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.85,
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
        <button className="open" type="button" onClick={onStart}>
          ENTER THE MISSION <span aria-hidden="true">↗</span>
        </button>
        <p className="entry-hint">CLICK TO BEGIN <span>·</span> OR PRESS ENTER</p>
      </div>
      <div className="hero-index" aria-hidden="true"><span>01</span><i /><span>05</span></div>
    </main>
  )
}

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useVoyager } from '../state/store'
import { STAGES } from '../story/dialogue'
import { RM } from '../lib/motion'

type GateProps = { onStart: () => void }

/** Mission telemetry shown on the welcome screen. */
const TELEMETRY = [
  { label: 'DESTINATION', value: 'PROXIMA CENTAURI b' },
  { label: 'DISTANCE', value: '4.24 LY' },
  { label: 'ORIGIN', value: 'EARTH · 2231' },
]

/**
 * The welcome screen. It states what the mission is, how long it runs and
 * whether the scene behind it is ready — so the player never enters blind and
 * never waits on an unexplained load.
 */
export function Gate({ onStart }: GateProps) {
  // Leaving/starting are local: a replay remounts the gate (keyed by
  // generation), so both reset without any effect bookkeeping.
  const [leaving, setLeaving] = useState(false)
  const [starting, setStarting] = useState(false)
  const onStartRef = useRef(onStart)
  const ready = useVoyager((s) => s.ready)

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
      gsap.from('.kx-gate .tele-row', {
        x: -10,
        opacity: 0,
        stagger: 0.06,
        delay: 0.22,
        duration: 0.5,
        ease: 'power2.out',
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main
      id="home"
      className={`kx-gate ${leaving ? 'leaving' : ''}`}
      aria-label="Voyager mission introduction"
    >
      <div className="hero-copy">
        <p className="eyebrow">OFF-WORLD · DEEP SPACE NETWORK · 2231</p>
        <h1>VOYAGER</h1>
        <p className="hero-subtitle">
          Humanity called out for help. Something answered. It is now four light-years
          from a world that has stopped answering.
        </p>

        <dl className="tele">
          {TELEMETRY.map((t) => (
            <div className="tele-row" key={t.label}>
              <dt>{t.label}</dt>
              <dd>{t.value}</dd>
            </div>
          ))}
          <div className="tele-row">
            <dt>ARRAY</dt>
            <dd className={ready ? 'ok' : 'wait'}>
              {ready ? 'LOCKED · READY' : 'CALIBRATING…'}
            </dd>
          </div>
        </dl>

        <button className="open" type="button" onClick={start}>
          ENTER THE MISSION <span aria-hidden="true">↗</span>
        </button>
        <p className="entry-hint">
          CLICK TO BEGIN <span>·</span> OR PRESS ENTER
        </p>
      </div>

      <div className="hero-index" aria-label="Mission structure">
        <ol className="hero-stages">
          {STAGES.map((s, i) => (
            <li key={s}>
              <span className="hero-stage-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="hero-stage-t">{s}</span>
            </li>
          ))}
        </ol>
        <p className="hero-note">7 SEGMENTS · APPROX. 12 MIN</p>
      </div>
    </main>
  )
}

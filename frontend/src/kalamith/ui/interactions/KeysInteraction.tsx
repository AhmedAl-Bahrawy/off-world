import { useRef, useState } from 'react'
import gsap from 'gsap'
import { finishAct } from '../../state/interactions'
import { blip } from '../../lib/audio'
import { RM } from '../../lib/motion'
import { Icon } from '../Icons'

/**
 * Key authorization: both keys must be turned within 1.5 s of each other.
 * Synchronizing them spins the keys and resolves the interaction.
 */
export function KeysInteraction() {
  const westKey = useRef<HTMLButtonElement>(null)
  const eastKey = useRef<HTMLButtonElement>(null)
  const firstTurn = useRef<{ i: number; at: number } | null>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [lit, setLit] = useState<number[]>([])
  const [hint, setHint] = useState('')

  const press = (i: number) => {
    blip(520)
    const now = performance.now()
    const first = firstTurn.current

    // Both keys turned in time → synchronized.
    if (first && first.i !== i && now - first.at < 1500) {
      clearTimeout(resetTimer.current)
      setLit([0, 1])
      blip(900)
      if (!RM) {
        gsap.fromTo(
          [westKey.current, eastKey.current],
          { rotationY: 0 },
          { rotationY: 360, duration: 0.9, ease: 'power2.inOut', stagger: 0.1 },
        )
      }
      setHint('KEYS SYNCHRONIZED')
      setTimeout(() => finishAct(), 800)
      return
    }

    firstTurn.current = { i, at: now }
    setLit((cur) => (cur.includes(i) ? cur : [...cur, i]))
    setHint('One key turned. Turn the other now.')

    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => {
      firstTurn.current = null
      setLit([])
      setHint('Window closed. Try again.')
    }, 1500)
  }

  return (
    <>
      <p className="q">Turn both keys within 1.5 seconds of each other.</p>
      <div className="row">
        <button
          ref={westKey}
          className={`tile ${lit.includes(0) ? 'lit' : ''}`}
          style={{ '--c': 'var(--bl)' } as React.CSSProperties}
          onClick={() => press(0)}
        >
          <Icon name="key" />
          <span>WEST KEY</span>
        </button>
        <button
          ref={eastKey}
          className={`tile ${lit.includes(1) ? 'lit' : ''}`}
          style={{ '--c': 'var(--or)' } as React.CSSProperties}
          onClick={() => press(1)}
        >
          <Icon name="key" />
          <span>EAST KEY</span>
        </button>
      </div>
      <p className="hint">{hint}</p>
    </>
  )
}

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { finishAct } from '../../state/interactions'
import { blip } from '../../lib/audio'
import { RM } from '../../lib/motion'
import { useTimeout } from '../../lib/hooks'
import { ActLayout, ActRow, Tile } from '../primitives'

/**
 * Key authorization: both keys must be turned within three seconds.
 * Synchronizing them spins the keys and resolves the interaction.
 */

/** The single source of truth for the time window, used by logic and copy. */
const WINDOW_MS = 3000

export function KeysInteraction() {
  const westKey = useRef<HTMLButtonElement>(null)
  const eastKey = useRef<HTMLButtonElement>(null)
  const firstTurn = useRef<{ i: number; at: number } | null>(null)
  const finish = useTimeout()
  const [lit, setLit] = useState<number[]>([])
  const [hint, setHint] = useState('')

  const press = (i: number) => {
    blip(520)
    const now = performance.now()
    const first = firstTurn.current

    // Both keys turned in time → synchronized.
    if (first && first.i !== i && now - first.at < WINDOW_MS) {
      setLit([0, 1])
      blip(900)
      if (!RM) {
        gsap.fromTo(
          [westKey.current, eastKey.current],
          { rotationY: 0 },
          { rotationY: 360, duration: 0.8, ease: 'power2.inOut', stagger: 0.1 },
        )
      }
      setHint('KEYS SYNCHRONIZED')
      finish(() => finishAct(), 700)
      return
    }

    firstTurn.current = { i, at: now }
    setLit((cur) => (cur.includes(i) ? cur : [...cur, i]))
    setHint('One key turned. Turn the other now.')

    finish(() => {
      firstTurn.current = null
      setLit([])
      setHint('Window closed. Try again.')
    }, WINDOW_MS)
  }

  return (
    <ActLayout question={`Turn both keys within ${WINDOW_MS / 1000} seconds.`} hint={hint}>
      <ActRow>
        <Tile
          icon="key"
          label="WEST KEY"
          on={lit.includes(0)}
          pressed={lit.includes(0)}
          accent="bl"
          buttonRef={westKey}
          onClick={() => press(0)}
        />
        <Tile
          icon="key"
          label="EAST KEY"
          on={lit.includes(1)}
          pressed={lit.includes(1)}
          accent="or"
          buttonRef={eastKey}
          onClick={() => press(1)}
        />
      </ActRow>
    </ActLayout>
  )
}

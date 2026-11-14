import { useEffect, useRef, useState } from 'react'
import { finishAct } from '../../state/interactions'
import { blip } from '../../lib/audio'
import { sleep } from '../../lib/util'
import { useTimeout } from '../../lib/hooks'
import { ActLayout, ActRow, Tile } from '../primitives'

/**
 * Simon-style vault breach: watch the access sequence flash, then repeat it.
 * A wrong press replays the sequence; completing it resolves the interaction.
 */
const PADS: Array<{ icon: string; name: string }> = [
  { icon: 'user', name: 'personnel' },
  { icon: 'net', name: 'network' },
  { icon: 'power', name: 'power' },
  { icon: 'chip', name: 'core' },
]
const SEQUENCE_LENGTH = 4

type Phase = 'watch' | 'input' | 'won'

export function SimonInteraction() {
  const [sequence] = useState(
    () => Array.from({ length: SEQUENCE_LENGTH }, () => (Math.random() * 4) | 0),
  )
  const [phase, setPhase] = useState<Phase>('watch')
  const [lit, setLit] = useState<number | null>(null)
  const [hint, setHint] = useState('')
  const progress = useRef(0)
  const unmounted = useRef(false)
  const finish = useTimeout()

  useEffect(() => () => {
    unmounted.current = true
  }, [])

  /**
   * Plays the guard sequence. `cancelled` lets stale playbacks (from
   * StrictMode remounts or a replay after a wrong press) abort themselves.
   */
  function play(cancelled: () => boolean = () => unmounted.current) {
    setPhase('watch')
    progress.current = 0
    setHint('Watching the guard rotation...')
    ;(async () => {
      await sleep(450)
      for (const i of sequence) {
        if (cancelled()) return
        setLit(i)
        blip(300 + i * 120)
        await sleep(350)
        if (cancelled()) return
        setLit(null)
        await sleep(150)
      }
      if (cancelled()) return
      setHint('Your turn.')
      setPhase('input')
    })()
  }

  // Start the first playback after mount; abort it on unmount.
  useEffect(() => {
    let cancelled = false
    const t = setTimeout(() => play(() => cancelled || unmounted.current), 0)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const press = (i: number) => {
    if (phase !== 'input') return
    blip(300 + i * 120)
    setLit(i)
    finish(() => setLit((cur) => (cur === i ? null : cur)), 150)

    if (i !== sequence[progress.current]) {
      setHint('Wrong. Replaying...')
      play()
      return
    }
    if (++progress.current === SEQUENCE_LENGTH) {
      setPhase('won')
      setHint('ACCESS GRANTED')
      finish(() => finishAct(), 650)
    }
  }

  return (
    <ActLayout question="Memorize the access sequence, then repeat it." hint={hint}>
      <ActRow>
        {PADS.map((pad, i) => (
          <Tile
            key={pad.icon}
            icon={pad.icon}
            on={lit === i}
            ariaLabel={`Vault pad ${i + 1} — ${pad.name}`}
            onClick={() => press(i)}
          />
        ))}
      </ActRow>
    </ActLayout>
  )
}

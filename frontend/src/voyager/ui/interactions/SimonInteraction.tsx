import { useEffect, useRef, useState } from 'react'
import { finishAct } from '../../state/interactions'
import { blip } from '../../lib/audio'
import { sleep } from '../../lib/util'
import { Icon } from '../Icons'

/**
 * Simon-style vault breach: watch the access sequence flash, then repeat it.
 * A wrong press replays the sequence; completing it resolves the interaction.
 */
const PAD_ICONS = ['user', 'net', 'power', 'chip']
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
      await sleep(500)
      for (const i of sequence) {
        if (cancelled()) return
        setLit(i)
        blip(300 + i * 120)
        await sleep(380)
        if (cancelled()) return
        setLit(null)
        await sleep(160)
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
    setTimeout(() => setLit((cur) => (cur === i ? null : cur)), 150)

    if (i !== sequence[progress.current]) {
      setHint('Wrong. Replaying...')
      play()
      return
    }
    if (++progress.current === SEQUENCE_LENGTH) {
      setPhase('won')
      setHint('ACCESS GRANTED')
      setTimeout(() => finishAct(), 700)
    }
  }

  return (
    <>
      <p className="q">Memorize the access sequence, then repeat it.</p>
      <div className="row">
        {PAD_ICONS.map((icon, i) => (
          <button
            key={icon}
            className={`tile ${lit === i ? 'lit' : ''}`}
            onClick={() => press(i)}
          >
            <Icon name={icon} />
          </button>
        ))}
      </div>
      <p className="hint">{hint}</p>
    </>
  )
}

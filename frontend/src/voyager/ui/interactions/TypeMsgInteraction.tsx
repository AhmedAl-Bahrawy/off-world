import { useEffect, useRef, useState } from 'react'
import { finishAct, type TypeMsgProps } from '../../state/interactions'
import { useVoyager } from '../../state/store'
import { bus } from '../../lib/bus'
import { blip } from '../../lib/audio'
import { sleep } from '../../lib/util'
import { useTimeout } from '../../lib/hooks'
import { ActLayout, ActRow } from '../primitives'

/**
 * Open-channel composer: any key or tap reveals the plaintext distress
 * message character by character. When complete, fires the pulse rings and
 * plays the uplink sequence before resolving.
 */
export function TypeMsgInteraction({ message }: TypeMsgProps) {
  const [typed, setTyped] = useState(0)
  const sentRef = useRef(false)
  const finish = useTimeout()

  const transmit = async () => {
    const store = useVoyager.getState()
    store.closeWindow('act')
    store.closeWindow('chat')
    bus.emit('pulse')
    store.openWindow({
      id: 'up',
      slot: 'c',
      title: 'UPLINK',
      icon: 'sig',
      accent: 'cy',
      kind: 'uplink',
    })
    await sleep(100) // let the uplink bar's own transition kick in
    await sleep(2300)
    store.closeWindow('up')
    finishAct()
  }

  // Any key — or a tap anywhere outside the fallback button — advances the
  // composition one character. (Touch users previously could only use the
  // button because the pointer half of "any key/tap" was never wired up.)
  useEffect(() => {
    const advance = () =>
      setTyped((n) => (n < message.length ? Math.min(message.length, n + 1) : n))
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.key === 'Tab') return
      // Space/Enter on the fallback button trigger its click; don't double-step.
      if ((e.key === ' ' || e.key === 'Enter') && e.target instanceof HTMLButtonElement) return
      advance()
    }
    const onPointer = (e: PointerEvent) => {
      if ((e.target as HTMLElement | null)?.closest('button')) return
      advance()
    }
    addEventListener('keydown', onKey)
    addEventListener('pointerdown', onPointer)
    return () => {
      removeEventListener('keydown', onKey)
      removeEventListener('pointerdown', onPointer)
    }
  }, [message.length])

  // Blip per character (without re-render loops).
  const lastBlip = useRef(0)
  useEffect(() => {
    if (typed > lastBlip.current) {
      lastBlip.current = typed
      blip(300 + typed * 12, 0.03)
    }
  }, [typed])

  // Message fully typed → uplink sequence.
  useEffect(() => {
    if (typed < message.length) return
    finish(() => {
      if (sentRef.current) return
      sentRef.current = true
      void transmit()
    }, 650)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed])

  return (
    <ActLayout question="Plain English. No encryption.">
      <p className="msg" aria-live="polite">
        {message.slice(0, typed)}
      </p>
      <ActRow>
        <button type="button" onClick={() => setTyped(message.length)}>
          SEND SIGNAL
        </button>
      </ActRow>
    </ActLayout>
  )
}

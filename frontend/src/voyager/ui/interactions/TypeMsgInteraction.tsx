import { useEffect, useRef, useState } from 'react'
import { finishAct, type TypeMsgProps } from '../../state/interactions'
import { useVoyager } from '../../state/store'
import { bus } from '../../lib/bus'
import { blip } from '../../lib/audio'
import { sleep } from '../../lib/util'

/**
 * Open-channel composer: any key/tap reveals the plaintext distress message
 * character by character. When complete, fires the pulse rings and plays the
 * uplink sequence before resolving.
 */
export function TypeMsgInteraction({ message }: TypeMsgProps) {
  const [typed, setTyped] = useState(0)
  const sentRef = useRef(false)

  async function transmit() {
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

  useEffect(() => {
    const onEvent = (e: KeyboardEvent | PointerEvent) => {
      if (
        e instanceof KeyboardEvent &&
        (e.metaKey || e.ctrlKey || e.key === 'Tab' || e.target instanceof HTMLButtonElement)
      )
        return
      setTyped((n) => Math.min(message.length, n + 1))
    }
    addEventListener('keydown', onEvent)
    return () => {
      removeEventListener('keydown', onEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    const t = setTimeout(() => {
      if (sentRef.current) return
      sentRef.current = true
      transmit()
    }, 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed])

  return (
    <>
      <p className="q">Plain English. No encryption.</p>
      <p className="msg">{message.slice(0, typed)}</p>
      <div className="row">
        <button type="button" onClick={() => setTyped(message.length)}>SEND SIGNAL</button>
      </div>
    </>
  )
}

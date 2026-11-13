import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import gsap from 'gsap'
import {
  useVoyager,
  type WinState,
  type BarRow,
  type ChatMsg,
} from '../state/store'
import {
  type AskProps,
  type DecodeProps,
  type TilesProps,
  type TypeMsgProps,
} from '../state/interactions'
import { blip } from '../lib/audio'
import { RM } from '../lib/motion'
import { resetStory } from '../story/script'
import { Icon } from './Icons'
import {
  TilesInteraction,
  AskInteraction,
  SimonInteraction,
  KeysInteraction,
  TypeMsgInteraction,
  DecodeInteraction,
  ChargeInteraction,
} from './interactions'

/**
 * HUD window system: fixed "terminal" panels with corner brackets, a glowing
 * header, and a scrollable body. Content is chosen by `win.kind`.
 *
 * Lifecycle mirrors the original demo — open with a spring-in animation,
 * close with a collapse animation, then unmount.
 */

/** The .wb scroll container of the current window, for auto-scrolling bodies. */
const BodyContext = createContext<HTMLDivElement | null>(null)

export function Windows() {
  const windows = useVoyager((s) => s.windows)
  return (
    <>
      {windows.map((win) => (
        // Keyed by seq: a replaced window (same id, new open) is a brand-new
        // mount, so its entrance animation and body always start fresh.
        <WindowFrame key={win.seq ?? win.id} win={win} />
      ))}
    </>
  )
}

function WindowFrame({ win }: { win: WinState }) {
  const root = useRef<HTMLDivElement>(null)
  const [bodyEl, setBodyEl] = useState<HTMLDivElement | null>(null)

  // Open animation. Context + revert keeps StrictMode's double effect from
  // snapshotting the already-collapsed inline scaleY/opacity as its "from".
  useEffect(() => {
    blip(880, 0.02)
    if (RM) return
    const el = root.current!
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, scaleY: 0.05, filter: 'brightness(3)' },
        {
          opacity: 1,
          scaleY: 1,
          filter: 'brightness(1)',
          duration: 0.45,
          ease: 'back.out(1.7)',
          clearProps: 'filter',
        },
      )
      const children = el.querySelector<HTMLElement>('.wb')?.children
      if (children?.length) {
        gsap.from(children, { x: -16, opacity: 0, stagger: 0.07, delay: 0.15, duration: 0.4 })
      }
    }, el)
    return () => ctx.revert()
  }, [])

  // Close animation, then self-removal. The seq guard stops a stale timer
  // from this window deleting a newer window that reused the same id.
  useEffect(() => {
    if (!win.closing) return
    if (RM) {
      useVoyager.getState().dropWindow(win.id, win.seq)
      return
    }
    gsap.to(root.current, {
      scaleY: 0.04,
      opacity: 0,
      filter: 'brightness(3)',
      duration: 0.3,
      ease: 'power2.in',
    })
    const t = setTimeout(
      () => useVoyager.getState().dropWindow(win.id, win.seq),
      320,
    )
    return () => clearTimeout(t)
  }, [win.closing, win.id, win.seq])

  return (
    <div
      ref={root}
      className={`w s-${win.slot} w-${win.id}`}
      style={{ '--c': `var(--${win.accent})` } as CSSProperties}
    >
      <div className="wh">
        <Icon name={win.icon} />
        <b>{win.title}</b>
        <i />
      </div>
      <div className="wb" ref={setBodyEl}>
        {bodyEl && (
          <BodyContext.Provider value={bodyEl}>
            <WindowBody win={win} />
          </BodyContext.Provider>
        )}
      </div>
    </div>
  )
}

function WindowBody({ win }: { win: WinState }) {
  switch (win.kind) {
    case 'log':
      return <LogBody />
    case 'chat':
      return <ChatBody />
    case 'bars':
      return <BarsBody rows={win.rows ?? []} />
    case 'act':
      return <ActionBody />
    case 'uplink':
      return <UplinkBody />
    case 'end':
      return <EndBody />
  }
}

/* ------------------------------------------------------------------ */
/* Bodies                                                              */
/* ------------------------------------------------------------------ */

/** Bottom transmission log — typed lines appear here via the story. */
function LogBody() {
  const lines = useVoyager((s) => s.log)
  return (
    <>
      {lines.map((l) => (
        <p key={l.id} className={l.cls}>
          {l.text}
        </p>
      ))}
    </>
  )
}

/** Right-hand comms feed with speaker names + auto scroll. */
function ChatBody() {
  const messages = useVoyager((s) => s.chat)
  const el = useContext(BodyContext)

  useEffect(() => {
    if (el) el.scrollTop = 1e9
  }, [messages, el])

  return (
    <>
      {messages.map((m) => (
        <ChatMessage key={m.id} msg={m} />
      ))}
    </>
  )
}

function ChatMessage({ msg }: { msg: ChatMsg }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (RM) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        x: msg.who === 'E' ? 50 : -50,
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: 'back.out(1.6)',
      })
    }, ref)
    return () => ctx.revert()
  }, [msg.who])

  return (
    <div ref={ref} className={`m ${msg.who}`}>
      <small>{SPEAKER_NAMES[msg.who]}</small>
      <span>
        {msg.text === null ? (
          <>
            <i />
            <i />
            <i />
          </>
        ) : (
          msg.text
        )}
      </span>
    </div>
  )
}

const SPEAKER_NAMES: Record<ChatMsg['who'], string> = {
  W: 'WEST BLOC',
  E: 'EAST BLOC',
  A: 'ARCHIVE-9',
  K: 'KALAMITH SCOUT',
}

/** Telemetry window: label + percentage + progress bar per row. */
function BarsBody({ rows }: { rows: BarRow[] }) {
  const [values, setValues] = useState(() => rows.map((r) => r.from))

  useEffect(() => {
    // Let the "from" state paint first, then animate toward "to" via CSS.
    const t = setTimeout(
      () => setValues(rows.map((r) => r.to)),
      300,
    )
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {rows.map((r, i) => (
        <div className="br" key={r.label}>
          <span>{r.label}</span>
          <em>{values[i]}%</em>
          <div className="bar">
            <i style={{ width: `${values[i]}%` }} />
          </div>
        </div>
      ))}
    </>
  )
}

/** Uplink progress shown while the distress message transmits. */
function UplinkBody() {
  const bar = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      if (bar.current) bar.current.style.width = '100%'
    }, 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <p className="q">Transmitting toward Proxima Centauri b</p>
      <div className="bar">
        <i ref={bar} />
      </div>
    </>
  )
}

/** Final window — replay restarts the whole story. */
function EndBody() {
  return (
    <div className="row">
      <button onClick={resetStory}>REPLAY TRANSMISSION</button>
    </div>
  )
}

/** Routes to the active player interaction (tiles / ask / simon / ...). */
function ActionBody() {
  const it = useVoyager((s) => s.interaction)
  if (!it) return null
  switch (it.kind) {
    case 'tiles':
      return <TilesInteraction key={it.key} {...(it.props as unknown as TilesProps)} />
    case 'ask':
      return <AskInteraction key={it.key} {...(it.props as unknown as AskProps)} />
    case 'simon':
      return <SimonInteraction key={it.key} />
    case 'keys':
      return <KeysInteraction key={it.key} />
    case 'typeMsg':
      return <TypeMsgInteraction key={it.key} {...(it.props as unknown as TypeMsgProps)} />
    case 'decode':
      return <DecodeInteraction key={it.key} {...(it.props as unknown as DecodeProps)} />
    case 'charge':
      return <ChargeInteraction key={it.key} />
  }
}

/* Re-exports kept close to their consumers */

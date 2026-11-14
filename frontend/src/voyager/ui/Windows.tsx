import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
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
import { WIN_OPEN, WIN_CLOSE } from '../lib/anim'
import { Bar } from './primitives'
import { resetStory, replayStory } from '../story/script'
import { Icon } from './Icons'
import {
  TilesInteraction,
  AskInteraction,
  SimonInteraction,
  KeysInteraction,
  TypeMsgInteraction,
  DecodeInteraction,
  ChargeInteraction,
  VoyagerDiscovery,
} from './interactions'

/**
 * HUD window system: fixed "terminal" panels with a glowing header and a
 * scrollable body. Content is chosen by `win.kind`.
 *
 * Lifecycle: open with a spring-in animation, close with a collapse
 * animation, then unmount. Interaction windows also manage keyboard focus
 * (focus moves in on open) so players can play with the keyboard alone.
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
  const interaction = useVoyager((s) => s.interaction)

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
          duration: WIN_OPEN.frame,
          ease: 'back.out(1.7)',
          clearProps: 'filter',
        },
      )
      const children = el.querySelector<HTMLElement>('.wb')?.children
      if (children?.length) {
        gsap.from(children, {
          x: -14,
          opacity: 0,
          stagger: WIN_OPEN.childStagger,
          delay: WIN_OPEN.childDelay,
          duration: WIN_OPEN.childDur,
        })
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
      duration: WIN_CLOSE.dur,
      ease: 'power2.in',
    })
    const t = setTimeout(
      () => useVoyager.getState().dropWindow(win.id, win.seq),
      WIN_CLOSE.removeAfter,
    )
    return () => clearTimeout(t)
  }, [win.closing, win.id, win.seq])

  // Keyboard focus: when a player interaction opens, move focus into it so
  // keyboard users land on the mini-game instead of getting lost on <body>.
  useEffect(() => {
    if (win.kind !== 'act' || win.closing) return
    const t = setTimeout(() => {
      root.current?.querySelector<HTMLElement>('button, [tabindex]')?.focus()
    }, 240)
    return () => clearTimeout(t)
  }, [win.kind, win.closing])

  const isFeed = win.kind === 'log' || win.kind === 'chat'

  return (
    <div
      ref={root}
      className={`w s-${win.slot} w-${win.id} acc-${win.accent} ${interaction?.kind === 'voyager' ? 'w-voyager' : ''}`}
      role={isFeed ? 'log' : undefined}
      aria-live={isFeed ? 'polite' : undefined}
      aria-label={isFeed ? win.title : undefined}
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
        x: msg.who === 'E' ? 40 : -40,
        opacity: 0,
        scale: 0.94,
        duration: 0.3,
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
      240,
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
          <Bar value={values[i]} label={r.label} />
        </div>
      ))}
    </>
  )
}

/** Uplink progress shown while the distress message transmits. */
function UplinkBody() {
  const [value, setValue] = useState(0)

  useEffect(() => {
    // Let the empty bar paint first, then animate to 100% via CSS.
    const t = setTimeout(() => setValue(100), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <p className="q">Transmitting toward Proxima Centauri b</p>
      <Bar value={value} label="Uplink progress" />
    </>
  )
}

/** Final window — the archive summary, plus replay and return. */
function EndBody() {
  return (
    <div className="end">
      <p className="end-lead">
        The archive is closed. Somewhere beyond the heliopause, the reply is still
        travelling.
      </p>
      <ul className="end-list">
        <li>
          <span>RECOVERED</span> Voyager 1 · 6 components catalogued
        </li>
        <li>
          <span>RECOVERED</span> Golden Record · 115 images · 55 sounds · 90 minutes
        </li>
        <li>
          <span>LOGGED</span> Mars · Arcadia Planitia · ice &lt; 30 cm · unconfirmed
        </li>
      </ul>
      <div className="row">
        <button type="button" onClick={replayStory}>
          REPLAY TRANSMISSION
        </button>
        <button type="button" onClick={resetStory}>
          RETURN TO TITLE
        </button>
      </div>
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
    case 'voyager':
      return <VoyagerDiscovery key={it.key} />
  }
}

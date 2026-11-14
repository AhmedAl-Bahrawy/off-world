import { useVoyager, type Accent, type InteractionKind } from './store'

/**
 * Bridge between the (imperative) story script and the (declarative) UI.
 *
 * The script calls `requestAct(...)`, which opens the "act" window and parks a
 * promise. The matching interaction component renders from store state and
 * calls `finishAct(result)` when the player completes it — the window closes
 * with its collapse animation and the promise resolves back into the script.
 */

export interface TileItem {
  icon: string
  label: string
  note: string
}
export interface TilesProps {
  question: string
  items: TileItem[]
}
export interface AskProps {
  question: string
  options: Array<{ icon: string; label: string }>
}
export interface TypeMsgProps {
  message: string
}
export interface DecodeProps {
  words: string[]
}

/** Window chrome per interaction kind (title + header icon). */
export const ACT_META: Record<InteractionKind, { title: string; icon: string }> =
  {
    tiles: { title: 'ACTION REQUIRED', icon: 'warn' },
    ask: { title: 'DECISION', icon: 'warn' },
    simon: { title: 'BREACH // EASTERN VAULT', icon: 'lock' },
    keys: { title: 'KEY AUTHORIZATION', icon: 'key' },
    typeMsg: { title: 'COMPOSE // OPEN CHANNEL', icon: 'sig' },
    decode: { title: 'DECODER // KALAMITH ARRAY', icon: 'eye' },
    charge: { title: 'DRIVE SPIN-UP', icon: 'ship' },
    voyager: { title: 'VOYAGER 1 // INVESTIGATION', icon: 'eye' },
  }

/** Sentinel handed back to a pending `requestAct` when the story resets. */
export const ACT_CANCELLED = Symbol('act-cancelled')

let resolver: ((value: unknown) => void) | null = null
let seq = 0

/** Open the act window and wait for the player to finish the interaction. */
export function requestAct<T>(
  accent: Accent,
  kind: InteractionKind,
  props: Record<string, unknown> = {},
): Promise<T> {
  const meta = ACT_META[kind]
  useVoyager.getState().openWindow({
    id: 'act',
    slot: 'c',
    kind: 'act',
    title: meta.title,
    icon: meta.icon,
    accent,
  })
  return new Promise<T>((resolve) => {
    resolver = resolve as (value: unknown) => void
    useVoyager.setState({ interaction: { key: ++seq, kind, props } })
  })
}

/** Close the act window, then hand the result back to the story. */
export function finishAct(result: unknown = undefined, delay = 300) {
  if (!resolver) return
  const resolve = resolver
  resolver = null
  useVoyager.getState().closeWindow('act')
  setTimeout(() => {
    useVoyager.setState({ interaction: null })
    resolve(result)
  }, delay)
}

/**
 * Abort a pending interaction. Called when the story resets: the parked
 * promise resolves with `ACT_CANCELLED` (so the old screenplay can notice
 * and stop) instead of hanging forever.
 */
export function cancelAct() {
  const resolve = resolver
  if (!resolve) return
  resolver = null
  useVoyager.setState({ interaction: null })
  resolve(ACT_CANCELLED)
}

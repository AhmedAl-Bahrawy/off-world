import { create } from 'zustand'

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type SceneName = 'collapse' | 'signal' | 'voyage' | 'orbit' | 'rem' | 'discovery' | 'mars'
export type Accent = 'cy' | 'bl' | 'or' | 'vi' | 'rd'
export type Slot = 'l' | 'r' | 'c' | 'b'
export type WindowKind = 'log' | 'chat' | 'bars' | 'act' | 'uplink' | 'end'
export type InteractionKind =
  | 'tiles'
  | 'ask'
  | 'simon'
  | 'keys'
  | 'typeMsg'
  | 'decode'
  | 'charge'
  | 'voyager'
export type ChatWho = 'W' | 'E' | 'A' | 'K'

export interface BarRow {
  label: string
  from: number
  to: number
}

/** One HUD window. `closing` starts the collapse animation before removal. */
export interface WinState {
  id: string
  /** Bumped on every openWindow so React remounts replaced windows. */
  seq?: number
  slot: Slot
  title: string
  icon: string
  accent: Accent
  kind: WindowKind
  /** Only for `kind: 'bars'`. */
  rows?: BarRow[]
  closing?: boolean
}

export interface LogLine {
  id: number
  text: string
  cls: string
}

export interface ChatMsg {
  id: number
  who: ChatWho
  /** null = still "typing" (three dots). */
  text: string | null
}

export interface InteractionState {
  key: number
  kind: InteractionKind
  props: Record<string, unknown>
}

export interface CardState {
  key: number
  subtitle: string
  title: string
  on: boolean
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

const initial = {
  phase: 'gate' as 'gate' | 'playing',
  scene: 'collapse' as SceneName,
  chapter: '',
  year: 2231,
  status: 'LINK ONLINE',
  accent: 'cy' as Accent,
  hudVisible: false,
  card: null as CardState | null,
  windows: [] as WinState[],
  log: [] as LogLine[],
  chat: [] as ChatMsg[],
  interaction: null as InteractionState | null,
  /** Bumped on every reset so the whole experience remounts cleanly. */
  generation: 0,
}

type Snapshot = typeof initial

interface State extends Snapshot {
  startGame: () => void
  setScene: (scene: SceneName) => void
  setChapter: (chapter: string) => void
  setYear: (year: number) => void
  setAccent: (accent: Accent) => void
  showCard: (subtitle: string, title: string) => void
  hideCard: () => void
  openWindow: (win: Omit<WinState, 'closing'>) => void
  closeWindow: (id: string) => void
  dropWindow: (id: string, seq?: number) => void
  clearWindows: () => void
  pushLog: (cls: string) => number
  setLogText: (id: number, text: string) => void
  trimLog: (max: number) => void
  clearLog: () => void
  pushChat: (who: ChatWho) => number
  setChatText: (id: number, text: string) => void
  clearChat: () => void
  reset: () => void
}

let uid = 0

export const useVoyager = create<State>()((set) => ({
  ...initial,

  startGame: () => set({ phase: 'playing', hudVisible: true }),
  setScene: (scene) => set({ scene }),
  setChapter: (chapter) => set({ chapter }),
  setYear: (year) => set({ year }),
  setAccent: (accent) => set({ accent }),
  showCard: (subtitle, title) =>
    set({ card: { key: ++uid, subtitle, title, on: true } }),
  hideCard: () =>
    set((s) => (s.card ? { card: { ...s.card, on: false } } : {})),

  /**
   * Opens (or replaces) a window. Replacing an existing id is instant, and the
   * bumped `seq` forces React to remount the frame so its open animation and
   * body state start fresh (never reuse the collapsing old element).
   */
  openWindow: (win) =>
    set((s) => ({
      windows: [
        ...s.windows.filter((w) => w.id !== win.id),
        { ...win, seq: ++uid },
      ],
    })),
  /** Marks a window as closing; the frame animates then drops itself. */
  closeWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, closing: true } : w)),
    })),
  /**
   * Removes a window. The optional `seq` guards against a stale self-removal
   * timer of a *previous* window with the same id deleting the fresh one.
   */
  dropWindow: (id, seq) =>
    set((s) => ({
      windows: s.windows.filter(
        (w) => !(w.id === id && (seq === undefined || w.seq === seq)),
      ),
    })),
  clearWindows: () =>
    set((s) => ({ windows: s.windows.map((w) => ({ ...w, closing: true })) })),

  pushLog: (cls) => {
    const id = ++uid
    set((s) => ({ log: [...s.log, { id, text: '', cls }] }))
    return id
  },
  setLogText: (id, text) =>
    set((s) => ({ log: s.log.map((l) => (l.id === id ? { ...l, text } : l)) })),
  trimLog: (max) =>
    set((s) =>
      s.log.length > max ? { log: s.log.slice(s.log.length - max) } : {},
    ),
  clearLog: () => set({ log: [] }),

  /** Adds a chat message with text = null (the "typing dots" state). */
  pushChat: (who) => {
    const id = ++uid
    set((s) => ({ chat: [...s.chat, { id, who, text: null }] }))
    return id
  },
  setChatText: (id, text) =>
    set((s) => ({
      chat: s.chat.map((m) => (m.id === id ? { ...m, text } : m)),
    })),
  clearChat: () => set({ chat: [] }),

  reset: () =>
    set({
      ...initial,
      generation: useVoyager.getState().generation + 1,
    }),
}))

/**
 * Subscribe to scene changes without the subscribeWithSelector middleware.
 * The callback fires once per actual change; returns the unsubscribe fn.
 */
export function onSceneChange(cb: (scene: SceneName) => void) {
  let prev = useVoyager.getState().scene
  return useVoyager.subscribe((s) => {
    if (s.scene !== prev) {
      prev = s.scene
      cb(prev)
    }
  })
}

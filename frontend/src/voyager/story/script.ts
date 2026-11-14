import { bus } from '../lib/bus'
import { blip } from '../lib/audio'
import { motion, RM } from '../lib/motion'
import { sleep } from '../lib/util'
import { useVoyager, type Accent, type ChatWho, type InteractionKind } from '../state/store'
import { requestAct, cancelAct, ACT_CANCELLED } from '../state/interactions'
import {
  ARMED_CHAT,
  ARCHIVE_VECTOR,
  ARCHIVE_QA,
  CHAPTERS,
  DECODE_WORDS,
  DISTRESS_MESSAGE,
  EAST_CHOICES,
  FINAL_CHAT,
  GIVE_CHAT,
  HEIST_CHAT,
  OPENING_CHAT,
  POWER_ROWS,
  REFUSE_CHAT,
  REPAIR_TILES,
  REPLIES,
  REPLY_OPTIONS,
  SCAN_TILES,
  SYSTEM_ROWS,
  VOYAGE_ROWS,
  type ChapterDef,
} from './dialogue'

/**
 * The whole narrative, as one readable async screenplay.
 * Started once by <VoyagerExperience/> when the phase turns "playing";
 * `resetStory()` (replay button) rewinds the store and allows a rerun.
 *
 * Replays are safe: every helper receives an `alive` guard and throws
 * `ABORT` the moment its run token goes stale, so an old screenplay can
 * never keep driving the UI while a new one starts.
 */

const S = () => useVoyager.getState()

const ABORT = Symbol('story-abort')

let storyStarted = false
/** Bumped on every run/reset; a screenplay only proceeds while its token is current. */
let storyRun = 0

export function resetStory() {
  storyStarted = false
  storyRun++
  // Wake up any pending interaction so the old screenplay can abort cleanly.
  cancelAct()
  motion.starTarget = motion.starSpeed = 0.05
  S().reset()
}

export async function runStory() {
  if (storyStarted) return
  storyStarted = true
  const run = ++storyRun
  const alive = () => run === storyRun

  /** Story-aware sleep: aborts as soon as the run is stale. */
  const wait = async (ms: number) => {
    await sleep(ms)
    if (!alive()) throw ABORT
  }

  /** Story-aware requestAct: resolves `ACT_CANCELLED` on reset. */
  const act = async <T>(accent: Accent, kind: InteractionKind, props: Record<string, unknown> = {}) => {
    const result = await requestAct<T>(accent, kind, props)
    if (result === ACT_CANCELLED || !alive()) throw ABORT
    return result
  }

  try {
    /* ================= CHAPTER 1 — THE COLLAPSE ================= */

    await chapter(CHAPTERS.collapse, wait)
    bus.emit('killCities', 18)
    bars('sys', 'GLOBAL SYSTEMS', 'warn', 'rd', SYSTEM_ROWS)
    await say('The machines failed. The know-how went with them.', '', wait)
    await say('A few owned the systems. No one could repair them.', '', wait)
    await act<void>('rd', 'tiles', {
      question: 'Systems failing. Try a repair.',
      items: REPAIR_TILES,
    })
    await say(
      'Humanity depended on machines it no longer understood.',
      'em',
      wait,
    )
    await say(
      'One chance remained: the Kalamith at Proxima Centauri b.',
      '',
      wait,
    )

    /* ================= CHAPTER 2 — THE LAST SIGNAL ============== */

    await chapter(CHAPTERS.signal, wait)
    await chat(OPENING_CHAT, undefined, undefined, wait)

    const reply = await act<number>('or', 'ask', {
      question: 'Reply to the Western bloc.',
      options: REPLY_OPTIONS,
    })
    await chat(
      [
        ['E', REPLIES[reply][0]],
        ['W', REPLIES[reply][1]],
      ],
      undefined,
      undefined,
      wait,
    )

    const choice = await act<number>('or', 'ask', {
      question: 'Eastern bloc. What is your answer?',
      options: EAST_CHOICES,
    })

    if (choice === 0) {
      await chat(GIVE_CHAT, undefined, undefined, wait)
    } else {
      await chat(REFUSE_CHAT, undefined, undefined, wait)
      await act<void>('rd', 'simon')
      await chat(HEIST_CHAT, undefined, undefined, wait)
    }

    await act<void>('cy', 'keys')
    await chat(ARMED_CHAT, undefined, undefined, wait)
    await act<void>('cy', 'typeMsg', { message: DISTRESS_MESSAGE })

    openLog('TRANSMISSION', 'sig', 'or')
    await say(
      'No encryption. We hoped they could read English.',
      '',
      wait,
    )
    await say(
      'We had a key. We never built a shared language.',
      'em',
      wait,
    )

    /* ================= CHAPTER 3 — ACROSS THE STARS ============= */

    await chapter(CHAPTERS.voyage, wait)
    S().setYear(2235)
    openLog('VOYAGER ARRAY', 'eye', 'vi')
    await say('Four years later, the signal reached them.', '', wait)
    await act<void>('vi', 'decode', { words: DECODE_WORDS })
    await say('The signal decoded. A ship followed.', '', wait)
    await say('They came to learn—not to rescue.', '', wait)
    await say('Knowledge was all they promised.', 'em', wait)
    await act<void>('vi', 'charge')

    motion.starTarget = 3.2
    const endYear = choice === 1 ? 2301 : 2291
    bars('vy', 'VOYAGE', 'ship', 'vi', VOYAGE_ROWS)
    bus.emit('shipGo', 7.2)
    for (let i = 0; i <= 60; i++) {
      S().setYear(Math.round(2235 + ((endYear - 2235) * i) / 60))
      await wait(55)
    }
    await say(
      choice === 1 ? 'Ten of these years belong to our pride.' : 'The long road is over.',
      '',
      wait,
    )

    /* ================= CHAPTER 4 — THE SILENT EARTH ============= */

    await chapter(CHAPTERS.orbit, wait)
    motion.starTarget = 0.05
    openLog('VOYAGER ARRAY', 'eye', 'vi')
    await say('They scan from orbit. No lights answer.', '', wait)
    await act<void>('vi', 'tiles', {
      question: 'Scan for signs of life.',
      items: SCAN_TILES,
    })
    await say('Earth has gone silent.', '', wait)
    await say('Humanity is gone. They came too late.', 'em', wait)

    /* ================= CHAPTER 5 — THE LAST REMNANTS ============ */

    await chapter(CHAPTERS.remnants, wait)
    bars('pw', 'DATA CENTERS', 'net', 'cy', POWER_ROWS)
    openLog('ARCHIVE-9', 'chip', 'cy')
    await say('One intelligence still answers.', '', wait)

    const questions = [...ARCHIVE_QA]
    for (let round = 0; round < 2; round++) {
      const k = await act<number>('vi', 'ask', {
        question: 'Ask ARCHIVE-9.',
        options: questions.map((q) => ({ icon: 'chat', label: q[0] })),
      })
      await chat(
        [
          ['K', questions[k][0]],
          ['A', questions[k][1]],
        ],
        'ARCHIVE-9 TERMINAL',
        'cy',
        wait,
      )
      questions.splice(k, 1)
    }

    await chat(FINAL_CHAT, undefined, undefined, wait)
    await chat(ARCHIVE_VECTOR, 'ARCHIVE-9 // OUTBOUND VECTOR', 'cy', wait)
    await wait(800)
    S().clearWindows()
    await wait(360)
    S().setScene('discovery')
    S().setAccent('vi')
    S().setChapter('VOYAGER 1 // OBJECT RECOVERY')
    await act<void>('vi', 'voyager')

    S().clearWindows()
    await wait(360)
    S().setScene('mars')
    openLog('MISSION LOG', 'sig', 'vi')
    await say('The distress call brought them to Earth. The record was a portrait—not a plea.', '', wait)
    await say('Now Mars: a mapped ice prospect, still waiting to be confirmed.', 'em', wait)
    await wait(450)

    S().openWindow({
      id: 'act',
      slot: 'c',
      title: 'MISSION LOG COMPLETE',
      icon: 'sig',
      accent: 'vi',
      kind: 'end',
    })
  } catch (error) {
    if (error !== ABORT) throw error
    // Story was reset mid-run: nothing to clean up — the fresh run owns the UI.
  }
}

/* ------------------------------------------------------------------ */
/* Story helpers (windows, narration)                                  */
/* ------------------------------------------------------------------ */

type Wait = (ms: number) => Promise<void>

/** Big chapter splash: clear windows, set accent/scene, show the card. */
async function chapter(def: ChapterDef, wait: Wait) {
  const s = S()
  s.clearWindows()
  s.setAccent(def.accent)
  s.setScene(def.scene)
  s.setChapter(def.title)
  s.showCard(def.subtitle, def.title)
  await wait(RM ? 900 : 1700)
  s.hideCard()
  await wait(400)
}

function openLog(title: string, icon: string, accent: Accent) {
  // Always a fresh log (like the original demo): recreate + wipe old lines.
  S().clearLog()
  S().openWindow({ id: 'log', slot: 'b', title, icon, accent, kind: 'log' })
}

/** Type a line character-by-character into the bottom log window. */
async function say(text: string, cls: string, wait: Wait) {
  const hasLog = S().windows.some((w) => w.id === 'log' && !w.closing)
  if (!hasLog) openLog('TRANSMISSION', 'sig', 'cy')

  const id = S().pushLog(cls)
  let typed = ''
  for (const ch of text) {
    typed += ch
    S().setLogText(id, typed)
    if (!RM && ch !== ' ') await wait(5)
  }
  await wait(140 + text.length * 4)
  S().trimLog(3)
}

/** Play a chat exchange in the right-hand comms window. */
async function chat(
  list: Array<[ChatWho, string]>,
  title = 'COMMS // WEST + EAST',
  accent: Accent = 'bl',
  wait?: Wait,
) {
  if (!S().windows.some((w) => w.id === 'chat' && !w.closing)) {
    S().clearChat() // fresh comms window starts with an empty feed
    S().openWindow({
      id: 'chat',
      slot: 'r',
      title,
      icon: 'chat',
      accent,
      kind: 'chat',
    })
  }
  for (const [who, text] of list) {
    if (wait) await wait(210)
    const id = S().pushChat(who)
    S().setChatText(id, text)
    blip(who === 'E' ? 420 : 700, 0.03)
    if (wait) await wait(150 + text.length * 5)
  }
}

/** Left-hand telemetry window with animated progress bars. */
function bars(
  id: string,
  title: string,
  icon: string,
  accent: Accent,
  rows: Array<{ label: string; from: number; to: number }>,
) {
  S().openWindow({ id, slot: 'l', title, icon, accent, kind: 'bars', rows })
}

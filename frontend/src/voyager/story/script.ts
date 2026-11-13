import { bus } from '../lib/bus'
import { blip } from '../lib/audio'
import { motion, RM } from '../lib/motion'
import { sleep } from '../lib/util'
import { useVoyager, type Accent, type ChatWho } from '../state/store'
import { requestAct } from '../state/interactions'
import {
  ARMED_CHAT,
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
 */

const S = () => useVoyager.getState()

let storyStarted = false

export function resetStory() {
  storyStarted = false
  motion.starTarget = motion.starSpeed = 0.05
  S().reset()
}

export async function runStory() {
  if (storyStarted) return
  storyStarted = true

  /* ================= CHAPTER 1 — THE COLLAPSE ================= */

  await chapter(CHAPTERS.collapse)
  bus.emit('killCities', 18)
  bars('sys', 'GLOBAL SYSTEMS', 'warn', 'rd', SYSTEM_ROWS)
  await say('The machines failed. The know-how went with them.')
  await say('A few owned the systems. No one could repair them.')
  await requestAct<void>('rd', 'tiles', {
    question: 'Systems failing. Try a repair.',
    items: REPAIR_TILES,
  })
  await say(
    'Humanity depended on machines it no longer understood.',
    'em',
  )
  await say(
    'One chance remained: the Kalamith at Proxima Centauri b.',
  )

  /* ================= CHAPTER 2 — THE LAST SIGNAL ============== */

  await chapter(CHAPTERS.signal)
  await chat(OPENING_CHAT)

  const reply = await requestAct<number>('or', 'ask', {
    question: 'Reply to the Western bloc.',
    options: REPLY_OPTIONS,
  })
  await chat([
    ['E', REPLIES[reply][0]],
    ['W', REPLIES[reply][1]],
  ])

  const choice = await requestAct<number>('or', 'ask', {
    question: 'Eastern bloc. What is your answer?',
    options: EAST_CHOICES,
  })

  if (choice === 0) {
    await chat(GIVE_CHAT)
  } else {
    await chat(REFUSE_CHAT)
    await requestAct<void>('rd', 'simon')
    await chat(HEIST_CHAT)
  }

  await requestAct<void>('cy', 'keys')
  await chat(ARMED_CHAT)
  await requestAct<void>('cy', 'typeMsg', { message: DISTRESS_MESSAGE })

  openLog('TRANSMISSION', 'sig', 'or')
  await say(
    'No encryption. We hoped they could read English.',
  )
  await say(
    'We had a key. We never built a shared language.',
    'em',
  )

  /* ================= CHAPTER 3 — ACROSS THE STARS ============= */

  await chapter(CHAPTERS.voyage)
  S().setYear(2235)
  openLog('VOYAGER ARRAY', 'eye', 'vi')
  await say('Four years later, the signal reached them.')
  await requestAct<void>('vi', 'decode', { words: DECODE_WORDS })
  await say('The signal decoded. A ship followed.')
  await say('They came to learn—not to rescue.')
  await say('Knowledge was all they promised.', 'em')
  await requestAct<void>('vi', 'charge')

  motion.starTarget = 3.2
  const endYear = choice === 1 ? 2301 : 2291
  bars('vy', 'VOYAGE', 'ship', 'vi', VOYAGE_ROWS)
  bus.emit('shipGo', 7.2)
  for (let i = 0; i <= 60; i++) {
    S().setYear(Math.round(2235 + ((endYear - 2235) * i) / 60))
    await sleep(55)
  }
  await say(
    choice === 1 ? 'Ten of these years belong to our pride.' : 'The long road is over.',
  )

  /* ================= CHAPTER 4 — THE SILENT EARTH ============= */

  await chapter(CHAPTERS.orbit)
  motion.starTarget = 0.05
  openLog('VOYAGER ARRAY', 'eye', 'vi')
  await say('They scan from orbit. No lights answer.')
  await requestAct<void>('vi', 'tiles', {
    question: 'Scan for signs of life.',
    items: SCAN_TILES,
  })
  await say('Earth has gone silent.')
  await say('Humanity is gone. They came too late.', 'em')

  /* ================= CHAPTER 5 — THE LAST REMNANTS ============ */

  await chapter(CHAPTERS.remnants)
  bars('pw', 'DATA CENTERS', 'net', 'cy', POWER_ROWS)
  openLog('ARCHIVE-9', 'chip', 'cy')
  await say('One intelligence still answers.')

  const questions = [...ARCHIVE_QA]
  for (let round = 0; round < 2; round++) {
    const k = await requestAct<number>('vi', 'ask', {
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
    )
    questions.splice(k, 1)
  }

  await chat(FINAL_CHAT)
  await sleep(1200)
  S().clearWindows()
  S().setScene('rem')
  await sleep(800)

  openLog('END OF TRANSMISSION', 'sig', 'vi')
  await say('The Kalamith came to learn.')
  await say('No one was left to teach.', 'em')
  await sleep(1500)

  S().openWindow({
    id: 'act',
    slot: 'c',
    title: 'TRANSMISSION ENDED',
    icon: 'sig',
    accent: 'vi',
    kind: 'end',
  })
}

/* ------------------------------------------------------------------ */
/* Story helpers (windows, narration)                                  */
/* ------------------------------------------------------------------ */

/** Big chapter splash: clear windows, set accent/scene, show the card. */
async function chapter(def: ChapterDef) {
  const s = S()
  s.clearWindows()
  s.setAccent(def.accent)
  s.setScene(def.scene)
  s.setChapter(def.title)
  s.showCard(def.subtitle, def.title)
  await sleep(RM ? 1000 : 1900)
  s.hideCard()
  await sleep(450)
}

function openLog(title: string, icon: string, accent: Accent) {
  // Always a fresh log (like the original demo): recreate + wipe old lines.
  S().clearLog()
  S().openWindow({ id: 'log', slot: 'b', title, icon, accent, kind: 'log' })
}

/** Type a line character-by-character into the bottom log window. */
async function say(text: string, cls = '') {
  const hasLog = S().windows.some((w) => w.id === 'log' && !w.closing)
  if (!hasLog) openLog('TRANSMISSION', 'sig', 'cy')

  const id = S().pushLog(cls)
  let typed = ''
  for (const ch of text) {
    typed += ch
    S().setLogText(id, typed)
    if (!RM && ch !== ' ') await sleep(5)
  }
  await sleep(140 + text.length * 4)
  S().trimLog(3)
}

/** Play a chat exchange in the right-hand comms window. */
async function chat(
  list: Array<[ChatWho, string]>,
  title = 'COMMS // WEST + EAST',
  accent: Accent = 'bl',
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
    const id = S().pushChat(who)
    await sleep(240)
    S().setChatText(id, text)
    blip(who === 'E' ? 420 : 700, 0.03)
    await sleep(160 + text.length * 5)
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

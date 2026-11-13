import { bus } from '../lib/bus'
import { blip } from '../lib/audio'
import { motion, RM } from '../lib/motion'
import { sleep } from '../lib/util'
import { useKalamith, type Accent, type ChatWho } from '../state/store'
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
 * Started once by <KalamithExperience/> when the phase turns "playing";
 * `resetStory()` (replay button) rewinds the store and allows a rerun.
 */

const S = () => useKalamith.getState()

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
  await say('The machines did not disappear.')
  await say('The knowledge to rebuild them did.')
  await say(
    'A few corporations held every process. A few factories held every skill.',
  )
  await requestAct<void>('rd', 'tiles', {
    question: 'Everything is failing. Try to repair it.',
    items: REPAIR_TILES,
  })
  await say(
    'Humanity had become dependent on technology it no longer understood.',
    'em',
  )
  await say(
    'One gamble remained: the Kalamith, an intelligent species at Proxima Centauri b. Friend or enemy, we do not know.',
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
    question: 'You speak for the Eastern bloc. Your answer?',
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
    'No encryption, and a naive hope that they would somehow read English.',
  )
  await say(
    'We held the key to a real conversation and never tried to build a shared language.',
    'em',
  )

  /* ================= CHAPTER 3 — ACROSS THE STARS ============= */

  await chapter(CHAPTERS.voyage)
  S().setYear(2235)
  openLog('KALAMITH ARRAY', 'eye', 'vi')
  await say('Four years after it left Earth, the signal arrived.')
  await requestAct<void>('vi', 'decode', { words: DECODE_WORDS })
  await say('Years of decoding. Then a ship.')
  await say(
    'They did not come out of mercy. Every species serves its own interest.',
  )
  await say(
    'They hoped to learn what humans knew. They would teach us nothing. Saving us would be enough.',
    'em',
  )
  await requestAct<void>('vi', 'charge')

  motion.starTarget = 3.2
  const endYear = choice === 1 ? 2301 : 2291
  bars('vy', 'VOYAGE', 'ship', 'vi', VOYAGE_ROWS)
  bus.emit('shipGo', 7.2)
  for (let i = 0; i <= 60; i++) {
    S().setYear(Math.round(2235 + ((endYear - 2235) * i) / 60))
    await sleep(120)
  }
  await say(
    choice === 1 ? 'Ten of these years belong to our pride.' : 'The long road is over.',
  )

  /* ================= CHAPTER 4 — THE SILENT EARTH ============= */

  await chapter(CHAPTERS.orbit)
  motion.starTarget = 0.05
  openLog('KALAMITH ARRAY', 'eye', 'vi')
  await say('They scan from orbit, waiting for lights.')
  await requestAct<void>('vi', 'tiles', {
    question: 'Scan the planet for signs of life.',
    items: SCAN_TILES,
  })
  await say('A planet that has stopped talking.')
  await say('Humanity is gone. They did not come to save anyone.', 'em')

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
  await say('The Kalamith came to learn from us.')
  await say('There was no one left to teach.', 'em')
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
    if (!RM && ch !== ' ') await sleep(10)
  }
  await sleep(240 + text.length * 8)
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
    await sleep(380)
    S().setChatText(id, text)
    blip(who === 'E' ? 420 : 700, 0.03)
    await sleep(260 + text.length * 10)
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

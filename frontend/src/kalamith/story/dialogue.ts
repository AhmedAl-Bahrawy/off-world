import type { Accent, ChatWho, SceneName } from '../state/store'

/**
 * Every piece of narrative text and data table lives here, so the flow in
 * `script.ts` reads like a screenplay and wording is easy to edit in one place.
 */

/** Speaker display names used in chat windows. */
export const SPEAKERS: Record<ChatWho, string> = {
  W: 'WEST BLOC',
  E: 'EAST BLOC',
  A: 'ARCHIVE-9',
  K: 'KALAMITH SCOUT',
}

export interface ChapterDef {
  title: string
  subtitle: string
  accent: Accent
  scene: SceneName
}

export const CHAPTERS = {
  collapse: {
    title: 'THE COLLAPSE',
    subtitle: 'EARTH, 2231',
    accent: 'rd',
    scene: 'collapse',
  },
  signal: {
    title: 'THE LAST SIGNAL',
    subtitle: 'TWO BLOCS, ONE KEY',
    accent: 'or',
    scene: 'signal',
  },
  voyage: {
    title: 'ACROSS THE STARS',
    subtitle: 'KALAMITH, PROXIMA CENTAURI B',
    accent: 'vi',
    scene: 'voyage',
  },
  orbit: {
    title: 'THE SILENT EARTH',
    subtitle: 'KALAMITH ARRIVAL',
    accent: 'vi',
    scene: 'orbit',
  },
  remnants: {
    title: 'THE LAST REMNANTS',
    subtitle: 'WHAT WAS LEFT',
    accent: 'cy',
    scene: 'rem',
  },
} satisfies Record<string, ChapterDef>

/* ---- Chapter 1 — The Collapse ------------------------------------ */

export const SYSTEM_ROWS = [
  { label: 'Power grid', from: 31, to: 3 },
  { label: 'Industry', from: 22, to: 0 },
  { label: 'Supply chains', from: 27, to: 2 },
  { label: 'Knowledge anyone can use', from: 4, to: 0 },
]

export const REPAIR_TILES: Array<{ icon: string; label: string; note: string }> =
  [
    { icon: 'power', label: 'Power grid', note: 'REPAIR FAILED' },
    { icon: 'factory', label: 'Factories', note: 'NO ONE KNOWS HOW' },
    { icon: 'net', label: 'Supply chain', note: 'OFFLINE' },
  ]

/* ---- Chapter 2 — The Last Signal ---------------------------------- */

export const OPENING_CHAT: Array<[ChatWho, string]> = [
  ['W', 'We located the Kalamith. We can send a distress call.'],
  [
    'W',
    'The transmitter needs both halves of the key. We hold one. We need yours.',
  ],
  ['E', 'You want us to beg an alien species to save us?'],
  ['W', 'We want to survive.'],
]

export const REPLY_OPTIONS = [
  { icon: 'chat', label: 'Why trust the Kalamith?' },
  { icon: 'chat', label: 'And if they are hostile?' },
  { icon: 'chat', label: 'Our pride is not for sale.' },
]

/** [what the East says, what the West answers] — indexed by the reply pick. */
export const REPLIES: Array<[string, string]> = [
  [
    'Why should we trust the Kalamith?',
    'We do not. We only know there is no other option.',
  ],
  ['And if they are hostile?', 'Then we die. But we were already dying.'],
  ['Our pride is not for sale.', 'Neither is survival. Choose.'],
]

export const EAST_CHOICES = [
  { icon: 'key', label: 'Give them our half' },
  { icon: 'lock', label: 'Refuse' },
]

export const GIVE_CHAT: Array<[ChatWho, string]> = [
  ['E', 'Take it. Pride will not feed anyone.'],
  ['W', 'Thank you. Preparing the transmitter.'],
]

export const REFUSE_CHAT: Array<[ChatWho, string]> = [
  ['E', 'Request denied. Humanity does not beg.'],
  ['W', 'Then we take it another way.'],
  ['A', 'ALERT: Western operative inside the Eastern vault.'],
]

export const HEIST_CHAT: Array<[ChatWho, string]> = [
  ['A', 'Vault open. Key extracted under threat.'],
  ['W', 'It worked. It also cost us ten years.'],
]

export const ARMED_CHAT: Array<[ChatWho, string]> = [
  ['A', 'Both halves accepted. Transmitter armed.'],
]

export const DISTRESS_MESSAGE = 'THIS IS HUMANITY. WE ARE DYING. PLEASE HELP.'

/* ---- Chapter 3 — Across the Stars --------------------------------- */

export const DECODE_WORDS = [
  'THIS',
  'IS',
  'HUMANITY',
  'WE',
  'ARE',
  'DYING',
  'PLEASE',
  'HELP',
]

export const VOYAGE_ROWS = [
  { label: 'Distance covered', from: 0, to: 100 },
  { label: 'Speed (27% of light)', from: 27, to: 27 },
]

/* ---- Chapter 4 — The Silent Earth --------------------------------- */

export const SCAN_TILES: Array<{ icon: string; label: string; note: string }> = [
  { icon: 'globe', label: 'Americas', note: 'NO SIGNAL' },
  { icon: 'globe', label: 'Europe, Asia', note: 'NO SIGNAL' },
  { icon: 'net', label: 'Orbit', note: 'DEBRIS ONLY' },
]

/* ---- Chapter 5 — The Last Remnants -------------------------------- */

export const POWER_ROWS = [
  { label: 'Online', from: 3, to: 3 },
  { label: 'Power remaining', from: 12, to: 0 },
]

/** [question, ARCHIVE-9's answer] — two of the three get asked. */
export const ARCHIVE_QA: Array<[string, string]> = [
  [
    'What are you?',
    'I am ARCHIVE-9. I store everything humanity wrote, built and forgot.',
  ],
  [
    'What happened here?',
    'The people stopped understanding their machines. Then the machines stopped working.',
  ],
  [
    'Can you rebuild it?',
    'I hold every record. I cannot build a single thing.',
  ],
]

export const FINAL_CHAT: Array<[ChatWho, string]> = [
  ['A', 'Power at 0%. I kept everything. I could not use any of it.'],
]

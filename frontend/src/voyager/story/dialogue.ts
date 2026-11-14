import type { Accent, ChatWho, SceneName } from '../state/store'

/**
 * Every piece of narrative text and data table lives here, so the flow in
 * `script.ts` reads like a screenplay and wording is easy to edit in one place.
 */

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
    title: 'THE VOYAGE',
    subtitle: 'PROXIMA CENTAURI B',
    accent: 'vi',
    scene: 'voyage',
  },
  orbit: {
    title: 'THE SILENT EARTH',
    subtitle: 'VOYAGER ARRIVAL',
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
  { label: 'Public knowledge', from: 4, to: 0 },
]

export const REPAIR_TILES: Array<{ icon: string; label: string; note: string }> =
  [
    { icon: 'power', label: 'Power grid', note: 'REPAIR FAILED' },
    { icon: 'factory', label: 'Factories', note: 'NO ONE KNOWS HOW' },
    { icon: 'net', label: 'Supply chain', note: 'OFFLINE' },
  ]

/* ---- Chapter 2 — The Last Signal ---------------------------------- */

export const OPENING_CHAT: Array<[ChatWho, string]> = [
  ['W', 'We found the Kalamith. We can send a distress call.'],
  ['W', 'We have half the key. We need yours.'],
  ['E', 'You want us to beg aliens?'],
  ['W', 'We want to survive.'],
]

export const REPLY_OPTIONS = [
  { icon: 'chat', label: 'Can we trust them?' },
  { icon: 'chat', label: 'What if they attack?' },
  { icon: 'chat', label: 'Pride comes first.' },
]

/** [what the East says, what the West answers] — indexed by the reply pick. */
export const REPLIES: Array<[string, string]> = [
  [
    'Can we trust them?',
    'We cannot. There is no other choice.',
  ],
  ['What if they attack?', 'Then we die. We are dying already.'],
  ['Pride comes first.', 'Not before survival. Choose.'],
]

export const EAST_CHOICES = [
  { icon: 'key', label: 'Give them our half' },
  { icon: 'lock', label: 'Refuse' },
]

export const GIVE_CHAT: Array<[ChatWho, string]> = [
  ['E', 'Take it. Pride cannot feed us.'],
  ['W', 'Thank you. Transmitter is ready.'],
]

export const REFUSE_CHAT: Array<[ChatWho, string]> = [
  ['E', 'Denied. Humanity does not beg.'],
  ['W', 'Then we take it.'],
  ['A', 'ALERT: Western operative in the vault.'],
]

export const HEIST_CHAT: Array<[ChatWho, string]> = [
  ['A', 'Vault open. Key taken by force.'],
  ['W', 'It worked. We lost ten years.'],
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
    'ARCHIVE-9. I hold what humanity wrote, built, and forgot.',
  ],
  [
    'What happened here?',
    'People forgot how their machines worked. Then they stopped.',
  ],
  [
    'Can you rebuild it?',
    'I hold every record. I cannot build.',
  ],
]

export const FINAL_CHAT: Array<[ChatWho, string]> = [
  ['A', 'Power at zero. I kept everything. I could use none of it.'],
]

export const ARCHIVE_VECTOR: Array<[ChatWho, string]> = [
  ['A', 'Outbound probe file recovered: Voyager 1.'],
  ['A', 'Story vector: RA 17h 13m 42s / Dec +12° 44′ / 0.014 light-years from Earth at this archive epoch.'],
]

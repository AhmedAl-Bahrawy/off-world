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
  /** Index in the story's progress rail (0-based). */
  stage: number
}

export const CHAPTERS = {
  collapse: {
    title: 'THE COLLAPSE',
    subtitle: 'EARTH, 2231',
    accent: 'rd',
    scene: 'collapse',
    stage: 0,
  },
  signal: {
    title: 'THE LAST SIGNAL',
    subtitle: 'TWO BLOCS, ONE KEY',
    accent: 'or',
    scene: 'signal',
    stage: 1,
  },
  voyage: {
    title: 'THE VOYAGE',
    subtitle: 'PROXIMA CENTAURI B',
    accent: 'vi',
    scene: 'voyage',
    stage: 2,
  },
  orbit: {
    title: 'THE SILENT EARTH',
    subtitle: 'VOYAGER ARRIVAL',
    accent: 'vi',
    scene: 'orbit',
    stage: 3,
  },
  remnants: {
    title: 'THE LAST REMNANTS',
    subtitle: 'WHAT WAS LEFT',
    accent: 'cy',
    scene: 'rem',
    stage: 4,
  },
  discovery: {
    title: 'VOYAGER 1',
    subtitle: 'OBJECT RECOVERY',
    accent: 'vi',
    scene: 'discovery',
    stage: 5,
  },
  mars: {
    title: 'MARS',
    subtitle: 'ARCADIA PLANITIA',
    accent: 'vi',
    scene: 'mars',
    stage: 6,
  },
} satisfies Record<string, ChapterDef>

/**
 * The ordered list of story segments. Drives the HUD progress rail so the
 * player always knows where they are in the transmission.
 */
export const STAGES = [
  'COLLAPSE',
  'SIGNAL',
  'VOYAGE',
  'SILENT EARTH',
  'REMNANTS',
  'VOYAGER 1',
  'MARS',
] as const

/* ------------------------------------------------------------------ */
/* Mission directives — the guidance layer                             */
/* ------------------------------------------------------------------ */

/**
 * One entry per player-facing step. Shown by `brief()` in `script.ts`
 * before the matching interaction opens: the big title says WHAT to do,
 * `why` says WHY (with a wink). Steps flagged `splash` get a full-screen
 * splash first — reserved for the moments that shape the story.
 * Steps flagged `banner: false` are splash-only (used when a lingering
 * banner would collide with a full-screen scene, like the Voyager UI).
 */
export interface DirectiveDef {
  kicker: string
  title: string
  why: string
  splash?: boolean
  banner?: boolean
}

export const DIRECTIVES = {
  repair: {
    kicker: 'DIRECTIVE 01 · EARTH, 2231',
    title: 'FIX THE UNFIXABLE',
    why: 'The grid is dying and nobody is left who knows how it works. Try a repair — watch history politely decline.',
  },
  replyWest: {
    kicker: 'DIRECTIVE 02 · COMMS',
    title: 'PICK A SIDE',
    why: 'Two blocs, one transmitter. Earth’s last phone call goes out tonight — your words are the message.',
    splash: true,
  },
  eastKey: {
    kicker: 'DIRECTIVE 03 · EASTERN BLOC',
    title: 'THE EAST HAS A KEY',
    why: 'They’ll hand it over… or you borrow it. Legally speaking, history won’t check.',
    splash: true,
  },
  vault: {
    kicker: 'DIRECTIVE 03½ · HEIST',
    title: 'STEAL THE LAUNCH KEY',
    why: 'The guard rotates every few seconds. Watch. Memorize. Repeat. Try not to sweat on the keypad.',
  },
  keys: {
    kicker: 'DIRECTIVE 04 · LAUNCH CONTROL',
    title: 'ARM THE TRANSMITTER',
    why: 'Two keys. Three seconds. One very nervous planet.',
  },
  message: {
    kicker: 'DIRECTIVE 05 · OPEN CHANNEL',
    title: 'CALL FOR HELP',
    why: 'No encryption, no protocol, no shame. Plain English, straight into the void.',
  },
  decode: {
    kicker: 'DIRECTIVE 06 · KALAMITH ARRAY',
    title: 'PROVE THE SIGNAL',
    why: 'Something out there answered. Tap the words until they stop being noise.',
  },
  charge: {
    kicker: 'DIRECTIVE 07 · DRIVE ROOM',
    title: 'CATCH THE SHIP',
    why: 'Mash to spin the drive up before it winds down. Physics is the only one arguing with you.',
  },
  scan: {
    kicker: 'DIRECTIVE 08 · ORBITAL SURVEY',
    title: 'LOOK FOR LIFE',
    why: 'Earth went dark fifty years ago. Scan anyway. Someone has to check.',
  },
  archive: {
    kicker: 'DIRECTIVE 09 · ARCHIVE-9',
    title: 'INTERROGATE THE MACHINE',
    why: 'The last librarian survived everything. Two questions — choose well. Machines remember.',
  },
  voyager: {
    kicker: 'DIRECTIVE 10 · DEEP FIELD',
    title: 'MEET THE RELIC',
    why: 'A 1977 probe, still humming after all this time. Hold to wake it up — it has one message left to deliver.',
    splash: true,
    banner: false, // the full-screen scene has its own title; a banner would sit on top of it
  },
  mars: {
    kicker: 'DIRECTIVE 11 · ARCADIA PLANITIA',
    title: 'CONFIRM THE ICE',
    why: 'The record was a portrait. The map is a promise. Scan the ice — finish what Voyager started.',
    splash: true,
    banner: false,
  },
} satisfies Record<string, DirectiveDef>

export type DirectiveKey = keyof typeof DIRECTIVES

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

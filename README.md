# Off-World — Voyager

An interactive space-transmission story: Earth collapses in 2231, humanity
sends one last distress call to Proxima Centauri b, and half a century later
the Kalamith ship finds only silence — and a 1977 probe called *Voyager 1*.

Built with **React 19**, **react-three-fiber** (three.js), **zustand**,
**gsap** and **Vite**.

## Quick start

```bash
cd frontend
npm install
npm run dev       # dev server
npm run build     # typecheck + production build
npm run lint      # eslint
npm run preview   # serve the production build
```

Requires Node 20+.

## Architecture

```
frontend/src/voyager/
├── VoyagerExperience.tsx   root: layers the 3D scene, HUD, windows, gate
├── state/
│   ├── store.ts            zustand store (phase, scene, windows, log, chat…)
│   └── interactions.ts     requestAct/finishAct bridge + cancelAct
├── story/
│   ├── script.ts           the whole narrative as one async screenplay
│   └── dialogue.ts         every line of text / data table
├── lib/
│   ├── bus.ts              typed event bus (script → 3D scene commands)
│   ├── motion.ts           reduced-motion flag + frame-loop shared values
│   ├── anim.ts             shared animation constants (scene tween, win open/close)
│   ├── audio.ts            WebAudio hum + blips, mute control, single context
│   ├── hooks.ts            useTimeout (unmount-safe timers), useLitSet
│   └── util.ts             sleep()
├── scene/                  the main R3F world (Earth, Kalamith, ship, beam…)
└── ui/
    ├── Windows.tsx         HUD window system + interaction routing
    ├── primitives/         reusable ActLayout / ActRow / Tile
    └── interactions/       the eight player mini-games
```

### How the story runs

1. `VoyagerExperience` starts `runStory()` when the phase turns `playing`.
2. The screenplay drives the UI through the zustand store (`say`, `chat`,
   `bars`, `chapter`) and pauses at `requestAct(...)` — which opens the
   "act" window and parks a promise.
3. The matching interaction component calls `finishAct(result)`; the window
   closes and the screenplay resumes with the result (e.g. which reply the
   player chose — that choice changes the ending year).
4. **Replay-safe:** every helper holds a run token; when `resetStory()` runs,
   the old screenplay aborts at its next `await` instead of fighting the new
   one, and any pending interaction is cancelled with `cancelAct()`.

### 3D ↔ story communication

The imperative screenplay never touches React state at 60 fps. It uses:

- the **store** for discrete facts (scene, year, accent, windows),
- the **event bus** (`killCities`, `pulse`, `shipGo`, `shake`) for one-off
  scene commands,
- the **`motion`** object (`lib/motion.ts`) for values read every frame.

## Design system

`src/voyager/voyager.css` is a thin index that imports the real stylesheets
from `styles/`:

| File                | Owns                                                |
| ------------------- | --------------------------------------------------- |
| `styles/tokens.css` | palette + motion variables (`--t-fast/--t-med/--t-slow`) |
| `styles/base.css`   | root shell, canvases, icons, button primitive        |
| `styles/hud.css`    | header, HUD bar, gate, chapter card                  |
| `styles/windows.css`| window frames, screen slots, log/comms feeds         |
| `styles/directive.css` | mission guidance layer (splash + banner)          |
| `styles/interactions.css` | tiles, decoder, prompts, progress bars        |
| `styles/discovery.css`    | the full-screen Voyager 1 scene UI (`.vy`)    |

Accent colors are named after their hue (`--cy`, `--bl`, `--or` amber,
`--rd` red, `--vi`) and exposed as CSS variables; a component window sets
`--c` and everything (borders, glows, bars) follows.

## Story content

All narrative text lives in `story/dialogue.ts`; pacing lives in
`story/script.ts`. Edit there to change the story without touching UI code.

## Accessibility

- Interaction windows move keyboard focus into the mini-game on open.
- Narration windows (`log`, `chat`) are announced via `role="log"`.
- Tiles and vault pads expose `aria-pressed` / `aria-label`.
- Both 3D canvases and the 2D starfield are `aria-hidden`.
- Every animation respects `prefers-reduced-motion`.
- Sound can be muted from the header toggle (choice survives replays).

# OFF-WORLD — SCENE 02 : MARS
## *"The Three Witnesses"*

A funny little pixel platformer about waking three dead machines on Mars and
learning — genuinely, accurately — what they did. **Visually first:** every
fact has a picture, a diagram, an icon-quiz or a one-liner attached. No walls
of text.

You are **CURI-7**, the newest rover on the Red Planet. Three witnesses are
waiting:

| Witness | The gimmick | What you learn |
|---|---|---|
| **Viking 1** (1976) | Dig for buried samples · the famous "maybe" life result | First landing, nuclear batteries, 97% of Mars mapped |
| **Pathfinder + Sojourner** (1997) | Airbag-bounce gauntlet · escort a 30 cm rover | 15-bounce landing, first free rover, ancient floods |
| **Ingenuity** (2021–24) | Fly the helicopter through 1% air | First flight on another planet, 5 flights → 72 |

Each zone opens with a **WITNESS FILE**: the machine's real sprite, huge,
with labelled callouts. Each mission ends with an **icon-choice quiz** —
pick the picture, not the paragraph.

---

## Play it

**`scene2-mars.html`** — the whole game in one file. Open in any browser.
No server, no internet, no dependencies. Works from `file://` and a USB stick.

Or open **`index.html`** — same game, as the readable project.

### Controls

| Key | What it does |
|---|---|
| `A` / `D` or `←` / `→` | Walk |
| `Shift` | Sprint |
| `Space` / `W` | Jump — press again mid-air for the **airbag bounce** |
| `E` | Talk · dig · everything contextual |
| `Q` | Orbital relay ping — reveals buried memories (rings on screen) |
| `H` | Rotorcraft — hold to fly (unlocked in the Jezero zone) |
| `Tab` / `V` | Field Codex / Achievements · `Esc` pause |

Touch controls appear automatically on touch devices.

---

## Project structure

```
scene2/
├── index.html            the page shell (markup only)
├── css/style.css         all UI styling
├── js/                   classic scripts, loaded in numbered order
│   ├── 00-config.js      resolution, tile size, zone palettes
│   ├── 01-utils.js       math + DOM helpers
│   ├── 02-font.js        crisp 5×7 bitmap font
│   ├── 03-audio.js       chiptune engine (square/triangle/noise)
│   ├── 04-art.js         ★ every sprite, as palette-keyed strings
│   ├── 05-sprites.js     sprite compiler + draw helpers
│   ├── 06-data.js        tools, facts, icon quizzes, levels, cast
│   ├── 07-state.js       save system, game/run/kit state
│   ├── 08-world.js       procedural level builder (9 missions)
│   ├── 09-physics.js     tile collision, one-way platforms
│   ├── 10-entities.js    player, particles, enemies, world update
│   ├── 11-render.js      parallax sky, terrain, entities, HUD
│   ├── 12-ui.js          overlays, codex, achievements, rails
│   ├── 13-flow.js        witness files, icon quizzes, level flow
│   ├── 14-input.js       keyboard + touch + interact/ping
│   └── 15-main.js        fixed-step loop, wiring, boot
├── assets/sprites/contact-sheet.png   art preview (auto-generated)
├── tools/build.py        bundles everything → scene2-mars.html
├── tools/build_sprites.py re-exports the contact sheet from 04-art.js
└── scene2-mars.html      the shippable single file
```

Classic `<script>` tags (no ES modules) so `index.html` runs straight from
`file://`. Scripts share top-level scope in load order; `04-art.js` is the
single source of truth for all pixel art.

### Editing the art

Sprites are ASCII art: one letter per pixel, `.` is transparent, letters map
to the palette at the top of `js/04-art.js`. After editing, regenerate the
preview:

```
python3 tools/build_sprites.py     # → assets/sprites/contact-sheet.png
python3 tools/build.py             # → rebuild scene2-mars.html
```

### Save data

Progress lives in `localStorage` under `offworld.mars.scene2.v2`.
`🗑 RESET SAVE` in the top bar wipes it.

---

## The facts

All 30 machine facts in the game are real (Viking's "maybe" biology results,
Pathfinder's 15 bounces and 5.8 m airbags, Ingenuity's 72 flights and 1% air).
The jokes are optional. The facts are the point.

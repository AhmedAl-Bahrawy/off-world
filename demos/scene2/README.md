# OFF-WORLD — SCENE 02 : MARS
## *"The Three Witnesses"*

A funny little pixel platformer about waking three dead machines on Mars and
learning — genuinely, accurately — what they did.

You are **CURI-7**, the newest rover on the Red Planet. Humans are gone. Their
machines are still there: powered down, holding records nobody has read in
decades. You have a shovel, a torch and a very expensive transmitter.

**Nine missions. Three machines. Thirty real NASA facts, each with a joke
attached.** The jokes are optional. The facts are the point.

---

## Play it

Open **`scene2-mars.html`** in any modern browser. That is the whole game —
one file, no dependencies, no server, no internet. It works offline and
straight off a USB stick.

### Controls

| Key | What it does |
|---|---|
| `A` / `D` (or `←` / `→`) | Walk |
| `Shift` | Sprint |
| `Space` / `W` / `↑` | Jump — press **again in mid-air** once you have the airbag bounce |
| `E` | Talk to machines · dig regolith · everything contextual |
| `Q` | Orbital relay ping — reveals memories buried in the dust |
| `H` | Rotorcraft (unlocked in Mission 07) |
| `Tab` | Field Codex — everything you have learned so far |
| `V` | Achievements |
| `Esc` | Pause |

Touch controls appear automatically on phones and tablets.

### The loop

1. **Explore** a zone and collect **memory shards** — each one is a real fact
   plus a field note from a machine that has been alone for a very long time.
2. **Talk** to the machine parked in the zone. It has opinions.
3. **Reach the machine at the end** of the level. It boots, and then it
   **asks you a question**. Answer it (or don't — it will forgive you, and
   roast you).
4. **Learn something**, unlock a new verb, and go deeper.

Progress saves to `localStorage` automatically. *RESET SAVE* wipes it.

---

## The three witnesses

| # | Machine | Where | What it teaches you |
|---|---|---|---|
| 1 | **Viking 1** (Orbiter + Lander) | Chryse Planitia | The first truly successful Mars landing, its radioisotope generators, the biology package that returned the most famous "maybe" in the history of science, and six years of daily weather reports |
| 2 | **Mars Pathfinder + Sojourner** | Ares Vallis | The first airbag landing ever, fifteen bounces, a 10.6 kg rover named after Sojourner Truth, 2.3 billion bits of data, and the rocks that proved Mars was once warm and wet |
| 3 | **Ingenuity** | Jezero Crater | The first powered flight on another planet, five flights planned and seventy-two flown, 128.8 minutes in a 1%-dense atmosphere, and the last flight on 18 January 2024 |

All thirty facts are drawn from NASA's own mission pages:

- <https://science.nasa.gov/mission/viking/>
- <https://science.nasa.gov/mission/mars-pathfinder/>
- <https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/>

---

## Project layout

```
off-world-mars/
├── scene2-mars.html          ← THE GAME. Single file, fully self-contained.
├── README.md
├── assets/
│   └── sprites/              ← the pixel art, exported as real PNGs
│       ├── sheet-player.png       CURI-7, the helicopter, the machines
│       ├── sheet-guardians.png    VIGIL-1, SIEGFRIED, SOJOURNER, GUSTO-9
│       ├── sheet-world.png        rocks, ice, signs, flags, pads
│       ├── sheet-items.png        shards, bits, cells, sample tubes
│       ├── sheet-enemies.png      dust mites, regolith wasps, boulders
│       └── contact-sheet.png      everything, big, for art review
├── src/                      ← authoring source (parts of the build)
│   ├── part1.html                markup + all the CSS
│   ├── part2.js                  utilities, font, audio, all game content
│   ├── part3.js                  sprite factory, world builder, physics
│   ├── part4.js                  renderer, UI, quiz, codex, game loop
│   └── art.json                  the pixel art as data
└── tools/
    ├── build.py                  assembles src/ + art.json → scene2-mars.html
    └── build_sprites.py          exports assets/sprites/*.png
```

### Rebuilding

```bash
python3 tools/build.py          # rebuild the HTML and re-export the PNGs
python3 tools/build_sprites.py  # only re-export the PNG sheets
```

`tools/build.py` reads the sprite art out of the **built HTML** and renders
the PNG sheets from it, so the artwork only ever lives in one place. Edit
`scene2-mars.html` freely — it is the source of truth for the game — and
re-run the sprite export whenever you want fresh PNGs.

To work on the art itself, edit `src/art.json` (each sprite is a grid of
characters mapped through a palette), rebuild, and the PNGs regenerate.

### How the game is put together

- **Rendering** — a 480×270 pixel canvas scaled up with nearest-neighbour
  filtering, plus DOM panels around it for the codex, mission log and quiz.
- **Font** — a hand-authored 5×7 bitmap font, pre-rendered and tinted through
  a per-glyph cache, so text is crisp at any size.
- **Physics** — tile-free AABB collision with coyote time, jump buffering,
  variable jump height, squash-and-stretch and one-way platforms.
- **Audio** — a small chiptune engine: square lead, triangle bass, filtered
  noise percussion, and about twenty sound effects.
- **Sprites** — every pixel is authored as text in `art.json`. Live "googly
  eyes" are drawn on top at runtime so characters can look at things, and
  blink.
- **Save** — `localStorage`, versioned, with a one-click wipe.

---

*Made for Scene 02 of the OFF-WORLD project. All mission facts courtesy of
NASA.*

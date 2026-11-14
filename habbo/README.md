# OFF-WORLD — The Silent Archives

An interactive educational archive presented through a fictional alien
expedition. In 2251, a crew from Kalamith reaches the Solar System after
receiving a distress signal from humanity — and nobody is answering.

The site investigates **real** space hardware (Voyager 1, Opportunity,
Apollo 17) and reconstructs mission history, clearly separating:

- `HISTORICAL FACT` — verified NASA history
- `SCIENTIFIC DATA` — measured or sourced mission data
- `EXPEDITION LOG` — fictional Kalamithian crew narration
- `RECONSTRUCTION` — visual/narrative reconstruction, not a real recording

OFF-WORLD is an independent educational storytelling project and is **not
affiliated with NASA**.

## Stack

- React (functional components) + Vite
- Plain CSS with design tokens (`src/styles/tokens.css`)
- No UI framework

## Project layout

```
src/
  data/        # all content: navigation, chapters, instruments, timeline, archive
  components/  # one component per file (TopNavigation, ChapterCard, ArchiveMap, ...)
  styles/      # tokens, global wallpaper, layout, components, section extensions
```

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # eslint
```

## Content integrity

Every factual claim is linked to a NASA/JPL/PDS source beside the claim or in
the chapter. Fiction is always labelled. Image areas are clearly labelled
placeholders pending licensed NASA/JPL/PDS media.

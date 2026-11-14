# Prompt for the AI coding agent — Complete OFF-WORLD

You are continuing an existing React + Vite project called **OFF-WORLD**. The current repository is a working visual foundation, not a blank project. Your task is to complete the website while preserving its retro early-2000s portal layout.

## 1. Core visual requirement

Use the supplied Habbo homepage screenshot as a **layout and visual-style reference only**. Recreate its broad composition:
- a repeating illustrated wallpaper filling the browser background
- a narrow, centered website shell (approximately 836px on desktop)
- a horizontal yellow/orange tab navigation at the top
- a blue main content canvas
- compact, bordered panels with dark outlines and small headings
- a dense portal homepage with a featured story, news feed, and stacked information panels
- a dark-blue footer inside the centered shell

Do not copy Habbo's logo, characters, text, icons, proprietary assets, or exact branding. OFF-WORLD must have its own identity. Keep the retro visual language: pixel-era UI, compact typography, beveled/bordered tabs, bright yellow section headers, dark navy outlines, blue surfaces, and patterned wallpaper.

## 2. Product concept

OFF-WORLD is an interactive educational archive presented through a fictional alien expedition. In the year 2251, a crew from Kalamith reaches the Solar System after receiving a distress signal from humanity. They investigate real human space hardware and reconstruct the history of its missions.

The core mystery: **Humanity called for help, but nobody is answering.**

The experience must clearly distinguish:
- `HISTORICAL FACT`: verified NASA history and mission facts
- `EXPEDITION LOG`: fictional narration from the Kalamithian crew
- `SCIENTIFIC DATA`: measured or sourced mission data
- `RECONSTRUCTION`: visual or narrative reconstruction, not a real recording

Never present fictional story events as historical NASA facts.

## 3. Main navigation

Build these navigation tabs:
1. HOME
2. VOYAGER
3. MARS
4. THE MOON
5. TIMELINE
6. ARCHIVE

Use client-side React navigation or scroll-to-section navigation. Every tab must work. On small screens, allow horizontal scrolling or a compact menu without breaking the desktop composition.

## 4. Homepage content layout

Maintain the Habbo-inspired dense portal composition:
- Top feature row: left featured artifact/story card; right "LATEST TRANSMISSIONS" list.
- Below: three-column grid at desktop:
  - left: "EXPEDITION BRIEFING" and "SIGNAL STATUS"
  - middle: "QUESTS & DISCOVERIES" / chapter cards
  - right: "MISSION ARCHIVE" and "FIELD NOTES"
- Include a visible "ENTER THE ARCHIVE" call-to-action.
- Add a compact footer with source links, project credits, and a note that OFF-WORLD is an educational, non-NASA project.

Do not turn the page into a modern full-screen SaaS dashboard. Preserve the centered retro portal proportions and information density.

## 5. Required story chapters

### Chapter 1 — Contact / Voyager 1
Explain:
- launch: 5 September 1977
- Jupiter flyby: 1979
- Saturn flyby: 1980
- entry into interstellar space: 2012
- Golden Record: greetings, sounds, images, music, and instructions
- instruments: imaging system, magnetometer, plasma wave instrument, cosmic ray system, and power source (RTG)

Explain what each instrument measured and why it mattered. Do not imply Voyager is abandoned or inactive: it remains an extended mission, though its instruments and power capabilities have changed over time.

### Chapter 2 — The Search / Mars
Use Opportunity as the main rover case study:
- launch: 2003
- landing: 24 January 2004
- designed mission: 90 sols
- operated for almost 15 years
- last communication: 10 June 2018
- mission declared complete: 13 February 2019
- instruments: Pancam, Microscopic Imager, Rock Abrasion Tool, APXS, Mini-TES, Mössbauer Spectrometer
- explain evidence for ancient water and the scientific interpretation carefully

Do not claim Opportunity found life. It found geological evidence of past water-related environments.

### Chapter 3 — Footsteps / The Moon
Use Apollo 17 as the main mission:
- launch: 7 December 1972
- lunar landing: 11 December 1972
- crew: Eugene Cernan, Harrison Schmitt, Ronald Evans
- Lunar Roving Vehicle and ALSEP experiments
- distinguish Apollo 11's EASEP from the later ALSEP packages
- explain that the ALSEP network was shut down in 1977

Explain hardware left on the Moon and the scientific work it enabled.

### Chapter 4 — Arrival / Earth
This is fictional. The crew sees a living Earth with no human response. End before landing. Do not explain humanity's disappearance in the public story.

## 6. Essential UI features

Implement:
- interactive chapter cards
- clickable artifact cards
- a timeline with real mission dates
- a simple solar-system/archive map or a clearly labeled schematic (do not invent precise current spacecraft coordinates)
- expandable instrument details
- a Golden Record exploration panel
- a responsive layout that preserves the desktop retro design
- visible source citations/links beside factual claims
- accessible focus states, semantic HTML, and keyboard navigation

If 3D models or NASA images are not available, use clearly labeled placeholders rather than fake imagery. Prefer NASA/JPL/PDS sources. Check image usage and attribution requirements.

## 7. Technical rules

- Use React functional components.
- Keep content data separate from presentation in `src/data/`.
- Keep CSS variables in `src/styles/tokens.css`.
- Avoid a giant monolithic component.
- Do not add a heavy UI framework.
- Avoid unnecessary animations; use subtle retro hover states.
- No fake buttons or dead links.
- Do not hardcode fabricated mission statistics.
- Ensure `npm run build` passes.
- Keep components readable and straightforward.

## 8. Suggested components

- `TopNavigation`
- `FeaturedTransmission`
- `LatestTransmissions`
- `ExpeditionBriefing`
- `ChapterCard`
- `ArtifactCard`
- `InstrumentAccordion`
- `MissionTimeline`
- `ArchiveMap`
- `SourceCitation`
- `SiteFooter`

## 9. Completion checklist

Before finishing:
1. Run the production build.
2. Fix all errors and warnings that affect functionality.
3. Test navigation and all interactions.
4. Test desktop at 1440px and 1920px widths.
5. Test mobile at 390px and 360px.
6. Confirm all story-vs-fact labels are visible.
7. Confirm no Habbo branding/assets have been copied.
8. Confirm source links are real and support the adjacent facts.
9. Summarize files changed and any remaining placeholders.

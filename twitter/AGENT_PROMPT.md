# OFF-WORLD — Twitter-era Retro Website Agent Brief

You are continuing an existing React + Vite project. Your task is to turn the starter into a polished, content-rich, story-driven educational website while preserving the supplied early-Twitter (circa 2006) visual reference.

## Non-negotiable visual direction
Recreate the visual language and page composition of the supplied old Twitter screenshot:
- A centered, compact desktop canvas around 725px wide, not a modern full-width SaaS layout.
- Bright cyan/turquoise sky background with soft, oversized translucent cloud shapes.
- Large playful white outlined wordmark at the top-left of the centered canvas.
- Two-column page: broad pale-white content panel on the left and narrow lime-green sign-in / community sidebar on the right.
- Old-web typography: Arial/Helvetica, compact sizes, blue hyperlinks, underlined hover states, yellow highlighted phrases.
- Thin green borders, pale lavender/white panels, small controls, restrained gradients and subtle shadows.
- Keep the intentionally dense, nostalgic 2006 portal feel. Do not modernize it into cards with huge radii, dark mode, oversized typography, glassmorphism, or a generic landing page.
- Preserve the visual hierarchy and dimensions of the screenshot while making the layout responsive on small screens.

## Product/story
The website is OFF-WORLD: an alien expedition discovers humanity through real NASA hardware left across the solar system. The fictional framing is separate from verified history. The central mystery: humanity sent a distress signal, but nobody answers.

Story chapters:
1. Contact — Voyager 1 and the Golden Record.
2. The Search — abandoned Mars hardware and the science of Mars.
3. Footsteps — Apollo lunar landing sites, equipment, and experiments.
4. Arrival — Earth appears alive but humanity is silent. End before landing.

Background lore about the organoid intelligence is internal guidance only. Do not reveal it as established fact in the public story or invent scientific evidence for it.

## Main experience to build
Keep the Twitter-era homepage layout as the shell. Adapt the content to the OFF-WORLD story:
- Header wordmark: OFF-WORLD.
- Main column intro: an inviting question such as “A signal from Earth. A mystery across the stars. What happened here?”
- Featured transmission panel: editorial hero/slide area with a short chapter teaser.
- Activity feed styled like early Twitter public updates. Each entry should read like an expedition log / transmission with author, timestamp, location, and short message.
- Sidebar: “Join the Expedition” / “Crew Access”, a compact mission status block, featured artifacts, and links to chapters.
- Footer with About, Mission Archive, Data Sources, Credits.

## Required sections and features
1. A chapter timeline for Contact / Search / Footsteps / Arrival.
2. A searchable or filterable archive of artifacts.
3. Artifact detail views with: object name, mission, launch/date, location, purpose, instruments, operational status, discoveries, and source citations.
4. A Voyager 1 / Golden Record interactive feature that explains the record's greetings, sounds, images, and encoded instructions. Avoid copyrighted audio; use descriptions and public-domain/NASA material where available.
5. Mars mission section whose featured rover/lander is chosen from the supplied hackathon datasets. Do not guess what the datasets contain.
6. Apollo / Moon section that distinguishes hardware left behind from hardware returned to Earth.
7. Earth arrival ending sequence with no invented explanation for humanity's disappearance.
8. Clear source links and a visible distinction between VERIFIED NASA HISTORY and FICTIONAL STORY LOGS.

## Accuracy rules
- Use NASA primary sources and the hackathon resource datasets as the factual basis.
- Do not claim old spacecraft are still operational unless the source confirms it.
- Distinguish mission end, current status, and physical location.
- Do not invent measurements, discoveries, mission dates, instrument names, or quotations.
- Cite NASA pages/datasets next to the facts they support.
- Fictional dialogue and transmissions must be visually labeled as fiction.
- Do not assume all hardware is NASA-owned if the source says otherwise.

## Engineering requirements
- Inspect the existing code before editing. Keep React + Vite.
- Use reusable components and keep content data separate from presentation.
- Avoid unnecessary dependencies. Use semantic HTML and accessible labels.
- Implement working navigation, filters, accordion interactions, and responsive layout.
- No dead buttons or fake form submissions. If authentication is not implemented, label the sign-in panel as a visual prototype and do not imply real accounts exist.
- Add loading, empty, and error states for any data-backed areas.
- Keep CSS organized in the existing tokens/global/layout/components files or split into clear modules.
- Do not replace the supplied design system without a clear reason.
- Run `npm run build` and fix all errors before finishing.

## Suggested implementation sequence
1. Inspect the starter and confirm its current visual baseline.
2. Refine the cloud background and logo to match the reference more closely.
3. Complete the homepage feed and sidebar content using OFF-WORLD language.
4. Add the chapter navigation and timeline.
5. Build artifact archive and detail components.
6. Integrate real NASA/hackathon data with citations.
7. Add responsive behavior and accessibility.
8. Verify production build and report any data gaps honestly.

## Definition of done
The result should feel like an authentic early-2000s social portal repurposed as an alien expedition's public archive: compact, bright, playful, information-dense, and unmistakably retro. It must teach real space hardware and science through the story rather than merely listing facts.

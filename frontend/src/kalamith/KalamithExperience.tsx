import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import { useKalamith } from './state/store'
import { runStory } from './story/script'
import { SceneCanvas } from './scene/SceneCanvas'
import { IconDefs } from './ui/Icons'
import { Starfield2D } from './ui/Starfield2D'
import { Gate } from './ui/Gate'
import { Hud } from './ui/Hud'
import { ChapterCard } from './ui/ChapterCard'
import { Windows } from './ui/Windows'
import { RM } from './lib/motion'
import './kalamith.css'

/**
 * Kalamith — cinematic space-drama experience.
 *
 * Layering (back to front):
 *   1. .kx-sky        2D parallax starfield canvas
 *   2. .kx-gl         R3F scene (planets, ship, stars) — fixed, z-index 1
 *   3. HUD / windows  DOM terminal UI — z-index 3-4
 *   4. .kx-card       chapter title splash — z-index 5
 *   5. .kx-gate       entry screen — z-index 8
 *   6. .kx::after     CRT scanline vignette — z-index 9
 *
 * The story flow lives in story/script.ts; game state in state/store.ts.
 */
export default function KalamithExperience() {
  const phase = useKalamith((s) => s.phase)
  const scene = useKalamith((s) => s.scene)
  const accent = useKalamith((s) => s.accent)
  const generation = useKalamith((s) => s.generation)

  // Kick the screenplay once the gate has finished fading.
  useEffect(() => {
    if (phase === 'playing') runStory()
  }, [phase, generation])

  // Elastic pop on every button press (feedback from the original demo).
  useEffect(() => {
    if (RM) return
    const onDown = (e: PointerEvent) => {
      const btn = (e.target as HTMLElement).closest('button')
      if (btn)
        gsap.fromTo(
          btn,
          { scale: 0.9 },
          { scale: 1, duration: 0.5, ease: 'elastic.out(1.3,.4)' },
        )
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])

  return (
    <div
      className="kx"
      data-s={scene}
      style={{ '--acc': `var(--${accent})` } as CSSProperties}
    >
      <IconDefs />
      <Starfield2D />
      {/* Keyed per-generation so a replay remounts both fresh — prefixes keep
          the sibling keys unique (two bare `key={generation}` collide on "0"). */}
      <SceneCanvas key={'gl' + generation} />
      <Hud />
      <ChapterCard />
      <Windows />
      {phase === 'gate' && <Gate key={'gate' + generation} />}
    </div>
  )
}

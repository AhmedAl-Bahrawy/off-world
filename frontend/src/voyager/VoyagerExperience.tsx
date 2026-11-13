import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import { useVoyager } from './state/store'
import { runStory, resetStory } from './story/script'
import { SceneCanvas } from './scene/SceneCanvas'
import { IconDefs } from './ui/Icons'
import { Starfield2D } from './ui/Starfield2D'
import { Gate } from './ui/Gate'
import { Hud } from './ui/Hud'
import { ChapterCard } from './ui/ChapterCard'
import { Windows } from './ui/Windows'
import { SiteHeader } from './ui/SiteHeader'
import { startAudio, blip } from './lib/audio'
import { RM } from './lib/motion'
import './voyager.css'

/** Voyager is the first Off-World story scene; Kalamith remains the species in the narrative. */
export default function VoyagerExperience() {
  const phase = useVoyager((s) => s.phase)
  const scene = useVoyager((s) => s.scene)
  const accent = useVoyager((s) => s.accent)
  const generation = useVoyager((s) => s.generation)
  const [leaving, setLeaving] = useState(false)
  const starting = useRef(false)

  useEffect(() => {
    if (phase === 'playing') runStory()
  }, [phase, generation])

  useEffect(() => {
    starting.current = false
    setLeaving(false)
  }, [generation])

  const start = () => {
    if (phase !== 'gate' || starting.current) return
    starting.current = true
    startAudio()
    blip(660)
    setLeaving(true)
    window.setTimeout(() => useVoyager.getState().startGame(), 700)
  }

  const home = () => {
    if (phase === 'playing') resetStory()
  }

  useEffect(() => {
    if (RM) return
    const onDown = (event: PointerEvent) => {
      const button = (event.target as HTMLElement).closest('button')
      if (button)
        gsap.fromTo(button, { scale: 0.97 }, { scale: 1, duration: 0.3, ease: 'power2.out' })
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
      <div className="kx-art-direction" aria-hidden="true" />
      <Starfield2D />
      <SceneCanvas key={'gl' + generation} />
      <SiteHeader phase={phase} onStart={start} onHome={home} />
      <Hud />
      <ChapterCard />
      <Windows />
      {phase === 'gate' && <Gate key={'gate' + generation} leaving={leaving} onStart={start} />}
    </div>
  )
}

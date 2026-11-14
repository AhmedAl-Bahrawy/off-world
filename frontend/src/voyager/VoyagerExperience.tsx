import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useVoyager } from './state/store'
import MarsExperience from '../mars/MarsExperience'
import { runStory, resetStory } from './story/script'
import { SceneCanvas } from './scene/SceneCanvas'
import { IconDefs } from './ui/Icons'
import { SpaceBackdrop } from './ui/primitives'
import { Starfield2D } from './ui/Starfield2D'
import { Gate } from './ui/Gate'
import { Hud } from './ui/Hud'
import { ChapterCard } from './ui/ChapterCard'
import { Directive } from './ui/Directive'
import { Windows } from './ui/Windows'
import { SiteHeader } from './ui/SiteHeader'
import { startAudio, blip, stopAudio, stopAmbience } from './lib/audio'
import './voyager.css'

/** Voyager is the first Off-World story scene; Kalamith remains the species in the narrative. */
export default function VoyagerExperience() {
  const phase = useVoyager((s) => s.phase)
  const scene = useVoyager((s) => s.scene)
  const accent = useVoyager((s) => s.accent)
  const generation = useVoyager((s) => s.generation)
  const marsActive = useVoyager((s) => s.marsActive)
  const starting = useRef(false)

  useEffect(() => {
    if (phase === 'playing') runStory()
  }, [phase, generation])

  // A new generation (fresh replay) always re-arms the start guard.
  useEffect(() => {
    starting.current = false
  }, [generation])

  // The soundscape belongs to the mission, not to the title screen.
  useEffect(() => {
    if (phase === 'gate') stopAmbience()
  }, [phase])

  const start = () => {
    if (phase !== 'gate' || starting.current) return
    starting.current = true
    startAudio()
    blip(660)
    window.setTimeout(() => useVoyager.getState().startGame(), 700)
  }

  const home = () => {
    if (phase === 'playing') {
      // Going back to the gate ends the current run: stop the hum and let
      // the next start create a fresh one.
      stopAudio()
      resetStory()
    }
  }

  return (
    <div
      className="kx"
      data-s={scene}
      style={{ '--acc': `var(--${accent})` } as CSSProperties}
    >
      <IconDefs />
      <SpaceBackdrop art="/assets/images/milky-way.jpg" />
      <Starfield2D />
      <SceneCanvas key={'gl' + generation} />
      <SiteHeader phase={phase} onStart={start} onHome={home} />
      <Hud />
      <ChapterCard />
      <Directive />
      <Windows />
      {phase === 'gate' && <Gate key={'gate' + generation} onStart={start} />}
      {marsActive && <MarsExperience onExit={() => useVoyager.getState().setMarsActive(false)} />}
    </div>
  )
}

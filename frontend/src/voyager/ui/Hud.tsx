import { useEffect } from 'react'
import { useVoyager } from '../state/store'
import { STAGES } from '../story/dialogue'
import { skipNarration } from '../story/script'
import { Icon } from './Icons'

/**
 * Top status bar: galactic year (ticks during the voyage), current chapter
 * name, link status, a story progress rail, and the narration fast-forward
 * control. Hidden until the experience starts.
 */
export function Hud() {
  const year = useVoyager((s) => s.year)
  const chapter = useVoyager((s) => s.chapter)
  const status = useVoyager((s) => s.status)
  const visible = useVoyager((s) => s.hudVisible)
  const stage = useVoyager((s) => s.stage)
  const narration = useVoyager((s) => s.narration)

  // Space / Enter fast-forwards the narration while it is typing. The key is
  // ignored while a player interaction owns the keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== ' ' && e.key !== 'Enter') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, select, button, a')) return
      if (!useVoyager.getState().narration) return
      e.preventDefault()
      skipNarration()
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className={`kx-hud ${visible ? 'on' : ''}`}>
      <div className="kx-hud-row">
        <div className="kx-hud-year">
          <Icon name="globe" />
          <b className="kx-yr">{year}</b>
        </div>
        <div className="kx-ch">{chapter}</div>
        <div className="kx-st">
          <i className="kx-st-dot" aria-hidden="true" />
          {status}
        </div>
      </div>

      <nav className="kx-rail" aria-label={`Story progress: stage ${stage + 1} of ${STAGES.length}`}>
        <ol>
          {STAGES.map((label, i) => (
            <li
              key={label}
              className={i < stage ? 'done' : i === stage ? 'now' : ''}
              aria-current={i === stage ? 'step' : undefined}
            >
              <span className="kx-rail-tick" aria-hidden="true" />
              <span className="kx-rail-label">{label}</span>
            </li>
          ))}
        </ol>
      </nav>

      {narration && (
        <button
          type="button"
          className="kx-skip"
          onClick={skipNarration}
          aria-label="Skip the current narration"
        >
          <span aria-hidden="true">▸▸</span> SKIP
        </button>
      )}
    </div>
  )
}

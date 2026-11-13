import { useVoyager } from '../state/store'
import { Icon } from './Icons'

/**
 * Top status bar: galactic year (ticks during the voyage), current chapter
 * name, and link status. Hidden until the experience starts.
 */
export function Hud() {
  const year = useVoyager((s) => s.year)
  const chapter = useVoyager((s) => s.chapter)
  const status = useVoyager((s) => s.status)
  const visible = useVoyager((s) => s.hudVisible)

  return (
    <div className={`kx-hud ${visible ? 'on' : ''}`}>
      <div>
        <Icon name="globe" />
        <b className="kx-yr">{year}</b>
      </div>
      <div className="kx-ch">{chapter}</div>
      <div className="kx-st">{status}</div>
    </div>
  )
}

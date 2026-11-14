import { SoundToggle } from './SoundToggle'

type SiteHeaderProps = {
  phase: 'gate' | 'playing'
  onStart: () => void
  onHome: () => void
}

export function SiteHeader({ phase, onStart, onHome }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <button className="site-mark" type="button" onClick={onHome} aria-label="Off-World home">
        <span>OFF-WORLD</span>
        <i aria-hidden="true" />
      </button>
      <nav className="site-nav" aria-label="Main navigation">
        <button
          className={phase === 'gate' ? 'active' : ''}
          type="button"
          onClick={onHome}
          aria-current={phase === 'gate' ? 'page' : undefined}
        >
          HOME
        </button>
        {/* Only a real action: starting the mission from the gate. Mid-game
            it would be a no-op, so it is not rendered at all. */}
        {phase === 'gate' && (
          <button type="button" onClick={onStart}>
            MISSION
          </button>
        )}
        <SoundToggle />
      </nav>
    </header>
  )
}

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
        <button
          className={phase === 'playing' ? 'active' : ''}
          type="button"
          onClick={onStart}
          aria-current={phase === 'playing' ? 'page' : undefined}
        >
          MISSION
        </button>
        <span className="future-nav" aria-disabled="true" title="Coming later">DATA</span>
        <span className="future-nav" aria-disabled="true" title="Coming later">ABOUT</span>
      </nav>
    </header>
  )
}

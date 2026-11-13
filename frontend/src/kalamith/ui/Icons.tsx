/**
 * The original demo's inline SVG icon set, rendered once as a hidden sprite
 * sheet and referenced via <use>. `Icon` is the only public component.
 */

const SYMBOLS: Record<string, React.ReactNode> = {
  sig: (
    <>
      <circle cx="12" cy="14" r="2" />
      <path d="M7.5 9.5a6 6 0 0 1 9 0M4.5 6.5a10 10 0 0 1 15 0M12 16v5" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9M18 12v4M15 12v3" />
    </>
  ),
  power: <path d="M12 3v9M6.5 6.5a8 8 0 1 0 11 0" />,
  factory: <path d="M3 21V10l6 4v-4l6 4V6h3v15zM8 21v-3m4 3v-3" />,
  net: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1" />
      <rect x="4" y="14" width="16" height="6" rx="1" />
      <path d="M8 7h.01M8 17h.01" />
    </>
  ),
  warn: <path d="M12 3 2 20h20zM12 10v5M12 18h.01" />,
  eye: (
    <>
      <ellipse cx="12" cy="6.5" rx="4" ry="2.5" />
      <circle cx="12" cy="6.5" r="1" />
      <ellipse cx="6" cy="14.5" rx="4" ry="2.5" />
      <circle cx="6" cy="14.5" r="1" />
      <ellipse cx="18" cy="14.5" rx="4" ry="2.5" />
      <circle cx="18" cy="14.5" r="1" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="1" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  ship: (
    <path d="M12 2c3 3 4 8 3 13l-3 3-3-3c-1-5 0-10 3-13zM9 16l-4 3 2-5M15 16l4 3-2-5" />
  ),
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  scan: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 12 18 6M2 12h3M19 12h3M12 2v3M12 19v3" />
    </>
  ),
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="1" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </>
  ),
}

/** Hidden <svg> sprite sheet — render once at the app root. */
export function IconDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        {Object.entries(SYMBOLS).map(([name, children]) => (
          <symbol key={name} id={`i-${name}`} viewBox="0 0 24 24">
            {children}
          </symbol>
        ))}
      </defs>
    </svg>
  )
}

/** One stroke icon from the sprite sheet. */
export function Icon({ name }: { name: string }) {
  return (
    <svg className="ic" aria-hidden>
      <use href={`#i-${name}`} />
    </svg>
  )
}

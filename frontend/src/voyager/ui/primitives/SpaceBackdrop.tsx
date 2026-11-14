import type { ReactNode } from 'react'

/**
 * Shared deep-space backdrop: nebula gradient base → decorative artwork →
 * extra layers (async star images…) → dark veil on top. Used by the main
 * experience (first view) and re-used inside the full-screen discovery
 * scene so every screen shares one space look.
 */

interface SpaceBackdropProps {
  /** Decorative artwork layer (cover). Omit for a gradient-only backdrop. */
  art?: string
  /** Dim + screen-blend the artwork (story look). `false` = full-opacity. */
  dim?: boolean
  /** Extra layers rendered between the artwork and the dark veil. */
  children?: ReactNode
  className?: string
}

export function SpaceBackdrop({
  art,
  dim = true,
  children,
  className = '',
}: SpaceBackdropProps) {
  return (
    <div className={`space-backdrop ${className}`} aria-hidden="true">
      <div className="space-backdrop-nebula" />
      {art && (
        <div
          className={`space-backdrop-art ${dim ? 'is-dim' : 'is-plain'}`}
          style={{ backgroundImage: `url(${art})` }}
        />
      )}
      {children}
      <div className="space-backdrop-dark" />
    </div>
  )
}

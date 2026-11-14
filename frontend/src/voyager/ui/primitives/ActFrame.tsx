import type { ReactNode } from 'react'

/**
 * Shared layout for the player-facing interaction window bodies
 * (repair tiles, decisions, vault breach, keys, decoder, charge...).
 *
 * Every interaction previously copy-pasted the same
 * `prompt → content → hint` skeleton; this is the single implementation.
 */

interface ActLayoutProps {
  /** The instruction line rendered as `.q` above the controls. */
  question?: string
  /** The controls (buttons, bars, tiles...). */
  children: ReactNode
  /** Status line under the controls; also announced to screen readers. */
  hint?: string
}

export function ActLayout({ question, children, hint }: ActLayoutProps) {
  return (
    <>
      {question && <p className="q">{question}</p>}
      {children}
      {hint !== undefined && <p className="hint">{hint}</p>}
    </>
  )
}

/** Horizontal group of action buttons/tiles. */
export function ActRow({ children }: { children: ReactNode }) {
  return <div className="row">{children}</div>
}

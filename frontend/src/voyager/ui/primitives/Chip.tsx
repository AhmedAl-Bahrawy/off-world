import type { ReactNode } from 'react'

/**
 * Shared toggle chip (record tracks, Mars scan buttons). `on` renders the
 * gold active state; `icon`/`children` accept any node so feature folders
 * can pass their own icon components without a dependency inversion.
 */

interface ChipProps {
  icon?: ReactNode
  label: string
  on?: boolean
  /** Larger pill layout (Mars scan chips). */
  big?: boolean
  onClick?: () => void
  /** Extra content after the label (e.g. the record equalizer bars). */
  children?: ReactNode
}

export function Chip({ icon, label, on = false, big = false, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      className={`vy-chip ${big ? 'big' : ''} ${on ? 'on' : ''}`}
      onClick={onClick}
      aria-pressed={on || undefined}
    >
      {icon}
      <span>{label}</span>
      {children}
    </button>
  )
}

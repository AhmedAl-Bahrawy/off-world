/**
 * Shared progress bar — the single implementation used by telemetry rows,
 * the uplink transmission and the drive charge. `fast` switches to the
 * quick CSS transition variant (set in `interactions.css`, not inline).
 */

interface BarProps {
  /** 0..100. Clamped for safety. */
  value: number
  /** Accessible name for the `progressbar` role. */
  label?: string
  fast?: boolean
  className?: string
}

export function Bar({ value, label, fast = false, className = '' }: BarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      className={`bar ${fast ? 'bar-fast' : ''} ${className}`}
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <i style={{ width: `${clamped}%` }} />
    </div>
  )
}

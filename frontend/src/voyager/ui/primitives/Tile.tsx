import type { Ref, ReactNode } from 'react'
import { Icon } from '../Icons'

/**
 * The square "tile" button used by the repair/scan panels, the key
 * authorization and the vault-breach pads — one component instead of
 * three diverging copies. `note` renders the small result line that
 * appears once a tile is completed.
 */

interface TileProps {
  icon?: string
  /** Main label under the icon. */
  label?: string
  /** Result note shown in `em` (usually revealed when `on`). */
  note?: string
  /** Lit / completed state. */
  on?: boolean
  /** Accent override (defaults to the window accent). */
  accent?: string
  onClick?: () => void
  disabled?: boolean
  /** Accessible name when the visible label is not enough (icon-only pads). */
  ariaLabel?: string
  /** Announce toggled state to assistive tech. */
  pressed?: boolean
  buttonRef?: Ref<HTMLButtonElement>
  className?: string
  children?: ReactNode
}

export function Tile({
  icon,
  label,
  note,
  on = false,
  accent,
  onClick,
  disabled,
  ariaLabel,
  pressed,
  buttonRef,
  className = '',
  children,
}: TileProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className={`tile ${on ? 'lit' : ''} ${accent ? `acc-${accent}` : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={pressed}
    >
      {icon && <Icon name={icon} />}
      {label && <span>{label}</span>}
      {note !== undefined && <em>{on ? note : ''}</em>}
      {children}
    </button>
  )
}

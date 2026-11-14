import { useState } from 'react'
import { ICON_BASE } from './assets'

/** Icon fetched from the web (lucide .svg files). Renders nothing if it fails. */
export function Ico({ n, className = '' }: { n: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span className={`vy-ico vy-ico-dot ${className}`} aria-hidden="true" />
  return (
    <img
      className={`vy-ico ${className}`}
      src={`${ICON_BASE}${n}.svg`}
      alt=""
      aria-hidden="true"
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}

/**
 * Image slot. A CSS-gradient placeholder is always drawn underneath;
 * the web image fades in on top when (and if) it loads.
 */
export function Slot({ src, label, className = '' }: { src: string; label: string; className?: string }) {
  const [state, setState] = useState<'wait' | 'ok' | 'err'>('wait')
  return (
    <div className={`vy-slot ${state === 'ok' ? 'ok' : ''} ${className}`}>
      <span className="vy-slot-label">{label}</span>
      {state !== 'err' && (
        <img
          src={src}
          alt=""
          draggable={false}
          referrerPolicy="no-referrer"
          onLoad={() => setState('ok')}
          onError={() => setState('err')}
        />
      )}
    </div>
  )
}

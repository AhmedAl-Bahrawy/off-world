import { useEffect, useRef, useState } from 'react'
import { finishAct } from '../../state/interactions'
import { bus } from '../../lib/bus'
import { blip } from '../../lib/audio'
import { Icon } from '../Icons'

/**
 * Drive spin-up: mash the button to charge the drive; charge decays over time.
 * Reaching 100% resolves the interaction.
 */
export function ChargeInteraction() {
  const [charge, setCharge] = useState(0)
  const chargeRef = useRef(0)
  const fullRef = useRef(false)

  // Constant decay — mashing has to outrun it.
  useEffect(() => {
    const iv = setInterval(() => {
      if (fullRef.current) return
      chargeRef.current = Math.max(0, chargeRef.current - 1.2)
      setCharge(chargeRef.current)
    }, 60)
    return () => clearInterval(iv)
  }, [])

  const mash = () => {
    if (fullRef.current) return
    chargeRef.current = Math.min(100, chargeRef.current + 7)
    setCharge(chargeRef.current)
    blip(200 + chargeRef.current * 6, 0.03)
    bus.emit('shake')

    if (chargeRef.current >= 100) {
      fullRef.current = true
      setTimeout(() => finishAct(), 400)
    }
  }

  return (
    <>
      <p className="q">Tap fast to charge the drive to 27% of light speed.</p>
      <div className="bar">
        <i style={{ width: `${charge}%`, transition: 'width .1s' }} />
      </div>
      <div className="row">
        <button style={{ '--c': 'var(--vi)' } as React.CSSProperties} onClick={mash}>
          <Icon name="power" />
          <span>CHARGE</span>
        </button>
      </div>
    </>
  )
}

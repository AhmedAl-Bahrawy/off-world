import { useState } from 'react'
import { blip, isMuted, setMuted, startAudio } from '../lib/audio'
import { Icon } from './Icons'

/**
 * Sound on/off toggle, always reachable from the header. State lives in the
 * audio module so the choice survives a story replay.
 */
export function SoundToggle() {
  const [muted, setMutedState] = useState(isMuted)

  const toggle = () => {
    const next = !muted
    setMutedState(next)
    setMuted(next)
    if (!next) {
      startAudio() // unmuted from the header: ensure the context exists/resumes
      blip(660)
    }
  }

  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={toggle}
      aria-pressed={muted}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      title={muted ? 'Sound off' : 'Sound on'}
    >
      <Icon name={muted ? 'sound-off' : 'sound-on'} />
    </button>
  )
}

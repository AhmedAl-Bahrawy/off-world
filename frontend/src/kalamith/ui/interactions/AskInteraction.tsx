import { finishAct, type AskProps } from '../../state/interactions'
import { blip } from '../../lib/audio'
import { Icon } from '../Icons'

/**
 * Multiple-choice decision panel. Resolves with the chosen option index.
 */
export function AskInteraction({ question, options }: AskProps) {
  return (
    <>
      <p className="q">{question}</p>
      <div className="row">
        {options.map((o, i) => (
          <button
            key={i}
            onClick={() => {
              blip(420 + i * 240)
              finishAct(i, 280)
            }}
          >
            <Icon name={o.icon} />
            <span>{o.label}</span>
          </button>
        ))}
      </div>
    </>
  )
}

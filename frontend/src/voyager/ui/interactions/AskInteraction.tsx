import { finishAct, type AskProps } from '../../state/interactions'
import { blip } from '../../lib/audio'
import { Icon } from '../Icons'
import { ActLayout, ActRow } from '../primitives'

/**
 * Multiple-choice decision panel. Resolves with the chosen option index.
 */
export function AskInteraction({ question, options }: AskProps) {
  return (
    <ActLayout question={question}>
      <ActRow>
        {options.map((o, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              blip(420 + i * 240)
              finishAct(i, 260)
            }}
          >
            <Icon name={o.icon} />
            <span>{o.label}</span>
          </button>
        ))}
      </ActRow>
    </ActLayout>
  )
}

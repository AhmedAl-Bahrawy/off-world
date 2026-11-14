import { useEffect } from 'react'
import { finishAct, type TilesProps } from '../../state/interactions'
import { blip } from '../../lib/audio'
import { bus } from '../../lib/bus'
import { useLitSet } from '../../lib/hooks'
import { ActLayout, ActRow, Tile } from '../primitives'

/**
 * "Fix everything" panels: every tile must be clicked once; each shows its
 * (usually grim) result note. Resolves when all are done.
 */
export function TilesInteraction({ question, items }: TilesProps) {
  const { add, has, size } = useLitSet()
  const complete = size === items.length

  useEffect(() => {
    if (!complete) return
    const t = setTimeout(() => finishAct(), 800)
    return () => clearTimeout(t)
  }, [complete])

  return (
    <ActLayout question={question}>
      <ActRow>
        {items.map((item, i) => (
          <Tile
            key={i}
            icon={item.icon}
            label={item.label}
            note={item.note}
            on={has(i)}
            pressed={has(i)}
            onClick={() => {
              if (has(i)) return
              add(i)
              blip(300 + i * 90)
              bus.emit('shake')
            }}
          />
        ))}
      </ActRow>
    </ActLayout>
  )
}

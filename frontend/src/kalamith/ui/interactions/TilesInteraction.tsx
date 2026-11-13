import { useEffect, useState } from 'react'
import { finishAct, type TilesProps } from '../../state/interactions'
import { blip } from '../../lib/audio'
import { bus } from '../../lib/bus'
import { Icon } from '../Icons'

/**
 * "Fix everything" panels: every tile must be clicked once; each shows its
 * (usually grim) result note. Resolves when all are done.
 */
export function TilesInteraction({ question, items }: TilesProps) {
  const [done, setDone] = useState<number[]>([])
  const complete = done.length === items.length

  useEffect(() => {
    if (!complete) return
    const t = setTimeout(() => finishAct(), 900)
    return () => clearTimeout(t)
  }, [complete])

  return (
    <>
      <p className="q">{question}</p>
      <div className="row">
        {items.map((item, i) => {
          const isDone = done.includes(i)
          return (
            <button
              key={i}
              className={`tile ${isDone ? 'done' : ''}`}
              onClick={() => {
                if (isDone) return
                setDone((d) => [...d, i])
                blip(300 + i * 90)
                bus.emit('shake')
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              <em>{isDone ? item.note : ''}</em>
            </button>
          )
        })}
      </div>
    </>
  )
}

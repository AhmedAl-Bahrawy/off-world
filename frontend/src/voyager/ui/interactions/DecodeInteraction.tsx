import { useEffect, useState } from 'react'
import { finishAct, type DecodeProps } from '../../state/interactions'
import { blip } from '../../lib/audio'
import { useLitSet, useTimeout } from '../../lib/hooks'
import { ActLayout, ActRow } from '../primitives'

/**
 * Signal decoder: words scroll through garbage glyphs until tapped; tapping
 * locks the real word in. Resolves when every word is decoded.
 */
const GLYPHS = '#@%&$?!*'
const scramble = (word: string) =>
  [...word].map(() => GLYPHS[(Math.random() * GLYPHS.length) | 0]).join('')
const SCRAMBLE_MS = 90

export function DecodeInteraction({ words }: DecodeProps) {
  const [texts, setTexts] = useState(() => words.map(scramble))
  const { litRef, add, has, size } = useLitSet()
  const finish = useTimeout()

  // Keep re-scrambling every undecoded word.
  useEffect(() => {
    const iv = setInterval(() => {
      setTexts((prev) => prev.map((t, i) => (litRef.current.has(i) ? t : scramble(words[i]))))
    }, SCRAMBLE_MS)
    return () => clearInterval(iv)
  }, [litRef, words])

  const tap = (i: number) => {
    if (has(i)) return
    add(i)
    setTexts((prev) => prev.map((t, j) => (j === i ? words[i] : t)))
    blip(500 + i * 50)

    if (size + 1 === words.length) {
      finish(() => finishAct(), 800)
    }
  }

  return (
    <ActLayout question="Tap each word to decode the signal.">
      <ActRow>
        {words.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`word ${has(i) ? 'lit' : ''}`}
            aria-pressed={has(i)}
            onClick={() => tap(i)}
          >
            {texts[i]}
          </button>
        ))}
      </ActRow>
    </ActLayout>
  )
}

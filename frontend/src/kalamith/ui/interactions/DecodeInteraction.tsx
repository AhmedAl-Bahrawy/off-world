import { useEffect, useRef, useState } from 'react'
import { finishAct, type DecodeProps } from '../../state/interactions'
import { blip } from '../../lib/audio'

/**
 * Signal decoder: words scroll through garbage glyphs until tapped; tapping
 * locks the real word in. Resolves when every word is decoded.
 */
const GLYPHS = '#@%&$?!*'
const scramble = (word: string) =>
  [...word].map(() => GLYPHS[(Math.random() * GLYPHS.length) | 0]).join('')

export function DecodeInteraction({ words }: DecodeProps) {
  const [texts, setTexts] = useState(() => words.map(scramble))
  const [lit, setLit] = useState<number[]>([])
  const litRef = useRef(new Set<number>())
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  // Keep re-scrambling every undecoded word.
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTexts((prev) => prev.map((t, i) => (litRef.current.has(i) ? t : scramble(words[i]))))
    }, 90)
    return () => clearInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tap = (i: number) => {
    if (litRef.current.has(i)) return
    litRef.current.add(i)
    setLit((cur) => [...cur, i])
    setTexts((prev) => prev.map((t, j) => (j === i ? words[i] : t)))
    blip(500 + i * 50)

    if (litRef.current.size === words.length) {
      clearInterval(intervalRef.current)
      setTimeout(() => finishAct(), 900)
    }
  }

  return (
    <>
      <p className="q">Tap each word to decode the signal.</p>
      <div className="row">
        {words.map((_, i) => (
          <button
            key={i}
            className={`word ${lit.includes(i) ? 'lit' : ''}`}
            onClick={() => tap(i)}
          >
            {texts[i]}
          </button>
        ))}
      </div>
    </>
  )
}

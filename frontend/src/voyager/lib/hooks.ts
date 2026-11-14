import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Timer + "lit state" primitives shared by the interaction components.
 * They exist so every mini-game clears its timers on unmount and tracks
 * selected tiles the same way — one implementation instead of eight.
 */

/**
 * Unmount-safe `setTimeout`. The returned setter works like a stable
 * callback: every pending timer is cleared automatically when the
 * component unmounts, so a delayed `finishAct()` can never fire on a
 * stale interaction window.
 */
export function useTimeout() {
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())
  useEffect(() => {
    const pending = timers.current
    return () => {
      for (const t of pending) clearTimeout(t)
      pending.clear()
    }
  }, [])
  return useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timers.current.delete(t)
      fn()
    }, ms)
    timers.current.add(t)
    return t
  }, [])
}

/**
 * Tracks "which of N items is lit/selected" for click-to-complete
 * interactions (repair tiles, keys, decoder). Exposes both the React
 * state array (for rendering) and a ref (for reading inside intervals
 * without re-subscribing).
 */
export function useLitSet() {
  const [lit, setLit] = useState<number[]>([])
  const litRef = useRef(new Set<number>())
  useEffect(() => {
    litRef.current = new Set(lit)
  }, [lit])

  const add = useCallback(
    (i: number) => setLit((cur) => (cur.includes(i) ? cur : [...cur, i])),
    [],
  )
  const clear = useCallback(() => setLit([]), [])
  const has = useCallback((i: number) => lit.includes(i), [lit])

  return { lit, litRef, add, clear, has, size: lit.length }
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useVoyager } from '../state/store'
import { RM } from '../lib/motion'

/**
 * The "MISSION DIRECTIVE" guidance layer.
 *
 * Rendered by the story before every major player step: a big typographic
 * banner (WHAT to do + WHY) that stays above the act window until the step
 * completes. Story-shaping moments get a full-screen splash first, which
 * then settles into the banner.
 *
 * Dismissal: click anywhere / Enter / Space fades it early; it also clears
 * automatically when the step completes (see `finishAct`).
 */
export function Directive() {
  const d = useVoyager((s) => s.directive)

  // Dismissal listeners exist only while a directive is on screen.
  useEffect(() => {
    if (!d?.on) return
    const dismiss = () => useVoyager.getState().hideDirective()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== ' ' && e.key !== 'Enter') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      // Never eat keys aimed at an interactive element (mini-games own them).
      const target = e.target as HTMLElement | null
      if (target?.closest('button, a, input, textarea, select')) return
      e.preventDefault()
      dismiss()
    }
    const onPointer = () => dismiss()
    addEventListener('keydown', onKey)
    addEventListener('pointerdown', onPointer)
    return () => {
      removeEventListener('keydown', onKey)
      removeEventListener('pointerdown', onPointer)
    }
  }, [d?.on])

  if (!d) return null

  return (
    <div
      className={`kx-directive is-${d.mode} ${d.on ? 'on' : ''}`}
      role="status"
      aria-live="polite"
      aria-hidden={!d.on}
    >
      <Inner key={d.key} mode={d.mode} kicker={d.kicker} title={d.title} why={d.why} />
    </div>
  )
}

function Inner({
  mode,
  kicker,
  title,
  why,
}: {
  mode: 'banner' | 'splash'
  kicker: string
  title: string
  why: string
}) {
  const root = useRef<HTMLDivElement>(null)

  // Entrance, scoped + reverted (same StrictMode-safe pattern as ChapterCard).
  // The splash animates its title per letter; the banner slides the three
  // lines in as a quick, snappy stack.
  useEffect(() => {
    if (RM) return
    const el = root.current!
    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll('.dx-kicker, .dx-why')
      if (mode === 'splash') {
        gsap.from(el.querySelectorAll('.dx-title span'), {
          y: 40,
          opacity: 0,
          rotateX: -70,
          stagger: 0.03,
          duration: 0.5,
          ease: 'back.out(1.8)',
        })
        gsap.from(lines, { y: 18, opacity: 0, duration: 0.4, stagger: 0.08 })
      } else {
        gsap.from(el.querySelectorAll('.dx-kicker, .dx-title, .dx-why'), {
          y: 20,
          opacity: 0,
          stagger: 0.06,
          duration: 0.42,
          ease: 'power3.out',
        })
      }
    }, el)
    return () => ctx.revert()
  }, [mode])

  return (
    <div className="dx" ref={root}>
      <small className="dx-kicker">{kicker}</small>
      <h2 className="dx-title">
        {[...title].map((ch, i) => (
          <span key={i}>{ch === ' ' ? '\u00A0' : ch}</span>
        ))}
      </h2>
      <p className="dx-why">{why}</p>
    </div>
  )
}

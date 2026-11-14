import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useVoyager } from '../state/store'
import { RM } from '../lib/motion'

/**
 * Full-screen chapter title splash ("THE COLLAPSE" ...). Each chapter remounts
 * the inner card (keyed) so the per-letter GSAP entrance replays.
 */
export function ChapterCard() {
  const card = useVoyager((s) => s.card)

  return (
    <div className={`kx-card ${card?.on ? 'on' : ''}`} aria-hidden={!card?.on}>
      {card && <CardInner key={card.key} subtitle={card.subtitle} title={card.title} />}
    </div>
  )
}

function CardInner({ subtitle, title }: { subtitle: string; title: string }) {
  const root = useRef<HTMLDivElement>(null)

  // Scoped via context + revert so StrictMode's second run can't reuse the
  // already-zeroed inline opacity as its "from" state (letters stuck dim).
  useEffect(() => {
    if (RM) return
    const el = root.current!
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('h1 span'), {
        y: 50,
        opacity: 0,
        rotateX: -90,
        stagger: 0.038,
        duration: 0.55,
        ease: 'back.out(2)',
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root}>
      <small>{subtitle}</small>
      <h1>
        {[...title].map((ch, i) => (
          <span key={i}>{ch === ' ' ? '\u00A0' : ch}</span>
        ))}
      </h1>
    </div>
  )
}

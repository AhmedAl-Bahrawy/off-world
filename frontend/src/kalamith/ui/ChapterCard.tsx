import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useKalamith } from '../state/store'
import { RM } from '../lib/motion'

/**
 * Full-screen chapter title splash ("THE COLLAPSE" ...). Each chapter remounts
 * the inner card (keyed) so the per-letter GSAP entrance replays.
 */
export function ChapterCard() {
  const card = useKalamith((s) => s.card)

  return (
    <div className={`kx-card ${card?.on ? 'on' : ''}`} aria-hidden={!card?.on}>
      {card && <CardInner key={card.key} subtitle={card.subtitle} title={card.title} />}
    </div>
  )
}

function CardInner({ subtitle, title }: { subtitle: string; title: string }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (RM) return
    const el = root.current!
    gsap.from(el.querySelectorAll('h1 span'), {
      y: 60,
      opacity: 0,
      rotateX: -90,
      stagger: 0.045,
      duration: 0.7,
      ease: 'back.out(2)',
    })
    gsap.from(el.querySelectorAll('.ln'), { scaleX: 0, duration: 0.8 })
  }, [])

  return (
    <div ref={root}>
      <small>{subtitle}</small>
      <h1>
        {[...title].map((ch, i) => (
          <span key={i} style={{ display: 'inline-block' }}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </h1>
      <span className="ln" />
    </div>
  )
}

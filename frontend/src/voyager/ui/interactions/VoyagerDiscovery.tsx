import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { finishAct } from '../../state/interactions'
import { useVoyager } from '../../state/store'
import { blip } from '../../lib/audio'
import { RM } from '../../lib/motion'
import { D } from '../../lib/anim'
import { VoyagerScene } from './voyager/VoyagerScene'
import { Ico, Slot } from './voyager/Ico'
import { IMAGES } from './voyager/assets'
import { SpaceBackdrop, Chip } from '../primitives'
import { PARTS, RECORD_CHIPS, makeCtl, type Mode, type PartId, type SceneApi } from './voyager/parts'
import { DIRECTIVES } from '../../story/dialogue'

const MARS_CHIPS = [
  { id: 'ice', icon: 'snowflake', label: 'ICE < 30 cm' },
  { id: 'water', icon: 'droplets', label: 'WATER' },
  { id: 'verify', icon: 'search', label: 'VERIFY' },
]

const setChapter = (text: string) => useVoyager.getState().setChapter(text)

/**
 * VOYAGER 1 // OBJECT RECOVERY
 * Full-screen R3F scene. Hold to power the dark object, explore it freely,
 * then fly to Mars. A tiny HTML layer carries only icons and a few words.
 */
export function VoyagerDiscovery() {
  const ctl = useMemo(() => makeCtl(), [])
  const apiRef = useRef<SceneApi | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const chargeEl = useRef<HTMLButtonElement>(null)
  const flashEl = useRef<HTMLDivElement>(null)
  const warpEl = useRef<HTMLDivElement>(null)
  const cardEl = useRef<HTMLDivElement>(null)
  const holdTween = useRef<gsap.core.Tween | null>(null)

  const [mode, setMode] = useState<Mode>('dark')
  const [active, setActive] = useState<PartId | null>(null)
  const [seen, setSeen] = useState<PartId[]>([])
  const [scanned, setScanned] = useState<string[]>([])
  const [chip, setChip] = useState<number | null>(null)

  const allSeen = seen.length === PARTS.length
  const allScanned = scanned.length === MARS_CHIPS.length

  /* ---------------- power ring ---------------- */

  const paint = useCallback(() => {
    chargeEl.current?.style.setProperty('--p', ctl.power.toFixed(3))
  }, [ctl])

  const reveal = useCallback(() => {
    if (ctl.mode !== 'dark') return
    ctl.mode = 'explore'
    setMode('explore')
    setChapter('VOYAGER 1 // IDENTIFIED')
    blip(880, 0.05)
    if (flashEl.current) gsap.fromTo(flashEl.current, { opacity: 0.85 }, { opacity: 0, duration: 1.3 * D, ease: 'power2.out' })
    apiRef.current?.overview()
  }, [ctl])

  const hold = useCallback(() => {
    if (ctl.mode !== 'dark') return
    holdTween.current?.kill()
    blip(300, 0.03)
    holdTween.current = gsap.to(ctl, {
      power: 1,
      duration: 2.2 * D || 0.01,
      ease: 'none',
      onUpdate: paint,
      onComplete: reveal,
    })
  }, [ctl, paint, reveal])

  const release = useCallback(() => {
    if (ctl.mode !== 'dark') return
    holdTween.current?.kill()
    holdTween.current = gsap.to(ctl, { power: 0, duration: 0.7 * D, ease: 'power2.out', onUpdate: paint })
  }, [ctl, paint])

  /* ---------------- exploring ---------------- */

  const pick = useCallback(
    (id: PartId) => {
      if (ctl.mode !== 'explore') return
      blip(520 + PARTS.findIndex((p) => p.id === id) * 60, 0.03)
      setActive(id)
      setSeen((s) => (s.includes(id) ? s : [...s, id]))
      apiRef.current?.focus(id)
    },
    [ctl],
  )

  const back = useCallback(() => {
    if (ctl.mode !== 'explore') return
    setActive(null)
    setChip(null)
    apiRef.current?.overview()
  }, [ctl])

  const onMiss = useCallback(() => {
    if (ctl.focus) back()
  }, [ctl, back])

  const goMars = () => {
    if (ctl.mode !== 'explore') return
    blip(220, 0.05)
    setActive(null)
    setMode('transit')
    setChapter('TRANSIT // MARS')
    if (warpEl.current) {
      gsap
        .timeline()
        .to(warpEl.current, { opacity: 1, duration: 1.8 * D, ease: 'power2.in' })
        .to(warpEl.current, { opacity: 0, duration: 2.6 * D, ease: 'power2.out' }, '>+0.6')
    }
    apiRef.current?.toMars(() => {
      setMode('mars')
      setChapter('TARGET // MARS')
      blip(660, 0.05)
      // Mission directive for the Mars phase. Splash-only: the full-screen
      // scene owns the whole viewport, so a lingering banner would sit on
      // top of its own title. It auto-hides (or a click dismisses it early).
      const { kicker, title, why } = DIRECTIVES.mars
      useVoyager.getState().showDirective({ kicker, title, why, mode: 'splash' })
      window.setTimeout(
        () => useVoyager.getState().hideDirective(),
        RM ? 1200 : 2600,
      )
    })
  }

  const scan = (id: string) => {
    blip(700, 0.03)
    setScanned((s) => (s.includes(id) ? s : [...s, id]))
  }

  /* ---------------- effects ---------------- */

  // Keyboard: Space/Enter holds the power ring, Escape leaves a focused part.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (ctl.mode === 'dark' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault()
        hold()
      } else if (e.code === 'Escape') back()
    }
    const up = (e: KeyboardEvent) => {
      if (ctl.mode === 'dark' && (e.code === 'Space' || e.code === 'Enter')) release()
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [ctl, hold, release, back])

  // Entrance + cleanup.
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (RM) return
      gsap.from('.vy-charge', { scale: 0.6, opacity: 0, duration: 0.9, delay: 0.5, ease: 'back.out(1.6)' })
    }, root)
    return () => {
      ctx.revert()
      holdTween.current?.kill()
      gsap.killTweensOf(ctl)
      document.body.style.cursor = ''
    }
  }, [ctl])

  // Caption card entrance.
  useEffect(() => {
    if (!active || RM || !cardEl.current) return
    gsap.fromTo(cardEl.current, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
    gsap.from(cardEl.current.querySelectorAll('.vy-chip, .vy-slot'), {
      y: 14,
      opacity: 0,
      stagger: 0.07,
      delay: active === 'record' ? 1.1 : 0.2,
      duration: 0.45,
    })
  }, [active])

  const part = PARTS.find((p) => p.id === active) ?? null
  const title =
    mode === 'dark' ? 'UNKNOWN OBJECT' : mode === 'mars' ? 'MARS' : mode === 'transit' ? 'EN ROUTE' : 'VOYAGER 1'
  const sub =
    mode === 'dark' ? 'NO SIGNAL' : mode === 'mars' ? 'ARCADIA PLANITIA' : mode === 'transit' ? '' : 'LAUNCHED 1977'

  return (
    <div className="vy" ref={root} data-mode={mode}>
      {/* Shared deep-space backdrop. The Milky Way is drawn once, by the
          backdrop itself, so it never doubles up with the reference frames. */}
      <SpaceBackdrop art="/assets/images/milky-way.jpg" dim />

      <VoyagerScene ctl={ctl} apiRef={apiRef} onPick={pick} onMiss={onMiss} />

      <div className="vy-flash" ref={flashEl} aria-hidden="true" />
      <div className="vy-warp" ref={warpEl} aria-hidden="true" />

      <div className="vy-ui">
        <div className="vy-title" key={mode}>
          {sub && <small>{sub}</small>}
          <h2>{title}</h2>
        </div>

        {/* Hotspots (positioned every frame by the 3D scene) */}
        {PARTS.map((p) => (
          <div
            key={p.id}
            className="vy-hotwrap"
            ref={(el) => {
              ctl.hotEls[p.id] = el
            }}
          >
            <button
              type="button"
              className={`vy-hot ${seen.includes(p.id) ? 'seen' : ''} ${active === p.id ? 'on' : ''}`}
              aria-label={p.label}
              onClick={() => pick(p.id)}
              onPointerEnter={() => {
                ctl.hover = p.id
              }}
              onPointerLeave={() => {
                if (ctl.hover === p.id) ctl.hover = null
              }}
            >
              <i />
              <Ico n={p.icon} />
              <span>{p.label}</span>
            </button>
          </div>
        ))}

        {/* 1 · Power up */}
        {mode === 'dark' && (
          <button
            type="button"
            ref={chargeEl}
            className="vy-charge"
            aria-label="Hold to power the object"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              hold()
            }}
            onPointerUp={release}
            onPointerCancel={release}
          >
            <Ico n="zap" />
            <b>HOLD</b>
          </button>
        )}

        {/* What to do next, always on screen. */}
        {mode === 'dark' && (
          <p className="vy-hint vy-hint-center">
            <Ico n="zap" /> HOLD TO POWER THE OBJECT
          </p>
        )}

        {/* 2 · Explore */}
        {mode === 'explore' && (
          <>
            <Slot src={IMAGES.voyager} label="REF" className="vy-ref" />

            {part && (
              <div className="vy-card" ref={cardEl} data-part={part.id}>
                <button type="button" className="vy-x" onClick={back} aria-label="Back to overview">
                  <Ico n="x" />
                </button>
                <div className="vy-card-head">
                  <span className="vy-badge">
                    <Ico n={part.icon} />
                  </span>
                  <div>
                    <h3>{part.label}</h3>
                    <p>{part.fact}</p>
                  </div>
                </div>
                {part.id === 'record' && (
                  <div className="vy-record">
                    <Slot src={IMAGES.record} label="RECORD · COVER" className="vy-record-img" />
                    <div className="vy-chips">
                      {RECORD_CHIPS.map((c, i) => (
                        <Chip
                          key={c.icon}
                          icon={<Ico n={c.icon} />}
                          label={c.label}
                          on={chip === i}
                          onClick={() => {
                            setChip(i)
                            blip(400 + i * 120, 0.03)
                          }}
                        >
                          <u aria-hidden="true">
                            <s /><s /><s /><s />
                          </u>
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <nav className="vy-pips" aria-label="Components">
              {PARTS.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  className={`${seen.includes(p.id) ? 'seen' : ''} ${active === p.id ? 'on' : ''}`}
                  onClick={() => pick(p.id)}
                  aria-label={p.label}
                >
                  <Ico n={p.icon} />
                </button>
              ))}
              <em aria-hidden="true">
                {seen.length}/{PARTS.length}
              </em>
            </nav>

            <p className="vy-hint">
              <Ico n="move" /> DRAG TO ORBIT <span>·</span> SELECT A COMPONENT
            </p>

            {allSeen && !active && (
              <button type="button" className="vy-go" onClick={goMars}>
                <span>MARS</span>
                <Ico n="arrow-right" />
              </button>
            )}
          </>
        )}

        {/* 3 · Mars */}
        {(mode === 'mars' || mode === 'transit') && (
          <div
            className="vy-pin"
            ref={(el) => {
              ctl.marsPin = el
            }}
          >
            <i />
            <b>ARCADIA PLANITIA</b>
            <small>46°N · 193°E</small>
          </div>
        )}

        {mode === 'mars' && (
          <>
            <Slot src={IMAGES.paleBlueDot} label="HOME" className="vy-ref vy-home" />
            <div className="vy-mars-chips">
              {MARS_CHIPS.map((c) => (
                <Chip
                  key={c.id}
                  big
                  icon={<Ico n={scanned.includes(c.id) ? 'check' : c.icon} />}
                  label={c.label}
                  on={scanned.includes(c.id)}
                  onClick={() => scan(c.id)}
                />
              ))}
            </div>
            {allScanned && (
              <button type="button" className="vy-go" onClick={() => finishAct()}>
                <span>ARCHIVE</span>
                <Ico n="arrow-right" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

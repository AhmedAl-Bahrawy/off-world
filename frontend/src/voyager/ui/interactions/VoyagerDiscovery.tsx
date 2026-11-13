import { useState } from 'react'
import { finishAct } from '../../state/interactions'
import { useVoyager } from '../../state/store'

const STEP_META = [
  { id: '1.1', title: 'Unknown object' },
  { id: '1.2', title: 'Power scan' },
  { id: '1.3', title: 'Identity' },
  { id: '1.4', title: 'Inspect' },
  { id: '1.5', title: 'Golden Record' },
  { id: '1.6', title: 'Record contents' },
  { id: '1.7', title: 'Compare signals' },
  { id: '1.8', title: 'Decision' },
]

const NASA_VOYAGER = 'https://science.nasa.gov/mission/voyager/voyager-1/'
const NASA_INSTRUMENTS = 'https://science.nasa.gov/mission/voyager/instruments/'
const NASA_RECORD = 'https://science.nasa.gov/mission/voyager/golden-record-contents/'
const NASA_RECORD_OVERVIEW = 'https://science.nasa.gov/mission/voyager/voyager-golden-record-overview/'
const NASA_JPL_GALLERY = 'https://www.jpl.nasa.gov/voyager-image-gallery/'
const NASA_JPL_UPDATE = 'https://www.jpl.nasa.gov/news/nasas-voyager-1-resumes-sending-engineering-updates-to-earth/'
const NASA_MARS_ICE = 'https://www.nasa.gov/solar-system/nasas-treasure-map-for-water-ice-on-mars/'

const SPACECRAFT_VIEWS = [
  {
    label: 'NASA spacecraft rendering',
    shortLabel: 'NASA VIEW',
    src: '/visuals/voyager/voyager-nasa-render.jpg',
    alt: 'NASA illustration of the Voyager spacecraft in space',
    credit: 'NASA/JPL-Caltech',
    source: NASA_VOYAGER,
  },
  {
    label: 'Voyager spacecraft view',
    shortLabel: 'JPL VIEW',
    src: '/visuals/voyager/voyager-jpl-gallery.jpg',
    alt: 'Voyager spacecraft rendering from the NASA JPL image gallery',
    credit: 'NASA/JPL-Caltech',
    source: NASA_JPL_GALLERY,
  },
  {
    label: 'Interstellar mission illustration',
    shortLabel: 'MISSION ART',
    src: '/visuals/voyager/voyager-jpl-illustration.jpg',
    alt: 'Voyager 1 spacecraft illustration from a NASA JPL mission update',
    credit: 'NASA/JPL-Caltech',
    source: NASA_JPL_UPDATE,
  },
  {
    label: 'Voyager instrument location diagram',
    shortLabel: 'INSTRUMENTS',
    src: '/visuals/voyager/voyager-instruments.jpg',
    alt: 'NASA diagram labeling Voyager spacecraft instruments and antenna booms',
    credit: 'NASA/JPL-Caltech',
    source: NASA_INSTRUMENTS,
  },
]

export function VoyagerDiscovery() {
  const [step, setStep] = useState(0)
  const [unlocked, setUnlocked] = useState(0)
  const [marsRevealed, setMarsRevealed] = useState(false)

  const goTo = (next: number) => {
    const safeStep = Math.max(0, Math.min(STEP_META.length - 1, next))
    setStep(safeStep)
    setUnlocked((current) => Math.max(current, safeStep))
    useVoyager.getState().setChapter(`${STEP_META[safeStep].id} // ${STEP_META[safeStep].title.toUpperCase()}`)
  }

  const revealMars = () => {
    setMarsRevealed(true)
    useVoyager.getState().setScene('mars')
    useVoyager.getState().setChapter('TARGET // MARS')
  }

  return (
    <div className="voyager-mission" aria-live="polite">
      {!marsRevealed ? (
        <>
          <div className="voyager-mission-head">
            <div>
              <p className="mission-eyebrow">ARCHIVE-9 VECTOR · STORY ROUTE</p>
              <h2>{STEP_META[step].id} <span>{STEP_META[step].title}</span></h2>
            </div>
            <p className="mission-counter">{step + 1} / 8</p>
          </div>

          <nav className="mission-progress" aria-label="Voyager investigation steps">
            {STEP_META.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={index === step ? 'current' : index < step ? 'complete' : ''}
                disabled={index > unlocked}
                aria-current={index === step ? 'step' : undefined}
                onClick={() => goTo(index)}
              >
                <small>{item.id}</small>
                <span>{item.title}</span>
              </button>
            ))}
          </nav>

          <div className="voyager-stages">
            <section className="voyager-stage" hidden={step !== 0}>
              <div className="unknown-stage-grid">
                <UnknownObjectFrame />
                <div className="crew-lines">
                  <p><b>COMMAND</b><span>Hold position. No active signal.</span></p>
                  <p><b>SCIENCE</b><span>One large antenna. The scan is incomplete.</span></p>
                  <div className="archive-vector">
                    <small>ARCHIVE-9 · NAVIGATION FIX</small>
                    <strong>17h 13m 42s&nbsp; / &nbsp;+12° 44′</strong>
                    <span>0.014 light-years from Earth · reconstructed at archive epoch 2235</span>
                    <em>Fictional story coordinates, not a live NASA ephemeris.</em>
                  </div>
                  <button type="button" className="mission-primary" onClick={() => goTo(1)}>
                    BEGIN POWER SCAN <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </section>

            <section className="voyager-stage" hidden={step !== 1}>
              <div className="stage-copy">
                <p>Route power through the cores to clear the image.</p>
                <span>Connect the start node to the exit. A wrong link resets the trace.</span>
              </div>
              <PowerCorePuzzle onComplete={() => goTo(2)} />
            </section>

            <section className="voyager-stage" hidden={step !== 2}>
              <div className="stage-copy">
                <p>The recovered key is yours to use.</p>
                <span>Decode the transmission, then enter the identity.</span>
              </div>
              <CipherPuzzle onComplete={() => goTo(3)} />
            </section>

            <section className="voyager-stage" hidden={step !== 3}>
              <div className="stage-copy">
                <p>Examine the craft. Select every marked component.</p>
                <span>These mission facts come from NASA's published Voyager record.</span>
              </div>
              <VoyagerInspection onComplete={() => goTo(4)} />
            </section>

            <section className="voyager-stage" hidden={step !== 4}>
              <div className="stage-copy">
                <p>Correct the viewing angle until the disc is circular.</p>
                <span>This alignment lock is fictional; the Golden Record itself is real.</span>
              </div>
              <GoldenRecordPuzzle onComplete={() => goTo(5)} />
            </section>

            <section className="voyager-stage" hidden={step !== 5}>
              <div className="stage-copy">
                <p>A message about a world—not a machine manual.</p>
                <span>Open a recovered media category. Original recordings are optional assets.</span>
              </div>
              <RecordContents onContinue={() => goTo(6)} />
            </section>

            <section className="voyager-stage" hidden={step !== 6}>
              <div className="stage-copy">
                <p>Compare the two signals.</p>
                <span>Which one was designed as a portrait of Earth?</span>
              </div>
              <SignalComparison onComplete={() => goTo(7)} />
            </section>

            <section className="voyager-stage" hidden={step !== 7}>
              <div className="stage-copy">
                <p>The archive has one final cross-reference.</p>
                <span>Its Mars survey marks a possible water-ice region.</span>
              </div>
              <div className="decision-panel">
                <div className="decision-coordinates">
                  <small>ARCHIVE CROSS-REFERENCE</small>
                  <strong>ARCADIA PLANITIA · MARS</strong>
                  <span>Northern mid-latitudes · approximate story waypoint</span>
                </div>
                <p><b>COMMANDER</b> The record tells us who they were. The archive shows where we might find what they needed.</p>
                <button type="button" className="mission-primary" onClick={revealMars}>
                  SET COURSE FOR MARS <span aria-hidden="true">→</span>
                </button>
              </div>
            </section>
          </div>
        </>
      ) : (
        <MarsReveal onComplete={() => finishAct()} />
      )}
    </div>
  )
}

function UnknownObjectFrame() {
  const [viewIndex, setViewIndex] = useState(0)
  const views = SPACECRAFT_VIEWS.slice(0, 3)
  const view = views[viewIndex] ?? views[0]

  return (
    <div className="unknown-object-frame">
      <img className="unknown-object-image" src={view.src} alt="A partially obscured unidentified spacecraft" />
      <div className="unknown-reticle" aria-hidden="true" />
      <span>UNIDENTIFIED OBJECT · VISUAL ECHO {viewIndex + 1}</span>
      <div className="unknown-view-picker" role="group" aria-label="Unidentified object image echoes">
        {views.map((item, index) => (
          <button type="button" key={item.src} className={index === viewIndex ? 'selected' : ''} aria-label={`Show image echo ${index + 1}`} aria-pressed={index === viewIndex} onClick={() => setViewIndex(index)}>
            <img src={item.src} alt="" loading="lazy" />
            <small>FRAME 0{index + 1}</small>
          </button>
        ))}
      </div>
      <small className="unknown-image-credit">NASA / JPL visual references</small>
    </div>
  )
}

function PowerCorePuzzle({ onComplete }: { onComplete: () => void }) {
  const route = [0, 1, 4, 7, 8]
  const [path, setPath] = useState<number[]>([])
  const [solved, setSolved] = useState(false)
  const [message, setMessage] = useState('Start at 01. Route through the central cores to 09.')

  const selectCore = (index: number) => {
    if (solved || path.includes(index)) return
    if (index !== route[path.length]) {
      setPath([])
      setMessage('Signal lost. The trace reset—try again.')
      return
    }
    const next = [...path, index]
    setPath(next)
    if (next.length === route.length) {
      setSolved(true)
      setMessage('IMAGE RESOLVED · 98%')
    } else {
      setMessage(`Core ${String(index + 1).padStart(2, '0')} locked · ${next.length}/5`)
    }
  }

  return (
    <div className="power-puzzle">
      <div className={`scan-preview scan-${path.length} ${solved ? 'resolved' : ''}`}>
        <img className="scan-voyager-image" src="/visuals/voyager/voyager-nasa-render.jpg" alt="" />
        <span>{solved ? 'SIGNAL RESOLVED' : `IMAGE CLEARANCE ${Math.round((path.length / route.length) * 98)}%`}</span>
      </div>
      <div className="core-console">
        <div className="core-grid" role="group" aria-label="Power core routing grid">
          {Array.from({ length: 9 }, (_, index) => {
            const isStart = index === 0
            const isExit = index === 8
            const active = path.includes(index)
            return (
              <button
                type="button"
                key={index}
                className={`core-node ${active ? 'linked' : ''} ${isStart ? 'start' : ''} ${isExit ? 'exit' : ''}`}
                aria-label={`Core ${String(index + 1).padStart(2, '0')}${isStart ? ', start' : ''}${isExit ? ', exit' : ''}${active ? ', connected' : ''}`}
                onClick={() => selectCore(index)}
                disabled={solved}
              >
                {isStart ? 'IN' : isExit ? 'OUT' : String(index + 1).padStart(2, '0')}
              </button>
            )
          })}
        </div>
        <p className="puzzle-status" aria-live="polite">{message}</p>
        <details className="puzzle-hint">
          <summary>Need a hint?</summary>
          <p>Go right once, then down through the center column. Leave from the lower-right core.</p>
        </details>
        {solved && <button type="button" className="mission-primary compact-primary" onClick={onComplete}>CONTINUE TO IDENTITY <span aria-hidden="true">→</span></button>}
      </div>
    </div>
  )
}

function CipherPuzzle({ onComplete }: { onComplete: () => void }) {
  const [answer, setAnswer] = useState('')
  const [solved, setSolved] = useState(false)
  const [message, setMessage] = useState('')
  const pairs = [
    ['⟠', 'V'], ['⌘', 'O'], ['⋔', 'Y'], ['⊖', 'A'], ['⋮', 'G'], ['⍙', 'E'], ['⟡', 'R'],
  ]

  const decode = () => {
    const normalized = answer.replace(/\s+/g, '').toUpperCase()
    if (normalized !== 'VOYAGER1') {
      setMessage('That sequence does not match the recovered key. Try again.')
      return
    }
    setSolved(true)
    setMessage('IDENTIFICATION RECOVERED: VOYAGER 1')
  }

  return (
    <div className="cipher-console">
      <div className="glyph-string" aria-label="Fictional glyph sequence">⟠ &nbsp;⌘ &nbsp;⋔ &nbsp;⊖ &nbsp;⋮ &nbsp;⍙ &nbsp;⟡ &nbsp;· &nbsp;1</div>
      <div className="cipher-key" aria-label="Recovered fictional key">
        {pairs.map(([glyph, letter]) => <span key={glyph}><i>{glyph}</i><b>{letter}</b></span>)}
      </div>
      <form className="cipher-entry" onSubmit={(event) => { event.preventDefault(); decode() }}>
        <label htmlFor="voyager-cipher-answer">Decoded identity</label>
        <div>
          <input
            id="voyager-cipher-answer"
            autoComplete="off"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="VOYAGER 1"
            aria-describedby="cipher-message"
          />
          <button type="submit" disabled={solved}>DECODE</button>
        </div>
        <small id="cipher-message" className={solved ? 'success-copy' : 'puzzle-status'} aria-live="polite">{message || 'Use the recovered key to enter the name.'}</small>
      </form>
      {solved && <blockquote className="science-reveal"><small>SCIENCE OFFICER</small>“Voyager One. A name, not a warning.”</blockquote>}
      {solved && <button type="button" className="mission-primary compact-primary" onClick={onComplete}>CONTINUE TO COMPONENT SCAN <span aria-hidden="true">→</span></button>}
      <details className="education-note">
        <summary>About this cipher</summary>
        <p>The glyphs are invented for this game. They are not markings on Voyager or the real Golden Record.</p>
      </details>
    </div>
  )
}

const INSPECTION_FACTS = [
  {
    id: 'antenna',
    label: 'High-gain antenna · 3.7 m',
    position: { left: '37%', top: '37%' },
    fact: 'The dish pointed toward Earth and carried commands and science data across interplanetary distances.',
  },
  {
    id: 'platform',
    label: 'Scan platform',
    position: { left: '27%', top: '24%' },
    fact: 'Cameras and other remote-sensing instruments were mounted on a movable scan platform.',
  },
  {
    id: 'bus',
    label: 'Spacecraft bus',
    position: { left: '29%', top: '43%' },
    fact: 'The central bus housed engineering subsystems, electronics, and control equipment.',
  },
  {
    id: 'rtg',
    label: 'Three RTGs',
    position: { left: '34%', top: '61%' },
    fact: 'Three radioisotope thermoelectric generators produced electricity from heat. Their available power declines over time.',
  },
  {
    id: 'magnetometer',
    label: 'Magnetometer boom',
    position: { left: '78%', top: '77%' },
    fact: 'The long boom carries a magnetic-field sensor away from the spacecraft body for measurements in space.',
  },
  {
    id: 'record',
    label: 'Golden Record',
    position: { left: '32%', top: '47%' },
    fact: 'Each Voyager carries a 30-centimeter gold-plated copper record with playback and location instructions on its cover.',
  },
]

function VoyagerInspection({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState(INSPECTION_FACTS[0].id)
  const [seen, setSeen] = useState<string[]>([])
  const [viewIndex, setViewIndex] = useState(0)
  const view = SPACECRAFT_VIEWS[viewIndex] ?? SPACECRAFT_VIEWS[0]
  const selectedFact = INSPECTION_FACTS.find((fact) => fact.id === selected) ?? INSPECTION_FACTS[0]

  const inspect = (id: string) => {
    setSelected(id)
    if (seen.includes(id)) return
    setSeen([...seen, id])
  }

  return (
    <div className="inspection-layout">
      <div className="voyager-image-column">
        <figure className="voyager-image-slot">
          <img key={view.src} src={view.src} alt={view.alt} />
          {viewIndex === 0 && INSPECTION_FACTS.map((fact) => (
            <button
              key={fact.id}
              type="button"
              className={`inspection-hotspot ${selected === fact.id ? 'active' : ''} ${seen.includes(fact.id) ? 'visited' : ''}`}
              style={fact.position}
              aria-label={`Inspect ${fact.label}`}
              aria-pressed={selected === fact.id}
              onClick={() => inspect(fact.id)}
            >
              <span>{seen.includes(fact.id) ? '✓' : '+'}</span>
            </button>
          ))}
          <figcaption>{view.label} · Credit: {view.credit}</figcaption>
        </figure>
        <div className="voyager-image-picker" role="group" aria-label="Voyager image gallery">
          {SPACECRAFT_VIEWS.map((item, index) => (
            <button type="button" key={item.src} className={index === viewIndex ? 'selected' : ''} aria-pressed={index === viewIndex} onClick={() => setViewIndex(index)}>
              <img src={item.src} alt="" loading="lazy" />
              <span>{item.shortLabel}</span>
            </button>
          ))}
        </div>
        <SourceLink href={view.source}>{`Image source · ${view.credit}`}</SourceLink>
      </div>
      <div className="inspection-details">
        <p className="mission-eyebrow">NASA MISSION RECORD</p>
        <div className="inspection-components" role="group" aria-label="Voyager components">
          {INSPECTION_FACTS.map((fact) => (
            <button type="button" key={fact.id} className={selected === fact.id ? 'selected' : ''} aria-pressed={selected === fact.id} onClick={() => inspect(fact.id)}>
              <span>{fact.label}</span><i>{seen.includes(fact.id) ? '✓' : '＋'}</i>
            </button>
          ))}
        </div>
        <h3>{selectedFact.label}</h3>
        <p>{selectedFact.fact}</p>
        <div className="history-strip">
          <span><b>1977</b> Launched</span>
          <span><b>1979</b> Jupiter flyby</span>
          <span><b>1980</b> Saturn flyby</span>
        </div>
        <p className="inspection-progress">{seen.length} / {INSPECTION_FACTS.length} components examined</p>
        <SourceLink href={NASA_INSTRUMENTS}>NASA · Voyager instrument details</SourceLink>
        {seen.length === INSPECTION_FACTS.length && <button type="button" className="mission-primary compact-primary" onClick={onComplete}>CONTINUE TO THE RECORD <span aria-hidden="true">→</span></button>}
      </div>
    </div>
  )
}

function GoldenRecordPuzzle({ onComplete }: { onComplete: () => void }) {
  const [correction, setCorrection] = useState(35)
  const [opened, setOpened] = useState(false)
  const scaleY = 0.45 + correction / 180

  const tune = (value: number) => {
    setCorrection(value)
    if (value >= 98 && !opened) {
      setOpened(true)
    }
  }

  return (
    <div className="record-alignment">
      <div className="record-visual-wrap">
        <div className="golden-disc" style={{ transform: `scaleY(${scaleY})` }} aria-label="Golden record alignment preview">
          <i /><b /><em />
        </div>
        <span className="alignment-readout">{opened ? 'COVER RELEASED' : `ELLIPSE CORRECTION · ${correction}%`}</span>
      </div>
      <div className="alignment-controls">
        <label htmlFor="record-correction">Adjust image correction</label>
        <input id="record-correction" type="range" min="0" max="100" value={correction} onChange={(event) => tune(Number(event.target.value))} />
        <div className="range-labels"><span>ELLIPSE</span><span>CIRCLE</span></div>
        <p>NASA's real record is 12 inches (30 cm), gold-plated copper. This slider lock is fictional.</p>
        <SourceLink href="https://science.nasa.gov/mission/voyager/voyager-golden-record-overview/">NASA · Golden Record overview</SourceLink>
        {opened && <p className="success-copy">COVER RELEASED · media archive available</p>}
        {opened && <button type="button" className="mission-primary compact-primary" onClick={onComplete}>OPEN THE RECORD <span aria-hidden="true">→</span></button>}
      </div>
      <div className="record-evidence-gallery">
        <figure>
          <img src="/visuals/voyager/golden-record-front-and-cover.jpeg" alt="NASA image showing the Golden Record and its engraved protective cover" loading="lazy" />
          <figcaption>Golden Record &amp; cover · <a href={NASA_RECORD_OVERVIEW} target="_blank" rel="noreferrer">NASA Science</a></figcaption>
        </figure>
        <figure>
          <img src="/visuals/voyager/golden-record-on-spacecraft.jpeg" alt="NASA illustration of the Golden Record mounted on a Voyager spacecraft" loading="lazy" />
          <figcaption>Record mounted on Voyager · <a href={NASA_RECORD_OVERVIEW} target="_blank" rel="noreferrer">NASA/JPL-Caltech</a></figcaption>
        </figure>
      </div>
    </div>
  )
}

const RECORD_MEDIA = [
  { id: 'images', title: '115 images', subtitle: 'Analog frames', asset: 'public/media/voyager/record-images/' },
  { id: 'greetings', title: '55 greetings', subtitle: 'Languages of Earth', asset: 'public/media/voyager/greetings.mp3' },
  { id: 'sounds', title: 'Earth sounds', subtitle: 'Surf · wind · animals', asset: 'public/media/voyager/earth-sounds.mp3' },
  { id: 'music', title: '90 min music', subtitle: 'Across cultures and eras', asset: 'public/media/voyager/music-selection.mp3' },
]

function RecordContents({ onContinue }: { onContinue: () => void }) {
  const [active, setActive] = useState(RECORD_MEDIA[0].id)
  const item = RECORD_MEDIA.find((media) => media.id === active) ?? RECORD_MEDIA[0]

  return (
    <div className="record-content-panel">
      <div className="media-grid">
        {RECORD_MEDIA.map((media) => (
          <button type="button" key={media.id} className={active === media.id ? 'selected' : ''} aria-pressed={active === media.id} onClick={() => setActive(media.id)}>
            <small>RECOVERED CATEGORY</small>
            <strong>{media.title}</strong>
            <span>{media.subtitle}</span>
          </button>
        ))}
      </div>
      <div className="media-asset-slot">
        <span className="asset-status">ASSET PLACEHOLDER</span>
        <div><b>{item.title}</b><span>{item.asset}</span></div>
        <p>Placeholder path only. Add an approved source file, then connect its player in this component.</p>
      </div>
      <SourceLink href={NASA_RECORD}>NASA · Golden Record contents</SourceLink>
      <button type="button" className="mission-primary compact-primary" onClick={onContinue}>COMPARE WITH THE DISTRESS CALL <span aria-hidden="true">→</span></button>
    </div>
  )
}

function SignalComparison({ onComplete }: { onComplete: () => void }) {
  const [choice, setChoice] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const choose = (id: string) => {
    setChoice(id)
    setConfirmed(id === 'portrait')
  }

  return (
    <div className="signal-comparison">
      <div className="signal-card distress-card">
        <small>FICTIONAL DISTRESS CALL</small>
        <blockquote>“THIS IS HUMANITY. WE ARE DYING. PLEASE HELP.”</blockquote>
      </div>
      <div className="signal-card record-card">
        <small>REAL GOLDEN RECORD</small>
        <blockquote>Greetings, music, Earth sounds and images—selected to portray life and culture.</blockquote>
      </div>
      <p className="comparison-question">Which signal is the portrait of Earth?</p>
      <div className="comparison-options">
        <button type="button" className={choice === 'rescue' ? 'wrong' : ''} onClick={() => choose('rescue')}>A request for rescue</button>
        <button type="button" className={choice === 'portrait' ? 'correct' : ''} onClick={() => choose('portrait')}>A message about a world</button>
      </div>
      <p className={confirmed ? 'success-copy' : 'puzzle-status'} aria-live="polite">
        {confirmed ? 'Correct. The real record is a cultural time capsule—not the story’s distress signal.' : choice ? 'Not quite. Compare the voices: plea versus portrait.' : 'Choose the message that preserves a portrait of Earth.'}
      </p>
      {confirmed && <button type="button" className="mission-primary compact-primary" onClick={onComplete}>CONTINUE TO THE DECISION <span aria-hidden="true">→</span></button>}
      <details className="education-note">
        <summary>Historical note</summary>
        <p>The story's distress call is invented. NASA describes the Golden Record as a time capsule containing selected sounds and images.</p>
      </details>
    </div>
  )
}

function MarsReveal({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="mars-reveal">
      <div className="mars-reveal-head">
        <p className="mission-eyebrow">ARCHIVE-9 CROSS-REFERENCE · TARGET FOUND</p>
        <h2>MARS <span>ARCADIA PLANITIA</span></h2>
      </div>
      <div className="mars-destination-grid">
        <figure className="mars-image-card">
          <img src="/visuals/mars-nasa.jpg" alt="A full-disk view of Mars from NASA Science" />
          <figcaption>NASA Science · Mars global view</figcaption>
        </figure>
        <div className="mars-location-card">
          <small>SEARCH SECTOR</small>
          <strong>Arcadia Planitia</strong>
          <span>Northern mid-latitudes · approx. 46°N, 193°E</span>
          <em>Illustrative story waypoint inside a broad candidate region—not a NASA landing coordinate.</em>
          <div className="resource-scan-status"><i /> ORBITAL ICE SIGNAL · CANDIDATE</div>
        </div>
      </div>
      <div className="resource-findings">
        <article>
          <small>RESOURCE PROSPECT</small>
          <h3>Subsurface water ice</h3>
          <p>NASA mapping identifies shallow ice in parts of Arcadia Planitia; some mapped deposits may lie under 30 cm of surface material.</p>
        </article>
        <article>
          <small>WHY IT MATTERS</small>
          <h3>Water · possible propellant feedstock</h3>
          <p>Useful if confirmed and extracted. This is an orbital prospect, not proof of an accessible or usable reserve.</p>
        </article>
        <article>
          <small>NEXT ACTION</small>
          <h3>Verify on site</h3>
          <p>Survey the regolith and measure the deposit before any resource claim.</p>
        </article>
      </div>
      <div className="mars-source-row">
        <SourceLink href={NASA_MARS_ICE}>NASA · Mars shallow-ice map</SourceLink>
        <a href="https://science.nasa.gov/mars/" target="_blank" rel="noreferrer">NASA · Mars overview</a>
      </div>
      <p className="closing-line">The distress call brought them to Earth. The record gave them a reason to keep looking.</p>
      <button type="button" className="mission-primary compact-primary" onClick={onComplete}>ARCHIVE THIS DISCOVERY <span aria-hidden="true">→</span></button>
    </div>
  )
}

function SourceLink({ href, children }: { href: string; children: string }) {
  return <a className="source-link" href={href} target="_blank" rel="noreferrer">{children} ↗</a>
}

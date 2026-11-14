import Header from "./components/Header";
import Panel from "./components/Panel";
import ArtPlaceholder from "./components/ArtPlaceholder";
import FactLabel from "./components/FactLabel";
import SourceCitation from "./components/SourceCitation";
import FeaturedTransmission from "./components/FeaturedTransmission";
import LatestTransmissions from "./components/LatestTransmissions";
import ExpeditionBriefing from "./components/ExpeditionBriefing";
import SignalStatus from "./components/SignalStatus";
import ChapterCard from "./components/ChapterCard";
import ArtifactCard from "./components/ArtifactCard";
import InstrumentAccordion from "./components/InstrumentAccordion";
import MissionTimeline from "./components/MissionTimeline";
import ArchiveMap from "./components/ArchiveMap";
import GoldenRecordPanel from "./components/GoldenRecordPanel";
import StorySection from "./components/StorySection";
import FieldNotes from "./components/FieldNotes";
import SiteFooter from "./components/SiteFooter";

import { chapters, arrival } from "./data/chapters";
import { voyagerInstruments, marsInstruments } from "./data/instruments";
import { artifacts, sources } from "./data/archive";
import { archiveLinks } from "./data/home";

function StoryBlocks({ blocks, tall = false }) {
  return blocks.map((block, index) => (
    <div
      className={tall ? "story-block story-block--panel" : "story-block"}
      key={index}
    >
      <FactLabel>{block.label}</FactLabel>
      {block.heading && <h4>{block.heading}</h4>}
      <p>{block.text}</p>
      <SourceCitation source={block.source} />
    </div>
  ));
}

export default function App() {
  return (
    <div className="page-shell">
      <Header />
      <main className="main-canvas">
        {/* ===== Homepage portal grid ===== */}
        <div className="portal-grid">
          <div className="feature-column">
            <FeaturedTransmission />
          </div>
          <LatestTransmissions />
        </div>

        <div className="home-columns">
          <div className="column-stack">
            <ExpeditionBriefing />
            <SignalStatus />
          </div>

          <div className="column-stack">
            <Panel title="QUESTS & DISCOVERIES">
              <div className="quest-intro">
                <span className="quest-intro__glyph" aria-hidden="true">
                  ✦
                </span>
                <p>
                  Three worlds. Three archives. Follow the evidence left behind
                  by human explorers.
                </p>
              </div>
              <div className="mini-chapters">
                {chapters.map((chapter) => (
                  <a href={`#${chapter.id}`} key={chapter.id}>
                    <b>
                      {chapter.number}. {chapter.artifact}
                    </b>
                    <span>{chapter.title}</span>
                  </a>
                ))}
                <a href="#arrival">
                  <b>04. THE THIRD PLANET</b>
                  <span>We found your home.</span>
                </a>
              </div>
              <a className="pixel-button pixel-button--wide" href="#voyager">
                BEGIN EXPLORATION »
              </a>
            </Panel>
            <FieldNotes />
          </div>

          <div className="column-stack">
            <Panel title="MISSION ARCHIVE">
              <div className="archive-links">
                {archiveLinks.map((link) => (
                  <a href={link.href} key={link.href}>
                    <span className="archive-links__glyph" aria-hidden="true">
                      {link.icon}
                    </span>{" "}
                    {link.label} <span className="archive-links__index">{link.index}</span>
                  </a>
                ))}
              </div>
              <a className="pixel-button pixel-button--wide" href="#archive">
                ENTER THE ARCHIVE »
              </a>
            </Panel>
            <Panel title="ABOUT THIS ARCHIVE">
              <p className="small-copy">
                OFF-WORLD is an independent educational storytelling project
                inspired by real space exploration history. It is not
                affiliated with NASA. Fictional expedition logs are always
                labelled.
              </p>
              <a className="text-link" href="#sources">
                SOURCES & CREDITS »
              </a>
            </Panel>
          </div>
        </div>

        <div className="content-divider">
          <span>THE ARCHIVES BEGIN HERE</span>
        </div>

        {/* ===== Chapter 1 — Contact / Voyager 1 ===== */}
        <StorySection
          id="voyager"
          number={chapters[0].number}
          title={chapters[0].titleLong}
          subtitle={chapters[0].subtitle}
        >
          <div className="story-feature">
            <ArtPlaceholder variant={chapters[0].art} />
            <div className="story-copy">
              <FactLabel>{chapters[0].introLabel}</FactLabel>
              <h3>Voyager 1</h3>
              <p>{chapters[0].intro}</p>
              <p className="story-copy__note">{chapters[0].note}</p>
              <dl className="fact-grid">
                {chapters[0].facts.map((fact) => (
                  <div key={fact.term}>
                    <dt>{fact.term}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <a
                className="text-link"
                href={chapters[0].source.href}
                target="_blank"
                rel="noreferrer"
              >
                {chapters[0].source.label.toUpperCase()} ↗
              </a>
            </div>
          </div>
          <GoldenRecordPanel />
          <InstrumentAccordion
            items={voyagerInstruments}
            title={chapters[0].instrumentTitle}
          />
          <StoryBlocks blocks={chapters[0].blocks} tall />
        </StorySection>

        {/* ===== Chapter 2 — The Search / Mars ===== */}
        <StorySection
          id="mars"
          number={chapters[1].number}
          title={chapters[1].titleLong}
          subtitle={chapters[1].subtitle}
        >
          <div className="story-feature">
            <ArtPlaceholder variant={chapters[1].art} />
            <div className="story-copy">
              <FactLabel>{chapters[1].introLabel}</FactLabel>
              <h3>Opportunity Rover</h3>
              <p>{chapters[1].intro}</p>
              <p className="story-copy__note">{chapters[1].note}</p>
              <dl className="fact-grid">
                {chapters[1].facts.map((fact) => (
                  <div key={fact.term}>
                    <dt>{fact.term}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <a
                className="text-link"
                href={chapters[1].source.href}
                target="_blank"
                rel="noreferrer"
              >
                {chapters[1].source.label.toUpperCase()} ↗
              </a>
            </div>
          </div>
          <InstrumentAccordion
            items={marsInstruments}
            title={chapters[1].instrumentTitle}
          />
          <StoryBlocks blocks={chapters[1].blocks} tall />
        </StorySection>

        {/* ===== Chapter 3 — Footsteps / The Moon ===== */}
        <StorySection
          id="moon"
          number={chapters[2].number}
          title={chapters[2].titleLong}
          subtitle={chapters[2].subtitle}
        >
          <div className="story-feature">
            <ArtPlaceholder variant={chapters[2].art} />
            <div className="story-copy">
              <FactLabel>{chapters[2].introLabel}</FactLabel>
              <h3>Apollo 17</h3>
              <p>{chapters[2].intro}</p>
              <dl className="fact-grid">
                {chapters[2].facts.map((fact) => (
                  <div key={fact.term}>
                    <dt>{fact.term}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <a
                className="text-link"
                href={chapters[2].source.href}
                target="_blank"
                rel="noreferrer"
              >
                {chapters[2].source.label.toUpperCase()} ↗
              </a>
            </div>
          </div>
          <StoryBlocks blocks={chapters[2].blocks} tall />
        </StorySection>

        {/* ===== Timeline ===== */}
        <StorySection
          id="timeline"
          number="04"
          title="Humanity Timeline"
          subtitle="A half-century of machines, discoveries, and distant signals."
        >
          <MissionTimeline />
        </StorySection>

        {/* ===== Archive ===== */}
        <StorySection
          id="archive"
          number="05"
          title="Artifact Index"
          subtitle="Every machine is a clue. Every instrument has a purpose."
        >
          <div className="chapter-grid">
            {chapters.map((chapter) => (
              <ChapterCard chapter={chapter} key={chapter.id} />
            ))}
          </div>
          <div className="artifact-list">
            {artifacts.map((artifact) => (
              <ArtifactCard artifact={artifact} key={artifact.id} />
            ))}
          </div>
          <div className="map-row">
            <ArchiveMap />
          </div>
        </StorySection>

        {/* ===== Chapter 4 — Arrival / Earth (fiction) ===== */}
        <section className="arrival-section" id="arrival">
          <ArtPlaceholder variant={arrival.artClass} />
          <div>
            <span className="eyebrow">{arrival.eyebrow}</span>
            <h2>{arrival.title}</h2>
            {arrival.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <div className="arrival-blocks">
              {arrival.blocks.map((block) => (
                <div className="arrival-block" key={block.label}>
                  <FactLabel>{block.label}</FactLabel>
                  <p>{block.text}</p>
                </div>
              ))}
            </div>
            <span className="arrival-meta">
              EXPEDITION LOG · 2251 · END OF TRANSMISSION
            </span>
          </div>
        </section>

        {/* ===== Sources ===== */}
        <section className="sources-section" id="sources">
          <h2>SOURCES & CREDITS</h2>
          <p>
            Every factual claim in this archive links to a mission record.
            Fictional expedition logs are clearly separated from NASA history.
            Image areas are labelled placeholders pending licensed NASA/JPL/PDS
            media.
          </p>
          <div className="source-list">
            {sources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
              >
                {source.label} ↗
              </a>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

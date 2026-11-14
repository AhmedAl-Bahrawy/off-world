import { useState } from "react";
import { recordSections } from "../data/goldenRecord.js";
import Badge from "./Badge.jsx";

function RecordFace({ activeId }) {
  // Purely decorative SVG of the record's cover diagrams, built from public NASA descriptions.
  const pulsing = activeId === "instructions";
  return (
    <div className="record-face" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="record-disc">
        <circle cx="100" cy="100" r="96" fill="#c9a94f" stroke="#8a7431" strokeWidth="2" />
        <circle cx="100" cy="100" r="72" fill="none" stroke="#8a7431" strokeWidth="1" opacity=".7" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="#8a7431" strokeWidth="1" opacity=".5" />
        <circle cx="100" cy="100" r="48" fill="none" stroke="#8a7431" strokeWidth="1" opacity=".4" />
        <circle cx="100" cy="100" r="14" fill="#f0e2b0" stroke="#8a7431" />
        {/* pulsar map */}
        <g className={pulsing ? "record-pulse" : ""}>
          <line x1="100" y1="100" x2="30" y2="55" stroke="#5c4d1e" strokeWidth="1.5" />
          <line x1="100" y1="100" x2="170" y2="60" stroke="#5c4d1e" strokeWidth="1.5" />
          <line x1="100" y1="100" x2="150" y2="165" stroke="#5c4d1e" strokeWidth="1.5" />
          <line x1="100" y1="100" x2="45" y2="150" stroke="#5c4d1e" strokeWidth="1.5" />
        </g>
        <circle cx="100" cy="100" r="4" fill="#40330f" />
      </svg>
    </div>
  );
}

export default function GoldenRecord() {
  const [sectionId, setSectionId] = useState("greetings");
  const [openItem, setOpenItem] = useState(0);
  const section = recordSections.find((s) => s.id === sectionId);

  return (
    <section aria-label="The Golden Record, decoded">
      <h2 className="page-title">The Golden Record, Decoded</h2>
      <p className="page-lede">
        Bolted to the flank of Voyager 1 and 2: a 12-inch gold-plated copper record holding a
        hello from an entire planet. Below is <Badge kind="verified" /> description of what is
        encoded on it. There is no audio here — descriptions only, from NASA's record pages.
      </p>

      <div className="record-layout">
        <RecordFace activeId={sectionId} />

        <div className="record-tabs" role="tablist" aria-label="Record contents">
          {recordSections.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === sectionId}
              className={`record-tab${s.id === sectionId ? " record-tab-on" : ""}`}
              onClick={() => {
                setSectionId(s.id);
                setOpenItem(0);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="record-panel" role="tabpanel">
          <h3>{section.headline}</h3>
          <p>{section.intro}</p>
          <ul className="record-list">
            {section.items.map((item, i) => (
              <li key={item.title}>
                <button
                  type="button"
                  className={`record-acc${openItem === i ? " record-acc-open" : ""}`}
                  aria-expanded={openItem === i}
                  onClick={() => setOpenItem(openItem === i ? -1 : i)}
                >
                  <span aria-hidden="true">{openItem === i ? "−" : "+"}</span> {item.title}
                </button>
                {openItem === i && <p className="record-detail">{item.detail}</p>}
              </li>
            ))}
          </ul>
          <p className="detail-sources">
            <strong>Source:</strong>{" "}
            <a href={section.source.url} target="_blank" rel="noreferrer">{section.source.label}</a>
          </p>
        </div>
      </div>

      <aside className="story-frame">
        <Badge kind="fiction" />
        <p>
          “We found the record first — a round golden mirror, bolted to the hull. It does not
          transmit. It waits. Someone on Earth wanted to be introduced before they were
          understood.” — Archivist Vell
        </p>
      </aside>
    </section>
  );
}

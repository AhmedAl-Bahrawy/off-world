import { useState } from "react";
import type { ArchiveRecord } from "../story/artifacts";
import { ARTIFACT_BY_ID } from "../story/artifacts";

/**
 * The supplied Twitter-style design, reproduced as an in-world archive:
 * a historical evidence viewer wearing a social-media visual skin.
 * No account, no third-party site, no live service — the framing is always
 * marked as a reconstruction.
 */
export default function TwitterArchive({
  artifactId,
  onOpenRecord,
}: {
  artifactId: string;
  onOpenRecord?: (record: ArchiveRecord) => void;
}) {
  const artifact = ARTIFACT_BY_ID[artifactId];
  const [topic, setTopic] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const [featured, setFeatured] = useState(0);

  if (!artifact) return null;

  const records = artifact.records;
  const topics = [
    { id: "all", label: "ALL" },
    { id: "timeline", label: "TIMELINE" },
    { id: "science", label: "SCIENCE" },
  ];
  const filtered = records.filter((r) => {
    if (topic === "all") return true;
    if (topic === "timeline") return r.tags.includes("VIKING") || r.tags.includes("PATHFINDER") || r.tags.includes("INGENUITY");
    return r.tags.includes("SCIENCE") || r.type === "field-note";
  });
  const shown = expanded ? filtered : filtered.slice(0, 3);
  const remaining = filtered.length - shown.length;
  const lead = records[featured % records.length];

  return (
    <div className="mrec">
      <header className="mrec-header">
        <h1 className="mrec-wordmark">
          MISSION
          <br />
          RECORDS
        </h1>
        <p className="mrec-tagline">A RECOVERED ARCHIVE · {artifact.name}</p>
        <nav className="mrec-nav">
          <a href="#records">RECORDS</a>
          <a href="#timeline">TIMELINE</a>
          <a href="#sources">SOURCES</a>
        </nav>
      </header>

      <div className="mrec-page-grid">
        <main className="mrec-main" id="records">
          <section className="mrec-intro">
            <h2>
              A machine was left here by someone else. <mark>What was it for?</mark>
            </h2>
            <p className="mrec-intro-sub">
              {artifact.purpose} These records were recovered from the archive terminal
              at {artifact.location}. Every fact below is checked against NASA
              primary sources — the interface around them is a reconstruction.
            </p>
          </section>

          <div className="mrec-feature-frame">
            <div className="mrec-feature-art">
              <div
                className="mrec-feature-sky"
                data-variant={lead.media?.variant ?? "viking"}
              >
                <span className="mrec-signal" aria-hidden="true">
                  ✦
                </span>
                <span className="mrec-planet" aria-hidden="true" />
                <span className="mrec-planet mrec-planet-two" aria-hidden="true" />
                <div className="mrec-feature-caption">
                  <p className="mrec-eyebrow">{lead.tags.join(" · ")}</p>
                  <h3>{lead.title}</h3>
                  <p>{lead.body}</p>
                </div>
                <p className="mrec-feature-stamp">
                  {lead.media?.caption ?? "ARCHIVE IMAGE / RECONSTRUCTION"}
                </p>
              </div>
            </div>
            <div className="mrec-feature-controls">
              <p>
                <span className="mrec-badge mrec-badge-fiction">⚑ RECONSTRUCTED ARCHIVE</span>{" "}
                <span className="mrec-badge mrec-badge-verified">✓ VERIFIED NASA HISTORY</span>
              </p>
              <div className="mrec-slide-controls">
                <button
                  type="button"
                  onClick={() => setFeatured((f) => (f + records.length - 1) % records.length)}
                  aria-label="Previous record"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() => setFeatured((f) => (f + 1) % records.length)}
                  aria-label="Next record"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          <section className="mrec-timeline-section" id="timeline">
            <div className="mrec-section-heading">
              <h2>{artifact.name} — Mission Timeline</h2>
            </div>
            <ol className="mrec-timeline">
              {artifact.timeline.map((item) => (
                <li className="mrec-timeline-step" key={`${item.year}-${item.title}`}>
                  <span className="mrec-timeline-link">
                    <span className="mrec-timeline-numeral" aria-hidden="true">
                      {item.year.slice(-2)}
                    </span>
                    <span className="mrec-timeline-body">
                      <strong>{item.title}</strong>
                      <em>{item.text}</em>
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mrec-updates-section">
            <div className="mrec-section-heading">
              <h2>Recovered Transmissions</h2>
            </div>

            <nav className="mrec-topic-tabs" aria-label="Filter records">
              {topics.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`mrec-topic-tab${topic === t.id ? " mrec-topic-tab-on" : ""}`}
                  aria-pressed={topic === t.id}
                  onClick={() => {
                    setTopic(t.id);
                    setExpanded(false);
                  }}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <p className="mrec-feed-note">
              <span className="mrec-badge mrec-badge-fiction">⚑ RECONSTRUCTED ARCHIVE</span> —
              crew names and message framing below are an educational reconstruction
              layered over real NASA mission history.
            </p>

            <ul className="mrec-updates-list">
              {shown.map((record, i) => (
                <li
                  className={`mrec-update-row${i % 2 ? " mrec-update-row-alt" : ""}`}
                  key={record.id}
                >
                  <span
                    className={`mrec-avatar mrec-avatar-${(i % 3) + 1}`}
                    aria-hidden="true"
                  >
                    {record.initials}
                  </span>
                  <div className="mrec-update-body">
                    <p>
                      <strong className="mrec-username">{record.handle}</strong>{" "}
                      <span className="mrec-update-source">aboard {artifact.name}</span>
                      <br />
                      {record.body}
                    </p>
                    <p className="mrec-timestamp">
                      <span>{record.date}</span>
                      {" · "}
                      {record.tags.join(" · ")}
                      {" · "}
                      <button
                        type="button"
                        className="mrec-inline-link"
                        onClick={() => onOpenRecord?.(record)}
                      >
                        open record
                      </button>
                    </p>
                    {record.replies?.map((reply) => (
                      <p className="mrec-reply" key={`${reply.handle}-${reply.date}`}>
                        <span className="mrec-reply-handle">
                          @{reply.handle} <em>{reply.date}</em>
                        </span>
                        <br />
                        {reply.body}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="mrec-update-row mrec-empty-row">
                  No records filed under this filter yet.
                </li>
              )}
            </ul>

            {remaining > 0 && (
              <p className="mrec-feed-more">
                <button type="button" onClick={() => setExpanded(true)}>
                  Load {remaining} older record{remaining > 1 ? "s" : ""} ↓
                </button>
              </p>
            )}
            {expanded && filtered.length > 3 && (
              <p className="mrec-feed-more">
                <button type="button" onClick={() => setExpanded(false)}>
                  Collapse ↑
                </button>
              </p>
            )}
          </section>

          <section className="mrec-pulse-panel" id="sources">
            <div className="mrec-pulse-heading">
              <div>
                <p className="mrec-eyebrow">ARCHIVE TELEMETRY · DATA VIEW</p>
                <h2>What this archive is holding</h2>
              </div>
              <span className="mrec-pulse-total">
                {artifact.components.length} COMPONENTS
              </span>
            </div>
            <div className="mrec-pulse-grid">
              <div className="mrec-pulse-chart" aria-label="Archive components">
                {artifact.components.map((component, i) => (
                  <div className="mrec-pulse-bar-row" key={component.id}>
                    <span>{component.shortLabel}</span>
                    <div className="mrec-pulse-track">
                      <i style={{ width: `${100 / artifact.components.length}%` }} />
                    </div>
                    <b>{String(i + 1).padStart(2, "0")}</b>
                  </div>
                ))}
              </div>
              <div className="mrec-pulse-status" aria-label="Archive status">
                <p className="mrec-pulse-caption">CURRENT READOUT</p>
                {artifact.keyFacts.slice(0, 4).map((fact) => (
                  <div className="mrec-pulse-status-row" key={fact}>
                    <span className="mrec-status-dot mrec-status-dot-lime" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mrec-pulse-footnote">
              Counts are calculated from the local NASA-cited archive, not a live
              spacecraft feed. Primary source:{" "}
              <a href={artifact.source.url} target="_blank" rel="noreferrer">
                {artifact.source.label}
              </a>
              .
            </p>
          </section>
        </main>

        <aside className="mrec-sidebar">
          <section className="mrec-sidebar-card">
            <h3 className="mrec-signin-title">
              <span className="mrec-tiny-mascot" aria-hidden="true">
                ✦
              </span>
              ARCHIVE STATUS
            </h3>
            <p className="mrec-prototype-note">
              This archive is a recovered in-world terminal. No account is required,
              nothing leaves the expedition, and no third-party service is involved.
            </p>
            <ul className="mrec-status-lines">
              <li className="mrec-status-line">
                <span className="mrec-status-dot mrec-status-dot-live" />
                {artifact.name} records recovered
              </li>
              <li className="mrec-status-line">
                <span className="mrec-status-dot" />
                {artifact.components.length} components on file
              </li>
              <li className="mrec-status-line">
                <span className="mrec-status-dot" />
                {artifact.evidence.length} evidence fragments
              </li>
            </ul>
            <div className="mrec-join-card">
              <strong>ARCHIVE OPEN</strong>
              <span>All records in this entry are unlocked.</span>
            </div>
            <p className="mrec-sidebar-foot">
              Fictionalised framing, verified history. Reconstruction status is
              labelled on every record.
            </p>
          </section>

          <section className="mrec-featured-card">
            <strong>PRIMARY SOURCE</strong>
            <a
              className="mrec-featured-link"
              href={artifact.source.url}
              target="_blank"
              rel="noreferrer"
            >
              {artifact.source.label} ↗
            </a>
            <p className="mrec-status-line">
              {artifact.era} · {artifact.location}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

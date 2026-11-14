import { getArtifact, statusTypes } from "../data/artifacts.js";
import Badge from "./Badge.jsx";

export default function ArtifactDetail({ slug }) {
  const artifact = getArtifact(slug);

  if (!artifact) {
    return (
      <section className="detail-missing" aria-label="Artifact not found">
        <h2 className="page-title">Artifact not found</h2>
        <p>
          No record matches <code>#{slug}</code> in the archive. Either the address is wrong or
          humanity never left that object out here.
        </p>
        <p><a href="#/archive">← Back to the Mission Archive</a></p>
      </section>
    );
  }

  const status = statusTypes[artifact.status];

  return (
    <article aria-label={artifact.name}>
      <p className="crumb"><a href="#/archive">← Mission Archive</a> / {artifact.name}</p>
      <h2 className="page-title">{artifact.name}</h2>
      <p className="detail-status">
        <span className={`status-chip status-chip-${status.tone}`}>{status.label}</span>
        <strong>{artifact.mission}</strong>
      </p>

      <div className="detail-frame">
        <dl className="detail-list">
          <div><dt>Launch / date</dt><dd>{artifact.launch}</dd></div>
          <div><dt>Location</dt><dd>{artifact.location}</dd></div>
          <div><dt>Purpose</dt><dd>{artifact.purpose}</dd></div>
          <div><dt>Instruments</dt><dd>{artifact.instruments}</dd></div>
          <div><dt>Operational status</dt><dd>{artifact.statusDetail}</dd></div>
          <div><dt>Discoveries</dt><dd>{artifact.discoveries}</dd></div>
        </dl>
        <p className="detail-sources">
          <strong>Sources:</strong>{" "}
          {artifact.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && " · "}
              <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
            </span>
          ))}
        </p>
      </div>

      <aside className="story-frame">
        <Badge kind="fiction" />
        <p>“{artifact.log}”</p>
      </aside>
    </article>
  );
}

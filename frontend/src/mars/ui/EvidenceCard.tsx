import type { EvidenceFragment } from "../story/artifacts";

/**
 * Layer 1 + Layer 2 of the information model: one discovery sentence,
 * then a short explanation, then the verified source.
 */
export default function EvidenceCard({
  fragment,
  onClose,
  index,
  total,
}: {
  fragment: EvidenceFragment;
  onClose: () => void;
  index: number;
  total: number;
}) {
  return (
    <div className="mars-overlay" role="dialog" aria-modal="true" aria-label="Evidence recovered">
      <div className="mars-evidence-card">
        <p className="mars-eyebrow">
          EVIDENCE {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")} · RECOVERED
        </p>
        <h2>{fragment.title}</h2>
        <p className="mars-evidence-line">{fragment.evidence}</p>
        <p className="mars-evidence-body">{fragment.explanation}</p>
        <p className="mars-evidence-source">
          SOURCE ·{" "}
          <a href={fragment.source.url} target="_blank" rel="noreferrer">
            {fragment.source.label}
          </a>
        </p>
        <button className="mars-primary" onClick={onClose} autoFocus>
          RETURN TO THE TERRAIN <span>→</span>
        </button>
      </div>
    </div>
  );
}

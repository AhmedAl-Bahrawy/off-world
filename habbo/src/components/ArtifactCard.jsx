import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ArtifactCard({ artifact }) {
  const [open, setOpen] = useState(false);
  const panelId = `${artifact.id}-detail`;

  return (
    <div className={`artifact-card ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="artifact-card__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="artifact-card__top">
          <b>{artifact.name}</b>
          <span className="status-tag">{artifact.status}</span>
        </span>
        <span className="artifact-card__summary">{artifact.summary}</span>
        <span className="artifact-card__more" aria-hidden="true">
          {open ? "− DETAILS" : "+ DETAILS"} <ChevronDown size={12} />
        </span>
      </button>
      {open && (
        <div className="artifact-card__detail" id={panelId}>
          <p>{artifact.detail}</p>
          <a className="text-link" href={artifact.href}>
            OPEN MISSION FILE »
          </a>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { ARTIFACT_BY_ID } from "../story/artifacts";
import { useMarsStore } from "../state/store";
import {
  archiveUnlocked,
  artifactProgress,
  artifactStatus,
} from "../state/progress";
import ArtifactStatusBadge from "./ArtifactStatusBadge";

/**
 * The field investigation panel (§2.10). The Mars world stays visible behind
 * it — the player can close it and return to exactly where they were.
 */
export default function ArtifactPanel({
  artifactId,
  onClose,
  onOpenArchive,
  onStartCheck,
  onComponentAction,
}: {
  artifactId: string;
  onClose: () => void;
  onOpenArchive: () => void;
  onStartCheck?: () => void;
  onComponentAction?: (componentId: string) => void;
}) {
  const artifact = ARTIFACT_BY_ID[artifactId];
  const discovered = useMarsStore((s) => s.discoveredArtifacts);
  const inspected = useMarsStore((s) => s.inspectedComponents);
  const recovered = useMarsStore((s) => s.recoveredEvidence);
  const completed = useMarsStore((s) => s.completedArtifacts);
  const inspectComponent = useMarsStore((s) => s.inspectComponent);
  const [openComponent, setOpenComponent] = useState<string | null>(null);

  if (!artifact) return null;

  const state = {
    discoveredArtifacts: discovered,
    inspectedComponents: inspected,
    recoveredEvidence: recovered,
    completedArtifacts: completed,
  };
  const status = artifactStatus(artifactId, state);
  const progress = artifactProgress(artifact, state);
  const sealed = !archiveUnlocked(artifactId, state);

  return (
    <div className="mars-overlay mars-overlay-panel" role="dialog" aria-modal="true" aria-label={`Archive entry: ${artifact.name}`}>
      <div className="mars-panel-frame mars-panel-archive">
        <header className="mars-panel-frame-head">
          <p className="mars-eyebrow">ARCHIVE ENTRY</p>
          <ArtifactStatusBadge status={status} />
          <button className="mars-panel-close" onClick={onClose} aria-label="Close archive entry">
            ✕
          </button>
        </header>

        <div className="mars-panel-scroll">
          <h1 className="mars-artifact-name">{artifact.name}</h1>
          <p className="mars-artifact-meta">
            {artifact.type} <span>·</span> {artifact.era} <span>·</span>{" "}
            {artifact.location}
          </p>

          <section className="mars-panel-block">
            <h3>WHAT IS THIS?</h3>
            <p className="mars-artifact-purpose">{artifact.purpose}</p>
            <p className="mars-artifact-question">“{artifact.mechanicalQuestion}”</p>
          </section>

          <section className="mars-panel-block">
            <h3>
              COMPONENTS{" "}
              <b>
                {progress.inspectedCount} / {progress.inspectedTotal}
              </b>
            </h3>
            <ul className="mars-component-list">
              {artifact.components.map((component, index) => {
                const known = inspected.includes(component.id);
                const open = openComponent === component.id;
                return (
                  <li
                    key={component.id}
                    className={`mars-component${known ? " is-known" : ""}${
                      open ? " is-open" : ""
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => {
                        const next = open ? null : component.id;
                        setOpenComponent(next);
                        if (next && !known) inspectComponent(component.id);
                        if (next && component.action && onComponentAction)
                          onComponentAction(component.id);
                      }}
                    >
                      <span className="mars-component-index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mars-component-name">
                        {known ? component.name : "UNEXAMINED"}
                      </span>
                      <span className="mars-component-mark" aria-hidden="true">
                        {known ? (open ? "−" : "+") : "◇"}
                      </span>
                    </button>
                    {open && known && (
                      <div className="mars-component-detail">
                        <p className="mars-component-discovery">{component.discovery}</p>
                        <p>{component.description}</p>
                        <p className="mars-component-learning">{component.learningPoint}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mars-panel-block">
            <h3>
              EVIDENCE{" "}
              <b>
                {progress.evidenceCount} / {progress.evidenceTotal}
              </b>
            </h3>
            <ul className="mars-evidence-list">
              {artifact.evidence.map((fragment) => {
                const got = recovered.includes(fragment.id);
                return (
                  <li key={fragment.id} className={got ? "is-got" : ""}>
                    <span className="mars-evidence-dot" aria-hidden="true">
                      {got ? "◆" : "◇"}
                    </span>
                    <span className="mars-evidence-title">{fragment.title}</span>
                    <span className="mars-evidence-line">
                      {got ? fragment.evidence : "NOT RECOVERED — FIND IT IN THE TERRAIN"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mars-panel-block">
            <h3>ON THE GROUND TODAY</h3>
            <p>{artifact.status}</p>
            <p className="mars-artifact-legacy">{artifact.legacy}</p>
          </section>
        </div>

        <footer className="mars-panel-frame-foot">
          <button
            className="mars-primary"
            onClick={onOpenArchive}
            disabled={sealed}
            title={
              sealed
                ? "Inspect every component and recover at least 4 evidence fragments to unseal the records."
                : undefined
            }
          >
            {sealed ? "ARCHIVE SEALED" : "OPEN RECOVERED RECORDS"} <span>→</span>
          </button>
          {onStartCheck && (
            <button className="mars-secondary" onClick={onStartCheck}>
              KNOWLEDGE CHECK
            </button>
          )}
          <button className="mars-secondary" onClick={onClose}>
            KEEP EXPLORING
          </button>
        </footer>
      </div>
    </div>
  );
}

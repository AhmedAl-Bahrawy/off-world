import { ARTIFACTS } from "../story/artifacts";
import { useMarsStore } from "../state/store";
import { artifactProgress, artifactStatus } from "../state/progress";
import ArtifactStatusBadge from "./ArtifactStatusBadge";

/**
 * The player's collection (§2.26) and the bridge to the next chapter.
 * The Moon is presented as the continuation of the same archive.
 */
export default function MarsArchive({
  onExit,
  onReplay,
  onOpenArtifact,
}: {
  onExit: () => void;
  onReplay: () => void;
  onOpenArtifact: (artifactId: string) => void;
}) {
  const discovered = useMarsStore((s) => s.discoveredArtifacts);
  const inspected = useMarsStore((s) => s.inspectedComponents);
  const recovered = useMarsStore((s) => s.recoveredEvidence);
  const completed = useMarsStore((s) => s.completedArtifacts);
  const state = {
    discoveredArtifacts: discovered,
    inspectedComponents: inspected,
    recoveredEvidence: recovered,
    completedArtifacts: completed,
  };

  return (
    <div className="mars-archive-final">
      <p className="mars-eyebrow">MARS ARCHIVE · THREE WITNESSES</p>
      <h1 className="mars-final-title">THE RED PLANET REMEMBERS</h1>
      <p className="mars-final-lede">
        Three machines, three decades, one planet. Each one was left here by
        someone who wanted to understand this world.
      </p>

      <ul className="mars-final-grid">
        {ARTIFACTS.map((artifact) => {
          const status = artifactStatus(artifact.id, state);
          const progress = artifactProgress(artifact, state);
          return (
            <li key={artifact.id} className={`mars-final-card mars-final-${status}`}>
              <button type="button" onClick={() => onOpenArtifact(artifact.id)}>
                <p className="mars-final-era">{artifact.era}</p>
                <h2>{artifact.name}</h2>
                <p className="mars-final-type">{artifact.type}</p>
                <ArtifactStatusBadge status={status} />
                <p className="mars-final-stats">
                  COMPONENTS {progress.inspectedCount}/{progress.inspectedTotal} · EVIDENCE{" "}
                  {progress.evidenceCount}/{progress.evidenceTotal}
                </p>
                <span className="mars-final-open">OPEN THE ARCHIVE →</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mars-final-summary">
        DIFFERENT MACHINES. DIFFERENT DECADES. ONE CONTINUOUS ATTEMPT TO
        UNDERSTAND MARS.
      </p>

      <section className="mars-next-destination">
        <p className="mars-eyebrow">NEXT DESTINATION</p>
        <h2>THE MOON</h2>
        <p>
          Mars is the first entry in the archive. The Moon is the next one —
          another surface, another set of machines, another set of questions
          humanity left behind.
        </p>
        <button className="mars-primary" onClick={onExit}>
          RETURN TO THE VOYAGER HUB <span>↗</span>
        </button>
        <button className="mars-secondary" onClick={onReplay}>
          REWALK THE CHAPTER ↻
        </button>
      </section>
    </div>
  );
}

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
  missionCount,
  checkResults,
  totalFalls,
}: {
  onExit: () => void;
  onReplay: () => void;
  onOpenArtifact: (artifactId: string) => void;
  missionCount: number;
  checkResults: Record<number, boolean>;
  totalFalls: number;
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

  const missionsDone = Object.keys(checkResults).length;
  const correct = Object.values(checkResults).filter(Boolean).length;
  const machinesArchived = ARTIFACTS.filter((a) =>
    completed.includes(a.id),
  ).length;
  const totals = ARTIFACTS.reduce(
    (acc, a) => {
      const pr = artifactProgress(a, state);
      acc.parts += pr.inspectedCount;
      acc.partsTotal += pr.inspectedTotal;
      acc.ev += pr.evidenceCount;
      acc.evTotal += pr.evidenceTotal;
      return acc;
    },
    { parts: 0, partsTotal: 0, ev: 0, evTotal: 0 },
  );
  const row = (done: boolean, text: string) => (
    <li className={done ? "is-done" : "is-open"}>
      <span aria-hidden="true">{done ? "✔" : "○"}</span> {text}
    </li>
  );

  return (
    <div className="mars-archive-final">
      <section className="mars-ended" aria-label="Simulation ended">
        <p className="mars-ended-stamp">MISSION COMPLETE · SIMULATION ENDED</p>
        <h1 className="mars-final-title">MARS CHAPTER COMPLETE</h1>
        <p className="mars-final-lede">
          You crossed all {missionCount} missions. The field simulation is now
          closed and the link to CURI-7 has been shut down. Here is everything
          you finished.
        </p>
        <ul className="mars-ended-list">
          {row(
            missionsDone >= missionCount,
            `${missionsDone} / ${missionCount} missions completed`,
          )}
          {row(
            machinesArchived >= ARTIFACTS.length,
            `${machinesArchived} / ${ARTIFACTS.length} machines archived`,
          )}
          {row(
            totals.partsTotal > 0 && totals.parts >= totals.partsTotal,
            `${totals.parts} / ${totals.partsTotal} machine parts inspected`,
          )}
          {row(
            totals.evTotal > 0 && totals.ev >= totals.evTotal,
            `${totals.ev} / ${totals.evTotal} evidence records recovered`,
          )}
          {row(
            missionsDone >= missionCount,
            `${correct} / ${missionCount} knowledge checks answered correctly`,
          )}
          {row(true, `${totalFalls} fall${totalFalls === 1 ? "" : "s"} — every one recovered at a checkpoint`)}
        </ul>
        <p className="mars-ended-next">
          NEXT: THE MOON — scroll down for your collection and the way forward.
        </p>
      </section>

      <p className="mars-eyebrow">MARS ARCHIVE · THREE WITNESSES</p>
      <h2 className="mars-final-title mars-final-title-sub">
        THE RED PLANET REMEMBERS
      </h2>
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

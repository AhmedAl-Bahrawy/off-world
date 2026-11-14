import type { Artifact, ArtifactStatus } from "../story/artifacts";
import { ARTIFACT_BY_ID } from "../story/artifacts";

export type DiscoveryState = {
  discoveredArtifacts: string[];
  inspectedComponents: string[];
  recoveredEvidence: string[];
  completedArtifacts: string[];
};

export const STATUS_LABEL: Record<ArtifactStatus, string> = {
  unknown: "UNKNOWN",
  identified: "IDENTIFIED",
  investigated: "INVESTIGATED",
  understood: "UNDERSTOOD",
  archived: "ARCHIVED",
};

export function artifactStatus(
  artifactId: string,
  state: DiscoveryState,
): ArtifactStatus {
  const artifact = ARTIFACT_BY_ID[artifactId];
  if (!artifact) return "unknown";
  if (state.completedArtifacts.includes(artifactId)) return "archived";
  if (!state.discoveredArtifacts.includes(artifactId)) return "unknown";
  const inspected = artifact.components.filter((c) =>
    state.inspectedComponents.includes(c.id),
  ).length;
  const evidence = artifact.evidence.filter((e) =>
    state.recoveredEvidence.includes(e.id),
  ).length;
  if (evidence >= artifact.evidence.length) return "understood";
  if (inspected >= artifact.components.length) return "investigated";
  return "identified";
}

/** The archive terminal stays sealed until the machine has been taken apart. */
export function archiveUnlocked(
  artifactId: string,
  state: DiscoveryState,
): boolean {
  const artifact = ARTIFACT_BY_ID[artifactId];
  if (!artifact) return false;
  if (!state.discoveredArtifacts.includes(artifactId)) return false;
  const inspected = artifact.components.filter((c) =>
    state.inspectedComponents.includes(c.id),
  ).length;
  const evidence = artifact.evidence.filter((e) =>
    state.recoveredEvidence.includes(e.id),
  ).length;
  return inspected >= artifact.components.length && evidence >= 4;
}

export function artifactProgress(
  artifact: Artifact,
  state: DiscoveryState,
) {
  const inspected = artifact.components.filter((c) =>
    state.inspectedComponents.includes(c.id),
  );
  const evidence = artifact.evidence.filter((e) =>
    state.recoveredEvidence.includes(e.id),
  );
  return {
    inspected,
    evidence,
    inspectedCount: inspected.length,
    inspectedTotal: artifact.components.length,
    evidenceCount: evidence.length,
    evidenceTotal: artifact.evidence.length,
  };
}

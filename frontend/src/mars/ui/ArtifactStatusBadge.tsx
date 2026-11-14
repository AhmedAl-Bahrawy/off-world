import type { ArtifactStatus } from "../story/artifacts";
import { STATUS_LABEL } from "../state/progress";

const GLYPH: Record<ArtifactStatus, string> = {
  unknown: "?",
  identified: "!",
  investigated: "◆",
  understood: "◇",
  archived: "★",
};

export default function ArtifactStatusBadge({
  status,
  compact = false,
}: {
  status: ArtifactStatus;
  compact?: boolean;
}) {
  return (
    <span className={`mars-status mars-status-${status}`}>
      <i aria-hidden="true">{GLYPH[status]}</i>
      {STATUS_LABEL[status]}
      {compact ? null : (
        <b className="mars-sr-only">{` — archive status ${STATUS_LABEL[status]}`}</b>
      )}
    </span>
  );
}

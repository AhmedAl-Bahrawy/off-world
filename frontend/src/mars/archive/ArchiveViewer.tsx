import { useState } from "react";
import type { ArchiveRecord } from "../story/artifacts";
import { ARTIFACT_BY_ID } from "../story/artifacts";
import TwitterArchive from "./TwitterArchive";
import HabboArchive from "./HabboArchive";

type Tab = "records" | "room";

/**
 * The archive interface shell. The player opens it from the terminal in the
 * world; the Mars terrain stays behind the frame and closing it returns them
 * to exactly where they were.
 */
export default function ArchiveViewer({
  artifactId,
  onClose,
  onOpenRecord,
}: {
  artifactId: string;
  onClose: () => void;
  onOpenRecord?: (recordId: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("records");
  const [record, setRecord] = useState<ArchiveRecord | null>(null);
  const artifact = ARTIFACT_BY_ID[artifactId];

  if (!artifact) return null;

  return (
    <div className="mars-overlay mars-overlay-archive" role="dialog" aria-modal="true" aria-label={`Recovered archive: ${artifact.name}`}>
      <div className="mars-archive-frame">
        <header className="mars-archive-head">
          <p className="mars-eyebrow">
            RECOVERED ARCHIVE · {artifact.name} · {artifact.location}
          </p>
          <nav className="mars-archive-tabs" aria-label="Archive views">
            <button
              type="button"
              className={tab === "records" ? "is-on" : ""}
              aria-pressed={tab === "records"}
              onClick={() => setTab("records")}
            >
              RECOVERED RECORDS
            </button>
            <button
              type="button"
              className={tab === "room" ? "is-on" : ""}
              aria-pressed={tab === "room"}
              onClick={() => setTab("room")}
            >
              ARCHIVE ROOM
            </button>
          </nav>
          <button className="mars-panel-close" onClick={onClose} aria-label="Close archive">
            ✕
          </button>
        </header>

        <div className="mars-archive-body">
          {tab === "records" ? (
            <TwitterArchive
              artifactId={artifactId}
              onOpenRecord={(record) => {
                onOpenRecord?.(record.id);
                setRecord(record);
              }}
            />
          ) : (
            <HabboArchive artifactId={artifactId} />
          )}
        </div>
      </div>

      {record && (
        <div className="mars-overlay mars-overlay-record" role="dialog" aria-modal="true">
          <div className="mars-record-card">
            <p className="mars-eyebrow">
              {record.date} · {record.tags.join(" · ")}
            </p>
            <h2>{record.title}</h2>
            <p className="mars-record-handle">{record.handle}</p>
            <p className="mars-record-body">{record.body}</p>
            {record.fact && (
              <p className="mars-record-fact">
                <span className="mars-badge mars-badge-verified">✓ VERIFIED NASA HISTORY</span>
                {record.fact}
              </p>
            )}
            {record.source && (
              <p className="mars-record-source">
                SOURCE ·{" "}
                <a href={record.source.url} target="_blank" rel="noreferrer">
                  {record.source.label}
                </a>
              </p>
            )}
            <button className="mars-primary" onClick={() => setRecord(null)} autoFocus>
              BACK TO THE RECORDS <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

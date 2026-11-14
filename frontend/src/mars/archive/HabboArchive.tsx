import { useEffect, useRef, useState } from "react";
import type { MuseumObject } from "../story/artifacts";
import { ARTIFACT_BY_ID } from "../story/artifacts";

const PLAYER_SPRITE = "/assets/mars-sprites/curi_idle-0.png";

/**
 * The supplied Habbo-style design, reproduced as an in-world archive room:
 * a small interactive museum the player physically walks through. Every
 * clickable object teaches something.
 */
export default function HabboArchive({ artifactId }: { artifactId: string }) {
  const artifact = ARTIFACT_BY_ID[artifactId];
  const roomRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 18, y: 78 });
  const [facing, setFacing] = useState(1);
  const [open, setOpen] = useState<MuseumObject | null>(null);
  const keys = useRef<Record<string, boolean>>({});

  const exhibits = artifact?.museum ?? [];
  const nearest = exhibits.find(
    (o) => Math.abs(o.x - pos.x) < 9 && Math.abs(o.y - pos.y) < 16,
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD", "KeyW", "KeyS", "KeyE"].includes(e.code))
        e.preventDefault();
      keys.current[e.code] = true;
      if (e.code === "KeyE" && !e.repeat) {
        setOpen((current) => current ?? nearest ?? null);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [nearest]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = keys.current;
      let dx = 0;
      let dy = 0;
      if (k.ArrowLeft || k.KeyA) dx -= 1;
      if (k.ArrowRight || k.KeyD) dx += 1;
      if (k.ArrowUp || k.KeyW) dy -= 1;
      if (k.ArrowDown || k.KeyS) dy += 1;
      if (dx || dy) {
        setPos((p) => ({
          x: Math.max(4, Math.min(96, p.x + dx * 26 * dt)),
          y: Math.max(18, Math.min(88, p.y + dy * 14 * dt)),
        }));
        if (dx) setFacing(dx > 0 ? 1 : -1);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!artifact) return null;

  return (
    <div className="mroom">
      <div className="mroom-shell">
        <nav className="mroom-nav" aria-label="Archive room navigation">
          <span className="mroom-nav-tab is-active">
            <span className="mroom-nav-icon" aria-hidden="true">
              ✦
            </span>
            ARCHIVE ROOM
          </span>
          <span className="mroom-nav-tab">
            <span className="mroom-nav-icon" aria-hidden="true">
              ⏱
            </span>
            TIMELINE
          </span>
          <span className="mroom-nav-tab">
            <span className="mroom-nav-icon" aria-hidden="true">
              ▤
            </span>
            EXHIBITS
          </span>
        </nav>

        <div className="mroom-heading">
          <p className="mroom-eyebrow">{artifact.name} · {artifact.era}</p>
          <h2>{artifact.location}</h2>
        </div>

        <div className="mroom-room" ref={roomRef}>
          <div className="mroom-wall" aria-hidden="true">
            <span className="mroom-wall-art" />
          </div>
          <div className="mroom-floor" aria-hidden="true" />

          {exhibits.map((exhibit) => {
            const isNear = nearest?.id === exhibit.id;
            return (
              <button
                key={exhibit.id}
                type="button"
                className={`mroom-exhibit${isNear ? " is-near" : ""}`}
                style={{ left: `${exhibit.x}%`, top: `${exhibit.y}%` }}
                onClick={() => setOpen(exhibit)}
              >
                <span className={`mroom-art mroom-art-${exhibit.variant}`} aria-hidden="true">
                  <span className="mroom-art-scan" />
                  <span className="mroom-art-label">ARCHIVE IMAGE / RECONSTRUCTION</span>
                </span>
                <span className="mroom-exhibit-name">{exhibit.name}</span>
                {isNear && <span className="mroom-exhibit-prompt">E · INSPECT</span>}
              </button>
            );
          })}

          <span
            className="mroom-player"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -100%) scale(${0.62 + (pos.y - 40) / 110}) scaleX(${facing})`,
            }}
            aria-hidden="true"
          >
            <img src={PLAYER_SPRITE} alt="" />
          </span>
        </div>

        <div className="mroom-hint">
          <p>
            <b>A / D</b> WALK <b>W / S</b> STEP <b>E</b> INSPECT
          </p>
          <p className="mroom-tiny-note">
            The archive room is a recovered reconstruction. The exhibits inside it
            are drawn from NASA mission records.
          </p>
        </div>

        {open && (
          <section className="mroom-panel" aria-label={open.name}>
            <div className="mroom-panel-heading">
              <h3>{open.name}</h3>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close exhibit">
                ✕
              </button>
            </div>
            <div className="mroom-panel-body">
              <p className="mroom-fact-line">{open.fact}</p>
              <p>{open.detail}</p>
              <a
                className="mroom-source"
                href={open.source.url}
                target="_blank"
                rel="noreferrer"
              >
                SOURCE: {open.source.label} ↗
              </a>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

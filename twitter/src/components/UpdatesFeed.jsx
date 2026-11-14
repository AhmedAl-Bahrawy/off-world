import { useState } from "react";
import { updates, topics } from "../data/updates.js";
import Badge from "./Badge.jsx";

const VISIBLE = 4;

export default function UpdatesFeed() {
  const [topic, setTopic] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const filtered = updates.filter((u) => topic === "all" || u.topic === topic);
  const shown = expanded || filtered.length <= VISIBLE ? filtered : filtered.slice(0, VISIBLE);
  const remaining = filtered.length - shown.length;

  return (
    <section className="updates-section" aria-label="Expedition transmissions">
      <div className="section-heading">
        <h2>Live Transmissions from the Expedition</h2>
      </div>

      <nav className="topic-tabs" aria-label="Filter transmissions by chapter">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`topic-tab${topic === t.id ? " topic-tab-on" : ""}`}
            aria-pressed={topic === t.id}
            onClick={() => {
              setTopic(t.id);
              setExpanded(false);
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <p className="feed-note">
        <Badge kind="fiction" /> — crew names, timestamps and messages below are an
        educational fiction layered over <a href="#/about">real NASA missions</a>.
      </p>

      <ul className="updates-list">
        {shown.map((u, i) => (
          <li className={`update-row${i % 2 ? " update-row-alt" : ""}`} key={`${u.name}-${u.time}`}>
            <span className={`avatar avatar-${(i % 3) + 1}`} aria-hidden="true">
              {u.initials}
            </span>
            <div className="update-body">
              <p>
                <strong className="username">{u.name}</strong>{" "}
                <span className="update-source">
                  aboard {u.vessel}, {u.source}
                </span>
                <br />
                {u.text}
              </p>
              <p className="timestamp">
                <span>{u.time}</span>
                {" · "}
                <a href={`#/chapter/${u.topic}`}>chapter log</a>
                {" · "}
                <Badge kind="fiction" />
              </p>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="update-row empty-row">No transmissions logged for this chapter yet.</li>
        )}
      </ul>

      {remaining > 0 && (
        <p className="feed-more">
          <button type="button" onClick={() => setExpanded(true)}>
            Load {remaining} older transmission{remaining > 1 ? "s" : ""} ↓
          </button>
        </p>
      )}
      {expanded && filtered.length > VISIBLE && (
        <p className="feed-more">
          <button type="button" onClick={() => setExpanded(false)}>Collapse ↑</button>
        </p>
      )}
    </section>
  );
}

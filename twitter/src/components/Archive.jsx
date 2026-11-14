import { useMemo, useState } from "react";
import { artifacts, categories, statusTypes } from "../data/artifacts.js";
import Badge from "./Badge.jsx";
import ArchivePulse from "./ArchivePulse.jsx";

const statusFilters = [
  { id: "all", label: "Any status" },
  { id: "transmitting", label: "Still transmitting" },
  { id: "silent", label: "Silent" },
  { id: "deployed", label: "Left in place" },
  { id: "returned", label: "Returned to Earth" },
];

export default function Archive() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return artifacts.filter((a) => {
      const inCategory = category === "all" || a.category === category;
      const inStatus = status === "all" || a.status === status;
      if (!inCategory || !inStatus) return false;
      if (!q) return true;
      const haystack = [a.name, a.mission, a.location, a.purpose, a.discoveries].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category, status]);

  return (
    <section aria-label="Mission archive">
      <h2 className="page-title">Mission Archive</h2>
      <p className="page-lede">
        Every machine humanity left out here, and what happened to it. Status, location and
        discoveries follow <Badge kind="verified" /> NASA records — each artifact carries its
        citations.
      </p>

      <form className="archive-controls" aria-label="Filter artifacts" onSubmit={(e) => e.preventDefault()}>
        <div className="archive-row">
          <label htmlFor="archive-q">Search</label>
          <input
            id="archive-q"
            type="search"
            placeholder="e.g. rover, record, mirror, Mars…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="archive-row">
          <label htmlFor="archive-cat">Where</label>
          <select id="archive-cat" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <label htmlFor="archive-status">Status</label>
          <select id="archive-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusFilters.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <p className="archive-count" aria-live="polite">
          {results.length} of {artifacts.length} artifacts shown
        </p>
      </form>
      <ArchivePulse />

      <ul className="archive-list">
        {results.map((a, i) => (
          <li className={`archive-item${i % 2 ? " archive-item-alt" : ""}`} key={a.slug}>
            <a className="archive-link" href={`#/artifact/${a.slug}`}>
              <span className={`status-chip status-chip-${statusTypes[a.status].tone}`}>
                {statusTypes[a.status].label}
              </span>
              <span className="archive-name">{a.name}</span>
              <span className="archive-meta">
                {a.mission} · {a.location}
              </span>
            </a>
          </li>
        ))}
        {results.length === 0 && (
          <li className="archive-empty">
            <strong>Nothing matched.</strong> The archive stays honest — if a machine isn't here,
            either humanity didn't leave it, or our filter is wrong. Try clearing the search or
            choosing “Everything”.
          </li>
        )}
      </ul>
    </section>
  );
}

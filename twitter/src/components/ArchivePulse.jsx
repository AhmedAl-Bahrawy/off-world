import { artifacts, categories, statusTypes } from "../data/artifacts.js";

function countBy(items, key) {
  return items.reduce((counts, item) => {
    counts[item[key]] = (counts[item[key]] || 0) + 1;
    return counts;
  }, {});
}

export default function ArchivePulse() {
  const categoryCounts = countBy(artifacts, "category");
  const statusCounts = countBy(artifacts, "status");
  const maxCategory = Math.max(...Object.values(categoryCounts));

  return (
    <section className="pulse-panel" aria-labelledby="pulse-title">
      <div className="pulse-heading">
        <div>
          <p className="eyebrow">ARCHIVE TELEMETRY · DATA VIEW</p>
          <h2 id="pulse-title">What the archive is holding</h2>
        </div>
        <span className="pulse-total">{artifacts.length} OBJECTS</span>
      </div>
      <div className="pulse-grid">
        <div className="pulse-chart" aria-label="Artifact count by location">
          {categories.filter((category) => category.id !== "all").map((category) => {
            const value = categoryCounts[category.id] || 0;
            return (
              <div className="pulse-bar-row" key={category.id}>
                <span>{category.label}</span>
                <div className="pulse-track"><i style={{ width: `${(value / maxCategory) * 100}%` }} /></div>
                <b>{value}</b>
              </div>
            );
          })}
        </div>
        <div className="pulse-status" aria-label="Artifact status breakdown">
          <p className="pulse-caption">CURRENT READOUT</p>
          {Object.entries(statusTypes).map(([id, status]) => (
            <div className="pulse-status-row" key={id}>
              <span className={`status-dot status-dot-${status.tone}`} />
              <span>{status.label}</span>
              <b>{statusCounts[id] || 0}</b>
            </div>
          ))}
        </div>
      </div>
      <p className="pulse-footnote">Counts are calculated from the local NASA-cited artifact index, not a live spacecraft feed.</p>
    </section>
  );
}

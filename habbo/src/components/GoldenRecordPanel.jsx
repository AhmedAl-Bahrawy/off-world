import Panel from "./Panel";
import { useState } from "react";
import { goldenRecord } from "../data/archive";

export default function GoldenRecordPanel() {
  const [activeId, setActiveId] = useState(goldenRecord.categories[0].id);
  const active =
    goldenRecord.categories.find((c) => c.id === activeId) ||
    goldenRecord.categories[0];

  return (
    <Panel title="DECODE THE GOLDEN RECORD" className="inner-panel">
      <div className="golden-record-visual">
        <img src="/images/golden-record.jpg" alt="NASA image of the Voyager Golden Record" />
        <span>12 INCH / GOLD-PLATED PHONOGRAPH</span>
      </div>
      <p>{goldenRecord.intro}</p>
      <div
        className="golden-tabs"
        role="tablist"
        aria-label="Golden Record contents"
      >
        {goldenRecord.categories.map((category) => {
          const selected = category.id === activeId;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={selected ? "golden-tab is-active" : "golden-tab"}
              onClick={() => setActiveId(category.id)}
            >
              {category.tab}
            </button>
          );
        })}
      </div>
      <div className="golden-detail" role="tabpanel">
        <b>{active.heading}</b>
        <p>{active.text}</p>
      </div>
      <a
        className="text-link"
        href={goldenRecord.source.href}
        target="_blank"
        rel="noreferrer"
      >
        SOURCE: {goldenRecord.source.label} ↗
      </a>
    </Panel>
  );
}

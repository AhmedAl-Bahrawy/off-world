import Panel from "./Panel";
import { timeline } from "../data/timeline";

export default function MissionTimeline() {
  return (
    <Panel title="MISSION TIMELINE / REAL DATES" className="timeline-panel">
      <div className="timeline-list">
        {timeline.map((item) => (
          <div
            className="timeline-entry"
            key={`${item.year}-${item.title}`}
          >
            <strong>{item.year}</strong>
            <div>
              <b>{item.title}</b>
              <p>{item.text}</p>
              <a
                className="timeline-entry__source"
                href={item.source.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.source.label} ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

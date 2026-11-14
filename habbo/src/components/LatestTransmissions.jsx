import Panel from "./Panel";
import { transmissions } from "../data/home";

export default function LatestTransmissions() {
  return (
    <Panel title="LATEST TRANSMISSIONS" className="transmission-panel">
      <div className="transmission-list">
        {transmissions.map((item) => (
          <a href={item.href} className="transmission-item" key={item.title}>
            <span className="transmission-item__date">[{item.date}]</span>
            <b>{item.title}</b>
            <p>{item.detail}</p>
          </a>
        ))}
      </div>
      <a className="text-link" href="#timeline">
        VIEW ALL RECORDS »
      </a>
    </Panel>
  );
}

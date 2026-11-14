import { Signal } from "lucide-react";
import Panel from "./Panel";
import { signalStatus } from "../data/home";

export default function SignalStatus() {
  return (
    <Panel title="SIGNAL STATUS" className="signal-panel">
      <div className="signal-readout">
        <Signal size={24} />
        <div>
          <strong>{signalStatus.headline}</strong>
          <small>{signalStatus.subline}</small>
        </div>
      </div>
      <div className="signal-bars" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <p className="tiny-note">{signalStatus.note}</p>
    </Panel>
  );
}

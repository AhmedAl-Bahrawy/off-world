import { Satellite } from "lucide-react";
import Panel from "./Panel";
import { briefing } from "../data/home";

export default function ExpeditionBriefing() {
  return (
    <Panel title="EXPEDITION BRIEFING">
      <div className="briefing-copy">
        <div className="briefing-stamp">
          <Satellite size={27} />
          <small>
            FIELD
            <br />
            ARCHIVE
          </small>
        </div>
        <p>{briefing.intro}</p>
        <p>{briefing.instruction}</p>
        <a className="text-link" href={briefing.linkHref}>
          {briefing.linkLabel}
        </a>
      </div>
    </Panel>
  );
}

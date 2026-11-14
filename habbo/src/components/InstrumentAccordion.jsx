import Panel from "./Panel";
import { useState } from "react";
import SourceCitation from "./SourceCitation";

export default function InstrumentAccordion({ items, title }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Panel title={title} className="inner-panel">
      <div className="instrument-list">
        {items.map((item, index) => {
          const open = openIndex === index;
          const panelId = `instrument-${index}-detail`;
          return (
            <div className="instrument" key={item.name}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : index)}
                aria-expanded={open}
                aria-controls={panelId}
              >
                <span>
                  {String(index + 1).padStart(2, "0")} / {item.name}
                </span>
                <span aria-hidden="true">{open ? "−" : "+"}</span>
              </button>
              {open && (
                <div id={panelId}>
                  <p>
                    <b>MEASURED:</b> {item.purpose}
                  </p>
                  <SourceCitation source={item.source} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

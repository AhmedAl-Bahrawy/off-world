import Panel from "./Panel";
import { archiveMap } from "../data/archive";

export default function ArchiveMap() {
  return (
    <Panel title="EXPEDITION MAP / SOLAR SYSTEM" className="map-panel">
      <p className="tiny-note">{archiveMap.note}</p>
      <svg
        className="archive-map"
        viewBox="0 0 100 100"
        role="img"
        aria-label="Schematic map of the Solar System with expedition stops: Sol, Earth and the Moon, Mars, and Voyager 1 travelling outward. Not to scale."
      >
        {/* orbits */}
        <circle className="archive-map__orbit" cx="50" cy="50" r="31" />
        <circle className="archive-map__orbit" cx="50" cy="50" r="45" />
        <circle
          className="archive-map__orbit archive-map__orbit--dash"
          cx="50"
          cy="50"
          r="57"
        />
        {/* sun */}
        <circle className="archive-map__sun" cx="50" cy="50" r="5" />
        <text className="archive-map__text" x="50" y="62">
          SOL
        </text>
        {/* interstellar arrow */}
        <line
          className="archive-map__arrow"
          x1="62"
          y1="38"
          x2="97"
          y2="14"
          markerEnd="url(#map-arrowhead)"
        />
        <text className="archive-map__text" x="78" y="9">
          INTERSTELLAR
        </text>
        <defs>
          <marker
            id="map-arrowhead"
            markerWidth="6"
            markerHeight="6"
            refX="4"
            refY="3"
            orient="auto"
          >
            <path d="M0 0L6 3L0 6Z" fill="#ffd000" />
          </marker>
        </defs>
        {/* stops */}
        {archiveMap.stops
          .filter((stop) => stop.href)
          .map((stop) => (
            <a href={stop.href} key={stop.id}>
              <circle
                className="archive-map__stop"
                cx={stop.x}
                cy={stop.y}
                r="3.2"
              >
                <title>{`${stop.label} — ${stop.sub}`}</title>
              </circle>
              <text className="archive-map__text" x={stop.x} y={stop.y - 5.5}>
                {stop.label}
              </text>
            </a>
          ))}
      </svg>
      <ul className="map-legend">
        {archiveMap.stops
          .filter((stop) => stop.href)
          .map((stop) => (
            <li key={stop.id}>
              <a href={stop.href}>
                <i aria-hidden="true" />
                <b>{stop.label}</b>
                <span>{stop.sub}</span>
              </a>
            </li>
          ))}
      </ul>
    </Panel>
  );
}

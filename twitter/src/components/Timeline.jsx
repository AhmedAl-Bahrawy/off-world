import { chapters } from "../data/chapters.js";

export default function Timeline() {
  return (
    <section className="timeline-section" aria-label="Expedition chapters">
      <div className="section-heading">
        <h2>The Expedition, in Four Chapters</h2>
      </div>
      <ol className="timeline">
        {chapters.map((c, i) => (
          <li className="timeline-step" key={c.id}>
            <a className="timeline-link" href={`#/chapter/${c.id}`}>
              <span className="timeline-numeral" style={{ background: c.color }} aria-hidden="true">
                {c.numeral}
              </span>
              <span className="timeline-body">
                <strong>{c.label}</strong>
                <em>{c.tagline}</em>
              </span>
            </a>
            {i < chapters.length - 1 && <span className="timeline-arrow" aria-hidden="true">→</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

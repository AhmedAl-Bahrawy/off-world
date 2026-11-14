import { chapters } from "../data/chapters.js";
import Badge from "./Badge.jsx";

export default function Chapter({ id }) {
  const chapter = chapters.find((c) => c.id === id);
  const idx = chapters.indexOf(chapter);
  const next = chapters[idx + 1];

  if (!chapter) {
    return (
      <section className="detail-missing" aria-label="Chapter not found">
        <h2 className="page-title">Chapter not found</h2>
        <p>That page of the log doesn't exist. The expedition has only written four chapters.</p>
        <p><a href="#/">← Back to the expedition</a></p>
      </section>
    );
  }

  return (
    <article aria-label={`Chapter ${chapter.numeral}: ${chapter.label}`}>
      <p className="crumb"><a href="#/">← Expedition</a> / Chapter {chapter.numeral}</p>
      <h2 className="page-title chapter-title" style={{ borderBottomColor: chapter.color }}>
        <span className="chapter-numeral" style={{ background: chapter.color }} aria-hidden="true">
          {chapter.numeral}
        </span>
        {chapter.label}
      </h2>
      <p className="page-lede">{chapter.tagline}</p>

      <div className="chapter-facts">
        <Badge kind="verified" as="p" />
        <p className="chapter-intro">{chapter.intro}</p>
        <ul className="fact-list">
          {chapter.facts.map((f) => (
            <li key={f.url}>
              {f.text} <a href={f.url} target="_blank" rel="noreferrer">[{f.label}]</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="chapter-logs">
        <Badge kind="fiction" as="p" />
        {chapter.logs.map((log) => (
          <blockquote className="story-log" key={log.time}>
            <footer>
              <strong>{log.author}</strong>, {log.time} · {chapter.label}
            </footer>
            <p>“{log.text}”</p>
          </blockquote>
        ))}
      </div>

      <p className="chapter-next">
        {next ? (
          <a href={`#/chapter/${next.id}`}>Continue to Chapter {next.numeral}: {next.label} →</a>
        ) : (
          <span>
            End of the public log — the sequence stops before landing. <a href="#/archive">Visit the archive</a> for what we found.
          </span>
        )}
      </p>
    </article>
  );
}

import ArtPlaceholder from "./ArtPlaceholder";

export default function ChapterCard({ chapter, className = "" }) {
  return (
    <a className={`chapter-card ${className}`} href={`#${chapter.id}`}>
      <ArtPlaceholder variant={chapter.className} />
      <div className="chapter-card__content">
        <span className="eyebrow">{chapter.eyebrow}</span>
        <h3>{chapter.title}</h3>
        <p>{chapter.description}</p>
        <div className="chapter-card__meta">
          <b>{chapter.artifact}</b>
          <span>{chapter.date}</span>
        </div>
        <span className="status-tag">{chapter.status}</span>
      </div>
    </a>
  );
}

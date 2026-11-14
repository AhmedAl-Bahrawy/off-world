export default function SectionTitle({ kicker, title, note }) {
  return (
    <div className="section-title">
      <div>
        {kicker && <span className="eyebrow">{kicker}</span>}
        <h2>{title}</h2>
      </div>
      {note && <p>{note}</p>}
    </div>
  );
}

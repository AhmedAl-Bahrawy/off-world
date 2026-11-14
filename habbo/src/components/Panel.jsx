export default function Panel({ title, children, className = "", action }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel__heading">
        <h2>{title}</h2>
        {action && <a href={action.href}>{action.label} »</a>}
      </div>
      <div className="panel__body">{children}</div>
    </section>
  );
}

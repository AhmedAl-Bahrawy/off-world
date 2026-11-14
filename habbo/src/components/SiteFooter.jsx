import { sources } from "../data/archive";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        OFF-WORLD <span>THE SILENT ARCHIVES</span>
      </div>
      <p>
        AN INDEPENDENT EDUCATIONAL STORYTELLING PROJECT · NOT AFFILIATED WITH
        NASA
      </p>
      <nav className="footer-links" aria-label="Source links">
        {sources.slice(0, 5).map((source) => (
          <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
            {source.label} ↗
          </a>
        ))}
      </nav>
      <a href="#home">BACK TO TOP ↑</a>
    </footer>
  );
}

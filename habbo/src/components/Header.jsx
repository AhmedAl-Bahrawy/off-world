import TopNavigation from "./TopNavigation";

export default function Header() {
  return (
    <header className="site-header" id="home">
      <div className="brand-strip">
        <a className="brand" href="#home" aria-label="Off-World home">
          <span className="brand__mark">OW</span>
          <span className="brand__name">
            OFF-WORLD <small>THE SILENT ARCHIVES</small>
          </span>
        </a>
        <span className="signal-indicator">
          <i /> ARCHIVE SIGNAL: ONLINE
        </span>
      </div>
      <TopNavigation />
    </header>
  );
}

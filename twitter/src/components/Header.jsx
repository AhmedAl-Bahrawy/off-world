export default function Header() {
  return (
    <header className="site-header">
      <h1 className="site-title">
        <a className="wordmark" href="#/">OFF-WORLD</a>
      </h1>
      <p className="header-tagline" aria-hidden="true">
        an expedition log · est. somewhere past Neptune
      </p>
      <nav className="header-nav" aria-label="Main">
        <a href="#/">Home</a>
        <a href="#/archive">Archive</a>
        <a href="#/golden-record">Golden Record</a>
        <a href="#/about">About</a>
      </nav>
    </header>
  );
}

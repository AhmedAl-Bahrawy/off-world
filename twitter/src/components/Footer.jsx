import Badge from "./Badge.jsx";

export default function Footer() {
  return (
    <footer className="site-footer">
      <nav aria-label="Footer">
        <a href="#/about">About</a>
        {" · "}
        <a href="#/archive">Mission Archive</a>
        {" · "}
        <a href="#/about/sources">Data Sources</a>
        {" · "}
        <a href="#/about/credits">Credits</a>
      </nav>
      <p className="footer-fineprint">
        <Badge kind="verified" /> facts carry live NASA links. <Badge kind="fiction" /> logs are
        labeled everywhere they appear.
      </p>
    </footer>
  );
}

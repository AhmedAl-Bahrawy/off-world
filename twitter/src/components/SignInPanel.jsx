import Badge from "./Badge.jsx";

export default function SignInPanel() {
  return (
    <div className="sidebar-card">
      <h2 className="signin-title">
        <span className="tiny-mascot" aria-hidden="true">✦</span> Crew Access
      </h2>

      <p className="prototype-note">
        <strong>Visual prototype.</strong> No accounts exist and nothing you type is sent
        anywhere — this panel is part of the exhibit.
      </p>

      <form
        className="signin-form"
        aria-label="Sign-in form (visual prototype)"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="callsign">Callsign</label>
        <input id="callsign" name="callsign" type="text" autoComplete="off" placeholder="e.g. TAO-9" />
        <label className="password-label" htmlFor="passphrase">
          Passphrase <a href="#/about">(forgot?)</a>
        </label>
        <input id="passphrase" name="passphrase" type="password" placeholder="not stored, not sent" />
        <label className="remember">
          <input type="checkbox" /> Remember me for this orbit
        </label>
        <button className="signin-button" type="submit">
          Sign In
        </button>
      </form>

      <div className="join-card">
        <strong>New to the archive?</strong>
        <a href="#/about">Read the briefing</a>
        <span>4 chapters · 12 artifacts · 1 mystery</span>
      </div>

      <div className="featured-card">
        <strong>Mission Status</strong>
        <p className="status-line"><span className="status-dot status-dot-live" />Voyager 1 — still transmitting</p>
        <p className="status-line"><span className="status-dot" />Spirit · Opportunity · Viking 1 — silent</p>
        <p className="status-line"><span className="status-dot" />Apollo hardware — left in place</p>
        <p className="status-line"><span className="status-dot status-dot-live" />Earth signal — no reply</p>
      </div>

      <div className="featured-card">
        <strong>Featured Artifacts</strong>
        <a className="featured-link" href="#/artifact/golden-record">The Golden Record</a>
        <a className="featured-link" href="#/artifact/viking-1-lander">Viking 1 Lander</a>
        <a className="featured-link" href="#/artifact/lunar-roving-vehicles">Lunar Roving Vehicles</a>
        <a className="featured-link" href="#/archive">→ browse all artifacts</a>
      </div>

      <div className="featured-card">
        <strong>Chapters</strong>
        <a className="featured-link" href="#/chapter/contact">I · Contact</a>
        <a className="featured-link" href="#/chapter/search">II · The Search</a>
        <a className="featured-link" href="#/chapter/footsteps">III · Footsteps</a>
        <a className="featured-link" href="#/chapter/arrival">IV · Arrival</a>
      </div>

      <p className="sidebar-foot">
        <a href="#/golden-record">The Golden Record, decoded →</a>
        <br />
        <Badge kind="fiction" /> lives only in the logs.
      </p>
    </div>
  );
}

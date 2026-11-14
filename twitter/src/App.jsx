import Header from "./components/Header.jsx";
import IntroFeature from "./components/IntroFeature.jsx";
import UpdatesFeed from "./components/UpdatesFeed.jsx";
import ArchivePulse from "./components/ArchivePulse.jsx";
import SignInPanel from "./components/SignInPanel.jsx";
import Timeline from "./components/Timeline.jsx";
import Archive from "./components/Archive.jsx";
import ArtifactDetail from "./components/ArtifactDetail.jsx";
import GoldenRecord from "./components/GoldenRecord.jsx";
import Chapter from "./components/Chapter.jsx";
import About from "./components/About.jsx";
import Footer from "./components/Footer.jsx";
import useHashRoute from "./hooks/useHashRoute.js";

function Main({ route }) {
  switch (route.page) {
    case "archive":
      return <Archive />;
    case "artifact":
      return <ArtifactDetail slug={route.param} />;
    case "golden-record":
      return <GoldenRecord />;
    case "chapter":
      return <Chapter id={route.param} />;
    case "about":
      return <About section={route.param} />;
    case "not-found":
      return (
        <section className="detail-missing" aria-label="Page not found">
          <h2 className="page-title">Lost past the heliopause</h2>
          <p>
            The address <code>#{route.param}</code> isn't on the expedition map. Signals from
            unknown coordinates are ignored, per policy.
          </p>
          <p><a href="#/">← Return to the expedition</a></p>
        </section>
      );
    default:
      return (
        <>
          <section className="intro-copy">
            <h1>
              A signal from Earth. A mystery across the stars.{" "}
              <mark>What happened here?</mark>
            </h1>
            <p className="intro-sub">
              An expedition is following humanity's abandoned machines — the record in the dark,
              the rovers in the dust, the footprints on the Moon — to answer one question.
            </p>
          </section>
          <IntroFeature />
          <Timeline />
          <ArchivePulse />
          <UpdatesFeed />
        </>
      );
  }
}

export default function App() {
  const route = useHashRoute();

  return (
    <div className="site-shell">
      <Header />
      <div className="page-grid">
        <main className="main-column" id="main">
          <Main route={route} />
        </main>
        <aside className="sidebar">
          <SignInPanel />
        </aside>
      </div>
      <Footer />
    </div>
  );
}

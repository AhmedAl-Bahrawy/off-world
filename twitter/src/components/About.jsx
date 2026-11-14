import Badge from "./Badge.jsx";

export default function About({ section }) {
  return (
    <section aria-label="About this site">
      <h2 className="page-title">About this exhibit</h2>

      {(section === "" || section === undefined) && (
        <>
          <p className="page-lede">
            <strong>OFF-WORLD</strong> is a two-layer educational site. One layer is{" "}
            <Badge kind="verified" /> — real spacecraft, real landing dates, real instruments,
            every fact carrying a link to a NASA primary source. The other layer is{" "}
            <Badge kind="fiction" /> — a story in which an alien expedition follows humanity's
            abandoned hardware across the solar system, tracing a distress signal nobody answers.
          </p>
          <p>
            The two layers never mix: facts live in the <a href="#/archive">Mission Archive</a> and
            the chapter fact blocks; fiction lives in transmission logs and quotes, and it is
            labeled at every appearance. The story's central mystery is deliberately{" "}
            <strong>left unresolved</strong> — nothing on this site claims to explain why Earth
            went silent.
          </p>
          <p>
            Built with React + Vite. No audio from the Golden Record is reproduced — only
            descriptions of its contents.
          </p>
        </>
      )}

      {section === "sources" && (
        <>
          <h3 className="page-subtitle">Data Sources</h3>
          <p className="page-lede">Primary NASA pages used as the factual basis for every verified claim on this site:</p>
          <ul className="source-list">
            <li><a href="https://science.nasa.gov/mission/voyager/" target="_blank" rel="noreferrer">NASA — Voyager mission</a></li>
            <li><a href="https://science.nasa.gov/mission/voyager/where-are-they-now/" target="_blank" rel="noreferrer">NASA — Voyager: where are they now</a></li>
            <li><a href="https://science.nasa.gov/mission/voyager/golden-record/" target="_blank" rel="noreferrer">NASA — The Golden Record</a></li>
            <li><a href="https://science.nasa.gov/mission/voyager/golden-record/cover-of-the-golden-record/" target="_blank" rel="noreferrer">NASA — Cover of the Golden Record</a></li>
            <li><a href="https://science.nasa.gov/mission/voyager/voyager-1/pale-blue-dot/" target="_blank" rel="noreferrer">NASA — Pale Blue Dot</a></li>
            <li><a href="https://science.nasa.gov/mars/" target="_blank" rel="noreferrer">NASA — Mars exploration</a></li>
            <li><a href="https://science.nasa.gov/mission/viking/" target="_blank" rel="noreferrer">NASA — Viking</a></li>
            <li><a href="https://science.nasa.gov/mission/mars-rover-spirit/" target="_blank" rel="noreferrer">NASA — Mars rover Spirit</a></li>
            <li><a href="https://science.nasa.gov/mission/mars-rover-opportunity/" target="_blank" rel="noreferrer">NASA — Mars rover Opportunity</a></li>
            <li><a href="https://science.nasa.gov/mission/insight/" target="_blank" rel="noreferrer">NASA — InSight</a></li>
            <li><a href="https://www.nasa.gov/humans-in-space/apollo-missions/" target="_blank" rel="noreferrer">NASA — Apollo missions</a></li>
            <li><a href="https://www.nasa.gov/mission/apollo-11/" target="_blank" rel="noreferrer">NASA — Apollo 11</a></li>
            <li><a href="https://www.nasa.gov/mission/apollo-15/" target="_blank" rel="noreferrer">NASA — Apollo 15</a></li>
            <li><a href="https://www.nasa.gov/history/alsj/" target="_blank" rel="noreferrer">NASA — Apollo Lunar Surface Journal</a></li>
            <li><a href="https://www.jpl.nasa.gov/voyager-image-gallery/" target="_blank" rel="noreferrer">JPL — Voyager image gallery</a></li>
            <li><a href="https://science.nasa.gov/mission/mer-opportunity/" target="_blank" rel="noreferrer">NASA/JPL-Caltech — Opportunity image archive</a></li>
            <li><a href="https://www.nasa.gov/image-article/apollo-8-earthrise/" target="_blank" rel="noreferrer">NASA — Apollo 8 Earthrise image</a></li>
          </ul>
          <p className="gap-note">
            <strong>Known gap:</strong> the brief mentions supplied hackathon datasets for the Mars
            section, but no dataset files were found in this repository. Mars facts therefore come
            from the NASA mission pages above instead of guessing what a dataset might contain.
          </p>
        </>
      )}

      {section === "credits" && (
        <>
          <h3 className="page-subtitle">Credits</h3>
          <ul className="source-list">
            <li>Facts: NASA public web pages (see <a href="#/about/sources">Data Sources</a>).</li>
            <li>Fiction: written for this exhibit. Crew names, ship names and transmission logs are invented.</li>
            <li>Design: homage to a certain blue-green social portal from 2006, circa “what are you doing?”</li>
            <li>Record cover diagrams on this site are original SVG approximations based on NASA's descriptions.</li>
          </ul>
        </>
      )}
    </section>
  );
}

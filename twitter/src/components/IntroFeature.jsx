import { useState } from "react";
import { chapters } from "../data/chapters.js";
import Badge from "./Badge.jsx";

export default function IntroFeature() {
  const [index, setIndex] = useState(0);
  const chapter = chapters[index];
  const images = {
    contact: ["/images/voyager-archive.jpg", "NASA / JPL-Caltech — Voyager archive"],
    search: ["/images/opportunity-shadow.jpeg", "NASA / JPL-Caltech — Opportunity image"],
    footsteps: ["/images/apollo8-earthrise.jpg", "NASA — Apollo 8 Earthrise"],
    arrival: ["/images/apollo8-earthrise.jpg", "NASA — Apollo 8 Earthrise"],
  };
  const [image, credit] = images[chapter.id];

  return (
    <div className="feature-frame">
      <div className="feature-art" role="group" aria-label={`Featured transmission: chapter ${chapter.numeral}, ${chapter.label}`}>
        <div className="feature-sky" data-chapter={chapter.id}>
          <img className="feature-photo" src={image} alt="" />
          <span className="planet planet-one" aria-hidden="true" />
          <span className="planet planet-two" aria-hidden="true" />
          <span className="signal signal-one" aria-hidden="true">⌇</span>
          <span className="signal signal-two" aria-hidden="true">✦</span>

          <div className="feature-caption">
            <p className="eyebrow">FEATURED TRANSMISSION · CHAPTER {chapter.numeral}</p>
            <h2>{chapter.label}</h2>
            <p>{chapter.teaser}</p>
            <Badge kind="fiction" />
          </div>

          <p className="feature-stamp">
            story layer —<br />
            over real NASA history
          </p>
          <span className="feature-credit">{credit}</span>
        </div>
      </div>

      <div className="feature-controls">
        <p>
          Chapter {index + 1} of {chapters.length}. Read the full log:{" "}
          <a href={`#/chapter/${chapter.id}`}>{chapter.label}</a>
        </p>
        <div className="slide-controls">
          <button type="button" onClick={() => setIndex((index - 1 + chapters.length) % chapters.length)} aria-label="Previous chapter">
            ◀
          </button>
          <button type="button" onClick={() => setIndex((index + 1) % chapters.length)} aria-label="Next chapter">
            ▶
          </button>
          <span className="pixel-astronaut" aria-hidden="true">☄</span>
        </div>
      </div>
    </div>
  );
}

import { ChevronRight } from "lucide-react";
import Panel from "./Panel";
import ArtPlaceholder from "./ArtPlaceholder";
import { featuredTransmission } from "../data/home";

export default function FeaturedTransmission() {
  const feature = featuredTransmission;
  return (
    <Panel title="FEATURED DISCOVERY" className="feature-panel">
      <ArtPlaceholder variant={feature.artClass} />
      <div className="feature-caption">
        <div>
          <span className="eyebrow">{feature.eyebrow}</span>
          <h1>{feature.title}</h1>
        </div>
        <a className="pixel-button" href={feature.href}>
          OPEN FILE <ChevronRight size={15} />
        </a>
      </div>
    </Panel>
  );
}

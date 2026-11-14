import type { CSSProperties } from "react";

type PixelTransitionProps = { phase: "cover" | "reveal" | null };
const tiles = Array.from({ length: 240 }, (_, index) => (index * 97) % 240);

export function PixelTransition({ phase }: PixelTransitionProps) {
  if (!phase) return null;
  return (
    <div className={`pixel-route-transition is-${phase}`} aria-hidden="true">
      {tiles.map((order, index) => {
        const rank = phase === "cover" ? order : 239 - order;
        return (
          <i
            key={index}
            className="pixel-route-tile"
            style={{ "--tile-delay": `${rank * 1.8}ms` } as CSSProperties}
          />
        );
      })}
    </div>
  );
}

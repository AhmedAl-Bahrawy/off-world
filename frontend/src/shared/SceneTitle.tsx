import type { ReactNode } from "react";
import "./scene-shared.css";

type SceneTitleProps = {
  kicker?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
};

export function SceneTitle({
  kicker,
  title,
  subtitle,
  className = "",
}: SceneTitleProps) {
  return (
    <div className={`scene-title ${className}`.trim()}>
      {kicker && <p className="scene-title-kicker">{kicker}</p>}
      <h1 className="scene-title-heading">{title}</h1>
      {subtitle && <p className="scene-title-subtitle">{subtitle}</p>}
    </div>
  );
}

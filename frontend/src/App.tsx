import { useEffect, useState } from "react";
import MarsExperience from "./mars/MarsExperience";
import VoyagerExperience from "./voyager";
import { PixelTransition } from "./shared/PixelTransition";
import { SCENE_NAVIGATE_EVENT, navigateScene } from "./shared/navigation";

function normalizePath(path: string) {
  return path.replace(/\/+$/, "") || "/";
}

export default function App() {
  const [path, setPath] = useState(() =>
    normalizePath(window.location.pathname),
  );
  const [transitionPhase, setTransitionPhase] = useState<
    "cover" | "reveal" | null
  >(null);

  useEffect(() => {
    let currentRoute = normalizePath(window.location.pathname);
    let timers: number[] = [];
    const transitionTo = (target: string, pushHistory: boolean) => {
      const next = normalizePath(target);
      if (next === currentRoute) return;
      timers.forEach(window.clearTimeout);
      setTransitionPhase("cover");
      timers = [
        window.setTimeout(() => {
          if (pushHistory) window.history.pushState({}, "", next);
          currentRoute = next;
          setPath(next);
          setTransitionPhase("reveal");
          timers = [window.setTimeout(() => setTransitionPhase(null), 650)];
        }, 650),
      ];
    };
    const onNavigate = (event: Event) => {
      const target = (event as CustomEvent<{ path: string }>).detail?.path;
      if (target) transitionTo(target, true);
    };
    const onPopState = () => transitionTo(window.location.pathname, false);
    window.addEventListener(SCENE_NAVIGATE_EVENT, onNavigate);
    window.addEventListener("popstate", onPopState);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener(SCENE_NAVIGATE_EVENT, onNavigate);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    document.title =
      path === "/mars"
        ? "OFF-WORLD // Mars Simulation"
        : "OFF-WORLD // Voyager";
  }, [path]);

  return (
    <>
      {path === "/mars" ? (
        <MarsExperience onExit={() => navigateScene("/")} />
      ) : (
        <VoyagerExperience />
      )}
      <PixelTransition phase={transitionPhase} />
    </>
  );
}

import { navigation } from "../data/navigation";
import { useEffect, useState } from "react";

function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 90) {
          current = id;
        }
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  return activeId;
}

export default function TopNavigation() {
  const activeId = useScrollSpy(navigation.map((item) => item.href.slice(1)));

  return (
    <nav className="top-nav" aria-label="Main navigation">
      {navigation.map((item) => {
        const active = activeId === item.href.slice(1);
        return (
          <a
            key={item.href}
            href={item.href}
            className={active ? "nav-tab is-active" : "nav-tab"}
            aria-current={active ? "true" : undefined}
          >
            <span className="nav-tab__icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

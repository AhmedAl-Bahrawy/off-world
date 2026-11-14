import { useEffect, useState } from "react";

// Tiny hash router: "#/", "#/archive", "#/artifact/<slug>", "#/chapter/<id>",
// "#/golden-record", "#/about", plus "#/"-fallback for anything unknown.
function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [first = "", second = ""] = raw.split("/");
  if (!first) return { page: "home", param: "" };
  if (first === "archive") return { page: "archive", param: second };
  if (first === "artifact") return { page: "artifact", param: second };
  if (first === "chapter") return { page: "chapter", param: second };
  if (first === "golden-record") return { page: "golden-record", param: "" };
  if (first === "about") return { page: "about", param: second || "" };
  return { page: "not-found", param: raw };
}

export default function useHashRoute() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export function href(path) {
  return `#/${path}`.replace(/^#\/\//, "#/");
}

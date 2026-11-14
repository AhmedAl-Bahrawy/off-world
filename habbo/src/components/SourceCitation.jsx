import { ExternalLink } from "lucide-react";

export default function SourceCitation({ source, className = "" }) {
  if (!source) return null;
  return (
    <a
      className={`source-citation ${className}`}
      href={source.href}
      target="_blank"
      rel="noreferrer"
    >
      SOURCE: {source.label} <ExternalLink size={11} />
    </a>
  );
}

const LABELS = {
  "HISTORICAL FACT": "fact-label--fact",
  "SCIENTIFIC DATA": "fact-label--data",
  "EXPEDITION LOG": "fact-label--log",
  RECONSTRUCTION: "fact-label--recon",
};

export default function FactLabel({ children }) {
  const label = children;
  return (
    <span className={`fact-label ${LABELS[label] || ""}`}>{label}</span>
  );
}

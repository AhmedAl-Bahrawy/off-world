// Visual badge distinguishing verified NASA history from fictional story content.
export default function Badge({ kind = "fiction", as = "span" }) {
  const verified = kind === "verified";
  const Tag = as;
  return (
    <Tag className={`badge ${verified ? "badge-verified" : "badge-fiction"}`}>
      {verified ? "✓ VERIFIED NASA HISTORY" : "⚑ FICTIONAL STORY LOG"}
    </Tag>
  );
}

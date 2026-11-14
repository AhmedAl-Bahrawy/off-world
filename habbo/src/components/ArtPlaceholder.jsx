const media = [
  {
    match: "voyager-art",
    src: "/images/voyager-archive.jpg",
    alt: "Engineers working on a NASA Voyager spacecraft",
    credit: "NASA / JPL-Caltech",
  },
  {
    match: "mars-art",
    src: "/images/opportunity-shadow.jpeg",
    alt: "NASA's Opportunity rover casting a shadow on Mars",
    credit: "NASA / JPL-Caltech",
  },
  {
    match: "moon-art",
    src: "/images/apollo17-blue-marble.jpg",
    alt: "Earth photographed by the Apollo 17 crew",
    credit: "NASA",
  },
  {
    match: "earth-art",
    src: "/images/apollo17-blue-marble.jpg",
    alt: "Earth photographed by the Apollo 17 crew",
    credit: "NASA",
  },
];

export default function ArtPlaceholder({ variant = "" }) {
  const asset = media.find((item) => variant.includes(item.match));

  return (
    <div
      className={`art-placeholder ${variant} ${asset ? "art-placeholder--media" : ""}`}
      role="img"
      aria-label={asset?.alt || "Decorative mission artwork placeholder"}
    >
      {asset && <img className="art-placeholder__image" src={asset.src} alt="" />}
      <span className="art-placeholder__scan" />
      <span className="art-placeholder__orb" aria-hidden="true" />
      <span className="art-placeholder__label">
        {asset ? `ARCHIVE IMAGE / ${asset.credit}` : "ARCHIVE IMAGE / RECONSTRUCTION"}
      </span>
      <span className="art-placeholder__cross">✛</span>
    </div>
  );
}

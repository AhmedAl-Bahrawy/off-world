// Homepage portal data. Presentation lives in src/components.

export const featuredTransmission = {
  eyebrow: "TRANSMISSION 001 / DEEP SPACE",
  title: "The machine that carried Earth's hello.",
  artClass: "voyager-art feature-art",
  href: "#voyager",
};

export const transmissions = [
  {
    date: "05 SEP 1977",
    title: "Voyager 1 leaves Earth",
    detail: "A machine begins its journey beyond the outer planets.",
    href: "#voyager",
  },
  {
    date: "24 JAN 2004",
    title: "Opportunity reaches Mars",
    detail: "A 90-sol mission begins an almost 15-year expedition.",
    href: "#mars",
  },
  {
    date: "10 JUN 2018",
    title: "The last Opportunity signal",
    detail: "A final communication arrives from the Red Planet.",
    href: "#mars",
  },
  {
    date: "13 FEB 2019",
    title: "Mission declared complete",
    detail: "NASA concludes the Opportunity mission.",
    href: "#mars",
  },
];

export const briefing = {
  intro:
    "In 2251, an expedition from Kalamith reaches the Solar System. Humanity sent a call for help. No one has answered.",
  instruction:
    "Explore the machines humanity left behind and reconstruct the story they were built to tell.",
  linkLabel: "READ THE EXPEDITION LOG »",
  linkHref: "#voyager",
};

export const signalStatus = {
  headline: "NO HUMAN RESPONSE",
  subline: "EARTH COMMUNICATION CHANNEL",
  note: "Fictional expedition interface. Not a real NASA communication status.",
};

export const fieldNotes = [
  {
    id: "001",
    text: "They searched the stars for life. Now we search for them.",
    signature: "— KALAMITHIAN EXPEDITION LOG",
  },
  {
    id: "002",
    text: "Every machine still transmits, in its way. We only have to learn to listen.",
    signature: "— KALAMITHIAN EXPEDITION LOG",
  },
];

export const archiveLinks = [
  { label: "DEEP SPACE", index: "01", href: "#voyager", icon: "◉" },
  { label: "MARS SURFACE", index: "02", href: "#mars", icon: "▦" },
  { label: "LUNAR RECORDS", index: "03", href: "#moon", icon: "☾" },
  { label: "SOLAR SYSTEM MAP", index: "04", href: "#archive", icon: "⌖" },
  { label: "HISTORICAL TIMELINE", index: "05", href: "#timeline", icon: "⌁" },
];

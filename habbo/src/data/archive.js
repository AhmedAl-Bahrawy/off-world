// Archive data: artifact cards, the Golden Record panel, the schematic map,
// and the global source list.

export const artifacts = [
  {
    id: "artifact-voyager",
    name: "Voyager 1 Spacecraft",
    status: "EXTENDED MISSION",
    summary:
      "The farthest human-made object. It studies the space between stars and carries Earth's greeting.",
    detail:
      "Launched 5 September 1977. Flew past Jupiter (1979) and Saturn (1980), entered interstellar space in 2012, and continues NASA's extended mission with reduced power.",
    className: "voyager-art",
    href: "#voyager",
  },
  {
    id: "artifact-record",
    name: "The Golden Record",
    status: "CARGO / MESSAGE",
    summary:
      "A phonograph record carrying greetings, sounds, images, and music for any finder.",
    detail:
      "Greetings in 55 languages, 90 minutes of music, encoded images, and a cover etched with playing instructions and a pulsar map locating Earth's Sun.",
    className: "voyager-art",
    href: "#voyager",
  },
  {
    id: "artifact-opportunity",
    name: "Opportunity Rover",
    status: "MISSION COMPLETE",
    summary:
      "A 90-sol rover that explored Meridiani Planum for almost 15 years before falling silent in 2018.",
    detail:
      "Landed 24 January 2004. Its instruments documented water-altered rocks; last communication 10 June 2018, mission declared complete 13 February 2019.",
    className: "mars-art",
    href: "#mars",
  },
  {
    id: "artifact-lrv",
    name: "Lunar Roving Vehicle",
    status: "HARDWARE LEFT BEHIND",
    summary:
      "Apollo 17's electric car on the Moon, used to traverse roughly 35.7 km of the Taurus–Littrow valley.",
    detail:
      "Three rovers were left parked on the Moon by the final three Apollo missions; Apollo 17's remains at the landing site, still parked where the crew last stopped.",
    className: "moon-art",
    href: "#moon",
  },
  {
    id: "artifact-alsep",
    name: "ALSEP Experiment Stations",
    status: "SHUT DOWN 1977",
    summary:
      "Powered instrument suites deployed by Apollo 12–17 that measured the lunar environment for years.",
    detail:
      "Apollo 17's package included heat flow, gravimeter, ejecta/meteorite, and atmospheric composition experiments. The network was switched off on 30 September 1977.",
    className: "moon-art",
    href: "#moon",
  },
];

export const goldenRecord = {
  intro:
    "The Golden Record carries greetings, sounds, images, and music selected to introduce Earth and its inhabitants to a possible finder.",
  source: {
    label: "NASA — Voyager Golden Record (in-depth)",
    href: "https://solarsystem.nasa.gov/missions/voyager-1/in-depth/",
  },
  categories: [
    {
      id: "greetings",
      tab: "01 / GREETINGS",
      heading: "Greetings in 55 languages",
      text: "Spoken welcomes from people around the world, from ancient dialects to modern languages, followed by a message from a UN representative of that era.",
    },
    {
      id: "sounds",
      tab: "02 / SOUNDS OF EARTH",
      heading: "A portrait in sound",
      text: "Thunder, wind, rain, surf, animal calls, footsteps, laughter, a kiss, a heartbeat — an audio snapshot of life and activity on the third planet.",
    },
    {
      id: "images",
      tab: "03 / IMAGES",
      heading: "115 encoded images",
      text: "Diagrams, photographs, and illustrations encoded onto the record: people, landscapes, architecture, chemistry, and the Solar System.",
    },
    {
      id: "music",
      tab: "04 / MUSIC",
      heading: "90 minutes of music",
      text: "A playlist spanning cultures and eras, selected to represent the diversity of Earth's musical traditions.",
    },
    {
      id: "instructions",
      tab: "05 / INSTRUCTIONS",
      heading: "How to play it, and where it came from",
      text: "The record's cover is etched with diagrams: how to play the disc at the correct speed, and a pulsar map showing the location of our Sun within the galaxy.",
    },
  ],
};

// Schematic map of the Solar System as the expedition sees it.
// Deliberately illustrative: no precise spacecraft coordinates.
export const archiveMap = {
  note: "SCHEMATIC — NOT TO SCALE / POSITIONS ILLUSTRATIVE",
  stops: [
    {
      id: "sun",
      x: 50,
      y: 50,
      label: "SOL",
      sub: "System centre",
      href: null,
    },
    {
      id: "earth",
      x: 50,
      y: 20,
      label: "EARTH + THE MOON",
      sub: "Chapters 03–04",
      href: "#moon",
    },
    {
      id: "mars",
      x: 79,
      y: 38,
      label: "MARS",
      sub: "Chapter 02 / Opportunity",
      href: "#mars",
    },
    {
      id: "voyager",
      x: 88,
      y: 78,
      label: "VOYAGER 1",
      sub: "Chapter 01 / outward bound",
      href: "#voyager",
    },
  ],
};

export const sources = [
  {
    label: "JPL — Voyager Image Gallery",
    href: "https://www.jpl.nasa.gov/voyager-image-gallery/",
  },
  {
    label: "NASA — Opportunity Image Archive",
    href: "https://science.nasa.gov/mission/mer-opportunity/",
  },
  {
    label: "NASA — Apollo 17 Blue Marble",
    href: "https://www.nasa.gov/image-article/blue-marble-image-of-earth-from-apollo-17/",
  },
  {
    label: "NASA — Voyager 1",
    href: "https://science.nasa.gov/mission/voyager/voyager-1/",
  },
  {
    label: "NASA — Voyager Mission Overview",
    href: "https://science.nasa.gov/mission/voyager/",
  },
  {
    label: "NASA/JPL — Voyager Instruments",
    href: "https://voyager.jpl.nasa.gov/mission/spacecraft/instruments/",
  },
  {
    label: "NASA/JPL — Live Voyager Mission Status",
    href: "https://voyager.jpl.nasa.gov/mission/status/",
  },
  {
    label: "NASA — Voyager 1 In-Depth (Golden Record)",
    href: "https://solarsystem.nasa.gov/missions/voyager-1/in-depth/",
  },
  {
    label: "NASA — Opportunity (MER)",
    href: "https://science.nasa.gov/mission/mer-opportunity/",
  },
  {
    label: "NASA/JPL — MER Science Instruments",
    href: "https://mars.nasa.gov/mer/mission/instruments/",
  },
  {
    label: "NASA — Apollo 17",
    href: "https://www.nasa.gov/mission/apollo-17/",
  },
  {
    label: "NSSDCA — Apollo 17 Information",
    href: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo17info.html",
  },
  {
    label: "LPI — ALSEP Experiments",
    href: "https://www.lpi.usra.edu/lunar/ALSEP/",
  },
  {
    label: "NASA Planetary Data System",
    href: "https://pds.nasa.gov/",
  },
];

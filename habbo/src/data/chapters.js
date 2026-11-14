// Story chapter content. Every block carries an explicit label so fiction
// and NASA history are never mixed. Labels:
//   HISTORICAL FACT  — verified NASA history
//   SCIENTIFIC DATA  — measured or sourced mission data
//   EXPEDITION LOG   — fictional Kalamithian crew narration
//   RECONSTRUCTION   — visual/narrative reconstruction, not a real recording

export const chapters = [
  {
    id: "voyager",
    number: "01",
    eyebrow: "DEEP SPACE / CONTACT",
    title: "A Message From The Past",
    description:
      "A silent probe carries a greeting from a civilisation that once looked beyond its own world.",
    artifact: "VOYAGER 1",
    date: "1977 — PRESENT",
    status: "EXTENDED MISSION",
    className: "voyager-art",
    art: "voyager-art story-art",
    titleLong: "Contact — Voyager 1",
    subtitle: "A greeting from Earth, carried into the dark.",
    introLabel: "HISTORICAL FACT",
    intro:
      "Voyager 1 was launched on 5 September 1977 to study the outer Solar System. It flew past Jupiter in 1979 and Saturn in 1980, then kept travelling outward. NASA confirmed that it crossed into interstellar space in 2012.",
    note:
      "Voyager is not an abandoned relic: both spacecraft continue NASA's extended Interstellar Mission, though instruments and power levels have changed over the years.",
    facts: [
      { term: "LAUNCH", value: "05 SEP 1977" },
      { term: "JUPITER", value: "1979" },
      { term: "SATURN", value: "1980" },
      { term: "INTERSTELLAR", value: "2012" },
    ],
    instrumentSet: "voyager",
    instrumentTitle: "THE SPACECRAFT'S EYES AND EARS",
    blocks: [
      {
        label: "EXPEDITION LOG",
        text: "Crew record: the probe still holds its course. Its power is fading, yet it whispers toward whatever lies ahead of it. We followed its arrow for three days before approaching.",
      },
      {
        label: "SCIENTIFIC DATA",
        text: "Voyager 1 is the farthest human-made object from Earth — more than 24 billion kilometres (2025, approximate; the distance changes daily). Check the live mission status for current figures.",
        source: {
          label: "NASA/JPL — Live Voyager Mission Status",
          href: "https://voyager.jpl.nasa.gov/mission/status/",
        },
      },
    ],
    source: {
      label: "NASA — Voyager 1",
      href: "https://science.nasa.gov/mission/voyager/voyager-1/",
    },
  },
  {
    id: "mars",
    number: "02",
    eyebrow: "MARS / THE SEARCH",
    title: "The Last Signal",
    description:
      "A rover designed for 90 sols survives almost 15 years, searching ancient rocks for the story of water.",
    artifact: "OPPORTUNITY",
    date: "2003 — 2019",
    status: "MISSION COMPLETE",
    className: "mars-art",
    art: "mars-art story-art",
    titleLong: "The Search — Opportunity",
    subtitle: "A rover built for 90 sols. A journey that lasted almost 15 years.",
    introLabel: "HISTORICAL FACT",
    intro:
      "The Opportunity rover launched in 2003 and landed at Meridiani Planum on 24 January 2004. Its designed mission lasted 90 Martian days (sols). Instead it operated for almost 15 years, until its final communication on 10 June 2018. NASA declared the mission complete on 13 February 2019.",
    note:
      "Opportunity did not discover life. It found geological evidence of environments that liquid water once altered — the interpretation stops at the rocks.",
    facts: [
      { term: "LAUNCH", value: "2003" },
      { term: "LANDING", value: "24 JAN 2004" },
      { term: "LAST CONTACT", value: "10 JUN 2018" },
      { term: "MISSION ENDED", value: "13 FEB 2019" },
    ],
    instrumentSet: "mars",
    instrumentTitle: "THE ROVER'S SCIENCE INSTRUMENTS",
    blocks: [
      {
        label: "SCIENTIFIC DATA",
        text: "Evidence of ancient water: Opportunity found hematite spherules nicknamed \"blueberries\", sulfate-rich salts, and layered sedimentary textures at Meridiani Planum. NASA's interpretation: these deposits formed in environments where liquid water was once present.",
        source: {
          label: "NASA/JPL — Opportunity mission overview",
          href: "https://science.nasa.gov/mission/mer-opportunity/",
        },
      },
      {
        label: "EXPEDITION LOG",
        text: "Crew record: the rover froze mid-task, wheels half-turned toward a crater rim. A tidy machine, patient to the end. Its dust marks read like handwriting to us.",
      },
      {
        label: "RECONSTRUCTION",
        text: "The Kalamithian approach map of the rover's traverse is an expedition reconstruction for orientation only — not a NASA navigational record.",
      },
    ],
    source: {
      label: "NASA — Opportunity (MER)",
      href: "https://science.nasa.gov/mission/mer-opportunity/",
    },
  },
  {
    id: "moon",
    number: "03",
    eyebrow: "LUNAR SURFACE / FOOTSTEPS",
    title: "Where Humans Once Stood",
    description:
      "A human landing site preserves the tools, experiments, and traces of an extraordinary visit.",
    artifact: "APOLLO 17",
    date: "1972",
    status: "HISTORICAL ARCHIVE",
    className: "moon-art",
    art: "moon-art story-art",
    titleLong: "Footsteps — Apollo 17",
    subtitle: "Humans left more than footprints. They left experiments behind.",
    introLabel: "HISTORICAL FACT",
    intro:
      "Apollo 17 launched on 7 December 1972 and landed in the Taurus–Littrow valley on 11 December 1972. The crew — Eugene Cernan, Harrison Schmitt, and Ronald Evans — carried out the final crewed Apollo lunar landing, deploying experiments and exploring with a Lunar Roving Vehicle.",
    note:
      "Apollo 11's early, lightweight EASEP package differed from the full ALSEP stations carried by later landings. The ALSEP network was shut down on 30 September 1977.",
    facts: [
      { term: "LAUNCH", value: "07 DEC 1972" },
      { term: "LANDING", value: "11 DEC 1972" },
      { term: "ROVER RANGE", value: "~35.7 KM" },
      { term: "ALSEP SHUTDOWN", value: "SEP 1977" },
    ],
    blocks: [
      {
        label: "HISTORICAL FACT",
        heading: "EASEP vs ALSEP",
        text: "Apollo 11 (1969) carried only the Early Apollo Scientific Experiments Package — a lightweight set including the Passive Laser Ranging Retroreflector and a Solar Wind Composition experiment. From Apollo 12 onward, each landing deployed a full ALSEP station: a powered suite of experiments that transmitted for years. The ALSEP network was switched off on 30 September 1977 for budget reasons.",
        source: {
          label: "LPI — Apollo Lunar Surface Experiments Package (ALSEP)",
          href: "https://www.lpi.usra.edu/lunar/ALSEP/",
        },
      },
      {
        label: "SCIENTIFIC DATA",
        heading: "Apollo 17's experiments",
        text: "Apollo 17's ALSEP package included a Heat Flow Experiment, a Lunar Surface Gravimeter, a Lunar Ejecta and Meteorites Experiment, and a Lunar Atmospheric Composition Experiment. Together with the Lunar Roving Vehicle — which traversed roughly 35.7 km — they measured the Moon's interior heat, seismic and gravitational behaviour, and surface environment.",
        source: {
          label: "NASA — Apollo 17 mission record",
          href: "https://www.nasa.gov/mission/apollo-17/",
        },
      },
      {
        label: "HISTORICAL FACT",
        heading: "Hardware left behind",
        text: "The descent stage, Lunar Roving Vehicle, ALSEP central station, cameras, tools, and equipment remain at the Taurus–Littrow landing site, along with the crew's footprints — preserved because the Moon has no wind or water to erase them.",
        source: {
          label: "NASA — Apollo 17",
          href: "https://www.nasa.gov/mission/apollo-17/",
        },
      },
      {
        label: "EXPEDITION LOG",
        text: "Crew record: we hovered over the tracks for a long time. Someone stood there, gathered rock, and drove a small vehicle across a silent plain. Then they never came back to this place.",
      },
    ],
    source: {
      label: "NASA — Apollo 17",
      href: "https://www.nasa.gov/mission/apollo-17/",
    },
  },
];

// Chapter 4 is fully fictional and ends before landing.
export const arrival = {
  id: "arrival",
  eyebrow: "CHAPTER 04 / ARRIVAL",
  title: "We found your home.",
  lines: ["It is blue, and loud with life.", "But where are you?"],
  blocks: [
    {
      label: "EXPEDITION LOG",
      text: "Crew record: we are in orbit above the third planet. We hear weather, oceans, forests — everything is alive except the reply to the distress call. Approach will stop here. We will not land until someone answers.",
    },
    {
      label: "RECONSTRUCTION",
      text: "This log is fiction. OFF-WORLD's public story does not explain humanity's disappearance — that mystery stays open.",
    },
  ],
  artClass: "earth-art arrival-art",
};

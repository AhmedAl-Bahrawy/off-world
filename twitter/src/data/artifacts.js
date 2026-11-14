// Artifact archive — facts drawn from NASA primary sources (URLs cited per artifact).
// The `log` field is FICTIONAL STORY content and must always be rendered with a fiction label.

export const categories = [
  { id: "all", label: "Everything" },
  { id: "deep-space", label: "Deep Space" },
  { id: "mars", label: "Mars" },
  { id: "moon", label: "The Moon" },
  { id: "earth", label: "Earth / Return" },
];

export const statusTypes = {
  transmitting: { label: "Still transmitting", tone: "green" },
  silent: { label: "Silent", tone: "grey" },
  deployed: { label: "Left in place", tone: "lime" },
  returned: { label: "Returned to Earth", tone: "blue" },
};

const nasa = {
  voyager: "https://science.nasa.gov/mission/voyager/",
  voyagerStatus: "https://science.nasa.gov/mission/voyager/where-are-they-now/",
  record: "https://science.nasa.gov/mission/voyager/golden-record/",
  recordCover: "https://science.nasa.gov/mission/voyager/golden-record/cover-of-the-golden-record/",
  paleBlueDot: "https://science.nasa.gov/mission/voyager/voyager-1/pale-blue-dot/",
  marsExploration: "https://science.nasa.gov/mars/",
  viking: "https://science.nasa.gov/mission/viking/",
  spirit: "https://science.nasa.gov/mission/mars-rover-spirit/",
  opportunity: "https://science.nasa.gov/mission/mars-rover-opportunity/",
  insight: "https://science.nasa.gov/mission/insight/",
  apollo: "https://www.nasa.gov/humans-in-space/apollo-missions/",
  apollo11: "https://www.nasa.gov/mission/apollo-11/",
  apollo15: "https://www.nasa.gov/mission/apollo-15/",
  apolloLanding: "https://www.nasa.gov/history/alsj/",
};

export const artifacts = [
  {
    slug: "golden-record",
    name: "The Golden Record",
    mission: "Voyager 1 & Voyager 2",
    category: "deep-space",
    status: "deployed",
    launch: "Mounted on Voyagers launched 20 Aug 1977 (Voyager 2) and 5 Sep 1977 (Voyager 1)",
    location: "Bound for interstellar space aboard both Voyagers",
    purpose:
      "A 12-inch gold-plated copper phonograph record carrying sounds and images selected to portray the diversity of Earth. Intended for any finder, far more than for any listener.",
    instruments: "Encoded in the record: 55 greetings in 55 languages, 27 musical pieces, natural sounds of Earth, and 115 images",
    statusDetail:
      "Physically attached to the spacecraft. Neither Voyager carries equipment to play it back; the record is a message, not an instrument.",
    discoveries:
      "The record's cover carries playing instructions, a hydrogen-atom diagram, and a pulsar map marking the location of our Sun — an address written before we knew who might read it.",
    sources: [
      { label: "NASA — The Golden Record", url: nasa.record },
      { label: "NASA — Cover of the Golden Record", url: nasa.recordCover },
    ],
    log: "We found the record first — a round golden mirror, bolted to the hull. It does not transmit. It waits. Someone on Earth wanted to be introduced before they were understood.",
  },
  {
    slug: "voyager-1",
    name: "Voyager 1",
    mission: "Voyager",
    category: "deep-space",
    status: "transmitting",
    launch: "5 September 1977",
    location: "Interstellar space — the farthest human-made object",
    purpose:
      "A twin-planet grand tour spacecraft that studied Jupiter and Saturn before heading out of the solar system. It is still returning data from beyond the Sun's heliosphere.",
    instruments: "Plasma wave subsystem, cosmic ray subsystem, magnetometer, low-energy charged particle detector",
    statusDetail:
      "NASA's Voyager mission status reports confirm Voyager 1 is still transmitting from interstellar space, decades past its original four-year mission.",
    discoveries:
      "Entered interstellar space in August 2012, becoming the first human-made object to do so. In 1990 it turned back to photograph Earth from ~6.4 billion kilometers — the Pale Blue Dot.",
    sources: [
      { label: "NASA — Voyager mission", url: nasa.voyager },
      { label: "NASA — Voyager: Where are they now", url: nasa.voyagerStatus },
      { label: "NASA — Pale Blue Dot", url: nasa.paleBlueDot },
    ],
    log: "It still whispers. One by one, its instruments have gone dark, but the whisper continues. The machine that answered is the machine that asked.",
  },
  {
    slug: "pale-blue-dot",
    name: "The Pale Blue Dot photograph",
    mission: "Voyager 1",
    category: "earth",
    status: "returned",
    launch: "Image taken 14 February 1990",
    location: "Taken from ~6.4 billion km away; original data returned to Earth",
    purpose:
      "At the suggestion of the imaging team, Voyager 1 turned its camera homeward for a final family portrait of the solar system. Earth appears as a pale blue dot in a ray of scattered light.",
    instruments: "Voyager's slow-scan color TV camera",
    statusDetail:
      "Voyager's cameras were shut off shortly afterward to conserve power for interstellar science. The image survives as data, then as picture.",
    discoveries:
      "It is the most distant portrait of Earth ever made — and in our story, the last frame in which humanity appears: alive, crowded, and already gone quiet.",
    sources: [{ label: "NASA — Pale Blue Dot", url: nasa.paleBlueDot }],
    log: "The archive calls it 'the last portrait.' Blue, small, veiled in light. Something moved down there. Something had been writing to us. Then it stopped.",
  },
  {
    slug: "spirit-rover",
    name: "Spirit (MER-A)",
    mission: "Mars Exploration Rover",
    category: "mars",
    status: "silent",
    launch: "10 June 2003 · landed 4 January 2004 (UTC)",
    location: "Gusev crater, Columbia Hills — left where she fell silent",
    purpose:
      "A wheeled geologist designed for a 90-sol mission to read the rocks of Gusev crater — a crater that may once have held a lake.",
    instruments: "Panoramic Camera (Pancam), Miniature Thermal Emission Spectrometer (Mini-TES), Mössbauer spectrometer, Alpha Particle X-ray Spectrometer, Microscopic Imager, Rock Abrasion Tool",
    statusDetail:
      "Spirit became embedded in soft soil in 2009. Her last transmission arrived on 22 March 2010; NASA declared the mission over in May 2011. The rover remains on Mars, inert.",
    discoveries:
      "Found mineral evidence that hot springs and ancient water altered the rocks of Gusev crater, including silica-rich soils near the feature called Home Plate.",
    sources: [
      { label: "NASA — Mars rover Spirit", url: nasa.spirit },
      { label: "NASA — Mars exploration", url: nasa.marsExploration },
    ],
    log: "Her wheel tracks end in soft ground. Around her: a plain that used to be a lake. She died pointing at the hills she never reached.",
  },
  {
    slug: "opportunity-rover",
    name: "Opportunity (MER-B)",
    mission: "Mars Exploration Rover",
    category: "mars",
    status: "silent",
    launch: "8 July 2003 · landed 25 January 2004 (UTC)",
    location: "Perseverance Valley, Endeavour crater rim, Meridiani Planum",
    purpose:
      "Spirit's twin, set down on the opposite side of Mars to read hematite-rich plains — and to find out whether Mars was once habitable.",
    instruments: "Panoramic Camera (Pancam), Miniature Thermal Emission Spectrometer (Mini-TES), Mössbauer spectrometer, Alpha Particle X-ray Spectrometer, Microscopic Imager, Rock Abrasion Tool",
    statusDetail:
      "A global dust storm silenced Opportunity on 10 June 2018; NASA declared the mission ended on 13 February 2019 after a final, unanswered call.",
    discoveries:
      "Drove more than 45 km over 14+ years and found multiple lines of evidence that acidic groundwater and ancient water systems shaped Meridiani Planum.",
    sources: [
      { label: "NASA — Mars rover Opportunity", url: nasa.opportunity },
      { label: "NASA — Mars exploration", url: nasa.marsExploration },
    ],
    log: "The last message from Opportunity was a silence where a reply should be. Our engineers replayed her final data for weeks. There is nothing like a dead robot to teach you about waiting.",
  },
  {
    slug: "viking-1-lander",
    name: "Viking 1 Lander",
    mission: "Viking",
    category: "mars",
    status: "silent",
    launch: "20 August 1975 · landed 20 July 1976",
    location: "Chryse Planitia — the site was later named the Thomas Mutch Memorial Station",
    purpose:
      "The first successful Mars lander: an entire biology laboratory set down on another planet, built to test Martian soil for signs of life.",
    instruments: "Biology instrument, gas chromatograph/mass spectrometer, X-ray fluorescence spectrometer, two cameras, meteorology sensors",
    statusDetail:
      "The lander outlived its 90-day design by years. Its last transmission was received in November 1982, after a faulty ground command cut it off. The hardware still stands at Chryse Planitia, silent.",
    discoveries:
      "Returned the first images from the Martian surface and detailed soil analyses; its biology results were ambiguous — intriguing chemistry, no confirmed life.",
    sources: [{ label: "NASA — Viking mission", url: nasa.viking }],
    log: "This is the oldest listening post we have found on Mars. It asked its questions in 1976 and kept asking until 1982. Then the answers stopped mid-sentence.",
  },
  {
    slug: "sojourner-rover",
    name: "Sojourner",
    mission: "Mars Pathfinder",
    category: "mars",
    status: "silent",
    launch: "4 December 1996 · landed 4 July 1997",
    location: "Ares Vallis flood plain",
    purpose:
      "The first rover on Mars — a microwave-oven-sized testbed proving that small rovers could drive, sense, and survive on another planet.",
    instruments: "Alpha Proton X-ray Spectrometer, three cameras, wheel abrasion experiments",
    statusDetail:
      "Sojourner communicated through the Pathfinder lander. Both went silent after 27 September 1997. The rover remains where it last parked, near the lander later named the Carl Sagan Memorial Station.",
    discoveries:
      "Demonstrated rover-based surface science on Mars for the first time and analyzed rock compositions at the landing site.",
    sources: [
      { label: "NASA — Mars Pathfinder (via Mars exploration)", url: nasa.marsExploration },
    ],
    log: "A toy, by our standards. A toy that carried a whole civilization's first steps across a flood plain. We stand where it stood and feel very large and very late.",
  },
  {
    slug: "insight-lander",
    name: "InSight Lander",
    mission: "InSight",
    category: "mars",
    status: "silent",
    launch: "5 May 2018 · landed 26 November 2018",
    location: "Elysium Planitia",
    purpose:
      "A station built not to look at Mars but to listen to it — a seismometer planted to record marsquakes and reveal the planet's interior.",
    instruments: "Seismic Experiment for Interior Structure (SEIS), Heat Flow and Physical Properties Package (HP³), Rotation and Interior Structure Experiment (RISE), plus a robotic arm and cameras",
    statusDetail:
      "Dust slowly covered InSight's solar panels. NASA retired the lander after its final transmission on 15 December 2022. The dome and solar wings remain at Elysium Planitia.",
    discoveries:
      "Recorded more than 1,300 marsquakes, measured the crust, and detected the strongest quake ever heard on another planet (a magnitude 5 in May 2022).",
    sources: [{ label: "NASA — InSight mission", url: nasa.insight }],
    log: "Of all the machines on Mars, this one was a listener. For four Earth years it heard the planet groan. We put our hands on its dome. It heard nothing from us either.",
  },
  {
    slug: "apollo-11-alsj-site",
    name: "Tranquility Base hardware",
    mission: "Apollo 11",
    category: "moon",
    status: "deployed",
    launch: "Landed 20 July 1969 (UTC)",
    location: "Mare Tranquillitatis — the Eagle descent stage is still there",
    purpose:
      "The first landing site: an Eagle ascent stage that flew home and a descent stage, experiment package, retroreflector, flags, and footprints that stayed.",
    instruments: "Early Apollo Scientific Experiments Package (EASEP) including a passive seismometer and a laser-ranging retroreflector",
    statusDetail:
      "All surface hardware remains in place. The Apollo 11 retroreflector is still used in lunar laser-ranging experiments from Earth — the site is abandoned, not useless.",
    discoveries:
      "Laser pulses bounced off the Apollo retroreflectors have refined the Earth–Moon distance for decades and continue to be used by observatories today.",
    sources: [
      { label: "NASA — Apollo 11", url: nasa.apollo11 },
      { label: "NASA — Apollo Lunar Surface Journal", url: nasa.apolloLanding },
    ],
    log: "The base is a scorch mark, two machines, and a lattice of footprints. The footprints are the part that stops us talking. Nothing has disturbed them in our entire history of looking.",
  },
  {
    slug: "lunar-roving-vehicles",
    name: "Lunar Roving Vehicles (3)",
    mission: "Apollo 15, 16, 17",
    category: "moon",
    status: "deployed",
    launch: "Parked at Hadley–Apennine (1971), Descartes (1972), Taurus–Littrow (1972)",
    location: "Three rovers, three landing sites — all left behind",
    purpose:
      "Electric cars that let the last three crews range kilometers from their landers. At mission end, each crew parked the rover a safe distance from the liftoff point and walked away.",
    instruments: "TV cameras, wheel-mounted suspension experiments, geology sampling tools carried aboard",
    statusDetail:
      "NASA practice was to leave the rovers at the site — they were one-way vehicles. All three remain parked at their final positions, tires still holding their track.",
    discoveries:
      "Their footage and traverses mapped kilometers of lunar geology and remain the reference for the most distant human drives on another world.",
    sources: [
      { label: "NASA — Apollo 15", url: nasa.apollo15 },
      { label: "NASA — Apollo program", url: nasa.apollo },
    ],
    log: "Three cars parked on a dead world, keys (figuratively) in the ignition. Our archivist calls them 'the fleet of the abandoned commute.'",
  },
  {
    slug: "lunar-samples",
    name: "382 kg of the Moon",
    mission: "Apollo 11–17",
    category: "earth",
    status: "returned",
    launch: "Returned between 1969 and 1972",
    location: "On Earth — NASA lunar sample laboratories",
    purpose:
      "The crews brought home rock and soil from six landing sites — the physical counterpart to everything they left behind.",
    instruments: "Sealed sample return containers, documented field geology kits",
    statusDetail:
      "Unlike the surface hardware, the samples came home. Some remain sealed, held back for future instruments — a message to the future, written in rock.",
    discoveries:
      "The samples rewrote lunar science: the Moon's age, its volcanic history, and the evidence for a giant-impact origin all rest on them.",
    sources: [
      { label: "NASA — Apollo program", url: nasa.apollo },
      { label: "NASA — Apollo Lunar Surface Journal", url: nasa.apolloLanding },
    ],
    log: "They took the Moon in pieces and left themselves behind instead. The exchange rate of the whole expedition is written in those two lines of cargo.",
  },
  {
    slug: "earthrise",
    name: "Earthrise photograph",
    mission: "Apollo 8",
    category: "earth",
    status: "returned",
    launch: "Image taken 24 December 1968",
    location: "Taken in lunar orbit; original on film returned to Earth",
    purpose:
      "While orbiting the Moon, the Apollo 8 crew saw Earth rise over the lunar horizon and photographed it — the first Earthrise seen by human eyes.",
    instruments: "70 mm Hasselblad camera (mounted on the spacecraft)",
    statusDetail:
      "The film was returned with the crew. The view itself belongs to lunar orbit; the photograph is the only piece of it that came home.",
    discoveries:
      "Widely credited with energizing the modern environmental movement — proof that the exploration of other worlds changes how we see our own.",
    sources: [
      { label: "NASA — Apollo program", url: nasa.apollo },
    ],
    log: "The last picture in the sequence before the silence. A blue world rising over stone. We have enhanced it a thousand times. Humanity never comes back into frame.",
  },
];

export const featuredSlugs = ["golden-record", "spirit-rover", "apollo-11-alsj-site", "voyager-1"];

export function getArtifact(slug) {
  return artifacts.find((a) => a.slug === slug);
}

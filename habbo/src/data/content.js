export const navigation = [
  { label: "HOME", href: "#home" },
  { label: "VOYAGER", href: "#voyager" },
  { label: "MARS", href: "#mars" },
  { label: "THE MOON", href: "#moon" },
  { label: "TIMELINE", href: "#timeline" },
  { label: "ARCHIVE", href: "#archive" },
];

export const transmissions = [
  { date: "05 SEP 1977", title: "Voyager 1 leaves Earth", detail: "A machine begins its journey beyond the outer planets.", href: "#voyager" },
  { date: "24 JAN 2004", title: "Opportunity reaches Mars", detail: "A 90-sol mission begins an almost 15-year expedition.", href: "#mars" },
  { date: "10 JUN 2018", title: "The last Opportunity signal", detail: "A final communication arrives from the Red Planet.", href: "#mars" },
  { date: "13 FEB 2019", title: "Mission declared complete", detail: "NASA concludes the Opportunity mission.", href: "#mars" },
];

export const chapters = [
  {
    id: "voyager",
    number: "01",
    eyebrow: "DEEP SPACE / CONTACT",
    title: "A Message From The Past",
    description: "A silent probe carries a greeting from a civilisation that once looked beyond its own world.",
    artifact: "VOYAGER 1",
    date: "1977 — PRESENT",
    status: "EXTENDED MISSION",
    className: "voyager-art",
  },
  {
    id: "mars",
    number: "02",
    eyebrow: "MARS / THE SEARCH",
    title: "The Last Signal",
    description: "A rover designed for 90 sols survives almost 15 years, searching ancient rocks for the story of water.",
    artifact: "OPPORTUNITY",
    date: "2003 — 2019",
    status: "MISSION COMPLETE",
    className: "mars-art",
  },
  {
    id: "moon",
    number: "03",
    eyebrow: "LUNAR SURFACE / FOOTSTEPS",
    title: "Where Humans Once Stood",
    description: "A human landing site preserves the tools, experiments, and traces of an extraordinary visit.",
    artifact: "APOLLO 17",
    date: "1972",
    status: "HISTORICAL ARCHIVE",
    className: "moon-art",
  },
];

export const timeline = [
  { year: "1969", title: "Apollo 11", text: "Humans walk on the Moon for the first time." },
  { year: "1972", title: "Apollo 17", text: "The final crewed Apollo lunar landing deploys scientific experiments." },
  { year: "1977", title: "Voyager 1", text: "A spacecraft carrying the Golden Record begins its journey." },
  { year: "1979", title: "Jupiter encounter", text: "Voyager 1 studies Jupiter and its moons." },
  { year: "1980", title: "Saturn encounter", text: "Voyager 1 explores Saturn and its rings." },
  { year: "2004", title: "Opportunity landing", text: "The rover begins exploring Meridiani Planum." },
  { year: "2012", title: "Interstellar space", text: "Voyager 1 enters interstellar space." },
  { year: "2018", title: "Last contact", text: "The final communication from Opportunity is received." },
  { year: "2019", title: "Opportunity mission ends", text: "NASA declares the mission complete." },
];

export const instruments = [
  { name: "Pancam", purpose: "Captures panoramic images to study terrain, rocks, and the rover's surroundings." },
  { name: "Microscopic Imager", purpose: "Reveals fine surface textures in rocks and soil." },
  { name: "Rock Abrasion Tool", purpose: "Brushes or grinds away a rock's weathered outer layer so instruments can inspect fresh material." },
  { name: "APXS", purpose: "Measures the elemental chemistry of rocks and soil." },
  { name: "Mini-TES", purpose: "Studies infrared emissions to help identify minerals and their formation environments." },
  { name: "Mössbauer Spectrometer", purpose: "Investigates iron-bearing minerals and their chemical states." },
];

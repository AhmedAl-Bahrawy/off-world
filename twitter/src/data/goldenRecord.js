// The Golden Record interactive content — factual, from NASA pages (no audio, no copyrighted media).
export const recordSections = [
  {
    id: "greetings",
    label: "Greetings",
    headline: "55 greetings in 55 languages",
    intro:
      "The record opens with spoken hellos in 55 languages — from ancient languages like Sumerian and Akkadian to living ones like Bengali and Wu. A message from the United Nations and greetings from whales are also encoded.",
    items: [
      { title: "English", detail: "“Hello from the children of planet Earth.” — one of the record's most quoted lines, spoken by a child." },
      { title: "From Sumerian to Wu", detail: "The greeting sequence spans roughly 6,000 years of human language, dead and living." },
      { title: "United Nations message", detail: "A message of peace from the Secretary-General of the United Nations is encoded on the record." },
      { title: "The whales", detail: "The greetings section also includes the “morning song” of a humpback whale — one greeting we did not translate." },
    ],
    source: { url: "https://science.nasa.gov/mission/voyager/golden-record/", label: "NASA — The Golden Record" },
  },
  {
    id: "sounds",
    label: "Sounds",
    headline: "The Sounds of Earth — a 12-minute audio portrait",
    intro:
      "After the greetings comes a 12-minute montage of the sounds of one planet: weather, geology, animals, and people.",
    items: [
      { title: "Weather", detail: "A thunderstorm: rain, lightning, and wind — the first thing a finder would hear." },
      { title: "Earth and sea", detail: "Ocean surf, wind against rock, and the sound of fire." },
      { title: "Animals", detail: "Crickets and frogs, birds, wild dogs, elephants, chimpanzees — and the humpback whale." },
      { title: "People", detail: "Footsteps, a heartbeat, laughter, a mother and child, a kiss, and human speech." },
    ],
    source: { url: "https://science.nasa.gov/mission/voyager/golden-record/", label: "NASA — The Golden Record" },
  },
  {
    id: "images",
    label: "Images",
    headline: "115 images, encoded into the grooves",
    intro:
      "The record's final section encodes 115 images as audio signals. A finder playing the record with the right instructions would see pictures appear, one per series of pulses.",
    items: [
      { title: "The solar system", detail: "Diagrams of our Sun and planets, drawn so a finder could locate home." },
      { title: "Life", detail: "The structure of DNA, cell anatomy, and human physiology — the biology of the sender." },
      { title: "Earth", detail: "Landscapes, a snowy forest with a snowflake, a golden eagle, crops, and cities." },
      { title: "Ourselves", detail: "Human anatomy, people at work, and everyday moments — a species showing its ordinary self." },
    ],
    source: { url: "https://science.nasa.gov/mission/voyager/golden-record/", label: "NASA — The Golden Record" },
  },
  {
    id: "music",
    label: "Music",
    headline: "27 pieces of music, 90 minutes",
    intro:
      "The record carries a 90-minute selection of 27 musical pieces from cultures around the world — Eastern and Western, classical and folk.",
    items: [
      { title: "Bach — Brandenburg Concerto No. 2, 1st movement", detail: "One of several Bach works on the record; his music spans cultures and centuries of Earth." },
      { title: "Beethoven — Symphony No. 5, 1st movement", detail: "The record's Western classical anchors alongside the Cavatina from String Quartet No. 13." },
      { title: "Chuck Berry — “Johnny B. Goode”", detail: "Rock and roll, chosen to represent popular music of the era." },
      { title: "“Dark Was the Night, Cold Was the Ground”", detail: "Blind Willie Johnson's wordless hymn — music about a night, placed on a record for the dark." },
      { title: "Music of the world", detail: "Peruvian panpipes, a Navajo chant, a Javanese gamelan, Azerbaijani mugham, a Bulgarian folk voice, and more." },
    ],
    source: { url: "https://science.nasa.gov/mission/voyager/golden-record/", label: "NASA — The Golden Record" },
  },
  {
    id: "instructions",
    label: "How to play it",
    headline: "The instructions on the cover",
    intro:
      "The gold-anodized aluminum record cover is itself an instruction manual, drawn in diagrams a stranger might decode.",
    items: [
      { title: "Speed and stylus", detail: "Diagrams on the cover show how to play the record at 16⅔ revolutions per minute and where to place the cartridge and needle." },
      { title: "The hydrogen atom", detail: "A diagram of the hydrogen atom's hyperfine transition defines the record's basic unit of time." },
      { title: "The pulsar map", detail: "Lines radiating from a point plot the Sun's position relative to pulsars — an address for the sender." },
      { title: "The image encoding", detail: "Further diagrams explain how the images are encoded in the audio and should be reconstructed." },
    ],
    source: { url: "https://science.nasa.gov/mission/voyager/golden-record/cover-of-the-golden-record/", label: "NASA — Cover of the Golden Record" },
  },
];

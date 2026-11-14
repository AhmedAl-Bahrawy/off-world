// The four story chapters. `fact` blocks are VERIFIED NASA HISTORY with sources.
// `logs` blocks are FICTIONAL STORY LOGS — the UI must label them as fiction.
// The organoid-intelligence background lore is internal and is NOT included here on purpose.

export const chapters = [
  {
    id: "contact",
    label: "Contact",
    numeral: "I",
    tagline: "Voyager 1 and the Golden Record",
    color: "#a7c7e7",
    teaser: "A golden mirror, bolted to the hull of the farthest human-made object, still carrying the sound of a hello.",
    intro:
      "The first evidence humanity ever left was not an accident. In 1977 two spacecraft were given a record — 55 greetings, 27 pieces of music, the sounds of a world, 115 images — and pointed out of the solar system. Whoever sent them meant to be met.",
    facts: [
      {
        text: "Voyager 1 launched on 5 September 1977 and is now the farthest human-made object, transmitting from interstellar space.",
        url: "https://science.nasa.gov/mission/voyager/",
        label: "NASA — Voyager",
      },
      {
        text: "Each Voyager carries a 12-inch gold-plated copper record with greetings, music, sounds of Earth, and 115 encoded images.",
        url: "https://science.nasa.gov/mission/voyager/golden-record/",
        label: "NASA — Golden Record",
      },
      {
        text: "Voyager 1 entered interstellar space in August 2012.",
        url: "https://science.nasa.gov/mission/voyager/where-are-they-now/",
        label: "NASA — Voyager status",
      },
    ],
    logs: [
      {
        author: "Archivist VELL",
        time: "Cycle 4, log 001",
        text: "We located the signal's source: not a station, not a city. A single spacecraft, coasting between the stars with a golden mirror bolted to its flank. It does not answer us. It was never meant to answer. It was meant to be found.",
      },
      {
        author: "Commander KELL",
        time: "Cycle 4, log 004",
        text: "The record is a greeting wrapped in a question. They told us what a kiss sounds like, what a heartbeat sounds like, and then they pointed at the sky and said: we are here. Where did the pointing stop?",
      },
    ],
  },
  {
    id: "search",
    label: "The Search",
    numeral: "II",
    tagline: "Abandoned Mars hardware",
    color: "#d8b58b",
    teaser: "A biology laboratory, three rovers, a listener — all left standing in the dust of a world that may once have held water.",
    intro:
      "Mars is where humanity kept its oldest machines. Landers that asked the soil about life, rovers that drove until their wheels stopped, a seismometer that listened until the dust covered its wings. Every one of them is silent now — and every one of them was left in place.",
    facts: [
      {
        text: "Viking 1 landed on Mars on 20 July 1976 carrying a biology laboratory; its last transmission was received in November 1982.",
        url: "https://science.nasa.gov/mission/viking/",
        label: "NASA — Viking",
      },
      {
        text: "The Mars rovers Spirit and Opportunity found mineral evidence that liquid water once shaped the surface; Opportunity drove over 45 km before being silenced by a dust storm in June 2018.",
        url: "https://science.nasa.gov/mission/mars-rover-opportunity/",
        label: "NASA — Opportunity",
      },
      {
        text: "InSight recorded more than 1,300 marsquakes before NASA retired the lander in December 2022.",
        url: "https://science.nasa.gov/mission/insight/",
        label: "NASA — InSight",
      },
    ],
    logs: [
      {
        author: "Geologist TAO",
        time: "Cycle 5, log 012",
        text: "We stand inside the machines' patience. Viking asked its question for six years. Opportunity's last call went out and nobody answered — their own machines died the same way we found them.",
      },
      {
        author: "Archivist VELL",
        time: "Cycle 5, log 015",
        text: "Six landing sites. Every one abandoned, none destroyed. A species that cleans up after itself would have done it differently. They left in a hurry, or they left on purpose.",
      },
    ],
  },
  {
    id: "footsteps",
    label: "Footsteps",
    numeral: "III",
    tagline: "Apollo landing sites",
    color: "#b9b9c9",
    teaser: "Descent stages, mirrors, rovers, footprints — an entire neighborhood abandoned between 1969 and 1972.",
    intro:
      "Between 1969 and 1972, twelve humans walked on the Moon and left their equipment behind: descent stages, science packages, three electric rovers, and a lattice of footprints untouched by wind. They took 382 kg of the Moon home and left themselves behind.",
    facts: [
      {
        text: "Apollo 11 landed at Tranquility Base on 20 July 1969; its descent stage and surface experiments remain in place.",
        url: "https://www.nasa.gov/mission/apollo-11/",
        label: "NASA — Apollo 11",
      },
      {
        text: "Apollo crews left laser-ranging retroreflectors on the lunar surface that are still used in experiments from Earth today.",
        url: "https://www.nasa.gov/history/alsj/",
        label: "NASA — Apollo Lunar Surface Journal",
      },
      {
        text: "The three Lunar Roving Vehicles of Apollo 15, 16 and 17 were parked at their landing sites and left there at mission end.",
        url: "https://www.nasa.gov/mission/apollo-15/",
        label: "NASA — Apollo 15",
      },
    ],
    logs: [
      {
        author: "Engineer SABLE",
        time: "Cycle 6, log 002",
        text: "Nothing has fallen over. No wind, no rain, no decay. We are walking through the day they left, preserved whole. You can pace out the errands of two people who knew they would never return.",
      },
      {
        author: "Commander KELL",
        time: "Cycle 6, log 009",
        text: "The rovers were parked facing away, positioned for their own liftoff photography. Practical. Considerate. As if the absence itself had been planned. But planning is not farewell.",
      },
    ],
  },
  {
    id: "arrival",
    label: "Arrival",
    numeral: "IV",
    tagline: "Earth, alive and unanswering",
    color: "#9fd8cf",
    teaser: "The planet is green and blue and full of movement. Nobody is calling back. The sequence ends before landing.",
    intro:
      "Earth appears alive. Weather moves. Lights flicker across the night side in patterns too regular to be wild. Vegetation breathes in seasonal pulses. And every channel the expedition has been given — the record, the rovers, the mirrors on the Moon — leads to a planet that does not answer.",
    facts: [
      {
        text: "In 1990 Voyager 1 photographed Earth from about 6.4 billion kilometers away — the Pale Blue Dot.",
        url: "https://science.nasa.gov/mission/voyager/voyager-1/pale-blue-dot/",
        label: "NASA — Pale Blue Dot",
      },
      {
        text: "In 1968 the Apollo 8 crew photographed the first Earthrise seen by humans, from lunar orbit.",
        url: "https://www.nasa.gov/humans-in-space/apollo-missions/",
        label: "NASA — Apollo",
      },
    ],
    logs: [
      {
        author: "Observer VESS",
        time: "Cycle 7, log 001",
        text: "The planet is healthy. That is the finding. It is not a ruin. Whatever stopped the messages did not stop the world. We are still assembling what that means.",
      },
      {
        author: "Commander KELL",
        time: "Cycle 7, log 003",
        text: "We have come to the edge of the record. Down there are lights in the dark side, cities' worth of light, and no voice rising from them. We descend tomorrow. What happened here remains — as of this log — unanswered.",
      },
    ],
  },
];

export function getChapter(id) {
  return chapters.find((c) => c.id === id);
}

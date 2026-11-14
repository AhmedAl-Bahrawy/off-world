export type Mission = {
  title: string;
  zone: "viking" | "pathfinder" | "ingenuity";
  subtitle: string;
  briefing: string;
  target: string;
  sprite: string;
  quiz: string;
  answers: string[];
  correct: number;
  fact: string;
};

export const MISSIONS: Mission[] = [
  {
    title: "CHRYSE PLANITIA",
    zone: "viking",
    subtitle: "Wake the sleeper",
    briefing:
      "A three-legged machine has been on shift since 1976. Cross the red plain and wake Viking 1.",
    target: "Viking 1",
    sprite: "vigil",
    quiz: "When did Viking 1 land on Mars?",
    answers: ["20 July 1976", "4 July 1997", "19 April 2021"],
    correct: 0,
    fact: "Viking 1 touched down on 20 July 1976 — the first fully successful Mars landing.",
  },
  {
    title: "THE SAMPLE ARM",
    zone: "viking",
    subtitle: "Dig where the diggers dug",
    briefing:
      "Viking scooped Martian soil and started a 50-year argument. Find the buried memories.",
    target: "Viking biology lab",
    sprite: "vigil",
    quiz: "What was Viking’s life-test result?",
    answers: [
      "Confirmed life",
      "Inconclusive — the famous maybe",
      "No experiments were run",
    ],
    correct: 1,
    fact: "The biology tests were weakly positive, while the organic chemistry test was negative. The result remains inconclusive.",
  },
  {
    title: "THE LONG WINTER",
    zone: "viking",
    subtitle: "Survive the dust",
    briefing:
      "A dust storm rolls in. Viking ran on plutonium; you run on stubborn.",
    target: "Viking radio",
    sprite: "vigil",
    quiz: "What kept Viking running through the dark?",
    answers: [
      "Solar panels only",
      "SNAP-19 nuclear batteries",
      "A wind turbine",
    ],
    correct: 1,
    fact: "Two SNAP-19 radioisotope thermoelectric generators powered Viking, including through dust and darkness.",
  },
  {
    title: "FIFTEEN BOUNCES",
    zone: "pathfinder",
    subtitle: "Learn the airbag bounce",
    briefing:
      "In 1997, Pathfinder hit Mars and bounced fifteen times. Learn the double-jump protocol.",
    target: "Pathfinder lander",
    sprite: "siegfried",
    quiz: "How did Pathfinder land?",
    answers: ["Giant airbags", "A runway", "A powered hover landing"],
    correct: 0,
    fact: "Pathfinder used a parachute and airbags, bouncing more than fifteen times before coming to rest.",
  },
  {
    title: "THE ROVER STANDS UP",
    zone: "pathfinder",
    subtitle: "Walk with Sojourner",
    briefing:
      "Sojourner weighed just 10.6 kg and rolled down a ramp alone. Catch up with the little rover.",
    target: "Sojourner rover",
    sprite: "sojourner",
    quiz: "How tall was Sojourner?",
    answers: ["30 centimetres", "1.8 metres", "3 centimetres"],
    correct: 0,
    fact: "Sojourner was about 30 cm tall, weighed 10.6 kg, and became the first rover to operate on another planet.",
  },
  {
    title: "WARM AND WET",
    zone: "pathfinder",
    subtitle: "Find the flood evidence",
    briefing:
      "Rounded pebbles carry receipts of an ancient flood. Gather the memories and reach Ares Vallis.",
    target: "Pathfinder archive",
    sprite: "siegfried",
    quiz: "What do Pathfinder’s rounded pebbles suggest?",
    answers: [
      "Ancient flowing water",
      "Recent volcanic glass",
      "A modern ice storm",
    ],
    correct: 0,
    fact: "Rounded pebbles and other observations were evidence of ancient flowing water at Ares Vallis.",
  },
  {
    title: "THE WRIGHT BROTHERS MOMENT",
    zone: "ingenuity",
    subtitle: "Take the controls",
    briefing:
      "Fly where the air is less than one percent as dense as Earth’s. Hold H to use Ingenuity’s rotorcraft.",
    target: "Ingenuity helicopter",
    sprite: "coper_idle",
    quiz: "When did Ingenuity make its first powered flight?",
    answers: ["19 April 2021", "20 July 1976", "18 January 2024"],
    correct: 0,
    fact: "Ingenuity made the first powered, controlled flight on another planet on 19 April 2021.",
  },
  {
    title: "SEVENTY-TWO FLIGHTS",
    zone: "ingenuity",
    subtitle: "Fly the long way round",
    briefing:
      "Five flights was the plan. Ingenuity made 72. Cross the windy ridge and find the flight log.",
    target: "Jezero flight log",
    sprite: "gusto",
    quiz: "How many flights did Ingenuity actually make?",
    answers: ["5", "27", "72"],
    correct: 2,
    fact: "Ingenuity was designed for five test flights and ultimately completed 72.",
  },
  {
    title: "THE LAST FLIGHT",
    zone: "ingenuity",
    subtitle: "Land it like it matters",
    briefing:
      "One broken rotor blade ended the real mission. Make the final landing and wake the archive.",
    target: "Mars archive",
    sprite: "coper_idle",
    quiz: "What ended Ingenuity’s mission?",
    answers: [
      "A broken rotor blade",
      "It ran out of fuel",
      "It flew back to Earth",
    ],
    correct: 0,
    fact: "Ingenuity’s 72nd and final flight was on 18 January 2024; a rotor blade was damaged.",
  },
];

export type MissionZone = "viking" | "pathfinder" | "ingenuity";

export type AnchorKind = "artifact" | "component" | "evidence" | "archive";

export type MissionAnchor = {
  id: string;
  kind: AnchorKind;
  /** Position along the level, as a fraction of its length. */
  at: number;
  /** Vertical offset from the ground line, in world pixels. */
  dy?: number;
  /** Shown before the machine has been identified. */
  unknownLabel?: string;
  /** Shown once the machine has been identified. */
  label: string;
  /** The contextual action verb shown on the interaction prompt. */
  verb: string;
  artifactId: string;
  componentId?: string;
  evidenceId?: string;
  /** Only reachable while flying — an aerial navigation beat. */
  air?: boolean;
};

export type KnowledgeCheck = {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
};

export type Mission = {
  title: string;
  zone: MissionZone;
  subtitle: string;
  briefing: string;
  target: string;
  sprite: string;
  /** The artifact this mission belongs to. */
  artifactId: string;
  /** What this mission contributes to the artifact's archive. */
  purpose: string;
  /** World placements: the machine, its parts, the evidence and the terminal. */
  anchors: MissionAnchor[];
  check: KnowledgeCheck;
  /** Last mission of an artifact chapter — completing it archives the artifact. */
  archives: boolean;
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
    artifactId: "viking-1",
    purpose:
      "Find the machine in the dust, identify it, and learn what it was sent to look for.",
    anchors: [
      {
        id: "m0-artifact",
        kind: "artifact",
        at: 0.27,
        label: "VIKING 1",
        unknownLabel: "UNKNOWN HUMAN MACHINE",
        verb: "INSPECT",
        artifactId: "viking-1",
      },
      {
        id: "m0-camera",
        kind: "component",
        at: 0.35,
        label: "VIKING 1 — SCAN CAMERAS",
        verb: "INSPECT",
        artifactId: "viking-1",
        componentId: "viking-camera",
      },
      {
        id: "m0-weather",
        kind: "component",
        at: 0.42,
        label: "VIKING 1 — METEOROLOGY PACKAGE",
        verb: "INSPECT",
        artifactId: "viking-1",
        componentId: "viking-weather",
      },
      {
        id: "m0-ev-landing",
        kind: "evidence",
        at: 0.13,
        dy: -34,
        label: "LANDING TRACE",
        verb: "RECOVER RECORD",
        artifactId: "viking-1",
        evidenceId: "viking-ev-landing",
      },
      {
        id: "m0-ev-weather",
        kind: "evidence",
        at: 0.55,
        dy: -30,
        label: "WEATHER READING",
        verb: "RECOVER RECORD",
        artifactId: "viking-1",
        evidenceId: "viking-ev-weather",
      },
      {
        id: "m0-archive",
        kind: "archive",
        at: 0.87,
        label: "RECOVERED RECORDS",
        verb: "OPEN ARCHIVE",
        artifactId: "viking-1",
      },
    ],
    check: {
      question:
        "Viking 1 was sent to Mars with an orbiter and a lander. What was the machine actually built to find out?",
      answers: [
        "What the Martian weather was doing that week",
        "Whether Mars was cold, dry and geologically dead",
        "Whether anything living had ever called Mars home",
      ],
      correct: 2,
      explanation:
        "Viking 1 was the first fully successful mission to land on Mars and the first to search for evidence of life. Its biological experiments found unexpected chemical activity in the soil — but no clear evidence of living organisms. The question stayed open.",
    },
    archives: false,
  },
  {
    title: "THE SAMPLE ARM",
    zone: "viking",
    subtitle: "Dig where the diggers dug",
    briefing:
      "Viking scooped Martian soil and started a 50-year argument. Find the buried memories.",
    target: "Viking biology lab",
    sprite: "vigil",
    artifactId: "viking-1",
    purpose:
      "Work the sampler arm, recover the biology result, and understand the life-search story.",
    anchors: [
      {
        id: "m1-artifact",
        kind: "artifact",
        at: 0.24,
        label: "VIKING 1",
        unknownLabel: "UNKNOWN HUMAN MACHINE",
        verb: "INSPECT",
        artifactId: "viking-1",
      },
      {
        id: "m1-arm",
        kind: "component",
        at: 0.33,
        label: "VIKING 1 — SAMPLER ARM",
        verb: "INSPECT",
        artifactId: "viking-1",
        componentId: "viking-arm",
      },
      {
        id: "m1-lab",
        kind: "component",
        at: 0.44,
        label: "VIKING 1 — BIOLOGY LABORATORY",
        verb: "INSPECT",
        artifactId: "viking-1",
        componentId: "viking-lab",
      },
      {
        id: "m1-ev-soil",
        kind: "evidence",
        at: 0.14,
        dy: -34,
        label: "SAMPLE SITE",
        verb: "RECOVER RECORD",
        artifactId: "viking-1",
        evidenceId: "viking-ev-soil",
      },
      {
        id: "m1-ev-biology",
        kind: "evidence",
        at: 0.57,
        dy: -30,
        label: "LAB RESULT",
        verb: "RECOVER RECORD",
        artifactId: "viking-1",
        evidenceId: "viking-ev-biology",
      },
      {
        id: "m1-archive",
        kind: "archive",
        at: 0.87,
        label: "RECOVERED RECORDS",
        verb: "OPEN ARCHIVE",
        artifactId: "viking-1",
      },
    ],
    check: {
      question:
        "Viking needed to study Martian soil without moving the whole spacecraft. Which part of the machine made that possible?",
      answers: [
        "The two 360-degree scan cameras",
        "The robotic sampling arm",
        "The SNAP-19 generators",
      ],
      correct: 1,
      explanation:
        "The sampler arm reached out with a collector head, temperature sensor and magnet, scooped Martian soil and delivered it to the instruments inside the lander. Without it, the lander could only look at the ground.",
    },
    archives: false,
  },
  {
    title: "THE LONG WINTER",
    zone: "viking",
    subtitle: "Survive the dust",
    briefing:
      "A dust storm rolls in. Viking ran on plutonium; you run on stubborn.",
    target: "Viking power",
    sprite: "vigil",
    artifactId: "viking-1",
    purpose:
      "Find the power system, understand why it mattered, and complete the Viking archive.",
    anchors: [
      {
        id: "m2-artifact",
        kind: "artifact",
        at: 0.22,
        label: "VIKING 1",
        unknownLabel: "UNKNOWN HUMAN MACHINE",
        verb: "INSPECT",
        artifactId: "viking-1",
      },
      {
        id: "m2-power",
        kind: "component",
        at: 0.36,
        label: "VIKING 1 — SNAP-19 GENERATORS",
        verb: "INSPECT",
        artifactId: "viking-1",
        componentId: "viking-power",
      },
      {
        id: "m2-ev-power",
        kind: "evidence",
        at: 0.15,
        dy: -34,
        label: "WARM SOURCE",
        verb: "RECOVER RECORD",
        artifactId: "viking-1",
        evidenceId: "viking-ev-power",
      },
      {
        id: "m2-ev-timeline",
        kind: "evidence",
        at: 0.56,
        dy: -30,
        label: "MISSION TIMELINE",
        verb: "RECOVER RECORD",
        artifactId: "viking-1",
        evidenceId: "viking-ev-timeline",
      },
      {
        id: "m2-archive",
        kind: "archive",
        at: 0.85,
        label: "RECOVERED RECORDS",
        verb: "OPEN ARCHIVE",
        artifactId: "viking-1",
      },
    ],
    check: {
      question:
        "Sunlight on Mars is half as strong as on Earth and disappears completely at night. Why did Viking carry nuclear generators instead of solar panels?",
      answers: [
        "Solar panels cannot survive the cold of the Martian night",
        "Radioisotope generators made electricity and heat that sunlight could not guarantee",
        "The lander needed more power than the panels could ever produce",
      ],
      correct: 1,
      explanation:
        "Two SNAP-19 radioisotope thermoelectric generators converted the heat of decaying plutonium-238 into about 70 watts of electricity — plus warmth. That power lasted through dust storms and long nights, and let Viking work for more than six years on a 90-day plan.",
    },
    archives: true,
  },
  {
    title: "FIFTEEN BOUNCES",
    zone: "pathfinder",
    subtitle: "Learn the airbag bounce",
    briefing:
      "In 1997, Pathfinder hit Mars and bounced fifteen times. Learn the double-jump protocol.",
    target: "Pathfinder lander",
    sprite: "siegfried",
    artifactId: "pathfinder",
    purpose:
      "Experience the airbag landing idea, understand why Pathfinder bounced, and unlock the landing evidence.",
    anchors: [
      {
        id: "m3-artifact",
        kind: "artifact",
        at: 0.26,
        label: "PATHFINDER",
        unknownLabel: "UNKNOWN HUMAN MACHINE",
        verb: "INSPECT",
        artifactId: "pathfinder",
      },
      {
        id: "m3-entry",
        kind: "component",
        at: 0.34,
        label: "PATHFINDER — PARACHUTE + ENTRY",
        verb: "INSPECT",
        artifactId: "pathfinder",
        componentId: "pathfinder-entry",
      },
      {
        id: "m3-airbags",
        kind: "component",
        at: 0.43,
        label: "PATHFINDER — AIRBAGS",
        verb: "INSPECT",
        artifactId: "pathfinder",
        componentId: "pathfinder-airbags",
      },
      {
        id: "m3-ev-airbag",
        kind: "evidence",
        at: 0.13,
        dy: -34,
        label: "LANDING TRACE",
        verb: "RECOVER RECORD",
        artifactId: "pathfinder",
        evidenceId: "pathfinder-ev-airbag",
      },
      {
        id: "m3-ev-terrain",
        kind: "evidence",
        at: 0.56,
        dy: -30,
        label: "ARES VALLIS TERRAIN",
        verb: "RECOVER RECORD",
        artifactId: "pathfinder",
        evidenceId: "pathfinder-ev-terrain",
      },
      {
        id: "m3-archive",
        kind: "archive",
        at: 0.87,
        label: "RECOVERED RECORDS",
        verb: "OPEN ARCHIVE",
        artifactId: "pathfinder",
      },
    ],
    check: {
      question:
        "Pathfinder had no engines to slow its descent. How did it survive landing on Mars at all?",
      answers: [
        "A parachute alone brought it down gently enough",
        "Airbags absorbed the impact and let the lander bounce to a stop",
        "It landed on a prepared runway",
      ],
      correct: 1,
      explanation:
        "Airbags inflated around the lander seconds before impact. Pathfinder bounced about 15 metres high, bounced 15 times, rolled for another minute, and came to rest roughly 1 km from where it first hit — proof that a completely new way to land on Mars worked.",
    },
    archives: false,
  },
  {
    title: "THE ROVER STANDS UP",
    zone: "pathfinder",
    subtitle: "Walk with Sojourner",
    briefing:
      "Sojourner weighed just 10.6 kg and rolled down a ramp alone. Catch up with the little rover.",
    target: "Sojourner rover",
    sprite: "sojourner",
    artifactId: "pathfinder",
    purpose:
      "Activate the ramp, release Sojourner, and understand how the lander and rover work together.",
    anchors: [
      {
        id: "m4-artifact",
        kind: "artifact",
        at: 0.23,
        label: "PATHFINDER",
        unknownLabel: "UNKNOWN HUMAN MACHINE",
        verb: "INSPECT",
        artifactId: "pathfinder",
      },
      {
        id: "m4-ramp",
        kind: "component",
        at: 0.32,
        label: "PATHFINDER — DEPLOYMENT RAMP",
        verb: "INSPECT",
        artifactId: "pathfinder",
        componentId: "pathfinder-ramp",
      },
      {
        id: "m4-sojourner",
        kind: "component",
        at: 0.45,
        label: "PATHFINDER — SOJOURNER",
        verb: "INSPECT",
        artifactId: "pathfinder",
        componentId: "pathfinder-sojourner",
      },
      {
        id: "m4-ev-deploy",
        kind: "evidence",
        at: 0.14,
        dy: -34,
        label: "ROVER TRACK",
        verb: "RECOVER RECORD",
        artifactId: "pathfinder",
        evidenceId: "pathfinder-ev-deploy",
      },
      {
        id: "m4-ev-rocks",
        kind: "evidence",
        at: 0.58,
        dy: -30,
        label: "ROCK + SOIL ANALYSIS",
        verb: "RECOVER RECORD",
        artifactId: "pathfinder",
        evidenceId: "pathfinder-ev-rocks",
      },
      {
        id: "m4-archive",
        kind: "archive",
        at: 0.87,
        label: "RECOVERED RECORDS",
        verb: "OPEN ARCHIVE",
        artifactId: "pathfinder",
      },
    ],
    check: {
      question:
        "Pathfinder and Sojourner were one mission but two very different machines. Which statement is correct?",
      answers: [
        "Pathfinder was the rover and Sojourner was the lander that carried it",
        "Pathfinder was the lander platform that delivered Sojourner, the rover",
        "They were two separate landers that landed side by side",
      ],
      correct: 1,
      explanation:
        "Pathfinder was the stationary lander: cameras, a weather station, solar panels and the radio link to Earth. Sojourner was the 10.6 kg six-wheeled rover it carried, which rolled down the ramp on 6 July 1997 and became the first rover to operate on another planet.",
    },
    archives: false,
  },
  {
    title: "WARM AND WET",
    zone: "pathfinder",
    subtitle: "Find the flood evidence",
    briefing:
      "Rounded pebbles carry receipts of an ancient flood. Gather the memories and reach Ares Vallis.",
    target: "Pathfinder archive",
    sprite: "siegfried",
    artifactId: "pathfinder",
    purpose:
      "Read the evidence from Ares Vallis, understand how rocks reveal ancient water, and complete the Pathfinder archive.",
    anchors: [
      {
        id: "m5-artifact",
        kind: "artifact",
        at: 0.24,
        label: "PATHFINDER",
        unknownLabel: "UNKNOWN HUMAN MACHINE",
        verb: "INSPECT",
        artifactId: "pathfinder",
      },
      {
        id: "m5-lander",
        kind: "component",
        at: 0.34,
        label: "PATHFINDER — THE LANDER",
        verb: "INSPECT",
        artifactId: "pathfinder",
        componentId: "pathfinder-lander",
      },
      {
        id: "m5-instruments",
        kind: "component",
        at: 0.45,
        label: "PATHFINDER — SCIENCE INSTRUMENTS",
        verb: "INSPECT",
        artifactId: "pathfinder",
        componentId: "pathfinder-instruments",
      },
      {
        id: "m5-ev-weather",
        kind: "evidence",
        at: 0.14,
        dy: -34,
        label: "WEATHER OBSERVATION",
        verb: "RECOVER RECORD",
        artifactId: "pathfinder",
        evidenceId: "pathfinder-ev-weather",
      },
      {
        id: "m5-ev-data",
        kind: "evidence",
        at: 0.57,
        dy: -30,
        label: "MISSION DATA",
        verb: "RECOVER RECORD",
        artifactId: "pathfinder",
        evidenceId: "pathfinder-ev-data",
      },
      {
        id: "m5-archive",
        kind: "archive",
        at: 0.85,
        label: "RECOVERED RECORDS",
        verb: "OPEN ARCHIVE",
        artifactId: "pathfinder",
      },
    ],
    check: {
      question:
        "Pathfinder found rounded pebbles at Ares Vallis. What did that tell us about Mars?",
      answers: [
        "That liquid water once flowed on the surface of Mars",
        "That the site was a recent volcanic field",
        "That the rocks were shaped by Martian wind alone",
      ],
      correct: 0,
      explanation:
        "Rounded pebbles and conglomerate rocks at Ares Vallis were evidence consistent with ancient flowing water — a wetter Martian past written into the rock. Pathfinder's cameras and instruments turned a landing site into a geological argument.",
    },
    archives: true,
  },
  {
    title: "THE WRIGHT BROTHERS MOMENT",
    zone: "ingenuity",
    subtitle: "Take the controls",
    briefing:
      "Fly where the air is less than one percent as dense as Earth's. Hold H to use Ingenuity's rotorcraft.",
    target: "Ingenuity helicopter",
    sprite: "coper_idle",
    artifactId: "ingenuity",
    purpose:
      "Explain why flight is difficult on Mars, activate flight mode, and demonstrate aerial exploration.",
    anchors: [
      {
        id: "m6-artifact",
        kind: "artifact",
        at: 0.26,
        label: "INGENUITY",
        unknownLabel: "UNKNOWN HUMAN MACHINE",
        verb: "INSPECT",
        artifactId: "ingenuity",
      },
      {
        id: "m6-rotor",
        kind: "component",
        at: 0.35,
        label: "INGENUITY — ROTOR BLADES",
        verb: "INSPECT",
        artifactId: "ingenuity",
        componentId: "ingenuity-rotor",
      },
      {
        id: "m6-battery",
        kind: "component",
        at: 0.44,
        label: "INGENUITY — BATTERY",
        verb: "INSPECT",
        artifactId: "ingenuity",
        componentId: "ingenuity-battery",
      },
      {
        id: "m6-ev-first",
        kind: "evidence",
        at: 0.13,
        dy: -34,
        label: "FLIGHT RECORD",
        verb: "RECOVER RECORD",
        artifactId: "ingenuity",
        evidenceId: "ingenuity-ev-first",
      },
      {
        id: "m6-ev-air",
        kind: "evidence",
        at: 0.56,
        dy: -30,
        label: "THIN ATMOSPHERE",
        verb: "RECOVER RECORD",
        artifactId: "ingenuity",
        evidenceId: "ingenuity-ev-air",
      },
      {
        id: "m6-archive",
        kind: "archive",
        at: 0.87,
        label: "RECOVERED RECORDS",
        verb: "OPEN ARCHIVE",
        artifactId: "ingenuity",
      },
    ],
    check: {
      question:
        "An Earth helicopter flies by pushing air down with its blades. Why is that so much harder on Mars?",
      answers: [
        "The Martian wind is usually too strong for a light machine",
        "Mars' atmosphere is less than one percent as dense as Earth's, so the blades have far less air to push against",
        "Mars' gravity is weaker, so the blades cannot lift the machine",
      ],
      correct: 1,
      explanation:
        "With almost no air to push, Ingenuity needed large, fast-spinning carbon-fibre rotors on a very light frame. The design answered a single question: can a powered, controlled aircraft fly on another planet? It did, on 19 April 2021.",
    },
    archives: false,
  },
  {
    title: "SEVENTY-TWO FLIGHTS",
    zone: "ingenuity",
    subtitle: "Fly the long way round",
    briefing:
      "Five flights was the plan. Ingenuity made 72. Cross the windy ridge and find the flight log.",
    target: "Jezero flight log",
    sprite: "gusto",
    artifactId: "ingenuity",
    purpose:
      "Show how the mission grew past its original plan, introduce aerial scouting, and recover the flight log.",
    anchors: [
      {
        id: "m7-artifact",
        kind: "artifact",
        at: 0.23,
        label: "INGENUITY",
        unknownLabel: "UNKNOWN HUMAN MACHINE",
        verb: "INSPECT",
        artifactId: "ingenuity",
      },
      {
        id: "m7-solar",
        kind: "component",
        at: 0.32,
        label: "INGENUITY — SOLAR PANEL",
        verb: "INSPECT",
        artifactId: "ingenuity",
        componentId: "ingenuity-solar",
      },
      {
        id: "m7-camera",
        kind: "component",
        at: 0.44,
        label: "INGENUITY — NAVIGATION CAMERA",
        verb: "INSPECT",
        artifactId: "ingenuity",
        componentId: "ingenuity-camera",
      },
      {
        id: "m7-ev-camera",
        kind: "evidence",
        at: 0.13,
        dy: -34,
        label: "NAVIGATION RECORD",
        verb: "RECOVER RECORD",
        artifactId: "ingenuity",
        evidenceId: "ingenuity-ev-camera",
        air: true,
      },
      {
        id: "m7-ev-scouting",
        kind: "evidence",
        at: 0.57,
        dy: -30,
        label: "SCOUTING LOG",
        verb: "RECOVER RECORD",
        artifactId: "ingenuity",
        evidenceId: "ingenuity-ev-scouting",
        air: true,
      },
      {
        id: "m7-archive",
        kind: "archive",
        at: 0.87,
        label: "RECOVERED RECORDS",
        verb: "OPEN ARCHIVE",
        artifactId: "ingenuity",
      },
    ],
    check: {
      question:
        "There is no GPS on Mars. So how did Ingenuity know where it was while flying?",
      answers: [
        "By tracking features on the Martian surface with its navigation camera",
        "By receiving a position fix from the Perseverance rover",
        "By following a radio beacon left by the lander",
      ],
      correct: 0,
      explanation:
        "Ingenuity flew by vision. Its downward-looking navigation camera compared the ground below it with what it expected to see, and that is how it knew where it was — and why a featureless patch of terrain could become a navigation problem.",
    },
    archives: false,
  },
  {
    title: "THE LAST FLIGHT",
    zone: "ingenuity",
    subtitle: "Land it like it matters",
    briefing:
      "A navigation problem over featureless ground ended the real mission. Reach the final airfield and wake the archive.",
    target: "Mars archive",
    sprite: "coper_idle",
    artifactId: "ingenuity",
    purpose:
      "Reconstruct the final flight, teach the navigation challenge, reveal the damaged rotor, and preserve the machine's legacy.",
    anchors: [
      {
        id: "m8-artifact",
        kind: "artifact",
        at: 0.24,
        label: "INGENUITY",
        unknownLabel: "UNKNOWN HUMAN MACHINE",
        verb: "INSPECT",
        artifactId: "ingenuity",
      },
      {
        id: "m8-gear",
        kind: "component",
        at: 0.33,
        label: "INGENUITY — LANDING GEAR",
        verb: "INSPECT",
        artifactId: "ingenuity",
        componentId: "ingenuity-gear",
      },
      {
        id: "m8-control",
        kind: "component",
        at: 0.44,
        label: "INGENUITY — FLIGHT CONTROL",
        verb: "INSPECT",
        artifactId: "ingenuity",
        componentId: "ingenuity-control",
      },
      {
        id: "m8-ev-72",
        kind: "evidence",
        at: 0.13,
        dy: -34,
        label: "FLIGHT LOG",
        verb: "RECOVER RECORD",
        artifactId: "ingenuity",
        evidenceId: "ingenuity-ev-72",
      },
      {
        id: "m8-ev-final",
        kind: "evidence",
        at: 0.56,
        dy: -30,
        label: "FINAL AIRFIELD",
        verb: "RECOVER RECORD",
        artifactId: "ingenuity",
        evidenceId: "ingenuity-ev-final",
      },
      {
        id: "m8-archive",
        kind: "archive",
        at: 0.85,
        label: "RECOVERED RECORDS",
        verb: "OPEN ARCHIVE",
        artifactId: "ingenuity",
      },
    ],
    check: {
      question:
        "Ingenuity's final flight was a short hop to find out where it had landed. How did that flight end?",
      answers: [
        "It ran out of battery in mid-air",
        "It was destroyed when it struck the ground at speed",
        "A navigation problem led to a hard landing that damaged a rotor blade",
      ],
      correct: 2,
      explanation:
        "After an emergency landing over featureless terrain, the short flight to relocate the helicopter was lost about a metre above the surface. Imagery afterwards showed a rotor blade damaged on touchdown, and the helicopter never flew again.",
    },
    archives: true,
  },
];

/** Mission index that owns each artifact — the last one archives it. */
export const ARCHIVE_MISSION_BY_ARTIFACT: Record<string, number> = MISSIONS.reduce(
  (acc, mission, index) => {
    if (mission.archives) acc[mission.artifactId] = index;
    return acc;
  },
  {} as Record<string, number>,
);

// Mars archive — the three historical witnesses of the Mars chapter.
//
// Every factual field below is drawn from NASA primary sources (linked in
// `source`). The `records` and `museum` entries are RECONSTRUCTED archive
// surfaces: the interfaces are fictional, the science inside them is not.
// The UI must always frame them as reconstructions, never as real NASA media.

export type ArtifactComponent = {
  id: string;
  name: string;
  shortLabel: string;
  /** Layer 1 — one short discovery sentence. */
  discovery: string;
  /** Layer 2 — two to four short sentences of explanation. */
  description: string;
  /** What it physically did, why it existed, what it let us learn. */
  learningPoint: string;
  /** Visual anchor for the part on the machine silhouette. */
  marker: { x: number; y: number };
  /** Optional playable beat triggered by inspecting this part. */
  action?: "sample" | "deploy" | "flight";
};

export type ArchiveReply = {
  handle: string;
  initials: string;
  date: string;
  body: string;
};

export type ArchiveRecord = {
  id: string;
  type: "twitter" | "habbo" | "field-note";
  title: string;
  handle: string;
  initials: string;
  date: string;
  body: string;
  tags: string[];
  /** Related records — the "replies" strip of the recovered feed. */
  replies?: ArchiveReply[];
  /** Media area variant — procedural reconstruction art, never a fake photo. */
  media?: { variant: string; caption: string; credit: string };
  /** The verified NASA fact this record carries. */
  fact?: string;
  source?: { label: string; url: string };
};

export type EvidenceFragment = {
  id: string;
  title: string;
  artifactId: string;
  /** Layer 1 — the single sentence the fragment answers with. */
  evidence: string;
  /** Layer 2 — the short explanation that follows it. */
  explanation: string;
  source: { label: string; url: string };
};

export type MuseumObject = {
  id: string;
  name: string;
  /** Position inside the archive room, in percent. */
  x: number;
  y: number;
  variant: string;
  /** What the object teaches when inspected. */
  fact: string;
  detail: string;
  source: { label: string; url: string };
};

export type ArtifactStatus =
  | "unknown"
  | "identified"
  | "investigated"
  | "understood"
  | "archived";

export type Artifact = {
  id: string;
  name: string;
  type: string;
  era: string;
  location: string;
  purpose: string;
  legacy: string;
  /** Current on-site status of the hardware. */
  status: string;
  /** The one question the whole artifact is built around. */
  mechanicalQuestion: string;
  components: ArtifactComponent[];
  evidence: EvidenceFragment[];
  records: ArchiveRecord[];
  museum: MuseumObject[];
  keyFacts: string[];
  timeline: { year: string; title: string; text: string }[];
  source: { label: string; url: string };
};

const NASA = {
  viking: "https://science.nasa.gov/mission/viking/",
  vikingSpacecraft:
    "https://science.nasa.gov/mission/viking/spacecraft-and-science/",
  viking50:
    "https://science.nasa.gov/mission/viking/viking-50-years-on-mars/",
  vikingBiology:
    "https://science.nasa.gov/astrobiology/missions/viking-project/",
  pathfinder: "https://nssdc.gsfc.nasa.gov/planetary/mesur.html",
  pathfinderAccel:
    "https://science.nasa.gov/resource/pathfinder-landing-accelerations/",
  pathfinderAirbags:
    "https://science.nasa.gov/resource/airbags-and-sojourner-rover/",
  ingenuityEnd:
    "https://www.nasa.gov/news-release/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/",
  ingenuityFarewell:
    "https://science.nasa.gov/blog/farewell-to-our-flying-friend-and-closing-in-on-the-crater-rim/",
  ingenuityJpl:
    "https://www.jpl.nasa.gov/videos/thanksingenuity-nasas-mars-helicopter-team-says-goodbye/",
  ingenuityRotor:
    "https://science.nasa.gov/resource/ingenuity-spots-the-shadow-of-its-damaged-rotor-blade/",
};

export const ARTIFACTS: Artifact[] = [
  {
    id: "viking-1",
    name: "VIKING 1",
    type: "LANDER + ORBITER",
    era: "1976",
    location: "CHRYSE PLANITIA · 22.3°N 48.0°W",
    purpose:
      "To study Mars from orbit and from the ground, and to search the soil for signs of life.",
    legacy:
      "The first successful Mars landing. It took the first soil sample, ran the first search for life, and kept working for more than six years on a 90-day plan.",
    status:
      "Silent. Viking Lander 1 made its final transmission on 11 November 1982 — the lander and its two generators are still on Chryse Planitia.",
    mechanicalQuestion:
      "How can a machine on Mars search for evidence about the planet and possible life?",
    source: { label: "NASA — Viking", url: NASA.viking },
    components: [
      {
        id: "viking-camera",
        name: "SCAN CAMERAS",
        shortLabel: "CAMERA",
        discovery: "Two cameras stood on one side of the base and turned all the way around.",
        description:
          "Viking carried two 360-degree cylindrical scan cameras. They swept the horizon and built the first panoramas ever returned from the surface of Mars.",
        learningPoint:
          "How it worked: they turned and scanned a strip of ground. Why it mattered: it gave humanity its first ground-level view of another planet.",
        marker: { x: 0.18, y: 0.34 },
      },
      {
        id: "viking-arm",
        name: "SAMPLER ARM",
        shortLabel: "SAMPLE ARM",
        discovery: "This arm reached into Martian soil and brought the sample back inside.",
        description:
          "A robotic arm with a collector head, temperature sensor and magnet reached out from the camera side of the lander. It scooped soil and delivered it to the instruments inside.",
        learningPoint:
          "How it worked: it scooped, lifted, and fed the sample to the lander's laboratory. Why it mattered: the whole spacecraft could study Martian material without ever leaving the ground.",
        marker: { x: 0.42, y: 0.62 },
        action: "sample",
      },
      {
        id: "viking-lab",
        name: "BIOLOGY LABORATORY",
        shortLabel: "BIOLOGY LAB",
        discovery: "The soil went into a sealed lab, and the lab gave back an answer nobody wanted.",
        description:
          "Three biology experiments ran inside an environmentally controlled compartment alongside the gas chromatograph mass spectrometer. They looked for chemical traces of metabolism in the Martian soil.",
        learningPoint:
          "What it enabled: the first search for life on another planet. The result was unexpected chemical activity — and no clear evidence of living organisms.",
        marker: { x: 0.58, y: 0.26 },
      },
      {
        id: "viking-weather",
        name: "METEOROLOGY PACKAGE",
        shortLabel: "WEATHER",
        discovery: "The lander kept a weather log for six years.",
        description:
          "A meteorology package recorded pressure, temperature and wind at the landing site. It produced the first long record of Martian weather from one place.",
        learningPoint:
          "What it enabled: the first continuous climate record from Mars, showing a cold, dry planet with a thin carbon-dioxide atmosphere.",
        marker: { x: 0.74, y: 0.5 },
      },
      {
        id: "viking-power",
        name: "SNAP-19 GENERATORS",
        shortLabel: "POWER",
        discovery: "Two nuclear generators kept the lander awake through the dark.",
        description:
          "Two SNAP-19 radioisotope thermoelectric generators sat under wind screens on opposite sides of the lander base. They turned the heat of decaying plutonium into about 70 watts of electricity.",
        learningPoint:
          "Why it mattered: sunlight on Mars is half as strong as on Earth and disappears at night, and dust can hide the sun for weeks. Nuclear decay does not care about the weather.",
        marker: { x: 0.86, y: 0.22 },
      },
    ],
    evidence: [
      {
        id: "viking-ev-landing",
        title: "FIRST LANDING IMAGE",
        artifactId: "viking-1",
        evidence:
          "Viking 1 landed on 20 July 1976 and sent the first images from the surface of Mars.",
        explanation:
          "The radio signal confirming the landing took 19 minutes to travel 212 million miles to Earth. The mission team was still standing at JPL when it arrived.",
        source: { label: "NASA — Viking: 50 Years on Mars", url: NASA.viking50 },
      },
      {
        id: "viking-ev-soil",
        title: "FIRST SOIL SAMPLE",
        artifactId: "viking-1",
        evidence:
          "Viking 1 performed the first Martian soil sample using its robotic arm.",
        explanation:
          "The sampler delivered Martian material to the instruments inside the lander — the first time a spacecraft on another world analysed a sample it had collected itself.",
        source: { label: "NASA — Viking", url: NASA.viking },
      },
      {
        id: "viking-ev-weather",
        title: "WEATHER READING",
        artifactId: "viking-1",
        evidence:
          "Viking measured a cold planet with a thin, dry carbon-dioxide atmosphere.",
        explanation:
          "The lander's meteorology package helped characterise Mars as cold and dry, and turned up striking evidence of ancient river beds and vast flooding.",
        source: { label: "NASA — Viking", url: NASA.viking },
      },
      {
        id: "viking-ev-biology",
        title: "BIOLOGY EXPERIMENT",
        artifactId: "viking-1",
        evidence:
          "The biology experiments found unexpected chemical activity — and no clear evidence of life.",
        explanation:
          "The experiments discovered unexpected and enigmatic chemical activity in the Martian soil, but provided no definitive evidence for living microorganisms. The question of life on Mars has stayed open ever since.",
        source: { label: "NASA — Viking Astrobiology", url: NASA.vikingBiology },
      },
      {
        id: "viking-ev-power",
        title: "POWER CLUE",
        artifactId: "viking-1",
        evidence:
          "Two SNAP-19 radioisotope thermoelectric generators powered the Viking lander.",
        explanation:
          "Each generator was rated at 35 watts and converted the heat of decaying plutonium-238 into electricity and heat — long-lived power that lasted through dust and darkness.",
        source: { label: "NASA — Viking spacecraft and science", url: NASA.vikingSpacecraft },
      },
      {
        id: "viking-ev-timeline",
        title: "MISSION TIMELINE",
        artifactId: "viking-1",
        evidence:
          "Viking 1 worked on Mars for more than six years on a mission planned for 90 days.",
        explanation:
          "Viking Orbiter 1 completed 1,488 orbits of Mars before ending on 7 August 1980. Viking Lander 1 made its final transmission on 11 November 1982.",
        source: { label: "NASA — Viking", url: NASA.viking },
      },
    ],
    records: [
      {
        id: "viking-rec-01",
        type: "twitter",
        title: "MISSION BEGINS",
        handle: "Viking Lander 1",
        initials: "V1",
        date: "20 JUL 1976",
        body: "We have reached Mars. The lander is down on Chryse Planitia, and the first images from the surface are on their way home.",
        tags: ["VIKING", "LANDING", "CHRYSE"],
        fact: "Viking 1 was the first U.S. mission to land a spacecraft safely on Mars and return images of the surface.",
        source: { label: "NASA — Viking", url: NASA.viking },
        media: {
          variant: "viking",
          caption: "RECONSTRUCTION / VIKING LANDING SITE",
          credit: "ARTIFACT RECONSTRUCTION",
        },
        replies: [
          {
            handle: "Viking Orbiter 1",
            initials: "VO",
            date: "19 JUN 1976",
            body: "Separation confirmed. The orbiter stays up and keeps watching while the lander goes down.",
          },
        ],
      },
      {
        id: "viking-rec-02",
        type: "twitter",
        title: "FIRST SURFACE WORK",
        handle: "Viking Lander 1",
        initials: "V1",
        date: "23 JUL 1976",
        body: "The scan cameras have finished the first full panorama of the landing site. A flag is planted. The soil looks like nothing we have ever stood on.",
        tags: ["VIKING", "IMAGING", "PANORAMA"],
        fact: "Two 360-degree cylindrical scan cameras on Viking 1 produced the first panoramas from the Martian surface.",
        source: { label: "NASA — Viking: 50 Years on Mars", url: NASA.viking50 },
        media: {
          variant: "viking-pano",
          caption: "RECONSTRUCTION / CHRYSE PLANITIA PANORAMA",
          credit: "ARTIFACT RECONSTRUCTION",
        },
        replies: [
          {
            handle: "Mission Chronology",
            initials: "MC",
            date: "26 JUL 1976",
            body: "The camera 1 panorama from Chryse Planitia is dated 23 July 1976, three days after touchdown.",
          },
        ],
      },
      {
        id: "viking-rec-03",
        type: "twitter",
        title: "THE SAMPLE",
        handle: "Viking Lander 1",
        initials: "V1",
        date: "AUG 1976",
        body: "The sampler arm has reached out, pushed into the soil and lifted a scoop. The collector head is coming home with a sample inside it.",
        tags: ["VIKING", "SAMPLE", "ARM"],
        fact: "Viking 1 performed the first Martian soil sample using its robotic arm and a special biological laboratory.",
        source: { label: "NASA — Viking", url: NASA.viking },
        media: {
          variant: "viking-arm",
          caption: "RECONSTRUCTION / SAMPLER ARM DEPLOYED",
          credit: "ARTIFACT RECONSTRUCTION",
        },
        replies: [
          {
            handle: "Sampler Head",
            initials: "SH",
            date: "AUG 1976",
            body: "Collector head, temperature sensor and magnet — all on the end of one arm.",
          },
        ],
      },
      {
        id: "viking-rec-04",
        type: "twitter",
        title: "THE QUESTION",
        handle: "Viking Lander 1",
        initials: "V1",
        date: "NOV 1976",
        body: "The experiment has produced an unexpected result. There is chemical activity in this soil that we did not predict. It is not a confirmation. The question stays open.",
        tags: ["VIKING", "BIOLOGY", "OPEN QUESTION"],
        fact: "The biology experiments discovered unexpected and enigmatic chemical activity, but no clear evidence for living microorganisms.",
        source: { label: "NASA — Viking Astrobiology", url: NASA.vikingBiology },
        media: {
          variant: "viking-lab",
          caption: "RECONSTRUCTION / BIOLOGY COMPARTMENT",
          credit: "ARTIFACT RECONSTRUCTION",
        },
        replies: [
          {
            handle: "Geologist Tao",
            initials: "GT",
            date: "NOV 1976",
            body: "Six years of asking the soil the same question, and it still has not finished answering.",
          },
        ],
      },
      {
        id: "viking-rec-05",
        type: "twitter",
        title: "THE LONG WINTER",
        handle: "Viking Lander 1",
        initials: "V1",
        date: "1982",
        body: "The generators are still warm. The dust has buried one wind screen. We are still reporting the weather.",
        tags: ["VIKING", "POWER", "LONG SURVIVAL"],
        fact: "Viking's RTGs gave long-life power, letting the landers work far beyond their planned 90-day mission.",
        source: { label: "NASA — Viking spacecraft and science", url: NASA.vikingSpacecraft },
        media: {
          variant: "viking-rtg",
          caption: "RECONSTRUCTION / SNAP-19 GENERATOR",
          credit: "ARTIFACT RECONSTRUCTION",
        },
      },
    ],
    museum: [
      {
        id: "viking-museum-arm",
        name: "SAMPLER HEAD",
        x: 18,
        y: 58,
        variant: "viking-arm",
        fact: "The collector head, temperature sensor and magnet rode at the end of one robotic arm.",
        detail:
          "The arm scooped Martian soil and delivered it to the instruments inside the lander, so the whole spacecraft could study the ground without leaving it.",
        source: { label: "NASA — Viking spacecraft and science", url: NASA.vikingSpacecraft },
      },
      {
        id: "viking-museum-lab",
        name: "BIOLOGY TEST TUBE",
        x: 38,
        y: 44,
        variant: "viking-lab",
        fact: "Three biology experiments ran on the delivered soil.",
        detail:
          "They found unexpected and enigmatic chemical activity in the Martian soil, but no clear evidence for living microorganisms.",
        source: { label: "NASA — Viking Astrobiology", url: NASA.vikingBiology },
      },
      {
        id: "viking-museum-rtg",
        name: "RTG HOUSING",
        x: 60,
        y: 50,
        variant: "viking-rtg",
        fact: "Two SNAP-19 radioisotope thermoelectric generators powered the lander.",
        detail:
          "About 70 watts of electricity from the heat of decaying plutonium-238 — long-lived power that survived dust storms and Martian nights.",
        source: { label: "NASA — Viking spacecraft and science", url: NASA.vikingSpacecraft },
      },
      {
        id: "viking-museum-pano",
        name: "PANORAMA PRINTS",
        x: 80,
        y: 60,
        variant: "viking-pano",
        fact: "The first panoramas ever returned from the surface of another planet.",
        detail:
          "Camera 1 turned through a full circle on 20 July 1976 and again on 23 July 1976, building the ground-level view of Chryse Planitia.",
        source: { label: "NASA — Viking: 50 Years on Mars", url: NASA.viking50 },
      },
    ],
    keyFacts: [
      "Viking 1 landed on 20 July 1976 at Chryse Planitia — the first successful Mars landing.",
      "Its robotic arm took the first Martian soil sample and fed it to a biology laboratory inside the lander.",
      "The biology experiments found unexpected chemical activity but no clear evidence of life.",
      "Two SNAP-19 radioisotope thermoelectric generators powered the lander for more than six years.",
      "Viking 1's final transmission was on 11 November 1982. The lander is still on Chryse Planitia.",
    ],
    timeline: [
      {
        year: "1975",
        title: "LAUNCH",
        text: "Viking 1 launched on a Titan IIIE on 20 August 1975.",
      },
      {
        year: "1976",
        title: "LANDING",
        text: "Viking Lander 1 touched down on Chryse Planitia on 20 July 1976.",
      },
      {
        year: "1976",
        title: "FIRST SOIL",
        text: "The sampler arm delivered the first Martian soil sample to the lander's laboratory.",
      },
      {
        year: "1976",
        title: "THE OPEN QUESTION",
        text: "Biology experiments produced interesting signals that did not confirm life.",
      },
      {
        year: "1982",
        title: "SILENCE",
        text: "Viking Lander 1 made its final transmission on 11 November 1982.",
      },
    ],
  },
  {
    id: "pathfinder",
    name: "PATHFINDER",
    type: "LANDER + ROVER",
    era: "1997",
    location: "ARES VALLIS · 19.33°N 33.55°W",
    purpose:
      "To demonstrate a cheap way to land on Mars, and to release a small rover onto the surface.",
    legacy:
      "It proved that a direct-entry landing with airbags worked, and it delivered the first rover to drive on another planet.",
    status:
      "Left in place. The lander and Sojourner are still in Ares Vallis; the site's formal name is the Carl Sagan Memorial Station.",
    mechanicalQuestion:
      "How can humans land a machine safely and then send a smaller machine out to explore?",
    source: { label: "NASA — Mars Pathfinder project information", url: NASA.pathfinder },
    components: [
      {
        id: "pathfinder-entry",
        name: "PARACHUTE + ENTRY",
        shortLabel: "ENTRY",
        discovery: "This machine went straight into Mars instead of orbiting first.",
        description:
          "Pathfinder entered the Martian atmosphere directly at about 18 m/s — roughly 12.5 m/s vertical and 12.5 m/s horizontal — and used a parachute during descent.",
        learningPoint:
          "How it worked: it skipped the orbit and went straight for the ground. Why it mattered: it made a landing cheap enough to repeat, mission after mission.",
        marker: { x: 0.14, y: 0.3 },
      },
      {
        id: "pathfinder-airbags",
        name: "AIRBAGS",
        shortLabel: "AIRBAGS",
        discovery: "This machine did not land. It bounced.",
        description:
          "Aeroshell airbags inflated around the lander seconds before impact. Pathfinder hit the ground, bounced about 15 metres high, bounced again, and kept going — 15 bounces are visible in the landing accelerations.",
        learningPoint:
          "How it worked: the airbags absorbed the impact and let the lander skip along the surface. Why it mattered: no lander had ever survived a Mars landing this way before.",
        marker: { x: 0.3, y: 0.66 },
      },
      {
        id: "pathfinder-lander",
        name: "THE LANDER",
        shortLabel: "LANDER",
        discovery: "The lander is a base station, not a rover.",
        description:
          "Pathfinder's lander was a stationary platform carrying cameras, a weather station and the radio link to Earth. Three triangular solar-panel petals unfolded onto the ground after touchdown.",
        learningPoint:
          "How it worked: it stayed put, listened, and watched. Why it mattered: a lander that does not move can still do a great deal of science.",
        marker: { x: 0.46, y: 0.42 },
      },
      {
        id: "pathfinder-ramp",
        name: "DEPLOYMENT RAMP",
        shortLabel: "RAMP",
        discovery: "The ramp was folded against the rover until the airbags were clear.",
        description:
          "Once the airbags deflated and were retracted, a pair of deployable metal ramps unfurled from the lander to give the rover a track down to the ground.",
        learningPoint:
          "How it worked: the ramp waited for a safe moment. Why it mattered: the rover could not leave the lander until the landing system had cleared out of the way.",
        marker: { x: 0.58, y: 0.68 },
      },
      {
        id: "pathfinder-sojourner",
        name: "SOJOURNER",
        shortLabel: "ROVER",
        discovery: "The little rover came from the lander and rolled away from it.",
        description:
          "Sojourner was a six-wheeled rover of about 10.6 kg. It rolled off the ramp onto Mars on 6 July 1997 and spent 83 days exploring terrain nobody could reach on foot.",
        learningPoint:
          "What it changed: a lander can study its own patch of ground. A rover can study the whole site. Sojourner was the first rover to operate on another planet.",
        marker: { x: 0.72, y: 0.6 },
        action: "deploy",
      },
      {
        id: "pathfinder-instruments",
        name: "SCIENCE INSTRUMENTS",
        shortLabel: "INSTRUMENTS",
        discovery: "The rover carried a spectrometer and cameras and a magnet.",
        description:
          "Sojourner carried the Alpha Proton X-ray Spectrometer, cameras and a magnet on a solar-powered rover, and Pathfinder itself imaged the site with the IMP camera.",
        learningPoint:
          "What it enabled: the rounded pebbles and conglomerate rocks it analysed pointed to ancient flowing water at Ares Vallis.",
        marker: { x: 0.86, y: 0.34 },
      },
    ],
    evidence: [
      {
        id: "pathfinder-ev-airbag",
        title: "AIRBAG LANDING",
        artifactId: "pathfinder",
        evidence:
          "Pathfinder bounced about 15 times before coming to rest roughly 1 km from its first impact.",
        explanation:
          "The landing accelerometers show airbag deployment, the first bounce, the second bounce, and 15 bounces in all. Pathfinder then bounced and rolled for about another minute.",
        source: { label: "NASA — Pathfinder landing accelerations", url: NASA.pathfinderAccel },
      },
      {
        id: "pathfinder-ev-terrain",
        title: "ARES VALLIS TERRAIN",
        artifactId: "pathfinder",
        evidence:
          "Pathfinder landed in a flood channel — a place where running water carved the ground.",
        explanation:
          "The site sits at 19.33°N, 33.55°W in Ares Vallis. Choosing a channel meant choosing a place where ancient water had left its traces.",
        source: { label: "NASA — Mars Pathfinder project information", url: NASA.pathfinder },
      },
      {
        id: "pathfinder-ev-deploy",
        title: "SOJOURNER DEPLOYMENT",
        artifactId: "pathfinder",
        evidence:
          "Sojourner rolled onto the Martian surface on 6 July 1997, about two days after the landing.",
        explanation:
          "The airbags had to be deflated and retracted before the ramps could be unfurled safely. Then the rover made its own way off the lander for the first time.",
        source: { label: "NASA — Airbags and Sojourner rover", url: NASA.pathfinderAirbags },
      },
      {
        id: "pathfinder-ev-rocks",
        title: "ROCK + SOIL ANALYSIS",
        artifactId: "pathfinder",
        evidence:
          "Rounded pebbles and conglomerate rocks suggested that ancient water had flowed at Ares Vallis.",
        explanation:
          "These observations were consistent with a wetter Martian past — evidence of ancient flowing water, written into rock rather than into a machine's memory.",
        source: { label: "NASA — Mars Pathfinder project information", url: NASA.pathfinder },
      },
      {
        id: "pathfinder-ev-weather",
        title: "WEATHER OBSERVATIONS",
        artifactId: "pathfinder",
        evidence:
          "Pathfinder's lander kept a weather station running and its cameras watched the sky.",
        explanation:
          "A landed platform can record the weather for weeks — a kind of observing outpost that no crewed base had ever had on Mars.",
        source: { label: "NASA — Mars Pathfinder project information", url: NASA.pathfinder },
      },
      {
        id: "pathfinder-ev-data",
        title: "MISSION DATA",
        artifactId: "pathfinder",
        evidence:
          "Sojourner worked for 83 days on a mission planned for seven.",
        explanation:
          "Pathfinder's last data transmission came on 27 September 1997, and the mission was terminated on 10 March 1998. The hardware is still in Ares Vallis.",
        source: { label: "NASA — Pathfinder landing accelerations", url: NASA.pathfinderAccel },
      },
    ],
    records: [
      {
        id: "pathfinder-rec-01",
        type: "twitter",
        title: "WHY ARE THERE GIANT IMPACT MARKS HERE?",
        handle: "Pathfinder Lander",
        initials: "PF",
        date: "04 JUL 1997",
        body: "We have hit Mars. We are still moving. That is not how this was supposed to end.",
        tags: ["PATHFINDER", "LANDING", "AIRBAGS"],
        fact: "Pathfinder landed at about 18 m/s and bounced roughly 15 times before coming to rest.",
        source: { label: "NASA — Pathfinder landing accelerations", url: NASA.pathfinderAccel },
        media: {
          variant: "pathfinder-airbag",
          caption: "RECONSTRUCTION / AIRBAG DEPLOYMENT",
          credit: "ARTIFACT RECONSTRUCTION",
        },
        replies: [
          {
            handle: "Airbag System",
            initials: "AB",
            date: "04 JUL 1997",
            body: "Parachute, then airbags, then impact, then bounce, then stop. It worked.",
          },
        ],
      },
      {
        id: "pathfinder-rec-02",
        type: "twitter",
        title: "SOMETHING MOVED",
        handle: "Pathfinder Lander",
        initials: "PF",
        date: "06 JUL 1997",
        body: "Something is rolling down the ramp. Six wheels, one metre of machine, and it is moving away from us on its own.",
        tags: ["PATHFINDER", "SOJOURNER", "DEPLOYMENT"],
        fact: "Sojourner rolled onto the Martian surface on 6 July 1997 and became the first rover to operate on another planet.",
        source: { label: "NASA — Airbags and Sojourner rover", url: NASA.pathfinderAirbags },
        media: {
          variant: "pathfinder-ramp",
          caption: "RECONSTRUCTION / RAMP DEPLOYMENT",
          credit: "ARTIFACT RECONSTRUCTION",
        },
        replies: [
          {
            handle: "Imager for Mars Pathfinder",
            initials: "IM",
            date: "06 JUL 1997",
            body: "Rover completely off the ramp, all six wheels on the Martian soil.",
          },
        ],
      },
      {
        id: "pathfinder-rec-03",
        type: "twitter",
        title: "ROUNDS AND ROUNDS",
        handle: "Sojourner",
        initials: "SJ",
        date: "JUL 1997",
        body: "The ground here is made of rounded pebbles. Rocks that get smoothed like that have been tumbled by moving water. There was water here.",
        tags: ["PATHFINDER", "ARES VALLIS", "WATER"],
        fact: "Rounded pebbles and other observations at Ares Vallis provided evidence consistent with ancient flowing water.",
        source: { label: "NASA — Mars Pathfinder project information", url: NASA.pathfinder },
        media: {
          variant: "pathfinder-pebbles",
          caption: "RECONSTRUCTION / ARES VALLIS SURFACE",
          credit: "ARTIFACT RECONSTRUCTION",
        },
        replies: [
          {
            handle: "Alpha Proton X-ray Spectrometer",
            initials: "AP",
            date: "AUG 1997",
            body: "Element by element, this rock is telling us where it has been.",
          },
        ],
      },
      {
        id: "pathfinder-rec-04",
        type: "twitter",
        title: "A LONG SHIFT",
        handle: "Sojourner",
        initials: "SJ",
        date: "27 SEP 1997",
        body: "We planned seven days. We have done eighty-three. The lander is going quiet on us.",
        tags: ["PATHFINDER", "MISSION DATA", "END"],
        fact: "Sojourner spent 83 days of a planned seven-day mission; Pathfinder's final data transmission came on 27 September 1997.",
        source: { label: "NASA — Pathfinder landing accelerations", url: NASA.pathfinderAccel },
        media: {
          variant: "pathfinder-terrain",
          caption: "RECONSTRUCTION / ARES VALLIS OUTPOST",
          credit: "ARTIFACT RECONSTRUCTION",
        },
      },
    ],
    museum: [
      {
        id: "pathfinder-museum-rover",
        name: "ROVER MODEL",
        x: 20,
        y: 56,
        variant: "pathfinder-rover",
        fact: "Sojourner was a six-wheeled rover weighing about 10.6 kg.",
        detail:
          "About 30 cm tall and 26 cm long, it rolled off Pathfinder's ramp and explored Ares Vallis for 83 days — the first rover to operate on another planet.",
        source: { label: "NASA — Mars Pathfinder project information", url: NASA.pathfinder },
      },
      {
        id: "pathfinder-museum-airbag",
        name: "AIRBAG DISPLAY",
        x: 42,
        y: 46,
        variant: "pathfinder-airbag",
        fact: "Pathfinder bounced more than 15 times before coming to rest.",
        detail:
          "The airbags inflated seconds before impact, absorbed the landing, and let the lander skip about 1 km across the surface in about two and a half minutes.",
        source: { label: "NASA — Pathfinder landing accelerations", url: NASA.pathfinderAccel },
      },
      {
        id: "pathfinder-museum-rock",
        name: "ROCK SPECIMEN",
        x: 64,
        y: 54,
        variant: "pathfinder-pebbles",
        fact: "Rounded pebbles were evidence of ancient flowing water.",
        detail:
          "The conglomerates and rounded pebbles at Ares Vallis pointed to a wetter Martian past and made a case for ancient running water.",
        source: { label: "NASA — Mars Pathfinder project information", url: NASA.pathfinder },
      },
      {
        id: "pathfinder-museum-log",
        name: "FLIGHT LOG",
        x: 84,
        y: 46,
        variant: "pathfinder-terrain",
        fact: "83 days of exploration on a 7-day plan.",
        detail:
          "Pathfinder's last transmission came on 27 September 1997; the mission was formally terminated on 10 March 1998.",
        source: { label: "NASA — Pathfinder landing accelerations", url: NASA.pathfinderAccel },
      },
    ],
    keyFacts: [
      "Pathfinder landed on 4 July 1997 in Ares Vallis and bounced about 15 times before resting.",
      "It used a parachute and airbags instead of a powered descent — a landing system nobody had used before.",
      "Sojourner was deployed from the lander on 6 July 1997 and was the first rover to drive on another planet.",
      "Observations of rounded pebbles provided evidence consistent with ancient flowing water at Ares Vallis.",
      "Sojourner worked for 83 days on a mission planned for seven. Both machines are still in Ares Vallis.",
    ],
    timeline: [
      {
        year: "1996",
        title: "LAUNCH",
        text: "Mars Pathfinder launched on a Delta II on 4 December 1996.",
      },
      {
        year: "1997",
        title: "THE BOUNCE",
        text: "The lander touched down on 4 July 1997 and bounced about 15 times.",
      },
      {
        year: "1997",
        title: "DEPLOYMENT",
        text: "Sojourner rolled down the ramp and onto Mars on 6 July 1997.",
      },
      {
        year: "1997",
        title: "ANCIENT WATER",
        text: "Rounded pebbles at Ares Vallis pointed to ancient flowing water.",
      },
      {
        year: "1997",
        title: "SILENCE",
        text: "Pathfinder's last data transmission came on 27 September 1997.",
      },
    ],
  },
  {
    id: "ingenuity",
    name: "INGENUITY",
    type: "MARS HELICOPTER",
    era: "2021 – 2024",
    location: "JEZERO CRATER",
    purpose:
      "To prove that a powered, controlled aircraft could fly on another planet.",
    legacy:
      "It flew 72 times over almost three years, went more than 14 times farther than planned, and became an aerial scout for the rover it served.",
    status:
      "Left in place. Ingenuity made its last flight on 18 January 2024 and its rotor blade was damaged on landing. It still stands in Jezero Crater.",
    mechanicalQuestion:
      "How can an aircraft fly in Mars' extremely thin atmosphere?",
    source: { label: "NASA — Ingenuity mission ends", url: NASA.ingenuityEnd },
    components: [
      {
        id: "ingenuity-rotor",
        name: "ROTOR BLADES",
        shortLabel: "ROTOR",
        discovery: "These blades have to do all the work. Mars has almost no air to push against.",
        description:
          "Ingenuity's twin carbon-fibre rotors spin far faster than an Earth helicopter's, because Mars' atmosphere is less than one percent as dense as Earth's.",
        learningPoint:
          "How it worked: bigger, faster blades at lower mass. Why it mattered: the whole machine is a bet that lift can be made where lift is nearly impossible.",
        marker: { x: 0.5, y: 0.12 },
      },
      {
        id: "ingenuity-solar",
        name: "SOLAR PANEL",
        shortLabel: "POWER",
        discovery: "The solar panel charges the batteries that the rotors spend.",
        description:
          "A solar panel across the top of the body converts sunlight into electricity and recharges the batteries that power each flight.",
        learningPoint:
          "How it worked: sunlight in, battery out. Why it mattered: the helicopter had to carry every gram of stored energy it would ever use.",
        marker: { x: 0.74, y: 0.26 },
      },
      {
        id: "ingenuity-battery",
        name: "BATTERY",
        shortLabel: "BATTERY",
        discovery: "Every flight spends the battery, and the sun has to refill it.",
        description:
          "Ingenuity carried a small battery charged by the solar panel. Flight time was limited by the energy stored in that battery.",
        learningPoint:
          "Why it mattered: a battery-limited aircraft cannot loiter. Ingenuity flew short hops, landed, recharged, and flew again.",
        marker: { x: 0.26, y: 0.34 },
      },
      {
        id: "ingenuity-camera",
        name: "NAVIGATION CAMERA",
        shortLabel: "CAMERA",
        discovery: "The helicopter learns where it is by looking at the ground.",
        description:
          "Ingenuity navigated using a downward-looking navigation camera that tracked the surface below it, comparing what it saw with what it expected to see.",
        learningPoint:
          "How it worked: it flies by vision over features it has already seen. Why it mattered: there is no GPS on Mars — the terrain itself is the map.",
        marker: { x: 0.38, y: 0.58 },
      },
      {
        id: "ingenuity-gear",
        name: "LANDING GEAR",
        shortLabel: "LANDING",
        discovery: "It has to touch down in thin air, without a runway and without wheels to roll on.",
        description:
          "Four legs and skid-style landing gear absorb the touchdown. Ingenuity's landing was one of the hardest parts of the design, and the weakest part of the mission's final flight.",
        learningPoint:
          "Why it mattered: on Mars a landing is a controlled collision. The gear exists so the machine can survive its own arrival and fly again.",
        marker: { x: 0.62, y: 0.72 },
      },
      {
        id: "ingenuity-control",
        name: "FLIGHT CONTROL",
        shortLabel: "FLIGHT CONTROL",
        discovery: "A machine built to fly, on a world that never expected one.",
        description:
          "Flight-control software handled the hover, the descent and the landing while a radio link to Perseverance relayed commands from Earth.",
        learningPoint:
          "What it enabled: the first powered, controlled flight on another planet, on 19 April 2021 — the moment that changed the question from 'can it fly' to 'how far can it go'.",
        marker: { x: 0.14, y: 0.56 },
      },
    ],
    evidence: [
      {
        id: "ingenuity-ev-first",
        title: "FIRST FLIGHT",
        artifactId: "ingenuity",
        evidence:
          "Ingenuity made the first powered, controlled flight on another planet on 19 April 2021.",
        explanation:
          "The technology demonstration it was built for took 39.1 seconds: a hover, a climb, and a controlled landing on the Martian surface.",
        source: { label: "NASA — Ingenuity mission ends", url: NASA.ingenuityEnd },
      },
      {
        id: "ingenuity-ev-air",
        title: "THIN ATMOSPHERE",
        artifactId: "ingenuity",
        evidence:
          "Mars' atmosphere is less than one percent as dense as Earth's.",
        explanation:
          "An Earth helicopter uses its blades to push air down. With almost no air to push, Ingenuity needed much larger blades, spinning much faster, on a much lighter machine.",
        source: { label: "NASA — Ingenuity mission ends", url: NASA.ingenuityEnd },
      },
      {
        id: "ingenuity-ev-camera",
        title: "NAVIGATION CAMERA",
        artifactId: "ingenuity",
        evidence:
          "Ingenuity navigated by tracking features on the surface below it.",
        explanation:
          "There is no satellite navigation on Mars. The helicopter matched what its camera saw against what it expected, and that is how it knew where it was.",
        source: { label: "NASA — Ingenuity mission ends", url: NASA.ingenuityEnd },
      },
      {
        id: "ingenuity-ev-scouting",
        title: "AERIAL SCOUTING",
        artifactId: "ingenuity",
        evidence:
          "Ingenuity became an aerial scout, looking over terrain the rover could not reach.",
        explanation:
          "What began as a technology demonstration turned into an operations demonstration — the helicopter started choosing targets for the Perseverance rover.",
        source: { label: "NASA — JPL: #ThanksIngenuity", url: NASA.ingenuityJpl },
      },
      {
        id: "ingenuity-ev-72",
        title: "72-FLIGHT RECORD",
        artifactId: "ingenuity",
        evidence:
          "Designed for up to five flights, Ingenuity completed 72 — flying 17 km in over two hours.",
        explanation:
          "It flew more than 14 times farther than planned and stayed on Mars for almost three years, far beyond its 30-day demonstration window.",
        source: { label: "NASA — Farewell to Ingenuity", url: NASA.ingenuityFarewell },
      },
      {
        id: "ingenuity-ev-final",
        title: "FINAL FLIGHT",
        artifactId: "ingenuity",
        evidence:
          "The final flight, on 18 January 2024, ended with a damaged rotor blade.",
        explanation:
          "A navigation problem over featureless terrain led to an emergency landing, and the short flight to relocate the helicopter ended in a hard touchdown that damaged a rotor blade.",
        source: { label: "NASA — Ingenuity mission ends", url: NASA.ingenuityEnd },
      },
    ],
    records: [
      {
        id: "ingenuity-rec-01",
        type: "twitter",
        title: "THE MACHINE WAS BUILT TO FLY",
        handle: "Ingenuity",
        initials: "IG",
        date: "19 APR 2021",
        body: "We are off the ground. One hundred feet up, over Mars, on a machine built to prove that this was possible. It is hovering. It is staying there. We are going to put it back down.",
        tags: ["INGENUITY", "FIRST FLIGHT", "FLIGHT 01"],
        fact: "Ingenuity achieved the first powered, controlled flight on another planet on 19 April 2021.",
        source: { label: "NASA — Ingenuity mission ends", url: NASA.ingenuityEnd },
        media: {
          variant: "ingenuity-flight",
          caption: "RECONSTRUCTION / FIRST FLIGHT",
          credit: "ARTIFACT RECONSTRUCTION",
        },
        replies: [
          {
            handle: "Flight Control",
            initials: "FC",
            date: "19 APR 2021",
            body: "Hovering at 40 feet. Clock running. Bringing it home.",
          },
        ],
      },
      {
        id: "ingenuity-rec-02",
        type: "twitter",
        title: "EXPECTED: 5 FLIGHTS",
        handle: "Mission Plan",
        initials: "MP",
        date: "2021",
        body: "The plan is a handful of test flights over 30 days. Prove the concept, then move on. Anything beyond that is a bonus.",
        tags: ["INGENUITY", "PLAN", "TECH DEMO"],
        fact: "Ingenuity was originally designed to perform up to five experimental test flights over 30 days.",
        source: { label: "NASA — Ingenuity mission ends", url: NASA.ingenuityEnd },
        media: {
          variant: "ingenuity-rotor",
          caption: "RECONSTRUCTION / ROTOR SYSTEM",
          credit: "ARTIFACT RECONSTRUCTION",
        },
      },
      {
        id: "ingenuity-rec-03",
        type: "twitter",
        title: "ACTUAL: 72 FLIGHTS",
        handle: "Ingenuity",
        initials: "IG",
        date: "2023",
        body: "Seventy-two flights. Seventeen kilometres. Two hours of flight time in an atmosphere with one percent of the air. We are no longer a demonstration. We are a scout.",
        tags: ["INGENUITY", "72 FLIGHTS", "SCOUTING"],
        fact: "Ingenuity performed 72 flights, flew more than 14 times farther than planned and logged more than two hours of total flight time.",
        source: { label: "NASA — Farewell to Ingenuity", url: NASA.ingenuityFarewell },
        media: {
          variant: "ingenuity-scout",
          caption: "RECONSTRUCTION / AERIAL SCOUTING",
          credit: "ARTIFACT RECONSTRUCTION",
        },
        replies: [
          {
            handle: "Perseverance Rover",
            initials: "PX",
            date: "2023",
            body: "I drive. It flies. Between us we can reach further than either of us alone.",
          },
        ],
      },
      {
        id: "ingenuity-rec-04",
        type: "twitter",
        title: "THE LAST FLIGHT",
        handle: "Ingenuity",
        initials: "IG",
        date: "18 JAN 2024",
        body: "Short hop to find out where I am. The ground looked the same everywhere, so the navigation had nothing to hold on to. I came down hard. A rotor blade is broken. That was the seventy-second flight.",
        tags: ["INGENUITY", "FINAL FLIGHT", "ROTOR DAMAGE"],
        fact: "On 18 January 2024 Ingenuity flew to 40 feet, hovered 4.5 seconds, and descended; imagery afterwards showed a rotor blade damaged during touchdown.",
        source: { label: "NASA — Ingenuity mission ends", url: NASA.ingenuityEnd },
        media: {
          variant: "ingenuity-final",
          caption: "RECONSTRUCTION / FINAL AIRFIELD",
          credit: "ARTIFACT RECONSTRUCTION",
        },
        replies: [
          {
            handle: "Ground Station",
            initials: "GS",
            date: "18 JAN 2024",
            body: "We lost contact about a metre above the surface. It came back the next day, with damage.",
          },
        ],
      },
      {
        id: "ingenuity-rec-05",
        type: "twitter",
        title: "FLIGHT OPERATIONS CONCLUDED",
        handle: "Mission Control",
        initials: "MC",
        date: "25 JAN 2024",
        body: "Flight operations are concluded. The helicopter is still standing in Jezero Crater, and it will stay there.",
        tags: ["INGENUITY", "MISSION END", "JEZERO"],
        fact: "NASA announced the end of the Ingenuity mission on 25 January 2024; the helicopter remains on the Martian surface.",
        source: { label: "NASA — Ingenuity mission ends", url: NASA.ingenuityEnd },
        media: {
          variant: "ingenuity-field",
          caption: "RECONSTRUCTION / FINAL AIRFIELD, JEZERO",
          credit: "ARTIFACT RECONSTRUCTION",
        },
      },
    ],
    museum: [
      {
        id: "ingenuity-museum-log",
        name: "FLIGHT LOG",
        x: 18,
        y: 56,
        variant: "ingenuity-flight",
        fact: "72 flights, 17 km, more than two hours of flight time.",
        detail:
          "Planned for five test flights over 30 days, Ingenuity flew for almost three years and went more than 14 times farther than planned.",
        source: { label: "NASA — Farewell to Ingenuity", url: NASA.ingenuityFarewell },
      },
      {
        id: "ingenuity-museum-rotor",
        name: "ROTOR BLADE",
        x: 40,
        y: 44,
        variant: "ingenuity-rotor",
        fact: "Carbon-fibre blades, spinning fast, on a machine that weighs less than a gallon of milk.",
        detail:
          "With an atmosphere less than one percent as dense as Earth's, lift had to be earned by blade design rather than by air.",
        source: { label: "NASA — Ingenuity mission ends", url: NASA.ingenuityEnd },
      },
      {
        id: "ingenuity-museum-panel",
        name: "SOLAR PANEL",
        x: 62,
        y: 54,
        variant: "ingenuity-solar",
        fact: "The solar panel recharges the batteries that power every flight.",
        detail:
          "Ingenuity could not loiter. It landed, recharged, and flew again — which is exactly the rhythm of a scout that keeps returning.",
        source: { label: "NASA — Ingenuity mission ends", url: NASA.ingenuityEnd },
      },
      {
        id: "ingenuity-museum-shadow",
        name: "ROTOR SHADOW",
        x: 83,
        y: 46,
        variant: "ingenuity-final",
        fact: "After its 72nd flight, the helicopter imaged the shadow of its own damaged rotor blade.",
        detail:
          "The blade was damaged during a rough landing, rendering the helicopter no longer capable of flight. It remains in Jezero Crater.",
        source: { label: "NASA — Ingenuity rotor shadow", url: NASA.ingenuityRotor },
      },
    ],
    keyFacts: [
      "Ingenuity's first powered, controlled flight on another planet was on 19 April 2021.",
      "It was designed for up to five test flights over 30 days, and completed 72.",
      "It flew 17 km and logged more than two hours of total flight time over almost three years.",
      "Navigation depended on features it could see on the Martian surface — there is no GPS on Mars.",
      "Its final flight was on 18 January 2024; a rotor blade was damaged on landing and it never flew again.",
    ],
    timeline: [
      {
        year: "2021",
        title: "FIRST FLIGHT",
        text: "Ingenuity made the first powered, controlled flight on another planet on 19 April 2021.",
      },
      {
        year: "2021",
        title: "THE SCOUT",
        text: "After the demonstration, Ingenuity began scouting routes for the Perseverance rover.",
      },
      {
        year: "2023",
        title: "FLIGHT 69",
        text: "A flight that ended in an emergency landing over featureless terrain.",
      },
      {
        year: "2024",
        title: "FINAL FLIGHT",
        text: "Flight 72 on 18 January 2024 ended with a rotor blade damaged on landing.",
      },
      {
        year: "2024",
        title: "END OF FLIGHT OPERATIONS",
        text: "NASA concluded flight operations on 25 January 2024. The helicopter remains on Mars.",
      },
    ],
  },
];

export const ARTIFACT_BY_ID: Record<string, Artifact> = ARTIFACTS.reduce(
  (acc, artifact) => {
    acc[artifact.id] = artifact;
    return acc;
  },
  {} as Record<string, Artifact>,
);

export const EVIDENCE_BY_ID: Record<string, EvidenceFragment> = ARTIFACTS.reduce(
  (acc, artifact) => {
    artifact.evidence.forEach((item) => {
      acc[item.id] = item;
    });
    return acc;
  },
  {} as Record<string, EvidenceFragment>,
);

/** The three witnesses, in the order the Mars chapter meets them. */
export const ARTIFACT_ORDER = ARTIFACTS.map((artifact) => artifact.id);

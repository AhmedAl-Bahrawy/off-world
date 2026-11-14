import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/mars.css";
import "../styles/archive.css";
import { MISSIONS } from "../story/missions";
import type { MissionAnchor } from "../story/missions";
import { ARTIFACT_BY_ID } from "../story/artifacts";
import { useMarsStore } from "../state/store";
import type { MarsView } from "../state/store";
import { SceneTitle } from "../../shared/SceneTitle";
import ArtifactPanel from "../ui/ArtifactPanel";
import EvidenceCard from "../ui/EvidenceCard";
import MarsArchive from "../ui/MarsArchive";
import ArchiveViewer from "../archive/ArchiveViewer";

type Platform = {
  x: number;
  y: number;
  w: number;
  h: number;
  oneWay?: boolean;
};
type Interactable = {
  id: string;
  kind: MissionAnchor["kind"];
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  unknownLabel: string;
  verb: string;
  artifactId: string;
  componentId?: string;
  evidenceId?: string;
  air?: boolean;
  taken: boolean;
  pinged: boolean;
};
type World = {
  solids: Platform[];
  length: number;
  goalX: number;
  checkpoints: number[];
  interactables: Interactable[];
};
type Player = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  coyote: number;
  jumpBuffer: number;
  facing: number;
  frame: number;
  invulnerable: number;
  bounced: boolean;
  flying: boolean;
  battery: number;
};
type Sequence = {
  id: string;
  steps: { text: string; at: number }[];
  duration: number;
  t: number;
};
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
};
type Toast = { text: string; sub: string; t: number; kind: string };
type RespawnInfo = {
  cause: string;
  where: string;
  metres: number;
  falls: number;
};
type Objective = { id: string; text: string; x: number; y: number };

const W = 480,
  H = 270,
  GROUND = 225,
  STEP = 1 / 60;
const zoneColors = {
  viking: ["#291523", "#b96243", "#6b342d", "#c8764e"],
  pathfinder: ["#301726", "#de7644", "#81402e", "#e09157"],
  ingenuity: ["#110d24", "#754356", "#40243b", "#d3b8dc"],
};
const spriteNames = [
  "curi_idle",
  "curi_run",
  "curi_jump",
  "curi_fall",
  "curi_land",
  "curi_dig",
  "coper_idle",
  "vigil",
  "siegfried",
  "sojourner",
  "gusto",
  "shard",
  "bit",
  "cell",
  "tube",
  "rock",
  "rock2",
  "boulder",
  "ice",
  "cactus",
  "bone",
  "sign",
  "lamp",
  "antenna",
  "mite",
  "wasp",
  "goon",
  "goalpost",
  "flag",
];

function buildWorld(index: number): World {
  const mission = MISSIONS[index];
  const length = 1500 + (index % 3) * 160;
  const solids: Platform[] = [
    { x: 0, y: GROUND, w: 215, h: 80 },
    { x: 280, y: GROUND, w: 205, h: 80 },
  ];
  let x = 500;
  let seed = 101 + index * 71;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  while (x < length - 220) {
    const gap = 42 + rand() * 25;
    const width = 130 + rand() * 110;
    solids.push({ x, y: GROUND, w: width, h: 80 });
    if (rand() > 0.32)
      solids.push({
        x: x + 28 + rand() * 45,
        y: 171 + rand() * 18,
        w: 48 + rand() * 42,
        h: 12,
        oneWay: true,
      });
    x += width + gap;
  }
  solids.push({ x: length - 180, y: GROUND, w: 220, h: 80 });

  const interactables: Interactable[] = mission.anchors.map((anchor) => {
    const base = 70 + anchor.at * (length - 180);
    return {
      id: anchor.id,
      kind: anchor.kind,
      x: base,
      y: GROUND - (anchor.dy ?? 0) - (anchor.kind === "evidence" ? 14 : 0),
      w: anchor.kind === "artifact" ? 46 : 26,
      h: anchor.kind === "artifact" ? 54 : 30,
      label: anchor.label,
      unknownLabel: anchor.unknownLabel ?? anchor.label,
      verb: anchor.verb,
      artifactId: anchor.artifactId,
      componentId: anchor.componentId,
      evidenceId: anchor.evidenceId,
      air: anchor.air,
      taken: false,
      pinged: false,
    };
  });

  return {
    solids,
    length,
    goalX: length - 90,
    checkpoints: [0, Math.floor(length * 0.48)],
    interactables,
  };
}

function sprite(
  imgs: Record<string, HTMLImageElement>,
  name: string,
  frame = 0,
) {
  const image = imgs[`${name}-${frame}`];
  return image?.naturalWidth ? image : imgs[`${name}-0`];
}

const CHECKPOINT_NAMES = ["THE MISSION START POINT", "THE HALFWAY BEACON"];

/** Where to put the rover after a fall: on solid ground at or after the beacon. */
function safeSpawn(world: World, cp: number) {
  const ground = world.solids.find(
    (s) => !s.oneWay && s.y === GROUND && s.x + s.w > cp + 44,
  );
  const x = ground ? Math.max(cp + 8, ground.x + 14) : cp + 8;
  return { x, y: GROUND - 26 };
}

/**
 * What the player still has to do on this terrain. Required tasks gate the
 * goal; the archive terminal is optional but still guided.
 */
function computeObjectives(
  world: World,
  done: Set<string>,
  discovered: string[],
  px: number,
) {
  const required: Objective[] = [];
  const artifactAnchor = world.interactables.find((i) => i.kind === "artifact");
  const artifactDone = !artifactAnchor || done.has(artifactAnchor.id);
  for (const i of world.interactables) {
    if (i.kind === "artifact" && !done.has(i.id)) {
      const known = discovered.includes(i.artifactId);
      required.push({
        id: i.id,
        text: known
          ? `INSPECT ${i.label}`
          : "FIND THE UNKNOWN MACHINE AND PRESS E",
        x: i.x,
        y: i.y,
      });
    } else if (i.kind === "component" && !i.taken && artifactDone) {
      required.push({ id: i.id, text: `INSPECT ${i.label}`, x: i.x, y: i.y });
    } else if (i.kind === "evidence" && !i.taken) {
      required.push({
        id: i.id,
        text: i.air
          ? "HOLD H TO FLY TO THE FLOATING WAYPOINT"
          : `COLLECT ${i.label}`,
        x: i.x,
        y: i.y,
      });
    }
  }
  const nearest = (list: Objective[]) =>
    list.reduce<Objective | null>(
      (best, o) =>
        !best || Math.abs(o.x - px) < Math.abs(best.x - px) ? o : best,
      null,
    );
  // Before the machine is found, point at it (evidence on the way is a bonus).
  const gate = required.find(
    (o) => o.id === artifactAnchor?.id && !artifactDone,
  );
  const next = gate ?? nearest(required);
  const archive = world.interactables.find(
    (i) => i.kind === "archive" && !done.has(i.id),
  );
  return { required, next, archive };
}

export default function MarsScene({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef({
    world: buildWorld(0),
    player: {
      x: 48,
      y: 190,
      vx: 0,
      vy: 0,
      onGround: false,
      coyote: 0,
      jumpBuffer: 0,
      facing: 1,
      frame: 0,
      invulnerable: 0,
      bounced: false,
      flying: false,
      battery: 100,
    } as Player,
    camera: 0,
    time: 0,
    accumulator: 0,
    last: 0,
    deaths: 0,
    checkpoint: 0,
    view: "brief" as string,
    level: 0,
    keys: {} as Record<string, boolean>,
    jumpEdge: false,
    imgs: {} as Record<string, HTMLImageElement>,
    got: 0,
    prompt: "",
    sequence: null as Sequence | null,
    done: new Set<string>(),
    fx: [] as Particle[],
    toast: null as Toast | null,
    afterSequence: null as (() => void) | null,
    returnView: "play" as MarsView,
    respawnTimer: 0,
    interact: (() => {}) as () => void,
    ping: (() => {}) as () => void,
    objective: "",
    objectiveCount: "",
    touch: false,
  });
  const view = useMarsStore((s) => s.view);
  const setView = useMarsStore((s) => s.setView);
  const level = useMarsStore((s) => s.level);
  const setLevel = useMarsStore((s) => s.setLevel);
  const deaths = useMarsStore((s) => s.deaths);
  const setDeaths = useMarsStore((s) => s.setDeaths);
  const collected = useMarsStore((s) => s.collected);
  const setCollected = useMarsStore((s) => s.setCollected);
  const quizResult = useMarsStore((s) => s.quizResult);
  const setQuizResult = useMarsStore((s) => s.setQuizResult);
  const discovered = useMarsStore((s) => s.discoveredArtifacts);
  const inspected = useMarsStore((s) => s.inspectedComponents);
  const recovered = useMarsStore((s) => s.recoveredEvidence);
  const discoverArtifact = useMarsStore((s) => s.discoverArtifact);
  const inspectComponent = useMarsStore((s) => s.inspectComponent);
  const recoverEvidence = useMarsStore((s) => s.recoverEvidence);
  const unlockArchive = useMarsStore((s) => s.unlockArchive);
  const completeCheck = useMarsStore((s) => s.completeCheck);
  const completeArtifact = useMarsStore((s) => s.completeArtifact);
  const [livePrompt, setLivePrompt] = useState("");
  const [respawnInfo, setRespawnInfo] = useState<RespawnInfo | null>(null);
  const [chosen, setChosen] = useState(-1);
  const [hudObjective, setHudObjective] = useState({ text: "", count: "" });
  const [isTouch, setIsTouch] = useState(false);
  const setCheckResult = useMarsStore((s) => s.setCheckResult);
  const addFall = useMarsStore((s) => s.addFall);
  const totalFalls = useMarsStore((s) => s.totalFalls);
  const checkResults = useMarsStore((s) => s.checkResults);
  const [openArtifact, setOpenArtifact] = useState("");
  const [openEvidence, setOpenEvidence] = useState("");

  const mission = MISSIONS[level];
  const artifact = ARTIFACT_BY_ID[mission.artifactId];

  const changeView = useCallback(
    (next: MarsView) => {
      gameRef.current.view = next;
      setView(next);
    },
    [setView],
  );

  // Keep the world's view of the player's knowledge in sync with the store.
  const syncWorld = useCallback(() => {
    const g = gameRef.current;
    const st = useMarsStore.getState();
    g.world.interactables.forEach((i) => {
      if (i.evidenceId) i.taken = st.recoveredEvidence.includes(i.evidenceId);
      if (i.componentId)
        i.taken = st.inspectedComponents.includes(i.componentId);
    });
  }, []);

  useEffect(() => {
    syncWorld();
  }, [recovered, inspected, discovered, syncWorld]);

  const resetMission = useCallback(
    (idx: number) => {
      const g = gameRef.current;
      g.level = idx;
      g.world = buildWorld(idx);
      syncWorld();
      g.player = {
        x: 48,
        y: 190,
        vx: 0,
        vy: 0,
        onGround: false,
        coyote: 0,
        jumpBuffer: 0,
        facing: 1,
        frame: 0,
        invulnerable: 0,
        bounced: false,
        flying: false,
        battery: 100,
      };
      g.camera = 0;
      g.accumulator = 0;
      g.checkpoint = 0;
      g.deaths = 0;
      g.got = 0;
      g.sequence = null;
      g.afterSequence = null;
      g.done = new Set<string>();
      g.fx = [];
      g.toast = null;
      g.prompt = "";
      g.objective = "";
      setRespawnInfo(null);
      setOpenArtifact("");
      setOpenEvidence("");
      setLevel(idx);
      setDeaths(0);
      setCollected(0);
      setQuizResult(false);
      changeView("play");
    },
    [changeView, syncWorld, setCollected, setDeaths, setLevel, setQuizResult],
  );

  useEffect(() => {
    useMarsStore.getState().reset();
    const mq = window.matchMedia("(pointer: coarse), (max-width: 820px)");
    const sync = () => {
      gameRef.current.touch = mq.matches;
      setIsTouch(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const imgs: Record<string, HTMLImageElement> = {};
    spriteNames.forEach((name) => {
      for (let frame = 0; frame < 4; frame++) {
        const image = new Image();
        image.src = `/assets/mars-sprites/${name}-${frame}.png`;
        imgs[`${name}-${frame}`] = image;
      }
    });
    gameRef.current.imgs = imgs;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    let raf = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const nearestInteractable = (g: typeof gameRef.current): Interactable | null => {
      const p = g.player;
      let best: Interactable | null = null;
      let bestDist = Infinity;
      for (const i of g.world.interactables) {
        if (i.taken) continue;
        if (i.air && !p.flying) continue;
        const dx = Math.abs(p.x + 9 - i.x);
        const dy = Math.abs(p.y + 12 - i.y);
        if (dx < 40 && dy < 46 && dx < bestDist) {
          best = i;
          bestDist = dx;
        }
      }
      return best;
    };

    const burst = (x: number, y: number, color: string, n = 16) => {
      const g = gameRef.current;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
        const sp = 30 + Math.random() * 60;
        g.fx.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 20,
          life: 0.7 + Math.random() * 0.4,
          max: 1.1,
          color,
        });
      }
    };
    const toast = (text: string, sub: string, kind = "info", t = 3.4) => {
      gameRef.current.toast = { text, sub, t, kind };
    };

    const startSequence = (id: string) => {
      const sequences: Record<string, Sequence["steps"]> = {
        sample: [
          { text: "ARM EXTENDS", at: 0 },
          { text: "SOIL SAMPLE", at: 1.1 },
          { text: "SAMPLE MOVED", at: 2.2 },
          { text: "INSIDE THE LANDER — THE LAB IS RUNNING", at: 3.4 },
        ],
        deploy: [
          { text: "RAMP OPENS", at: 0 },
          { text: "SOJOURNER ROLLS DOWN", at: 1.3 },
          { text: "THE ROVER LEAVES THE LANDER", at: 2.9 },
          { text: "PATHFINDER DELIVERED SOJOURNER", at: 4.3 },
        ],
        flight: [
          { text: "FLIGHT 72 — CLIMBING TO 40 FEET", at: 0 },
          { text: "HOVERING 4.5 SECONDS", at: 1.6 },
          { text: "DESCENDING — THE GROUND LOOKS THE SAME", at: 3.2 },
          { text: "HARD LANDING — ROTOR DAMAGE", at: 4.8 },
          { text: "THE FLIGHT ENDED. THE KNOWLEDGE CONTINUED.", at: 6.4 },
        ],
      };
      const steps = sequences[id];
      if (!steps) return;
      gameRef.current.sequence = {
        id,
        steps,
        duration: steps[steps.length - 1].at + 2.4,
        t: 0,
      };
    };

    const interact = () => {
      const g = gameRef.current;
      if (g.view !== "play" || g.sequence) return;
      const target = nearestInteractable(g);
      if (!target) {
        toast("NOTHING TO INSPECT HERE", "Walk to a glowing marker, then press E.", "info", 2);
        return;
      }
      const open = () => {
        setOpenArtifact(target.artifactId);
        changeView("artifact");
      };
      if (target.kind === "artifact") {
        g.done.add(target.id);
        discoverArtifact(target.artifactId);
        burst(target.x, target.y - 20, "#ffe0a0", 18);
        open();
        return;
      }
      if (target.kind === "component") {
        g.done.add(target.id);
        if (!useMarsStore.getState().discoveredArtifacts.includes(target.artifactId)) {
          discoverArtifact(target.artifactId);
        }
        if (target.componentId) {
          inspectComponent(target.componentId);
          target.taken = true;
          burst(target.x, target.y, "#98e5c2", 14);
          const comp = ARTIFACT_BY_ID[target.artifactId]?.components.find(
            (c) => c.id === target.componentId,
          );
          if (comp?.action) {
            // Play the beat first so the player SEES what the part does,
            // then open the field notes.
            g.afterSequence = open;
            startSequence(comp.action);
            return;
          }
        }
        open();
        return;
      }
      if (target.kind === "evidence") {
        if (target.evidenceId) {
          target.taken = true;
          g.done.add(target.id);
          burst(target.x, target.y, "#fff0b8", 20);
          recoverEvidence(target.evidenceId);
          setOpenEvidence(target.evidenceId);
          changeView("evidence");
        }
        return;
      }
      if (target.kind === "archive") {
        g.done.add(target.id);
        setOpenArtifact(target.artifactId);
        changeView("archive");
      }
    };
    const ping = () => {
      const g = gameRef.current;
      if (g.view !== "play") return;
      let found = 0;
      g.world.interactables.forEach((i) => {
        if (i.kind === "evidence" && !i.taken && Math.abs(i.x - g.player.x) < 150) {
          i.pinged = true;
          found++;
        }
      });
      toast(
        found ? `RELAY PING — ${found} RECORD${found > 1 ? "S" : ""} NEARBY` : "RELAY PING — NOTHING WITHIN RANGE",
        found ? "Follow the glowing markers." : "Follow the guide arrow instead.",
        "info",
        2.2,
      );
    };
    gameRef.current.interact = interact;
    gameRef.current.ping = ping;

    const keyDown = (e: KeyboardEvent) => {
      const g = gameRef.current;
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Space",
          "KeyA",
          "KeyD",
          "KeyW",
          "KeyS",
          "ShiftLeft",
          "ShiftRight",
          "KeyE",
          "KeyQ",
          "KeyH",
          "Escape",
          "Enter",
        ].includes(e.code)
      )
        e.preventDefault();
      if (e.repeat) return;
      if (g.view === "play") g.keys[e.code] = true;
      if (["Space", "KeyW", "ArrowUp"].includes(e.code) && g.view === "play")
        g.jumpEdge = true;
      if (g.sequence && (e.code === "Space" || e.code === "KeyE")) {
        g.sequence = null;
        const after = g.afterSequence;
        g.afterSequence = null;
        after?.();
        return;
      }
      if (
        g.view === "respawn" &&
        (e.code === "Space" || e.code === "KeyE" || e.code === "Enter")
      ) {
        window.clearTimeout(g.respawnTimer);
        changeView("play");
        return;
      }
      if (e.code === "Escape" && g.view === "play") changeView("pause");
      else if (e.code === "Escape" && g.view === "pause") changeView("play");
      else if (e.code === "Escape" && (g.view === "artifact" || g.view === "archive")) {
        setOpenArtifact("");
        setOpenEvidence("");
        const back = g.returnView;
        g.returnView = "play";
        changeView(back);
      }
      if (e.code === "KeyE" && g.view === "play") interact();
      if (e.code === "KeyQ" && g.view === "play") ping();
    };
    const keyUp = (e: KeyboardEvent) => {
      gameRef.current.keys[e.code] = false;
    };
    const clearKeys = () => {
      gameRef.current.keys = {};
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("blur", clearKeys);

    const drawSprite = (
      name: string,
      x: number,
      y: number,
      size = 1,
      frame = 0,
      flip = false,
    ) => {
      const img = sprite(gameRef.current.imgs, name, frame);
      if (!img?.complete || !img.naturalWidth) return;
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      if (flip) {
        ctx.translate(Math.round(x * 2 + img.width * size), 0);
        ctx.scale(-1, 1);
        ctx.drawImage(
          img,
          Math.round(x),
          Math.round(y),
          img.width * size,
          img.height * size,
        );
      } else
        ctx.drawImage(
          img,
          Math.round(x),
          Math.round(y),
          img.width * size,
          img.height * size,
        );
      ctx.restore();
    };

    const render = () => {
      const g = gameRef.current,
        p = g.player,
        world = g.world;
      const dpr = Math.min(window.devicePixelRatio || 1, 2),
        scale = Math.min(canvas.width / W, canvas.height / H),
        ox = (canvas.width - W * scale) / 2,
        oy = (canvas.height - H * scale) / 2;
      ctx.setTransform(scale, 0, 0, scale, ox, oy);
      const colors = zoneColors[MISSIONS[g.level].zone];
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, colors[0]);
      sky.addColorStop(0.7, colors[1]);
      sky.addColorStop(1, colors[2]);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 70; i++) {
        const sx = (i * 83.13 - g.camera * 0.045 + W * 3) % W,
          sy = (i * 47.7) % 112;
        ctx.fillStyle = `rgba(255,245,230,${0.2 + 0.24 * Math.sin(g.time * 1.8 + i)})`;
        ctx.fillRect(sx, sy, 1, 1);
      }
      const sunX = 370 - g.camera * 0.02;
      const glow = ctx.createRadialGradient(sunX, 50, 1, sunX, 50, 35);
      glow.addColorStop(0, "#fff1cd");
      glow.addColorStop(1, "#ffd9a000");
      ctx.fillStyle = glow;
      ctx.fillRect(sunX - 38, 12, 76, 76);
      ctx.fillStyle = colors[2];
      for (let i = 0; i < 12; i++) {
        const x = ((i * 83 - g.camera * 0.17 + 1500) % 560) - 30;
        ctx.fillRect(x, 132 - ((i * 19) % 54), 56 + ((i * 29) % 48), 138);
      }
      ctx.fillStyle = "#321b25";
      ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.fillStyle = colors[3];
      ctx.fillRect(0, GROUND, W, 5);
      world.solids.forEach((s) => {
        const x = s.x - g.camera;
        if (x + s.w < 0 || x > W) return;
        ctx.fillStyle = s.oneWay ? "#9d6557" : colors[2];
        ctx.fillRect(x, s.y, s.w, s.h);
        ctx.fillStyle = s.oneWay ? "#efb279" : colors[3];
        ctx.fillRect(x, s.y, s.w, 3);
        ctx.fillStyle = "#48242a";
        for (let tx = x + 7; tx < x + s.w; tx += 17)
          ctx.fillRect(tx, s.y + 12, 3, 2);
      });
      for (let i = 0; i < world.length / 105; i++) {
        const x = i * 105 - g.camera + 23;
        if (x < -25 || x > W + 25) continue;
        drawSprite(i % 4 === 0 ? "cactus" : "rock", x, GROUND - 14, 1, i % 2);
      }
      world.checkpoints.forEach((x, i) =>
        drawSprite(
          i === 0 || g.checkpoint >= i ? "flag" : "sign",
          x - g.camera,
          GROUND - 21,
          1,
          0,
        ),
      );

      // --- Artifact landmarks, component markers, evidence and the terminal ---
      world.interactables.forEach((item) => {
        const sx = item.x - g.camera;
        if (sx < -70 || sx > W + 70) return;
        const known = useMarsStore
          .getState()
          .discoveredArtifacts.includes(item.artifactId);
        const pulse = 0.5 + 0.5 * Math.sin(g.time * 3 + item.x);

        if (item.kind === "artifact") {
          // Environmental framing: a soft halo, debris and a standing antenna.
          ctx.fillStyle = `rgba(255,220,170,${0.05 + 0.05 * pulse})`;
          ctx.beginPath();
          ctx.arc(sx, GROUND - 26, 46, 0, Math.PI * 2);
          ctx.fill();
          drawSprite(
            MISSIONS[g.level].sprite,
            sx - 22,
            GROUND - 40,
            3,
            Math.floor(g.time * 1.5) % 2,
          );
          drawSprite("antenna", sx + 26, GROUND - 26, 1, 0);
          drawSprite("rock", sx - 42, GROUND - 10, 1, 0);
          if (known) {
            ctx.strokeStyle = `rgba(200,240,210,${0.25 + 0.35 * pulse})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(sx - 34.5, GROUND - 46.5, 69, 47);
          }
          return;
        }

        if (item.kind === "component") {
          if (!known) return;
          drawSprite("cell", sx - 5, item.y - 4, 1, 0);
          ctx.strokeStyle = `rgba(255,214,140,${0.35 + 0.45 * pulse})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(sx - 7.5, item.y - 6.5, 15, 15);
          return;
        }

        if (item.kind === "evidence") {
          if (item.taken) return;
          const bob = Math.sin(g.time * 3 + item.x) * 2;
          if (item.air && !p.flying) {
            // An aerial waypoint only resolves while the player is flying.
            ctx.strokeStyle = `rgba(180,220,255,${0.2 + 0.3 * pulse})`;
            ctx.setLineDash([3, 3]);
            ctx.strokeRect(sx - 9.5, item.y - 9.5 + bob, 19, 19);
            ctx.setLineDash([]);
            return;
          }
          drawSprite(
            item.pinged || item.air ? "bit" : "shard",
            sx - 4,
            item.y - 6 + bob,
            1,
            Math.floor(g.time * 5) % 2,
          );
          ctx.strokeStyle = `rgba(255,236,180,${0.25 + 0.4 * pulse})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(sx - 6.5, item.y - 8.5 + bob, 13, 13);
          return;
        }

        if (item.kind === "archive") {
          drawSprite("antenna", sx - 9, item.y - 4, 1, 0);
          ctx.strokeStyle = `rgba(190,240,210,${0.3 + 0.4 * pulse})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(sx - 11.5, item.y - 6.5, 23, 23);
        }
      });

      const objState = computeObjectives(
        world,
        g.done,
        useMarsStore.getState().discoveredArtifacts,
        p.x,
      );
      const goalOpen = objState.required.length === 0;
      const gx = world.goalX - g.camera;
      if (gx > -40 && gx < W + 40) {
        const gp = 0.5 + 0.5 * Math.sin(g.time * 4);
        if (goalOpen) {
          // Open goal: a tall light beam and a pulsing ring.
          ctx.fillStyle = `rgba(255,224,160,${0.12 + 0.1 * gp})`;
          ctx.fillRect(gx + 4, 0, 16, GROUND);
          ctx.strokeStyle = `rgba(255,224,160,${0.5 + 0.4 * gp})`;
          ctx.strokeRect(gx - 6.5 - gp * 3, GROUND - 60.5 - gp * 3, 40 + gp * 6, 60 + gp * 6);
        } else {
          // Locked goal: a red barrier tells the player why they cannot pass.
          ctx.fillStyle = `rgba(255,120,100,${0.25 + 0.2 * gp})`;
          ctx.fillRect(gx - 10, GROUND - 70, 3, 70);
          ctx.fillStyle = "#ff927d";
          ctx.font = "bold 6px monospace";
          ctx.fillText("LOCKED", gx - 20, GROUND - 76);
        }
      }
      drawSprite(
        "goalpost",
        world.goalX - g.camera,
        GROUND - 28,
        2,
        Math.floor(g.time * 3) % 2,
      );
      const animName = !p.onGround
        ? p.vy < 0
          ? "curi_jump"
          : "curi_fall"
        : Math.abs(p.vx) > 8
          ? "curi_run"
          : "curi_idle";
      drawSprite(
        animName,
        p.x - g.camera,
        p.y,
        2,
        animName === "curi_run"
          ? Math.floor(g.time * 12) % 4
          : Math.floor(g.time * 1.6) % 2,
        p.facing < 0,
      );
      if (p.invulnerable > 0 && Math.floor(g.time * 18) % 2 === 0) {
        ctx.fillStyle = "#fff7";
        ctx.fillRect(p.x - g.camera - 2, p.y - 2, 28, 32);
      }

      // --- Effects ---
      for (const f of g.fx) {
        ctx.globalAlpha = Math.max(0, Math.min(1, f.life / f.max));
        ctx.fillStyle = f.color;
        ctx.fillRect(Math.round(f.x - g.camera), Math.round(f.y), 2, 2);
      }
      ctx.globalAlpha = 1;

      // --- Guide arrows: always point at what to do next ---
      if (g.view === "play" || g.view === "respawn") {
        const guide = goalOpen
          ? objState.archive && !g.done.has(objState.archive.id)
            ? { x: objState.archive.x, y: objState.archive.y, label: "OPTIONAL: RECOVERED RECORDS (E)" }
            : { x: world.goalX + 12, y: GROUND - 40, label: "FINISH HERE" }
          : objState.next
            ? { x: objState.next.x, y: objState.next.y, label: objState.next.text }
            : null;
        if (guide) {
          const gsx = guide.x - g.camera;
          const bounce = Math.sin(g.time * 6) * 3;
          const arrowColor = goalOpen ? "#ffe0a0" : "#98e5c2";
          ctx.fillStyle = arrowColor;
          if (gsx > 14 && gsx < W - 14) {
            const ay = Math.max(60, guide.y - 38) + bounce;
            ctx.beginPath();
            ctx.moveTo(gsx - 6, ay);
            ctx.lineTo(gsx + 6, ay);
            ctx.lineTo(gsx, ay + 9);
            ctx.closePath();
            ctx.fill();
            ctx.fillRect(gsx - 2, ay - 7, 4, 7);
          } else {
            const right = gsx >= W - 14;
            const ex = right ? W - 20 + bounce : 20 - bounce;
            const ey = 128;
            ctx.beginPath();
            if (right) {
              ctx.moveTo(ex - 8, ey - 8);
              ctx.lineTo(ex - 8, ey + 8);
              ctx.lineTo(ex + 4, ey);
            } else {
              ctx.moveTo(ex + 8, ey - 8);
              ctx.lineTo(ex + 8, ey + 8);
              ctx.lineTo(ex - 4, ey);
            }
            ctx.closePath();
            ctx.fill();
            ctx.font = "6px monospace";
            const dist = `${Math.round(Math.abs(guide.x - p.x) / 10)} m`;
            ctx.fillText(dist, right ? ex - 26 : ex - 4, ey + 17);
          }
        }
      }

      // --- HUD ---
      const nextText = goalOpen
        ? "ALL DONE — REACH THE GOAL FOR THE KNOWLEDGE CHECK"
        : (objState.next?.text ?? "");
      const totalTasks = world.interactables.filter(
        (i) => i.kind === "artifact" || i.kind === "component" || i.kind === "evidence",
      ).length;
      const countText = `${totalTasks - objState.required.length}/${totalTasks}`;
      if (nextText !== g.objective || countText !== g.objectiveCount) {
        g.objective = nextText;
        g.objectiveCount = countText;
        setHudObjective({ text: nextText, count: countText });
      }
      ctx.fillStyle = "#080b18c8";
      ctx.fillRect(10, 10, 300, 44);
      ctx.strokeStyle = goalOpen ? "#ffe0a0" : "#e4b771";
      ctx.strokeRect(10.5, 10.5, 299, 43);
      ctx.fillStyle = "#ffe0a0";
      ctx.font = "bold 8px monospace";
      ctx.fillText(
        `MISSION ${String(g.level + 1).padStart(2, "0")}/${MISSIONS.length}  //  ${MISSIONS[g.level].title}`,
        18,
        23,
      );
      ctx.fillStyle = "#fff";
      ctx.font = "7px monospace";
      ctx.fillText(`TASKS ${countText}    ${MISSIONS[g.level].zone.toUpperCase()}`, 18, 33);
      ctx.fillStyle = goalOpen ? "#ffe0a0" : "#98e5c2";
      ctx.font = "bold 7px monospace";
      ctx.fillText(`▶ ${nextText}`.slice(0, 58), 18, 46);
      ctx.fillStyle = "#080b18bb";
      ctx.fillRect(W - 115, 10, 104, 24);
      ctx.strokeStyle = "#ffffff44";
      ctx.strokeRect(W - 114.5, 10.5, 103, 23);
      ctx.fillStyle = "#c0e9d1";
      ctx.font = "7px monospace";
      ctx.fillText(
        g.touch
          ? g.level >= 6
            ? "◀ ▶ WALK · FLY BUTTON"
            : "◀ ▶ WALK · JUMP"
          : g.level >= 6
            ? "A/D WALK · H FLY"
            : g.level >= 3
              ? "SPACE JUMP · MID-AIR BOUNCE"
              : "A/D WALK · SPACE JUMP",
        W - 108,
        20,
      );
      ctx.fillText(
        g.touch
          ? "INSPECT BUTTON · PAUSE"
          : g.level >= 1
            ? "Q RELAY · E INSPECT · ESC"
            : "E INSPECT · ESC PAUSE",
        W - 108,
        30,
      );
      if (g.level >= 6) {
        ctx.fillStyle = "#080b18b8";
        ctx.fillRect(W - 114, 39, 102, 5);
        ctx.fillStyle = p.battery > 25 ? "#b6e5ff" : "#ff927d";
        ctx.fillRect(W - 113, 40, Math.max(0, p.battery), 3);
      }

      // --- Contextual interaction prompt ---
      const target = g.view === "play" ? nearestInteractable(g) : null;
      const promptKey = target
        ? `${target.id}:${target.label}:${target.verb}:${
            useMarsStore.getState().discoveredArtifacts.includes(target.artifactId)
          }`
        : "";
      if (promptKey !== g.prompt) {
        g.prompt = promptKey;
        setLivePrompt(
          target
            ? `${target.label}. Press E to ${target.verb.toLowerCase()}.`
            : "",
        );
      }
      if (target) {
        const knownNow = useMarsStore
          .getState()
          .discoveredArtifacts.includes(target.artifactId);
        const label =
          target.kind === "artifact" && !knownNow
            ? target.unknownLabel
            : target.label;
        const bx = Math.max(6, Math.min(W - 214, target.x - g.camera - 100));
        const by = Math.max(64, target.y - 44);
        ctx.fillStyle = "#080b18e0";
        ctx.fillRect(bx, by, 208, 30);
        ctx.strokeStyle = "#ffd9a0";
        ctx.strokeRect(bx + 0.5, by + 0.5, 207, 29);
        ctx.fillStyle = "#ffe0a0";
        ctx.font = "bold 7px monospace";
        ctx.fillText(label.slice(0, 32), bx + 8, by + 12);
        ctx.fillStyle = "#c0e9d1";
        ctx.font = "7px monospace";
        ctx.fillText(`E  ${target.verb}`, bx + 8, by + 24);
      }

      // --- Toast: explains what just happened and why ---
      if (g.toast) {
        const t = g.toast;
        const tw = 250,
          tx = (W - tw) / 2,
          ty = 60;
        const warn = t.kind === "locked";
        ctx.globalAlpha = Math.min(1, t.t * 2);
        ctx.fillStyle = "#080b18ec";
        ctx.fillRect(tx, ty, tw, 26);
        ctx.strokeStyle = warn ? "#ff927d" : t.kind === "checkpoint" ? "#98e5c2" : "#ffd9a0";
        ctx.strokeRect(tx + 0.5, ty + 0.5, tw - 1, 25);
        ctx.fillStyle = warn ? "#ff927d" : "#ffe0a0";
        ctx.font = "bold 7px monospace";
        ctx.fillText(t.text.slice(0, 44), tx + 8, ty + 11);
        ctx.fillStyle = "#c0e9d1";
        ctx.font = "6px monospace";
        ctx.fillText(t.sub.slice(0, 54), tx + 8, ty + 21);
        ctx.globalAlpha = 1;
      }

      // --- Playable beats ---
      if (g.sequence) {
        const seq = g.sequence;
        const step =
          [...seq.steps].reverse().find((s) => seq.t >= s.at) ?? seq.steps[0];
        ctx.fillStyle = "#080b18e6";
        ctx.fillRect(40, H - 46, W - 80, 28);
        ctx.strokeStyle = "#ffd9a0";
        ctx.strokeRect(40.5, H - 45.5, W - 81, 27);
        ctx.fillStyle = "#ffe0a0";
        ctx.font = "bold 8px monospace";
        ctx.fillText(step.text, 52, H - 28);

        const anchor = world.interactables.find((i) => i.kind === "artifact");
        const ax = (anchor?.x ?? 0) - g.camera;
        if (seq.id === "sample" && ax > -60 && ax < W + 60) {
          const reach = Math.min(1, seq.t / 1.6);
          ctx.strokeStyle = "#e8d5b0";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ax + 18, GROUND - 34);
          ctx.lineTo(ax + 18 + reach * 26, GROUND - 34 + reach * 22);
          ctx.stroke();
          if (seq.t > 1.1)
            drawSprite("shard", ax + 42, GROUND - 14, 1, 0);
        }
        if (seq.id === "deploy" && ax > -60 && ax < W + 60) {
          ctx.strokeStyle = "#d8c39a";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ax + 16, GROUND - 26);
          ctx.lineTo(ax + 44, GROUND - 6);
          ctx.stroke();
          const roll = Math.min(1, Math.max(0, (seq.t - 1.3) / 1.8));
          drawSprite("sojourner", ax + 40 + roll * 58, GROUND - 10 - roll * 2, 1, 0);
        }
        if (seq.id === "flight" && ax > -60 && ax < W + 60) {
          const up = Math.min(1, seq.t / 1.6);
          const down = Math.max(0, Math.min(1, (seq.t - 3.2) / 2));
          const height = 34 * up - 30 * down * down;
          drawSprite("coper_idle", ax - 10, GROUND - 40 - height, 2, 0);
          if (seq.t > 4.8) {
            ctx.strokeStyle = "#ff927d";
            ctx.lineWidth = 1;
            ctx.strokeRect(ax - 18.5, GROUND - 26.5, 40, 26);
          }
        }
        ctx.fillStyle = "#ffffff88";
        ctx.font = "6px monospace";
        ctx.fillText("SPACE / E — SKIP", W - 96, H - 18);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const die = () => {
      const g = gameRef.current;
      g.deaths++;
      setDeaths(g.deaths);
      addFall();
      const cpIndex = g.checkpoint;
      const cp = g.world.checkpoints[cpIndex] ?? 0;
      const spawn = safeSpawn(g.world, cp);
      // Effect where the rover was lost, and where it reappears.
      burst(g.player.x + 9, H - 18, "#ff927d", 14);
      g.player = {
        x: spawn.x,
        y: spawn.y,
        vx: 0,
        vy: 0,
        onGround: false,
        coyote: 0,
        jumpBuffer: 0,
        facing: 1,
        frame: 0,
        invulnerable: 2,
        bounced: false,
        flying: false,
        battery: 100,
      };
      g.camera = Math.max(0, spawn.x - 120);
      burst(spawn.x + 9, spawn.y + 12, "#98e5c2", 26);
      setRespawnInfo({
        cause: "CURI-7 FELL OFF THE EDGE OF THE TERRAIN",
        where: CHECKPOINT_NAMES[cpIndex] ?? "THE LAST BEACON",
        metres: Math.round(spawn.x / 10),
        falls: g.deaths,
      });
      changeView("respawn");
      window.clearTimeout(g.respawnTimer);
      g.respawnTimer = window.setTimeout(() => {
        if (gameRef.current.view === "respawn") changeView("play");
      }, 4200);
    };

    const update = (dt: number) => {
      const g = gameRef.current,
        p = g.player,
        world = g.world,
        keys = g.keys;
      g.time += dt;
      for (const f of g.fx) {
        f.life -= dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.vy += 120 * dt;
      }
      g.fx = g.fx.filter((f) => f.life > 0);
      if (g.toast) {
        g.toast.t -= dt;
        if (g.toast.t <= 0) g.toast = null;
      }

      if (g.sequence) {
        g.sequence.t += dt;
        if (g.sequence.t >= g.sequence.duration) {
          g.sequence = null;
          const after = g.afterSequence;
          g.afterSequence = null;
          after?.();
        }
        render();
        return;
      }
      if (g.view !== "play") {
        render();
        return;
      }
      const left = !!(keys.ArrowLeft || keys.KeyA),
        right = !!(keys.ArrowRight || keys.KeyD),
        dir = (right ? 1 : 0) - (left ? 1 : 0),
        run = !!(keys.ShiftLeft || keys.ShiftRight),
        flightInput = g.level >= 6 && !!keys.KeyH && p.battery > 0;
      if (g.jumpEdge) {
        p.jumpBuffer = 0.14;
        g.jumpEdge = false;
      } else p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
      p.coyote = p.onGround ? 0.105 : Math.max(0, p.coyote - dt);
      const speed = flightInput ? 96 : run ? 145 : 105,
        accel = flightInput ? 520 : p.onGround ? 830 : 590;
      if (dir) {
        p.vx += dir * accel * dt;
        p.vx = Math.max(-speed, Math.min(speed, p.vx));
        p.facing = dir;
      } else p.vx *= Math.max(0, 1 - (p.onGround ? 11 : 3.5) * dt);
      if (p.jumpBuffer > 0) {
        if (p.onGround || p.coyote > 0) {
          p.vy = -350;
          p.onGround = false;
          p.coyote = 0;
          p.bounced = false;
          p.jumpBuffer = 0;
        } else if (g.level >= 3 && !p.bounced && !p.flying) {
          p.vy = -392;
          p.bounced = true;
          p.jumpBuffer = 0;
        }
      }
      p.flying = flightInput;
      if (p.flying) {
        p.battery = Math.max(0, p.battery - 18 * dt);
        p.vy = Math.max(-145, p.vy - 390 * dt);
      } else {
        p.vy = Math.min(560, p.vy + 950 * dt);
        if (p.battery < 100)
          p.battery = Math.min(100, p.battery + (p.onGround ? 22 : 5) * dt);
      }
      p.invulnerable = Math.max(0, p.invulnerable - dt);
      const prevY = p.y;
      p.x += p.vx * dt;
      for (const s of world.solids) {
        if (s.oneWay) continue;
        if (
          p.x + 19 > s.x &&
          p.x < s.x + s.w &&
          p.y + 25 > s.y &&
          p.y < s.y + s.h
        ) {
          if (p.vx > 0) p.x = s.x - 19;
          else if (p.vx < 0) p.x = s.x + s.w;
          p.vx = 0;
        }
      }
      p.y += p.vy * dt;
      p.onGround = false;
      for (const s of world.solids) {
        if (p.x + 18 <= s.x || p.x >= s.x + s.w) continue;
        const crossed = prevY + 25 <= s.y + 2 && p.y + 25 >= s.y;
        if (crossed && p.vy >= 0 && (!s.oneWay || prevY + 25 <= s.y + 3)) {
          p.y = s.y - 25;
          p.vy = 0;
          p.onGround = true;
          p.bounced = false;
        }
      }
      if (p.y > H + 45) {
        die();
        return;
      }
      world.checkpoints.forEach((x, i) => {
        if (p.x > x && i > g.checkpoint) {
          g.checkpoint = i;
          burst(x + 6, GROUND - 20, "#98e5c2", 22);
          toast(
            "CHECKPOINT SAVED",
            "If you fall, CURI-7 is sent back to this beacon.",
            "checkpoint",
            4,
          );
        }
      });
      world.interactables.forEach((item) => {
        if (item.taken || item.kind !== "evidence") return;
        if (item.air && !p.flying) return;
        if (Math.abs(p.x + 9 - item.x) < 17 && Math.abs(p.y + 12 - item.y) < 30) {
          item.taken = true;
          g.done.add(item.id);
          burst(item.x, item.y, "#fff0b8", 20);
          if (item.evidenceId) {
            recoverEvidence(item.evidenceId);
            setOpenEvidence(item.evidenceId);
            changeView("evidence");
          }
        }
      });
      const target = Math.max(
        0,
        Math.min(world.length - W, p.x - W * 0.38 + p.facing * 18),
      );
      g.camera += (target - g.camera) * (1 - Math.pow(0.002, dt));
      g.camera = Math.max(0, Math.min(world.length - W, g.camera));
      if (p.x > world.goalX - 12) {
        p.x = world.goalX - 12;
        p.vx = 0;
        const left = computeObjectives(
          world,
          g.done,
          useMarsStore.getState().discoveredArtifacts,
          p.x,
        );
        if (left.required.length === 0) {
          burst(world.goalX, GROUND - 30, "#ffe0a0", 30);
          changeView("quiz");
        } else if (g.toast?.kind !== "locked") {
          toast(
            `GOAL LOCKED — ${left.required.length} TASK${left.required.length > 1 ? "S" : ""} LEFT`,
            `Next: ${left.next?.text ?? ""}`,
            "locked",
            3,
          );
        }
      }
      render();
    };

    const loop = (now: number) => {
      const g = gameRef.current;
      if (!g.last) g.last = now;
      const dt = Math.min(0.05, (now - g.last) / 1000);
      g.last = now;
      if (g.view === "play" || g.sequence) {
        g.accumulator += dt;
        let n = 0;
        while (g.accumulator >= STEP && n < 5) {
          update(STEP);
          g.accumulator -= STEP;
          n++;
          if (g.view !== "play" && !g.sequence) break;
        }
      } else render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", clearKeys);
    };
  }, [
    changeView,
    discoverArtifact,
    inspectComponent,
    recoverEvidence,
    setDeaths,
    addFall,
  ]);

  // Evidence recovered inside the current artifact drives the HUD counter.
  useEffect(() => {
    const ids = ARTIFACT_BY_ID[MISSIONS[level].artifactId]?.evidence.map(
      (e) => e.id,
    );
    const count = ids
      ? ids.filter((id) => recovered.includes(id)).length
      : 0;
    gameRef.current.got = count;
    setCollected(count);
  }, [recovered, level, setCollected]);

  const advance = () => {
    if (level === MISSIONS.length - 1) changeView("complete");
    else {
      resetMission(level + 1);
      changeView("brief");
    }
  };

  const openArchiveFor = (artifactId: string) => {
    gameRef.current.returnView = view === "complete" ? "complete" : "play";
    setOpenArtifact(artifactId);
    changeView("archive");
  };

  const closeOverlay = () => {
    const g = gameRef.current;
    const back = g.returnView;
    g.returnView = "play";
    setOpenArtifact("");
    setOpenEvidence("");
    changeView(back);
  };

  const buttonKey = (code: string, down: boolean) => {
    gameRef.current.keys[code] = down;
    if (down && ["Space", "KeyW", "ArrowUp"].includes(code))
      gameRef.current.jumpEdge = true;
  };

  const evidenceFragment = openEvidence
    ? Object.values(ARTIFACT_BY_ID)
        .flatMap((a) => a.evidence)
        .find((e) => e.id === openEvidence)
    : undefined;
  const evidenceIndex = evidenceFragment
    ? ARTIFACT_BY_ID[evidenceFragment.artifactId].evidence.findIndex(
        (e) => e.id === evidenceFragment.id,
      ) + 1
    : 0;

  return (
    <div className="mars-shell" data-zone={mission.zone}>
      <canvas
        ref={canvasRef}
        className="mars-canvas"
        aria-label="Mars platform simulation"
      />
      <div className="mars-grain" aria-hidden="true" />
      <p className="mars-sr-only" aria-live="polite">
        {livePrompt || hudObjective.text}
      </p>
      <header className="mars-top">
        <div className="mars-mark">
          <span className="mars-mark-icon">M</span>
          <span>
            OFF-WORLD <small>// FIELD SIMULATION</small>
          </span>
        </div>
        <div className="mars-top-status">
          <i /> LIVE TERRAIN MODEL <b>·</b> {mission.zone.toUpperCase()}
        </div>
        <button className="mars-exit" onClick={onExit}>
          RETURN TO VOYAGER <span>↗</span>
        </button>
      </header>

      {view !== "play" && (
      <section
        className={`mars-panel${view === "complete" ? " mars-panel-wide" : ""}`}
        aria-live="polite"
      >
        {view === "brief" && (
          <>
            <SceneTitle
              className="mars-mission-title"
              kicker={`MISSION ${String(level + 1).padStart(2, "0")} · ${mission.zone.toUpperCase()}`}
              title={mission.title}
              subtitle={mission.subtitle}
            />
            <p>{mission.briefing}</p>
            <p className="mars-brief-purpose">{mission.purpose}</p>
            <ol className="mars-tasks">
              <li>
                <b>1</b> Walk right. A guide arrow always points to your next
                task.
              </li>
              <li>
                <b>2</b> Press <b>E</b> (or the INSPECT button) at glowing
                markers to inspect machine parts. Records are collected by
                touching them.
              </li>
              <li>
                <b>3</b> Finish every task to unlock the goal at the end of the
                terrain.
              </li>
              <li>
                <b>4</b> Answer one question. A wrong answer is simply
                explained — you move on.
              </li>
            </ol>
            <div className="mars-help">
              <span>
                <b>A / D</b> WALK
              </span>
              <span>
                <b>SPACE / W</b> JUMP
              </span>
              <span>
                <b>SHIFT</b> SPRINT
              </span>
              <span>
                <b>E</b> INSPECT
              </span>
              <span>
                <b>Q</b> RELAY PING
              </span>
              {level >= 6 && (
                <span>
                  <b>H</b> FLIGHT MODE
                </span>
              )}
            </div>
            <button className="mars-primary" onClick={() => changeView("play")}>
              DROP INTO THE SIMULATION <span>→</span>
            </button>
          </>
        )}
        {view === "quiz" && (
          <>
            <p className="mars-eyebrow">
              KNOWLEDGE CHECK · {artifact?.name} · PROVE YOU UNDERSTOOD IT
            </p>
            <h1>{mission.target}</h1>
            <h2>{mission.check.question}</h2>
            <div className="mars-answers">
              {mission.check.answers.map((answer, i) => (
                <button
                  key={answer}
                  onClick={() => {
                    const right = i === mission.check.correct;
                    setChosen(i);
                    setQuizResult(right);
                    setCheckResult(level, right);
                    completeCheck(`mission-${level}`);
                    if (mission.archives) completeArtifact(mission.artifactId);
                    changeView("result");
                  }}
                >
                  <span>0{i + 1}</span>
                  {answer}
                </button>
              ))}
            </div>
          </>
        )}
        {view === "result" && (
          <>
            <p className="mars-eyebrow">
              {quizResult ? "CORRECT" : "INCORRECT"} · MISSION{" "}
              {String(level + 1).padStart(2, "0")} OF {MISSIONS.length}
            </p>
            <h1>
              {quizResult ? "THE MACHINE MAKES SENSE" : "THAT ANSWER IS WRONG"}
            </h1>
            {!quizResult && (
              <p className="mars-wrong-note">
                You chose: “{mission.check.answers[chosen] ?? "—"}”. The
                correct answer: “{mission.check.answers[mission.check.correct]}”.
              </p>
            )}
            <p>{mission.check.explanation}</p>
            {mission.archives && (
              <p className="mars-archive-unlocked">
                ARCHIVE ENTRY UNLOCKED · {artifact?.name} · {artifact?.era} ·{" "}
                {artifact?.type}
              </p>
            )}
            <div className="mars-score">
              EVIDENCE RECOVERED <b>{collected} / {artifact?.evidence.length ?? 6}</b>
              <span> · </span> FALLS <b>{deaths}</b>
            </div>
            <button className="mars-primary" onClick={advance} autoFocus>
              {level === MISSIONS.length - 1
                ? "FINISH THE SIMULATION →"
                : "NEXT MISSION →"}
            </button>
          </>
        )}
        {view === "pause" && (
          <>
            <p className="mars-eyebrow">SIMULATION PAUSED</p>
            <h1>HOLD POSITION</h1>
            <p>
              The terrain is waiting. Take a breath, then continue your
              traverse.
            </p>
            <button className="mars-primary" onClick={() => changeView("play")}>
              RESUME MISSION
            </button>
            <button
              className="mars-secondary"
              onClick={() => changeView("brief")}
            >
              RESTART BRIEFING
            </button>
          </>
        )}
        {view === "respawn" && (
          <div className="mars-respawn">
            <span className="mars-spinner" />
            <p>TELEPORTED BACK TO {respawnInfo?.where ?? "THE LAST BEACON"}</p>
            <b>WHY: {respawnInfo?.cause ?? "CURI-7 LEFT THE TERRAIN"}</b>
            <span className="mars-respawn-detail">
              WHERE: {respawnInfo?.metres ?? 0} m along the route · FALLS THIS
              MISSION: {respawnInfo?.falls ?? 0}
            </span>
            <span className="mars-respawn-detail">
              Nothing is lost — every record and machine part you found is kept.
              Watch the gaps between platforms.
            </span>
            <button
              className="mars-primary"
              onClick={() => {
                window.clearTimeout(gameRef.current.respawnTimer);
                changeView("play");
              }}
              autoFocus
            >
              CONTINUE <span>→</span>
            </button>
          </div>
        )}
        {view === "complete" && (
          <MarsArchive
            onExit={onExit}
            onReplay={() => {
              useMarsStore.getState().resetAll();
              resetMission(0);
              changeView("brief");
            }}
            onOpenArtifact={openArchiveFor}
            missionCount={MISSIONS.length}
            checkResults={checkResults}
            totalFalls={totalFalls}
          />
        )}
      </section>
      )}

      {view === "artifact" && openArtifact && (
        <ArtifactPanel
          artifactId={openArtifact}
          onClose={closeOverlay}
          onOpenArchive={() => changeView("archive")}
        />
      )}

      {view === "archive" && openArtifact && (
        <ArchiveViewer
          artifactId={openArtifact}
          onOpenRecord={(recordId) => unlockArchive(recordId)}
          onClose={closeOverlay}
        />
      )}

      {view === "evidence" && evidenceFragment && (
        <EvidenceCard
          fragment={evidenceFragment}
          index={evidenceIndex}
          total={ARTIFACT_BY_ID[evidenceFragment.artifactId].evidence.length}
          onClose={() => {
            setOpenEvidence("");
            changeView("play");
          }}
        />
      )}

      {view === "play" && isTouch && (
        <div className="mars-touch" aria-label="Touch controls">
          <div className="mars-touch-extra">
            {level >= 1 && (
              <button
                className="mars-touch-small"
                onPointerDown={(e) => {
                  e.preventDefault();
                  gameRef.current.ping();
                }}
              >
                PING
              </button>
            )}
            {level >= 6 && (
              <button
                className="mars-touch-small mars-touch-fly"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  buttonKey("KeyH", true);
                }}
                onPointerUp={() => buttonKey("KeyH", false)}
                onPointerCancel={() => buttonKey("KeyH", false)}
              >
                FLY
              </button>
            )}
          </div>
          <button
            aria-label="Walk left"
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              buttonKey("ArrowLeft", true);
            }}
            onPointerUp={() => buttonKey("ArrowLeft", false)}
            onPointerCancel={() => buttonKey("ArrowLeft", false)}
          >
            ◀
          </button>
          <button
            aria-label="Walk right"
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              buttonKey("ArrowRight", true);
            }}
            onPointerUp={() => buttonKey("ArrowRight", false)}
            onPointerCancel={() => buttonKey("ArrowRight", false)}
          >
            ▶
          </button>
          <button
            className="mars-touch-jump"
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              buttonKey("Space", true);
            }}
            onPointerUp={() => buttonKey("Space", false)}
            onPointerCancel={() => buttonKey("Space", false)}
          >
            JUMP
          </button>
          <button
            className="mars-touch-inspect"
            onPointerDown={(e) => {
              e.preventDefault();
              gameRef.current.interact();
            }}
          >
            INSPECT
          </button>
        </div>
      )}
      {(view === "brief" || view === "complete") && (
        <div
          className="mars-transition"
          key={view === "brief" ? `arrival-${level}` : view}
          aria-hidden="true"
        />
      )}
      <div className="mars-bottom">
        <span>
          <i className="mars-led" /> TELEMETRY STREAMING
        </span>
        <span>ARCADIA PLANITIA · 46°N 193°E</span>
        {(view === "play" || view === "pause") && (
          <button
            onClick={() =>
              view === "play" ? changeView("pause") : changeView("play")
            }
          >
            {view === "play" ? "PAUSE · ESC" : "RESUME · ESC"}
          </button>
        )}
      </div>
    </div>
  );
}

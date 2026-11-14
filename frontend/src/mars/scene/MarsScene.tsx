import { useCallback, useEffect, useRef } from "react";
import "../styles/mars.css";
import { MISSIONS } from "../story/missions";
import { useMarsStore } from "../state/store";
import type { MarsView } from "../state/store";

type Platform = {
  x: number;
  y: number;
  w: number;
  h: number;
  oneWay?: boolean;
};
type World = {
  solids: Platform[];
  length: number;
  goalX: number;
  checkpoints: number[];
  shards: { x: number; y: number; got: boolean; hidden?: boolean }[];
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
  const shards = Array.from({ length: 8 }, (_, i) => ({
    x: 125 + i * ((length - 260) / 8),
    y: index === 1 ? GROUND + 20 : 184 - (i % 3) * 25,
    got: false,
    hidden: index === 1,
  }));
  return {
    solids,
    length,
    goalX: length - 90,
    checkpoints: [0, Math.floor(length * 0.48)],
    shards,
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
    bits: 0,
    got: 0,
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
  const mission = MISSIONS[level];
  const changeView = useCallback((next: MarsView) => {
    gameRef.current.view = next;
    setView(next);
  }, []);

  const resetMission = useCallback(
    (idx: number) => {
      const g = gameRef.current;
      g.level = idx;
      g.world = buildWorld(idx);
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
      g.world.shards.forEach((s) => {
        s.got = false;
      });
      setLevel(idx);
      setDeaths(0);
      setCollected(0);
      setQuizResult(false);
      changeView("play");
    },
    [changeView],
  );

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
    const keyDown = (e: KeyboardEvent) => {
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "Space",
          "KeyA",
          "KeyD",
          "KeyW",
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
      gameRef.current.keys[e.code] = true;
      if (["Space", "KeyW", "ArrowUp"].includes(e.code))
        gameRef.current.jumpEdge = true;
      if (e.code === "Escape" && gameRef.current.view === "play")
        changeView("pause");
      else if (e.code === "Escape" && gameRef.current.view === "pause")
        changeView("play");
      if (e.code === "KeyE" && gameRef.current.view === "play") {
        const g = gameRef.current;
        if (Math.abs(g.player.x - (g.world.goalX - 16)) < 38)
          changeView("quiz");
        else if (g.level === 1) {
          const nearest = g.world.shards.find(
            (s) => s.hidden && !s.got && Math.abs(s.x - g.player.x) < 26,
          );
          if (nearest) {
            nearest.hidden = false;
            nearest.y = GROUND - 20;
          }
        }
      }
      if (e.code === "KeyQ" && gameRef.current.view === "play")
        gameRef.current.world.shards.forEach((s) => {
          if (Math.abs(s.x - gameRef.current.player.x) < 150 && s.hidden) {
            s.hidden = false;
            s.y = Math.min(s.y, 170);
          }
        });
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
      world.shards.forEach((s) => {
        if (s.got || s.hidden) return;
        const bob = Math.sin(g.time * 3 + s.x) * 3;
        drawSprite(
          "shard",
          s.x - g.camera,
          s.y + bob,
          1,
          Math.floor(g.time * 5) % 2,
        );
      });
      drawSprite(
        "goalpost",
        world.goalX - g.camera,
        GROUND - 28,
        2,
        Math.floor(g.time * 3) % 2,
      );
      drawSprite(
        MISSIONS[g.level].sprite,
        world.goalX + 42 - g.camera,
        GROUND - 19,
        2,
        Math.floor(g.time * 2) % 2,
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
      ctx.fillStyle = "#080b18b8";
      ctx.fillRect(10, 10, 258, 31);
      ctx.strokeStyle = "#e4b771";
      ctx.strokeRect(10.5, 10.5, 257, 30);
      ctx.fillStyle = "#ffe0a0";
      ctx.font = "bold 8px monospace";
      ctx.fillText(
        `MISSION ${String(g.level + 1).padStart(2, "0")}  //  ${MISSIONS[g.level].title}`,
        18,
        23,
      );
      ctx.fillStyle = "#fff";
      ctx.font = "7px monospace";
      ctx.fillText(
        `MEMORIES ${g.got}/${world.shards.length}     ${MISSIONS[g.level].zone.toUpperCase()}`,
        18,
        34,
      );
      ctx.fillStyle = "#080b18bb";
      ctx.fillRect(W - 115, 10, 104, 24);
      ctx.strokeStyle = "#ffffff44";
      ctx.strokeRect(W - 114.5, 10.5, 103, 23);
      ctx.fillStyle = "#c0e9d1";
      ctx.font = "7px monospace";
      ctx.fillText(
        g.level >= 6
          ? "A/D WALK · H FLY"
          : g.level >= 3
            ? "SPACE JUMP · MID-AIR BOUNCE"
            : "A/D WALK · SPACE JUMP",
        W - 108,
        20,
      );
      ctx.fillText(
        g.level >= 1 ? "Q RELAY · E DIG · ESC" : "E INTERACT · ESC PAUSE",
        W - 108,
        30,
      );
      if (g.level >= 6) {
        ctx.fillStyle = "#080b18b8";
        ctx.fillRect(W - 114, 39, 102, 5);
        ctx.fillStyle = p.battery > 25 ? "#b6e5ff" : "#ff927d";
        ctx.fillRect(W - 113, 40, Math.max(0, p.battery), 3);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const die = () => {
      const g = gameRef.current;
      g.deaths++;
      setDeaths(g.deaths);
      if (g.deaths >= 3) {
        changeView("gameover");
        return;
      }
      const cp = g.world.checkpoints[g.checkpoint] ?? 0;
      g.player = {
        x: cp + 8,
        y: 160,
        vx: 0,
        vy: 0,
        onGround: false,
        coyote: 0,
        jumpBuffer: 0,
        facing: 1,
        frame: 0,
        invulnerable: 1.4,
        bounced: false,
        flying: false,
        battery: 100,
      };
      g.camera = Math.max(0, cp - 100);
      changeView("respawn");
      window.setTimeout(() => {
        if (gameRef.current.view === "respawn") changeView("play");
      }, 850);
    };
    const update = (dt: number) => {
      const g = gameRef.current,
        p = g.player,
        world = g.world,
        keys = g.keys;
      g.time += dt;
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
        if (p.x > x && i > g.checkpoint) g.checkpoint = i;
      });
      world.shards.forEach((s) => {
        if (!s.got && Math.abs(p.x - s.x) < 17 && Math.abs(p.y - s.y) < 28) {
          s.got = true;
          g.got++;
          setCollected(g.got);
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
        changeView("quiz");
      }
      render();
    };
    const loop = (now: number) => {
      const g = gameRef.current;
      if (!g.last) g.last = now;
      let dt = Math.min(0.05, (now - g.last) / 1000);
      g.last = now;
      if (g.view === "play") {
        g.accumulator += dt;
        let n = 0;
        while (g.accumulator >= STEP && n < 5) {
          update(STEP);
          g.accumulator -= STEP;
          n++;
          if (g.view !== "play") break;
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
  }, [changeView]);

  const advance = () => {
    if (level === MISSIONS.length - 1) changeView("complete");
    else {
      resetMission(level + 1);
      changeView("brief");
    }
  };
  const buttonKey = (code: string, down: boolean) => {
    gameRef.current.keys[code] = down;
    if (down && ["Space", "KeyW", "ArrowUp"].includes(code))
      gameRef.current.jumpEdge = true;
  };
  return (
    <div className="mars-shell" data-zone={mission.zone}>
      <canvas
        ref={canvasRef}
        className="mars-canvas"
        aria-label="Mars platform simulation"
      />
      <div className="mars-grain" aria-hidden="true" />
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
      <section
        className={`mars-panel ${view === "play" ? "mars-panel-playing" : ""}`}
        aria-live="polite"
      >
        {view === "brief" && (
          <>
            <p className="mars-eyebrow">{`MISSION ${String(level + 1).padStart(2, "0")} · ${mission.zone.toUpperCase()}`}</p>
            <h1>{mission.title}</h1>
            <h2>{mission.subtitle}</h2>
            <p>{mission.briefing}</p>
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
                <b>E</b> INTERACT
              </span>
              <span>
                <b>Q</b> RELAY PING
              </span>
            </div>
            <button className="mars-primary" onClick={() => changeView("play")}>
              DROP INTO THE SIMULATION <span>→</span>
            </button>
          </>
        )}
        {view === "quiz" && (
          <>
            <p className="mars-eyebrow">
              MISSION OBJECTIVE REACHED · ARCHIVE CHECK
            </p>
            <h1>{mission.target}</h1>
            <h2>{mission.quiz}</h2>
            <div className="mars-answers">
              {mission.answers.map((answer, i) => (
                <button
                  key={answer}
                  onClick={() => {
                    setQuizResult(i === mission.correct);
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
              {quizResult ? "ARCHIVE MATCH CONFIRMED" : "ARCHIVE NOTE"}
            </p>
            <h1>{quizResult ? "MEMORY RECOVERED" : "FIELD NOTE"}</h1>
            <p>{mission.fact}</p>
            <div className="mars-score">
              MEMORIES RECOVERED <b>{collected} / 8</b>
              <span> · </span> FALLS <b>{deaths}/3</b>
            </div>
            <button className="mars-primary" onClick={advance}>
              {level === MISSIONS.length - 1
                ? "COMPLETE THE MISSION →"
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
            <p>ROVER LINK REACQUIRED</p>
            <b>RESTORING CHECKPOINT…</b>
          </div>
        )}
        {view === "gameover" && (
          <>
            <p className="mars-eyebrow">ROVER LINK LOST</p>
            <h1>MISSION INTERRUPTED</h1>
            <p>
              CURI-7 is ready to try again. The archive keeps your story moving.
            </p>
            <button
              className="mars-primary"
              onClick={() => resetMission(level)}
            >
              REPLAY THIS MISSION ↻
            </button>
            <button className="mars-secondary" onClick={onExit}>
              RETURN TO VOYAGER
            </button>
          </>
        )}
        {view === "complete" && (
          <>
            <p className="mars-eyebrow">NINE MISSIONS · THREE WITNESSES</p>
            <h1>THE RED PLANET REMEMBERS</h1>
            <p>
              You reached the archive. Viking, Pathfinder, Sojourner and
              Ingenuity have left their stories in the dust.
            </p>
            <div className="mars-score">
              MEMORIES RECOVERED <b>{collected} / 8</b>
            </div>
            <button className="mars-primary" onClick={onExit}>
              RETURN TO VOYAGER
            </button>
            <button
              className="mars-secondary"
              onClick={() => {
                resetMission(0);
                changeView("brief");
              }}
            >
              REPLAY THE SIMULATION ↻
            </button>
          </>
        )}
      </section>
      {view === "play" && (
        <div className="mars-touch" aria-label="Touch controls">
          <button
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              buttonKey("ArrowLeft", true);
            }}
            onPointerUp={() => buttonKey("ArrowLeft", false)}
          >
            ◀
          </button>
          <button
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              buttonKey("ArrowRight", true);
            }}
            onPointerUp={() => buttonKey("ArrowRight", false)}
          >
            ▶
          </button>
          <button
            className="mars-touch-jump"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              buttonKey("Space", true);
            }}
            onPointerUp={() => buttonKey("Space", false)}
          >
            JUMP
          </button>
        </div>
      )}
      <div
        className="mars-transition"
        key={view === "brief" ? "arrival" : view}
        aria-hidden="true"
      />
      <div className="mars-bottom">
        <span>
          <i className="mars-led" /> TELEMETRY STREAMING
        </span>
        <span>ARCADIA PLANITIA · 46°N 193°E</span>
        <button
          onClick={() =>
            view === "play" ? changeView("pause") : changeView("play")
          }
        >
          {view === "play" ? "PAUSE · ESC" : "RESUME · ESC"}
        </button>
      </div>
    </div>
  );
}

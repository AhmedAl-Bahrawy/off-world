/* ======================================================================
   8) SPRITE FACTORY — every pixel in the game comes from the ART block
   ====================================================================== */
const ART = (function(){
  const node = document.getElementById('offworldArt');
  try{ return JSON.parse(node.textContent); }
  catch(e){ console.error('art parse failed', e); return {palette:{},sprites:{}}; }
})();
const SPR = {};
function compileSprites(){
  const pal = ART.palette || {};
  for(const name in ART.sprites){
    const e = ART.sprites[name];
    const frames = e.frames.map(function(rows){
      const c = document.createElement('canvas');
      c.width = e.w; c.height = e.h;
      const g = c.getContext('2d');
      g.imageSmoothingEnabled = false;
      for(let y=0;y<e.h;y++){
        const row = (rows[y] || '').padEnd(e.w, '.').slice(0, e.w);
        for(let x=0;x<e.w;x++){
          const col = pal[row[x]];
          if(col){ g.fillStyle = col; g.fillRect(x, y, 1, 1); }
        }
      }
      return c;
    });
    SPR[name] = { frames:frames, w:e.w, h:e.h, eyes:e.eyes || null };
  }
}
function drawSprite(g, name, fx, fy, frame, flip){
  const s = SPR[name];
  if(!s) return null;
  const img = s.frames[((frame|0) % s.frames.length + s.frames.length) % s.frames.length];
  const x = Math.round(fx), y = Math.round(fy);
  if(flip){
    g.save();
    g.translate(x + s.w, y);
    g.scale(-1, 1);
    g.drawImage(img, 0, 0);
    g.restore();
  } else {
    g.drawImage(img, x, y);
  }
  return s;
}
/** Googly eyes: drawn live so they can track things and blink. */
function drawEyes(g, spr, fx, fy, lookX, lookY, blink){
  if(!spr || !spr.eyes) return;
  const ex0 = Math.round(fx), ey0 = Math.round(fy);
  for(let i=0;i<spr.eyes.length;i++){
    const ex = ex0 + spr.eyes[i][0], ey = ey0 + spr.eyes[i][1];
    if(blink > 0){
      g.fillStyle = '#12162e';
      g.fillRect(ex-1, ey, 3, 1);
      continue;
    }
    g.fillStyle = '#ffffff';
    g.fillRect(ex-1, ey-1, 3, 3);
    g.fillStyle = '#12162e';
    g.fillRect(ex-1 + lookX, ey-1 + lookY, 2, 2);
    g.fillStyle = 'rgba(255,255,255,.85)';
    g.fillRect(ex-1 + lookX, ey-1 + lookY, 1, 1);
  }
}
function spriteSize(name){
  const s = SPR[name];
  return s ? {w:s.w, h:s.h} : {w:12, h:14};
}

/* ======================================================================
   9) INPUT
   ====================================================================== */
const KEYS = {};
const TOUCH = {};
const GAME_KEYS = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','KeyA','KeyD','KeyW','KeyE','KeyQ','KeyH','KeyM','KeyC','KeyR','Enter','ShiftLeft','ShiftRight','Tab','Escape','KeyP'];
function dirX(){
  const r = KEYS.ArrowRight || KEYS.KeyD || TOUCH.right;
  const l = KEYS.ArrowLeft  || KEYS.KeyA || TOUCH.left;
  return (r?1:0) - (l?1:0);
}
function jumpDown(){ return !!(KEYS.Space || KEYS.KeyW || KEYS.ArrowUp || TOUCH.jump); }
const EDGE = {jump:false, act:false, ping:false};
function isJumpKey(code){ return code === 'Space' || code === 'KeyW' || code === 'ArrowUp'; }
function runDown(){ return !!(KEYS.ShiftLeft || KEYS.ShiftRight || TOUCH.run); }
function actDown(){ return !!(KEYS.KeyE || TOUCH.act); }
function actPressed(){ return !!(KEYS.KeyE || TOUCH.act); }
function pingPressed(){ return !!(KEYS.KeyQ); }
function flyDown(){ return !!(KEYS.KeyH); }

/* ======================================================================
   10) SAVE / LOAD
   ====================================================================== */
const SAVE_KEY = 'offworld.mars.scene2.v2';
const SAVE_DEFAULT = {
  facts:[], quizzes:[], ach:[], bits:0, levels:[], tools:[], plays:0, talks:0, deaths:0,
  bounces:0, flights:0, digs:0, started:Date.now(), bestTime:{}
};
const SAVE = {
  data: JSON.parse(JSON.stringify(SAVE_DEFAULT)),
  load(){
    try{
      const raw = localStorage.getItem(SAVE_KEY);
      if(raw){
        const p = JSON.parse(raw);
        if(p && typeof p === 'object'){
          Object.keys(this.data).forEach(k=>{ if(p[k]!==undefined && p[k]!==null) this.data[k]=p[k]; });
        }
      }
    }catch(e){}
    return this.data;
  },
  save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); }catch(e){} },
  wipe(){ try{ localStorage.removeItem(SAVE_KEY); }catch(e){} this.data = JSON.parse(JSON.stringify(SAVE_DEFAULT)); }
};

/* ======================================================================
   11) GAME STATE
   ====================================================================== */
const G = {
  mode:'title',
  levelIdx:0,
  inLevel:false,
  bits:0,
  shards:0,
  levelShards:0,
  levelBits:0,
  bounces:0,
  flights:0,
  digs:0,
  time:0,
  levelTime:0,
  cam:{x:0, y:0},
  shake:0,
  hitStop:0,
  startedAt:0,
  bannerT:0,
  tickT:0,
  blink:0,
  bubble:{text:'', t:0, who:''},
  pendingQuiz:null,
  ended:false
};
const RUN = {
  facts:{},        // "tool:index" -> true
  quizzes:{},      // levelId -> 'right' | 'wrong'
  ach:{},          // id -> true
  levelsDone:{},   // levelId -> {time, bits, shards}
  bits:0,
  tools:{},        // tool id -> true
  talks:0,
  plays:0,
  deaths:0,
  bounces:0,
  flights:0,
  digs:0
};
/** Unlocked verbs, earned by learning. */
const KIT = {
  relay:false,     // Q — orbital relay ping (unlocked after Viking L1)
  bounce:false,    // double jump off airbags (unlocked after Pathfinder L4)
  fly:false,       // rotorcraft (unlocked after Ingenuity L7 briefing)
  dig:false        // sampler arm (unlocked after Viking L1)
};

/* ======================================================================
   12) WORLD BUILDING
   ====================================================================== */
const GROUND_Y = 208;
const CHUNK_W = 250;
const WORLD = {
  level:null, solids:[], blocks:[], pickups:[], shards:[], enemies:[], movers:[], pads:[],
  winds:[], decor:[], signs:[], npcs:[], goal:null, length:0, spawn:{x:40,y:GROUND_Y-16},
  bg1:[], bg2:[], bg3:[], chunkX:[], hidden:[]
};

function buildLevel(idx){
  const L = LEVELS[idx];
  const rng = makeRng(L.seed * 7919 + 13);
  const flight = (L.gimmick === 'flight' || L.gimmick === 'skywind' || L.gimmick === 'precision');
  const gy = GROUND_Y;
  const w = {
    level:L, solids:[], blocks:[], pickups:[], shards:[], enemies:[], movers:[], pads:[],
    winds:[], decor:[], signs:[], npcs:[], goal:null, length:0,
    spawn:{x:40, y:gy-16}, bg1:[], bg2:[], bg3:[], chunkX:[]
  };
  const gapMul = 1;

  /* ---- ground spans + chunk plan ---- */
  const spans = [];
  let x = 0;
  const patterns = [];
  for(let c=0;c<L.chunks;c++){
    const isLast = (c === L.chunks - 1);
    w.chunkX.push(x);
    let pat;
    const r = rng();
    switch(L.gimmick){
      case 'flight':    pat = r < 0.55 ? 'float' : 'floatgap'; break;
      case 'skywind':   pat = r < 0.5 ? 'float' : (r < 0.8 ? 'floatgap' : 'floatwide'); break;
      case 'precision': pat = r < 0.5 ? 'narrow' : 'floatgap'; break;
      case 'bounce':    pat = r < 0.34 ? 'pad' : (r < 0.58 ? 'flat' : (r < 0.78 ? 'steps' : 'floatgap')); break;
      case 'dig':       pat = r < 0.38 ? 'burrow' : (r < 0.62 ? 'flat' : (r < 0.84 ? 'steps' : 'pillars')); break;
      case 'storm':     pat = r < 0.4 ? 'flat' : (r < 0.66 ? 'steps' : (r < 0.86 ? 'wind' : 'pillars')); break;
      case 'wind':      pat = r < 0.36 ? 'wind' : (r < 0.62 ? 'flat' : (r < 0.84 ? 'steps' : 'floatgap')); break;
      case 'escort':    pat = r < 0.4 ? 'flat' : (r < 0.64 ? 'steps' : (r < 0.86 ? 'blocks' : 'pillars')); break;
      default:          pat = r < 0.34 ? 'flat' : (r < 0.6 ? 'steps' : (r < 0.82 ? 'pillars' : 'floatgap'));
    }
    /* chunk 0 is always a safe flat runway: never spawn the player
       beside a wall, a pit or a stack of crates */
    if(c === 0) pat = 'flat';
    patterns.push(pat);

    const gapW = isLast ? 0 : Math.round((24 + rng()*26) * gapMul * (flight ? 0.5 : 1)) * (c === 0 ? 0.5 : 1);
    const innerPit = (pat === 'floatgap' || pat === 'wind' || pat === 'pad') && !flight && c > 0;
    if(flight){
      /* no continuous ground */
    } else if(innerPit){
      spans.push({x0:x, x1:x + 92});
      spans.push({x0:x + 178, x1:x + CHUNK_W});
    } else {
      spans.push({x0:x, x1:x + CHUNK_W});
    }
    x += CHUNK_W + gapW;
  }
  w.length = x + 60;
  w.chunkX = w.chunkX;

  /* ---- solids ---- */
  if(flight){
    w.solids.push({x:16, y:gy - 20, w:74, h:8, kind:'rock', oneway:true});
  }
  if(!flight){
    for(const s of spans){
      w.solids.push({x:s.x0, y:gy, w:s.x1 - s.x0, h:46, ground:true, kind:(L.gimmick === 'storm' ? 'dust' : 'ground')});
    }
  }

  /* ---- chunk decoration ---- */
  let shardMade = 0, hiddenMade = 0;
  const shardTotal = L.facts.length;
  const SAFE = 132;                        // keep the launch pad clear
  const plat = (px, h, pw)=>{
    if(px < SAFE) return;
    w.solids.push({x:px, y:gy - h, w:pw, h:8, kind:'rock', oneway:true});
  };
  const bits = (bx, by, n, step)=>{ step = step || 16; for(let i=0;i<n;i++) w.pickups.push({x:bx + i*step, y:by, type:'bit', got:false, t:0}); };

  for(let c=0;c<L.chunks;c++){
    const cx = w.chunkX[c];
    const pat = patterns[c];
    const enemy = (ex, ey, type)=>{
      if(ex < SAFE) return;                 // no ambush in the launch zone
      if(ex > w.length - 200) return;       // keep the archive machine safe
      w.enemies.push({x:ex, y:ey, w:10, h:8, type:type, vx:0, vy:0, alive:true, t:rng()*3, dead:0, home:ex, homeY:ey});
    };

    if(pat === 'flat'){
      bits(cx + 46, gy - 26, 3);
      if(rng() < 0.6) enemy(cx + 176, gy - 8, rng() < 0.6 ? 'mite' : 'wasp');
      if(rng() < 0.42) plat(cx + 160, 42, 58); bits(cx + 168, gy - 68, 2);
    }
    else if(pat === 'steps'){
      plat(cx + 52, 16, 48);  bits(cx + 58, gy - 42, 2);
      plat(cx + 110, 32, 48); bits(cx + 116, gy - 58, 2);
      plat(cx + 168, 48, 48); bits(cx + 174, gy - 74, 2);
      if(rng() < 0.45) enemy(cx + 188, gy - 56, 'mite');
    }
    else if(pat === 'pillars'){
      if(cx + 52 >= SAFE) w.solids.push({x:cx + 52, y:gy - 36, w:18, h:36, kind:'rock'});
      w.solids.push({x:cx + 186, y:gy - 36, w:18, h:36, kind:'rock'});
      plat(cx + 70, 48, 118); bits(cx + 84, gy - 74, 4);
      if(rng() < 0.6) enemy(cx + 128, gy - 8, 'mite');
    }
    else if(pat === 'blocks'){
      for(let i=0;i<3;i++){
        if(cx + 68 + i*26 < SAFE) continue;
        w.blocks.push({x:cx + 68 + i*26, y:gy - 44, w:16, h:16, type:'rock', used:false, bump:0});
      }
      bits(cx + 74, gy - 72, 3);
      if(rng() < 0.55) enemy(cx + 166, gy - 8, 'wasp');
    }
    else if(pat === 'burrow'){
      /* buried memories: diggable mounds hiding shards */
      for(let i=0;i<2;i++){
        const bx = Math.max(cx + 62 + i*74, SAFE + 8);
        w.blocks.push({x:bx, y:gy - 16, w:26, h:16, type:'buried', used:false, bump:0, dug:false});
        bits(bx + 4, gy - 40, 2, 12);
      }
      plat(cx + 150, 40, 62); bits(cx + 158, gy - 66, 2);
    }
    else if(pat === 'wind'){
      w.winds.push({x:cx + 20, y:gy - 130, w:186, h:136, fx:(rng() < 0.5 ? -1 : 1) * (78 + rng()*34)});
      bits(cx + 58, gy - 80, 4);
      plat(cx + 118, 44, 74);
    }
    else if(pat === 'pad'){
      w.pads.push({x:cx + 104, y:gy - 12, w:26, h:12, t:0});
      bits(cx + 98, gy - 42, 3);
      plat(cx + 146, 44, 76); bits(cx + 154, gy - 70, 3);
    }
    else if(pat === 'float'){
      const h1 = 26 + Math.floor(rng()*26);
      plat(cx + 30, h1, 74);
      bits(cx + 38, gy - h1 - 26, 3);
      plat(cx + 146, h1 + 14, 74);
      if(rng() < 0.5) enemy(cx + 176, gy - h1 - 24, 'wasp');
    }
    else if(pat === 'floatwide'){
      const h1 = 30 + Math.floor(rng()*18);
      plat(cx + 24, h1, 92);
      bits(cx + 34, gy - h1 - 26, 3);
      plat(cx + 140, h1 + 12, 78);
    }
    else if(pat === 'narrow'){
      plat(cx + 40, 34, 26);
      plat(cx + 104, 46, 26);
      plat(cx + 170, 30, 26);
      bits(cx + 44, gy - 60, 1);
    }
    else if(pat === 'floatgap'){
      plat(cx + 104, 30, 52);
      bits(cx + 112, gy - 56, 3);
      if(rng() < 0.42) enemy(cx + 130, gy - 38, 'mite');
    }

    /* moving platforms */
    if(!flight && (L.gimmick === 'escort' || rng() < 0.18)){
      const mh = 42;
      w.movers.push({x:cx + 26, y:gy - mh, w:46, h:8, ax:cx + 26, bx:cx + CHUNK_W - 84, ay:gy - mh, by:gy - mh, sp:0.45 + rng()*0.45, dir:1, t:rng()*3});
    }

    /* memory shards — one per fact in the level, always reachable */
    if(shardMade < shardTotal){
      const every = Math.max(1, Math.floor(L.chunks / shardTotal));
      if(c > 0 && c % every === 0 && shardMade < shardTotal){
        const sh = 30 + (shardMade % 3) * 11;
        const sx = cx + 52 + Math.floor(rng()*120);
        plat(sx - 8, sh, 56);
        w.shards.push({
          x:sx, y:gy - sh - 12, got:false, t:rng()*3, revealed:false,
          factIdx:L.facts[shardMade], buried:false, toolId:L.tool
        });
        shardMade++;
      }
    }
    /* one shard per level is buried in the dust — only a relay ping finds it */
    if(shardMade >= 1 && !hiddenMade && c === Math.floor(L.chunks * 0.42)){
      const hs = w.shards[w.shards.length - 1];
      hs.hidden = true;
      hs.revealed = false;
      hiddenMade = 1;
    }

    /* signs */
    if(rng() < 0.3){
      const lines = SIGNS[Math.floor(rng()*SIGNS.length)];
      w.signs.push({x:cx + 28 + Math.floor(rng()*170), y:gy, lines:lines});
    }
  }

  /* guarantee every fact has a shard */
  while(shardMade < shardTotal){
    const sx = 90 + shardMade * 180;
    plat(sx - 10, 34, 60);
    w.shards.push({x:sx, y:gy - 46, got:false, t:0, revealed:true, factIdx:L.facts[shardMade], hidden:false, toolId:L.tool});
    shardMade++;
  }
  /* trim any surplus so the counter stays honest */
  while(w.shards.length > shardTotal) w.shards.pop();

  /* the machine at the end */
  const tool = TOOL_BY_ID[L.tool];
  const goalX = w.length - 120;
  w.goal = {x:goalX, y:gy - 34, tool:L.tool, reached:false, t:0};
  w.goalSprite = tool ? tool.sprite : 'rock';

  /* the talking machine, mid-level */
  const npcDef = NPCS[L.npc] || NPCS.vigil;
  const npcX = Math.floor(w.length * 0.42);
  w.npcs.push({
    x:npcX, y:gy - (spriteSize(npcDef.sprite).h), sprite:npcDef.sprite,
    npc:L.npc, t:rng()*4, lineIdx:0, talked:false, name:npcDef.name, tint:npcDef.tint
  });

  /* decorative rocks / plants — flight zones get distant spires instead */
  const dr = makeRng(L.seed * 31 + 7);
  for(let dx = 30; dx < w.length; dx += 30 + Math.floor(dr()*64)){
    const kind = dr() < 0.44 ? 'rock' : (dr() < 0.72 ? 'rock2' : (dr() < 0.88 ? 'cactus' : 'bone'));
    const dy = flight ? 168 + Math.floor(dr()*30) : gy;
    w.decor.push({x:dx, y:dy, type:kind, s:flight ? 1 : (1 + Math.floor(dr()*2)), flip: dr() < 0.5, far:flight});
  }

  /* parallax strips */
  const br = makeRng(L.seed * 97 + 3);
  for(let i = 0; i < w.length/24; i++){
    w.bg1.push({x:i*24, y:54 + br()*44, h:28 + br()*42, w:40 + br()*62});
    w.bg2.push({x:i*30 + 13, y:104 + br()*40, h:24 + br()*38, w:50 + br()*82});
    w.bg3.push({x:i*38 + 7, y:146 + br()*36, h:16 + br()*28, w:60 + br()*92});
  }
  return w;
}

/* ======================================================================
   13) PHYSICS
   ====================================================================== */
const PHYS = {
  walk:92, run:142, accel:880, friction:1120, airControl:0.7,
  gravity:940, jump:-352, fallMul:1.32, apexGravity:0.64, maxFall:560,
  coyote:0.11, buffer:0.13,
  bounce:-392, flyUp:-196, flyFall:150, flyMax:-150, flyAccel:520, flyDrag:1.4
};
function isOneWay(s){ return !!s.oneway; }
function collideX(e, dx){
  for(let i=0;i<WORLD.solids.length;i++){
    const s = WORLD.solids[i];
    if(s.oneway) continue;
    if(aabb(e, s)){
      if(dx > 0) e.x = s.x - e.w;
      else if(dx < 0) e.x = s.x + s.w;
      e.vx = 0;
    }
  }
}
function collideY(e, dy, prevBottom){
  let landed = false;
  for(let i=0;i<WORLD.solids.length;i++){
    const s = WORLD.solids[i];
    if(aabb(e, s)){
      if(s.oneway){
        if(dy <= 0) continue;
        if(prevBottom > s.y + 2) continue;
      }
      if(dy > 0){
        e.y = s.y - e.h; e.vy = 0; landed = true;
      } else if(dy < 0){
        e.y = s.y + s.h; e.vy = 0;
      }
    }
  }
  /* moving platforms */
  for(let i=0;i<WORLD.movers.length;i++){
    const m = WORLD.movers[i];
    if(aabb(e, m)){
      if(dy > 0 && e.y + e.h - m.y < 14){
        e.y = m.y - e.h; e.vy = 0; e.onMover = m; landed = true;
      }
    }
  }
  return landed;
}
function onSolid(e){
  for(let i=0;i<WORLD.solids.length;i++){
    const s = WORLD.solids[i];
    if(s.oneway) continue;
    if(e.x + e.w > s.x && e.x < s.x + s.w && Math.abs((e.y + e.h) - s.y) < 2) return true;
  }
  for(let i=0;i<WORLD.movers.length;i++){
    const m = WORLD.movers[i];
    if(e.x + e.w > m.x && e.x < m.x + m.w && Math.abs((e.y + e.h) - m.y) < 2) return true;
  }
  return false;
}

/* ======================================================================
   14) ENTITIES
   ====================================================================== */
const P = {
  x:0, y:0, w:12, h:14, vx:0, vy:0, onGround:false, wasGround:false,
  face:1, anim:0, animT:0, state:'idle', coyote:0, buffer:0, jumpHeld:false,
  bounced:false, flying:false, battery:100, dustT:0, squash:0, stretch:0,
  look:{x:0,y:0}, digT:0, digTarget:null, landedT:0, onMover:null, riding:null,
  invuln:0, wobble:0
};
const PARTS = [];
const FLOATS = [];
function part(x, y, vx, vy, life, color, size, grav){
  PARTS.push({x:x, y:y, vx:vx, vy:vy, life:life, max:life, c:color, s:size||1, g:(grav===undefined?260:grav)});
}
function burst(x, y, n, color, spd, life){
  for(let i=0;i<n;i++){
    const a = Math.random() * Math.PI * 2;
    const s = spd * (0.4 + Math.random()*0.8);
    part(x, y, Math.cos(a)*s, Math.sin(a)*s - spd*0.3, life*(0.6+Math.random()*0.7), color, 1, 120);
  }
}
function floatText(x, y, str, color){
  FLOATS.push({x:x, y:y, text:str, c:color||'#ffd166', life:1.3, t:0});
}
function resetPlayer(level){
  const sp = spriteSize(level.gimmick === 'flight' || level.gimmick === 'skywind' || level.gimmick === 'precision' ? 'coper_idle' : 'curi_idle');
  P.x = WORLD.spawn.x; P.y = WORLD.spawn.y;
  P.vx = 0; P.vy = 0; P.onGround = false; P.wasGround = false;
  P.face = 1; P.anim = 0; P.animT = 0; P.state = 'idle';
  P.coyote = 0; P.buffer = 0; P.bounced = false; P.flying = false;
  P.battery = 100; P.digT = 0; P.digTarget = null; P.invuln = 0; P.squash = 0; P.stretch = 0;
  P.onMover = null; P.riding = null; P.wobble = 0;
  P.w = Math.min(14, sp.w - 2);
  P.h = Math.min(14, sp.h - 2);
}

/* ======================================================================
   15) GAME UPDATE
   ====================================================================== */
function updatePlayer(dt){
  const L = WORLD.level;
  const flyingZone = (L.gimmick === 'flight' || L.gimmick === 'skywind' || L.gimmick === 'precision');
  const dx = dirX();
  const run = runDown();

  /* ---- buffered / coyote jumps ---- */
  if(EDGE.jump){ P.buffer = PHYS.buffer; EDGE.jump = false; }
  P.jumpHeld = jumpDown();
  if(P.buffer > 0) P.buffer -= dt;
  if(P.onGround) P.coyote = PHYS.coyote; else P.coyote -= dt;

  /* ---- flight (Ingenuity zone) ---- */
  const canFly = KIT.fly && flyingZone;
  if(canFly && flyDown() && P.battery > 0){
    if(!P.flying){
      P.flying = true;
      sfx('rotor');
      RUN.flights++;
      if(RUN.flights >= 1) checkAch('wright');
      if(RUN.flights >= 72) checkAch('flight72');
    }
    P.battery = Math.max(0, P.battery - 12 * dt);
    P.vy += PHYS.flyUp * dt;
    if(P.vy < PHYS.flyMax) P.vy = PHYS.flyMax;
    P.vx += dx * PHYS.flyAccel * dt;
    P.vx -= P.vx * PHYS.flyDrag * dt;
    if(Math.abs(P.vx) > 96) P.vx = 96 * Math.sign(P.vx);
    if(dx !== 0) P.face = dx;
    P.onGround = false;
  } else if(P.flying){
    P.flying = false;
    sfx('land');
  }
  if(P.flying && P.battery <= 0){
    P.flying = false;
    floatText(P.x, P.y - 6, 'BATTERY', '#8fd4ff');
  }
  if(!P.flying && P.battery < 100) P.battery = Math.min(100, P.battery + (flyingZone ? 9 : 40) * dt);

  /* ---- horizontal movement ---- */
  if(!P.flying){
    const maxSpd = run ? PHYS.run : PHYS.walk;
    const acc = P.onGround ? PHYS.accel : PHYS.accel * PHYS.airControl;
    if(dx !== 0){
      P.vx += dx * acc * dt;
      if(P.vx > maxSpd) P.vx = approach(P.vx, maxSpd, PHYS.friction * dt);
      if(P.vx < -maxSpd) P.vx = approach(P.vx, -maxSpd, PHYS.friction * dt);
      P.face = dx;
    } else {
      P.vx = approach(P.vx, 0, (P.onGround ? PHYS.friction : PHYS.friction*0.35) * dt);
    }
  }

  /* ---- jump / bounce ---- */
  if(P.buffer > 0){
    if(P.onGround || P.coyote > 0){
      P.vy = PHYS.jump;
      P.onGround = false; P.coyote = 0; P.buffer = 0;
      P.stretch = 1;
      sfx('jump');
      burst(P.x + P.w/2, P.y + P.h, 5, '#c79a58', 40, 0.4);
    } else if(KIT.bounce && !P.bounced && !P.flying){
      /* the airbag bounce — Pathfinder's gift */
      P.bounced = true;
      P.vy = PHYS.bounce;
      P.buffer = 0;
      P.squash = 1;
      G.bounces++; RUN.bounces++;
      sfx('boing');
      floatText(P.x, P.y - 10, 'BOING!', '#44e3b8');
      burst(P.x + P.w/2, P.y + P.h, 9, '#8fd4ff', 70, 0.5);
      checkAch('bouncy');
    }
  }
  if(P.onGround) P.bounced = false;

  /* ---- gravity ---- */
  if(!P.flying){
    const g = PHYS.gravity * (P.vy < 0 && Math.abs(P.vy) < 90 ? PHYS.apexGravity : 1);
    P.vy += g * (P.vy > 0 ? PHYS.fallMul : 1) * dt;
    if(P.vy > PHYS.maxFall) P.vy = PHYS.maxFall;
  } else {
    P.vy += PHYS.flyFall * dt;
    if(P.vy > 190) P.vy = 190;
  }

  /* ---- wind ---- */
  for(let i=0;i<WORLD.winds.length;i++){
    const w = WORLD.winds[i];
    if(P.x + P.w > w.x && P.x < w.x + w.w && P.y + P.h > w.y && P.y < w.y + w.h){
      P.vx += w.fx * dt * (P.flying ? 0.7 : 1);
      P.wobble += dt * 6;
    }
  }

  /* ---- integrate + collide ---- */
  P.wasGround = P.onGround;
  const prevBottom = P.y + P.h;
  P.x += P.vx * dt;
  collideX(P, P.vx * dt);
  P.y += P.vy * dt;
  const landed = collideY(P, P.vy * dt, prevBottom);
  P.onGround = landed || onSolid(P);

  /* standing on a mover */
  if(P.onMover){
    P.x += P.onMover.dx || 0;
    P.onMover = null;
  }

  /* ---- airbag pads ---- */
  for(let i=0;i<WORLD.pads.length;i++){
    const pd = WORLD.pads[i];
    if(!P.flying && P.vy >= 0 && P.x + P.w > pd.x && P.x < pd.x + pd.w &&
       P.y + P.h > pd.y && P.y + P.h < pd.y + 16 && P.y + P.h - pd.y < 12){
      if(KIT.bounce){
        P.vy = PHYS.bounce * 0.92;
        P.bounced = true;
        G.bounces++; RUN.bounces++;
        pd.t = 1;
        sfx('boing');
        floatText(P.x, P.y - 10, 'BOING!', '#44e3b8');
        burst(P.x + P.w/2, P.y + P.h, 8, '#8fd4ff', 60, 0.45);
        checkAch('bouncy');
      } else {
        P.vy = -180;
        sfx('jump');
      }
    }
  }

  /* ---- fell off the world ---- */
  if(P.y > H + 40){
    if(flyingZone && KIT.fly){
      /* rotorcraft gets a recall instead of a funeral */
      P.y = H - 46; P.vy = -120; P.battery = Math.max(0, P.battery - 12);
      floatText(P.x, P.y - 6, 'RECALL!', '#8fd4ff');
      sfx('relay');
    } else {
      killPlayer('fell');
    }
  }

  /* ---- landing feedback ---- */
  if(P.onGround && !P.wasGround){
    P.squash = 1;
    sfx('land');
    burst(P.x + P.w/2, P.y + P.h, 6, '#c79a58', 50, 0.35);
  }

  if(runDown() && Math.abs(P.vx) > 22) G.usedRun = true;

  /* ---- dust while running ---- */
  if(P.onGround && Math.abs(P.vx) > 40){
    P.dustT -= dt;
    if(P.dustT <= 0){
      P.dustT = 0.08;
      part(P.x + P.w/2 - P.face*4, P.y + P.h, -P.face*20, -18, 0.4, '#c79a58', 1, 90);
    }
  }

  /* ---- animation ---- */
  P.animT += dt;
  const speed = Math.abs(P.vx);
  if(P.state === 'dead'){ /* frozen */ }
  else if(P.flying){ P.state = 'fly'; }
  else if(P.digT > 0){ P.state = 'dig'; }
  else if(!P.onGround){ P.state = (P.vy < 0 ? 'jump' : 'fall'); }
  else if(speed > 12){ P.state = 'run'; }
  else { P.state = 'idle'; }
  if(P.state === 'run' && P.animT > 0.09){ P.animT = 0; P.anim = (P.anim + 1) % 4; }
  if(P.state === 'idle' && P.animT > 0.5){ P.animT = 0; P.anim = (P.anim + 1) % 2; }
  if(P.state === 'fly' && P.animT > 0.055){ P.animT = 0; P.anim = (P.anim + 1) % 3; }

  /* ---- eyes look at the nearest interesting thing ---- */
  let tx = 0, ty = 0, best = 1e9;
  for(let i=0;i<WORLD.shards.length;i++){
    const s = WORLD.shards[i];
    if(s.got || !s.revealed) continue;
    const d = Math.abs(s.x - P.x);
    if(d < best && d < 90){ best = d; tx = s.x - P.x; ty = s.y - P.y; }
  }
  if(best < 1e9){
    P.look.x = tx > 4 ? 1 : (tx < -4 ? -1 : 0);
    P.look.y = ty > 6 ? 1 : (ty < -6 ? -1 : 0);
  } else {
    P.look.x = P.vx > 8 ? 1 : (P.vx < -8 ? -1 : 0);
    P.look.y = 0;
  }
  G.blink += dt;
  if(P.invuln > 0) P.invuln -= dt;
  if(P.squash > 0) P.squash = Math.max(0, P.squash - dt*4.2);
  if(P.stretch > 0) P.stretch = Math.max(0, P.stretch - dt*3.4);
  if(P.digT > 0) P.digT -= dt;
  if(P.wobble > 0) P.wobble = Math.max(0, P.wobble - dt*2);
}

function updateWorld(dt){
  /* shards bob */
  for(let i=0;i<WORLD.shards.length;i++){
    const s = WORLD.shards[i];
    s.t += dt;
    if(!s.got) s.y = s.y0 !== undefined ? s.y0 + Math.sin(s.t*2.4)*2.4 : s.y;
  }
  /* remember shard base y */
  for(let i=0;i<WORLD.shards.length;i++){
    if(WORLD.shards[i].y0 === undefined) WORLD.shards[i].y0 = WORLD.shards[i].y;
  }
  /* bits spin */
  for(let i=0;i<WORLD.pickups.length;i++){
    const p = WORLD.pickups[i];
    p.t += dt;
  }
  /* enemies patrol */
  for(let i=0;i<WORLD.enemies.length;i++){
    const e = WORLD.enemies[i];
    if(!e.alive){ e.dead += dt; continue; }
    e.t += dt;
    if(e.type === 'wasp'){
      e.y = e.homeY + Math.sin(e.t*2.6)*8;
      e.x += e.dirx !== undefined ? 0 : 0;
      e.vx = (e.home - e.x) * 0.6;
      if(Math.abs(e.home - e.x) < 6) e.dirx = -(e.dirx || 1);
      e.x += (e.home + (e.dirx||1)*18 - e.x) * dt * 0.8;
    } else {
      e.vx = (e.dir === 1 ? 1 : -1) * 22;
      e.x += e.vx * dt;
      if(e.x < e.home - 30){ e.x = e.home - 30; e.dir = 1; }
      if(e.x > e.home + 30){ e.x = e.home + 30; e.dir = -1; }
    }
    e.y = e.homeY;
    /* stomp / touch */
    if(aabb(P, e) && P.invuln <= 0){
      if(P.vy > 40 && P.y + P.h < e.y + 6){
        e.alive = false; e.dead = 0;
        P.vy = -280; P.stretch = 1;
        sfx('stomp');
        burst(e.x + e.w/2, e.y + e.h/2, 10, '#c79a58', 80, 0.5);
        floatText(e.x, e.y - 4, 'BONK', '#ffd166');
        RUN.bits += 5;
      } else {
        killPlayer('mite');
      }
    }
  }
  /* movers */
  for(let i=0;i<WORLD.movers.length;i++){
    const m = WORLD.movers[i];
    m.t += dt * m.sp;
    const nx = m.ax + (m.bx - m.ax) * (0.5 + 0.5*Math.sin(m.t));
    m.dx = nx - m.x;
    m.x = nx;
  }
  /* pads pulse */
  for(let i=0;i<WORLD.pads.length;i++){
    WORLD.pads[i].t = Math.max(0, WORLD.pads[i].t - dt*2.2);
  }
  /* npcs idle */
  for(let i=0;i<WORLD.npcs.length;i++){
    WORLD.npcs[i].t += dt;
  }
  /* goal */
  if(WORLD.goal) WORLD.goal.t += dt;

  /* particles */
  for(let i=PARTS.length-1;i>=0;i--){
    const p = PARTS[i];
    p.life -= dt;
    if(p.life <= 0){ PARTS.splice(i,1); continue; }
    p.vy += p.g * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
  for(let i=FLOATS.length-1;i>=0;i--){
    const f = FLOATS[i];
    f.life -= dt; f.t += dt;
    if(f.life <= 0) FLOATS.splice(i,1);
  }
}

function killPlayer(how){
  if(G.mode !== 'play') return;
  if(P.invuln > 0) return;
  RUN.deaths++; G.deaths = RUN.deaths;
  sfx('die');
  burst(P.x + P.w/2, P.y + P.h/2, 16, '#ff7a45', 110, 0.8);
  G.shake = 8;
  G.hitStop = 0.12;
  checkAch('scratch');
  showOver(how);
}

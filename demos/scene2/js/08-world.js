/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · WORLD BUILDER
   procedural chunk levels per mission
   ========================================================================== */
'use strict';
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


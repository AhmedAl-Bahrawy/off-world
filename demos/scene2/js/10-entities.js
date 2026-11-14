/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · ENTITIES & UPDATE
   player, particles, floats, pings, game update loop
   ========================================================================== */
'use strict';
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
      if(RUN.bounces === 15) showToast('🎈', 'PATHFINDER PROTOCOL', 'Fifteen bounces. The lander approves. Loudly.');
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
        if(RUN.bounces === 15) showToast('🎈', 'PATHFINDER PROTOCOL', 'Fifteen bounces. The lander approves. Loudly.');
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
      /* hover-drift: chase a point that flips sides, with a lazy vertical bob */
      const tx = e.home + (e.dirx || 1) * 18;
      e.x += (tx - e.x) * dt * 1.2;
      if(Math.abs(tx - e.x) < 3) e.dirx = -e.dirx;
      e.y = e.homeY + Math.sin(e.t * 2.6) * 8;
    } else {
      e.vx = (e.dir === 1 ? 1 : -1) * 22;
      e.x += e.vx * dt;
      if(e.x < e.home - 30){ e.x = e.home - 30; e.dir = 1; }
      if(e.x > e.home + 30){ e.x = e.home + 30; e.dir = -1; }
      e.y = e.homeY;
    }
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
const PING = [];

function collectShard(s){
  s.got = true;
  const tool = TOOL_BY_ID[s.toolId];
  const fact = tool.facts[s.factIdx];
  const key = s.toolId + ':' + s.factIdx;
  if(!RUN.facts[key]){
    RUN.facts[key] = true;
    SAVE.data.facts.push(key);
    G.shards++;
    sfx('shard');
    sfx('know');
    burst(s.x + 4, s.y + 4, 14, '#44e3b8', 90, 0.7);
    floatText(s.x, s.y - 6, '+1 KNOWLEDGE', '#44e3b8');
    showToast('🧠', 'MEMORY RECOVERED — ' + tool.name.toUpperCase(), fact.h + ' — ' + stripTags(fact.j));
    checkAch('sweeper');
    refreshRails();
  } else {
    sfx('bit');
    RUN.bits += 2;
  }
  /* the guardian wants to know about it */
  checkToolComplete(tool.id);
}
function checkToolComplete(toolId){
  const tool = TOOL_BY_ID[toolId];
  let n = 0;
  for(let i=0;i<tool.facts.length;i++) if(RUN.facts[toolId + ':' + i]) n++;
  if(n === tool.facts.length && !RUN.tools[toolId]){
    RUN.tools[toolId] = true;
    SAVE.data.tools.push(toolId);
    setTick('<b>' + tool.name + '</b> is fully recovered. The choir grows.');
    checkAch('library');
  }
}
function updatePickups(dt){
  for(let i=0;i<WORLD.shards.length;i++){
    const s = WORLD.shards[i];
    if(s.got) continue;
    if(s.hidden && !s.revealed) continue;
    if(s.needDig) continue;
    if(aabb(P, {x:s.x, y:s.y, w:8, h:9})) collectShard(s);
  }
  for(let i=0;i<WORLD.pickups.length;i++){
    const pk = WORLD.pickups[i];
    if(pk.got) continue;
    if(aabb(P, {x:pk.x, y:pk.y, w:6, h:6})){
      pk.got = true;
      RUN.bits++;
      G.bits++;
      sfx('bit');
      burst(pk.x + 3, pk.y + 3, 4, '#ffd166', 50, 0.3);
      refreshRails();
    }
  }
}

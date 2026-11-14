/* ======================================================================
   16) ZONE PALETTES — each zone feels like a different Mars
   ====================================================================== */
const ZONE_PAL = {
  viking:{
    sky0:'#2a1626', sky1:'#a85a3c', far:'#5c2c28', mid:'#40201d', g:'#7d3f2c', gt:'#ab5c39',
    ac:'#ffd27a', fog:'rgba(199,106,62,.22)', sun:'#ffd9a0', star:0
  },
  pathfinder:{
    sky0:'#3a1e2c', sky1:'#d4713a', far:'#7b3b2a', mid:'#5c2c1f', g:'#8a4a30', gt:'#b3613a',
    ac:'#ffe08a', fog:'rgba(212,113,58,.20)', sun:'#ffe6b0', star:0
  },
  ingenuity:{
    sky0:'#120b1e', sky1:'#6b3550', far:'#3a2038', mid:'#281828', g:'#6b3a2e', gt:'#94553c',
    ac:'#cfe6ff', fog:'rgba(120,90,140,.24)', sun:'#e8d4ff', star:1
  }
};
function zonePal(zone){ return ZONE_PAL[zone] || ZONE_PAL.viking; }

/* ======================================================================
   17) RENDERING
   ====================================================================== */
const cvs = $('game');
const ctx = cvs.getContext('2d');
ctx.imageSmoothingEnabled = false;

function drawBackground(g, camX){
  const L = WORLD.level;
  const p = zonePal(L.zone);
  const grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, p.sky0);
  grd.addColorStop(0.55, p.sky1);
  grd.addColorStop(1, p.far);
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);

  /* stars (the night side of Jezero) */
  if(p.star){
    for(let i=0;i<70;i++){
      const sx = (hash2(i, 7) * W * 1.4 - camX * 0.05) % W;
      const sy = hash2(i, 13) * 120;
      const tw = 0.4 + 0.6*Math.abs(Math.sin(G.time*1.5 + i));
      g.fillStyle = 'rgba(255,255,255,' + (0.25*tw).toFixed(3) + ')';
      g.fillRect(Math.floor(sx + W) % W, Math.floor(sy), 1, 1);
    }
  }

  /* the far sun / dusty disc */
  const sunX = 372 - camX * 0.02, sunY = 52;
  const sg = g.createRadialGradient(sunX, sunY, 2, sunX, sunY, 34);
  sg.addColorStop(0, p.sun);
  sg.addColorStop(0.25, 'rgba(255,200,140,.45)');
  sg.addColorStop(1, 'rgba(255,180,120,0)');
  g.fillStyle = sg;
  g.fillRect(sunX - 40, sunY - 40, 80, 80);
  g.fillStyle = p.sun;
  g.beginPath(); g.arc(sunX, sunY, 9, 0, Math.PI*2); g.fill();

  /* parallax ridges */
  drawRidge(g, WORLD.bg1, p.far, camX, 0.16, 1.0);
  drawRidge(g, WORLD.bg2, p.mid, camX, 0.34, 0.85);
  drawRidge(g, WORLD.bg3, p.mid, camX, 0.58, 0.6);

  /* horizon fog */
  g.fillStyle = p.fog;
  g.fillRect(0, 150, W, 60);

  /* flight zones look out over a hazy valley far below */
  const fl = (L.gimmick === 'flight' || L.gimmick === 'skywind' || L.gimmick === 'precision');
  if(fl){
    const hz = g.createLinearGradient(0, 176, 0, H);
    hz.addColorStop(0, 'rgba(60,30,40,0)');
    hz.addColorStop(0.55, 'rgba(78,38,42,.55)');
    hz.addColorStop(1, 'rgba(40,20,28,.95)');
    g.fillStyle = hz;
    g.fillRect(0, 176, W, H - 176);
    for(let i=0;i<18;i++){
      const hx = (hash2(i, 21) * W * 1.3 - camX * 0.5) % W;
      const hh = 8 + hash2(i, 33) * 22;
      g.fillStyle = 'rgba(30,16,24,.55)';
      g.fillRect(Math.floor(hx + W) % W, 214 - hh, 3 + Math.floor(hash2(i,44)*6), hh);
    }
  }
}
function drawRidge(g, arr, color, camX, par, scale){
  g.fillStyle = color;
  for(let i=0;i<arr.length;i++){
    const o = arr[i];
    const x = o.x - camX * par;
    if(x + o.w < -40 || x > W + 40) continue;
    const h = o.h * scale;
    g.fillRect(Math.round(x), Math.round(o.y + 40 - h), o.w, h + 120);
    /* rounded cap */
    g.beginPath();
    g.ellipse(Math.round(x + o.w/2), Math.round(o.y + 40 - h), o.w/2, 10*scale, 0, Math.PI, 0);
    g.fill();
  }
}
function drawTerrain(g, camX){
  const p = zonePal(WORLD.level.zone);
  for(let i=0;i<WORLD.solids.length;i++){
    const s = WORLD.solids[i];
    const x = Math.round(s.x - camX), y = Math.round(s.y);
    if(x + s.w < -20 || x > W + 20) continue;
    if(s.oneway){
      g.fillStyle = p.g; g.fillRect(x, y, s.w, s.h);
      g.fillStyle = p.gt; g.fillRect(x, y, s.w, 3);
      g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(x, y + s.h - 2, s.w, 2);
      g.fillStyle = p.ac; g.fillRect(x, y, s.w, 1);
    } else {
      g.fillStyle = p.g; g.fillRect(x, y, s.w, s.h);
      g.fillStyle = p.gt; g.fillRect(x, y, s.w, 5);
      /* uneven dune crest so the ground is not a flat rectangle */
      for(let sx = 0; sx < s.w; sx += 8){
        const bump = Math.floor(hash2(s.x + sx, 5) * 4);
        g.fillStyle = p.gt;
        g.fillRect(x + sx, y + bump, 8, 5 - bump);
        g.fillStyle = p.ac;
        g.fillRect(x + sx, y + bump, 8, 1);
      }
      g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(x, y + 5, s.w, 2);
      /* regolith speckle */
      for(let sx = 0; sx < s.w; sx += 3){
        const h = hash2(s.x + sx, s.y);
        if(h > 0.62){
          g.fillStyle = h > 0.86 ? 'rgba(0,0,0,.22)' : 'rgba(255,255,255,.07)';
          g.fillRect(x + sx, y + 7 + Math.floor(h*8), 1, 1);
        }
      }
    }
  }
  /* movers */
  for(let i=0;i<WORLD.movers.length;i++){
    const m = WORLD.movers[i];
    const x = Math.round(m.x - camX), y = Math.round(m.y);
    g.fillStyle = p.g; g.fillRect(x, y, m.w, m.h);
    g.fillStyle = p.gt; g.fillRect(x, y, m.w, 3);
    g.fillStyle = p.ac; g.fillRect(x, y, m.w, 1);
  }
  /* buried mounds */
  for(let i=0;i<WORLD.blocks.length;i++){
    const b = WORLD.blocks[i];
    if(b.type !== 'buried') continue;
    const x = Math.round(b.x - camX), y = Math.round(b.y);
    if(x + b.w < -20 || x > W + 20) continue;
    g.fillStyle = p.mid;
    g.fillRect(x, y + 3, b.w, b.h - 3);
    g.fillStyle = p.gt;
    g.fillRect(x, y, b.w, 4);
    g.fillStyle = p.ac; g.fillRect(x + 2, y, b.w - 4, 1);
    if(!b.dug){
      /* dig marker + prompt */
      const pulse = 0.5 + 0.5*Math.sin(G.time*4 + i);
      g.fillStyle = 'rgba(255,209,102,' + (0.35 + pulse*0.4).toFixed(2) + ')';
      g.fillRect(x + 2, y - 3, 3, 2);
      g.fillRect(x + b.w - 5, y - 3, 3, 2);
      if(KIT.dig){
        textCenter(g, 'E', x + b.w/2, y - 12 - pulse*2, {scale:1, color:'#ffd166'});
      }
    }
  }
}
function drawDecor(g, camX){
  const p = zonePal(WORLD.level.zone);
  for(let i=0;i<WORLD.decor.length;i++){
    const d = WORLD.decor[i];
    const x = Math.round(d.x - camX), y = Math.round(d.y);
    if(x < -30 || x > W + 30) continue;
    if(d.type === 'cactus'){
      const s = spriteSize('cactus');
      drawSprite(g, 'cactus', x - s.w/2, y - s.h, 0, d.flip);
    } else if(d.type === 'bone'){
      const s = spriteSize('bone');
      drawSprite(g, 'bone', x - s.w/2, y - s.h, 0, d.flip);
    } else {
      const nm = d.type === 'rock' ? 'rock' : 'rock2';
      const s = spriteSize(nm);
      drawSprite(g, nm, x - s.w/2, y - s.h, 0, d.flip);
    }
  }
  /* signs */
  for(let i=0;i<WORLD.signs.length;i++){
    const s = WORLD.signs[i];
    const x = Math.round(s.x - camX), y = Math.round(s.y);
    if(x < -50 || x > W + 50) continue;
    const sz = spriteSize('sign');
    drawSprite(g, 'sign', x - sz.w/2, y - sz.h, 0, false);
    /* the joke lives in a floating placard above the post */
    const lines = s.lines;
    let mw = 0;
    for(let l=0;l<lines.length;l++) mw = Math.max(mw, textWidth(lines[l], 1));
    const bw = mw + 8, bh = lines.length * 7 + 6;
    const bx = Math.round(x - bw/2), by = Math.round(y - sz.h - bh - 3);
    g.fillStyle = 'rgba(8,10,26,.82)';
    g.fillRect(bx, by, bw, bh);
    g.fillStyle = '#c79a58';
    g.fillRect(bx, by, bw, 1);
    g.fillRect(bx, by + bh - 1, bw, 1);
    g.fillStyle = '#3b47b8';
    g.fillRect(bx, by, 1, bh);
    g.fillRect(bx + bw - 1, by, 1, bh);
    for(let l=0;l<lines.length;l++){
      text(g, lines[l], bx + 4, by + 4 + l*7, {scale:1, color:'#f3c67e'});
    }
  }
}
function drawEntities(g, camX){
  const p = zonePal(WORLD.level.zone);
  /* airbag pads */
  for(let i=0;i<WORLD.pads.length;i++){
    const pd = WORLD.pads[i];
    const x = Math.round(pd.x - camX), y = Math.round(pd.y);
    const squash = pd.t * 4;
    g.fillStyle = KIT.bounce ? '#4f7fd8' : '#3b4a7a';
    g.beginPath();
    g.ellipse(x + pd.w/2, y + pd.h - squash, pd.w/2 - squash, pd.h/2, 0, Math.PI, 0);
    g.fill();
    g.fillStyle = KIT.bounce ? '#8fb7ff' : '#5f6fa8';
    g.fillRect(x + 1, y + 1, pd.w - 2, 2);
    if(KIT.bounce){
      g.fillStyle = 'rgba(143,212,255,.55)';
      g.fillRect(x + 2, y - 4 - squash, pd.w - 4, 1);
    }
  }
  /* bits */
  for(let i=0;i<WORLD.pickups.length;i++){
    const pk = WORLD.pickups[i];
    if(pk.got) continue;
    const x = Math.round(pk.x - camX), y = Math.round(pk.y + Math.sin(pk.t*3)*1.5);
    if(x < -20 || x > W + 20) continue;
    drawSprite(g, 'bit', x, y, (pk.t*6)|0);
  }
  /* memory shards */
  for(let i=0;i<WORLD.shards.length;i++){
    const s = WORLD.shards[i];
    if(s.got) continue;
    if(s.hidden && !s.revealed) continue;
    const bob = Math.sin(s.t*2.4)*3;
    const x = Math.round(s.x - camX), y = Math.round(s.y + bob);
    if(x < -20 || x > W + 20) continue;
    /* halo */
    const pulse = 0.35 + 0.25*Math.sin(G.time*3 + i);
    g.fillStyle = 'rgba(68,227,184,' + pulse.toFixed(2) + ')';
    g.beginPath(); g.arc(x + 4, y + 4, 7 + pulse*2, 0, Math.PI*2); g.fill();
    drawSprite(g, 'shard', x, y, (s.t*5)|0);
  }
  /* npcs */
  for(let i=0;i<WORLD.npcs.length;i++){
    const n = WORLD.npcs[i];
    const x = Math.round(n.x - camX), y = Math.round(n.y);
    if(x < -60 || x > W + 60) continue;
    const spr = SPR[n.sprite];
    const bob = Math.sin(n.t*1.6)*1.2;
    drawSprite(g, n.sprite, x, y + bob, (n.t*4)|0);
    if(spr && spr.eyes) drawEyes(g, spr, x, y + bob, 0, 0, 0);
    /* marker */
    const pulse = 0.5 + 0.5*Math.sin(G.time*3 + i);
    g.fillStyle = 'rgba(255,209,102,' + (0.4 + pulse*0.5).toFixed(2) + ')';
    g.fillRect(x + spr.w/2 - 1, y - 6 - pulse*2, 2, 2);
    textCenter(g, 'E', x + spr.w/2, y - 16 - pulse*2, {scale:1, color:'#ffd166'});
  }
  /* goal machine */
  if(WORLD.goal && !WORLD.goal.reached){
    const gx = Math.round(WORLD.goal.x - camX);
    const gy = Math.round(WORLD.goal.y + Math.sin(WORLD.goal.t*1.4)*1.5);
    const spr = SPR[WORLD.goalSprite];
    const pulse = 0.5 + 0.5*Math.sin(G.time*2.4);
    g.fillStyle = 'rgba(68,227,184,' + (0.16 + pulse*0.16).toFixed(2) + ')';
    g.beginPath(); g.arc(gx + (spr?spr.w:20)/2, gy + (spr?spr.h:24)/2, 26 + pulse*5, 0, Math.PI*2); g.fill();
    drawSprite(g, WORLD.goalSprite, gx, gy, (WORLD.goal.t*3)|0);
    if(spr && spr.eyes) drawEyes(g, spr, gx, gy, 0, 0, 0);
    textCenter(g, 'ARCHIVE', gx + (spr?spr.w:20)/2, gy - 8, {scale:1, color:'#44e3b8'});
  }
  /* enemies */
  for(let i=0;i<WORLD.enemies.length;i++){
    const e = WORLD.enemies[i];
    const x = Math.round(e.x - camX), y = Math.round(e.y);
    if(x < -30 || x > W + 30) continue;
    if(!e.alive){
      if(e.dead < 0.4) drawSprite(g, e.type, x, y, 0);
      continue;
    }
    const nm = e.type === 'wasp' ? 'wasp' : (e.type === 'goon' ? 'goon' : 'mite');
    const spr = SPR[nm];
    drawSprite(g, nm, x, y, (e.t*6)|0);
    if(spr && spr.eyes) drawEyes(g, spr, x, y, 0, 0, 0);
  }
}
function drawParticles(g, camX){
  for(let i=0;i<PARTS.length;i++){
    const p = PARTS[i];
    const a = clamp(p.life / p.max, 0, 1);
    g.globalAlpha = a;
    g.fillStyle = p.c;
    g.fillRect(Math.round(p.x - camX), Math.round(p.y), p.s, p.s);
  }
  g.globalAlpha = 1;
}
function drawFloats(g, camX){
  for(let i=0;i<FLOATS.length;i++){
    const f = FLOATS[i];
    const a = clamp(f.life, 0, 1);
    g.globalAlpha = a;
    textCenter(g, f.text, f.x - camX + 6, f.y - f.t*22, {scale:1, color:f.c, shadow:'#000'});
    g.globalAlpha = 1;
  }
}
function drawPlayer(g, camX){
  const L = WORLD.level;
  const flyingZone = (L.gimmick === 'flight' || L.gimmick === 'skywind' || L.gimmick === 'precision');
  let name = 'curi_idle', anim = P.anim;
  if(flyingZone){ name = 'coper_idle'; }
  else if(P.state === 'run'){ name = 'curi_run'; }
  else if(P.state === 'jump'){ name = 'curi_jump'; }
  else if(P.state === 'fall'){ name = 'curi_fall'; }
  else if(P.state === 'dig'){ name = 'curi_dig'; }
  const spr = SPR[name];
  const sq = P.squash, st = P.stretch;
  const cx = P.x + P.w/2, by = P.y + P.h;
  g.save();
  g.translate(cx, by);
  g.scale(1 + sq*0.26 - st*0.14, 1 - sq*0.22 + st*0.16);
  if(P.wobble > 0) g.rotate(Math.sin(P.wobble*4)*0.06);
  g.translate(-cx, -by);
  const fx = Math.round(cx - spr.w/2), fy = Math.round(by - spr.h);
  drawSprite(g, name, fx, fy, anim, false);
  const blink = (G.blink % 3.2) > 3.05 ? 1 : 0;
  drawEyes(g, spr, fx, fy, P.look.x, P.look.y, blink);
  g.restore();
  /* flight rotor wash */
  if(P.flying){
    g.fillStyle = 'rgba(200,220,255,.10)';
    for(let i=0;i<3;i++){
      const ry = P.y - 6 - i*4 + Math.sin(G.time*20 + i)*1.5;
      g.fillRect(P.x - 4 - i, ry, P.w + 8 + i*2, 1);
    }
  }
}
function drawHUD(g){
  const L = WORLD.level;
  if(!L) return;
  /* objective progress */
  const total = L.facts.length;
  const got = countLevelShards();
  text(g, 'MEMORIES ' + got + '/' + total, 6, 6, {scale:1, color:'#e6e9ff', shadow:'#000'});
  /* battery */
  if(KIT.fly && (L.gimmick === 'flight' || L.gimmick === 'skywind' || L.gimmick === 'precision')){
    const bw = 34;
    g.fillStyle = 'rgba(10,13,36,.7)'; g.fillRect(W - bw - 8, 6, bw, 6);
    g.fillStyle = P.battery > 25 ? '#8fd4ff' : '#ff5d73';
    g.fillRect(W - bw - 6, 8, Math.max(0, (bw-4) * P.battery/100), 2);
    text(g, 'BAT', W - bw - 30, 6, {scale:1, color:'#8fd4ff', shadow:'#000'});
  }
  /* ping cooldown */
  if(G.pingCd > 0){
    g.fillStyle = 'rgba(68,227,184,.7)';
    g.fillRect(W - 12, 18, 3, 3);
  }
}
function countLevelShards(){
  let n = 0;
  for(let i=0;i<WORLD.shards.length;i++) if(WORLD.shards[i].got) n++;
  return n;
}
function render(){
  const g = ctx;
  const camX = G.cam.x;
  g.setTransform(1,0,0,1,0,0);
  g.clearRect(0,0,W,H);
  if(!WORLD.level){ return; }
  if(G.shake > 0){
    g.translate(Math.round((Math.random()-0.5)*G.shake), Math.round((Math.random()-0.5)*G.shake));
  }
  drawBackground(g, camX);
  drawTerrain(g, camX);
  drawDecor(g, camX);
  drawEntities(g, camX);
  drawPlayer(g, camX);
  drawParticles(g, camX);
  drawFloats(g, camX);
  drawHUD(g);
}

/* ======================================================================
   18) INTERACTIONS
   ====================================================================== */
function nearNPC(){
  for(let i=0;i<WORLD.npcs.length;i++){
    const n = WORLD.npcs[i];
    if(Math.abs((n.x + 6) - P.x) < 26 && Math.abs(n.y - P.y) < 34) return n;
  }
  return null;
}
function nearBuried(){
  for(let i=0;i<WORLD.blocks.length;i++){
    const b = WORLD.blocks[i];
    if(b.type !== 'buried' || b.dug) continue;
    if(Math.abs((b.x + 13) - (P.x + 6)) < 22 && Math.abs(b.y - P.y) < 26) return b;
  }
  return null;
}
function doInteract(){
  const n = nearNPC();
  if(n){
    const def = NPCS[n.npc];
    const lines = def.lines;
    const line = lines[n.lineIdx % lines.length];
    n.lineIdx++;
    n.talked = true;
    RUN.talks++;
    sfx('talk');
    showBubble(def.name, line);
    checkAch('first_contact');
    return;
  }
  const b = nearBuried();
  if(b){
    b.dug = true;
    G.digs++; RUN.digs++;
    sfx('dig');
    burst(b.x + 13, b.y, 12, '#c79a58', 90, 0.6);
    floatText(b.x, b.y - 10, 'DIG!', '#ffd166');
    if(b.shardRef){ b.shardRef.revealed = true; b.shardRef.needDig = false; b.shardRef.hidden = false; }
    checkAch('industrious');
    return;
  }
  /* nothing to talk to — a small nudge */
  sfx('back');
  floatText(P.x, P.y - 8, 'NOTHING HERE', '#8e97d6');
}
function doPing(){
  if(G.pingCd > 0) return;
  G.pingCd = 1.6;
  sfx('relay');
  sfx('ping');
  let found = 0;
  for(let i=0;i<WORLD.shards.length;i++){
    const s = WORLD.shards[i];
    if(s.got) continue;
    if(Math.abs(s.x - P.x) < 170){
      s.revealed = true; s.hidden = false;
      found++;
    }
  }
  /* ping ring */
  PING.push({x:P.x + P.w/2, y:P.y + P.h/2, r:6, t:0});
  if(found > 0) floatText(P.x, P.y - 12, found + ' SIGNAL' + (found>1?'S':''), '#44e3b8');
  else floatText(P.x, P.y - 12, 'NO SIGNAL', '#8e97d6');
  setTick(found > 0
    ? 'Relay ping answered by ' + found + ' buried memor' + (found>1?'y':'ies') + '.'
    : 'Relay ping returned nothing. Dust is excellent at hiding things.');
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

/* ======================================================================
   19) ACHIEVEMENTS
   ====================================================================== */
function checkAch(id){
  if(RUN.ach[id]) return;
  const def = ACHIEVEMENTS.find(a=>a.id === id);
  if(!def) return;
  RUN.ach[id] = true;
  SAVE.data.ach.push(id);
  sfx('secret');
  showToast(def.icon, 'ACHIEVEMENT — ' + def.name, def.desc);
  refreshRails();
}
function levelFactsGot(level){
  let n = 0;
  for(let i=0;i<level.facts.length;i++) if(RUN.facts[level.tool + ':' + level.facts[i]]) n++;
  return n;
}

/* ======================================================================
   20) UI — rails, overlays, codex
   ====================================================================== */
function setTick(html){ $('tickText').innerHTML = html; }
function showToast(icon, title, sub){
  const t = $('toast');
  t.querySelector('.tIcon').textContent = icon;
  t.querySelector('.tBody b').textContent = title;
  t.querySelector('.tBody small').textContent = sub || '';
  t.classList.add('show');
  G.toastT = 5.2;
}
function showBubble(who, line){
  const b = $('bubble');
  b.querySelector('.alien').textContent = who;
  b.querySelector('.en').textContent = line;
  b.classList.add('show');
  G.bubble.t = 4.6;
  G.bubble.who = who;
}
function hideOverlay(id){
  const o = $(id);
  if(o) o.classList.remove('show');
}
function showOverlay(id){
  const o = $(id);
  if(o) o.classList.add('show');
}
function buildTitle(){
  const c = $('titleCard');
  clear(c);
  const h = el('div');
  h.appendChild(el('div', 'logo', 'MARS'));
  h.appendChild(el('div', 'sub', 'Scene 02 · The Three Witnesses'));
  const p = el('p', 'story');
  p.innerHTML = 'Humans are gone. Their machines are still here — powered down, holding records nobody has read in decades. <b>You are CURI-7</b>, the newest rover on the Red Planet, and you have a shovel, a torch and a <b>very expensive transmitter</b>.';
  h.appendChild(p);
  const p2 = el('p', 'story');
  p2.innerHTML = 'Three machines are waiting. Learn what they did, wake them up, and bring the archive home. <b>Try not to die. It is embarrassing.</b>';
  h.appendChild(p2);
  const cast = el('div', 'cast');
  const castData = [
    ['VIGIL-1', 'Viking 1 lander. Awake since 1976. Exhausted. Grumpy. Photographic.'],
    ['SOJOURNER', '10.6 kg of confidence. Named after a woman who told the truth.'],
    ['INGY', '1.8 kg of helicopter. Flies on 1% air. Freaks out. Rightly.'],
    ['BEACON', 'Your mission-control voice. Sarcastic by policy, helpful by accident.']
  ];
  for(const cd of castData){
    const cc = el('div', 'castCard');
    cc.appendChild(el('b', null, cd[0]));
    cc.appendChild(el('small', null, cd[1]));
    cast.appendChild(cc);
  }
  h.appendChild(cast);
  const row = el('div', 'btnRow');
  row.style.justifyContent = 'center';
  const b1 = el('button', 'btn primary', RUN.plays > 0 ? '▶ CONTINUE' : '▶ BEGIN THE MISSION');
  b1.onclick = ()=>{ audioResume(); startLevel(nextPlayableLevel()); };
  const b2 = el('button', 'btn', '📖 FIELD CODEX');
  b2.onclick = ()=>{ audioResume(); buildCodex(); showOverlay('ovCodex'); G.mode = 'codex'; };
  row.appendChild(b1); row.appendChild(b2);
  h.appendChild(row);
  const foot = el('div', 'muted');
  foot.style.marginTop = '10px';
  foot.innerHTML = '<b>Controls</b> — A/D move · Space jump · E interact · Q relay ping · Shift sprint · Tab codex · Esc pause';
  h.appendChild(foot);
  c.appendChild(h);
}
function nextPlayableLevel(){
  for(let i=0;i<LEVELS.length;i++){
    if(!RUN.levelsDone[LEVELS[i].id]) return i;
  }
  return 0;
}
function buildPause(){
  const c = $('pauseCard');
  clear(c);
  c.appendChild(el('div', 'kicker', 'SYSTEMS HOLDING'));
  c.appendChild(el('h2', null, 'PAUSED'));
  const p = el('p');
  p.innerHTML = 'BEACON is holding its breath. Take your time.';
  c.appendChild(p);
  const row = el('div', 'btnRow');
  const b1 = el('button', 'btn primary', '▶ RESUME');
  b1.onclick = ()=>{ hideOverlay('ovPause'); G.mode = 'play'; audioResume(); };
  const b2 = el('button', 'btn', '📖 CODEX');
  b2.onclick = ()=>{ buildCodex(); showOverlay('ovCodex'); };
  const b3 = el('button', 'btn rust', '⏹ ABANDON MISSION');
  b3.onclick = ()=>{ hideOverlay('ovPause'); buildTitle(); showOverlay('ovTitle'); G.mode = 'title'; musicStart('menu'); };
  row.appendChild(b1); row.appendChild(b2); row.appendChild(b3);
  c.appendChild(row);
  const notes = el('div', 'muted');
  notes.style.marginTop = '10px';
  notes.innerHTML = 'Reset save lives in the top bar. The Archive does not judge you for doing it. Much.';
  c.appendChild(notes);
}
function buildCodex(){
  const c = $('codexCard');
  clear(c);
  const head = el('div');
  head.appendChild(el('div', 'kicker', 'THE FIELD CODEX'));
  head.appendChild(el('h2', null, 'WHAT THE MACHINES DID'));
  const p = el('p', 'muted');
  p.innerHTML = 'Every memory you recover lands here. The <b>joke</b> is the field note; the <b>fact</b> is the part that is actually true.';
  head.appendChild(p);
  c.appendChild(head);
  for(const tool of TOOLS){
    const sec = el('div');
    sec.style.marginTop = '12px';
    const h3 = el('h3', null, tool.name.toUpperCase());
    h3.style.cssText = 'margin:0 0 6px;font-size:11px;letter-spacing:.16em;color:' + tool.code + ';display:flex;align-items:center;gap:8px';
    const n = tool.facts.filter((f,i)=>RUN.facts[tool.id+':'+i]).length;
    const cnt = el('span', null, n + '/' + tool.facts.length);
    cnt.style.marginLeft = 'auto';
    cnt.style.color = '#8e97d6';
    h3.appendChild(cnt);
    sec.appendChild(h3);
    const kv = el('div', 'kv');
    kv.innerHTML = '<span>' + tool.site + '</span><span>' + tool.coords + '</span>';
    sec.appendChild(kv);
    const kv2 = el('div', 'kv');
    kv2.innerHTML = '<span>LANDED</span><span>' + tool.landed + '</span>';
    sec.appendChild(kv2);
    const kv3 = el('div', 'kv');
    kv3.innerHTML = '<span>WORKED UNTIL</span><span>' + tool.span + '</span>';
    sec.appendChild(kv3);
    const rp = el('p', 'muted');
    rp.style.margin = '6px 0 8px';
    rp.innerHTML = tool.role;
    sec.appendChild(rp);
    for(let i=0;i<tool.facts.length;i++){
      const known = !!RUN.facts[tool.id + ':' + i];
      const e = el('div', 'entry');
      const eh = el('div', 'eh');
      eh.appendChild(el('b', null, known ? tool.facts[i].h : '— UNRECOVERED —'));
      if(known) eh.appendChild(el('span', 'tag', 'VERIFIED'));
      e.appendChild(eh);
      if(known){
        const fp = el('p');
        fp.innerHTML = tool.facts[i].f;
        e.appendChild(fp);
        const jp = el('div', 'joke');
        jp.textContent = tool.facts[i].j;
        e.appendChild(jp);
      } else {
        const lp = el('div', 'lockedF', 'This memory is still out there somewhere. Go and find it.');
        e.appendChild(lp);
      }
      sec.appendChild(e);
    }
    c.appendChild(sec);
  }
  const row = el('div', 'btnRow');
  const b = el('button', 'btn primary', '← CLOSE');
  b.onclick = ()=>{ hideOverlay('ovCodex'); if(G.mode === 'codex') G.mode = (G.inLevel ? 'play' : 'title'); };
  row.appendChild(b);
  c.appendChild(row);
}
function buildAch(){
  const c = $('achCard');
  clear(c);
  c.appendChild(el('div', 'kicker', 'THE TROPHY CABINET'));
  c.appendChild(el('h2', null, 'ACHIEVEMENTS'));
  const p = el('p', 'muted');
  p.innerHTML = 'Most of these are jokes. All of them are earned.';
  c.appendChild(p);
  const list = el('div', 'achList');
  for(const a of ACHIEVEMENTS){
    const got = !!RUN.ach[a.id];
    const d = el('div', 'ach' + (got ? ' got' : ''));
    d.appendChild(el('span', 'aIco', a.icon));
    const t = el('div');
    t.appendChild(el('b', null, a.name));
    t.appendChild(el('small', null, a.desc));
    d.appendChild(t);
    list.appendChild(d);
  }
  c.appendChild(list);
  const row = el('div', 'btnRow');
  const b = el('button', 'btn primary', '← CLOSE');
  b.onclick = ()=>{ hideOverlay('ovAch'); if(G.mode === 'ach') G.mode = (G.inLevel ? 'play' : 'title'); };
  row.appendChild(b);
  c.appendChild(row);
}
function showOver(how){
  G.mode = 'over';
  const c = $('overCard');
  clear(c);
  c.appendChild(el('div', 'kicker', 'HULL BREACH'));
  c.appendChild(el('h2', null, 'SCRAPPED'));
  const quips = {
    mite:'A dust mite got you. It was very small and very pleased about it.',
    fell:'You fell off the world. Again. Gravity: 38% of Earth, 100% of the point.',
    wasp:'A regolith wasp took your antenna. It was defending its nest, which is a rock.',
    boom:'Something out there hit you. The universe remains extremely unserious.'
  };
  const p = el('p');
  p.innerHTML = quips[how] || quips.boom;
  c.appendChild(p);
  const m = el('p', 'muted');
  m.innerHTML = 'Nothing was lost but dignity, and a little time. The Archive is not writing this down.';
  c.appendChild(m);
  const row = el('div', 'btnRow');
  const b1 = el('button', 'btn primary', '⟲ REASSEMBLE');
  b1.onclick = ()=>{
    hideOverlay('ovOver');
    G.mode = 'play';
    const sp = spriteSize(WORLD.level.gimmick==='flight'||WORLD.level.gimmick==='skywind'||WORLD.level.gimmick==='precision' ? 'coper_idle' : 'curi_idle');
    P.x = WORLD.spawn.x; P.y = WORLD.spawn.y;
    P.vx = 0; P.vy = 0; P.invuln = 1.4;
    G.hitStop = 0.05;
  };
  const b2 = el('button', 'btn', '⏹ TITLE');
  b2.onclick = ()=>{ hideOverlay('ovOver'); buildTitle(); showOverlay('ovTitle'); G.mode = 'title'; musicStart('menu'); };
  row.appendChild(b1); row.appendChild(b2);
  c.appendChild(row);
}
function buildEnd(){
  const c = $('endCard');
  clear(c);
  c.appendChild(el('div', 'logo', 'ARCHIVE RESTORED'));
  c.appendChild(el('div', 'sub', 'All three witnesses awake'));
  const p = el('p', 'story');
  p.innerHTML = 'Viking 1 photographs the sky it has been photographing for forty-eight years. Pathfinder bounces once, on purpose, for the cameras. Ingenuity lifts off, hovers badly, and lands like a champion.';
  c.appendChild(p);
  const p2 = el('p', 'story');
  p2.innerHTML = 'The Archive has all three voices now. Some of them are yours. <b>Mostly yours.</b>';
  c.appendChild(p2);
  const sl = el('div', 'scoreline');
  const add = (label, val)=>{ const d = el('div'); d.appendChild(el('b', null, String(val))); d.appendChild(document.createTextNode('')); const s = document.createElement('span'); s.textContent = label; d.appendChild(s); sl.appendChild(d); };
  add('FACTS RECOVERED', Object.keys(RUN.facts).length + '/' + (TOOLS.reduce((a,t)=>a+t.facts.length,0)));
  add('DATA BITS', RUN.bits);
  add('QUIZZES RIGHT', Object.keys(RUN.quizzes).filter(k=>RUN.quizzes[k]==='right').length);
  add('ACHIEVEMENTS', Object.keys(RUN.ach).length + '/' + ACHIEVEMENTS.length);
  add('TIMES SCRAPPED', RUN.deaths);
  add('CURIOUSITY', curiosityPct() + '%');
  c.appendChild(sl);
  const row = el('div', 'btnRow');
  row.style.justifyContent = 'center';
  const b1 = el('button', 'btn primary', '⟲ RUN IT AGAIN');
  b1.onclick = ()=>{ hideOverlay('ovEnd'); buildTitle(); showOverlay('ovTitle'); G.mode = 'title'; musicStart('menu'); };
  const b2 = el('button', 'btn', '📖 CODEX');
  b2.onclick = ()=>{ buildCodex(); showOverlay('ovCodex'); };
  row.appendChild(b1); row.appendChild(b2);
  c.appendChild(row);
}
function curiosityPct(){
  const total = TOOLS.reduce((a,t)=>a + t.facts.length, 0);
  return Math.min(100, Math.round(Object.keys(RUN.facts).length / total * 100));
}

/* ======================================================================
   21) THE QUIZ — where the machine talks back
   ====================================================================== */
function openQuiz(levelIdx){
  const L = LEVELS[levelIdx];
  const tool = TOOL_BY_ID[L.tool];
  const c = $('quizCard');
  clear(c);
  c.appendChild(el('div', 'kicker', tool.name.toUpperCase() + ' ASKS YOU A QUESTION'));
  const q = el('div', 'quizQ');
  const qtext = pick(tool.quiz);
  q.innerHTML = qtext.q;
  c.appendChild(q);
  const verdict = el('div', 'quizVerdict');
  c.appendChild(verdict);
  let answered = false;
  qtext.a.forEach(function(label, i){
    const b = el('button', 'opt');
    b.innerHTML = label;
    b.onclick = function(){
      if(answered) return;
      answered = true;
      if(i === qtext.c){
        b.classList.add('good');
        sfx('right');
        RUN.quizzes['L' + L.id] = 'right';
        SAVE.data.quizzes = RUN.quizzes;
        checkAch('quizzical');
        verdict.innerHTML = '<b style="color:#44e3b8">CORRECT.</b> ' + qtext.why;
        verdict.style.color = '#f3c67e';
        floatText(P.x, P.y - 12, 'CORRECT!', '#44e3b8');
        burst(P.x + 6, P.y + 6, 12, '#44e3b8', 90, 0.7);
      } else {
        b.classList.add('bad');
        sfx('wrong');
        RUN.quizzes['L' + L.id] = 'wrong';
        SAVE.data.quizzes = RUN.quizzes;
        const wrong = el('div');
        verdict.innerHTML = '<b style="color:#ff5d73">WRONG.</b> ' + qtext.why;
        verdict.style.color = '#f3c67e';
        floatText(P.x, P.y - 12, 'WRONG!', '#ff5d73');
      }
      refreshRails();
      const row = el('div', 'btnRow');
      const ok = el('button', 'btn primary', 'CONTINUE →');
      ok.onclick = function(){ hideOverlay('ovQuiz'); completeLevel(levelIdx); };
      row.appendChild(ok);
      c.appendChild(row);
    };
    c.appendChild(b);
  });
  G.mode = 'quiz';
  showOverlay('ovQuiz');
  sfx('quiz');
}

/* ======================================================================
   22) LEVEL FLOW
   ====================================================================== */
function startLevel(idx){
  G.levelIdx = idx;
  const L = LEVELS[idx];
  WORLD.level = L;
  const w = buildLevel(idx);
  WORLD.solids = w.solids; WORLD.blocks = w.blocks; WORLD.pickups = w.pickups;
  WORLD.shards = w.shards; WORLD.enemies = w.enemies; WORLD.movers = w.movers;
  WORLD.pads = w.pads; WORLD.winds = w.winds; WORLD.decor = w.decor;
  WORLD.signs = w.signs; WORLD.npcs = w.npcs; WORLD.goal = w.goal;
  WORLD.length = w.length; WORLD.spawn = w.spawn;
  WORLD.bg1 = w.bg1; WORLD.bg2 = w.bg2; WORLD.bg3 = w.bg3; WORLD.chunkX = w.chunkX;
  WORLD.goalSprite = w.goalSprite;
  /* dig levels bury two memories */
  if(L.gimmick === 'dig'){
    const spots = WORLD.blocks.filter(b=>b.type === 'buried');
    let n = Math.min(2, spots.length, WORLD.shards.length);
    for(let i=0;i<n;i++){
      const b = spots[i];
      const s = WORLD.shards.splice(WORLD.shards.length - 1, 1)[0];
      s.x = b.x + 9; s.y = b.y + 3; s.buried = true; s.hidden = true; s.revealed = false; s.needDig = true;
      b.shardRef = s;
      WORLD.shards.push(s);
    }
  }
  for(const s of WORLD.shards) if(s.y0 === undefined) s.y0 = s.y;
  resetPlayer(L);
  G.cam.x = 0;
  G.levelTime = 0;
  G.levelShards = 0;
  G.levelBits = 0;
  G.pingCd = 0;
  G.usedRun = false;
  if(L.id === 7 && !KIT.fly){
    KIT.fly = true;
    setTick('<b>ROTORCRAFT</b> unlocked — hold H to fly. Thin air, lazy turns, hard landings.');
  }
  PARTS.length = 0;
  FLOATS.length = 0;
  PING.length = 0;
  G.mode = 'play';
  G.inLevel = true;
  RUN.plays++;
  SAVE.data.plays = RUN.plays;
  hideOverlay('ovTitle');
  hideOverlay('ovOver');
  hideOverlay('ovEnd');
  hideOverlay('ovPause');
  hideOverlay('ovCodex');
  hideOverlay('ovAch');
  hideOverlay('ovQuiz');
  showBanner('MISSION ' + String(L.id).padStart(2,'0'), L.title, L.sub, L.brief);
  musicStart(L.music);
  setTick(L.beacon);
  refreshRails();
  saveAll();
}
function completeLevel(idx){
  const L = LEVELS[idx];
  const tool = TOOL_BY_ID[L.tool];
  const got = levelFactsGot(L);
  RUN.levelsDone[L.id] = {time:Math.round(G.levelTime), bits:G.levelBits, shards:got};
  SAVE.data.levels = RUN.levelsDone;
  sfx('goal');
  burst(WORLD.goal.x + 10, WORLD.goal.y + 10, 26, '#ffd166', 140, 1.1);
  G.shake = 5;

  /* unlock verbs as you learn */
  if(L.id === 1){ KIT.relay = true; KIT.dig = true; setTick('<b>ORBITAL RELAY</b> unlocked — press Q to ping what is buried.'); }
  if(L.id === 4){ KIT.bounce = true; setTick('<b>AIRBAG BOUNCE</b> unlocked — press jump again in mid-air.'); }
  if(L.id === 7){ KIT.fly = true; setTick('<b>ROTORCRAFT</b> unlocked — hold H to fly. Thin air, lazy turns.'); }
  checkAch('full_choir');
  if(L.tool === 'viking') checkAch('wake_viking');
  if(L.tool === 'pathfinder' && levelFactsGot(L) === tool.facts.length) checkAch('sojourner_truth');
  if(L.tool === 'ingenuity' && RUN.flights >= 72) checkAch('flight72');
  if(RUN.flights > 0) checkAch('wright');
  if(!G.usedRun) checkAch('slowpoke');

  const c = $('overCard');
  clear(c);
  c.appendChild(el('div', 'kicker', 'MACHINE RESTORED'));
  c.appendChild(el('h2', null, tool.name.toUpperCase() + ' IS AWAKE'));
  const p = el('p');
  const def = NPCS[L.npc];
  p.innerHTML = def.win[0];
  c.appendChild(p);
  const sl = el('div', 'scoreline');
  const add = (label, val)=>{ const d = el('div'); const b = el('b', null, String(val)); d.appendChild(b); const s = document.createElement('span'); s.textContent = label; d.appendChild(s); sl.appendChild(d); };
  add('MEMORIES', got + '/' + L.facts.length);
  add('DATA BITS', G.levelBits);
  add('TIME', Math.round(G.levelTime) + 's');
  add('CURIOUSITY', curiosityPct() + '%');
  c.appendChild(sl);
  const row = el('div', 'btnRow');
  const nextIdx = idx + 1;
  const b1 = el('button', 'btn primary', nextIdx < LEVELS.length ? 'NEXT MISSION →' : 'FINISH →');
  b1.onclick = function(){
    hideOverlay('ovOver');
    if(nextIdx < LEVELS.length) startLevel(nextIdx);
    else { G.mode = 'end'; buildEnd(); showOverlay('ovEnd'); musicStart('epic'); }
  };
  const b2 = el('button', 'btn', '📖 CODEX');
  b2.onclick = ()=>{ buildCodex(); showOverlay('ovCodex'); };
  row.appendChild(b1); row.appendChild(b2);
  c.appendChild(row);
  G.mode = 'over';
  showOverlay('ovOver');
  refreshRails();
  saveAll();
}
function showBanner(kicker, title, sub, brief){
  $('bKicker').textContent = kicker;
  $('bTitle').textContent = title;
  $('bSub').textContent = sub;
  const b = $('bBrief');
  if(brief){ b.innerHTML = brief; b.classList.add('show'); } else b.classList.remove('show');
  $('banner').classList.add('show');
  G.bannerT = 4.6;
}

/* ======================================================================
   23) RAILS
   ====================================================================== */
function refreshRails(){
  /* zones */
  const zl = $('zoneList');
  clear(zl);
  const zones = [
    {id:'viking', name:'CHRYSE PLANITIA', sub:'Viking 1 · 1976–1982'},
    {id:'pathfinder', name:'ARES VALLIS', sub:'Pathfinder · 1997'},
    {id:'ingenuity', name:'JEZERO CRATER', sub:'Ingenuity · 2021–2024'}
  ];
  let awake = 0;
  zones.forEach(function(z, i){
    const firstIdx = LEVELS.findIndex(l=>l.zone === z.id);
    const done = LEVELS.filter(l=>l.zone === z.id).every(l=>RUN.levelsDone[l.id]);
    const open = !done && (i === 0 || RUN.levelsDone[zones[i-1].id + ''] !== undefined || zones.slice(0,i).every(zz=>{
      return LEVELS.filter(l=>l.zone===zz.id).every(l=>RUN.levelsDone[l.id]);
    }));
    const tab = el('div', 'zoneTab' + (done ? ' done' : '') + (open ? ' active' : '') + (open ? '' : ' locked'));
    tab.appendChild(el('div', 'num', String(i+1)));
    const nm = el('div', 'nm');
    nm.appendChild(el('b', null, z.name));
    nm.appendChild(el('small', null, z.sub));
    tab.appendChild(nm);
    if(done) awake++;
    tab.onclick = function(){
      if(open || done){ startLevel(firstIdx); }
      else setTick('That zone is still dark. Wake the machines before it.');
    };
    zl.appendChild(tab);
  });
  $('zoneCount').textContent = awake + '/3';

  /* missions */
  const ml = $('missionList');
  clear(ml);
  let cur = '';
  let doneCount = 0;
  for(let i=0;i<LEVELS.length;i++){
    const L = LEVELS[i];
    if(L.zone !== cur){
      cur = L.zone;
      ml.appendChild(el('div', 'missionTitle', cur === 'viking' ? 'VIKING 1' : (cur === 'pathfinder' ? 'PATHFINDER' : 'INGENUITY')));
    }
    const done = !!RUN.levelsDone[L.id];
    if(done) doneCount++;
    const open = done || isLevelOpen(i);
    const m = el('div', 'mission' + (done ? ' done' : '') + (open && !done ? ' open' : '') + (open ? '' : ' locked'));
    m.appendChild(el('div', 'no', String(L.id)));
    const nm = el('div', 'nm');
    nm.appendChild(el('b', null, L.title));
    nm.appendChild(el('small', null, L.sub));
    m.appendChild(nm);
    const st = el('div', 'st');
    if(done){ st.textContent = '✔'; st.style.color = '#44e3b8'; }
    m.onclick = function(){ if(open) startLevel(i); };
    ml.appendChild(m);
  }
  $('missionCount').textContent = doneCount + '/' + LEVELS.length;

  /* kit */
  const kl = $('powerList');
  clear(kl);
  const kitItems = [
    ['relay', '📡 ORBITAL RELAY', 'Q — ping the uplink, reveal what is hidden in the dust.'],
    ['dig', '🦾 SAMPLER ARM', 'E — dig regolith mounds and unearth buried memories.'],
    ['bounce', '🎈 AIRBAG BOUNCE', 'Jump again in mid-air. Pathfinder approved.'],
    ['fly', '🚁 ROTORCRAFT', 'Hold H — one percent air, lazy turns, hard landings.']
  ];
  let any = false;
  for(const k of kitItems){
    if(!KIT[k[0]]) continue;
    any = true;
    const d = el('div');
    d.style.marginBottom = '5px';
    d.innerHTML = '<b>' + k[1] + '</b><br>' + k[2];
    kl.appendChild(d);
  }
  if(!any) kl.innerHTML = 'No tools recovered yet.<br>Find the machines. Learn what they did.';

  /* codex list */
  const cl = $('codexList');
  clear(cl);
  let totalFacts = 0, gotFacts = 0;
  for(const tool of TOOLS){
    const n = tool.facts.filter((f,i)=>RUN.facts[tool.id+':'+i]).length;
    totalFacts += tool.facts.length; gotFacts += n;
    const row = el('div', 'codexRow' + (n ? ' got' : ''));
    row.appendChild(el('div', 'dot', n ? String(n) : '—'));
    const nm = el('div', 'nm');
    nm.appendChild(el('b', null, tool.name));
    nm.appendChild(el('small', null, tool.role));
    row.appendChild(nm);
    row.onclick = function(){ buildCodex(); showOverlay('ovCodex'); if(G.mode === 'play') G.mode = 'codex'; };
    cl.appendChild(row);
  }
  $('codexCount').textContent = gotFacts + '/' + totalFacts;

  /* stats */
  $('stBits').textContent = RUN.bits;
  $('stKnow').textContent = gotFacts + '/' + totalFacts;
  $('stTools').textContent = Object.keys(RUN.tools).length;
  $('stCur').textContent = curiosityPct() + '%';
  $('curFill').style.width = curiosityPct() + '%';
  $('achFill').style.width = (Object.keys(RUN.ach).length / ACHIEVEMENTS.length * 100) + '%';
  $('achCount').textContent = Object.keys(RUN.ach).length;

  /* objective bar */
  const L = WORLD.level;
  if(L && G.inLevel){
    $('objText').innerHTML = '<b>' + L.goal + '</b>';
    const chips = $('objChips');
    clear(chips);
    const total = L.facts.length;
    const got = countLevelShards();
    const c1 = el('span', 'chip' + (got >= total ? ' on' : ''), 'MEMORIES ' + got + '/' + total);
    chips.appendChild(c1);
    if(KIT.relay) chips.appendChild(el('span', 'chip on', 'Q RELAY'));
    if(KIT.bounce) chips.appendChild(el('span', 'chip on', 'BOUNCE'));
    if(KIT.fly) chips.appendChild(el('span', 'chip on', 'FLY H'));
  }
}
function isLevelOpen(i){
  for(let j=0;j<i;j++){
    if(!RUN.levelsDone[LEVELS[j].id]) return false;
  }
  return true;
}
function saveAll(){
  SAVE.data.bits = RUN.bits;
  SAVE.data.facts = Object.keys(RUN.facts);
  SAVE.data.ach = Object.keys(RUN.ach);
  SAVE.data.quizzes = RUN.quizzes;
  SAVE.data.levels = RUN.levelsDone;
  SAVE.data.tools = Object.keys(RUN.tools);
  SAVE.data.talks = RUN.talks;
  SAVE.data.plays = RUN.plays;
  SAVE.data.deaths = RUN.deaths;
  SAVE.data.bounces = RUN.bounces;
  SAVE.data.flights = RUN.flights;
  SAVE.data.digs = RUN.digs;
  SAVE.save();
}

/* ======================================================================
   24) MAIN LOOP
   ====================================================================== */
const canvas = cvs;
let lastT = now(), acc = 0;
const STEP = 1/60;

function frame(){
  requestAnimationFrame(frame);
  const t = now();
  let dt = (t - lastT) / 1000;
  lastT = t;
  if(dt > 0.25) dt = 0.25;
  acc += dt;

  /* UI timers run even when paused */
  if(G.toastT > 0){ G.toastT -= dt; if(G.toastT <= 0) $('toast').classList.remove('show'); }
  if(G.bubble.t > 0){
    G.bubble.t -= dt;
    if(G.bubble.t <= 0) $('bubble').classList.remove('show');
  }
  if(G.bannerT > 0){ G.bannerT -= dt; if(G.bannerT <= 0) $('banner').classList.remove('show'); }
  if(G.shake > 0) G.shake = Math.max(0, G.shake - dt*22);
  if(G.pingCd > 0) G.pingCd -= dt;

  if(G.mode === 'play' && G.inLevel){
    G.time += dt;
    G.levelTime += dt;
    if(G.hitStop > 0){
      G.hitStop -= dt;
    } else {
      let steps = 0;
      while(acc >= STEP && steps < 9){
        acc -= STEP;
        steps++;
        updatePlayer(STEP);
        if(G.mode !== 'play') break;
        updateWorld(STEP);
        updatePickups(STEP);
        updatePing(STEP);
        checkGoal();
      }
    }
    /* camera */
    const look = P.face * 26;
    const target = P.x + look - W * 0.42;
    G.cam.x = lerp(G.cam.x, target, 1 - Math.pow(0.001, dt));
    if(G.cam.x < 0) G.cam.x = 0;
    if(G.cam.x > WORLD.length - W) G.cam.x = Math.max(0, WORLD.length - W);
    /* bubble follows its speaker */
    updateBubble();
  }
  if(G.tickT > 0){
    G.tickT -= dt;
    if(G.tickT <= 0) setTick(pick(BEACON.idle));
  }
  render();
}
function updatePing(dt){
  for(let i=PING.length-1;i>=0;i--){
    PING[i].t += dt;
    PING[i].r += 240 * dt;
    if(PING[i].t > 0.7) PING.splice(i,1);
  }
}
function checkGoal(){
  const gl = WORLD.goal;
  if(!gl || gl.reached) return;
  if(Math.abs((gl.x + 12) - (P.x + 6)) < 30 && Math.abs((gl.y + 20) - (P.y + 8)) < 62){
    gl.reached = true;
    sfx('boot');
    burst(gl.x + 12, gl.y + 12, 22, '#44e3b8', 120, 1.0);
    G.shake = 6;
    setTimeout(function(){ if(G.mode === 'play') openQuiz(G.levelIdx); }, 700);
  }
}
function updateBubble(){
  const b = $('bubble');
  if(!b.classList.contains('show')) return;
  /* attach the bubble to the nearest npc if one is talking */
  let best = null, bestD = 1e9;
  for(let i=0;i<WORLD.npcs.length;i++){
    const n = WORLD.npcs[i];
    const d = Math.abs(n.x - P.x);
    if(d < bestD){ bestD = d; best = n; }
  }
  if(!best) return;
  const sx = best.x - G.cam.x + 8;
  const sy = best.y - 26;
  b.style.left = Math.max(6, Math.min(W - 190, sx - 120)) + 'px';
  b.style.top = Math.max(6, Math.min(H - 70, sy)) + 'px';
}

/* ======================================================================
   25) WIRING
   ====================================================================== */
function init(){
  compileSprites();
  SAVE.load();
  RUN.facts = {}; (SAVE.data.facts||[]).forEach(k=>RUN.facts[k]=true);
  RUN.ach = {}; (SAVE.data.ach||[]).forEach(k=>RUN.ach[k]=true);
  RUN.quizzes = SAVE.data.quizzes || {};
  RUN.levelsDone = SAVE.data.levels || {};
  RUN.tools = {}; (SAVE.data.tools||[]).forEach(k=>RUN.tools[k]=true);
  RUN.bits = SAVE.data.bits || 0;
  RUN.talks = SAVE.data.talks || 0;
  RUN.plays = SAVE.data.plays || 0;
  RUN.deaths = SAVE.data.deaths || 0;
  RUN.bounces = SAVE.data.bounces || 0;
  RUN.flights = SAVE.data.flights || 0;
  RUN.digs = SAVE.data.digs || 0;
  KIT.relay = !!RUN.levelsDone[1];
  KIT.dig = !!RUN.levelsDone[1];
  KIT.bounce = !!RUN.levelsDone[4];
  KIT.fly = !!RUN.levelsDone[7];

  buildTitle();
  showOverlay('ovTitle');
  musicStart('menu');
  refreshRails();

  /* buttons */
  on($('btnCodex'), 'click', ()=>{ audioResume(); buildCodex(); showOverlay('ovCodex'); if(G.mode === 'play') G.mode = 'codex'; });
  on($('btnAch'), 'click', ()=>{ audioResume(); buildAch(); showOverlay('ovAch'); if(G.mode === 'play') G.mode = 'ach'; });
  on($('btnPause'), 'click', ()=>{ audioResume(); if(G.mode === 'play'){ buildPause(); showOverlay('ovPause'); G.mode = 'pause'; } });
  on($('btnSound'), 'click', ()=>{
    AUDIO.on = !AUDIO.on;
    $('btnSound').textContent = AUDIO.on ? '🔊 SOUND' : '🔇 MUTED';
    if(AUDIO.on){ audioResume(); musicStart(WORLD.level ? WORLD.level.music : 'menu'); }
  });
  on($('btnReset'), 'click', ()=>{
    if(!confirm('Wipe the archive and start over?')) return;
    SAVE.wipe();
    location.reload();
  });
  on($('btnBack'), 'click', ()=>{ location.href = 'scene1.html'; });

  /* keyboard */
  window.addEventListener('keydown', function(e){
    if(GAME_KEYS.indexOf(e.code) >= 0) e.preventDefault();
    if(e.repeat) return;
    KEYS[e.code] = true;
    audioResume();
    if(e.code === 'Escape'){
      if(G.mode === 'play'){ buildPause(); showOverlay('ovPause'); G.mode = 'pause'; }
      else if(G.mode === 'pause'){ hideOverlay('ovPause'); G.mode = 'play'; }
      else if(G.mode === 'codex' || G.mode === 'ach'){
        hideOverlay(G.mode === 'codex' ? 'ovCodex' : 'ovAch');
        G.mode = G.inLevel ? 'play' : 'title';
      }
    }
    if(e.code === 'Tab'){
      if(G.mode === 'codex'){ hideOverlay('ovCodex'); G.mode = G.inLevel ? 'play' : 'title'; }
      else { buildCodex(); showOverlay('ovCodex'); if(G.mode === 'play') G.mode = 'codex'; }
    }
    if(e.code === 'KeyV'){
      if(G.mode === 'ach'){ hideOverlay('ovAch'); G.mode = G.inLevel ? 'play' : 'title'; }
      else { buildAch(); showOverlay('ovAch'); if(G.mode === 'play') G.mode = 'ach'; }
    }
    if(isJumpKey(e.code)) EDGE.jump = true;
    if(e.code === 'KeyE' && G.mode === 'play') doInteract();
    if(e.code === 'KeyQ' && G.mode === 'play') doPing();
  });
  window.addEventListener('keyup', function(e){ KEYS[e.code] = false; });
  window.addEventListener('blur', function(){ for(const k in KEYS) KEYS[k] = false; });

  /* touch */
  const touch = $('touch');
  if('ontouchstart' in window || navigator.maxTouchPoints > 0) touch.classList.add('show');
  touch.querySelectorAll('button').forEach(function(b){
    const key = b.getAttribute('data-t');
    const down = function(e){ e.preventDefault(); TOUCH[key] = true; audioResume();
      if(key === 'jump') EDGE.jump = true;
      if(key === 'act') doInteract(); };
    const up = function(e){ e.preventDefault(); TOUCH[key] = false; };
    b.addEventListener('touchstart', down, {passive:false});
    b.addEventListener('touchend', up, {passive:false});
    b.addEventListener('mousedown', down);
    b.addEventListener('mouseup', up);
    b.addEventListener('mouseleave', up);
  });
  canvas.addEventListener('mousedown', function(){ audioResume(); });

  /* the relay ping is also a touch target */
  on(canvas, 'click', function(){ audioResume(); });

  /* beacon chatter */
  G.tickT = 9;
  requestAnimationFrame(frame);
}
/* debug hook — handy for tuning, harmless in production */
window.OFFWORLD = {
  get state(){ return {mode:G.mode, level:G.levelIdx, x:P.x, y:P.y, bits:RUN.bits,
    facts:Object.keys(RUN.facts).length, ach:Object.keys(RUN.ach).length,
    kit:KIT, levels:Object.keys(RUN.levelsDone), length:WORLD.length,
    shards:WORLD.shards.length, npcs:WORLD.npcs.length, enemies:WORLD.enemies.length}; },
  G:G, RUN:RUN, KIT:KIT, WORLD:WORLD, LEVELS:LEVELS, TOOLS:TOOLS, P:P, SPR:SPR,
  start:function(i){ startLevel(i); },
  warp:function(x,y){ P.x=x; if(y!==undefined) P.y=y; P.vx=0; P.vy=0; },
  give:function(){ for(const t of TOOLS) t.facts.forEach((f,i)=>RUN.facts[t.id+':'+i]=true); refreshRails(); }
};

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

})();

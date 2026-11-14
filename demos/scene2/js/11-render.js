/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · RENDERER
   background, terrain, entities, player, HUD
   ========================================================================== */
'use strict';
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
  /* floating tutorial hint — mission 01 only, first seconds */
  if(L.id === 1 && G.time < 7){
    textCenter(g, 'A/D MOVE · SPACE JUMP · E TALK', W/2, H - 14, {scale:1, color:'#e6e9ff', shadow:'#000'});
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
  drawPingRings(g, camX);
  drawHUD(g);
}

/* the orbital relay ping — a visible expanding ring this time */
function drawPingRings(g, camX){
  for(let i=0;i<PING.length;i++){
    const r = PING[i];
    g.strokeStyle = 'rgba(68,227,184,' + (1 - r.t/0.7).toFixed(2) + ')';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(Math.round(r.x - camX), Math.round(r.y), r.r, 0, Math.PI*2);
    g.stroke();
  }
  g.lineWidth = 1;
}


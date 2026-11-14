/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · MAIN
   fixed-step loop, wiring, boot
   ========================================================================== */
'use strict';
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
    /* camera — eased look-ahead, snap on (re)spawn */
    G.look = lerp(G.look, P.face * 26, 1 - Math.pow(0.02, dt));
    const target = P.x + G.look - W * 0.42;
    if(G.camSnap){ G.cam.x = target; G.camSnap = false; }
    else G.cam.x = lerp(G.cam.x, target, 1 - Math.pow(0.004, dt));
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
  RUN.witnessed = SAVE.data.witnessed || {};
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


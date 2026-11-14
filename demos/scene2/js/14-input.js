/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · INPUT & INTERACTION
   keys, touch, E-interact, Q-ping
   ========================================================================== */
'use strict';
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
    /* the Viking wet-lab gag: every sample comes back "maybe" */
    if(WORLD.level.zone === 'viking'){
      showBubble('BIOLAB', 'Sample logged. Result: maybe. It is always maybe.');
    }
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

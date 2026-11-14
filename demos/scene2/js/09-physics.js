/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · PHYSICS
   tile collision, one-way platforms, solid checks
   ========================================================================== */
'use strict';
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


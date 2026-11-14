/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · SPRITE FACTORY
   compiles ART into canvases; drawSprite/drawEyes
   ========================================================================== */
'use strict';
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


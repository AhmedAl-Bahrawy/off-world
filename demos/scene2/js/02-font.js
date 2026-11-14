/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · BITMAP FONT
   crisp 5x7 arcade text
   ========================================================================== */
'use strict';
/* ======================================================================
   2) BITMAP FONT (5x7) — crisp arcade text, no anti-aliasing
   ====================================================================== */
const FONT = {
'A':'01110 10001 10001 11111 10001 10001 10001','B':'11110 10001 10001 11110 10001 10001 11110',
'C':'01110 10001 10000 10000 10000 10001 01110','D':'11110 10001 10001 10001 10001 10001 11110',
'E':'11111 10000 10000 11110 10000 10000 11111','F':'11111 10000 10000 11110 10000 10000 10000',
'G':'01110 10001 10000 10111 10001 10001 01111','H':'10001 10001 10001 11111 10001 10001 10001',
'I':'11111 00100 00100 00100 00100 00100 11111','J':'00111 00010 00010 00010 00010 10010 01100',
'K':'10001 10010 10100 11000 10100 10010 10001','L':'10000 10000 10000 10000 10000 10000 11111',
'M':'10001 11011 10101 10101 10001 10001 10001','N':'10001 11001 10101 10011 10001 10001 10001',
'O':'01110 10001 10001 10001 10001 10001 01110','P':'11110 10001 10001 11110 10000 10000 10000',
'Q':'01110 10001 10001 10001 10101 10010 01101','R':'11110 10001 10001 11110 10100 10010 10001',
'S':'01111 10000 10000 01110 00001 00001 11110','T':'11111 00100 00100 00100 00100 00100 00100',
'U':'10001 10001 10001 10001 10001 10001 01110','V':'10001 10001 10001 10001 10001 01010 00100',
'W':'10001 10001 10001 10101 10101 11011 10001','X':'10001 10001 01010 00100 01010 10001 10001',
'Y':'10001 10001 01010 00100 00100 00100 00100','Z':'11111 00001 00010 00100 01000 10000 11111',
'0':'01110 10001 10011 10101 11001 10001 01110','1':'00100 01100 00100 00100 00100 00100 01110',
'2':'01110 10001 00001 00010 00100 01000 11111','3':'11111 00010 00100 00010 00001 10001 01110',
'4':'00010 00110 01010 10010 11111 00010 00010','5':'11111 10000 11110 00001 00001 10001 01110',
'6':'00110 01000 10000 11110 10001 10001 01110','7':'11111 00001 00010 00100 01000 01000 01000',
'8':'01110 10001 10001 01110 10001 10001 01110','9':'01110 10001 10001 01111 00001 00010 01100',
' ':'00000 00000 00000 00000 00000 00000 00000','.':'00000 00000 00000 00000 00000 01100 01100',
',':'00000 00000 00000 00000 01100 01100 01000',':':'00000 01100 01100 00000 01100 01100 00000',
'!':'00100 00100 00100 00100 00100 00000 00100','?':'01110 10001 00001 00110 00100 00000 00100',
"'":'00100 00100 00000 00000 00000 00000 00000','"':'01010 01010 00000 00000 00000 00000 00000',
'-':'00000 00000 00000 11111 00000 00000 00000','+':'00000 00100 00100 11111 00100 00100 00000',
'/':'00001 00010 00010 00100 01000 01000 10000','(':'00010 00100 01000 01000 01000 00100 00010',
')':'01000 00100 00010 00010 00010 00100 01000','%':'11001 11010 00010 00100 01000 01011 10011',
'#':'01010 01010 11111 01010 11111 01010 01010','*':'00000 10101 01110 11111 01110 10101 00000',
'=':'00000 00000 11111 00000 11111 00000 00000','<':'00010 00100 01000 10000 01000 00100 00010',
'>':'01000 00100 00010 00001 00010 00100 01000','[':'01110 01000 01000 01000 01000 01000 01110',
']':'01110 00010 00010 00010 00010 00010 01110','_':'00000 00000 00000 00000 00000 00000 11111',
'^':'00100 01010 10001 00000 00000 00000 00000','|':'00100 00100 00100 00100 00100 00100 00100',
'@':'01110 10001 10111 10101 10111 10000 01111','$':'00100 01111 10100 01110 00101 11110 00100'
};
const GLYPH_W = 5, GLYPH_H = 7, GLYPH_GAP = 1;

const FONT_CANVAS = (function(){
  const cache = {};
  for(const ch in FONT){
    const rows = FONT[ch].split(' ');
    const c = document.createElement('canvas');
    c.width = GLYPH_W; c.height = GLYPH_H;
    const g = c.getContext('2d');
    g.fillStyle = '#fff';
    for(let y=0;y<GLYPH_H;y++){
      const r = rows[y]||'';
      for(let x=0;x<GLYPH_W;x++) if(r.charAt(x)==='1') g.fillRect(x,y,1,1);
    }
    cache[ch] = c;
  }
  return cache;
})();
/* Cache tinted copies of the white glyphs. Keyed by the glyph itself —
   a size-based key would collide, because every glyph is 5x7. */
const TINT_CACHE = new WeakMap();
function tintedGlyph(glyph, color){
  let byColor = TINT_CACHE.get(glyph);
  if(!byColor){ byColor = Object.create(null); TINT_CACHE.set(glyph, byColor); }
  if(byColor[color]) return byColor[color];
  const c = document.createElement('canvas');
  c.width = glyph.width; c.height = glyph.height;
  const g = c.getContext('2d');
  g.drawImage(glyph,0,0);
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = color;
  g.fillRect(0,0,c.width,c.height);
  byColor[color] = c;
  return c;
}
function text(g, str, x, y, opts){
  opts = opts || {};
  const s = String(str).toUpperCase();
  const scale = opts.scale || 1;
  const color = opts.color || '#ffffff';
  const spacing = (opts.spacing===undefined?GLYPH_GAP:opts.spacing)*scale;
  const cw = GLYPH_W*scale, chh = GLYPH_H*scale;
  if(opts.shadow){
    g.save();
    g.globalAlpha = opts.shadowAlpha===undefined?0.85:opts.shadowAlpha;
    drawTextRaw(g,s,x+scale,y+scale,scale,spacing,opts.shadow);
    g.restore();
  }
  drawTextRaw(g,s,x,y,scale,spacing,color);
  return s.length*(cw+spacing);
}
function drawTextRaw(g,s,x,y,scale,spacing,color){
  g.save();
  g.fillStyle = color;
  let cx = x;
  for(let i=0;i<s.length;i++){
    const ch = s.charAt(i);
    const glyph = FONT_CANVAS[ch];
    if(glyph && ch!==' '){
      g.globalAlpha = 1;
      g.save();
      g.beginPath();
      g.rect(cx, y, cw_(glyph, scale), ch_(glyph, scale));
      g.clip();
      g.drawImage(tintedGlyph(glyph, color), 0, 0, glyph.width, glyph.height, cx, y, glyph.width*scale, glyph.height*scale);
      g.restore();
    }
    cx += GLYPH_W*scale + spacing;
  }
  g.restore();
}
function cw_(glyph, scale){ return glyph.width*scale; }
function ch_(glyph, scale){ return glyph.height*scale; }
function textWidth(str, scale){
  scale = scale||1;
  return String(str).length*(GLYPH_W*scale + GLYPH_GAP*scale);
}
function textCenter(g,str,cx,y,opts){
  const w = textWidth(str,(opts&&opts.scale)||1);
  return text(g,str,Math.round(cx-w/2),y,opts);
}
function textRight(g,str,rx,y,opts){
  const w = textWidth(str,(opts&&opts.scale)||1);
  return text(g,str,Math.round(rx-w),y,opts);
}


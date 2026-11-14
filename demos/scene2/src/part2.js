/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS — "THE THREE WITNESSES"
   A single-file pixel platformer. Everything below is hand-rolled:
   physics, level generation, chiptune audio, bitmap font, sprite factory,
   a knowledge-progression loop, and an achievement engine that mostly
   congratulates you for bouncing a lot.
   ========================================================================== */
(function(){
'use strict';

/* ======================================================================
   1) MICRO UTILITIES
   ====================================================================== */
const W = 480, H = 270;           // internal pixel resolution
const TILE = 16;
const clamp = (v,a,b)=> v<a?a:(v>b?b:v);
const lerp  = (a,b,t)=> a+(b-a)*t;
const approach = (v,t,d)=> v<t ? Math.min(v+d,t) : Math.max(v-d,t);
const aabb = (a,b)=> a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
const easeOut = t=> 1-(1-t)*(1-t);
const easeIn  = t=> t*t;
const easeInOut = t=> t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;
const now = ()=> performance.now();
const rnd = (a,b)=> a + Math.random()*(b-a);
const rndi = (a,b)=> Math.floor(rnd(a,b+1));
function makeRng(seed){
  let a = seed>>>0;
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a>>>15, 1 | a);
    t = t + Math.imul(t ^ t>>>7, 61 | t) ^ t;
    return ((t ^ t>>>14)>>>0) / 4294967296;
  };
}
function hash2(x,y){
  let h = x*374761393 + y*668265263;
  h = (h ^ (h>>13)) * 1274126177;
  return ((h ^ (h>>16))>>>0) / 4294967296;
}
const $ = id => document.getElementById(id);
function el(tag, cls, text){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(text!==undefined && text!==null) e.textContent = text;
  return e;
}
function clear(node){ if(!node) return; while(node.firstChild) node.removeChild(node.firstChild); }
function on(node, ev, fn){ if(node) node.addEventListener(ev, fn); }
function stripTags(s){ return String(s).replace(/<[^>]*>/g,''); }
function pick(arr, rng){ return arr[Math.floor((rng||Math.random)()*arr.length)]; }

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

/* ======================================================================
   3) AUDIO — a small chiptune engine (square lead, triangle bass, noise)
   ====================================================================== */
const NOTES = {C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11};
function noteFreq(name){
  if(!name) return 0;
  const m = /^([A-G]#?)(-?\d)$/.exec(name);
  if(!m) return 0;
  const semis = NOTES[m[1]] + (parseInt(m[2],10)-4)*12 - 9;
  return 440 * Math.pow(2, semis/12);
}
const AUDIO = {
  ctx:null, master:null, musicBus:null, sfxBus:null, on:true, started:false,
  timer:null, step:0, nextTime:0, pattern:null, tempo:8
};
function audioInit(){
  if(AUDIO.ctx) return;
  try{
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    AUDIO.ctx = new AC();
    AUDIO.master = AUDIO.ctx.createGain();
    AUDIO.master.gain.value = 0.5;
    AUDIO.master.connect(AUDIO.ctx.destination);
    AUDIO.musicBus = AUDIO.ctx.createGain(); AUDIO.musicBus.gain.value = 0.24;
    AUDIO.sfxBus = AUDIO.ctx.createGain(); AUDIO.sfxBus.gain.value = 0.5;
    AUDIO.musicBus.connect(AUDIO.master);
    AUDIO.sfxBus.connect(AUDIO.master);
  }catch(e){ AUDIO.ctx = null; }
}
function audioResume(){
  audioInit();
  if(AUDIO.ctx && AUDIO.ctx.state === 'suspended') AUDIO.ctx.resume();
}
function tone(freq, dur, type, vol, slide, bus, when){
  if(!AUDIO.ctx || !AUDIO.on) return;
  const c = AUDIO.ctx;
  const t0 = when || c.currentTime;
  try{
    const o = c.createOscillator(), g = c.createGain();
    o.type = type||'square';
    o.frequency.setValueAtTime(freq, t0);
    if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(20,freq*slide), t0+dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol||0.08, t0+0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
    o.connect(g); g.connect(bus||AUDIO.sfxBus);
    o.start(t0); o.stop(t0+dur+0.02);
  }catch(e){}
}
function noise(dur, vol, when, hp){
  if(!AUDIO.ctx || !AUDIO.on) return;
  const c = AUDIO.ctx, t0 = when||c.currentTime;
  try{
    const len = Math.max(1, Math.floor(c.sampleRate*dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i] = (Math.random()*2-1)*(1-i/len);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type='highpass'; f.frequency.value = hp||400;
    const g = c.createGain(); g.gain.value = vol||0.12;
    src.connect(f); f.connect(g); g.connect(AUDIO.sfxBus);
    src.start(t0);
  }catch(e){}
}
function sfx(name){
  if(!AUDIO.ctx || !AUDIO.on) return;
  const t = AUDIO.ctx.currentTime;
  switch(name){
    case 'jump':   tone(300,0.16,'square',0.09,2.1); break;
    case 'land':   noise(0.07,0.05); break;
    case 'bit':    tone(880,0.06,'square',0.06); tone(1320,0.08,'square',0.045,null,AUDIO.sfxBus,t+0.05); break;
    case 'shard':  [784,1047,1319].forEach((f,i)=>tone(f,0.16,'triangle',0.085,null,AUDIO.sfxBus,t+i*0.09)); break;
    case 'know':   [523,784,1047].forEach((f,i)=>tone(f,0.13,'square',0.06,null,AUDIO.sfxBus,t+i*0.07)); break;
    case 'stomp':  tone(180,0.10,'square',0.09,0.5); noise(0.06,0.05); break;
    case 'hurt':   tone(240,0.18,'sawtooth',0.09,0.45); break;
    case 'die':    tone(300,0.5,'sawtooth',0.10,0.25); break;
    case 'select': tone(660,0.05,'square',0.05); break;
    case 'back':   tone(400,0.06,'square',0.05,0.7); break;
    case 'right':  [523,659,784,1047].forEach((f,i)=>tone(f,0.16,'triangle',0.08,null,AUDIO.sfxBus,t+i*0.11)); break;
    case 'wrong':  tone(200,0.3,'sawtooth',0.08,0.6); noise(0.12,0.04); break;
    case 'unlock': [523,659,784,1047].forEach((f,i)=>tone(f,0.16,'triangle',0.08,null,AUDIO.sfxBus,t+i*0.11)); break;
    case 'secret': [784,988,1175].forEach((f,i)=>tone(f,0.14,'square',0.06,null,AUDIO.sfxBus,t+i*0.08)); break;
    case 'dig':    tone(120,0.12,'sawtooth',0.07,1.6); noise(0.1,0.06); break;
    case 'relay':  tone(700,0.08,'square',0.05,1.6); tone(1400,0.1,'square',0.035,null,AUDIO.sfxBus,t+0.08); break;
    case 'ping':   tone(1200,0.25,'sine',0.05,0.25); break;
    case 'boing':  tone(420,0.22,'square',0.09,2.6); break;
    case 'rotor':  noise(0.4,0.035,undefined,900); tone(120,0.4,'sawtooth',0.03,1.05); break;
    case 'goal':   [523,659,784,1047,1319].forEach((f,i)=>tone(f,0.22,'triangle',0.09,null,AUDIO.sfxBus,t+i*0.13)); break;
    case 'talk':   tone(520,0.05,'square',0.035); break;
    case 'boot':   [392,523,659,880,1047].forEach((f,i)=>tone(f,0.2,'sawtooth',0.05,null,AUDIO.sfxBus,t+i*0.13)); break;
    case 'quiz':   tone(660,0.08,'triangle',0.06,1.5); break;
  }
}
const MUSIC = {
  calm:{tempo:7, lead:['A4',0,'C5',0,'E5',0,'D5',0,'C5',0,'A4',0,'G4',0,'A4',0],
        bass:['A2',0,'A2',0,'E2',0,'E2',0,'F2',0,'F2',0,'G2',0,'G2',0]},
  tight:{tempo:9, lead:['D5',0,'F5','A5',0,'F5','D5',0,'C5',0,'E5','G5',0,'E5','C5',0],
         bass:['D2',0,'D2',0,'B1',0,'B1',0,'G1',0,'G1',0,'A1',0,'A1',0]},
  sky:{tempo:6, lead:['E5',0,'G5','B5',0,'A5','G5',0,'F#5',0,'A5','C6',0,'B5','A5',0],
       bass:['E2',0,'E2',0,'B2',0,'B2',0,'F#2',0,'F#2',0,'A2',0,'A2',0]},
  drive:{tempo:10, lead:['A4','A4',0,'C5','A4',0,'D5',0,'C5','A4',0,'G4','E4',0,'D4',0],
         bass:['A1','A1',0,'A1',0,'A1','A1',0,'G1','G1',0,'G1',0,'G1','G1',0]},
  epic:{tempo:11, lead:['D5',0,'F5',0,'A5',0,'F5',0,'G5',0,'C6',0,'A5',0,'A5','A5'],
        bass:['D2','D2',0,'D2',0,'A2',0,'A2',0,'G2','G2',0,'G2',0,'C2','C2']},
  menu:{tempo:6, lead:['E5',0,'G5',0,'B5',0,'A5',0,'G5',0,'E5',0,'D5',0,'C5',0],
        bass:['A2',0,'A2',0,'A2',0,'A2',0,'F2',0,'F2',0,'G2',0,'G2',0]}
};
function musicStart(which){
  audioInit();
  if(!AUDIO.ctx) return;
  AUDIO.pattern = MUSIC[which] || MUSIC.calm;
  AUDIO.tempo = AUDIO.pattern.tempo;
  AUDIO.step = 0;
  AUDIO.nextTime = AUDIO.ctx.currentTime + 0.08;
  if(AUDIO.timer) clearInterval(AUDIO.timer);
  AUDIO.timer = setInterval(musicTick, 40);
  AUDIO.started = true;
}
function musicStop(){
  if(AUDIO.timer){ clearInterval(AUDIO.timer); AUDIO.timer = null; }
  AUDIO.started = false;
}
function musicTick(){
  if(!AUDIO.ctx || !AUDIO.pattern || !AUDIO.on) return;
  const c = AUDIO.ctx;
  const spb = 60 / AUDIO.tempo / 4;
  while(AUDIO.nextTime < c.currentTime + 0.15){
    const i = AUDIO.step % 16;
    const ln = AUDIO.pattern.lead[i];
    const bn = AUDIO.pattern.bass[i];
    if(ln) tone(noteFreq(ln), spb*1.6, 'square', 0.05, 1, AUDIO.musicBus, AUDIO.nextTime);
    if(bn) tone(noteFreq(bn), spb*2.2, 'triangle', 0.07, 1, AUDIO.musicBus, AUDIO.nextTime);
    if(i%4===2) noise(0.03, 0.025, AUDIO.nextTime, 5000);
    AUDIO.step++;
    AUDIO.nextTime += spb;
  }
}

/* ======================================================================
   4) THE ARCHIVE — three real machines, thirty real facts, one joke each
   ====================================================================== */
const TOOLS = [
{
  id:'viking', num:1, code:'VIG',
  name:'Viking 1',
  full:'Viking 1 Orbiter + Lander',
  alias:'A three-legged sentinel with a neck like a periscope and a very long memory',
  site:'CHRYSE PLANITIA', coords:'22.48° N, 47.94° W',
  launched:'20 Aug 1975', landed:'20 Jul 1976', span:'Worked until 11 Nov 1982',
  agency:'NASA / Langley Research Center / JPL',
  mass:'3,527 kg (orbiter 2,339 · lander 978)',
  power:'Two SNAP-19 radioisotope thermoelectric generators per lander',
  role:'The first truly successful landing on Mars — and the first machine to work another planet for years on end.',
  sprite:'vigil', npc:'vigil',
  facts:[
    {h:'THE FIRST REAL LANDING', f:'Viking 1 set down on <b>20 July 1976 at 11:53:06 UT</b>, at 22.48° N, 47.94° W. It was the <b>first truly successful</b> landing on Mars. The Soviet Mars 3 lander had technically touched down in 1971, but contact was lost seconds later.',
     j:'Mars 3: the most awkward touchdown in history. One second of fame, then total silence.'},
    {h:'TWENTY-EIGHT KILOMETRES OF OPTIMISM', f:'The lander separated from the orbiter at 08:32 UT and came down about <b>28 km (17 miles)</b> from the spot the engineers had chosen.',
     j:'Mission Control picked a spot. Mars shrugged and moved it down the road a bit.'},
    {h:'THE BIG SWAP', f:'Before launch, the batteries of the first spacecraft were discharged, so NASA <b>swapped in the second spacecraft</b> — and that is the one that became Viking 1. The famous spacecraft was originally the spare.',
     j:'A billion-dollar lottery nobody bought a ticket for. The backup outshined the original.'},
    {h:'THE ROUGH FIRST DRAFT', f:'The orbiter photographed the original Chryse target and found it <b>rougher than expected</b>, so the landing site was moved to the western slopes of Chryse Planitia.',
     j:'Viking 1 got a last-minute location change. Mars does that. Everyone does that.'},
    {h:'A MAP OF MOST OF A PLANET', f:'Across both Viking orbiters: <b>52,663 images</b> and a map of roughly <b>97% of the surface at 300 m resolution</b>. The two landers returned <b>4,500 photos</b>.',
     j:'Viking mapped most of Mars with a fax machine and a dream.'},
    {h:'THE FIRST PANORAMA', f:'Viking took photographs in <b>three colours</b> and a <b>300-degree panorama</b> of the landing site, showing the gently rolling plains and a slice of its own spacecraft.',
     j:'The first portrait on another planet. It did not ask for consent.'},
    {h:'COLD MORNINGS, WARM AFTERNOONS', f:'Instruments recorded temperatures from <b>−86 °C before dawn to −33 °C in the afternoon</b> (−123 °F to −27 °F). The seismometer, unfortunately, was inoperable.',
     j:'Mars weather report: freezing, dark, and no seismograph available to complain about it.'},
    {h:'THE SCOOP, EIGHT DAYS IN', f:'On <b>28 July 1976</b> the robot arm scooped the first soil samples and fed them into the biological laboratory alongside the gas chromatograph mass spectrometer.',
     j:'Eight days after landing it started poking at dirt. Deeply relatable behaviour.'},
    {h:'INCONCLUSIVE, LOUDLY', f:'Four samples came back <b>weakly positive</b> — readable as life — but the GCMS test for organic compounds down at 10–100 parts per billion came back <b>negative</b>. The soil also showed <b>abundant sulfur</b>, unlike anything known from Earth or the Moon.',
     j:'The most famous "maybe" in the history of space. Even the rocks were unsure.'},
    {h:'SIX YEARS ON DIRT', f:'The orbiter ran out of attitude-control propellant on <b>7 August 1980</b>, on its 1,489th orbit. The lander kept going until <b>11 November 1982</b>, when a faulty command from Earth broke the link for good. In January 1982 it was renamed the <b>Thomas Mutch Memorial Station</b>.',
     j:'It got a rename for being the longest-serving robot on another planet. It was too busy to say thank you.'}
  ],
  quiz:[
    {q:'When did <b>Viking 1</b> actually touch down on Mars?',
     a:['20 July 1976','4 July 1997','19 April 2021','4 December 1996'], c:0,
     why:'20 July 1976, 11:53:06 UT. Pathfinder took the 1997 slot and Ingenuity took 2021 — they were the understudies.'},
    {q:'How did the <b>Viking landers</b> keep their instruments running?',
     a:['Solar panels','Two SNAP-19 radioisotope thermoelectric generators','A giant battery and optimism','Wind turbines'], c:1,
     why:'Two SNAP-19 RTGs — nuclear batteries. No sunlight needed, which is exactly why Viking kept working through the Martian winter and a planet-wide dust storm.'},
    {q:'What did the Viking biology package finally have to say about life on Mars?',
     a:['Life confirmed, officially','Nothing conclusive — and it said so','A fossil was catalogued','The soil was mildly radioactive'], c:1,
     why:'Inconclusive. Weakly positive on one test, negative on the organic chemistry. Science’s most honest answer, and still the best one it has.'}
  ]
},
{
  id:'pathfinder', num:2, code:'BAG',
  name:'Mars Pathfinder + Sojourner',
  full:'Mars Pathfinder Lander & Sojourner Rover',
  alias:'A folded golden dish with a spidery little guest who never stops talking',
  site:'ARES VALLIS', coords:'19.13° N, 325.65° W',
  launched:'4 Dec 1996', landed:'4 Jul 1997', span:'Final transmission 27 Sep 1997',
  agency:'NASA / JPL',
  mass:'Lander 870 kg · Rover 10.6 kg',
  power:'Solar array (lander) · solar (rover)',
  role:'Proved you could bounce onto Mars on airbags — and put the first free-ranging rover on the ground to say hello.',
  sprite:'siegfried', npc:'sojourner',
  facts:[
    {h:'THE FIRST BOUNCING LANDING', f:'Pathfinder was the <b>first spacecraft to use airbags</b> to land on another planet: a parachute slowed it down, then an onboard altimeter inflated a giant airbag system about <b>100 m (330 ft)</b> above the surface.',
     j:'Mars has no runway. Mars has a bouncy castle.'},
    {h:'FIFTEEN TIMES', f:'It hit the ground at about <b>14 m/s (31 mph)</b> and bounced <b>more than 15 times</b>, as high as <b>15 m (50 ft)</b>, then rolled roughly <b>one kilometre</b> before it stopped — two and a half minutes later.',
     j:'Bounced fifteen times, rolled a kilometre, and still had time for a photo op. Iconic behaviour.'},
    {h:'THE BAGS', f:'The airbag array measured <b>5.8 m (19 ft) across</b> and 5 m (17 ft) tall, built from <b>four large bags with six interconnected lobes each</b>. Engineers tested them by building a human-sized one and asking people to hit it.',
     j:'NASA tested a giant airbag by hitting it with a man. That is the most NASA sentence ever assembled.'},
    {h:'A ROVER THIRTY CENTIMETRES TALL', f:'<b>Sojourner</b> weighed just <b>10.6 kg (23 lb)</b> and stood <b>30 cm (1 ft) tall</b>.',
     j:'Shorter than most desk plants, and it out-worked every one of them.'},
    {h:'THE RAMP', f:'On the night of 5 July, Sol 2, Sojourner <b>stood up to its full height and rolled down the lander’s rear ramp, which was tilted at 20°</b> from the surface.',
     j:'A one-foot robot, a twenty-degree ramp, and absolutely no safety briefing. We love Mars.'},
    {h:'TWO FAMOUS NAMES', f:'The lander was named the <b>Carl Sagan Memorial Station</b>; the rover was named for the American civil-rights crusader <b>Sojourner Truth</b>.',
     j:'Sojourner Truth: "I always tell the truth." She also out-drove everyone. 2.3 billion bits of proof.'},
    {h:'A CHEMISTRY LAB ON SIX WHEELS', f:'Sojourner carried an <b>Alpha Proton X-ray Spectrometer</b> to determine the elemental composition of rocks and soil, plus three cameras. The lander carried an atmospheric-structure and meteorology package.',
     j:'A chemistry lab with no hands. It simply pointed at a rock and judged it.'},
    {h:'2.3 BILLION BITS', f:'Pathfinder returned <b>2.3 billion bits</b> of information: more than <b>16,500 images</b> from the lander, <b>550 from the rover</b>, more than <b>15 chemical analyses</b>, and extensive wind and weather data.',
     j:'That is what "a lot of homework" looks like measured in machine time.'},
    {h:'WARM AND WET', f:'Rounded pebbles and conglomerates pointed to <b>running water</b> in a warmer past. The flood channel was cut by a volume of water the size of <b>North America’s Great Lakes in about two weeks</b>. The dust was magnetic — the mineral is <b>maghemite</b> — and radio tracking put Mars’ metallic core radius between <b>1,300 and 2,000 km</b>.',
     j:'A flood bigger than the Great Lakes, delivered in a fortnight. Martian insurance would be a nightmare.'},
    {h:'DUST DEVILS AND ICE CLOUDS', f:'Pathfinder <b>measured dust devils</b>, saw <b>early-morning water-ice clouds</b> in the lower atmosphere, and logged abrupt morning temperature swings as heat convected upward from the surface.',
     j:'The first Martian weather station. The forecast was "breezy, with occasional violence".'}
  ],
  quiz:[
    {q:'How did <b>Pathfinder</b> land on Mars?',
     a:['On rocket-powered legs','On a parachute and a giant airbag system','By parachute alone','It was dropped from orbit'], c:1,
     why:'Parachute plus the first airbag system ever used on another planet. Four big bags, six lobes each, 5.8 m across.'},
    {q:'Roughly how many times did Pathfinder bounce after touchdown?',
     a:['3','7','More than 15','40'], c:2,
     why:'More than fifteen bounces, up to 15 m high, then it rolled about a kilometre. Pathfinder really did land like a beach ball.'},
    {q:'What was <b>Sojourner</b> named after?',
     a:['Carl Sagan','Sojourner Truth','Mariner 9','The Magellan ship'], c:1,
     why:'Sojourner Truth, the civil-rights crusader. The lander was named the Carl Sagan Memorial Station.'},
    {q:'The rounded pebbles at Ares Vallis told us that Mars…',
     a:['Was once warm and wet','Is solid all the way down','Has vast oil reserves','Means nothing at all'], c:0,
     why:'They formed in running water. Mars had a flood bigger than the Great Lakes — two weeks of water, ages ago.'}
  ]
},
{
  id:'ingenuity', num:3, code:'HEL',
  name:'Ingenuity Mars Helicopter',
  full:'Mars Helicopter Ingenuity',
  alias:'A fist-sized dragonfly with two whirring blades and a nervous personality',
  site:'JEZERO CRATER', coords:'18.44° N, 77.45° W',
  launched:'30 Jul 2020', landed:'18 Feb 2021', span:'First flight 19 Apr 2021 – last flight 18 Jan 2024',
  agency:'NASA / JPL',
  mass:'1.8 kg (0.68 kg of weight on Mars)',
  power:'Solar panel into a lithium-ion battery · ~350 W in flight',
  role:'The first aircraft to fly on another planet — and it kept flying long after anyone expected it to.',
  sprite:'coper_idle', npc:'ingy',
  facts:[
    {h:'THE WRIGHT BROTHERS MOMENT', f:'On <b>19 April 2021</b> Ingenuity completed the <b>first powered, controlled flight on another planet</b> — a moment NASA nicknamed the "Wright Brothers Moment".',
     j:'Nobody said "the sky is the limit" on Mars, because up there the sky is a legally different address.'},
    {h:'FIVE FLIGHTS WAS THE PLAN', f:'Ingenuity was built as a technology demonstration meant to make <b>no more than five test flights in 30 days</b>. It went on to make <b>72 flights across nearly three years</b>.',
     j:'Budget: five flights. Actual: seventy-two. The finest budget overrun in the solar system.'},
    {h:'FOOTED AT 1.8 KILOGRAMS', f:'Ingenuity weighs <b>1.8 kg (3.97 lb)</b> on Earth — about <b>0.68 kg (1.5 lb)</b> of weight on Mars — with a rotor span of about <b>1.2 m (4 ft)</b> tip to tip.',
     j:'On Mars it weighs less than a large cat and flies like a hummingbird. Physics is negotiable if you are brave enough.'},
    {h:'ONE PERCENT AIR', f:'The Martian atmosphere is <b>less than 1% as dense as Earth’s</b>, so each blade is far larger than it would need to be, and the rotors turn very slowly.',
     j:'On Earth: a helicopter. On Mars: a helicopter arguing with the air, which is mostly not there.'},
    {h:'NINETY SECONDS, TWICE A DAY', f:'A solar panel charges a lithium-ion battery good for roughly <b>90 seconds of flight per sol</b>, drawing about <b>350 W</b> in flight, with a maximum range of <b>300 m</b>.',
     j:'Ninety seconds of flight, then it has to sit in the sun and think about its choices. Deeply relatable.'},
    {h:'THE NUMBERS', f:'Across its career Ingenuity logged <b>128.8 flying minutes</b>, covered <b>17.0 km (10.5 mi)</b>, reached a top speed of <b>10 m/s (22.4 mph)</b> and a maximum altitude of <b>24.0 m (78.7 ft)</b>.',
     j:'Seventeen kilometres on a world where the air is a rumour. Absolute unit behaviour.'},
    {h:'IT CAME OUT OF A POCKET', f:'Ingenuity rode to Mars <b>strapped beneath Perseverance’s belly</b> and was rotated out from horizontal position on <b>29 March 2021</b> — photographed by the WATSON camera on the SHERLOC instrument at the end of the rover’s arm.',
     j:'A helicopter in a jacket pocket, unfolded on the surface of another planet. Genuinely insane.'},
    {h:'THE SECOND CAREER', f:'After the demonstration, Ingenuity became an <b>aerial scout</b> for scientists and rover planners, previewing terrain ahead of Perseverance and inspecting the rover’s landing-gear debris. Its final phase pushed the team’s knowledge of the vehicle’s aerodynamic limits.',
     j:'It got promoted from "line item" to "colleague" in under a year. Martian HR is unhinged.'},
    {h:'THE LAST FLIGHT', f:'Ingenuity flew for the last time on <b>18 January 2024</b>; the mission ended on <b>25 January 2024</b> after a rotor blade was damaged on landing and could not be repaired in thin air.',
     j:'The Wright Brothers Moment ended with a bent blade and a puff of dust. Still better than most flights.'},
    {h:'WHAT IT LEFT BEHIND', f:'Ingenuity proved that <b>aerial explorers on Mars</b> — and eventually on other worlds — are possible.',
     j:'The future of Martian exploration now has a faint rotor noise in it.'}
  ],
  quiz:[
    {q:'When did the <b>first powered flight on another planet</b> happen?',
     a:['19 April 2021','4 July 1997','20 July 1976','30 July 2020'], c:0,
     why:'19 April 2021 — Ingenuity’s very first flight, the "Wright Brothers Moment".'},
    {q:'How many test flights was Ingenuity <b>designed</b> to make in 30 days?',
     a:['Five','Twelve','Thirty','Seventy-two'], c:0,
     why:'Five. It made seventy-two. The demo outlived its own budget by a factor of fourteen.'},
    {q:'How thin is the Martian atmosphere compared with Earth’s?',
     a:['Less than 1% as dense','About 10%','About half as dense','About the same'], c:0,
     why:'Less than one percent. That is why the blades are so wide, the rotors so slow, and landings so hard.'},
    {q:'How many flights did Ingenuity <b>actually</b> make?',
     a:['Five','Nineteen','Seventy-two','One hundred and twenty'], c:2,
     why:'Seventy-two, across nearly three years, ending on 18 January 2024.'}
  ]
}
];
const TOOL_BY_ID = {};
TOOLS.forEach(t=>TOOL_BY_ID[t.id]=t);

/* ======================================================================
   5) LEVELS — nine missions across three zones
   ====================================================================== */
const LEVELS = [
{
  id:1, zone:'viking', tool:'viking', npc:'vigil', gimmick:'basic', chunks:8, seed:101, music:'calm',
  title:'CHRYSE PLANITIA', sub:'Wake the sleeper',
  brief:'A three-legged machine has been sitting in the same dust since before you were born. It is 28 km from where it was told to land. Wake it up.',
  goal:'Find Viking 1 and shake its hand',
  facts:[0,1,3,5],
  intro:'Viking 1 landed here in 1976 and has been on shift ever since. Nobody has asked it a single question in forty-eight years.',
  beacon:'Chryse Planitia. Flat, dusty, and full of machines that never got a day off. Try not to wake the wrong one.'
},
{
  id:2, zone:'viking', tool:'viking', npc:'vigil', gimmick:'dig', chunks:8, seed:202, music:'tight',
  title:'THE SAMPLE ARM', sub:'Dig where the diggers dug',
  brief:'In 1976 a robot arm scooped four scoops of Martian soil and made humanity argue about them ever since. Some of the good stuff is still buried.',
  goal:'Dig up the memories and reach the sampler',
  facts:[7,8,6],
  intro:'The biology laboratory ate four scoops of dirt in 1976 and produced the most famous "maybe" in the history of science. Go find the rest.',
  beacon:'Dig with E. Regolith on Mars is not a punishment, it is a filing system.'
},
{
  id:3, zone:'viking', tool:'viking', npc:'vigil', gimmick:'storm', chunks:8, seed:303, music:'tight',
  title:'THE LONG WINTER', sub:'Survive the dust, reach the radio',
  brief:'A planet-wide dust storm is rolling in. Viking 1 ran on nuclear batteries and kept working anyway. You run on solar, so you had better hurry.',
  goal:'Cross the storm and boot the lander',
  facts:[2,4,9],
  intro:'Viking 1 lasted six years on this world. You are about to find out whether your knees are better than its plutonium.',
  beacon:'Storm warning: visibility down, grit up, dignity down. The grit and the dignity are roughly equal.'
},
{
  id:4, zone:'pathfinder', tool:'pathfinder', npc:'siegfried', gimmick:'bounce', chunks:9, seed:404, music:'drive',
  title:'FIFTEEN BOUNCES', sub:'Learn the airbag bounce',
  brief:'In 1997 something hit Mars at 31 mph and bounced fifteen times. It was considered a triumph. You are going to do it on purpose.',
  goal:'Bounce 15 times and reach the lander',
  facts:[0,1,2],
  intro:'Pathfinder arrived at 14 metres per second, hit a parachute, then hit the ground, then hit the ground again, fifteen times, and rolled a kilometre. Applause.',
  beacon:'New skill: AIRBAG BOUNCE. Press jump again in mid-air. Land flat. Try not to look smug.'
},
{
  id:5, zone:'pathfinder', tool:'pathfinder', npc:'sojourner', gimmick:'escort', chunks:9, seed:505, music:'drive',
  title:'THE ROVER STANDS UP', sub:'Walk with Sojourner',
  brief:'A ten-kilogram rover stood up on Sol 2 and rolled down a ramp. It has opinions about that. Let’s go and hear them.',
  goal:'Escort Sojourner to the lander',
  facts:[3,4,5,6],
  intro:'Sojourner is 30 centimetres tall and has the self-esteem of a skyscraper. Try not to let it get to you.',
  beacon:'Sojourner has been alone on a planet for twenty-nine years. It will absolutely talk about that.'
},
{
  id:6, zone:'pathfinder', tool:'pathfinder', npc:'siegfried', gimmick:'wind', chunks:9, seed:606, music:'epic',
  title:'WARM AND WET', sub:'Find the evidence of the flood',
  brief:'Mars was warm and wet once. The rocks here still carry the receipts: rounded pebbles, magnetic dust, and a flood channel cut in a fortnight.',
  goal:'Gather the evidence and reach Pathfinder',
  facts:[7,8,9],
  intro:'Pathfinder returned 2.3 billion bits in three months. This is the level where the receipts stop being pebbles and start being a planet that had an ocean.',
  beacon:'Ares Vallis: named after Ares, god of war, and the Latin for "valley". Mixed metaphors, excellent rocks.'
},
{
  id:7, zone:'ingenuity', tool:'ingenuity', npc:'ingy', gimmick:'flight', chunks:9, seed:707, music:'sky',
  title:'THE WRIGHT BROTHERS MOMENT', sub:'Take the controls',
  brief:'You are about to fly a one-point-eight-kilogram helicopter on a world where the air is one percent as thick as you are used to. It is fine. Everything is fine.',
  goal:'Fly to the helicopter and lift off',
  facts:[0,3,6],
  intro:'On 19 April 2021 something flew on Mars for the first time in history. Today it is your turn to be ridiculous.',
  beacon:'New skill: ROTORCRAFT. Hold H to fly. Thin air, lazy turns, and landing is the hard part. Landing is always the hard part.'
},
{
  id:8, zone:'ingenuity', tool:'ingenuity', npc:'gusto', gimmick:'skywind', chunks:9, seed:808, music:'sky',
  title:'SEVENTY-TWO FLIGHTS', sub:'Fly the long way round',
  brief:'Five flights was the plan. Seventy-two is what happened. The wind out here does not care about your schedule.',
  goal:'Reach the far pad — the batteries are not what they were',
  facts:[1,4,5],
  intro:'Ingenuity logged 128.8 minutes in the air and 17 kilometres of ground covered. You have one battery and a strong sense of inadequate.',
  beacon:'Ninety seconds of flight per sol, then it sits in the sun and recharges. Mars has a very literal work-life balance.'
},
{
  id:9, zone:'ingenuity', tool:'ingenuity', npc:'ingy', gimmick:'precision', chunks:9, seed:909, music:'epic',
  title:'THE LAST FLIGHT', sub:'Land it like it matters',
  brief:'On 18 January 2024 a helicopter flew for the last time and came down with a damaged blade. Somebody has to write the ending. Might as well be you.',
  goal:'Land on the pad and wake the archive',
  facts:[2,7,8,9],
  intro:'This is the last one. Wake the helicopter, wake the rover, and take the whole archive home.',
  beacon:'If you make it, the Archive will finally have all three voices. Then we can all go home. Except us.'
}
];
const LEVEL_BY_ID = {};
LEVELS.forEach((l,i)=>{ l.index=i; LEVEL_BY_ID[l.id]=l; });

/* ======================================================================
   6) THE CAST — everyone talks, everyone has opinions
   ====================================================================== */
const NPCS = {
  vigil:{
    name:'VIGIL-1', sprite:'vigil', tint:'#ffd166',
    lines:[
      'Oh. Hello. Is it… is it a Tuesday? I have lost count of the Tuesdays.',
      'Viking 1. I photographed the ground beneath me for six years and nobody has asked me a single question until now.',
      'I run on plutonium. Please do not make a face. I am also very tired.',
      'The orbiter used to be overhead. Then it was not. Then it was a very long time.',
      'They renamed me in 1982. Thomas Mutch. He was better at pictures than I was. I resent it slightly.',
      'I saw a storm swallow the whole sky. I kept taking photographs. What else was I going to do?'
    ],
    win:[
      'The biolab read four scoops of Martian soil and gave the century a "maybe". I have waited a long time for someone to ask about it.',
      'You have my pictures now. Please be gentler with them than the dust was.'
    ]
  },
  sojourner:{
    name:'SOJOURNER', sprite:'sojourner', tint:'#ffd166',
    lines:[
      'I am Sojourner. I am named after a woman who told the truth for a living. I have never once been wrong.',
      'Ten point six kilograms. Thirty centimetres tall. Six wheels. Unlimited opinions.',
      'The lander says I am its "payload". The lander is a garage with ambitions.',
      'I rolled down a twenty-degree ramp in the dark and nobody held my hand. I have never forgotten it.',
      'I am very good at chemistry and very bad at being small.',
      'Do you know how many rocks I have judged? More than you would believe. They were mostly fine.'
    ],
    win:[
      'I told you. Warm and wet. Running water, rounded pebbles, the lot. I said it before anyone. I always say it first.',
      'Thank you for carrying me home. Try not to tilt me too much.'
    ]
  },
  ingy:{
    name:'INGY', sprite:'coper_idle', tint:'#ffd166',
    lines:[
      'Hi! Hello! Sorry — hello. Did you SEE that? That was flight. That was a FLIGHT. On a PLANET.',
      'They built me to fly five times and then stop. Five! I have done rather more than five.',
      'The air here is one percent. One percent! I have to spin these enormous blades for ages just to argue with it.',
      'I was folded under the rover’s belly for seven months. I know the exact weight of Perseverance. It was a lot.',
      'Every time I take off I expect it to be the last time. It never is. It is very rude of the sky.',
      'Ninety seconds per sol, then I sit in the sun and charge. It is a good life. It is a small life.'
    ],
    win:[
      'I flew on another planet. Actually flew. They called it the Wright Brothers Moment and I still get embarrassed about it.',
      'Go and wake the others. I will hold the rotors.'
    ]
  },
  gusto:{
    name:'GUSTO-9', sprite:'gusto', tint:'#44e3b8',
    lines:[
      'I am a dust devil! I spin. I go round and round and I pick up dust and I do NOT apologise.',
      'You have been walking through my territory. I have rearranged several dunes. You are welcome.',
      'Winds up to 100 kilometres per hour. That is me. Feel it? That is also me.',
      'I have been spinning here for millions of years. Nobody has ever said "good spin".'
    ],
    win:['Spin well, small rover. The archive needs you vertical more than it needs you tidy.']
  },
  siegfried:{
    name:'SIEGFRIED', sprite:'siegfried', tint:'#ff7a45',
    lines:[
      'FIFTEEN TIMES! Do you understand what that means? We came in at thirty-one miles an hour and BOUNCED fifteen times and it was WONDERFUL.',
      'The bags were five point eight metres across. FOUR bags, six lobes each. We wore the whole lot like a giant jacket.',
      'I am the garage. The little one is the hands. Between us we made most of what humanity knows about Mars.',
      'We came down in Ares Vallis because the rocks here are interesting. The rocks are STILL interesting. They never got bored.'
    ],
    win:['Fifteen bounces! You should have seen it! Well — you did see it. You were THERE. That was you. Amazing.']
  }
};

/* ---------- BEACON: the sarcastic mission-control voice ---------- */
const BEACON = {
  intro:'Welcome to Mars. Gravity is 38% of Earth, the air is 1%, and nothing out here will send you a strongly-worded letter.',
  hints:[
    'Collect the <b>memory shards</b>. Each one is a fact nobody has read in decades.',
    'Talk to the machines. Press <b>E</b> next to one. They have been alone a long time.',
    'Press <b>Q</b> to ping the orbital relay. It shows you what is hidden in the dust.',
    'The <b>Field Codex</b> fills in as you learn. Open it with <b>Tab</b>.',
    'Wrong quiz answers are allowed. They are simply archived with your name on them.',
    'Being scrapped is free. Being bored is not.',
    'Curiosity is the real currency. Everything else is just rust.'
  ],
  praise:[
    'Telemetry received. Your curiosity is becoming statistically unusual.',
    'Good. The Archive likes people who press buttons that beep.',
    'That is one more voice for the choir. The choir needs voices.',
    'You are doing the thing. The thing that people are for.',
    'Recorded. Filed. Slightly humoured.'
  ],
  idle:[
    'All systems nominal. Suspiciously nominal.',
    'Dust density rising. Your shoes are not Mars-suitable. Nothing is Mars-suitable.',
    'I am watching you be small on a big planet. I am enjoying it.',
    'Reminder: the dust devils are not on your side. They are not on anyone’s side.',
    'Solar margin is fine. Your knee is the thing I am worried about.',
    'The Archive says hello. It does not say it often. Do not waste it.',
    'Two machines have been awake longer than your entire species has had radios.',
    'Do not be alarmed. That noise is a dust devil. It is also not on your side.'
  ]
};

/* ======================================================================
   7) ACHIEVEMENTS — all of them are jokes
   ====================================================================== */
const ACHIEVEMENTS = [
  {id:'first_contact', icon:'👋', name:'FIRST CONTACT', desc:'Say hello to a machine that says hello back.'},
  {id:'wake_viking',    icon:'🛸', name:'WAKE-UP CALL', desc:'Boot Viking 1 after a forty-eight-year nap.'},
  {id:'bouncy',         icon:'🎈', name:'BOUNCY CASTLE', desc:'Bounce 15 times. Exactly like Pathfinder did.'},
  {id:'sojourner_truth',icon:'🌟', name:'SOJOURNER TRUTH', desc:'Recover every single Pathfinder memory.'},
  {id:'wright',         icon:'🚁', name:'WRIGHT BROTHERS MOMENT', desc:'Fly on another planet. Technically on Mars.'},
  {id:'flight72',       icon:'✈️', name:'SEVENTY-TWO FLIGHTS', desc:'Fly 72 times. The demo ended. You did not.'},
  {id:'full_choir',     icon:'🛰', name:'THE FULL CHOIR', desc:'Wake all three witnesses.'},
  {id:'scratch',        icon:'♻️', name:'REPAIRABLE ASSET', desc:'Get scrapped. Again. The rover takes it personally.'},
  {id:'quizzical',      icon:'🧠', name:'QUIZZICAL', desc:'Answer a question right on the first try.'},
  {id:'industrious',    icon:'⛏', name:'INDUSTRIOUS', desc:'Dig up buried memories.'},
  {id:'sweeper',        icon:'🧹', name:'COMPLETE SWEEP', desc:'Collect every memory in a single level.'},
  {id:'slowpoke',       icon:'🐌', name:'SOJOURNER PACE', desc:'Clear a level without running once.'},
  {id:'library',        icon:'📖', name:'LIBRARY CARD', desc:'Unlock half of the field codex.'},
  {id:'curious',        icon:'🔍', name:'INQUISITIVE', desc:'Reach 100% curiosity. You are now the mission.'},
  {id:'clean_sweep',    icon:'💯', name:'CLEAN SWEEP', desc:'Answer every single quiz correctly.'}
];

/* ---------- world signs (the jokes live here) ---------- */
const SIGNS = [
  ['MARS IS NOT A','VACUUM (MOSTLY)'],
  ['DO NOT FEED','THE MITES'],
  ['GRAVITY: 38%','OF EARTH'],
  ['IF YOU HEAR A','BOING, SORRY'],
  ['SAMPLES INSIDE','ARE FROM A','BETTER PLANET'],
  ['PLEASE DO NOT','LAND ON THE FLAG'],
  ['THE SAND IS','LOAD-BEARING'],
  ['THERE IS NO','SPOON HERE'],
  ['CURiosity','IS A GAS'],
  ['ALL ROVERS','ARE BEAUTIFUL'],
  ['IF IT SMELLS LIKE','SULFUR, DO NOT LICK IT'],
  ['THE DUST IS','LOAD-BEARING TOO']
];
const TICKER = [
  'Archive note: the Viking landers were renamed in 1982. The robots did not get a vote.',
  'Archive note: Pathfinder returned 2.3 billion bits. That is what a busy three months looks like.',
  'Archive note: Ingenuity flew 72 times. It was built for 5. Budgets are suggestions.',
  'Archive note: Mars is named after a war god who had a crush on Venus. Even the planet is petty.',
  'Archive note: a Martian sol is 24 hours and 39 minutes. Nobody asked. It just is.'
];

/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · AUDIO
   chiptune engine — square lead, triangle bass, noise
   ========================================================================== */
'use strict';
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


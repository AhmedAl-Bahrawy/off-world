/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · UTILITIES
   math + DOM helpers
   ========================================================================== */
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


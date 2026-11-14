/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · STATE
   save system, game/run/kit state, world container
   ========================================================================== */
'use strict';
/* ======================================================================
   10) SAVE / LOAD
   ====================================================================== */
const SAVE_KEY = 'offworld.mars.scene2.v2';
const SAVE_DEFAULT = {
  facts:[], quizzes:[], ach:[], bits:0, levels:[], tools:[], plays:0, talks:0, deaths:0,
  bounces:0, flights:0, digs:0, started:Date.now(), bestTime:{}
};
const SAVE = {
  data: JSON.parse(JSON.stringify(SAVE_DEFAULT)),
  load(){
    try{
      const raw = localStorage.getItem(SAVE_KEY);
      if(raw){
        const p = JSON.parse(raw);
        if(p && typeof p === 'object'){
          Object.keys(this.data).forEach(k=>{ if(p[k]!==undefined && p[k]!==null) this.data[k]=p[k]; });
        }
      }
    }catch(e){}
    return this.data;
  },
  save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); }catch(e){} },
  wipe(){ try{ localStorage.removeItem(SAVE_KEY); }catch(e){} this.data = JSON.parse(JSON.stringify(SAVE_DEFAULT)); }
};

/* ======================================================================
   11) GAME STATE
   ====================================================================== */
const G = {
  mode:'title',
  levelIdx:0,
  inLevel:false,
  bits:0,
  shards:0,
  levelShards:0,
  levelBits:0,
  bounces:0,
  flights:0,
  digs:0,
  time:0,
  levelTime:0,
  cam:{x:0, y:0},
  shake:0,
  hitStop:0,
  startedAt:0,
  bannerT:0,
  tickT:0,
  blink:0,
  bubble:{text:'', t:0, who:''},
  pendingQuiz:null,
  ended:false
};
const RUN = {
  facts:{},        // "tool:index" -> true
  quizzes:{},      // levelId -> 'right' | 'wrong'
  ach:{},          // id -> true
  levelsDone:{},   // levelId -> {time, bits, shards}
  bits:0,
  tools:{},        // tool id -> true
  talks:0,
  plays:0,
  deaths:0,
  bounces:0,
  flights:0,
  digs:0
};
/** Unlocked verbs, earned by learning. */
const KIT = {
  relay:false,     // Q — orbital relay ping (unlocked after Viking L1)
  bounce:false,    // double jump off airbags (unlocked after Pathfinder L4)
  fly:false,       // rotorcraft (unlocked after Ingenuity L7 briefing)
  dig:false        // sampler arm (unlocked after Viking L1)
};


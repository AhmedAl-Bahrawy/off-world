/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · QUIZ & LEVEL FLOW
   witness quizzes, start/complete level, banner
   ========================================================================== */
'use strict';
/* ======================================================================
   21) THE QUIZ — where the machine talks back
   ====================================================================== */
function openQuiz(levelIdx){
  const L = LEVELS[levelIdx];
  const tool = TOOL_BY_ID[L.tool];
  const c = $('quizCard');
  clear(c);
  c.appendChild(el('div', 'kicker', tool.name.toUpperCase() + ' ASKS — PICK THE ICON'));
  const q = el('div', 'quizQ');
  const qtext = pick(tool.quiz);
  q.innerHTML = qtext.q;
  c.appendChild(q);
  const verdict = el('div', 'quizVerdict');
  c.appendChild(verdict);
  let answered = false;
  qtext.opts.forEach(function(opt, i){
    const b = el('button', 'opt');
    b.innerHTML = '<span class="ico">' + opt.i + '</span>' + (opt.t ? '<span class="lbl">' + opt.t + '</span>' : '');
    b.onclick = function(){
      if(answered) return;
      answered = true;
      if(i === qtext.c){
        b.classList.add('good');
        sfx('right');
        RUN.quizzes['L' + L.id] = 'right';
        SAVE.data.quizzes = RUN.quizzes;
        checkAch('quizzical');
        verdict.innerHTML = '<b style="color:#44e3b8">CORRECT.</b> ' + qtext.why;
        verdict.style.color = '#f3c67e';
        floatText(P.x, P.y - 12, 'CORRECT!', '#44e3b8');
        burst(P.x + 6, P.y + 6, 12, '#44e3b8', 90, 0.7);
      } else {
        b.classList.add('bad');
        sfx('wrong');
        RUN.quizzes['L' + L.id] = 'wrong';
        SAVE.data.quizzes = RUN.quizzes;
        verdict.innerHTML = '<b style="color:#ff5d73">WRONG.</b> ' + qtext.why;
        verdict.style.color = '#f3c67e';
        floatText(P.x, P.y - 12, 'WRONG!', '#ff5d73');
      }
      refreshRails();
      const row = el('div', 'btnRow');
      const ok = el('button', 'btn primary', 'CONTINUE →');
      ok.onclick = function(){ hideOverlay('ovQuiz'); completeLevel(levelIdx); };
      row.appendChild(ok);
      c.appendChild(row);
    };
    c.appendChild(b);
  });
  G.mode = 'quiz';
  showOverlay('ovQuiz');
  sfx('quiz');
}

/* ======================================================================
   22) LEVEL FLOW
   ====================================================================== */
function startLevel(idx){
  G.levelIdx = idx;
  const L = LEVELS[idx];
  WORLD.level = L;
  const w = buildLevel(idx);
  WORLD.solids = w.solids; WORLD.blocks = w.blocks; WORLD.pickups = w.pickups;
  WORLD.shards = w.shards; WORLD.enemies = w.enemies; WORLD.movers = w.movers;
  WORLD.pads = w.pads; WORLD.winds = w.winds; WORLD.decor = w.decor;
  WORLD.signs = w.signs; WORLD.npcs = w.npcs; WORLD.goal = w.goal;
  WORLD.length = w.length; WORLD.spawn = w.spawn;
  WORLD.bg1 = w.bg1; WORLD.bg2 = w.bg2; WORLD.bg3 = w.bg3; WORLD.chunkX = w.chunkX;
  WORLD.goalSprite = w.goalSprite;
  /* dig levels bury two memories */
  if(L.gimmick === 'dig'){
    const spots = WORLD.blocks.filter(b=>b.type === 'buried');
    let n = Math.min(2, spots.length, WORLD.shards.length);
    for(let i=0;i<n;i++){
      const b = spots[i];
      const s = WORLD.shards.splice(WORLD.shards.length - 1, 1)[0];
      s.x = b.x + 9; s.y = b.y + 3; s.buried = true; s.hidden = true; s.revealed = false; s.needDig = true;
      b.shardRef = s;
      WORLD.shards.push(s);
    }
  }
  for(const s of WORLD.shards) if(s.y0 === undefined) s.y0 = s.y;
  resetPlayer(L);
  G.cam.x = 0;
  G.camSnap = true; G.look = 26;
  G.checkpoint = {x: WORLD.spawn.x, y: WORLD.spawn.y};
  G.attempts = 1;
  placeCheckpoints();
  placeRepairCells(L);
  G.levelTime = 0;
  G.levelShards = 0;
  G.levelBits = 0;
  G.pingCd = 0;
  G.usedRun = false;
  if(L.id === 7 && !KIT.fly){
    KIT.fly = true;
    setTick('<b>ROTORCRAFT</b> unlocked — hold H to fly. Thin air, lazy turns, hard landings.');
  }
  PARTS.length = 0;
  FLOATS.length = 0;
  PING.length = 0;
  G.mode = 'play';
  G.inLevel = true;
  RUN.plays++;
  SAVE.data.plays = RUN.plays;
  hideOverlay('ovTitle');
  hideOverlay('ovOver');
  hideOverlay('ovEnd');
  hideOverlay('ovPause');
  hideOverlay('ovCodex');
  hideOverlay('ovAch');
  hideOverlay('ovQuiz');
  showBanner('MISSION ' + String(L.id).padStart(2,'0'), L.title, L.sub, L.brief);
  musicStart(L.music);
  setTick(L.beacon);
  refreshRails();
  saveAll();
  /* first landing in a zone: the WITNESS FILE — meet the machine by eye */
  if(LEVELS.find(l=>l.zone === L.zone).id === L.id && !RUN.witnessed[L.zone]){
    RUN.witnessed[L.zone] = true;
    buildWitness(L.tool, function(){ G.mode = 'play'; });
  }
}
function completeLevel(idx){
  const L = LEVELS[idx];
  const tool = TOOL_BY_ID[L.tool];
  const got = levelFactsGot(L);
  RUN.levelsDone[L.id] = {time:Math.round(G.levelTime), bits:G.levelBits, shards:got};
  SAVE.data.levels = RUN.levelsDone;
  sfx('goal');
  burst(WORLD.goal.x + 10, WORLD.goal.y + 10, 26, '#ffd166', 140, 1.1);
  G.shake = 5;

  /* unlock verbs as you learn */
  if(L.id === 1){ KIT.relay = true; KIT.dig = true; setTick('<b>ORBITAL RELAY</b> unlocked — press Q to ping what is buried.'); }
  if(L.id === 4){ KIT.bounce = true; setTick('<b>AIRBAG BOUNCE</b> unlocked — press jump again in mid-air.'); }
  if(L.id === 7){ KIT.fly = true; setTick('<b>ROTORCRAFT</b> unlocked — hold H to fly. Thin air, lazy turns.'); }
  checkAch('full_choir');
  if(L.tool === 'viking') checkAch('wake_viking');
  if(L.tool === 'pathfinder' && levelFactsGot(L) === tool.facts.length) checkAch('sojourner_truth');
  if(L.tool === 'ingenuity' && RUN.flights >= 72) checkAch('flight72');
  if(RUN.flights > 0) checkAch('wright');
  if(!G.usedRun) checkAch('slowpoke');

  const c = $('overCard');
  clear(c);
  c.appendChild(el('div', 'kicker', 'MACHINE RESTORED'));
  c.appendChild(el('h2', null, tool.name.toUpperCase() + ' IS AWAKE'));
  const p = el('p');
  const def = NPCS[L.npc];
  p.innerHTML = def.win[0];
  c.appendChild(p);
  const sl = el('div', 'scoreline');
  const add = (label, val)=>{ const d = el('div'); const b = el('b', null, String(val)); d.appendChild(b); const s = document.createElement('span'); s.textContent = label; d.appendChild(s); sl.appendChild(d); };
  add('MEMORIES', got + '/' + L.facts.length);
  add('DATA BITS', G.levelBits);
  add('TIME', Math.round(G.levelTime) + 's');
  add('ATTEMPTS', G.attempts || 1);
  add('CURIOUSITY', curiosityPct() + '%');
  c.appendChild(sl);
  const row = el('div', 'btnRow');
  const nextIdx = idx + 1;
  const b1 = el('button', 'btn primary', nextIdx < LEVELS.length ? 'NEXT MISSION →' : 'FINISH →');
  b1.onclick = function(){
    hideOverlay('ovOver');
    if(nextIdx < LEVELS.length) startLevel(nextIdx);
    else { G.mode = 'end'; buildEnd(); showOverlay('ovEnd'); musicStart('epic'); }
  };
  const b2 = el('button', 'btn', '📖 CODEX');
  b2.onclick = ()=>{ buildCodex(); showOverlay('ovCodex'); };
  row.appendChild(b1); row.appendChild(b2);
  c.appendChild(row);
  G.mode = 'over';
  showOverlay('ovOver');
  refreshRails();
  saveAll();
}
function showBanner(kicker, title, sub, brief){
  $('bKicker').textContent = kicker;
  $('bTitle').textContent = title;
  $('bSub').textContent = sub;
  const b = $('bBrief');
  if(brief){ b.innerHTML = brief; b.classList.add('show'); } else b.classList.remove('show');
  $('banner').classList.add('show');
  G.bannerT = 4.6;
}

/* ======================================================================
   WITNESS FILE — learn each machine by EYE, not by paragraph.
   The real sprite is rendered huge from the art source with labelled
   callout dots. Shown once per zone on arrival, and from the codex.
   ====================================================================== */
function buildWitness(toolId, onNext){
  const tool = TOOL_BY_ID[toolId];
  const c = $('witnessCard');
  clear(c);
  c.appendChild(el('div', 'kicker', 'WITNESS FILE · ' + tool.code));
  c.appendChild(el('h2', null, tool.name.toUpperCase()));
  c.appendChild(el('p', 'muted', tool.role));
  const wrap = el('div', 'wgView');
  const spr = SPR[tool.diagram.sprite];
  const SC = 6;
  const cv = document.createElement('canvas');
  cv.width = spr.w * SC; cv.height = spr.h * SC;
  cv.getContext('2d').drawImage(spr.frames[0], 0, 0, cv.width, cv.height);
  wrap.appendChild(cv);
  for(const co of tool.diagram.callouts){
    const dot = el('div', 'wgDot' + (co.x > 0.6 ? ' right' : ''));
    dot.style.left = Math.round(co.x * spr.w * SC) + 'px';
    dot.style.top = Math.round(co.y * spr.h * SC) + 'px';
    dot.appendChild(el('span', 'wgTip', co.t));
    wrap.appendChild(dot);
  }
  c.appendChild(wrap);
  const row = el('div', 'btnRow');
  const b = el('button', 'btn primary', onNext ? '▶ GOT IT — START MISSION' : '← CLOSE');
  b.onclick = function(){
    hideOverlay('ovWitness');
    if(onNext){ onNext(); }
    else G.mode = (G.inLevel && G.mode !== 'title') ? 'play' : 'title';
  };
  row.appendChild(b);
  c.appendChild(row);
  G.mode = 'witness';               /* pause the world while studying */
  showOverlay('ovWitness');
}


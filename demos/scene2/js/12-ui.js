/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · UI
   overlays, toast, bubble, banner, codex, achievements, rails
   ========================================================================== */
'use strict';
/* ======================================================================
   19) ACHIEVEMENTS
   ====================================================================== */
function checkAch(id){
  if(RUN.ach[id]) return;
  const def = ACHIEVEMENTS.find(a=>a.id === id);
  if(!def) return;
  RUN.ach[id] = true;
  SAVE.data.ach.push(id);
  sfx('secret');
  showToast(def.icon, 'ACHIEVEMENT — ' + def.name, def.desc);
  refreshRails();
}
function levelFactsGot(level){
  let n = 0;
  for(let i=0;i<level.facts.length;i++) if(RUN.facts[level.tool + ':' + level.facts[i]]) n++;
  return n;
}

/* ======================================================================
   20) UI — rails, overlays, codex
   ====================================================================== */
function setTick(html){ $('tickText').innerHTML = html; }
function showToast(icon, title, sub){
  const t = $('toast');
  t.querySelector('.tIcon').textContent = icon;
  t.querySelector('.tBody b').textContent = title;
  t.querySelector('.tBody small').textContent = sub || '';
  t.classList.add('show');
  G.toastT = 5.2;
}
function showBubble(who, line){
  const b = $('bubble');
  b.querySelector('.alien').textContent = who;
  b.querySelector('.en').textContent = line;
  b.classList.add('show');
  G.bubble.t = 4.6;
  G.bubble.who = who;
}
function hideOverlay(id){
  const o = $(id);
  if(o) o.classList.remove('show');
}
function showOverlay(id){
  const o = $(id);
  if(o) o.classList.add('show');
}
function buildTitle(){
  const c = $('titleCard');
  clear(c);
  const h = el('div');
  h.appendChild(el('div', 'logo', 'MARS'));
  h.appendChild(el('div', 'sub', 'Scene 02 · The Three Witnesses'));
  const p = el('p', 'story');
  p.innerHTML = 'Humans are gone. Their machines still wait. <b>You are CURI-7</b> — wake the three witnesses, learn what they did, bring the archive home.';
  h.appendChild(p);
  const cast = el('div', 'cast');
  const castData = [
    ['VIGIL-1', 'Viking 1 lander. Awake since 1976. Exhausted. Grumpy. Photographic.'],
    ['SOJOURNER', '10.6 kg of confidence. Named after a woman who told the truth.'],
    ['INGY', '1.8 kg of helicopter. Flies on 1% air. Freaks out. Rightly.'],
    ['BEACON', 'Your mission-control voice. Sarcastic by policy, helpful by accident.']
  ];
  for(const cd of castData){
    const cc = el('div', 'castCard');
    cc.appendChild(el('b', null, cd[0]));
    cc.appendChild(el('small', null, cd[1]));
    cast.appendChild(cc);
  }
  h.appendChild(cast);
  const row = el('div', 'btnRow');
  row.style.justifyContent = 'center';
  const b1 = el('button', 'btn primary', RUN.plays > 0 ? '▶ CONTINUE' : '▶ BEGIN THE MISSION');
  b1.onclick = ()=>{ audioResume(); startLevel(nextPlayableLevel()); };
  const b2 = el('button', 'btn', '📖 FIELD CODEX');
  b2.onclick = ()=>{ audioResume(); buildCodex(); showOverlay('ovCodex'); G.mode = 'codex'; };
  row.appendChild(b1); row.appendChild(b2);
  h.appendChild(row);
  const foot = el('div', 'muted');
  foot.style.marginTop = '10px';
  foot.innerHTML = '<b>Controls</b> — A/D move · Space jump · E interact · Q relay ping · Shift sprint · Tab codex · Esc pause';
  h.appendChild(foot);
  c.appendChild(h);
}
function nextPlayableLevel(){
  for(let i=0;i<LEVELS.length;i++){
    if(!RUN.levelsDone[LEVELS[i].id]) return i;
  }
  return 0;
}
function buildPause(){
  const c = $('pauseCard');
  clear(c);
  c.appendChild(el('div', 'kicker', 'SYSTEMS HOLDING'));
  c.appendChild(el('h2', null, 'PAUSED'));
  const p = el('p');
  p.innerHTML = 'BEACON is holding its breath. Take your time.';
  c.appendChild(p);
  const row = el('div', 'btnRow');
  const b1 = el('button', 'btn primary', '▶ RESUME');
  b1.onclick = ()=>{ hideOverlay('ovPause'); G.mode = 'play'; audioResume(); };
  const b2 = el('button', 'btn', '📖 CODEX');
  b2.onclick = ()=>{ buildCodex(); showOverlay('ovCodex'); };
  const b3 = el('button', 'btn rust', '⏹ ABANDON MISSION');
  b3.onclick = ()=>{ hideOverlay('ovPause'); buildTitle(); showOverlay('ovTitle'); G.mode = 'title'; musicStart('menu'); };
  row.appendChild(b1); row.appendChild(b2); row.appendChild(b3);
  c.appendChild(row);
  const notes = el('div', 'muted');
  notes.style.marginTop = '10px';
  notes.innerHTML = 'Reset save lives in the top bar. The Archive does not judge you for doing it. Much.';
  c.appendChild(notes);
}
function buildCodex(){
  const c = $('codexCard');
  clear(c);
  const head = el('div');
  head.appendChild(el('div', 'kicker', 'THE FIELD CODEX'));
  head.appendChild(el('h2', null, 'WHAT THE MACHINES DID'));
  const p = el('p', 'muted');
  p.innerHTML = 'Every memory lands here. <b>Joke</b> = field note · <b>fact</b> = the true part.';
  head.appendChild(p);
  c.appendChild(head);
  for(const tool of TOOLS){
    const sec = el('div');
    sec.style.marginTop = '12px';
    const h3 = el('h3', null, tool.name.toUpperCase());
    h3.style.cssText = 'margin:0 0 6px;font-size:11px;letter-spacing:.16em;color:' + tool.code + ';display:flex;align-items:center;gap:8px';
    const dg = el('button', 'btn', '🛰 FILE');
    dg.style.fontSize = '10px';
    dg.onclick = function(){ audioResume(); buildWitness(tool.id); };
    h3.appendChild(dg);
    const n = tool.facts.filter((f,i)=>RUN.facts[tool.id+':'+i]).length;
    const cnt = el('span', null, n + '/' + tool.facts.length);
    cnt.style.marginLeft = 'auto';
    cnt.style.color = '#8e97d6';
    h3.appendChild(cnt);
    sec.appendChild(h3);
    const kv = el('div', 'kv');
    kv.innerHTML = '<span>' + tool.site + '</span><span>' + tool.coords + '</span>';
    sec.appendChild(kv);
    const kv2 = el('div', 'kv');
    kv2.innerHTML = '<span>LANDED</span><span>' + tool.landed + '</span>';
    sec.appendChild(kv2);
    const kv3 = el('div', 'kv');
    kv3.innerHTML = '<span>WORKED UNTIL</span><span>' + tool.span + '</span>';
    sec.appendChild(kv3);
    const rp = el('p', 'muted');
    rp.style.margin = '6px 0 8px';
    rp.innerHTML = tool.role;
    sec.appendChild(rp);
    for(let i=0;i<tool.facts.length;i++){
      const known = !!RUN.facts[tool.id + ':' + i];
      const e = el('div', 'entry');
      const eh = el('div', 'eh');
      eh.appendChild(el('b', null, known ? tool.facts[i].h : '— UNRECOVERED —'));
      if(known) eh.appendChild(el('span', 'tag', 'VERIFIED'));
      e.appendChild(eh);
      if(known){
        const fp = el('p');
        fp.innerHTML = tool.facts[i].f;
        e.appendChild(fp);
        const jp = el('div', 'joke');
        jp.textContent = tool.facts[i].j;
        e.appendChild(jp);
      } else {
        const lp = el('div', 'lockedF', 'This memory is still out there somewhere. Go and find it.');
        e.appendChild(lp);
      }
      sec.appendChild(e);
    }
    c.appendChild(sec);
  }
  const row = el('div', 'btnRow');
  const b = el('button', 'btn primary', '← CLOSE');
  b.onclick = ()=>{ hideOverlay('ovCodex'); if(G.mode === 'codex') G.mode = (G.inLevel ? 'play' : 'title'); };
  row.appendChild(b);
  c.appendChild(row);
}
function buildAch(){
  const c = $('achCard');
  clear(c);
  c.appendChild(el('div', 'kicker', 'THE TROPHY CABINET'));
  c.appendChild(el('h2', null, 'ACHIEVEMENTS'));
  const p = el('p', 'muted');
  p.innerHTML = 'Most of these are jokes. All of them are earned.';
  c.appendChild(p);
  const list = el('div', 'achList');
  for(const a of ACHIEVEMENTS){
    const got = !!RUN.ach[a.id];
    const d = el('div', 'ach' + (got ? ' got' : ''));
    d.appendChild(el('span', 'aIco', a.icon));
    const t = el('div');
    t.appendChild(el('b', null, a.name));
    t.appendChild(el('small', null, a.desc));
    d.appendChild(t);
    list.appendChild(d);
  }
  c.appendChild(list);
  const row = el('div', 'btnRow');
  const b = el('button', 'btn primary', '← CLOSE');
  b.onclick = ()=>{ hideOverlay('ovAch'); if(G.mode === 'ach') G.mode = (G.inLevel ? 'play' : 'title'); };
  row.appendChild(b);
  c.appendChild(row);
}
function showOver(how){
  G.mode = 'over';
  const c = $('overCard');
  clear(c);
  c.appendChild(el('div', 'kicker', 'HULL BREACH'));
  c.appendChild(el('h2', null, 'SCRAPPED'));
  const quips = {
    mite:'A dust mite got you. It was very small and very pleased about it.',
    fell:'You fell off the world. Again. Gravity: 38% of Earth, 100% of the point.',
    wasp:'A regolith wasp took your antenna. It was defending its nest, which is a rock.',
    boom:'Something out there hit you. The universe remains extremely unserious.'
  };
  const p = el('p');
  p.innerHTML = quips[how] || quips.boom;
  c.appendChild(p);
  const m = el('p', 'muted');
  m.innerHTML = 'Nothing was lost but dignity, and a little time. The Archive is not writing this down.';
  c.appendChild(m);
  const row = el('div', 'btnRow');
  const b1 = el('button', 'btn primary', '⟲ REASSEMBLE');
  b1.onclick = ()=>{
    hideOverlay('ovOver');
    G.mode = 'play';
    G.hull = 3;
    G.attempts = (G.attempts || 1) + 1;
    respawnAtCheckpoint();
  };
  const b2 = el('button', 'btn', '⏹ TITLE');
  b2.onclick = ()=>{ hideOverlay('ovOver'); buildTitle(); showOverlay('ovTitle'); G.mode = 'title'; musicStart('menu'); };
  row.appendChild(b1); row.appendChild(b2);
  c.appendChild(row);
}
function buildEnd(){
  const c = $('endCard');
  clear(c);
  c.appendChild(el('div', 'logo', 'ARCHIVE RESTORED'));
  c.appendChild(el('div', 'sub', 'All three witnesses awake'));
  const p = el('p', 'story');
  p.innerHTML = 'All three witnesses awake. <b>The Archive has every voice back — including yours.</b>';
  c.appendChild(p);
  const sl = el('div', 'scoreline');
  const add = (label, val)=>{ const d = el('div'); d.appendChild(el('b', null, String(val))); d.appendChild(document.createTextNode('')); const s = document.createElement('span'); s.textContent = label; d.appendChild(s); sl.appendChild(d); };
  add('FACTS RECOVERED', Object.keys(RUN.facts).length + '/' + (TOOLS.reduce((a,t)=>a+t.facts.length,0)));
  add('DATA BITS', RUN.bits);
  add('QUIZZES RIGHT', Object.keys(RUN.quizzes).filter(k=>RUN.quizzes[k]==='right').length);
  add('ACHIEVEMENTS', Object.keys(RUN.ach).length + '/' + ACHIEVEMENTS.length);
  add('TIMES SCRAPPED', RUN.deaths);
  add('CURIOUSITY', curiosityPct() + '%');
  c.appendChild(sl);
  const row = el('div', 'btnRow');
  row.style.justifyContent = 'center';
  const b1 = el('button', 'btn primary', '⟲ RUN IT AGAIN');
  b1.onclick = ()=>{ hideOverlay('ovEnd'); buildTitle(); showOverlay('ovTitle'); G.mode = 'title'; musicStart('menu'); };
  const b2 = el('button', 'btn', '📖 CODEX');
  b2.onclick = ()=>{ buildCodex(); showOverlay('ovCodex'); };
  row.appendChild(b1); row.appendChild(b2);
  c.appendChild(row);
}
function curiosityPct(){
  const total = TOOLS.reduce((a,t)=>a + t.facts.length, 0);
  return Math.min(100, Math.round(Object.keys(RUN.facts).length / total * 100));
}

/* ======================================================================
   23) RAILS
   ====================================================================== */
function refreshRails(){
  /* zones */
  const zl = $('zoneList');
  clear(zl);
  const zones = [
    {id:'viking', name:'CHRYSE PLANITIA', sub:'Viking 1 · 1976–1982'},
    {id:'pathfinder', name:'ARES VALLIS', sub:'Pathfinder · 1997'},
    {id:'ingenuity', name:'JEZERO CRATER', sub:'Ingenuity · 2021–2024'}
  ];
  let awake = 0;
  zones.forEach(function(z, i){
    const firstIdx = LEVELS.findIndex(l=>l.zone === z.id);
    const done = LEVELS.filter(l=>l.zone === z.id).every(l=>RUN.levelsDone[l.id]);
    const open = !done && (i === 0 || RUN.levelsDone[zones[i-1].id + ''] !== undefined || zones.slice(0,i).every(zz=>{
      return LEVELS.filter(l=>l.zone===zz.id).every(l=>RUN.levelsDone[l.id]);
    }));
    const tab = el('div', 'zoneTab' + (done ? ' done' : '') + (open ? ' active' : '') + (open ? '' : ' locked'));
    tab.appendChild(el('div', 'num', String(i+1)));
    const nm = el('div', 'nm');
    nm.appendChild(el('b', null, z.name));
    nm.appendChild(el('small', null, z.sub));
    tab.appendChild(nm);
    if(done) awake++;
    tab.onclick = function(){
      if(open || done){ startLevel(firstIdx); }
      else setTick('That zone is still dark. Wake the machines before it.');
    };
    zl.appendChild(tab);
  });
  $('zoneCount').textContent = awake + '/3';

  /* missions */
  const ml = $('missionList');
  clear(ml);
  let cur = '';
  let doneCount = 0;
  for(let i=0;i<LEVELS.length;i++){
    const L = LEVELS[i];
    if(L.zone !== cur){
      cur = L.zone;
      ml.appendChild(el('div', 'missionTitle', cur === 'viking' ? 'VIKING 1' : (cur === 'pathfinder' ? 'PATHFINDER' : 'INGENUITY')));
    }
    const done = !!RUN.levelsDone[L.id];
    if(done) doneCount++;
    const open = done || isLevelOpen(i);
    const m = el('div', 'mission' + (done ? ' done' : '') + (open && !done ? ' open' : '') + (open ? '' : ' locked'));
    m.appendChild(el('div', 'no', String(L.id)));
    const nm = el('div', 'nm');
    nm.appendChild(el('b', null, L.title));
    nm.appendChild(el('small', null, L.sub));
    m.appendChild(nm);
    const st = el('div', 'st');
    if(done){ st.textContent = '✔'; st.style.color = '#44e3b8'; }
    m.onclick = function(){ if(open) startLevel(i); };
    ml.appendChild(m);
  }
  $('missionCount').textContent = doneCount + '/' + LEVELS.length;

  /* kit */
  const kl = $('powerList');
  clear(kl);
  const kitItems = [
    ['relay', '📡 ORBITAL RELAY', 'Q — ping the uplink, reveal what is hidden in the dust.'],
    ['dig', '🦾 SAMPLER ARM', 'E — dig regolith mounds and unearth buried memories.'],
    ['bounce', '🎈 AIRBAG BOUNCE', 'Jump again in mid-air. Pathfinder approved.'],
    ['fly', '🚁 ROTORCRAFT', 'Hold H — one percent air, lazy turns, hard landings.']
  ];
  let any = false;
  for(const k of kitItems){
    if(!KIT[k[0]]) continue;
    any = true;
    const d = el('div');
    d.style.marginBottom = '5px';
    d.innerHTML = '<b>' + k[1] + '</b><br>' + k[2];
    kl.appendChild(d);
  }
  if(!any) kl.innerHTML = 'No tools recovered yet.<br>Find the machines. Learn what they did.';

  /* codex list */
  const cl = $('codexList');
  clear(cl);
  let totalFacts = 0, gotFacts = 0;
  for(const tool of TOOLS){
    const n = tool.facts.filter((f,i)=>RUN.facts[tool.id+':'+i]).length;
    totalFacts += tool.facts.length; gotFacts += n;
    const row = el('div', 'codexRow' + (n ? ' got' : ''));
    row.appendChild(el('div', 'dot', n ? String(n) : '—'));
    const nm = el('div', 'nm');
    nm.appendChild(el('b', null, tool.name));
    nm.appendChild(el('small', null, tool.role));
    row.appendChild(nm);
    row.onclick = function(){ buildCodex(); showOverlay('ovCodex'); if(G.mode === 'play') G.mode = 'codex'; };
    cl.appendChild(row);
  }
  $('codexCount').textContent = gotFacts + '/' + totalFacts;

  /* stats */
  $('stBits').textContent = RUN.bits;
  $('stKnow').textContent = gotFacts + '/' + totalFacts;
  $('stTools').textContent = Object.keys(RUN.tools).length;
  $('stCur').textContent = curiosityPct() + '%';
  $('curFill').style.width = curiosityPct() + '%';
  $('achFill').style.width = (Object.keys(RUN.ach).length / ACHIEVEMENTS.length * 100) + '%';
  $('achCount').textContent = Object.keys(RUN.ach).length;
  /* the two long-game trophies */
  if(curiosityPct() >= 100) checkAch('curious');
  if(LEVELS.every(l=>RUN.quizzes['L' + l.id] === 'right')) checkAch('clean_sweep');

  /* objective bar */
  const L = WORLD.level;
  if(L && G.inLevel){
    $('objText').innerHTML = '<b>' + L.goal + '</b>';
    const chips = $('objChips');
    clear(chips);
    const total = L.facts.length;
    const got = countLevelShards();
    const c1 = el('span', 'chip' + (got >= total ? ' on' : ''), 'MEMORIES ' + got + '/' + total);
    chips.appendChild(c1);
    if(KIT.relay) chips.appendChild(el('span', 'chip on', 'Q RELAY'));
    if(KIT.bounce) chips.appendChild(el('span', 'chip on', 'BOUNCE'));
    if(KIT.fly) chips.appendChild(el('span', 'chip on', 'FLY H'));
  }
}
function isLevelOpen(i){
  for(let j=0;j<i;j++){
    if(!RUN.levelsDone[LEVELS[j].id]) return false;
  }
  return true;
}
function saveAll(){
  SAVE.data.bits = RUN.bits;
  SAVE.data.facts = Object.keys(RUN.facts);
  SAVE.data.ach = Object.keys(RUN.ach);
  SAVE.data.quizzes = RUN.quizzes;
  SAVE.data.levels = RUN.levelsDone;
  SAVE.data.tools = Object.keys(RUN.tools);
  SAVE.data.talks = RUN.talks;
  SAVE.data.plays = RUN.plays;
  SAVE.data.deaths = RUN.deaths;
  SAVE.data.bounces = RUN.bounces;
  SAVE.data.flights = RUN.flights;
  SAVE.data.digs = RUN.digs;
  SAVE.data.witnessed = RUN.witnessed;
  SAVE.save();
}


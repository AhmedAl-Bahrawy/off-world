/* ======================================================================
   OFF-WORLD — SCENE 02 : MARS · DATA — THE ARCHIVE
   Three real machines. Thirty real facts. One short joke each.
   Quizzes are ICON-CHOICE: pick the picture, not the paragraph.
   Each tool carries `diagram` — the labelled sprite callouts shown in
   the WITNESS FILE overlay (see 12-ui.js).
   ====================================================================== */
'use strict';

const TOOLS = [
{
  id:'viking', num:1, code:'VIG',
  name:'Viking 1',
  site:'CHRYSE PLANITIA', coords:'22.48° N, 47.94° W',
  landed:'20 Jul 1976', span:'Worked until 11 Nov 1982',
  role:'First truly successful Mars landing — and the first machine to work another planet for years.',
  sprite:'vigil', npc:'vigil',
  diagram:{
    sprite:'vigil',
    callouts:[
      {x:.5,  y:.10, t:'1.5 m dish antenna'},
      {x:.28, y:.52, t:'biology lab + GCMS'},
      {x:.72, y:.52, t:'SNAP-19 nuclear batteries'},
      {x:.30, y:.88, t:'three legs, footpads'},
    ]
  },
  facts:[
    {h:'THE FIRST REAL LANDING', f:'Touched down <b>20 July 1976</b> — the first fully successful Mars landing.',
     j:'Mars 3 landed in 1971… for one second. Awkward.'},
    {h:'28 KM FROM HOME', f:'Came down <b>28 km</b> from the targeted spot. Mars shrugged.',
     j:'“You had ONE address.” — Mars, moving it down the road.'},
    {h:'THE BACKUP WON', f:'The prime spacecraft failed pre-launch; the <b>spare</b> flew and became Viking 1.',
     j:'Billion-dollar benchwarmer becomes the legend.'},
    {h:'LAST-MINUTE VENUE CHANGE', f:'Orbiter photos showed the first site too rough, so the landing moved to <b>Chryse Planitia</b>.',
     j:'Mars ghosted the original plan. Relatable.'},
    {h:'MAP OF A PLANET', f:'The Viking orbiters returned <b>52,663 images</b> — ~97% of Mars mapped.',
     j:'Mapped a planet with a fax machine and a dream.'},
    {h:'FIRST COLOR PANORAMA', f:'First <b>300° color panorama</b> taken on another planet.',
     j:'It did not ask the desert for consent.'},
    {h:'COLD, THEN LESS COLD', f:'Recorded <b>−86 °C</b> before dawn, warming to <b>−33 °C</b> in the afternoon.',
     j:'Forecast: freezing, dark, no complaints department.'},
    {h:'SCOOP DAY 8', f:'On <b>28 July 1976</b> the arm fed its first soil into the biology lab.',
     j:'Eight days in, poking dirt. Deeply relatable.'},
    {h:'THE FAMOUS MAYBE', f:'Life tests read <b>weakly positive</b>; the organics test said <b>negative</b>. Verdict: inconclusive.',
     j:'The most famous “maybe?” in space history.'},
    {h:'SIX YEARS ON DIRT', f:'Ran until <b>1982</b> — a bad uplink command ended it. Renamed <b>Mutch Memorial Station</b>.',
     j:'Got renamed for being the best at staying alive.'}
  ],
  quiz:[
    {q:'Pick Viking 1’s landing date.',
     opts:[{i:'🗓',t:'Jul 1976'},{i:'🎇',t:'Jul 1997'},{i:'🚁',t:'Apr 2021'},{i:'🤖',t:'Dec 1996'}], c:0,
     why:'20 July 1976. The others belong to Pathfinder and Ingenuity.'},
    {q:'What kept Viking alive through the dark?',
     opts:[{i:'☀️',t:'Solar panels'},{i:'☢️',t:'Nuclear batteries'},{i:'🔋',t:'One big battery'},{i:'💨',t:'Wind power'}], c:1,
     why:'Two SNAP-19 RTGs. No sun required — that is how it survived the dust storms.'},
    {q:'The biology lab’s final answer about life?',
     opts:[{i:'🎉',t:'Confirmed!'},{i:'🤷',t:'Maybe…'},{i:'🦴',t:'Found a fossil'},{i:'☣️',t:'Soil is spicy'}], c:1,
     why:'Inconclusive. Still the most honest answer science has given about Mars life.'}
  ]
},
{
  id:'pathfinder', num:2, code:'BAG',
  name:'Mars Pathfinder + Sojourner',
  site:'ARES VALLIS', coords:'19.13° N, 325.65° W',
  landed:'4 Jul 1997', span:'Final transmission 27 Sep 1997',
  role:'Proved you could bounce onto Mars on airbags — and delivered the first free-roaming rover.',
  sprite:'siegfried', npc:'sojourner',
  diagram:{
    sprite:'siegfried',
    callouts:[
      {x:.5,  y:.08, t:'airbag petals, folded open'},
      {x:.30, y:.38, t:'Sojourner — 30 cm tall'},
      {x:.68, y:.30, t:'high-gain antenna'},
      {x:.5,  y:.80, t:'solar panels inside'},
    ]
  },
  facts:[
    {h:'BOUNCY-CASTLE LANDING', f:'First <b>airbag landing</b> on another planet: chute, then bags inflate <b>100 m</b> up.',
     j:'Mars has no runway. Mars has a bouncy castle.'},
    {h:'FIFTEEN TIMES', f:'Hit at <b>14 m/s</b>, bounced <b>15+ times</b> up to <b>15 m</b> high, rolled ~1 km.',
     j:'Fifteen bounces, one kilometre, then a photo op. Iconic.'},
    {h:'THE BAGS', f:'Array <b>5.8 m</b> across — 4 bags, 6 lobes each. Tested by hitting it with engineers.',
     j:'Tested a giant airbag by hitting it. With humans. NASA.'},
    {h:'A TINY ROVER', f:'Sojourner: <b>10.6 kg</b>, <b>30 cm</b> tall, six wheels.',
     j:'Shorter than a desk plant. Out-worked all of them.'},
    {h:'THE RAMP', f:'Sol 2: stood up and rolled down a <b>20° ramp</b>, alone, in the dark.',
     j:'One small roll for robot-kind. No safety briefing.'},
    {h:'TWO FAMOUS NAMES', f:'Lander = <b>Carl Sagan Memorial Station</b>. Rover named for <b>Sojourner Truth</b>.',
     j:'Named after someone whose whole thing was truth. Fitting.'},
    {h:'ROCK JUDGE', f:'Sojourner’s <b>APXS</b> spectrometer read the chemistry of rocks and soil.',
     j:'A lab with no hands. It just pointed and judged.'},
    {h:'2.3 BILLION BITS', f:'Returned <b>2.3 billion bits</b>: 16,500+ lander images, 15 chemical analyses.',
     j:'Three months of homework, measured in machine time.'},
    {h:'WARM AND WET', f:'Rounded pebbles = ancient <b>running water</b>; a flood like the <b>Great Lakes in 2 weeks</b>.',
     j:'Martian flood insurance: not available, then or now.'},
    {h:'FIRST MARTIAN WEATHER REPORT', f:'Measured <b>dust devils</b>, morning <b>ice clouds</b>, magnetic dust.',
     j:'Forecast: breezy, with occasional violence.'}
  ],
  quiz:[
    {q:'How did Pathfinder land?',
     opts:[{i:'🦵',t:'Rocket legs'},{i:'🎈',t:'Giant airbags'},{i:'🪂',t:'Chute only'},{i:'🛰',t:'Dropped cold'}], c:1,
     why:'Chute plus the first airbag system on another planet. Boing.'},
    {q:'How many bounces?',
     opts:[{i:'3',t:''},{i:'7',t:''},{i:'15',t:'+'},{i:'40',t:''}], c:2,
     why:'Fifteen-plus, up to 15 m high, then a one-kilometre roll.'},
    {q:'Who was Sojourner named after?',
     opts:[{i:'🔭',t:'Carl Sagan'},{i:'✊',t:'Sojourner Truth'},{i:'🛰',t:'Mariner 9'},{i:'🚢',t:'A ship'}], c:1,
     why:'Sojourner Truth, the civil-rights crusader. The lander got Sagan’s name.'},
    {q:'Rounded pebbles mean Mars was…',
     opts:[{i:'💧',t:'Warm and wet'},{i:'🪨',t:'Solid rock'},{i:'🛢',t:'Full of oil'},{i:'🤷',t:'…nothing'}], c:0,
     why:'Pebbles round off in running water. Mars had a river flood once.'}
  ]
},
{
  id:'ingenuity', num:3, code:'HEL',
  name:'Ingenuity Mars Helicopter',
  site:'JEZERO CRATER', coords:'18.44° N, 77.45° W',
  landed:'18 Feb 2021', span:'First flight 19 Apr 2021 – last 18 Jan 2024',
  role:'The first aircraft to fly on another planet — then it kept flying, long past plan.',
  sprite:'coper_idle', npc:'ingy',
  diagram:{
    sprite:'coper_idle',
    callouts:[
      {x:.5,  y:.08, t:'twin 1.2 m counter-rotors'},
      {x:.5,  y:.42, t:'solar panel (charges 90 s of flight)'},
      {x:.24, y:.72, t:'four landing legs'},
      {x:.76, y:.60, t:'color camera'},
    ]
  },
  facts:[
    {h:'WRIGHT BROTHERS MOMENT', f:'<b>19 April 2021</b> — first powered, controlled flight on another planet.',
     j:'The sky on Mars is a legally different address.'},
    {h:'FIVE BECAME SEVENTY-TWO', f:'Built for <b>5 test flights</b>. Flew <b>72</b> over three years.',
     j:'Finest budget overrun in the solar system.'},
    {h:'FEATHERWEIGHT', f:'<b>1.8 kg</b> on Earth, <b>0.68 kg</b> on Mars, rotors <b>1.2 m</b> tip to tip.',
     j:'On Mars it weighs less than a loaf of bread.'},
    {h:'ONE PERCENT AIR', f:'Mars air is <b><1% as dense</b> as Earth’s — blades must be huge and slow.',
     j:'A helicopter arguing with air that is mostly not there.'},
    {h:'90 SECONDS PER SOL', f:'Solar-charged battery: ~<b>90 s</b> of flight, <b>350 W</b>, range <b>300 m</b>.',
     j:'Fly 90 seconds, sunbathe all day. Work-life balance.'},
    {h:'CAREER TOTALS', f:'<b>128.8 min</b> airborne, <b>17 km</b> flown, top speed <b>10 m/s</b>, altitude <b>24 m</b>.',
     j:'Seventeen km on a world where air is a rumour.'},
    {h:'POCKET DEPARTURE', f:'Rode to Mars <b>under Perseverance’s belly</b>, unfolded on the surface.',
     j:'A helicopter in a jacket pocket. Genuinely insane.'},
    {h:'THE SECOND CAREER', f:'Became an <b>aerial scout</b>, previewing terrain for the rover.',
     j:'Promoted from line item to colleague in one year.'},
    {h:'THE LAST FLIGHT', f:'Final flight <b>18 Jan 2024</b> — a rotor blade broke on landing. Mission over.',
     j:'Ended with a bent blade and a puff of dust.'},
    {h:'WHAT IT PROVED', f:'Flight on Mars is possible. The future of exploration now <b>has rotors</b>.',
     j:'Somewhere, a Wright brother is doing a tiny fist pump.'}
  ],
  quiz:[
    {q:'Pick the first flight on another planet.',
     opts:[{i:'🚁',t:'Apr 2021'},{i:'🎇',t:'Jul 1997'},{i:'🛬',t:'Jul 1976'},{i:'📅',t:'Jul 2020'}], c:0,
     why:'19 April 2021 — Ingenuity’s hop went down in history.'},
    {q:'Flights designed vs. flown?',
     opts:[{i:'5',t:'designed'},{i:'12',t:''},{i:'30',t:''},{i:'72',t:'flown'}], c:0,
     why:'Five was the plan. Seventy-two was reality.'},
    {q:'Mars air vs Earth air?',
     opts:[{i:'1',t:'percent'},{i:'10',t:'percent'},{i:'50',t:'percent'},{i:'100',t:'percent'}], c:0,
     why:'Under 1%. That is why the blades are huge and landings are hard.'},
    {q:'How many flights did Ingenuity actually make?',
     opts:[{i:'5',t:''},{i:'19',t:''},{i:'72',t:''},{i:'120',t:''}], c:2,
     why:'Seventy-two, ending 18 January 2024.'}
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
  brief:'A three-legged machine has been on shift since 1976. Wake it.',
  goal:'Find Viking 1 and shake its hand',
  facts:[0,1,3,5],
  beacon:'Chryse Planitia. Flat, dusty, and full of machines with no days off.'
},
{
  id:2, zone:'viking', tool:'viking', npc:'vigil', gimmick:'dig', chunks:8, seed:202, music:'tight',
  title:'THE SAMPLE ARM', sub:'Dig where the diggers dug',
  brief:'In 1976 the arm scooped soil and started a 50-year argument. Dig it up.',
  goal:'Dig up the memories and reach the sampler',
  facts:[7,8,6],
  beacon:'Dig with E. Regolith is not a punishment, it is a filing system.'
},
{
  id:3, zone:'viking', tool:'viking', npc:'vigil', gimmick:'storm', chunks:8, seed:303, music:'tight',
  title:'THE LONG WINTER', sub:'Survive the dust, reach the radio',
  brief:'A dust storm rolls in. Viking ran on plutonium; you run on stubborn.',
  goal:'Cross the storm and boot the lander',
  facts:[2,4,9],
  beacon:'Storm warning: visibility down, grit up, dignity equal to grit.'
},
{
  id:4, zone:'pathfinder', tool:'pathfinder', npc:'siegfried', gimmick:'bounce', chunks:9, seed:404, music:'drive',
  title:'FIFTEEN BOUNCES', sub:'Learn the airbag bounce',
  brief:'In 1997 something hit Mars at 31 mph and bounced 15 times. On purpose. You next.',
  goal:'Bounce 15 times and reach the lander',
  facts:[0,1,2],
  beacon:'New skill: AIRBAG BOUNCE. Press jump again in mid-air. Land flat.'
},
{
  id:5, zone:'pathfinder', tool:'pathfinder', npc:'sojourner', gimmick:'escort', chunks:9, seed:505, music:'drive',
  title:'THE ROVER STANDS UP', sub:'Walk with Sojourner',
  brief:'A 10 kg rover rolled down a ramp alone. It has opinions. Hear them.',
  goal:'Escort Sojourner to the lander',
  facts:[3,4,5,6],
  beacon:'Sojourner has been alone for 29 years. It will absolutely talk about it.'
},
{
  id:6, zone:'pathfinder', tool:'pathfinder', npc:'siegfried', gimmick:'wind', chunks:9, seed:606, music:'epic',
  title:'WARM AND WET', sub:'Find the evidence of the flood',
  brief:'The rocks here carry receipts of an ancient ocean. Collect them.',
  goal:'Gather the evidence and reach Pathfinder',
  facts:[7,8,9],
  beacon:'Ares Vallis: god of war, Latin for valley, excellent rocks.'
},
{
  id:7, zone:'ingenuity', tool:'ingenuity', npc:'ingy', gimmick:'flight', chunks:9, seed:707, music:'sky',
  title:'THE WRIGHT BROTHERS MOMENT', sub:'Take the controls',
  brief:'Fly a 1.8 kg helicopter where air is 1% of Earth’s. It is fine. Everything is fine.',
  goal:'Fly to the helicopter and lift off',
  facts:[0,3,6],
  beacon:'New skill: ROTORCRAFT. Hold H to fly. Landing is the hard part.'
},
{
  id:8, zone:'ingenuity', tool:'ingenuity', npc:'gusto', gimmick:'skywind', chunks:9, seed:808, music:'sky',
  title:'SEVENTY-TWO FLIGHTS', sub:'Fly the long way round',
  brief:'Five flights was the plan. The wind does not care about your schedule.',
  goal:'Reach the far pad — the batteries are not what they were',
  facts:[1,4,5],
  beacon:'90 seconds of flight, then sit in the sun. Mars work-life balance.'
},
{
  id:9, zone:'ingenuity', tool:'ingenuity', npc:'ingy', gimmick:'precision', chunks:9, seed:909, music:'epic',
  title:'THE LAST FLIGHT', sub:'Land it like it matters',
  brief:'One bent blade ended the real mission. Land this one clean.',
  goal:'Land on the pad and wake the archive',
  facts:[2,7,8,9],
  beacon:'Make it, and the Archive has all three voices. Then home. Except us.'
}
];
const LEVEL_BY_ID = {};
LEVELS.forEach((l,i)=>{ l.index=i; LEVEL_BY_ID[l.id]=l; });

/* ======================================================================
   6) THE CAST — short lines, big personalities
   ====================================================================== */
const NPCS = {
  vigil:{
    name:'VIGIL-1', sprite:'vigil', tint:'#ffd166',
    lines:[
      'Oh. Hello. Is it Tuesday? I have lost count of the Tuesdays.',
      'I photographed the same dirt for six years. Nobody asked one question.',
      'I run on plutonium. Do not make a face. I am also very tired.',
      'The orbiter used to be overhead. Then it was not. Then… a long time.',
      'I saw a storm swallow the whole sky. I kept taking pictures. What else?'
    ],
    win:[
      'Four scoops of soil, and the century got its “maybe”. Somebody finally asked.',
      'Be gentler with my pictures than the dust was.'
    ]
  },
  sojourner:{
    name:'SOJOURNER', sprite:'sojourner', tint:'#ffd166',
    lines:[
      'Named after a woman who told the truth for a living. I am never wrong.',
      '10.6 kg. 30 cm tall. Six wheels. Unlimited opinions.',
      'The lander calls me its “payload”. The lander is a garage with ambitions.',
      'I rolled down a 20° ramp in the dark. Nobody held my wheel. I remember.',
      'I have judged many rocks. They were mostly fine. Mostly.'
    ],
    win:[
      'Warm and wet. Rounded pebbles. I said it first. I always say it first.',
      'Thank you for the lift. Try not to tilt me.'
    ]
  },
  ingy:{
    name:'INGY', sprite:'coper_idle', tint:'#ffd166',
    lines:[
      'Hi! Hello! Did you SEE that? That was FLIGHT. On a PLANET.',
      'Built for five flights. Five! I have done… rather more than five.',
      'The air here is one percent. One! These blades argue with it for hours.',
      'I spent seven months folded under a rover’s belly. It was a lot.',
      '90 seconds of flying, then I sunbathe. It is a good small life.'
    ],
    win:[
      'I flew on another planet. They called it the Wright Brothers Moment. I blushed.',
      'Go wake the others. I will hold the rotors.'
    ]
  },
  gusto:{
    name:'GUSTO-9', sprite:'gusto', tint:'#44e3b8',
    lines:[
      'I am a dust devil! I spin! I pick up dust and I do NOT apologise.',
      'I have rearranged several dunes today. You are welcome.',
      'Winds up to 100 km/h. Feel it? That is also me.',
      'Millions of years spinning here. Nobody once said “good spin”.'
    ],
    win:['Spin well, small rover. Vertical beats tidy.']
  },
  siegfried:{
    name:'SIEGFRIED', sprite:'siegfried', tint:'#ff7a45',
    lines:[
      'FIFTEEN TIMES! Thirty-one miles an hour and BOING fifteen times. Wonderful.',
      'The bags were 5.8 metres across. Four bags, six lobes. We wore them like a jacket.',
      'I am the garage. The little one is the hands. Together: most of what we know.',
      'The rocks here are STILL interesting. They never got bored.'
    ],
    win:['Fifteen bounces! You were THERE. Well — that was you. Amazing.']
  }
};

/* ---------- BEACON: idle chatter, one line at a time ---------- */
const BEACON = {
  idle:[
    'All systems nominal. Suspiciously nominal.',
    'Your shoes are not Mars-suitable. Nothing is Mars-suitable.',
    'I am watching you be small on a big planet. Enjoying it.',
    'The dust devils are not on your side. Not on anyone’s side.',
    'Two machines here are older than radio. Be polite.',
    'That noise? Dust devil. Still not on your side.'
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

/* ---------- world signs (the jokes live here, short and visual) ---------- */
const SIGNS = [
  ['MARS IS NOT A','VACUUM (MOSTLY)'],
  ['DO NOT FEED','THE MITES'],
  ['GRAVITY: 38%','OF EARTH'],
  ['IF YOU HEAR A','BOING, SORRY'],
  ['SAMPLES INSIDE','ARE FROM A','BETTER PLANET'],
  ['PLEASE DO NOT','LAND ON THE FLAG'],
  ['THE SAND IS','LOAD-BEARING'],
  ['THERE IS NO','SPOON HERE'],
  ['CURIOSITY','IS A GAS'],
  ['ALL ROVERS','ARE BEAUTIFUL'],
  ['SULFUR? DO NOT','LICK IT'],
  ['THE DUST IS','LOAD-BEARING TOO']
];
const TICKER = [
  'Archive note: Viking 1 was renamed in 1982. The robot did not get a vote.',
  'Archive note: Pathfinder sent 2.3 billion bits in three months.',
  'Archive note: Ingenuity flew 72 times. Built for 5. Budgets are suggestions.',
  'Archive note: a Martian sol is 24 h 39 min. Nobody asked. It just is.',
  'Archive note: Mars gravity is 38% of Earth. Your knees are thrilled.'
];

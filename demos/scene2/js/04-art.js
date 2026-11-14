/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · ART — THE PIXEL SOURCE
   every sprite in the game, as palette-keyed strings.
  ".": transparent · one letter per pixel · frames are stacked rows
   ========================================================================== */
'use strict';
const ART = {
 "palette": {
  ".": null,
  "k": "#0e1226",
  "z": "#05070f",
  "n": "#2b3168",
  "N": "#4a5385",
  "t": "#9aa3d0",
  "w": "#e8ecff",
  "h": "#ffffff",
  "W": "#b9c2e8",
  "c": "#44e3b8",
  "C": "#1d9a82",
  "r": "#ff7a45",
  "R": "#b8471d",
  "o": "#ffb347",
  "y": "#ffd166",
  "Y": "#c99a3f",
  "m": "#b78bff",
  "M": "#6d3fb0",
  "g": "#7de08a",
  "G": "#2f8f52",
  "e": "#bfe9ff",
  "E": "#5fa8d8",
  "s": "#f3c67e",
  "S": "#c79a58",
  "p": "#ff5d73",
  "P": "#a32b43",
  "d": "#5a2a20",
  "D": "#8a4a30",
  "q": "#fff0c2",
  "a": "#5c9eff",
  "b": "#2b4fa8",
  "x": "#ff8fa3"
 },
 "sprites": {
  "curi_idle": {
   "w": 12,
   "h": 14,
   "eyes": [
    [
     4,
     6
    ],
    [
     7,
     6
    ]
   ],
   "frames": [
    [
     ".....r......",
     ".....k......",
     "....kkk.....",
     "...kkkkk....",
     "..kwwwwwk...",
     ".kwwwwwwwk..",
     ".kwcwwcwwk..",
     ".kwcwwcwwk..",
     ".kwwwwwwwk..",
     ".kwwkkkkwk..",
     "..kwwwwwwk..",
     "..kkwwwwkk..",
     ".kkNN..NNkk.",
     ".kNN....NNk."
    ],
    [
     "............",
     ".....r......",
     "....kkk.....",
     "...kkkkk....",
     "..kwwwwwk...",
     ".kwwwwwwwk..",
     ".kwcwwcwwk..",
     ".kwcwwcwwk..",
     ".kwwwwwwwk..",
     ".kwwkkkkwk..",
     "..kwwwwwwk..",
     "..kkwwwwkk..",
     ".kkNN..NNkk.",
     ".kNN....NNk."
    ]
   ]
  },
  "curi_run": {
   "w": 12,
   "h": 14,
   "eyes": [
    [
     4,
     6
    ],
    [
     7,
     6
    ]
   ],
   "frames": [
    [
     "....r.......",
     "....k.......",
     "...kkk......",
     "..kkkkk.....",
     ".kwwwwwk....",
     "kwwwwwwwk...",
     "kwcwwcwwk...",
     "kwcwwcwwk...",
     "kwwwwwwwk...",
     "kwwkkkkwk...",
     ".kwwwwwwk...",
     ".kkwwwwkk...",
     "kkNN..NNkk..",
     ".kNN...NNk.."
    ],
    [
     "....r.......",
     "....k.......",
     "...kkk......",
     "..kkkkk.....",
     ".kwwwwwk....",
     "kwwwwwwwk...",
     "kwcwwcwwk...",
     "kwcwwcwwk...",
     "kwwwwwwwk...",
     "kwwkkkkwk...",
     ".kwwwwwwk...",
     ".kkwwwwkk...",
     ".kNN..NNkk..",
     "kNN....NNk.."
    ],
    [
     "....r.......",
     "....k.......",
     "...kkk......",
     "..kkkkk.....",
     ".kwwwwwk....",
     "kwwwwwwwk...",
     "kwcwwcwwk...",
     "kwcwwcwwk...",
     "kwwwwwwwk...",
     "kwwkkkkwk...",
     ".kwwwwwwk...",
     ".kkwwwwkk...",
     "..kkNN..NNkk",
     "..kNN....NNk"
    ],
    [
     "....r.......",
     "....k.......",
     "...kkk......",
     "..kkkkk.....",
     ".kwwwwwk....",
     "kwwwwwwwk...",
     "kwcwwcwwk...",
     "kwcwwcwwk...",
     "kwwwwwwwk...",
     "kwwkkkkwk...",
     ".kwwwwwwk...",
     ".kkwwwwkk...",
     ".kNN..NNkk..",
     "kNN....NNk.."
    ]
   ]
  },
  "curi_jump": {
   "w": 12,
   "h": 14,
   "eyes": [
    [
     4,
     6
    ],
    [
     7,
     6
    ]
   ],
   "frames": [
    [
     ".....r......",
     ".....k......",
     "....kkk.....",
     "...kkkkk....",
     "..kwwwwwk...",
     ".kwwwwwwwk..",
     ".kwcwwcwwk..",
     ".kwcwwcwwk..",
     ".kwwwwwwwk..",
     ".kwwkkkkwk..",
     "..kwwwwwk...",
     "..kwwwwwk...",
     ".kkNN..NNkk.",
     ".kNN....NNk."
    ]
   ]
  },
  "curi_fall": {
   "w": 12,
   "h": 14,
   "eyes": [
    [
     4,
     6
    ],
    [
     7,
     6
    ]
   ],
   "frames": [
    [
     "....r.......",
     "....k.......",
     "...kkk......",
     "..kkkkk.....",
     "..kwwwwwk...",
     ".kwwwwwwwk..",
     ".kwcwwcwwk..",
     ".kwcwwcwwk..",
     ".kwwwwwwwk..",
     ".kwwkkkkwk..",
     "..kwwwwwwk..",
     "..kwwwwwwk..",
     "..kkNNkNNk..",
     "..kNN..NNk.."
    ]
   ]
  },
  "curi_land": {
   "w": 12,
   "h": 12,
   "eyes": [
    [
     4,
     5
    ],
    [
     7,
     5
    ]
   ],
   "frames": [
    [
     "............",
     "....kkkk....",
     "..kkwwwwkk..",
     ".kwwwwwwwwk.",
     ".kwcwwcwwk..",
     ".kwcwwcwwk..",
     ".kwwwwwwwk..",
     ".kwwkkkkwk..",
     ".kkNN..NNkk.",
     ".kNN....NNk.",
     "............",
     "............"
    ]
   ]
  },
  "curi_dig": {
   "w": 13,
   "h": 14,
   "eyes": [
    [
     4,
     6
    ],
    [
     7,
     6
    ]
   ],
   "frames": [
    [
     ".....r......",
     ".....k......",
     "....kkk.....",
     "...kkkkk....",
     "..kwwwwwk...",
     ".kwwwwwwwk..",
     ".kwcwwcwwk..",
     ".kwcwwcwwk..",
     ".kwwwwwwwk..",
     ".kwwkkkkwk..",
     "..kwwwwwk...",
     "..kkkkk.....",
     ".kkNN..NNk..",
     ".kNN......k."
    ]
   ]
  },
  "coper_idle": {
   "w": 22,
   "h": 14,
   "eyes": [
    [
     6,
     6
    ],
    [
     9,
     6
    ]
   ],
   "frames": [
    [
     "..tttttttttttttttttt..",
     ".........kk...........",
     ".....bbbbbbbbbb.......",
     ".....bwwwwwwwwb.......",
     ".....bbbbbbbbbb.......",
     ".....kwwwwwwwwk.......",
     ".....kwwwwwwwwk.......",
     ".....kwccwwcwwk.......",
     ".....kwwwwwwwwk.......",
     "......kkkkkkkk........",
     "....k..........k......",
     "...k............k.....",
     "..k..............k....",
     ".kk..............kk..."
    ],
    [
     "......tttttttttt......",
     ".........kk...........",
     ".....bbbbbbbbbb.......",
     ".....bwwwwwwwwb.......",
     ".....bbbbbbbbbb.......",
     ".....kwwwwwwwwk.......",
     ".....kwwwwwwwwk.......",
     ".....kwccwwcwwk.......",
     ".....kwwwwwwwwk.......",
     "......kkkkkkkk........",
     "....k..........k......",
     "...k............k.....",
     "..k..............k....",
     ".kk..............kk..."
    ],
    [
     "........tttttt........",
     ".........kk...........",
     ".....bbbbbbbbbb.......",
     ".....bwwwwwwwwb.......",
     ".....bbbbbbbbbb.......",
     ".....kwwwwwwwwk.......",
     ".....kwwwwwwwwk.......",
     ".....kwccwwcwwk.......",
     ".....kwwwwwwwwk.......",
     "......kkkkkkkk........",
     "....k..........k......",
     "...k............k.....",
     "..k..............k....",
     ".kk..............kk..."
    ]
   ]
  },
  "vigil": {
   "w": 24,
   "h": 30,
   "eyes": [
    [
     9,
     8
    ],
    [
     12,
     8
    ]
   ],
   "frames": [
    [
     "........kkkkkkkk........",
     "......kkwwwwwwwwkk......",
     ".....kwwwwwwwwwwwwk.....",
     "....kwwttwwttwwttwwk....",
     "....kwwttwwttwwttwwk....",
     ".....kwwwwwwwwwwwwk.....",
     "..........kkkk..........",
     ".......kwwwwwwwk........",
     ".......kwwwwwwwk........",
     ".......kkkkkkkkk........",
     "......kkkkkkkkkkkk......",
     ".....kwwwwwwwwwwwwk.....",
     "....kwwwwwwwwwwwwwwk....",
     "....kwyywwwwwwwwyywk....",
     "....kwyywwwwwwwwyywk....",
     "....kwwwwwwccwwwwwwk....",
     "....kwwwwwwccwwwwwwk....",
     "....kwwwwwwwwwwwwwwk....",
     ".....kwwwwwwwwwwwwk.....",
     "......kkkkkkkkkkkk......",
     "....t..............t....",
     "....t..............t....",
     "..t..................t..",
     "..t..................t..",
     ".t....................t.",
     ".t....................t.",
     "t......................t",
     "t......................t",
     "kkk..................kkk",
     "........................"
    ]
   ]
  },
  "siegfried": {
   "w": 22,
   "h": 18,
   "eyes": [
    [
     8,
     7
    ],
    [
     12,
     7
    ]
   ],
   "frames": [
    [
     "..........kk..........",
     ".........kwwk.........",
     ".........kwwk.........",
     "...yyyyyyyyyyyyyyyy...",
     "..yyyyyyyyyyyyyyyyyy..",
     ".yyykwwwwwwwwwwwwkyyy.",
     ".yyykwwwwwwwwwwwwkyyy.",
     ".yyykwwwwwwwwwwwwkyyy.",
     ".yyykwwwwwwwwwwwwkyyy.",
     ".yyykwccwwwwwwccwkyyy.",
     ".yyykwccwwwwwwccwkyyy.",
     ".yyykwwwwwwwwwwwwkyyy.",
     ".yyykwwwwwwwwwwwwkyyy.",
     "..yykwwwwwwwwwwwwkyy..",
     "...kkkkkkkkkkkkkkkk...",
     ".yyy..............yyy.",
     ".yyy..............yyy.",
     "tttttttttttttttttttttt"
    ]
   ]
  },
  "sojourner": {
   "w": 14,
   "h": 11,
   "eyes": [
    [
     4,
     2
    ],
    [
     9,
     2
    ]
   ],
   "frames": [
    [
     "......kk......",
     ".abbbbbbbba...",
     ".kwwwwwwwwk...",
     ".kwcwwwwcwk...",
     ".kwwwwwwwwk...",
     "kwwwwwwwwwwk..",
     "kwwwwwwwwwwk..",
     ".kkkkkkkkkkk..",
     ".kk.kk..kk.kk.",
     ".tt.tt..tt.tt.",
     ".............."
    ],
    [
     "......kk......",
     ".abbbbbbbba...",
     ".kwwwwwwwwk...",
     ".kwcwwwwcwk...",
     ".kwwwwwwwwk...",
     "kwwwwwwwwwwk..",
     "kwwwwwwwwwwk..",
     ".kkkkkkkkkkk..",
     "kk.kk...kk.kk.",
     "tt.tt...tt.tt.",
     ".............."
    ]
   ]
  },
  "gusto": {
   "w": 12,
   "h": 18,
   "frames": [
    [
     ".....kk........",
     "....kqqk.......",
     "..kkqqqqkk.....",
     ".kqqqqqqqqk...",
     ".kqqqqqqqqkk..",
     "..kqqqqqqqk...",
     "...kqqqqqk....",
     "....kqqk......",
     "....kqqk......",
     ".....kk.......",
     "....kqqk......",
     "...kqqqqk.....",
     "..kqqqqqqk....",
     ".kqqqqqqqqk...",
     ".kqqqqqqqqk...",
     "kqqqqqqqqqqk..",
     "kkkkkkkkkkkkk.",
     "..............."
    ],
    [
     "...............",
     ".....kk........",
     "....kqqk.......",
     "..kkqqqqkk.....",
     ".kqqqqqqqqk...",
     "..kqqqqqqqk...",
     "...kqqqqqk....",
     "....kqqk......",
     "....kqqk......",
     ".....kk.......",
     "....kqqk......",
     "...kqqqqk.....",
     "..kqqqqqqk....",
     ".kqqqqqqqqk...",
     "kqqqqqqqqqqk..",
     "kqqqqqqqqqqk..",
     "kkkkkkkkkkkkk.",
     "..............."
    ],
    [
     ".....kk........",
     "....kqqk.......",
     "..kkqqqqkk.....",
     ".kqqqqqqqqk...",
     ".kqqqqqqqqkk..",
     "..kqqqqqqqk...",
     "...kqqqqqk....",
     "....kqqk......",
     "....kqqk......",
     ".....kk.......",
     "....kqqk......",
     "...kqqqqk.....",
     "..kqqqqqqk....",
     ".kqqqqqqqqk...",
     ".kqqqqqqqqk...",
     "kqqqqqqqqqqk..",
     "kkkkkkkkkkkkk.",
     "..............."
    ]
   ]
  },
  "shard": {
   "w": 8,
   "h": 9,
   "frames": [
    [
     "..c....",
     ".cCc...",
     "ccCCcc.",
     "cCCCCc.",
     "ccCCcc.",
     ".cCc...",
     "..c....",
     "........",
     "........"
    ],
    [
     "........",
     "...cC...",
     "..cCCC..",
     "..cCCC..",
     "..cCCC..",
     "...cC...",
     "........",
     "........",
     "........"
    ],
    [
     "........",
     "...c....",
     "..cCc...",
     "..cCCc..",
     "...cCc..",
     "........",
     "........",
     "........",
     "........"
    ],
    [
     "........",
     "...cC...",
     "..cCCC..",
     "..cCCC..",
     "..cCCC..",
     "...cC...",
     "........",
     "........",
     "........"
    ]
   ]
  },
  "bit": {
   "w": 6,
   "h": 6,
   "frames": [
    [
     "..y...",
     ".yYy..",
     "yYYYy.",
     "yYYYy.",
     ".yYy..",
     "..y..."
    ],
    [
     ".y....",
     "yYy...",
     "yYYYy.",
     ".yYYy.",
     "..yYy.",
     "...y.."
    ]
   ]
  },
  "cell": {
   "w": 8,
   "h": 9,
   "frames": [
    [
     "..gggg..",
     ".gwwwwg.",
     "gwnnnwng",
     "gwnnnwng",
     "gwnnnwng",
     "gwnnnwng",
     "gwnnnwng",
     ".gwwwwg.",
     "..gggg.."
    ],
    [
     "..gggg..",
     ".gwwwwg.",
     "gwccwwng",
     "gwccwwng",
     "gwccwwng",
     "gwccwwng",
     "gwccwwng",
     ".gwwwwg.",
     "..gggg.."
    ]
   ]
  },
  "tube": {
   "w": 8,
   "h": 8,
   "frames": [
    [
     ".kkkkk..",
     "kwwwwwk.",
     "kwwwwwk.",
     "kwwwwwk.",
     "kwwwwwk.",
     "kwwwwwk.",
     "kwwwwwk.",
     ".kkkkk.."
    ]
   ]
  },
  "rock": {
   "w": 12,
   "h": 9,
   "frames": [
    [
     "..DDDD....",
     ".DDDDDDD..",
     "DDDSSDDDD.",
     "DDSSDDDDD.",
     "DDDDDDDDDD",
     "DDDDDDDDDD",
     ".DDDDDDDD.",
     "..DDDDDD..",
     ".........."
    ]
   ]
  },
  "rock2": {
   "w": 10,
   "h": 7,
   "frames": [
    [
     "..DDDD...",
     ".DDDDDD..",
     "DDSSDDDD.",
     "DDSDDDDD.",
     "DDDDDDDDD",
     ".DDDDDDD.",
     "........."
    ]
   ]
  },
  "boulder": {
   "w": 16,
   "h": 13,
   "frames": [
    [
     "....DDDDDDD.....",
     "..DDDDDDDDDDD..",
     ".DDDSSDDDDDDDD..",
     "DDDSSDDDSSDDDDD.",
     "DDDSSDDDDDDSSDD.",
     "DDDDDDDDDDDDDDD.",
     "DDDDDDDDDDDDDDD.",
     "DDDDDDDDDDDDDDD.",
     ".DDDDDDDDDDDDD..",
     ".DDDDDDDDDDDDD..",
     "..DDDDDDDDDDD...",
     "..DDDDDDDDDD....",
     "................"
    ]
   ]
  },
  "ice": {
   "w": 10,
   "h": 14,
   "frames": [
    [
     "....ee....",
     "...eee....",
     "..eeeee...",
     "..eEeeE...",
     ".eeeeeee..",
     ".eEeeeEe..",
     ".eeeeeee..",
     "..eeeee...",
     "..eEeeE...",
     "..eeeee...",
     "...eee....",
     "...eEe....",
     "....ee....",
     ".........."
    ]
   ]
  },
  "cactus": {
   "w": 10,
   "h": 13,
   "frames": [
    [
     "....gg....",
     "....gg....",
     "..g.ggg...",
     "..g.g.g...",
     "ggg.g.g...",
     "gGgg.g.g..",
     "gGg.ggg...",
     ".G..gg....",
     "....gg....",
     "....gg....",
     "...d.dd...",
     "..d...d...",
     "..........",
     ".........."
    ]
   ]
  },
  "bone": {
   "w": 12,
   "h": 6,
   "frames": [
    [
     "............",
     ".w........w.",
     "ww.wwww.ww.",
     "ww.wwww.ww.",
     ".w........w.",
     "............"
    ]
   ]
  },
  "sign": {
   "w": 10,
   "h": 16,
   "frames": [
    [
     ".kkkkkkkk.",
     ".k......k.",
     ".k......k.",
     ".kkkkkkkk.",
     "....kk....",
     "....kk....",
     "....kk....",
     "....kk....",
     "....kk....",
     "....kk....",
     "....kk....",
     "....kk....",
     "....kk....",
     "....kk....",
     "...kkkk...",
     ".........."
    ]
   ]
  },
  "lamp": {
   "w": 8,
   "h": 13,
   "frames": [
    [
     "...yy...",
     "..yYYy..",
     "..yYYy..",
     "..yYYy..",
     "..yYYy..",
     "...yy...",
     "...kk...",
     "...kk...",
     "...kk...",
     "...kk...",
     "..k..k..",
     ".k....k.",
     "........"
    ]
   ]
  },
  "antenna": {
   "w": 10,
   "h": 18,
   "frames": [
    [
     "..w..w...",
     ".w..w..w.",
     "w..w..w..",
     ".w..w..w.",
     "..w..w...",
     "...kk....",
     "...kk....",
     "...kk....",
     "...kk....",
     "...kk....",
     "...kk....",
     "...kk....",
     "...kk....",
     "...kk....",
     "...kk....",
     "...kk....",
     "...kk....",
     ".........."
    ]
   ]
  },
  "mite": {
   "w": 10,
   "h": 8,
   "frames": [
    [
     ".d......d.",
     "..d....d..",
     "..dddddd..",
     ".dDDDDDDd.",
     "dDDSSSSDDd",
     "dDDSSSSDDd",
     ".dDDDDDDd.",
     "..dddddd.."
    ],
    [
     "d........d",
     ".d......d.",
     "..dddddd..",
     ".dDDDDDDd.",
     "dDDSSSSDDd",
     "dDDSSSSDDd",
     ".dDDDDDDd.",
     "..dddddd.."
    ]
   ],
   "eyes": [
    [
     3,
     4
    ],
    [
     6,
     4
    ]
   ]
  },
  "wasp": {
   "w": 12,
   "h": 10,
   "eyes": [
    [
     4,
     5
    ],
    [
     7,
     5
    ]
   ],
   "frames": [
    [
     "....e....e...",
     "...eee..eee..",
     "....e....e...",
     "............",
     "...yyyyyyy...",
     "..ykyyyyyy..",
     "...yyyyyyy...",
     "....y...y...",
     "....y...y...",
     "............"
    ],
    [
     "............",
     "....e....e...",
     "...eee..eee..",
     "............",
     "...yyyyyyy...",
     "..ykyyyyyy..",
     "...yyyyyyy...",
     "....y...y...",
     "....y...y...",
     "............"
    ]
   ]
  },
  "goon": {
   "w": 14,
   "h": 12,
   "frames": [
    [
     "...DDDDDD...",
     "..DDDDDDDD..",
     ".DDSSSSSSDD.",
     "DDSSDDDDSSDD",
     "DDSDDDDDDSDD",
     "DDDDDDDDDDDD",
     "DDDDDDDDDDDD",
     "DDDDDDDDDDDD",
     ".DDDDDDDDDD.",
     "..DDDDDDDD..",
     "..DD....DD..",
     "............"
    ],
    [
     "...DDDDDD...",
     "..DDDDDDDD..",
     ".DDSSSSSSDD.",
     "DDSSDDDDSSDD",
     "DDSDDDDDDSDD",
     "DDDDDDDDDDDD",
     "DDDDDDDDDDDD",
     "DDDDDDDDDDDD",
     ".DDDDDDDDDD.",
     "..DDDDDDDD..",
     ".DD......DD.",
     "............"
    ]
   ]
  },
  "goalpost": {
   "w": 14,
   "h": 22,
   "frames": [
    [
     "..............",
     "..gggggggggg..",
     "..g........g..",
     "..g..cccc..g..",
     "..g.c....c.g..",
     "..g.c....c.g..",
     "..g.c....c.g..",
     "..g..cccc..g..",
     "..g........g..",
     "..gggggggggg..",
     ".....g..g.....",
     ".....g..g.....",
     ".....g..g.....",
     ".....g..g.....",
     ".....g..g.....",
     ".....g..g.....",
     ".....g..g.....",
     ".....g..g.....",
     ".....g..g.....",
     ".....g..g.....",
     "....gg..gg....",
     ".............."
    ]
   ]
  },
  "flag": {
   "w": 12,
   "h": 18,
   "frames": [
    [
     "............",
     ".rrrrrrrrr..",
     ".rwrrrwrrr..",
     ".rrrrrrrrr..",
     "............",
     ".....k......",
     ".....k......",
     ".....k......",
     ".....k......",
     ".....k......",
     ".....k......",
     ".....k......",
     ".....k......",
     ".....k......",
     ".....k......",
     ".....k......",
     "....kk......",
     "............"
    ]
   ]
  }
 }
};

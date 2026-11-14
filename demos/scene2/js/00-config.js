/* ==========================================================================
   OFF-WORLD — SCENE 02 : MARS · CONFIG
   resolution, tile size, zone palettes
   ========================================================================== */
'use strict';
/* ======================================================================
   16) ZONE PALETTES — each zone feels like a different Mars
   ====================================================================== */
const ZONE_PAL = {
  viking:{
    sky0:'#2a1626', sky1:'#a85a3c', far:'#5c2c28', mid:'#40201d', g:'#7d3f2c', gt:'#ab5c39',
    ac:'#ffd27a', fog:'rgba(199,106,62,.22)', sun:'#ffd9a0', star:0
  },
  pathfinder:{
    sky0:'#3a1e2c', sky1:'#d4713a', far:'#7b3b2a', mid:'#5c2c1f', g:'#8a4a30', gt:'#b3613a',
    ac:'#ffe08a', fog:'rgba(212,113,58,.20)', sun:'#ffe6b0', star:0
  },
  ingenuity:{
    sky0:'#120b1e', sky1:'#6b3550', far:'#3a2038', mid:'#281828', g:'#6b3a2e', gt:'#94553c',
    ac:'#cfe6ff', fog:'rgba(120,90,140,.24)', sun:'#e8d4ff', star:1
  }
};
function zonePal(zone){ return ZONE_PAL[zone] || ZONE_PAL.viking; }


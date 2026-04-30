/**
 * Boss — abilities por bioma usadas pelo SpawnSystem e GameLoop.
 * Cada bioma tem 1-2 ataques com parâmetros distintos.
 */

export const BOSS_ABILITIES = [
  [ // 0: Plains
    { label:'🔥 Fireball!', color:0xff2200, speed:0.28, dmgMult:1.0, count:1, interval:2000 },
    { label:'💨 Rajada!',   color:0xccddff, speed:0.38, dmgMult:0.6, count:2, spread:0.28, interval:3200 },
  ],
  [ // 1: Dark Forest
    { label:'🌿 Espinho!',  color:0x44ff44, speed:0.25, dmgMult:1.1, count:1, interval:2200 },
    { label:'🌑 Névoa!',   color:0x224422, speed:0.20, dmgMult:0.8, count:3, spread:0.35, interval:3500 },
  ],
  [ // 2: Golden Desert
    { label:'🔥 Areia!',   color:0xffcc44, speed:0.30, dmgMult:1.2, count:1, interval:2000 },
    { label:'🦂 Veneno!',  color:0x88ff44, speed:0.22, dmgMult:0.7, count:2, spread:0.20, interval:3000, dot:{ dmg:8, ticks:4, interval:800 } },
  ],
  [ // 3: Frozen Snow
    { label:'❄️ Gelo!',    color:0x88ccff, speed:0.24, dmgMult:1.1, count:1, interval:2500 },
    { label:'🌨️ Blizzard!',color:0xaaddff, speed:0.18, dmgMult:0.6, count:4, spread:0.40, interval:4000 },
  ],
  [ // 4: Volcanic Lands
    { label:'🌋 Lava!',    color:0xff4500, speed:0.32, dmgMult:1.3, count:1, interval:1800 },
    { label:'💥 Explosão!',color:0xff8800, speed:0.28, dmgMult:1.0, count:2, spread:0.25, interval:2800, dot:{ dmg:12, ticks:5, interval:700 } },
  ],
  [ // 5: Mystic Highlands
    { label:'⚡ Raio!',    color:0x9900ff, speed:0.35, dmgMult:1.2, count:1, interval:2000 },
    { label:'🔮 Míssil!',  color:0xdd88ff, speed:0.20, dmgMult:1.0, count:1, interval:3000, homing:true },
  ],
  [ // 6: Crystal Caves
    { label:'💎 Cristal!', color:0x00ffee, speed:0.30, dmgMult:1.2, count:2, spread:0.20, interval:2200 },
    { label:'🪩 Prisma!',  color:0x7ac8e8, speed:0.25, dmgMult:0.8, count:3, spread:0.35, interval:3200 },
  ],
  [ // 7: Shadow Realm
    { label:'👻 Caça-Almas!', color:0x8800ff, speed:0.18, dmgMult:1.4, count:1, interval:2800, homing:true },
    { label:'🗡️ Sombra!',    color:0x440066, speed:0.40, dmgMult:0.9, count:2, spread:0.20, interval:2000 },
  ],
  [ // 8: Celestial Peaks
    { label:'✨ Divino!',  color:0xffd700, speed:0.32, dmgMult:1.3, count:2, spread:0.18, interval:2000 },
    { label:'🌟 Explosão!',color:0xfffacd, speed:0.28, dmgMult:1.1, count:1, interval:2500, dot:{ dmg:15, ticks:5, interval:600 } },
  ],
  [ // 9: Eternal Void
    { label:'👾 Caos!',    color:0xbf00ff, speed:0.30, dmgMult:1.5, count:2, spread:0.30, interval:1800 },
    { label:'🌀 Espiral!', color:0x6600ff, speed:0.22, dmgMult:1.2, count:1, interval:2200, homing:true, dot:{ dmg:20, ticks:6, interval:500 } },
  ],
];

export function getBossAbilities(biomeIndex) {
  return BOSS_ABILITIES[Math.min(biomeIndex, BOSS_ABILITIES.length - 1)];
}

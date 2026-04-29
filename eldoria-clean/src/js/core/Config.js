/**
 * Config — todas as constantes e dados estáticos do jogo.
 * Nenhum estado mutável aqui: apenas definições imutáveis.
 */

export const GAME = {
  AOE_COOLDOWN: 8000,
  DASH_COOLDOWN: 3000,
  SHIELD_COOLDOWN: 15000,
  SHIELD_DURATION: 2000,
  FIREBALL_SP_COST: 30,
  AOE_SP_COST: 50,
  DASH_SP_COST: 20,
  AUTOSAVE_INTERVAL: 30000,
  MAX_COMBAT_LOG: 5,
  BASE_SPEED: 0.35,
};

export const BIOMES = [
  { name: 'Green Plains',      groundColor: 0x3ea55e, skyColor: 0x87ceeb, fogColor: 0x87ceeb, level: 1  },
  { name: 'Dark Forest',       groundColor: 0x2d5a2d, skyColor: 0x4a6b4a, fogColor: 0x3d5a3d, level: 5  },
  { name: 'Golden Desert',     groundColor: 0xd4c96e, skyColor: 0xffd7a0, fogColor: 0xe8c890, level: 10 },
  { name: 'Frozen Snow',       groundColor: 0xe8f4f8, skyColor: 0xb0d4e8, fogColor: 0xc8e0e8, level: 15 },
  { name: 'Volcanic Lands',    groundColor: 0x4a2a2a, skyColor: 0xff6b35, fogColor: 0x8b4513, level: 20 },
  { name: 'Mystic Highlands',  groundColor: 0x6a4a8a, skyColor: 0xd4a5ff, fogColor: 0x9a7abf, level: 30 },
  { name: 'Crystal Caves',     groundColor: 0x4a9abf, skyColor: 0xa5e8ff, fogColor: 0x7ac8e8, level: 45 },
  { name: 'Shadow Realm',      groundColor: 0x2a2a3a, skyColor: 0x4a4a6a, fogColor: 0x3a3a4a, level: 60 },
  { name: 'Celestial Peaks',   groundColor: 0xf5e8d8, skyColor: 0xfff5d8, fogColor: 0xffeebb, level: 80 },
  { name: 'Eternal Void',      groundColor: 0x1a0a2a, skyColor: 0x3a1a5a, fogColor: 0x2a0a3a, level: 100},
];

export const MONSTER_TYPES = {
  0: [ // Plains (Lv 1-4)
    { name:'Slime',       baseHp:30,  baseAtk:5,   baseXp:15,  color:0x66cc66, eyeColor:0x338833, size:1.2, icon:'🟢', canBeMob:false },
    { name:'Wolf',        baseHp:50,  baseAtk:5,   baseXp:20,  color:0x6a3399, eyeColor:0xffff00, size:1.5, icon:'🐺', canBeMob:true  },
    { name:'Goblin',      baseHp:40,  baseAtk:4,   baseXp:18,  color:0x55aa55, eyeColor:0xff6600, size:1.3, icon:'👺', canBeMob:true  },
  ],
  1: [ // Forest (Lv 5-9)
    { name:'Forest Wolf', baseHp:80,  baseAtk:8,   baseXp:35,  color:0x2d5a2d, eyeColor:0xff3300, size:1.6, icon:'🐺', canBeMob:true  },
    { name:'Treant',      baseHp:120, baseAtk:14,  baseXp:45,  color:0x4a3728, eyeColor:0x00ff00, size:2.0, icon:'🌳', canBeMob:false },
    { name:'Spider',      baseHp:60,  baseAtk:16,  baseXp:40,  color:0x333333, eyeColor:0xff0000, size:1.4, icon:'🕷️', canBeMob:true  },
    { name:'Orc Scout',   baseHp:90,  baseAtk:13,  baseXp:38,  color:0x556b2f, eyeColor:0xffaa00, size:1.7, icon:'👹', canBeMob:true  },
  ],
  2: [ // Desert (Lv 10-14)
    { name:'Sand Worm',     baseHp:150, baseAtk:20, baseXp:60, color:0xd4c96e, eyeColor:0x8b4513, size:1.8, icon:'🪱', canBeMob:false },
    { name:'Desert Bandit', baseHp:110, baseAtk:22, baseXp:55, color:0xc4a574, eyeColor:0x0000ff, size:1.6, icon:'🥷', canBeMob:true  },
    { name:'Scorpion',      baseHp:130, baseAtk:24, baseXp:65, color:0x8b7355, eyeColor:0xff00ff, size:1.5, icon:'🦂', canBeMob:false },
    { name:'Mummy',         baseHp:140, baseAtk:21, baseXp:58, color:0xf5deb3, eyeColor:0x00ffff, size:1.7, icon:'🧟', canBeMob:false },
  ],
  3: [ // Snow (Lv 15-19)
    { name:'Ice Wolf',    baseHp:180, baseAtk:20, baseXp:80,  color:0x6688aa, eyeColor:0x00ffff, size:1.7, icon:'🐺', canBeMob:true  },
    { name:'Yeti',        baseHp:250, baseAtk:32, baseXp:100, color:0xffffff, eyeColor:0x0000ff, size:2.5, icon:'🦍', canBeMob:false },
    { name:'Frost Spirit',baseHp:160, baseAtk:28, baseXp:85,  color:0xb0e0e6, eyeColor:0x00ffff, size:1.4, icon:'❄️', canBeMob:false },
    { name:'Snow Golem',  baseHp:220, baseAtk:26, baseXp:90,  color:0xe0ffff, eyeColor:0x4169e1, size:2.2, icon:'⛄', canBeMob:false },
  ],
  4: [ // Volcanic (Lv 20-29)
    { name:'Fire Imp',       baseHp:280, baseAtk:38, baseXp:120, color:0xaa4433, eyeColor:0xff4500, size:1.5, icon:'👿', canBeMob:true  },
    { name:'Lava Elemental', baseHp:350, baseAtk:45, baseXp:150, color:0xff4500, eyeColor:0xffff00, size:2.3, icon:'🔥', canBeMob:false },
    { name:'Obsidian Golem', baseHp:400, baseAtk:42, baseXp:140, color:0x2f2f2f, eyeColor:0xff0000, size:2.4, icon:'🗿', canBeMob:false },
    { name:'Flame Dragon',   baseHp:320, baseAtk:48, baseXp:160, color:0xdc143c, eyeColor:0xffd700, size:2.0, icon:'🐉', canBeMob:false },
  ],
  5: [ // Mystic (Lv 30-44)
    { name:'Mystic Spirit',   baseHp:450, baseAtk:52, baseXp:180, color:0x9a7abf, eyeColor:0xd4a5ff, size:1.6, icon:'👻', canBeMob:true  },
    { name:'Arcane Guardian', baseHp:550, baseAtk:60, baseXp:220, color:0x6a4a8a, eyeColor:0xe8d4ff, size:2.2, icon:'🛡️', canBeMob:false },
    { name:'Highland Wolf',   baseHp:480, baseAtk:55, baseXp:200, color:0x8a6a9a, eyeColor:0xffaaff, size:1.8, icon:'🐺', canBeMob:true  },
    { name:'Magic Construct', baseHp:520, baseAtk:58, baseXp:210, color:0xb59ad4, eyeColor:0xffffff, size:2.0, icon:'🤖', canBeMob:false },
  ],
  6: [ // Crystal Caves (Lv 45-59)
    { name:'Crystal Golem', baseHp:650, baseAtk:68, baseXp:260, color:0x7ac8e8, eyeColor:0xa5e8ff, size:2.4, icon:'💎', canBeMob:false },
    { name:'Gem Spider',    baseHp:580, baseAtk:72, baseXp:280, color:0x4a9abf, eyeColor:0x00ffff, size:1.7, icon:'🕷️', canBeMob:true  },
    { name:'Mineral Beast', baseHp:700, baseAtk:65, baseXp:250, color:0x5ab5d5, eyeColor:0x7fff00, size:2.1, icon:'🦎', canBeMob:true  },
    { name:'Cave Warden',   baseHp:750, baseAtk:70, baseXp:300, color:0x3a8aaf, eyeColor:0x00bfff, size:2.5, icon:'👹', canBeMob:false },
  ],
  7: [ // Shadow Realm (Lv 60-79)
    { name:'Shadow Wraith',    baseHp:850,  baseAtk:82, baseXp:350, color:0x3a3a4a, eyeColor:0x8a2be2, size:1.8, icon:'👻', canBeMob:true  },
    { name:'Dark Phantom',     baseHp:900,  baseAtk:88, baseXp:380, color:0x2a2a3a, eyeColor:0x9400d3, size:2.0, icon:'💀', canBeMob:false },
    { name:'Void Stalker',     baseHp:950,  baseAtk:85, baseXp:370, color:0x1a1a2a, eyeColor:0x4b0082, size:2.2, icon:'🐆', canBeMob:true  },
    { name:'Nightmare Knight', baseHp:1000, baseAtk:92, baseXp:400, color:0x0a0a1a, eyeColor:0xff1493, size:2.3, icon:'🏇', canBeMob:false },
  ],
  8: [ // Celestial Peaks (Lv 80-99)
    { name:'Celestial Angel',  baseHp:1150, baseAtk:98,  baseXp:450, color:0xfff5d8, eyeColor:0xffd700, size:2.0, icon:'👼', canBeMob:true  },
    { name:'Divine Protector', baseHp:1300, baseAtk:105, baseXp:500, color:0xf5e8d8, eyeColor:0xffec8b, size:2.5, icon:'😇', canBeMob:false },
    { name:'Sky Sentinel',     baseHp:1200, baseAtk:102, baseXp:480, color:0xe8d8c8, eyeColor:0xffa500, size:2.3, icon:'🦅', canBeMob:false },
    { name:'Light Bringer',    baseHp:1250, baseAtk:108, baseXp:520, color:0xffffe0, eyeColor:0xffff00, size:2.2, icon:'✨', canBeMob:true  },
  ],
  9: [ // Eternal Void (Lv 100+)
    { name:'Void Abomination', baseHp:1500, baseAtk:120, baseXp:600, color:0x2a0a3a, eyeColor:0x9932cc, size:2.8, icon:'👾', canBeMob:false },
    { name:'Eternal Horror',   baseHp:1600, baseAtk:128, baseXp:650, color:0x1a0a2a, eyeColor:0x8b00ff, size:3.0, icon:'👹', canBeMob:false },
    { name:'Abyss Lord',       baseHp:1700, baseAtk:135, baseXp:700, color:0x0a001a, eyeColor:0xbf00ff, size:3.2, icon:'👑', canBeMob:false },
    { name:'Null Entity',      baseHp:1400, baseAtk:115, baseXp:550, color:0x3a1a4a, eyeColor:0xda70d6, size:2.5, icon:'🌑', canBeMob:true  },
  ],
};

export const RARITIES = {
  common:    { name:'Common',    color:'#aaa',    mult:1.0,  chance:60 },
  uncommon:  { name:'Uncommon',  color:'#44ff77', mult:1.3,  chance:25 },
  rare:      { name:'Rare',      color:'#4488ff', mult:1.6,  chance:10 },
  epic:      { name:'Epic',      color:'#aa44ff', mult:2.0,  chance:4  },
  legendary: { name:'Legendary', color:'#ffd700', mult:2.8,  chance:1  },
};

export const SHOP_CATALOG = [
  { name:'Health Potion',       slot:'consumable', heal:50,        desc:'Recupera 50 HP.',      icon:'🧪', stackable:true, value:20,  buyPrice:35  },
  { name:'Super Potion',        slot:'consumable', heal:100,       desc:'Recupera 100 HP.',     icon:'🧪', stackable:true, value:40,  buyPrice:65  },
  { name:'Ultra Potion',        slot:'consumable', heal:200,       desc:'Recupera 200 HP.',     icon:'🧪', stackable:true, value:75,  buyPrice:110 },
  { name:'Elixir',              slot:'consumable', heal:500,       desc:'Recupera 500 HP.',     icon:'💧', stackable:true, value:150, buyPrice:220 },
  { name:'Poção de Energia',    slot:'consumable', restoreSp:50,   desc:'Restaura 50 SP.',      icon:'💙', stackable:true, value:30,  buyPrice:60,  shopOnly:true },
  { name:'Elixir de Mana',      slot:'consumable', restoreSp:120,  desc:'Restaura 120 SP.',     icon:'🔵', stackable:true, value:70,  buyPrice:140, shopOnly:true, reqLevel:8 },
  { name:'Elixir Supremo de SP',slot:'consumable', restoreSp:300,  desc:'Restaura 300 SP.',     icon:'🌀', stackable:true, value:150, buyPrice:300, shopOnly:true, reqLevel:20 },
  { name:'Iron Sword',          slot:'weapon',     atk:7,          desc:'Lâmina de aço.',       icon:'🗡️', stackable:true, value:25,  buyPrice:60,  reqLevel:1  },
  { name:'Knight Blade',        slot:'weapon',     atk:18,         desc:'Lâmina de cavaleiro.', icon:'⚔️', stackable:true, value:80,  buyPrice:180, reqLevel:8  },
  { name:'Dragon Slayer',       slot:'weapon',     atk:25,         desc:'Espada lendária.',     icon:'🐉', stackable:true, value:150, buyPrice:350, reqLevel:15 },
  { name:'Wooden Shield',       slot:'shield',     def:3,          desc:'Escudo de madeira.',   icon:'🛡️', stackable:true, value:15,  buyPrice:35,  reqLevel:1  },
  { name:'Tower Shield',        slot:'shield',     def:15,         desc:'Escudo de torre.',     icon:'🛡️', stackable:true, value:90,  buyPrice:210, reqLevel:10 },
  { name:'Travel Boots',        slot:'boots',      def:2, speed:0.08, desc:'Aumenta velocidade.', icon:'👢', stackable:true, value:30, buyPrice:70,  reqLevel:1 },
  { name:'Swift Boots',         slot:'boots',      def:4, speed:0.12, desc:'Botas rápidas.',    icon:'👢', stackable:true, value:70,  buyPrice:160, reqLevel:7 },
  { name:'Ring of Power',       slot:'ring',       atk:5,          desc:'Anel de ataque.',      icon:'💍', stackable:true, value:35,  buyPrice:80,  reqLevel:1  },
  { name:'Ring of Life',        slot:'ring',       hp:30,          desc:'Anel com gema azul.',  icon:'💎', stackable:true, value:40,  buyPrice:90,  reqLevel:1  },
  { name:'Cloth Cape',          slot:'cape',       def:2,          desc:'Capa de tecido.',      icon:'🧥', stackable:true, value:12,  buyPrice:28,  reqLevel:1  },
  { name:'Royal Cape',          slot:'cape',       def:8, sp:35,   desc:'Capa real.',           icon:'👑', stackable:true, value:100, buyPrice:230, reqLevel:10 },
];

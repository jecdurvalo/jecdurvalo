/**
 * LootSystem — tabela de loot, raridade, criação de itens com drop.
 */
import { RARITIES } from '../core/Config.js';

// Loot table extraída do original (condensada por tier)
export const LOOT_TABLE = [
  // TIER 1 — Lv 1-4
  { name:'Graveto Afiado',   slot:'weapon',     atk:2,              desc:'Um galho endurecido no fogo.', icon:'🪵', value:6,  minLevel:1 },
  { name:'Faca Enferrujada', slot:'weapon',     atk:4,              desc:'Lâmina gasta mas funcional.',  icon:'🗡️', value:12, minLevel:1 },
  { name:'Tampa de Barril',  slot:'shield',     def:2,              desc:'Proteção improvisada.',         icon:'🪣', value:8,  minLevel:1 },
  { name:'Capa de Pano',     slot:'cape',       def:1,              desc:'Tecido velho costurado.',       icon:'🧥', value:5,  minLevel:1 },
  { name:'Botas Gastas',     slot:'boots',      def:1, speed:0.03,  desc:'Sola quase no fim.',            icon:'👟', value:7,  minLevel:1 },
  { name:'Anel de Cobre',    slot:'ring',       atk:1,              desc:'Simples anel de cobre.',        icon:'💍', value:8,  minLevel:1 },
  { name:'Poção de Saúde',   slot:'consumable', heal:40,            desc:'Recupera 40 HP.',               icon:'🧪', stackable:true, value:15, minLevel:1 },
  // TIER 2 — Lv 5-9
  { name:'Espada de Ferro',  slot:'weapon',     atk:7,              desc:'Lâmina de ferro forjado.',      icon:'🗡️', value:28, minLevel:5 },
  { name:'Escudo de Ferro',  slot:'shield',     def:5,              desc:'Escudo resistente.',            icon:'🛡️', value:22, minLevel:5 },
  { name:'Botas de Couro',   slot:'boots',      def:3, speed:0.06,  desc:'Couro reforçado.',              icon:'👢', value:18, minLevel:5 },
  { name:'Anel de Prata',    slot:'ring',       atk:3, def:1,       desc:'Anel de prata polido.',         icon:'💍', value:25, minLevel:5 },
  { name:'Capa de Lobo',     slot:'cape',       def:3,              desc:'Pele de lobo curtida.',         icon:'🧥', value:20, minLevel:5 },
  { name:'Poção Média',      slot:'consumable', heal:80,            desc:'Recupera 80 HP.',               icon:'🧪', stackable:true, value:30, minLevel:5 },
  // TIER 3 — Lv 10-19
  { name:'Espada de Aço',    slot:'weapon',     atk:14,             desc:'Lâmina afiada de aço.',         icon:'⚔️', value:55, minLevel:10 },
  { name:'Escudo de Aço',    slot:'shield',     def:10,             desc:'Proteção sólida.',              icon:'🛡️', value:48, minLevel:10 },
  { name:'Botas de Ferro',   slot:'boots',      def:5, speed:0.09,  desc:'Firmeza a cada passo.',         icon:'👢', value:42, minLevel:10 },
  { name:'Anel de Ouro',     slot:'ring',       atk:5, hp:15,       desc:'Anel de ouro lustroso.',        icon:'💍', value:50, minLevel:10 },
  { name:'Manto das Sombras',slot:'cape',       def:6,              desc:'Tecido escuro misterioso.',     icon:'🧥', value:45, minLevel:10 },
  // TIER 4 — Lv 20-34
  { name:'Lâmina do Dragão', slot:'weapon',     atk:22, sp:10,      desc:'Escamas fundidas na lâmina.',  icon:'🐉', value:120, minLevel:20 },
  { name:'Escudo Rúnico',    slot:'shield',     def:16,             desc:'Runas gravadas no aço.',        icon:'🛡️', value:100, minLevel:20 },
  { name:'Botas do Vento',   slot:'boots',      def:6, speed:0.14,  desc:'Leves como o vento.',           icon:'👢', value:95, minLevel:20 },
  { name:'Anel de Safira',   slot:'ring',       atk:8, sp:20,       desc:'Pedra azul pulsante.',          icon:'💙', value:110, minLevel:20 },
  // TIER 5 — Lv 35+
  { name:'Espada Antiga',    slot:'weapon',     atk:32, hp:20,      desc:'Artefato de eras passadas.',   icon:'⚔️', value:220, minLevel:35 },
  { name:'Escudo Ancestral', slot:'shield',     def:24, hp:50,      desc:'Proteção dos antigos.',         icon:'🛡️', value:200, minLevel:35 },
  { name:'Anel Eterno',      slot:'ring',       atk:16, hp:55, sp:28, desc:'Poder que não acaba.',       icon:'♾️', value:225, minLevel:35 },
];

export const BOSS_LOOT_TABLE = [
  { name:'Espada do Chefe Goblin',    slot:'weapon', atk:12, hp:20,         desc:'Troféu do primeiro boss.', icon:'🗡️', value:50,  minLevel:5,  bossOnly:true },
  { name:'Machado do Rei Orc',        slot:'weapon', atk:22, hp:35,         desc:'Forjado pelo rei dos orcs.',icon:'🪓', value:95,  minLevel:10, bossOnly:true },
  { name:'Amuleto do Dragão Ancião',  slot:'ring',   atk:10, hp:50, sp:20,  desc:'Escama do dragão primordial.',icon:'🐉', value:110, minLevel:10, bossOnly:true },
  { name:'Foice do Ceifador Sombrio', slot:'weapon', atk:45, sp:40, hp:-25, desc:'Almas aprisionadas na lâmina.',icon:'💀', value:280, minLevel:35, bossOnly:true },
  { name:'Espada da Fênix Renascida', slot:'weapon', atk:55, hp:70, sp:30,  desc:'Chamas eternas.',           icon:'🔥', value:450, minLevel:50, bossOnly:true },
];

export function rollRarity(playerLevel) {
  const roll = Math.random() * 100;
  let cumulative = 0;
  for (const [key, r] of Object.entries(RARITIES)) {
    cumulative += r.chance;
    if (roll < cumulative) return { key, ...r };
  }
  return { key: 'common', ...RARITIES.common };
}

export function createItem(baseItem, rarity = null) {
  const item = JSON.parse(JSON.stringify(baseItem));
  if (item.slot !== 'consumable') {
    item.durability = 100;
    item.maxDurability = 100;
  }
  if (item.stackable) item.quantity = 1;

  if (rarity && rarity.key !== 'common') {
    item.rarity = rarity.key;
    item.rarityColor = rarity.color;
    item.name = `[${rarity.name}] ${item.name}`;
    ['atk','def','hp','sp'].forEach(stat => {
      if (item[stat]) item[stat] = Math.round(item[stat] * rarity.mult);
    });
    if (item.value) item.value = Math.round(item.value * rarity.mult);
  }
  return item;
}

export function getLoot(playerLevel, isBoss) {
  const available = LOOT_TABLE.filter(i => i.minLevel <= playerLevel);
  const source = available.length > 0 ? available : LOOT_TABLE.filter(i => i.minLevel <= 1);
  const dropCount = isBoss ? 5 : Math.floor(Math.random() * 3);
  const drops = [];

  for (let i = 0; i < dropCount; i++) {
    if (Math.random() > 0.4) {
      let base;
      if (isBoss && Math.random() < 0.4) {
        const bossAvail = BOSS_LOOT_TABLE.filter(i => i.minLevel <= playerLevel);
        base = bossAvail.length > 0 ? bossAvail[Math.floor(Math.random() * bossAvail.length)] : null;
      }
      if (!base) base = source[Math.floor(Math.random() * source.length)];
      const rarity = rollRarity(playerLevel);
      drops.push(createItem(base, rarity));
    }
  }
  return drops;
}

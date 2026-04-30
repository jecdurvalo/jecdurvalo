/**
 * QuestSystem — missões com progresso e recompensas.
 */
import { state } from '../core/GameState.js';
import { floatingText } from '../graphics/VisualEffects.js';
import { log } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';

export const QUESTS_TEMPLATE = [
  // ── Quests iniciais ──────────────────────────────────────────────────────
  { id:'quest_1',  name:'Iniciante',            desc:'Derrote 5 Slimes',                  icon:'🐌', target:5,   type:'slime_kills',    rewardXP:50,   rewardGold:25,  rewardSP:0 },
  { id:'quest_2',  name:'Caçador de Lobos',     desc:'Derrote 10 Lobos',                  icon:'🐺', target:10,  type:'wolf_kills',     rewardXP:100,  rewardGold:50,  rewardSP:1 },
  { id:'quest_3',  name:'Coletor',              desc:'Colete 15 itens',                   icon:'🎒', target:15,  type:'items',          rewardXP:75,   rewardGold:40,  rewardSP:0 },
  { id:'quest_4',  name:'Boss Slayer I',        desc:'Derrote 3 Bosses',                  icon:'👹', target:3,   type:'boss_kills',     rewardXP:200,  rewardGold:150, rewardSP:2 },
  { id:'quest_5',  name:'Caçador de Aranhas',   desc:'Derrote 8 Aranhas',                 icon:'🕷️', target:8,   type:'spider_kills',   rewardXP:80,   rewardGold:45,  rewardSP:1 },
  { id:'quest_6',  name:'Orc Hunter',           desc:'Derrote 12 Orcs',                   icon:'👹', target:12,  type:'orc_kills',      rewardXP:120,  rewardGold:60,  rewardSP:1 },
  { id:'quest_7',  name:'Dragon Slayer',        desc:'Derrote 5 Dragões',                 icon:'🐉', target:5,   type:'dragon_kills',   rewardXP:300,  rewardGold:200, rewardSP:3 },
  { id:'quest_8',  name:'Desert Explorer',      desc:'Derrote 20 monstros do deserto',    icon:'🏜️', target:20,  type:'desert_kills',   rewardXP:180,  rewardGold:100, rewardSP:2 },
  { id:'quest_9',  name:'Ice Master',           desc:'Derrote 15 monstros de gelo',       icon:'❄️', target:15,  type:'ice_kills',      rewardXP:200,  rewardGold:120, rewardSP:2 },
  { id:'quest_10', name:'Fire Walker',          desc:'Derrote 25 monstros vulcânicos',    icon:'🔥', target:25,  type:'fire_kills',     rewardXP:350,  rewardGold:200, rewardSP:4 },

  // ── Quests de biomas avançados ───────────────────────────────────────────
  { id:'quest_11', name:'Caçador da Floresta',  desc:'Derrote 20 Treants',                icon:'🌳', target:20,  type:'treant_kills',   rewardXP:150,  rewardGold:80,  rewardSP:1 },
  { id:'quest_12', name:'Caçador Místico',      desc:'Derrote 20 criaturas místicas',     icon:'👻', target:20,  type:'mystic_kills',   rewardXP:400,  rewardGold:250, rewardSP:3 },
  { id:'quest_13', name:'Explorador de Cristal',desc:'Derrote 15 criaturas de cristal',   icon:'💎', target:15,  type:'crystal_kills',  rewardXP:500,  rewardGold:300, rewardSP:4 },
  { id:'quest_14', name:'Caçador das Sombras',  desc:'Derrote 20 criaturas sombrias',     icon:'👤', target:20,  type:'shadow_kills',   rewardXP:600,  rewardGold:400, rewardSP:5 },
  { id:'quest_15', name:'Celestial Slayer',     desc:'Derrote 15 seres celestiais',       icon:'👼', target:15,  type:'celestial_kills',rewardXP:800,  rewardGold:500, rewardSP:6 },
  { id:'quest_16', name:'Destruidor do Vazio',  desc:'Derrote 10 entidades do vazio',     icon:'👾', target:10,  type:'void_kills',     rewardXP:1000, rewardGold:700, rewardSP:8 },

  // ── Quests de habilidades ────────────────────────────────────────────────
  { id:'quest_17', name:'Mago de Fogo',         desc:'Lance 20 Fireballs',                icon:'🔥', target:20,  type:'fireball_hits',  rewardXP:300,  rewardGold:150, rewardSP:2 },
  { id:'quest_18', name:'Velocidade do Vento',  desc:'Use Dash 30 vezes',                 icon:'💨', target:30,  type:'dash_uses',      rewardXP:200,  rewardGold:100, rewardSP:2 },
  { id:'quest_19', name:'Destruição em Massa',  desc:'Use AOE 15 vezes',                  icon:'💥', target:15,  type:'aoe_uses',       rewardXP:250,  rewardGold:150, rewardSP:3 },

  // ── Quests de exploração ─────────────────────────────────────────────────
  { id:'quest_20', name:'Explorador I',         desc:'Visite 3 biomas diferentes',        icon:'🗺️', target:3,   type:'biomes',         rewardXP:150,  rewardGold:75,  rewardSP:1 },
  { id:'quest_21', name:'Explorador II',        desc:'Visite 6 biomas diferentes',        icon:'🗺️', target:6,   type:'biomes',         rewardXP:400,  rewardGold:200, rewardSP:3 },
  { id:'quest_22', name:'Explorador III',       desc:'Visite todos os 10 biomas',         icon:'🌍', target:10,  type:'biomes',         rewardXP:1000, rewardGold:600, rewardSP:8 },

  // ── Quests de progressão geral ───────────────────────────────────────────
  { id:'quest_23', name:'Grande Caçador',       desc:'Derrote 100 inimigos',              icon:'⚔️', target:100, type:'kills',          rewardXP:500,  rewardGold:300, rewardSP:4 },
  { id:'quest_24', name:'Caçador de Goblins',   desc:'Derrote 10 Goblins',                icon:'👺', target:10,  type:'goblin_kills',   rewardXP:100,  rewardGold:55,  rewardSP:1 },
  { id:'quest_25', name:'Coletor Avançado',     desc:'Colete 50 itens',                   icon:'📦', target:50,  type:'items',          rewardXP:300,  rewardGold:200, rewardSP:3 },
  { id:'quest_26', name:'Boss Slayer II',       desc:'Derrote 10 Bosses',                 icon:'💀', target:10,  type:'boss_kills',     rewardXP:800,  rewardGold:500, rewardSP:6 },
  { id:'quest_27', name:'Lendário',             desc:'Derrote 500 inimigos',              icon:'👑', target:500, type:'kills',          rewardXP:2000, rewardGold:1500,rewardSP:15 },
];

export function initQuests() {
  state.evolution.quests = QUESTS_TEMPLATE.map(q => ({
    ...q,
    progress: state.evolution.quests.find(s => s.id === q.id)?.progress || 0,
    completed: state.evolution.quests.find(s => s.id === q.id)?.completed || false,
  }));
}

export function updateQuestProgress(type, amount = 1) {
  state.evolution.quests.forEach(quest => {
    if (quest.completed || quest.type !== type) return;
    quest.progress = Math.min(quest.progress + amount, quest.target);
    if (quest.progress >= quest.target) {
      quest.completed = true;
      state.player.gold += quest.rewardGold;
      state.evolution.totalXP += quest.rewardXP;
      if (quest.rewardSP > 0) state.evolution.skillPoints += quest.rewardSP;
      floatingText(`+${quest.rewardXP} XP`, state.hero.position, 'cyan');
      log(`<span style='color:cyan'>✅ Missão: ${quest.name}! +${quest.rewardGold} Gold, +${quest.rewardXP} XP</span>`);
      EventBus.emit('quest:complete', quest);
    }
  });
}

export function getQuestTypeForMonster(monsterName) {
  const n = monsterName.toLowerCase();
  // Biomas avançados — checar antes das palavras genéricas
  if (n.includes('void') || n.includes('abomination') || n.includes('eternal') || n.includes('abyss') || n === 'null entity') return 'void_kills';
  if (n.includes('celestial') || n.includes('divine') || n.includes('angel') || n.includes('sentinel') || n.includes('light bringer')) return 'celestial_kills';
  if (n.includes('shadow') || n.includes('phantom') || n.includes('wraith') || n.includes('nightmare') || n.includes('stalker')) return 'shadow_kills';
  if (n.includes('crystal') || n.includes('gem') || n.includes('mineral') || n.includes('cave warden')) return 'crystal_kills';
  if (n.includes('mystic') || n.includes('arcane') || n.includes('highland') || n.includes('magic construct')) return 'mystic_kills';
  // Biomas elementais
  if (n.includes('fire') || n.includes('lava') || n.includes('obsidian') || n.includes('imp') || n.includes('flame')) return 'fire_kills';
  if (n.includes('ice') || n.includes('yeti') || n.includes('frost') || n.includes('snow') || n.includes('frozen')) return 'ice_kills';
  if (n.includes('bandit') || n.includes('scorpion') || n.includes('worm') || n.includes('mummy') || n.includes('sand')) return 'desert_kills';
  // Floresta
  if (n.includes('treant')) return 'treant_kills';
  if (n.includes('dragon')) return 'dragon_kills';
  if (n.includes('orc')) return 'orc_kills';
  if (n.includes('spider')) return 'spider_kills';
  if (n.includes('slime')) return 'slime_kills';
  if (n.includes('goblin')) return 'goblin_kills';
  if (n.includes('wolf')) return 'wolf_kills';
  return null;
}

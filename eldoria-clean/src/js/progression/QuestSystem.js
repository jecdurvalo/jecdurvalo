/**
 * QuestSystem — missões com progresso e recompensas.
 */
import { state } from '../core/GameState.js';
import { floatingText } from '../graphics/VisualEffects.js';
import { log } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';

export const QUESTS_TEMPLATE = [
  { id:'quest_1',  name:'Iniciante',         desc:'Derrote 5 Slimes',                   icon:'🐌', target:5,  type:'slime_kills',   rewardXP:50,  rewardGold:25,  rewardSP:0 },
  { id:'quest_2',  name:'Caçador de Lobos',  desc:'Derrote 10 Lobos',                   icon:'🐺', target:10, type:'wolf_kills',    rewardXP:100, rewardGold:50,  rewardSP:1 },
  { id:'quest_3',  name:'Coletor',           desc:'Colete 15 itens',                    icon:'🎒', target:15, type:'items',         rewardXP:75,  rewardGold:40,  rewardSP:0 },
  { id:'quest_4',  name:'Boss Slayer',       desc:'Derrote 3 Bosses',                   icon:'👹', target:3,  type:'boss_kills',    rewardXP:200, rewardGold:150, rewardSP:2 },
  { id:'quest_5',  name:'Caçador de Aranhas',desc:'Derrote 8 Aranhas',                  icon:'🕷️', target:8,  type:'spider_kills',  rewardXP:80,  rewardGold:45,  rewardSP:1 },
  { id:'quest_6',  name:'Orc Hunter',        desc:'Derrote 12 Orcs',                    icon:'👹', target:12, type:'orc_kills',     rewardXP:120, rewardGold:60,  rewardSP:1 },
  { id:'quest_7',  name:'Dragon Slayer',     desc:'Derrote 5 Dragões',                  icon:'🐉', target:5,  type:'dragon_kills',  rewardXP:300, rewardGold:200, rewardSP:3 },
  { id:'quest_8',  name:'Desert Explorer',   desc:'Derrote 20 monstros do deserto',     icon:'🏜️', target:20, type:'desert_kills',  rewardXP:180, rewardGold:100, rewardSP:2 },
  { id:'quest_9',  name:'Ice Master',        desc:'Derrote 15 monstros de gelo',        icon:'❄️', target:15, type:'ice_kills',     rewardXP:200, rewardGold:120, rewardSP:2 },
  { id:'quest_10', name:'Fire Walker',       desc:'Derrote 25 monstros vulcânicos',     icon:'🔥', target:25, type:'fire_kills',    rewardXP:350, rewardGold:200, rewardSP:4 },
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
    quest.progress += amount;
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
  if (n.includes('wolf'))    return 'wolf_kills';
  if (n.includes('slime'))   return 'slime_kills';
  if (n.includes('spider'))  return 'spider_kills';
  if (n.includes('orc'))     return 'orc_kills';
  if (n.includes('dragon'))  return 'dragon_kills';
  if (n.includes('goblin'))  return 'goblin_kills';
  if (n.includes('treant'))  return 'treant_kills';
  if (n.includes('bandit') || n.includes('scorpion') || n.includes('worm') || n.includes('mummy')) return 'desert_kills';
  if (n.includes('ice') || n.includes('yeti') || n.includes('frost') || n.includes('snow')) return 'ice_kills';
  if (n.includes('fire') || n.includes('lava') || n.includes('obsidian') || n.includes('imp')) return 'fire_kills';
  return null;
}

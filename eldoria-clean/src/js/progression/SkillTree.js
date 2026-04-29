/**
 * SkillTree — define e gerencia a árvore de habilidades do jogador.
 * Cada skill tem custo em skill points e pré-requisitos.
 */
import { state } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';

export const SKILL_DEFINITIONS = [
  { id: 'atk1',      name: '⚔️ Força I',        cost: 1, requires: [],       bonus: { atk: 3 } },
  { id: 'atk2',      name: '⚔️ Força II',       cost: 2, requires: ['atk1'], bonus: { atk: 6 } },
  { id: 'atk3',      name: '⚔️ Força III',      cost: 3, requires: ['atk2'], bonus: { atk: 10 } },
  { id: 'def1',      name: '🛡️ Defesa I',       cost: 1, requires: [],       bonus: { def: 3 } },
  { id: 'def2',      name: '🛡️ Defesa II',      cost: 2, requires: ['def1'], bonus: { def: 6 } },
  { id: 'hp1',       name: '❤️ Vitalidade I',   cost: 1, requires: [],       bonus: { hp: 30 } },
  { id: 'hp2',       name: '❤️ Vitalidade II',  cost: 2, requires: ['hp1'],  bonus: { hp: 60 } },
  { id: 'speed1',    name: '💨 Agilidade',       cost: 2, requires: [],       bonus: { speed: 0.1 } },
  { id: 'crit1',     name: '🎯 Crítico I',       cost: 2, requires: ['atk1'], bonus: { critChance: 0.05 } },
  { id: 'crit2',     name: '🎯 Crítico II',      cost: 3, requires: ['crit1'], bonus: { critChance: 0.10 } },
  { id: 'lifesteal', name: '🧛 Vampirismo',      cost: 3, requires: ['atk2'], bonus: { lifesteal: 0.10 } },
  { id: 'dash',      name: '💨 Dash',            cost: 2, requires: ['speed1'], bonus: {} },
  { id: 'shield',    name: '🔰 Escudo Arcano',   cost: 2, requires: ['def1'],   bonus: {} },
  { id: 'fireball2', name: '🔥 Fireball+',       cost: 3, requires: ['atk2'],   bonus: { fireballDmg: 15 } },
  { id: 'aoe2',      name: '💥 AOE+',            cost: 3, requires: ['atk2'],   bonus: { aoeDmg: 20 } },
];

export function getSkillById(id) {
  return SKILL_DEFINITIONS.find(s => s.id === id) ?? null;
}

export function canUnlock(skillId) {
  const skill = getSkillById(skillId);
  if (!skill) return false;
  if (state.evolution.skillPoints < skill.cost) return false;
  const tree = state.evolution.skillTree ?? [];
  return skill.requires.every(req => tree.includes(req));
}

export function unlockSkill(skillId) {
  if (!canUnlock(skillId)) return false;
  const skill = getSkillById(skillId);
  state.evolution.skillPoints -= skill.cost;
  state.evolution.skillTree = [...(state.evolution.skillTree ?? []), skillId];
  EventBus.emit('skill:unlocked', skill);
  return true;
}

export function isUnlocked(skillId) {
  return (state.evolution.skillTree ?? []).includes(skillId);
}

export function getActiveBonus(prefix) {
  const tree = state.evolution.skillTree ?? [];
  return tree
    .filter(id => id.startsWith(prefix))
    .reduce((sum, id) => {
      const s = getSkillById(id);
      const key = Object.keys(s?.bonus ?? {})[0];
      return sum + (s?.bonus[key] ?? 0);
    }, 0);
}

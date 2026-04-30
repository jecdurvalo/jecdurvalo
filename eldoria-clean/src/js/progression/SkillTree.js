/**
 * SkillTree — define e gerencia a árvore de habilidades do jogador.
 * Cada skill tem custo em skill points, pré-requisitos e nível mínimo opcional.
 */
import { state } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';

export const SKILL_DEFINITIONS = [
  // ── Tier 1 — sem requisitos ──────────────────────────────────────────────
  { id:'atk1',               name:'⚔️ Força I',              cost:1, requires:[],                        bonus:{ atk:3 } },
  { id:'def1',               name:'🛡️ Defesa I',             cost:1, requires:[],                        bonus:{ def:3 } },
  { id:'hp1',                name:'❤️ Vitalidade I',          cost:1, requires:[],                        bonus:{ hp:30 } },
  { id:'speed1',             name:'💨 Agilidade',             cost:2, requires:[],                        bonus:{ speed:0.1 } },

  // ── Tier 2 — requer Tier 1 ───────────────────────────────────────────────
  { id:'atk2',               name:'⚔️ Força II',             cost:2, requires:['atk1'],                  bonus:{ atk:6 } },
  { id:'def2',               name:'🛡️ Defesa II',            cost:2, requires:['def1'],                  bonus:{ def:6 } },
  { id:'hp2',                name:'❤️ Vitalidade II',         cost:2, requires:['hp1'],                   bonus:{ hp:60 } },
  { id:'crit1',              name:'🎯 Crítico I',             cost:2, requires:['atk1'],                  bonus:{ critChance:0.05 } },
  { id:'dash',               name:'💨 Dash',                  cost:2, requires:['speed1'],                bonus:{} },
  { id:'shield',             name:'🔰 Escudo Arcano',         cost:2, requires:['def1'],                  bonus:{} },

  // ── Tier 3 — nível 10+ ───────────────────────────────────────────────────
  { id:'atk3',               name:'⚔️ Força III',            cost:3, requires:['atk2'],    reqLevel:10,  bonus:{ atk:10 } },
  { id:'def3',               name:'🛡️ Defesa III',           cost:3, requires:['def2'],    reqLevel:10,  bonus:{ def:12 } },
  { id:'hp3',                name:'❤️ Vitalidade III',        cost:3, requires:['hp2'],     reqLevel:12,  bonus:{ hp:100 } },
  { id:'crit2',              name:'🎯 Crítico II',            cost:3, requires:['crit1'],   reqLevel:10,  bonus:{ critChance:0.10 } },
  { id:'lifesteal',          name:'🧛 Vampirismo',            cost:3, requires:['atk2'],    reqLevel:10,  bonus:{ lifesteal:0.10 } },
  { id:'fireball2',          name:'🔥 Fireball+',             cost:3, requires:['atk2'],    reqLevel:12,  bonus:{ fireballDmg:15 } },
  { id:'aoe2',               name:'💥 AOE+',                  cost:3, requires:['atk2'],    reqLevel:15,  bonus:{ aoeDmg:20 } },
  { id:'double_dash',        name:'💨 Dash Duplo',            cost:3, requires:['dash'],    reqLevel:15,  bonus:{} },

  // ── Tier 4 — nível 20+ ───────────────────────────────────────────────────
  { id:'atk4',               name:'⚔️ Força IV',             cost:4, requires:['atk3'],    reqLevel:20,  bonus:{ atk:15 } },
  { id:'crit3',              name:'🎯 Crítico III',           cost:4, requires:['crit2'],   reqLevel:20,  bonus:{ critChance:0.15 } },
  { id:'lifesteal2',         name:'🧛 Vampirismo II',         cost:4, requires:['lifesteal'],reqLevel:25, bonus:{ lifesteal:0.15 } },
  { id:'fb_dmg_1',           name:'🔥 Fireball++',            cost:3, requires:['fireball2'],reqLevel:20, bonus:{ fireballDmg:25 } },
  { id:'aoe_dmg_1',          name:'💥 AOE++',                 cost:3, requires:['aoe2'],    reqLevel:25,  bonus:{ aoeDmg:30 } },
  { id:'shield2',            name:'🔰 Escudo Reforçado',      cost:3, requires:['shield'],  reqLevel:20,  bonus:{} },
  { id:'berserk',            name:'⚡ Fúria',                 cost:4, requires:['atk2'],    reqLevel:25,  bonus:{} },

  // ── Tier 5 — nível 40+ ───────────────────────────────────────────────────
  { id:'legendary_strength', name:'💪 Força Lendária',        cost:5, requires:['atk4'],    reqLevel:40,  bonus:{ atk:25 } },
  { id:'hp4',                name:'❤️ Vitalidade IV',         cost:4, requires:['hp3'],     reqLevel:40,  bonus:{ hp:200 } },
  { id:'crit4',              name:'🎯 Crítico IV',            cost:5, requires:['crit3'],   reqLevel:45,  bonus:{ critChance:0.20 } },
  { id:'fb_dmg_2',           name:'🔥 Fireball Suprema',      cost:4, requires:['fb_dmg_1'],reqLevel:40,  bonus:{ fireballDmg:40 } },
  { id:'aoe_dmg_2',          name:'💥 AOE Supremo',           cost:4, requires:['aoe_dmg_1'],reqLevel:50, bonus:{ aoeDmg:50 } },
  { id:'mana_shield',        name:'🔮 Escudo de Mana',        cost:4, requires:['shield2'], reqLevel:40,  bonus:{} },

  // ── Tier 6 — nível 60+ ───────────────────────────────────────────────────
  { id:'divine_power',       name:'✨ Poder Divino',           cost:6, requires:['legendary_strength'], reqLevel:60, bonus:{ atk:40 } },
  { id:'fb_dmg_3',           name:'🔥 Fireball Devastadora',  cost:5, requires:['fb_dmg_2'],reqLevel:60,  bonus:{ fireballDmg:60 } },
  { id:'aoe_dmg_3',          name:'💥 AOE Devastador',        cost:5, requires:['aoe_dmg_2'],reqLevel:75, bonus:{ aoeDmg:75 } },
  { id:'god_mode',           name:'👑 Modo Deus',             cost:8, requires:['divine_power'], reqLevel:100, bonus:{ atk:60, def:30, hp:500 } },
];

export function getSkillById(id) {
  return SKILL_DEFINITIONS.find(s => s.id === id) ?? null;
}

export function canUnlock(skillId) {
  const skill = getSkillById(skillId);
  if (!skill) return false;
  if (state.evolution.skillPoints < skill.cost) return false;
  if (skill.reqLevel && state.player.level < skill.reqLevel) return false;
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

export function getSkillBonus(bonusKey) {
  const tree = state.evolution.skillTree ?? [];
  return SKILL_DEFINITIONS
    .filter(s => tree.includes(s.id) && s.bonus[bonusKey] != null)
    .reduce((sum, s) => sum + s.bonus[bonusKey], 0);
}

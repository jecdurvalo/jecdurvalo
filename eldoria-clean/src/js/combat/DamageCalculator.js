/**
 * DamageCalculator — cálculo puro de dano (sem efeitos colaterais).
 * Fácil de testar isoladamente.
 */
import { state } from '../core/GameState.js';
import { SKILL_DEFINITIONS } from '../progression/SkillTree.js';

function getSkillStatBonus(statKey) {
  const tree = state.evolution.skillTree ?? [];
  return SKILL_DEFINITIONS
    .filter(s => tree.includes(s.id) && s.bonus[statKey] != null)
    .reduce((sum, s) => sum + s.bonus[statKey], 0);
}

/**
 * @param {number} baseAtk  - Ataque base do atacante
 * @param {number} targetDef - Defesa do alvo
 * @param {object} opts     - { magical, critChance, bonus }
 * @returns {{ damage: number, isCrit: boolean }}
 */
export function calcDamage(baseAtk, targetDef, opts = {}) {
  const {
    magical    = false,
    critChance = 0,
    critMult   = 1.8,
    bonus      = 0,
    forceCrit,           // true | false | undefined (undefined = aleatório)
  } = opts;

  const reduction = magical ? 0 : targetDef;
  let damage = Math.max(1, baseAtk + bonus - reduction + Math.floor(Math.random() * (baseAtk * 0.2 + 3)));

  const isCrit = forceCrit !== undefined ? forceCrit : Math.random() < critChance;
  if (isCrit) damage = Math.floor(damage * critMult);

  return { damage, isCrit };
}

export function getPlayerAtk() {
  const { player, equipped } = state;
  return player.baseAtk
    + (equipped.weapon?.atk || 0)
    + (equipped.ring1?.atk  || 0)
    + (equipped.ring2?.atk  || 0)
    + getSkillStatBonus('atk');
}

export function getPlayerDef() {
  const { player, equipped } = state;
  return (player.baseDef || 0)
    + (equipped.shield?.def || 0)
    + (equipped.cape?.def   || 0)
    + (equipped.boots?.def  || 0)
    + (equipped.ring1?.def  || 0)
    + (equipped.ring2?.def  || 0)
    + getSkillStatBonus('def');
}

export function getPlayerSpeed() {
  const { player, equipped } = state;
  return 0.35
    + (equipped.boots?.speed || 0)
    + (player.speedBonus     || 0)
    + getSkillStatBonus('speed');
}

export function getPlayerCritChance() {
  return (state.player.critChance || 0) + getSkillStatBonus('critChance');
}

export function getPlayerLifesteal() {
  return (state.player.lifesteal || 0) + getSkillStatBonus('lifesteal');
}

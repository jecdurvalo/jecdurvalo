/**
 * DamageCalculator — cálculo puro de dano (sem efeitos colaterais).
 * Fácil de testar isoladamente.
 */
import { state } from '../core/GameState.js';

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
  return player.baseAtk + (equipped.weapon?.atk || 0) + (equipped.ring1?.atk || 0) + (equipped.ring2?.atk || 0);
}

export function getPlayerDef() {
  const { player, equipped } = state;
  return (player.baseDef || 0)
    + (equipped.shield?.def || 0)
    + (equipped.cape?.def   || 0)
    + (equipped.boots?.def  || 0)
    + (equipped.ring1?.def  || 0)
    + (equipped.ring2?.def  || 0);
}

export function getPlayerSpeed() {
  const { player, equipped } = state;
  return 0.35 + (equipped.boots?.speed || 0) + (player.speedBonus || 0);
}

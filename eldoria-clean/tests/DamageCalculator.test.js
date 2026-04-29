/**
 * Testes unitários: DamageCalculator
 * Cobre a função pura mais crítica do combate.
 */
import { describe, it, expect } from './runner.js';
import { calcDamage, getPlayerAtk, getPlayerDef, getPlayerSpeed } from '../src/js/combat/DamageCalculator.js';

describe('calcDamage — dano básico', () => {
  it('retorna dano positivo com atk > def', () => {
    const { damage } = calcDamage(20, 5);
    expect(damage).toBeGreaterThan(0);
  });

  it('garante dano mínimo de 1 mesmo quando def >= atk', () => {
    const { damage } = calcDamage(5, 50);
    expect(damage).toBeGreaterThan(0);
  });

  it('dano mágico ignora defesa', () => {
    const { damage } = calcDamage(30, 999, { magical: true });
    expect(damage).toBe(30);
  });

  it('crítico multiplica por critMult', () => {
    const { damage, isCrit } = calcDamage(20, 0, { forceCrit: true, critMult: 2 });
    expect(isCrit).toBe(true);
    expect(damage).toBe(40);
  });

  it('sem crítico quando forceCrit = false', () => {
    const { isCrit } = calcDamage(10, 0, { forceCrit: false, critChance: 0 });
    expect(isCrit).toBe(false);
  });
});

describe('calcDamage — variação aleatória', () => {
  it('dano é sempre >= 1', () => {
    for (let i = 0; i < 100; i++) {
      const { damage } = calcDamage(10, 10);
      expect(damage).toBeGreaterThan(0);
    }
  });

  it('dano não ultrapassa atk * 1.2 + 3 (sem crítico)', () => {
    for (let i = 0; i < 100; i++) {
      const { damage } = calcDamage(20, 0, { forceCrit: false, critChance: 0 });
      expect(damage).toBeLessThanOrEqual(27); // 20 * 1.2 + 3 = 27
    }
  });
});

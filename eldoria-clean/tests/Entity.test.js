/**
 * Testes unitários: Entity, Player, Monster
 */
import { describe, it, expect } from './runner.js';
import { Entity } from '../src/js/entities/Entity.js';
import { Player } from '../src/js/entities/Player.js';
import { Monster } from '../src/js/entities/Monster.js';

describe('Entity — ciclo de vida', () => {
  it('começa vivo com hp correto', () => {
    const e = new Entity({ name: 'Test', hp: 100, maxHp: 100, atk: 5, def: 2 });
    expect(e.isAlive()).toBeTruthy();
    expect(e.hp).toBe(100);
  });

  it('takeDamage reduz hp', () => {
    const e = new Entity({ name: 'Test', hp: 100, maxHp: 100, atk: 5, def: 2 });
    e.takeDamage(30);
    expect(e.hp).toBe(70);
  });

  it('hp não vai abaixo de 0', () => {
    const e = new Entity({ name: 'Test', hp: 10, maxHp: 100, atk: 5, def: 2 });
    e.takeDamage(9999);
    expect(e.hp).toBe(0);
    expect(e.isAlive()).toBeFalsy();
  });

  it('heal restaura hp até maxHp', () => {
    const e = new Entity({ name: 'Test', hp: 30, maxHp: 100, atk: 5, def: 2 });
    e.heal(200);
    expect(e.hp).toBe(100);
  });
});

describe('Player — SP e gold', () => {
  it('spendSP desconta corretamente', () => {
    const p = new Player({ sp: 100 });
    const ok = p.spendSP(40);
    expect(ok).toBeTruthy();
    expect(p.sp).toBe(60);
  });

  it('spendSP falha quando SP insuficiente', () => {
    const p = new Player({ sp: 10 });
    const ok = p.spendSP(30);
    expect(ok).toBeFalsy();
    expect(p.sp).toBe(10);
  });

  it('spendGold debita gold', () => {
    const p = new Player({ gold: 100 });
    p.spendGold(60);
    expect(p.gold).toBe(40);
  });

  it('spendGold falha sem saldo', () => {
    const p = new Player({ gold: 10 });
    const ok = p.spendGold(50);
    expect(ok).toBeFalsy();
  });
});

describe('Monster — efeitos de status', () => {
  it('adiciona e detecta efeito', () => {
    const m = new Monster({ name: 'Goblin', hp: 50, atk: 5 });
    m.addEffect({ type: 'burn', duration: 3000, onTick: () => {} });
    expect(m.hasEffect('burn')).toBeTruthy();
  });

  it('não duplica efeito do mesmo tipo', () => {
    const m = new Monster({ name: 'Goblin', hp: 50, atk: 5 });
    m.addEffect({ type: 'burn', duration: 1000, onTick: () => {} });
    m.addEffect({ type: 'burn', duration: 5000, onTick: () => {} });
    expect(m.statusEffects.length).toBe(1);
    expect(m.statusEffects[0].duration).toBe(5000);
  });

  it('tickEffects remove efeito expirado', () => {
    const m = new Monster({ name: 'Goblin', hp: 50, atk: 5 });
    m.addEffect({ type: 'slow', duration: 10, onTick: () => {} });
    m.tickEffects(20);
    expect(m.hasEffect('slow')).toBeFalsy();
  });
});

/**
 * Player — entidade do jogador. Estende Entity com SP, XP e inventário.
 */
import { Entity } from './Entity.js';

export class Player extends Entity {
  constructor(data = {}) {
    super({
      id:    data.id    ?? 'player',
      name:  data.name  ?? 'Herói',
      hp:    data.hp    ?? 100,
      maxHp: data.maxHp ?? 100,
      atk:   data.atk   ?? 10,
      def:   data.def   ?? 0,
      level: data.level ?? 1,
    });
    this.sp          = data.sp          ?? 100;
    this.maxSp       = data.maxSp       ?? 100;
    this.xp          = data.xp          ?? 0;
    this.next        = data.next        ?? 100;
    this.gold        = data.gold        ?? 0;
    this.baseAtk     = data.baseAtk     ?? 10;
    this.baseDef     = data.baseDef     ?? 0;
    this.speedBonus  = data.speedBonus  ?? 0;
    this.lifesteal   = data.lifesteal   ?? 0;
    this.critChance  = data.critChance  ?? 0.05;
    this.critMult    = data.critMult    ?? 1.8;
  }

  spendSP(amount) {
    if (this.sp < amount) return false;
    this.sp -= amount;
    return true;
  }

  restoreSP(amount) {
    this.sp = Math.min(this.maxSp, this.sp + amount);
  }

  addGold(amount) { this.gold += amount; }

  spendGold(amount) {
    if (this.gold < amount) return false;
    this.gold -= amount;
    return true;
  }

  toJSON() {
    return { ...super.toJSON(), sp: this.sp, maxSp: this.maxSp,
             xp: this.xp, next: this.next, gold: this.gold,
             baseAtk: this.baseAtk, baseDef: this.baseDef,
             speedBonus: this.speedBonus, lifesteal: this.lifesteal,
             critChance: this.critChance, critMult: this.critMult };
  }
}

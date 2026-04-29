/**
 * Monster — entidade inimiga. Contém stats, IA e referência ao mesh Three.js.
 */
import { Entity } from './Entity.js';

export class Monster extends Entity {
  constructor({ name, hp, atk, def = 0, level = 1, xp, isBoss = false,
                isElite = false, mesh = null, breatheOffset = 0 }) {
    super({ name, hp, maxHp: hp, atk, def, level });
    this.xp            = xp ?? level * 10;
    this.isBoss        = isBoss;
    this.isElite       = isElite;
    this.mesh          = mesh;
    this.breatheOffset = breatheOffset;
    this.lastAttack    = 0;
    this.statusEffects = [];
  }

  get position() { return this.mesh?.position ?? null; }

  hasEffect(type) { return this.statusEffects.some(e => e.type === type); }

  addEffect(effect) {
    this.statusEffects = this.statusEffects.filter(e => e.type !== effect.type);
    this.statusEffects.push(effect);
  }

  tickEffects(dt) {
    this.statusEffects = this.statusEffects.filter(e => {
      e.duration -= dt;
      if (e.onTick) e.onTick(this);
      return e.duration > 0;
    });
  }

  toJSON() {
    return { ...super.toJSON(), xp: this.xp, isBoss: this.isBoss, isElite: this.isElite };
  }
}

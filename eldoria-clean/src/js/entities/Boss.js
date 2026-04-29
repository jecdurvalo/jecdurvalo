/**
 * Boss — herda Monster com habilidades especiais por bioma.
 * Cada bioma tem uma habilidade de fase 2 (ativa abaixo de 50% HP).
 */
import { Monster } from './Monster.js';

const BOSS_ABILITIES = {
  0: { name: 'Raio Arcano',    spellInterval: 3000, projectileColor: 0x9900ff },
  1: { name: 'Chamas Eternas', spellInterval: 2500, projectileColor: 0xff4400 },
  2: { name: 'Blizzard',       spellInterval: 4000, projectileColor: 0x88ccff },
  3: { name: 'Veneno',         spellInterval: 3500, projectileColor: 0x00ff44 },
  4: { name: 'Trovão',         spellInterval: 2000, projectileColor: 0xffff00 },
  5: { name: 'Maré Sombria',   spellInterval: 3000, projectileColor: 0x003366 },
  6: { name: 'Explosão Solar', spellInterval: 2800, projectileColor: 0xffaa00 },
  7: { name: 'Terremoto',      spellInterval: 3500, projectileColor: 0x884400 },
  8: { name: 'Sombra Eterna',  spellInterval: 2200, projectileColor: 0x220033 },
  9: { name: 'Caos Absoluto',  spellInterval: 1800, projectileColor: 0xff0088 },
};

export class Boss extends Monster {
  constructor({ biomeIndex = 0, level = 1, mesh = null }) {
    const ability = BOSS_ABILITIES[biomeIndex] ?? BOSS_ABILITIES[0];
    const hp = Math.floor(200 + level * 30);
    super({
      name:   `👹 Boss Lv.${level}`,
      hp,
      atk:    Math.floor(15 + level * 2),
      def:    Math.floor(level * 0.5),
      level,
      xp:     Math.floor(150 + level * 20),
      isBoss: true,
      mesh,
    });
    this.biomeIndex      = biomeIndex;
    this.ability         = ability;
    this.lastSpell       = 0;
    this.phase2Active    = false;
  }

  isPhase2() { return this.hp / this.maxHp < 0.5; }

  canCastSpell(now) {
    const interval = this.phase2Active
      ? Math.floor(this.ability.spellInterval * 0.6)
      : this.ability.spellInterval;
    return now - this.lastSpell > interval;
  }

  castSpell(now) {
    this.lastSpell = now;
    return { color: this.ability.projectileColor, name: this.ability.name };
  }

  static getAbility(biomeIndex) {
    return BOSS_ABILITIES[biomeIndex] ?? BOSS_ABILITIES[0];
  }
}

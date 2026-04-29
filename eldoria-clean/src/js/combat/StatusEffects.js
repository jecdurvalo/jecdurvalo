/**
 * StatusEffects — fábrica de efeitos de status (burn, poison, slow, stun).
 * Cada efeito é um objeto com `type`, `duration`, e callback `onTick`.
 */

export const StatusEffects = {
  burn(dmgPerTick = 5, duration = 3000) {
    return {
      type:     'burn',
      duration,
      icon:     '🔥',
      onTick:   (entity) => entity.takeDamage(dmgPerTick),
    };
  },

  poison(dmgPerTick = 3, duration = 5000) {
    return {
      type:     'poison',
      duration,
      icon:     '☠️',
      onTick:   (entity) => entity.takeDamage(dmgPerTick),
    };
  },

  slow(factor = 0.5, duration = 2000) {
    return {
      type:     'slow',
      duration,
      icon:     '🧊',
      speedMod: factor,
      onTick:   () => {},
    };
  },

  stun(duration = 1000) {
    return {
      type:     'stun',
      duration,
      icon:     '⚡',
      onTick:   () => {},
    };
  },
};

export function isStunned(entity) {
  return entity.statusEffects?.some(e => e.type === 'stun') ?? false;
}

export function getSpeedModifier(entity) {
  const slow = entity.statusEffects?.find(e => e.type === 'slow');
  return slow ? slow.speedMod : 1;
}

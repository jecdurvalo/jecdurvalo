/**
 * CollisionHandler — detecta colisões entre projéteis, AOEs e entidades.
 * Separado do GameLoop para isolar a lógica de hit-detection.
 */
import { state } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { floatingText } from '../graphics/VisualEffects.js';

export function checkProjectileHits() {
  state.projectiles = state.projectiles.filter(p => {
    if (!p.tick?.()) { state.scene.remove(p.mesh); return false; }

    if (p.owner === 'player') {
      for (const m of state.monsters) {
        if (p.distanceTo(m) < (p.hitRadius ?? 2)) {
          m.userData.hp -= p.dmg;
          floatingText('🔥 ' + p.dmg, m.position, 'orange');
          if (m.userData.hp <= 0) EventBus.emit('monster:kill', m);
          state.scene.remove(p.mesh);
          return false;
        }
      }
    }

    if (p.owner === 'boss') {
      const { hero, player } = state;
      if (hero && p.distanceTo(hero) < 2) {
        player.hp = Math.max(0, player.hp - p.dmg);
        floatingText('-' + p.dmg, hero.position, 'red');
        if (player.hp <= 0) EventBus.emit('player:die');
        state.scene.remove(p.mesh);
        return false;
      }
    }

    return true;
  });
}

export function checkAOEHits(aoes) {
  return aoes.filter(aoe => {
    if (!aoe.applied) {
      aoe.applied = true;
      for (const m of state.monsters) {
        if (m.position.distanceTo(aoe.origin) < aoe.radius) {
          m.userData.hp -= aoe.dmg;
          floatingText('💥 ' + aoe.dmg, m.position, '#ff88ff');
          if (m.userData.hp <= 0) EventBus.emit('monster:kill', m);
        }
      }
    }
    const alive = aoe.tick?.(16.67);
    if (!alive) state.scene.remove(aoe.mesh);
    return alive;
  });
}

/**
 * AttackSystem — ataque físico básico com animação.
 */
import { state } from '../core/GameState.js';
import { calcDamage, getPlayerAtk } from './DamageCalculator.js';
import { playSound } from '../core/AudioManager.js';
import { floatingText, screenShake } from '../graphics/VisualEffects.js';
import { log } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';

const ATTACK_RANGE = 4;

export function basicAttack() {
  if (state.isAttacking || state.gamePaused) return;
  state.isAttacking = true;
  playSound('attack');

  let hit = false;
  const playerAtk = getPlayerAtk();

  state.monsters.forEach(m => {
    if (m.position.distanceTo(state.hero.position) > ATTACK_RANGE) return;
    const { damage, isCrit } = calcDamage(playerAtk, m.userData.def || 0, {
      critChance: state.player.critChance || 0,
    });
    m.userData.hp -= damage;

    if (state.player.lifesteal > 0) {
      const heal = Math.floor(damage * state.player.lifesteal / 100);
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
    }

    const color = isCrit ? 'orange' : 'white';
    const label = isCrit ? `⚡ CRÍTICO! ${damage}` : String(damage);
    floatingText(label, m.position, color);

    if (m.userData.weapon?.durability !== undefined) {
      m.userData.weapon.durability = Math.max(0, m.userData.weapon.durability - 1);
    }

    if (m.userData.hp <= 0) EventBus.emit('monster:kill', m);
    hit = true;
  });

  if (hit) screenShake(0.15);

  animateAttack(() => { state.isAttacking = false; });
}

function animateAttack(onDone) {
  let t = 0;
  function tick() {
    t += 0.18;
    if (state.weaponGroup) {
      state.weaponGroup.rotation.x = Math.PI / 4 + Math.sin(t) * 1.2;
    } else if (state.hero._hand) {
      state.hero._hand.position.z = 0.4 + Math.sin(t) * 0.4;
    }
    if (t >= Math.PI) {
      if (state.weaponGroup) state.weaponGroup.rotation.x = Math.PI / 4;
      if (state.hero._hand) state.hero._hand.position.z = 0.4;
      onDone();
    } else {
      requestAnimationFrame(tick);
    }
  }
  tick();
}

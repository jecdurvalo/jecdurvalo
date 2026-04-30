/**
 * SkillSystem — fireball, AOE, dash, shield.
 */
import { state } from '../core/GameState.js';
import { GAME } from '../core/Config.js';
import { calcDamage, getPlayerAtk } from './DamageCalculator.js';
import { playSound } from '../core/AudioManager.js';
import { floatingText, screenShake } from '../graphics/VisualEffects.js';
import { log } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';
import { isUnlocked, getSkillBonus } from '../progression/SkillTree.js';
import { updateQuestProgress } from '../progression/QuestSystem.js';

// ── FIREBALL ────────────────────────────────────────────────────────────────
export function castFireball() {
  const { player, hero, lastDir } = state;
  if (player.sp < GAME.FIREBALL_SP_COST) {
    floatingText('Sem SP!', hero.position, 'cyan'); return;
  }
  const now = Date.now();
  if (now - state.lastFireballTime < 800) return;
  state.lastFireballTime = now;

  player.sp -= GAME.FIREBALL_SP_COST;
  playSound('fireball');

  const THREE = window.THREE;
  const proj = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 1.5 })
  );
  proj.position.copy(hero.position).add(new THREE.Vector3(0, 1.5, 0));

  const dir = lastDir ? lastDir.clone().normalize() : new THREE.Vector3(0, 0, -1);
  const baseDmg = 50 + (player.level * 3) + (player.fireballDamageBonus || 0) + getSkillBonus('fireballDmg');
  const hitRadius = 2.5;

  state.scene.add(proj);
  state.projectiles.push({ mesh: proj, vel: dir.multiplyScalar(0.5), life: 80, dmg: baseDmg, hitRadius, owner: 'player' });
  state.evolution.stats.fireballHits++;
  updateQuestProgress('fireball_hits', 1);
}

// ── AOE ─────────────────────────────────────────────────────────────────────
export function castAOE() {
  const { player, hero } = state;
  const now = Date.now();
  if (now - state.lastAoeTime < GAME.AOE_COOLDOWN) {
    const rem = ((GAME.AOE_COOLDOWN - (now - state.lastAoeTime)) / 1000).toFixed(1);
    floatingText(`AOE: ${rem}s`, hero.position, 'cyan'); return;
  }
  if (player.sp < GAME.AOE_SP_COST) { floatingText('Sem SP!', hero.position, 'cyan'); return; }

  state.lastAoeTime = now;
  player.sp -= GAME.AOE_SP_COST;
  state.evolution.stats.aoeUses++;
  playSound('aoe');
  screenShake(0.4);

  const AOE_RADIUS = 8;
  const baseDmg = 80 + (player.level * 4) + (player.aoeDamageBonus || 0) + getSkillBonus('aoeDmg');

  state.monsters.forEach(m => {
    if (m.position.distanceTo(hero.position) > AOE_RADIUS) return;
    const { damage } = calcDamage(baseDmg, 0, { magical: true });
    m.userData.hp -= damage;
    floatingText('💥 ' + damage, m.position, 'orange');
    if (m.userData.hp <= 0) EventBus.emit('monster:kill', m);
  });

  spawnAOEVisual(hero.position.clone(), AOE_RADIUS);
  log("<span style='color:orange'>💥 AOE!</span>");
}

// ── DASH ─────────────────────────────────────────────────────────────────────
export function doDash() {
  const { player, hero, lastDir } = state;
  if (!isDashUnlocked()) { floatingText('Bloqueado!', hero.position, 'gray'); return; }
  const now = Date.now();
  if (now - state.lastDashTime < GAME.DASH_COOLDOWN) return;
  if (player.sp < GAME.DASH_SP_COST) { floatingText('Sem SP!', hero.position, 'cyan'); return; }

  state.lastDashTime = now;
  state.isDashing = true;
  player.sp -= GAME.DASH_SP_COST;
  state.evolution.stats.dashUses++;
  updateQuestProgress('dash_uses', 1);
  playSound('dash');

  const dir = lastDir ? lastDir.clone().normalize().multiplyScalar(8) : new THREE.Vector3(0, 0, -8);
  hero.position.add(dir);
  setTimeout(() => { state.isDashing = false; }, 200);
  floatingText('💨 Dash!', hero.position, '#88ddff');
}

// ── SHIELD ───────────────────────────────────────────────────────────────────
export function doShield() {
  const { player, hero } = state;
  if (!isShieldUnlocked()) { floatingText('Bloqueado!', hero.position, 'gray'); return; }
  const now = Date.now();
  if (now - state.lastShieldTime < GAME.SHIELD_COOLDOWN) return;

  state.lastShieldTime = now;
  state.isShielded = true;
  playSound('shield');

  const el = document.createElement('div');
  el.className = 'shield-visual';
  document.body.appendChild(el);

  floatingText('🔮 Escudo!', hero.position, '#88ddff');
  setTimeout(() => {
    state.isShielded = false;
    el.remove();
  }, GAME.SHIELD_DURATION);
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function isDashUnlocked()   { return isUnlocked('dash'); }
function isShieldUnlocked() { return isUnlocked('shield'); }

function spawnAOEVisual(pos, radius) {
  const THREE = window.THREE;
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 0.3, 32),
    new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff4400, transparent: true, opacity: 0.5 })
  );
  mesh.position.copy(pos);
  state.scene.add(mesh);
  let life = 20;
  const tick = () => {
    life--;
    mesh.material.opacity = life / 20 * 0.5;
    if (life > 0) requestAnimationFrame(tick);
    else state.scene.remove(mesh);
  };
  tick();
}

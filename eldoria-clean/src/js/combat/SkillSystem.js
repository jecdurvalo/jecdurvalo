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

// ── FIREBALL ────────────────────────────────────────────────────────────────
export function castFireball() {
  const { player, hero, lastDir } = state;
  if (player.sp < GAME.FIREBALL_SP_COST) {
    floatingText('Sem SP!', hero.position, 'cyan'); return;
  }
  const now = Date.now();
  if (now - state.lastFireballTime < 800) return;
  state.lastFireballTime = now;

  player.sp -= GAME.FIREBALL_SP_COST + (getActiveSkillBonus('fb_sp_1') ? -10 : 0);
  playSound('fireball');

  const THREE = window.THREE;
  const proj = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 1.5 })
  );
  proj.position.copy(hero.position).add(new THREE.Vector3(0, 1.5, 0));

  const dir = lastDir ? lastDir.clone().normalize() : new THREE.Vector3(0, 0, -1);
  const baseDmg = 50 + (player.level * 3) + (player.fireballDamageBonus || 0) + getActiveSkillBonus('fb_dmg');
  const hitRadius = 2.5 + (getActiveSkillBonus('fb_radius') ? 2 : 0);

  state.scene.add(proj);
  state.projectiles.push({ mesh: proj, vel: dir.multiplyScalar(0.5), life: 80, dmg: baseDmg, hitRadius, owner: 'player' });
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

  const AOE_RADIUS = 8 + (getActiveSkillBonus('aoe_radius') ? 3 : 0);
  const baseDmg = 80 + (player.level * 4) + (player.aoeDamageBonus || 0) + getActiveSkillBonus('aoe_dmg');

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
function isDashUnlocked() {
  return state.evolution.skillTree.find(s => s.id === 'dash_unlock')?.level > 0;
}
function isShieldUnlocked() {
  return state.evolution.skillTree.find(s => s.id === 'shield_unlock')?.level > 0;
}
function getActiveSkillBonus(prefix) {
  return state.evolution.activeSkillTree
    .filter(s => s.id.startsWith(prefix) && s.level > 0)
    .reduce((acc, s) => {
      const bonuses = { fb_dmg_1:30, fb_dmg_2:30, fb_dmg_3:50, fb_dmg_4:80, fb_sp_1:true, fb_radius:true, aoe_dmg_1:20, aoe_dmg_2:40, aoe_dmg_3:70, aoe_radius:true };
      return acc + (bonuses[s.id] || 0);
    }, 0);
}

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

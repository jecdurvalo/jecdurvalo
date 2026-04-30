/**
 * GameLoop — loop principal com requestAnimationFrame e deltaTime.
 * Delega cada responsabilidade ao sistema correspondente.
 */
import { state } from './GameState.js';
import { GAME, BIOMES } from './Config.js';
import { saveGame } from './SaveSystem.js';
import { getMoveVector } from '../input/InputHandler.js';
import { getPlayerSpeed } from '../combat/DamageCalculator.js';
import { applyScreenShake, updateParticles } from '../graphics/VisualEffects.js';
import { drawMinimap } from '../ui/Minimap.js';
import { updateBars, updateCooldowns } from '../ui/HUD.js';
import { updateBiome } from '../world/BiomeManager.js';
import { spawnMonster, getMaxMonsters, getMobSpawnChance } from '../world/SpawnSystem.js';
import { gainXP } from '../progression/ExperienceSystem.js';
import { getLoot } from '../world/LootSystem.js';
import { addItemToInventory } from '../inventory/InventoryManager.js';
import { checkAchievements } from '../progression/AchievementSystem.js';
import { updateQuestProgress, getQuestTypeForMonster } from '../progression/QuestSystem.js';
import { playSound } from './AudioManager.js';
import { floatingText } from '../graphics/VisualEffects.js';
import { log } from './Logger.js';
import { EventBus } from './EventBus.js';

let lastFrame = 0;
let lastSave  = 0;
let lastSpawn = 0;

export function startGameLoop() {
  EventBus.on('monster:kill', onMonsterKill);
  requestAnimationFrame(animate);
}

function animate(time) {
  requestAnimationFrame(animate);

  const dt = Math.min(time - lastFrame, 100);
  lastFrame = time;

  // Sempre renderiza (mesmo pausado)
  const { camera, hero, renderer, scene } = state;
  if (camera && hero) {
    camera.position.set(hero.position.x, 14, hero.position.z + 14);
    camera.lookAt(hero.position);
  }
  if (renderer && scene) renderer.render(scene, camera);

  if (state.gamePaused) { updateBars(); return; }

  // Movimento do herói
  moveHero(dt);

  // Monstros: IA, HP bars, labels
  updateMonsters(dt, time);

  // Projéteis
  updateProjectiles();

  // Partículas
  updateParticles();

  // Spawn dinâmico
  if (time - lastSpawn > 1000) { lastSpawn = time; handleSpawn(); }

  // Bioma
  updateBiome();

  // SP regeneração
  const { player } = state;
  if (player.sp < player.maxSp) player.sp = Math.min(player.maxSp, player.sp + 0.05);

  // Screen shake
  applyScreenShake();

  // HUD
  updateBars();
  updateCooldowns();
  drawMinimap();

  // Autosave
  if (time - lastSave > GAME.AUTOSAVE_INTERVAL) { lastSave = time; saveGame(); }
}

// ── MOVIMENTO ────────────────────────────────────────────────────────────────
function moveHero(dt) {
  const { hero } = state;
  if (!hero) return;
  const move = getMoveVector();
  const moving = move.length() > 0.05;

  if (moving) {
    const speed = getPlayerSpeed() * (dt / 16.67);
    move.normalize().multiplyScalar(speed);
    hero.position.add(move);
    if (state.lastDir) state.lastDir.copy(move);
    hero.rotation.y = Math.atan2(move.x, move.z);
  }

  // Animação de caminhada nas pernas
  if (hero._legs) {
    const [leg1, leg2] = hero._legs;
    if (moving) {
      const swing = Math.sin(performance.now() / 150) * 0.4;
      leg1.rotation.x =  swing;
      leg2.rotation.x = -swing;
    } else {
      leg1.rotation.x *= 0.8;
      leg2.rotation.x *= 0.8;
    }
  }
}

// ── MONSTROS ─────────────────────────────────────────────────────────────────
function updateMonsters(dt, time) {
  const { monsters, hero, player, camera, renderer } = state;
  if (!hero || !camera || !renderer) return;

  for (let i = monsters.length - 1; i >= 0; i--) {
    const m = monsters[i];
    if (!m.userData) continue;

    // IA: move em direção ao herói
    const dir = hero.position.clone().sub(m.position);
    const dist = dir.length();
    const speed = m.userData.isBoss ? 0.06 : 0.04;
    if (dist > 1.5) {
      dir.normalize().multiplyScalar(speed * (dt / 16.67));
      m.position.add(dir);
    }

    // Respiração (bobbing)
    m.position.y = Math.sin(time * 0.003 + m.userData.breatheOffset) * 0.1;

    // Ataque ao herói
    if (dist < 2 && time - m.userData.lastAttack > 1200) {
      m.userData.lastAttack = time;
      onMonsterAttack(m);
    }

    // HP bar overlay
    updateMonsterUI(m, camera, renderer);
  }
}

function onMonsterAttack(m) {
  if (state.isShielded) return;
  const { player, hero } = state;
  const atk = m.userData.atk || 5;
  const def = player.baseDef || 0;
  const dmg = Math.max(1, atk - def + Math.floor(Math.random() * 3));
  player.hp = Math.max(0, player.hp - dmg);
  floatingText('-' + dmg, hero.position, 'red');
  playSound('hit');

  if (player.hp <= 0) EventBus.emit('player:die');
}

function updateMonsterUI(m, camera, renderer) {
  const { ui, label, hp, maxHp } = m.userData;
  if (!ui || !label) return;

  const pos = m.position.clone();
  pos.y += 3;
  const v = pos.project(camera);
  const sx = (v.x + 1) / 2 * renderer.domElement.clientWidth;
  const sy = (-v.y + 1) / 2 * renderer.domElement.clientHeight;

  ui.bar.style.left  = (sx - 25) + 'px';
  ui.bar.style.top   = (sy - 10) + 'px';
  ui.fill.style.width = Math.max(0, hp / maxHp * 100) + '%';
  label.style.left = (sx - label.offsetWidth / 2) + 'px';
  label.style.top  = (sy - 22) + 'px';
}

// ── PROJÉTEIS ────────────────────────────────────────────────────────────────
function updateProjectiles() {
  state.projectiles = state.projectiles.filter(p => {
    p.mesh.position.add(p.vel);
    p.life--;
    if (p.life <= 0) { state.scene.remove(p.mesh); return false; }

    if (p.owner === 'player') {
      for (const m of state.monsters) {
        if (m.position.distanceTo(p.mesh.position) < (p.hitRadius || 2)) {
          m.userData.hp -= p.dmg;
          floatingText('🔥 ' + p.dmg, m.position, 'orange');
          if (m.userData.hp <= 0) EventBus.emit('monster:kill', m);
          state.scene.remove(p.mesh);
          return false;
        }
      }
    }
    return true;
  });
}

// ── SPAWN ─────────────────────────────────────────────────────────────────────
function handleSpawn() {
  const { monsters, hero } = state;
  const maxMons = getMaxMonsters();
  const nearbyCount = monsters.filter(m => m.position.distanceTo(hero.position) < 50).length;

  if (nearbyCount < 5) { spawnMonster(false, false, true); return; }
  if (monsters.length >= maxMons) return;

  const roll = Math.random();
  if (roll < getMobSpawnChance() * 0.3) spawnMonster(false, true);
  else if (roll < 0.5) spawnMonster();
}

// ── KILL ──────────────────────────────────────────────────────────────────────
function onMonsterKill(m) {
  const idx = state.monsters.indexOf(m);
  if (idx < 0) return;
  state.monsters.splice(idx, 1);

  // Remove da cena e UI
  state.scene.remove(m);
  if (m.userData.ui) { m.userData.ui.bar.remove(); }
  if (m.userData.label) m.userData.label.remove();

  const { player, hero } = state;
  const { xp: xpGain, isBoss, name: mName, level: mLevel } = m.userData;

  // XP
  const finalXP = isBoss ? Math.max(xpGain, Math.floor(player.next * 0.4)) : xpGain;
  gainXP(finalXP);
  floatingText('+' + finalXP + ' XP', m.position, 'lime');

  // Gold
  const gold = Math.floor((mLevel || 1) * 2 + Math.random() * 5) * (isBoss ? 3 : 1);
  player.gold += gold;

  // Stats
  state.evolution.stats.kills++;
  if (isBoss) state.evolution.stats.bossKills++;
  const questType = getQuestTypeForMonster(mName);
  if (questType) updateQuestProgress(questType, 1);

  // Loot
  const drops = getLoot(player.level, isBoss);
  drops.forEach(item => {
    addItemToInventory(item);
    playSound(item.rarity === 'epic' || item.rarity === 'legendary' ? 'rareDrop' : 'collect');
    updateQuestProgress('items', 1);
  });

  if (isBoss) { playSound('bossKill'); floatingText('👹 BOSS KILL!', m.position, 'gold'); }

  checkAchievements();
  log(`<span style='color:#88ff88'>⚔️ ${mName} +${finalXP} XP</span>`);
}

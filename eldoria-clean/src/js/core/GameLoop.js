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
import { getBossAbilities } from '../entities/Boss.js';

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

  // DOT ticks sobre o jogador
  processDOTs();

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

    // Ataque melee ao herói
    if (dist < 2 && time - m.userData.lastAttack > 1200) {
      m.userData.lastAttack = time;
      onMonsterAttack(m);
    }

    // Boss: lança feitiços + ativa fase 2
    if (m.userData.isBoss) {
      castBossSpells(m, time);
      if (!m.userData.phase2 && m.userData.hp <= m.userData.maxHp * 0.5) {
        m.userData.phase2 = true;
        floatingText('⚡ FASE 2!', m.position, '#ff4400');
        m.traverse(child => {
          if (child.isMesh && child.material && child.material.emissive) {
            child.material.emissive.setHex(0xff0000);
            child.material.emissiveIntensity = 0.8;
          }
        });
      }
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
    // Homing: corrige trajetória lentamente em direção ao alvo
    if (p.homing && p.target) {
      const toTarget = p.target.position.clone().sub(p.mesh.position).normalize();
      const spd = p.vel.length();
      p.vel.lerp(toTarget.multiplyScalar(spd), 0.06);
    }

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

    if (p.owner === 'boss') {
      if (state.hero && p.mesh.position.distanceTo(state.hero.position) < (p.hitRadius || 1.5)) {
        if (!state.isShielded) {
          state.player.hp = Math.max(0, state.player.hp - p.dmg);
          floatingText('-' + p.dmg, state.hero.position, 'red');
          playSound('hit');
          if (p.dot) applyDOT(p.dot);
          if (state.player.hp <= 0) EventBus.emit('player:die');
        }
        state.scene.remove(p.mesh);
        return false;
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

// ── BOSS SPELLS ───────────────────────────────────────────────────────────────
function castBossSpells(boss, time) {
  const abilities = getBossAbilities(boss.userData.biomeIndex ?? 0);
  abilities.forEach((ability, idx) => {
    if (idx > 0 && !boss.userData.phase2) return;
    if (!boss.userData.lastAbilityTime) boss.userData.lastAbilityTime = [0, 0];
    const last = boss.userData.lastAbilityTime[idx] || 0;
    if (time - last < ability.interval) return;
    boss.userData.lastAbilityTime[idx] = time;
    fireBossAbility(boss, ability);
  });
}

function fireBossAbility(boss, ability) {
  const THREE = window.THREE;
  const { hero, scene, projectiles } = state;
  if (!hero) return;

  const dir = hero.position.clone().sub(boss.position).normalize();
  const baseDmg = Math.max(1, Math.floor(boss.userData.atk * (ability.dmgMult || 1)));
  const count = ability.count || 1;
  const spread = ability.spread || 0;

  floatingText(ability.label, boss.position, '#ff6600');

  for (let i = 0; i < count; i++) {
    const angle = count > 1 ? (i - (count - 1) / 2) * spread : 0;
    const shotDir = rotateY(dir.clone(), angle);

    const proj = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 6, 6),
      new THREE.MeshStandardMaterial({ color: ability.color, emissive: ability.color, emissiveIntensity: 1 })
    );
    proj.position.copy(boss.position).add(new THREE.Vector3(0, 2, 0));
    scene.add(proj);

    projectiles.push({
      mesh: proj,
      vel: shotDir.multiplyScalar(ability.speed || 0.3),
      life: 140,
      dmg: baseDmg,
      hitRadius: 1.5,
      owner: 'boss',
      homing: ability.homing || false,
      dot: ability.dot || null,
      target: hero,
    });
  }
}

function rotateY(vec, angle) {
  const THREE = window.THREE;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return new THREE.Vector3(
    vec.x * cos + vec.z * sin,
    vec.y,
    -vec.x * sin + vec.z * cos
  );
}

// ── DOT (damage over time sobre o jogador) ────────────────────────────────────
function applyDOT(dot) {
  state.playerDots.push({
    dmg: dot.dmg,
    ticks: dot.ticks,
    interval: dot.interval,
    nextTick: Date.now() + dot.interval,
  });
}

function processDOTs() {
  if (!state.playerDots.length) return;
  const now = Date.now();
  state.playerDots = state.playerDots.filter(dot => {
    if (now < dot.nextTick) return true;
    dot.nextTick = now + dot.interval;
    dot.ticks--;
    state.player.hp = Math.max(0, state.player.hp - dot.dmg);
    floatingText('☠️ -' + dot.dmg, state.hero.position, '#ff4400');
    if (state.player.hp <= 0) EventBus.emit('player:die');
    return dot.ticks > 0;
  });
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

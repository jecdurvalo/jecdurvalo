/**
 * SpawnSystem — spawn dinâmico e inteligente de monstros.
 */
import { state } from '../core/GameState.js';
import { MONSTER_TYPES, BOSS_BIOME_VISUALS } from '../core/Config.js';
import { buildMonsterMesh, buildBossMesh } from '../graphics/ModelLoader.js';
import { playSound } from '../core/AudioManager.js';
import { floatingText } from '../graphics/VisualEffects.js';
import { log } from '../core/Logger.js';

export function getMaxMonsters() {
  return Math.min(60, 30 + Math.max(0, state.player.level - 10));
}

export function getMobSpawnChance() {
  return Math.min(0.70, 0.35 + Math.max(0, state.player.level - 10) * 0.015);
}

export function spawnMonster(elite = false, mobMode = false, emergencySpawn = false) {
  const { hero, player, currentBiome, scene, monsters } = state;
  let sX, sZ;

  if (emergencySpawn) {
    const angle = Math.random() * Math.PI * 2;
    const dist  = 40 + Math.random() * 20;
    sX = hero.position.x + Math.cos(angle) * dist;
    sZ = hero.position.z + Math.sin(angle) * dist;
  } else {
    sX = hero.position.x + (Math.random() - 0.5) * 150;
    sZ = hero.position.z + (Math.random() - 0.5) * 150;
  }

  const lv = elite ? player.level * 2 : player.level + Math.floor(Math.random() * 3);
  const biomeMonsters = MONSTER_TYPES[currentBiome] || MONSTER_TYPES[0];
  const available = mobMode
    ? (biomeMonsters.filter(m => m.canBeMob).length > 0 ? biomeMonsters.filter(m => m.canBeMob) : biomeMonsters)
    : biomeMonsters;

  const monsterType = available[Math.floor(Math.random() * available.length)];
  const size = elite ? 4 : (mobMode ? monsterType.size * 0.8 : monsterType.size);

  const hp = Math.floor(monsterType.baseHp * (1 + lv * 0.15));
  const atk = Math.floor(monsterType.baseAtk * (1 + lv * 0.1));
  const xp = Math.floor(monsterType.baseXp * (1 + lv * 0.05));

  const group = buildMonsterMesh(monsterType, size, elite);
  group.position.set(sX, 0, sZ);

  group.userData = {
    name: elite ? '👑 ' + monsterType.name + ' Élite' : monsterType.name,
    hp, maxHp: hp, atk, def: Math.floor(atk * 0.2),
    xp, level: lv, isBoss: false, isMob: mobMode,
    monsterType, breatheOffset: Math.random() * Math.PI * 2,
    lastAttack: 0,
    ui: buildHpBar(),
    label: buildLabel(`${monsterType.icon} ${monsterType.name} Lv.${lv}`),
  };

  scene.add(group);
  monsters.push(group);
  return group;
}

export function spawnBoss() {
  const { hero, player, currentBiome, scene, monsters } = state;

  const angle = Math.random() * Math.PI * 2;
  const dist  = 40 + Math.random() * 20;
  const sX = hero.position.x + Math.cos(angle) * dist;
  const sZ = hero.position.z + Math.sin(angle) * dist;

  const lv = player.level;
  const biomeMonsters = MONSTER_TYPES[currentBiome] || MONSTER_TYPES[0];
  const monsterType = biomeMonsters[Math.floor(Math.random() * biomeMonsters.length)];
  const bv = BOSS_BIOME_VISUALS[Math.min(currentBiome, BOSS_BIOME_VISUALS.length - 1)];

  // Scaling idêntico ao original
  const bossMultiplier = 1 + Math.floor(Math.random() * 3) * 0.25;
  const lvAboveBase = Math.max(0, lv - 5);
  const bossHpMult  = 1 + lvAboveBase * 0.13;
  const bossAtkMult = 1 + lvAboveBase * 0.09;
  const baseHp  = Math.floor((1200 + lv * 120) * bossHpMult);
  const baseAtk = Math.floor((25   + lv * 4)   * bossAtkMult);
  const xpNeeded = 50 * Math.pow(1.25, lv) + (lv + 1) * 20;
  const xpGain   = Math.floor(xpNeeded * 0.7 * bossMultiplier * 1.5);
  const hp  = Math.floor(baseHp  * bossMultiplier);
  const atk = Math.floor(baseAtk * bossMultiplier);

  const group = buildBossMesh(currentBiome);
  group.position.set(sX, 0, sZ);
  group.userData = {
    name: '👹 BOSS ' + bv.name,
    level: lv, hp, maxHp: hp, atk,
    def: Math.floor(baseAtk * 0.3 * bossMultiplier),
    xp: xpGain, isBoss: true, isMob: false,
    biomeIndex: currentBiome,
    monsterType, breatheOffset: Math.random() * Math.PI * 2,
    lastAttack: 0, lastAbilityTime: [0, 0], phase2: false,
    ui: buildHpBar(),
    label: buildLabel(`👹 ${bv.name} Lv.${lv}`),
  };

  scene.add(group);
  monsters.push(group);
  playSound('bossSpawn');
  log(`<span style='color:red'>⚠️ Boss apareceu: ${bv.name}!</span>`);
  return group;
}

function buildHpBar() {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;width:50px;height:6px;background:#440000;pointer-events:none;border:1px solid black;z-index:3000;';
  const fill = document.createElement('div');
  fill.style.cssText = 'height:100%;background:#ff0000;width:100%;';
  el.appendChild(fill); document.body.appendChild(el);
  return { bar: el, fill };
}

function buildLabel(text) {
  const d = document.createElement('div');
  d.className = 'nameplate'; d.innerHTML = text;
  document.body.appendChild(d);
  return d;
}

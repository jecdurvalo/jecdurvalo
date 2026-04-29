/**
 * SpawnSystem — spawn dinâmico e inteligente de monstros.
 */
import { state } from '../core/GameState.js';
import { MONSTER_TYPES } from '../core/Config.js';
import { buildMonsterMesh } from '../graphics/ModelLoader.js';
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
  const { BOSS_BIOME_VISUALS, BOSS_ABILITIES } = window._eldoriaConfig || {};
  // Boss spawn é delegado ao BossSpawner (mantido no EldoriaApp para acesso ao THREE)
  import('../entities/Boss.js').then(m => m.spawnBoss());
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

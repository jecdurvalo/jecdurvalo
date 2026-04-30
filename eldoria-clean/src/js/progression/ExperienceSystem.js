/**
 * ExperienceSystem — XP, level up, recálculo de stats de progressão.
 */
import { state } from '../core/GameState.js';
import { playSound } from '../core/AudioManager.js';
import { floatingText } from '../graphics/VisualEffects.js';
import { log } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';
import { spawnBoss } from '../world/SpawnSystem.js';

export function gainXP(amount) {
  const { player } = state;
  player.xp += amount;
  state.evolution.totalXP += amount;

  while (player.xp >= player.next) {
    player.xp -= player.next;
    levelUp();
  }
  EventBus.emit('player:xpChange');
}

function levelUp() {
  const { player, hero } = state;
  player.level++;

  // Escala de stats por nível
  player.next     = Math.floor(100 * Math.pow(1.15, player.level - 1));
  player.maxHp   += 10 + Math.floor(player.level * 1.5);
  player.maxSp   += 5;
  player.hp       = player.maxHp;
  player.sp       = player.maxSp;
  player.baseAtk += 2;
  player.baseDef += 1;

  // Mantém bases para recalcStats (equipment bônus)
  player.baseMaxHp = player.maxHp;
  player.baseMaxSp = player.maxSp;

  // 1 skill point por nível (igual ao original)
  state.evolution.skillPoints += 1;
  floatingText('+1 SP', hero.position, 'magenta');

  playSound('levelup');
  showLevelUpFlash();
  floatingText(`⬆️ Nível ${player.level}!`, hero.position, 'gold');
  log(`<span style='color:gold'>⭐ Level ${player.level}!</span>`);

  // Boss spawn por progressão de nível: Lv5+a cada 5, Lv13+a cada 3, Lv25+a cada 2
  if (player.level >= 5) {
    const interval = player.level >= 25 ? 2 : player.level >= 13 ? 3 : 5;
    if (player.level % interval === 0) spawnBoss();
  }

  EventBus.emit('player:levelUp', { level: player.level });
}

function showLevelUpFlash() {
  const el = document.createElement('div');
  el.className = 'levelup-flash';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

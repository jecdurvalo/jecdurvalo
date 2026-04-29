/**
 * ExperienceSystem — XP, level up, recálculo de stats de progressão.
 */
import { state } from '../core/GameState.js';
import { playSound } from '../core/AudioManager.js';
import { floatingText } from '../graphics/VisualEffects.js';
import { log } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';

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

  // Skill points a cada 5 níveis
  if (player.level % 5 === 0) state.evolution.skillPoints += 1;

  playSound('levelup');
  showLevelUpFlash();
  floatingText(`⬆️ Nível ${player.level}!`, hero.position, 'gold');
  log(`<span style='color:gold'>⭐ Level ${player.level}!</span>`);

  EventBus.emit('player:levelUp', { level: player.level });
}

function showLevelUpFlash() {
  const el = document.createElement('div');
  el.className = 'levelup-flash';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

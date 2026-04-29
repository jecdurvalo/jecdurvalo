/**
 * HUD — atualiza barras de HP, SP, XP, Gold e cooldowns.
 */
import { state } from '../core/GameState.js';
import { GAME } from '../core/Config.js';
import { EventBus } from '../core/EventBus.js';

const el = id => document.getElementById(id);

export function initHUD() {
  EventBus.on('player:statsChange', updateBars);
  EventBus.on('player:xpChange',    updateBars);
  EventBus.on('player:levelUp',     updateBars);

  // Auto-hide no mobile
  if (window.innerWidth <= 800) startAutoHide();
}

export function updateBars() {
  const { player } = state;
  const hpEl = el('hp'); const spEl = el('sp'); const xpEl = el('xp');
  if (hpEl) hpEl.style.width = (player.hp / player.maxHp * 100) + '%';
  if (spEl) spEl.style.width = (player.sp / player.maxSp * 100) + '%';
  if (xpEl) xpEl.style.width = (player.xp / player.next * 100) + '%';

  const gold = el('goldDisplay');
  if (gold) gold.textContent = `💰 Gold: ${player.gold}`;

  const nameEl = el('hudPlayerName');
  if (nameEl) nameEl.textContent = `${state.playerName} Lv.${player.level}`;

  updateCooldowns();
}

export function updateCooldowns() {
  const cd = el('skillCooldowns');
  if (!cd) return;
  const now = Date.now();

  const skills = [
    { name:'Fireball', cd: state.lastFireballTime, total: 800 },
    { name:'AOE',      cd: state.lastAoeTime,      total: GAME.AOE_COOLDOWN },
    { name:'Dash',     cd: state.lastDashTime,     total: GAME.DASH_COOLDOWN },
    { name:'Shield',   cd: state.lastShieldTime,   total: GAME.SHIELD_COOLDOWN },
  ];

  cd.innerHTML = skills.map(s => {
    const rem = Math.max(0, s.total - (now - s.cd));
    const ready = rem <= 0;
    return `<span style="color:${ready ? '#aaf' : '#888'}">${s.name}${ready ? '' : ` ${(rem/1000).toFixed(1)}s`}</span>`;
  }).join(' · ');
}

// ── Auto-hide mobile ──────────────────────────────────────────────────────
let hideTimer = null;
function startAutoHide() {
  scheduleHide();
}
function scheduleHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    document.body.classList.add('hud-hidden');
  }, 3000);
}
export function showHUD() {
  if (window.innerWidth > 800) return;
  document.body.classList.remove('hud-hidden');
  scheduleHide();
}

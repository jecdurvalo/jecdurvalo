/**
 * Logger — sistema de log de combate e notificações flutuantes.
 */
import { GAME } from './Config.js';

const combatLogEl = () => document.getElementById('combatLog');

export function log(html) {
  if (window.innerWidth <= 800) {
    showFloatingNotification(html);
    return;
  }
  const el = combatLogEl();
  if (!el) return;

  const entry = document.createElement('div');
  entry.style.cssText = 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:1px;animation:logSlideIn .25s ease;';
  entry.innerHTML = html;
  el.insertBefore(entry, el.firstChild);

  Array.from(el.children).forEach((child, idx) => {
    child.style.opacity = Math.max(0.18, 1 - idx * 0.3);
    child.style.transition = 'opacity .3s';
  });
  while (el.children.length > GAME.MAX_COMBAT_LOG) el.removeChild(el.lastChild);
}

let notifTimeout = null;
export function showFloatingNotification(html) {
  const old = document.querySelector('.floating-notification');
  if (old) old.remove();

  const div = document.createElement('div');
  div.className = 'floating-notification';
  div.innerHTML = html;
  document.body.appendChild(div);

  clearTimeout(notifTimeout);
  notifTimeout = setTimeout(() => div.remove(), 2600);
}

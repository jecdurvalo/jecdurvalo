/**
 * UIManager — controla modais (inventário, loja, evolução) e overlay.
 */
import { state } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { SHOP_CATALOG } from '../core/Config.js';
import { buyItem, sellItem } from '../inventory/ShopSystem.js';
import { equipItem, unequipItem } from '../inventory/EquipmentSystem.js';
import { useConsumable, removeItemFromInventory } from '../inventory/InventoryManager.js';
import { floatingText } from '../graphics/VisualEffects.js';

const el = id => document.getElementById(id);
const overlay = () => el('menuOverlay');

function pauseGame(pause) {
  state.gamePaused = pause;
  const ov = overlay();
  if (ov) ov.style.display = pause ? 'block' : 'none';
}

export function closeAllMenus() {
  ['statusWindow','shopWindow','evolutionWindow'].forEach(id => {
    const w = el(id); if (w) w.style.display = 'none';
  });
  const mp = el('mobileMenuPanel');
  if (mp) { mp.classList.remove('active'); document.body.classList.remove('mobile-menu-open'); }
  pauseGame(false);
}

export function toggleInventory() {
  const win = el('statusWindow');
  if (!win) return;
  const isOpen = win.style.display === 'block';
  closeAllMenus();
  if (!isOpen) { win.style.display = 'block'; pauseGame(true); renderInventory(); }
}

export function toggleShop() {
  const win = el('shopWindow');
  if (!win) return;
  const isOpen = win.style.display === 'block';
  closeAllMenus();
  if (!isOpen) { win.style.display = 'block'; pauseGame(true); renderShop(); }
}

export function toggleEvolution() {
  const win = el('evolutionWindow');
  if (!win) return;
  const isOpen = win.style.display === 'block';
  closeAllMenus();
  if (!isOpen) { win.style.display = 'block'; pauseGame(true); renderEvolution(); }
}

export function togglePause() {
  state.gamePaused = !state.gamePaused;
  const btn = el('pauseBtnMobile');
  if (btn) btn.textContent = state.gamePaused ? '▶️' : '⏸️';
}

// ── RENDER INVENTORY ────────────────────────────────────────────────────────
function renderInventory() {
  const { player, inventory, equipped } = state;
  const statsEl = el('statsPanel');
  if (statsEl) {
    statsEl.innerHTML = `
      <div><b>Lv.${player.level}</b> &nbsp;|&nbsp; HP: ${player.hp}/${player.maxHp} &nbsp;|&nbsp; SP: ${player.sp}/${player.maxSp}</div>
      <div>ATK: ${player.baseAtk + (equipped.weapon?.atk||0)} &nbsp;|&nbsp; DEF: ${player.baseDef + (equipped.shield?.def||0)} &nbsp;|&nbsp; Gold: ${player.gold}</div>
    `;
  }

  const invEl = el('inventoryPanel');
  if (!invEl) return;
  invEl.innerHTML = '';
  inventory.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'inv-item';
    div.innerHTML = `${item.icon || '📦'} <b>${item.name}</b>${item.quantity > 1 ? ` x${item.quantity}` : ''}`;
    div.onclick = () => onItemClick(item, idx);
    invEl.appendChild(div);
  });
}

function onItemClick(item, idx) {
  if (item.slot === 'consumable') {
    useConsumable(item);
    removeItemFromInventory(idx);
    floatingText(item.heal ? `+${item.heal} HP` : `+${item.restoreSp} SP`, state.hero.position, 'lime');
    renderInventory();
    return;
  }
  equipItem(item, idx);
  renderInventory();
  EventBus.emit('equipment:change');
}

// ── RENDER SHOP ─────────────────────────────────────────────────────────────
function renderShop() {
  const panel = el('shopBuyItemsPanel');
  if (!panel) return;
  panel.innerHTML = '';
  SHOP_CATALOG.forEach(item => {
    const div = document.createElement('div');
    div.className = 'inv-item';
    const canBuy = state.player.gold >= item.buyPrice && (!item.reqLevel || state.player.level >= item.reqLevel);
    div.style.opacity = canBuy ? '1' : '0.5';
    div.innerHTML = `${item.icon} <b>${item.name}</b><br><span style="color:gold">${item.buyPrice}g</span>`;
    if (canBuy) div.onclick = () => { buyItem(item); renderShop(); };
    panel.appendChild(div);
  });
}

// ── RENDER EVOLUTION ─────────────────────────────────────────────────────────
function renderEvolution() {
  const spEl = el('playerSkillPoints');
  if (spEl) spEl.textContent = state.evolution.skillPoints;
  const xpEl = el('playerXPPoints');
  if (xpEl) xpEl.textContent = state.evolution.totalXP;
}

// ── MOBILE MENU ──────────────────────────────────────────────────────────────
export function toggleMobileMenu() {
  const panel = el('mobileMenuPanel');
  if (!panel) return;
  const isOpen = panel.classList.contains('active');
  if (isOpen) {
    panel.classList.remove('active');
    document.body.classList.remove('mobile-menu-open');
    pauseGame(false);
  } else {
    panel.classList.add('active');
    document.body.classList.add('mobile-menu-open');
    pauseGame(true);
    renderMobileInventory();
  }
}

export function switchMobileTab(tab) {
  document.querySelectorAll('.mobile-menu-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.mobile-menu-content').forEach(c => c.classList.remove('active'));
  const tabEl = document.querySelector(`[data-tab="${tab}"]`);
  const contentEl = el(`mobile-${tab}-content`);
  if (tabEl) tabEl.classList.add('active');
  if (contentEl) contentEl.classList.add('active');

  if (tab === 'inventory') renderMobileInventory();
  if (tab === 'shop') renderShop();
}

function renderMobileInventory() {
  const grid = el('mobileInventoryGrid');
  if (!grid) return;
  grid.innerHTML = '';
  state.inventory.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'inv-item';
    div.innerHTML = `${item.icon || '📦'} ${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`;
    div.onclick = () => { onItemClick(item, idx); renderMobileInventory(); };
    grid.appendChild(div);
  });
}

// ── SETUP LISTENERS ──────────────────────────────────────────────────────────
export function initUIManager() {
  EventBus.on('inventory:change', () => {
    if (el('statusWindow')?.style.display === 'block') renderInventory();
    if (el('mobileInventoryGrid')) renderMobileInventory();
  });
  EventBus.on('equipment:change', () => {
    if (el('statusWindow')?.style.display === 'block') renderInventory();
  });
  EventBus.on('shop:buy', () => renderShop());
}

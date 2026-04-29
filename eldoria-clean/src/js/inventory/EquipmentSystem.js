/**
 * EquipmentSystem — equipar, desequipar e recalcular stats.
 */
import { state } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { applyEquipVisual } from '../graphics/ModelLoader.js';
import { removeItemFromInventory } from './InventoryManager.js';

export function equipItem(item, inventoryIndex) {
  const slot = item.slot;
  if (!isEquippable(slot)) return false;

  const targetSlot = getEquipSlot(item);

  // Desequipa item anterior e devolve ao inventário
  if (state.equipped[targetSlot]) {
    state.inventory.push(state.equipped[targetSlot]);
  }

  state.equipped[targetSlot] = item;
  removeItemFromInventory(inventoryIndex);
  recalcStats();
  applyEquipVisual();
  EventBus.emit('equipment:change');
  return true;
}

export function unequipItem(slot) {
  if (!state.equipped[slot]) return;
  state.inventory.push(state.equipped[slot]);
  state.equipped[slot] = null;
  recalcStats();
  applyEquipVisual();
  EventBus.emit('equipment:change');
}

export function recalcStats() {
  const { player, equipped } = state;
  // HP/SP bônus de equipamentos
  let hpBonus = 0, spBonus = 0;
  Object.values(equipped).forEach(item => {
    if (!item) return;
    hpBonus += item.hp || 0;
    spBonus  += item.sp || 0;
  });
  // Aplica bônus sem ultrapassar máximo
  player.maxHp = Math.max(1, (player.baseMaxHp || 100) + hpBonus);
  player.maxSp = Math.max(1, (player.baseMaxSp || 80)  + spBonus);
  player.hp = Math.min(player.hp, player.maxHp);
  player.sp = Math.min(player.sp, player.maxSp);
  EventBus.emit('player:statsChange');
}

function isEquippable(slot) {
  return ['weapon','shield','cape','boots','ring'].includes(slot);
}

function getEquipSlot(item) {
  if (item.slot !== 'ring') return item.slot;
  if (!state.equipped.ring1) return 'ring1';
  if (!state.equipped.ring2) return 'ring2';
  return 'ring1'; // substitui ring1
}

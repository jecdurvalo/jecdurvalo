/**
 * InventoryManager — adicionar, remover e stackar itens.
 */
import { state } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';

export function addItemToInventory(item) {
  const newItem = { ...item };
  if (newItem.slot !== 'consumable') {
    newItem.durability = newItem.durability ?? 100;
    newItem.maxDurability = 100;
  }
  if (newItem.stackable) newItem.quantity = 1;

  // Tenta stack
  const existing = state.inventory.find(i =>
    i.name === newItem.name && i.slot === newItem.slot &&
    (i.durability === undefined || i.durability === newItem.durability)
  );
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
    EventBus.emit('inventory:change');
    return false;
  }

  state.inventory.push(newItem);
  state.evolution.stats.itemsCollected++;
  EventBus.emit('inventory:change');
  return true;
}

export function removeItemFromInventory(index, qty = 1) {
  const item = state.inventory[index];
  if (!item) return;
  if (item.quantity && item.quantity > qty) {
    item.quantity -= qty;
  } else {
    state.inventory.splice(index, 1);
  }
  EventBus.emit('inventory:change');
}

export function useConsumable(item) {
  const { player } = state;
  if (item.heal)      player.hp = Math.min(player.maxHp, player.hp + item.heal);
  if (item.restoreSp) player.sp = Math.min(player.maxSp, player.sp + item.restoreSp);
  EventBus.emit('player:statsChange');
}

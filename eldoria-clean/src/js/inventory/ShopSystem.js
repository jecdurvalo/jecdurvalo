/**
 * ShopSystem — compra e venda de itens.
 */
import { state } from '../core/GameState.js';
import { SHOP_CATALOG } from '../core/Config.js';
import { addItemToInventory } from './InventoryManager.js';
import { playSound } from '../core/AudioManager.js';
import { floatingText } from '../graphics/VisualEffects.js';
import { log } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';

export function buyItem(catalogItem) {
  const { player, hero } = state;
  if (player.gold < catalogItem.buyPrice) {
    log("<span style='color:red'>💰 Gold insuficiente!</span>");
    floatingText('Sem gold!', hero.position, 'red');
    return false;
  }
  if (catalogItem.reqLevel && player.level < catalogItem.reqLevel) {
    log(`<span style='color:red'>🔒 Nível ${catalogItem.reqLevel} necessário!</span>`);
    return false;
  }
  player.gold -= catalogItem.buyPrice;
  addItemToInventory(catalogItem);
  playSound('buy');
  log(`<span style='color:gold'>🛒 Comprou: ${catalogItem.icon} ${catalogItem.name} por ${catalogItem.buyPrice} gold!</span>`);
  floatingText('🛒 ' + catalogItem.name, hero.position, 'gold');
  EventBus.emit('shop:buy', catalogItem);
  return true;
}

export function sellItem(inventoryIndex) {
  const { player, inventory } = state;
  const item = inventory[inventoryIndex];
  if (!item) return;

  const sellValue = Math.floor((item.value || 5) * 0.6);
  player.gold += sellValue;
  inventory.splice(inventoryIndex, 1);
  log(`<span style='color:gold'>💰 Vendeu: ${item.icon || ''} ${item.name} por ${sellValue} gold.</span>`);
  EventBus.emit('shop:sell', item);
  EventBus.emit('inventory:change');
}

export { SHOP_CATALOG };

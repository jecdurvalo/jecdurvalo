/**
 * Testes unitários: Item
 */
import { describe, it, expect } from './runner.js';
import { Item } from '../src/js/entities/Item.js';

describe('Item — classificação', () => {
  it('arma é equipamento', () => {
    const sword = new Item({ name: 'Sword', slot: 'weapon', atk: 10, buyPrice: 50 });
    expect(sword.isEquipment()).toBeTruthy();
    expect(sword.isConsumable()).toBeFalsy();
  });

  it('poção é consumível e empilhável', () => {
    const potion = new Item({ name: 'Poção', slot: 'consumable', heal: 50, buyPrice: 10 });
    expect(potion.isConsumable()).toBeTruthy();
    expect(potion.isStackable()).toBeTruthy();
  });

  it('sellPrice padrão = 60% do buyPrice', () => {
    const item = new Item({ name: 'X', buyPrice: 100 });
    expect(item.sellPrice).toBe(60);
  });

  it('withQuantity retorna nova instância com qty diferente', () => {
    const item = new Item({ name: 'X', slot: 'consumable', quantity: 1 });
    const stacked = item.withQuantity(5);
    expect(stacked.quantity).toBe(5);
    expect(item.quantity).toBe(1);
  });

  it('Item é imutável após criação', () => {
    const item = new Item({ name: 'X', atk: 10 });
    let threw = false;
    try { item.atk = 999; } catch (_) { threw = true; }
    expect(item.atk).toBe(10);
  });
});

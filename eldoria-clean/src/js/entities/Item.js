/**
 * Item — representa qualquer item do jogo (equipamento, consumível, material).
 * É um Value Object: imutável após criação, identificado por seus atributos.
 */
export class Item {
  constructor({
    id, name, icon = '📦', slot = null, rarity = 'common',
    atk = 0, def = 0, hp = 0, sp = 0, speed = 0,
    heal = 0, restoreSp = 0,
    buyPrice = 0, sellPrice = 0,
    reqLevel = 1, quantity = 1, durability = 100,
    description = '',
  }) {
    this.id          = id ?? `item_${name}_${rarity}`;
    this.name        = name;
    this.icon        = icon;
    this.slot        = slot;      // weapon | shield | cape | boots | ring | consumable
    this.rarity      = rarity;
    this.atk         = atk;
    this.def         = def;
    this.hp          = hp;
    this.sp          = sp;
    this.speed       = speed;
    this.heal        = heal;
    this.restoreSp   = restoreSp;
    this.buyPrice    = buyPrice;
    this.sellPrice   = sellPrice ?? Math.floor(buyPrice * 0.6);
    this.reqLevel    = reqLevel;
    this.quantity    = quantity;
    this.durability  = durability;
    this.description = description;
    Object.freeze(this);
  }

  isEquipment()  { return this.slot !== null && this.slot !== 'consumable'; }
  isConsumable() { return this.slot === 'consumable'; }
  isStackable()  { return this.isConsumable() || this.slot === null; }

  withQuantity(qty) {
    return new Item({ ...this, quantity: qty });
  }

  toJSON() {
    return { id: this.id, name: this.name, icon: this.icon, slot: this.slot,
             rarity: this.rarity, atk: this.atk, def: this.def, hp: this.hp,
             sp: this.sp, speed: this.speed, heal: this.heal, restoreSp: this.restoreSp,
             buyPrice: this.buyPrice, sellPrice: this.sellPrice, reqLevel: this.reqLevel,
             quantity: this.quantity, durability: this.durability };
  }
}

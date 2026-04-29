/**
 * Entity — classe base para todos os objetos do jogo com estado de vida.
 * Define a interface mínima que Player, Monster e Boss devem respeitar.
 */
export class Entity {
  constructor({ id, name, hp, maxHp, atk, def, level = 1 }) {
    this.id    = id ?? crypto.randomUUID();
    this.name  = name;
    this.hp    = hp;
    this.maxHp = maxHp;
    this.atk   = atk;
    this.def   = def;
    this.level = level;
    this.alive = true;
  }

  isAlive() { return this.hp > 0; }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp === 0) this.alive = false;
    return this.hp;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    return this.hp;
  }

  toJSON() {
    return { id: this.id, name: this.name, hp: this.hp, maxHp: this.maxHp,
             atk: this.atk, def: this.def, level: this.level };
  }
}

/**
 * Projectile — representa um projétil em voo (fireball, bola de boss, etc.).
 */
export class Projectile {
  constructor({ mesh, vel, dmg, owner = 'player', life = 60, hitRadius = 2 }) {
    this.mesh      = mesh;
    this.vel       = vel;       // THREE.Vector3
    this.dmg       = dmg;
    this.owner     = owner;     // 'player' | 'boss'
    this.life      = life;      // frames restantes
    this.hitRadius = hitRadius;
  }

  tick() {
    this.mesh.position.add(this.vel);
    this.life--;
    return this.life > 0;
  }

  isExpired() { return this.life <= 0; }

  distanceTo(target) {
    return this.mesh.position.distanceTo(target.position ?? target);
  }
}

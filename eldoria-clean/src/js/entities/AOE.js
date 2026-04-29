/**
 * AOE — área de efeito visual e de dano. Expande e desaparece após `duration` ms.
 */
export class AOE {
  constructor({ mesh, dmg, radius, duration = 800, origin }) {
    this.mesh     = mesh;     // THREE.Mesh (cilindro)
    this.dmg      = dmg;
    this.radius   = radius;
    this.duration = duration;
    this.elapsed  = 0;
    this.origin   = origin;   // THREE.Vector3
    this.applied  = false;    // dano já foi aplicado
  }

  tick(dt) {
    this.elapsed += dt;
    const progress = Math.min(this.elapsed / this.duration, 1);
    const scale    = 0.1 + progress * 1.4;
    this.mesh.scale.set(scale, 1, scale);
    this.mesh.material.opacity = 0.6 * (1 - progress);
    return this.elapsed < this.duration;
  }

  isExpired() { return this.elapsed >= this.duration; }
}

/**
 * Particle — partícula visual simples (faísca, poeira, fumaça).
 */
export class Particle {
  constructor({ mesh, vel, life = 30 }) {
    this.mesh = mesh;   // THREE.Mesh
    this.vel  = vel;    // THREE.Vector3
    this.life = life;
  }

  tick() {
    this.mesh.position.add(this.vel);
    this.vel.y -= 0.01;           // gravidade leve
    this.life--;
    if (this.mesh.material) {
      this.mesh.material.opacity = Math.max(0, this.life / 30);
    }
    return this.life > 0;
  }

  isExpired() { return this.life <= 0; }
}

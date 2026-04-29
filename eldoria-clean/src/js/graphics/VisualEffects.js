/**
 * VisualEffects — screenShake, floating text 3D, partículas.
 */
import { state } from '../core/GameState.js';

export function screenShake(mag) {
  state.shakeMag = Math.max(state.shakeMag, mag);
}

export function floatingText(text, worldPos, color = 'white') {
  const el = document.createElement('div');
  el.className = 'floating-text';
  el.textContent = text;
  el.style.color = color;

  const screen = worldToScreen(worldPos);
  el.style.left = screen.x + 'px';
  el.style.top  = screen.y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

export function worldToScreen(worldPos) {
  if (!state.camera || !state.renderer) return { x: innerWidth / 2, y: innerHeight / 2 };
  const THREE = window.THREE;
  const v = worldPos.clone().project(state.camera);
  return {
    x: (v.x + 1) / 2 * innerWidth,
    y: (-v.y + 1) / 2 * innerHeight,
  };
}

export function applyScreenShake() {
  if (state.shakeMag <= 0) return;
  state.camera.position.x += (Math.random() - 0.5) * state.shakeMag;
  state.camera.position.y += (Math.random() - 0.5) * state.shakeMag * 0.5;
  state.shakeMag *= 0.8;
  if (state.shakeMag < 0.01) state.shakeMag = 0;
}

export function spawnParticle(pos, color) {
  const THREE = window.THREE;
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.15),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 })
  );
  mesh.position.copy(pos);
  const vel = new THREE.Vector3(
    (Math.random() - 0.5) * 0.3,
    Math.random() * 0.3 + 0.1,
    (Math.random() - 0.5) * 0.3
  );
  state.scene.add(mesh);
  state.particles.push({ mesh, vel, life: 30 });
}

export function updateParticles() {
  state.particles = state.particles.filter(p => {
    p.mesh.position.add(p.vel);
    p.vel.y -= 0.01;
    p.life--;
    p.mesh.material.opacity = p.life / 30;
    if (p.life <= 0) { state.scene.remove(p.mesh); return false; }
    return true;
  });
}

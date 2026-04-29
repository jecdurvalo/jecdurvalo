/**
 * ModelLoader — criação de meshes 3D para o herói e monstros.
 */
import { state } from '../core/GameState.js';

export function buildHero() {
  const THREE = window.THREE;

  const hero = new THREE.Group();
  // Corpo
  const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1.5, 0.8), new THREE.MeshStandardMaterial({ color: 0x4444cc }));
  body.position.y = 0.75; hero.add(body);
  // Cabeça
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshStandardMaterial({ color: 0xffdbac }));
  head.position.y = 1.9; hero.add(head);
  // Mão (usada quando sem arma)
  const hand = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({ color: 0xffdbac }));
  hand.position.set(0.6, 1, 0.4); hand.visible = true; hero.add(hand);

  hero.position.set(0, 0, 0);
  hero._hand = hand;

  state.scene.add(hero);
  state.hero = hero;
  state.lastDir = new THREE.Vector3(0, 0, 1);
  return hero;
}

export function applyEquipVisual() {
  const THREE = window.THREE;
  const { hero, equipped, visuals } = state;

  visuals.forEach(v => hero.remove(v));
  state.visuals = [];
  state.weaponGroup = null;

  if (hero._hand) hero._hand.visible = !equipped.weapon;

  if (equipped.weapon) {
    const wg = new THREE.Group();
    const blade = new THREE.Mesh(new THREE.BoxGeometry(.15, 1.6, .15), new THREE.MeshStandardMaterial({ color: 0xf0f0f0 }));
    blade.position.y = 0.8; wg.add(blade);
    const hilt = new THREE.Mesh(new THREE.BoxGeometry(.15, 0.3, .15), new THREE.MeshStandardMaterial({ color: 0x8b4513 }));
    hilt.position.y = 0.15; wg.add(hilt);
    wg.position.set(0.8, 1, 0.3);
    wg.rotation.x = Math.PI / 4;
    hero.add(wg); state.visuals.push(wg); state.weaponGroup = wg;
  }
  if (equipped.shield) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(.9, 1, .2), new THREE.MeshStandardMaterial({ color: 0x777 }));
    s.position.set(-0.9, 1, 0.2); hero.add(s); state.visuals.push(s);
  }
  if (equipped.cape) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(1, 1.7, .08), new THREE.MeshStandardMaterial({ color: 0x331144 }));
    c.position.set(0, 0.85, -.45); hero.add(c); state.visuals.push(c);
  }
  if (equipped.boots) {
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.5), new THREE.MeshStandardMaterial({ color: 0x331100 }));
    const b2 = b1.clone();
    b1.position.set(-0.3, 0.15, 0.1); b2.position.set(0.3, 0.15, 0.1);
    hero.add(b1); hero.add(b2); state.visuals.push(b1, b2);
  }
  if (equipped.ring1) {
    const r = new THREE.Mesh(new THREE.SphereGeometry(0.15), new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00 }));
    r.position.set(0.6, 1.2, 0.4); hero.add(r); state.visuals.push(r);
  }
  if (equipped.ring2) {
    const r = new THREE.Mesh(new THREE.SphereGeometry(0.15), new THREE.MeshStandardMaterial({ color: 0x00d7ff, emissive: 0x0055ff }));
    r.position.set(-0.6, 1.2, 0.4); hero.add(r); state.visuals.push(r);
  }
}

export function buildMonsterMesh(monsterType, size, isElite) {
  const THREE = window.THREE;
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: monsterType.color });
  const body = new THREE.Mesh(new THREE.BoxGeometry(size, size * 1.2, size), bodyMat);
  body.position.y = size * 0.6; group.add(body);

  const eyeMat = new THREE.MeshStandardMaterial({ color: monsterType.eyeColor, emissive: monsterType.eyeColor, emissiveIntensity: 0.5 });
  [-0.2, 0.2].forEach(x => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(size * 0.1), eyeMat);
    eye.position.set(x * size, size * 1.1, size * 0.5);
    group.add(eye);
  });
  if (isElite) {
    const crown = new THREE.Mesh(new THREE.ConeGeometry(size * 0.3, size * 0.4, 6), new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00 }));
    crown.position.y = size * 1.4; group.add(crown);
  }
  return group;
}

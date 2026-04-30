/**
 * ModelLoader — criação de meshes 3D para o herói, monstros e bosses.
 */
import { state } from '../core/GameState.js';
import { BOSS_BIOME_VISUALS } from '../core/Config.js';

export function buildHero() {
  const THREE = window.THREE;
  const hero = new THREE.Group();

  // Corpo — cor e proporção idênticas ao original
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.8, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x3f7cff })
  );
  body.position.y = 1;
  hero.add(body);

  // Cabeça com pele (topo do corpo, y=1.9)
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.8, 0.8),
    new THREE.MeshStandardMaterial({ color: 0xffdbac })
  );
  head.position.y = 1.9;
  hero.add(head);

  // Cabelo escuro sobre a cabeça
  const hair = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.2, 0.82),
    new THREE.MeshStandardMaterial({ color: 0x2d160d })
  );
  hair.position.y = 2.15;
  hero.add(hair);

  // Perna esquerda
  const legMat = new THREE.MeshStandardMaterial({ color: 0x2a2a99 });
  const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.9, 0.4), legMat);
  leg1.position.set(-0.25, 0.07, 0);
  hero.add(leg1);

  // Perna direita
  const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.9, 0.4), legMat);
  leg2.position.set(0.25, 0.07, 0);
  hero.add(leg2);

  // Mão (visível quando sem arma)
  const hand = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.3, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xffdbac })
  );
  hand.position.set(0.6, 1, 0.4);
  hand.visible = true;
  hero.add(hand);

  hero.position.set(0, 0, 0);
  hero._hand = hand;
  hero._legs = [leg1, leg2];

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
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 1.6, 0.15),
      new THREE.MeshStandardMaterial({ color: 0xf0f0f0 })
    );
    blade.position.y = 0.8;
    wg.add(blade);
    const hilt = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.3, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    hilt.position.y = 0.15;
    wg.add(hilt);
    wg.position.set(0.8, 1, 0.3);
    wg.rotation.x = Math.PI / 4;
    hero.add(wg);
    state.visuals.push(wg);
    state.weaponGroup = wg;
  }
  if (equipped.shield) {
    const s = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 1, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x777777 })
    );
    s.position.set(-0.9, 1, 0.2);
    hero.add(s); state.visuals.push(s);
  }
  if (equipped.cape) {
    const c = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1.7, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x331144 })
    );
    c.position.set(0, 0.85, -0.45);
    hero.add(c); state.visuals.push(c);
  }
  if (equipped.boots) {
    const b1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.3, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x331100 })
    );
    const b2 = b1.clone();
    b1.position.set(-0.3, 0.15, 0.1);
    b2.position.set( 0.3, 0.15, 0.1);
    hero.add(b1); hero.add(b2);
    state.visuals.push(b1, b2);
  }
  if (equipped.ring1) {
    const r = new THREE.Mesh(
      new THREE.SphereGeometry(0.15),
      new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00 })
    );
    r.position.set(0.6, 1.2, 0.4);
    hero.add(r); state.visuals.push(r);
  }
  if (equipped.ring2) {
    const r = new THREE.Mesh(
      new THREE.SphereGeometry(0.15),
      new THREE.MeshStandardMaterial({ color: 0x00d7ff, emissive: 0x0055ff })
    );
    r.position.set(-0.6, 1.2, 0.4);
    hero.add(r); state.visuals.push(r);
  }
}

export function buildMonsterMesh(monsterType, size, isElite) {
  const THREE = window.THREE;
  const group = new THREE.Group();

  const bodyColor = isElite ? 0x8b0000 : monsterType.color;
  const bodyMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    ...(isElite ? { emissive: 0x550000, emissiveIntensity: 0.3 } : {}),
  });

  // Corpo
  const body = new THREE.Mesh(new THREE.BoxGeometry(size, size * 0.6, size * 0.7), bodyMat);
  body.position.y = size * 0.5;
  group.add(body);

  // Cabeça
  const head = new THREE.Mesh(new THREE.BoxGeometry(size * 0.7, size * 0.5, size * 0.6), bodyMat);
  head.position.y = size * 1.05;
  group.add(head);

  // Olhos
  const eyeMat = new THREE.MeshStandardMaterial({
    color: monsterType.eyeColor,
    emissive: monsterType.eyeColor,
    emissiveIntensity: 0.5,
  });
  [-0.2, 0.2].forEach(x => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(size * 0.1), eyeMat);
    eye.position.set(x * size, size * 1.1, size * 0.5);
    group.add(eye);
  });

  // Braços
  const arm1 = new THREE.Mesh(new THREE.BoxGeometry(size * 0.25, size * 0.5, size * 0.25), bodyMat);
  arm1.position.set(-size * 0.6, size * 0.7, 0);
  group.add(arm1);
  const arm2 = arm1.clone();
  arm2.position.set(size * 0.6, size * 0.7, 0);
  group.add(arm2);

  // Elite: coroa dourada
  if (isElite) {
    const crown = new THREE.Mesh(
      new THREE.ConeGeometry(size * 0.3, size * 0.4, 6),
      new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00 })
    );
    crown.position.y = size * 1.4;
    group.add(crown);
  }

  return group;
}

export function buildBossMesh(biomeIndex) {
  const THREE = window.THREE;
  const bv = BOSS_BIOME_VISUALS[Math.min(biomeIndex, BOSS_BIOME_VISUALS.length - 1)];
  const size = 4;
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: bv.bodyColor, roughness: 0.7 });

  // Corpo
  const body = new THREE.Mesh(new THREE.BoxGeometry(size, size * 0.6, size * 0.7), bodyMat);
  body.position.y = size * 0.5;
  group.add(body);

  // Cabeça
  const head = new THREE.Mesh(new THREE.BoxGeometry(size * 0.7, size * 0.5, size * 0.6), bodyMat);
  head.position.y = size * 1.05;
  group.add(head);

  // Olhos emissivos
  const eyeMat = new THREE.MeshStandardMaterial({ color: bv.eyeColor, emissive: bv.eyeColor, emissiveIntensity: 1.2 });
  const eye1 = new THREE.Mesh(new THREE.SphereGeometry(size * 0.12), eyeMat);
  eye1.position.set(-size * 0.15, size * 1.1, size * 0.35);
  group.add(eye1);
  const eye2 = eye1.clone();
  eye2.position.set(size * 0.15, size * 1.1, size * 0.35);
  group.add(eye2);

  // Chifres
  const hornMat = new THREE.MeshStandardMaterial({ color: bv.hornColor });
  const horn1 = new THREE.Mesh(new THREE.ConeGeometry(size * 0.1, size * 0.4, 8), hornMat);
  horn1.position.set(-size * 0.25, size * 1.4, 0);
  horn1.rotation.z = -0.3;
  group.add(horn1);
  const horn2 = horn1.clone();
  horn2.position.set(size * 0.25, size * 1.4, 0);
  horn2.rotation.z = 0.3;
  group.add(horn2);

  // Braços
  const armMat = new THREE.MeshStandardMaterial({ color: bv.bodyColor });
  const arm1 = new THREE.Mesh(new THREE.BoxGeometry(size * 0.25, size * 0.5, size * 0.25), armMat);
  arm1.position.set(-size * 0.6, size * 0.7, 0);
  group.add(arm1);
  const arm2 = arm1.clone();
  arm2.position.set(size * 0.6, size * 0.7, 0);
  group.add(arm2);

  return group;
}

/**
 * SceneManager — setup do Three.js: cena, câmera, renderer, iluminação.
 */
import { state } from '../core/GameState.js';
import { BIOMES } from '../core/Config.js';

export function initScene() {
  const THREE = window.THREE;

  state.scene = new THREE.Scene();
  state.scene.background = new THREE.Color(BIOMES[0].skyColor);
  state.scene.fog = new THREE.Fog(BIOMES[0].fogColor, 50, 150);

  state.camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000);

  state.renderer = new THREE.WebGLRenderer({ antialias: true });
  state.renderer.setSize(innerWidth, innerHeight);
  state.renderer.domElement.id = 'gameCanvas';
  document.body.appendChild(state.renderer.domElement);

  // Luz ambiente + direcional
  state.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(20, 30, 20);
  state.scene.add(sun);

  // Chão
  state.ground = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshStandardMaterial({ color: BIOMES[0].groundColor })
  );
  state.ground.rotation.x = -Math.PI / 2;
  state.scene.add(state.ground);

  window.addEventListener('resize', onResize);
}

export function updateBiomeVisuals(biomeIndex) {
  const THREE = window.THREE;
  const biome = BIOMES[biomeIndex];
  state.ground.material.color.setHex(biome.groundColor);
  state.scene.background.setHex(biome.skyColor);
  state.scene.fog.color.setHex(biome.fogColor);
}

function onResize() {
  state.camera.aspect = innerWidth / innerHeight;
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(innerWidth, innerHeight);
}

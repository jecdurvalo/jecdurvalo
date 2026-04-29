/**
 * Minimap — minimap redondo e mapa expandido (tecla M).
 */
import { state } from '../core/GameState.js';
import { BIOMES } from '../core/Config.js';

const MINIMAP_SCALE = 0.5;
const FULLMAP_SCALE = 2;

export function drawMinimap() {
  const canvas = document.getElementById('minimapCanvas');
  if (!canvas || !state.hero) return;
  const ctx = canvas.getContext('2d');
  const { hero, monsters, currentBiome } = state;
  const biome = BIOMES[currentBiome];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fundo do bioma
  ctx.fillStyle = '#' + biome.groundColor.toString(16).padStart(6, '0');
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // Monstros
  monsters.forEach(m => {
    const dx = (m.position.x - hero.position.x) * MINIMAP_SCALE + cx;
    const dz = (m.position.z - hero.position.z) * MINIMAP_SCALE + cy;
    ctx.beginPath();
    ctx.arc(dx, dz, m.userData.isBoss ? 4 : 2, 0, Math.PI * 2);
    ctx.fillStyle = m.userData.isBoss ? 'red' : 'orange';
    ctx.fill();
  });

  // Herói
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#5ab9ff'; ctx.fill();
  ctx.strokeStyle = 'white'; ctx.lineWidth = 1.5; ctx.stroke();
}

let isFullMapOpen = false;

export function toggleFullMap() {
  const modal = document.getElementById('fullMapModal');
  if (!modal) return;
  isFullMapOpen = !isFullMapOpen;
  modal.style.display = isFullMapOpen ? 'block' : 'none';
  if (isFullMapOpen) drawFullMap();
  state.gamePaused = isFullMapOpen;
}

function drawFullMap() {
  const canvas = document.getElementById('fullMapCanvas');
  if (!canvas || !state.hero) return;
  const ctx = canvas.getContext('2d');
  const { hero, monsters, currentBiome } = state;
  const biome = BIOMES[currentBiome];
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  ctx.fillStyle = '#' + biome.groundColor.toString(16).padStart(6, '0');
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  monsters.forEach(m => {
    const dx = (m.position.x - hero.position.x) * FULLMAP_SCALE + cx;
    const dz = (m.position.z - hero.position.z) * FULLMAP_SCALE + cy;
    ctx.beginPath(); ctx.arc(dx, dz, m.userData.isBoss ? 6 : 3, 0, Math.PI * 2);
    ctx.fillStyle = m.userData.isBoss ? 'red' : 'orange'; ctx.fill();
  });

  ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#5ab9ff'; ctx.fill();
  ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();
}

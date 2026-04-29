/**
 * BiomeManager — gerencia transições de bioma baseadas no nível.
 */
import { state } from '../core/GameState.js';
import { BIOMES } from '../core/Config.js';
import { updateBiomeVisuals } from '../graphics/SceneManager.js';
import { log } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';

export function getBiomeForLevel(level) {
  let idx = 0;
  for (let i = BIOMES.length - 1; i >= 0; i--) {
    if (level >= BIOMES[i].level) { idx = i; break; }
  }
  return idx;
}

export function updateBiome() {
  const newIdx = getBiomeForLevel(state.player.level);
  if (newIdx === state.currentBiome) return;

  state.currentBiome = newIdx;
  const biome = BIOMES[newIdx];
  updateBiomeVisuals(newIdx);

  // Track biomas visitados para conquistas
  if (!state.evolution.stats.visitedBiomes.includes(newIdx)) {
    state.evolution.stats.visitedBiomes.push(newIdx);
    state.evolution.stats.biomesVisited = state.evolution.stats.visitedBiomes.length;
  }

  log(`<span style='color:cyan'>🌍 ${biome.name}!</span>`);
  EventBus.emit('biome:change', { index: newIdx, biome });
}

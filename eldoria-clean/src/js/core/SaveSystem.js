/**
 * SaveSystem — persistência via localStorage.
 * Interface preparada para futura camada de backend (CRUD).
 */
import { state } from './GameState.js';

const SAVE_PREFIX = 'eldoria_save_v2_';

export function getSaveKey(name) {
  return SAVE_PREFIX + (name || state.playerName).toLowerCase().replace(/\s+/g, '_');
}

export function saveGame() {
  try {
    const saveData = {
      playerName: state.playerName,
      savedAt: Date.now(),
      player: state.player,
      inventory: state.inventory,
      equipped: state.equipped,
      controlMode: state.controlMode,
      currentBiome: state.currentBiome,
      evolutionData: {
        totalXP: state.evolution.totalXP,
        skillPoints: state.evolution.skillPoints,
        stats: state.evolution.stats,
        achievements: state.evolution.achievements.map(a => ({ id: a.id, unlocked: a.unlocked })),
        quests: state.evolution.quests.map(q => ({ id: q.id, progress: q.progress, completed: q.completed })),
        skillTree: state.evolution.skillTree.map(s => ({ id: s.id, level: s.level })),
        activeSkillTree: state.evolution.activeSkillTree.map(s => ({ id: s.id, level: s.level })),
      },
    };
    localStorage.setItem(getSaveKey(), JSON.stringify(saveData));
    return true;
  } catch(e) {
    console.error('Falha ao salvar:', e);
    return false;
  }
}

export function loadGame(playerName) {
  try {
    const raw = localStorage.getItem(getSaveKey(playerName));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch(e) {
    console.error('Falha ao carregar save:', e);
    return null;
  }
}

export function getAllSaves() {
  const saves = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith(SAVE_PREFIX)) continue;
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if (data?.playerName) saves.push({ key, data });
    } catch(e) {}
  }
  return saves.sort((a, b) => (b.data.savedAt || 0) - (a.data.savedAt || 0));
}

export function deleteSave(key) {
  localStorage.removeItem(key);
}

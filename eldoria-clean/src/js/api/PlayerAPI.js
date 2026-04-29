/**
 * PlayerAPI — repositório de dados do jogador.
 * Hoje: localStorage via ApiService. Futuro: POST /api/players/:id
 */
import { ApiService } from './ApiService.js';

const KEY = name => `save_${name}`;

export const PlayerAPI = {
  async save(playerName, data) {
    return ApiService.set(KEY(playerName), { ...data, savedAt: new Date().toISOString() });
  },

  async load(playerName) {
    return ApiService.get(KEY(playerName));
  },

  async delete(playerName) {
    return ApiService.remove(KEY(playerName));
  },

  async listAll() {
    const items = await ApiService.list('save_');
    return items.sort((a, b) =>
      new Date(b.data?.savedAt ?? 0) - new Date(a.data?.savedAt ?? 0)
    );
  },
};

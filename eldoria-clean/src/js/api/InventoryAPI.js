/**
 * InventoryAPI — persistência de inventário por jogador.
 * Separado de PlayerAPI para facilitar migração independente para microserviço.
 * Futuro: GET/PUT /api/players/:id/inventory
 */
import { ApiService } from './ApiService.js';

const KEY = name => `inventory_${name}`;

export const InventoryAPI = {
  async save(playerName, inventory) {
    return ApiService.set(KEY(playerName), inventory);
  },

  async load(playerName) {
    return ApiService.get(KEY(playerName)) ?? [];
  },

  async clear(playerName) {
    return ApiService.remove(KEY(playerName));
  },
};

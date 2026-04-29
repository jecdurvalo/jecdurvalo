/**
 * LeaderboardAPI — ranking de jogadores.
 * Hoje: agrega saves locais. Futuro: GET /api/leaderboard
 */
import { ApiService } from './ApiService.js';
import { PlayerAPI } from './PlayerAPI.js';

export const LeaderboardAPI = {
  async getTopPlayers(limit = 10) {
    const all = await PlayerAPI.listAll();
    return all
      .map(({ data }) => ({
        name:   data.playerName ?? '???',
        level:  data.player?.level  ?? 1,
        kills:  data.evolutionData?.stats?.kills ?? 0,
        gold:   data.player?.gold   ?? 0,
      }))
      .sort((a, b) => b.level - a.level || b.kills - a.kills)
      .slice(0, limit);
  },

  async submitScore(_playerName, _scoreData) {
    // No-op local. Substituir por:
    // return fetch('/api/leaderboard', { method: 'POST', body: JSON.stringify({..._scoreData}) });
    return { ok: true, message: 'local-only' };
  },
};

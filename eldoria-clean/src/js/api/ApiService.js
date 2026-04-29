/**
 * ApiService — abstração de transporte de dados.
 *
 * Hoje usa localStorage. Para conectar a um backend real, basta trocar
 * os métodos `get` / `set` / `remove` por chamadas fetch(), sem alterar
 * nenhum outro arquivo.
 *
 * Exemplo de migração futura:
 *   get(key)    → fetch(`/api/${key}`)
 *   set(key, v) → fetch(`/api/${key}`, { method:'PUT', body: JSON.stringify(v) })
 */
const PREFIX = 'eldoria_v2_';

export const ApiService = {
  async get(key) {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  },

  async set(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return { ok: true };
  },

  async remove(key) {
    localStorage.removeItem(PREFIX + key);
    return { ok: true };
  },

  async list(prefix) {
    const results = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX + prefix)) {
        try { results.push({ key: k, data: JSON.parse(localStorage.getItem(k)) }); }
        catch (_) { /* item corrompido — ignora */ }
      }
    }
    return results;
  },
};

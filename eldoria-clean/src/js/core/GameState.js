/**
 * GameState — Singleton com todo estado mutável do jogo.
 * Sistemas leem e escrevem aqui; EventBus notifica sobre mudanças.
 */

function createDefaultPlayer() {
  return {
    name: '',
    level: 1,
    hp: 100, maxHp: 100,
    sp: 80,  maxSp: 80,
    xp: 0,   next: 100,
    gold: 0,
    baseAtk: 10, baseDef: 3,
    critChance: 0, lifesteal: 0,
    speedBonus: 0,
    aoeDamageBonus: 0,
    fireballDamageBonus: 0,
  };
}

function createDefaultEvolution() {
  return {
    totalXP: 0,
    skillPoints: 0,
    stats: {
      kills: 0, wolfKills: 0, bossKills: 0,
      itemsCollected: 0, biomesVisited: 0, visitedBiomes: [],
      slimeKills:0, spiderKills:0, orcKills:0, dragonKills:0,
      goblinKills:0, treantKills:0, yetiKills:0, banditKills:0,
      scorpionKills:0, mummyKills:0, wormKills:0, aoeUses:0,
      desertKills:0, iceKills:0, fireKills:0, mysticKills:0,
      crystalKills:0, shadowKills:0, celestialKills:0, voidKills:0,
      dashUses:0, fireballHits:0, worldItemsCollected:0,
    },
    achievements: [],
    quests: [],
    skillTree: [],
    activeSkillTree: [],
  };
}

function createDefaultEquipped() {
  return {
    weapon: null, shield: null, cape: null,
    boots: null, ring1: null, ring2: null,
  };
}

// Estado singleton — acessado diretamente pelos sistemas
export const state = {
  // Jogo
  gamePaused: false,
  currentBiome: 0,
  playerName: '',
  controlMode: 'wasd',

  // Entidades
  player: createDefaultPlayer(),
  inventory: [],
  equipped: createDefaultEquipped(),
  evolution: createDefaultEvolution(),
  monsters: [],
  projectiles: [],
  particles: [],
  playerDots: [],

  // Three.js (preenchidos pelo SceneManager)
  scene: null,
  camera: null,
  renderer: null,
  hero: null,
  ground: null,
  heroLabel: null,
  weaponGroup: null,
  visuals: [],
  lastDir: null,

  // Combate
  isAttacking: false,
  isDashing: false,
  isShielded: false,
  lastAoeTime: -999999,
  lastDashTime: -999999,
  lastShieldTime: -999999,
  lastFireballTime: -999999,
  shakeMag: 0,

  // Input
  keys: {},
  joystick: { x: 0, y: 0, active: false },
};

export function resetPlayer() {
  Object.assign(state.player, createDefaultPlayer());
  state.inventory = [];
  state.equipped = createDefaultEquipped();
  state.evolution = createDefaultEvolution();
  state.currentBiome = 0;
}

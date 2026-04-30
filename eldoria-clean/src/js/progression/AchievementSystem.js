/**
 * AchievementSystem — conquistas e verificação automática.
 */
import { state } from '../core/GameState.js';
import { floatingText } from '../graphics/VisualEffects.js';
import { log } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';

export const ACHIEVEMENTS = [
  // ── Kills ────────────────────────────────────────────────────────────────
  { id:'first_blood',   name:'Primeiro Sangue',   desc:'Derrote seu primeiro inimigo',   icon:'⚔️', condition:d=>d.kills>=1,           rewardSP:1,  rewardGold:10   },
  { id:'killer_10',     name:'Caçador',            desc:'Derrote 10 inimigos',            icon:'🎯', condition:d=>d.kills>=10,          rewardSP:1,  rewardGold:25   },
  { id:'killer_50',     name:'Guerreiro',          desc:'Derrote 50 inimigos',            icon:'🏅', condition:d=>d.kills>=50,          rewardSP:2,  rewardGold:75   },
  { id:'killer_100',    name:'Lenda',              desc:'Derrote 100 inimigos',           icon:'👑', condition:d=>d.kills>=100,         rewardSP:3,  rewardGold:150  },
  { id:'killer_500',    name:'Exterminador',       desc:'Derrote 500 inimigos',           icon:'💀', condition:d=>d.kills>=500,         rewardSP:6,  rewardGold:500  },

  // ── Níveis ───────────────────────────────────────────────────────────────
  { id:'level_5',       name:'Aprendiz',           desc:'Alcance o nível 5',              icon:'⭐', condition:d=>d.level>=5,           rewardSP:1,  rewardGold:50   },
  { id:'level_10',      name:'Veterano',            desc:'Alcance o nível 10',             icon:'🌟', condition:d=>d.level>=10,          rewardSP:2,  rewardGold:100  },
  { id:'level_15',      name:'Combatente',          desc:'Alcance o nível 15',             icon:'🌟', condition:d=>d.level>=15,          rewardSP:2,  rewardGold:150  },
  { id:'level_20',      name:'Mestre',              desc:'Alcance o nível 20',             icon:'💫', condition:d=>d.level>=20,          rewardSP:3,  rewardGold:200  },
  { id:'level_30',      name:'Especialista',        desc:'Alcance o nível 30',             icon:'💫', condition:d=>d.level>=30,          rewardSP:4,  rewardGold:400  },
  { id:'level_40',      name:'Elite',               desc:'Alcance o nível 40',             icon:'🔥', condition:d=>d.level>=40,          rewardSP:5,  rewardGold:600  },
  { id:'level_50',      name:'Divino',              desc:'Alcance o nível 50',             icon:'👼', condition:d=>d.level>=50,          rewardSP:8,  rewardGold:1000 },
  { id:'level_60',      name:'Transcendente',       desc:'Alcance o nível 60',             icon:'✨', condition:d=>d.level>=60,          rewardSP:10, rewardGold:2000 },
  { id:'level_75',      name:'Ascendente',          desc:'Alcance o nível 75',             icon:'🌠', condition:d=>d.level>=75,          rewardSP:12, rewardGold:3500 },
  { id:'level_100',     name:'Imortal',             desc:'Alcance o nível 100',            icon:'👑', condition:d=>d.level>=100,         rewardSP:20, rewardGold:5000 },

  // ── Itens e Ouro ─────────────────────────────────────────────────────────
  { id:'looter',        name:'Saqueador',           desc:'Colete 20 itens',               icon:'📦', condition:d=>d.itemsCollected>=20, rewardSP:1,  rewardGold:30   },
  { id:'rich',          name:'Mercador',            desc:'Acumule 500 gold',              icon:'💰', condition:d=>d.gold>=500,          rewardSP:1,  rewardGold:0    },
  { id:'rich2',         name:'Magnata',             desc:'Acumule 1000 gold',             icon:'💎', condition:d=>d.gold>=1000,         rewardSP:2,  rewardGold:0    },

  // ── Exploração ───────────────────────────────────────────────────────────
  { id:'explorer',      name:'Explorador',          desc:'Visite 5 biomas',               icon:'🗺️', condition:d=>d.biomesVisited>=5,   rewardSP:2,  rewardGold:100  },
  { id:'explorer_adv',  name:'Explorador Supremo',  desc:'Visite todos os 10 biomas',     icon:'🌍', condition:d=>d.biomesVisited>=10,  rewardSP:5,  rewardGold:500  },

  // ── Bosses ───────────────────────────────────────────────────────────────
  { id:'boss_slayer',   name:'Matador de Bosses',   desc:'Derrote 10 bosses',             icon:'👹', condition:d=>d.bossKills>=10,      rewardSP:3,  rewardGold:200  },
  { id:'boss_master',   name:'Mestre dos Bosses',   desc:'Derrote 50 bosses',             icon:'🏆', condition:d=>d.bossKills>=50,      rewardSP:8,  rewardGold:1000 },

  // ── Habilidades ──────────────────────────────────────────────────────────
  { id:'aoe_master',    name:'Mestre da Destruição',desc:'Use AOE 50 vezes',              icon:'💥', condition:d=>d.aoeUses>=50,        rewardSP:3,  rewardGold:200  },
  { id:'fireball_master',name:'Arquimago',          desc:'Lance 100 Fireballs',           icon:'🔥', condition:d=>d.fireballHits>=100,  rewardSP:3,  rewardGold:200  },
  { id:'speed_demon',   name:'Veloz como o Vento',  desc:'Use Dash 50 vezes',             icon:'💨', condition:d=>d.dashUses>=50,       rewardSP:2,  rewardGold:150  },
];

export function initAchievements() {
  state.evolution.achievements = ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: state.evolution.achievements.find(s => s.id === a.id)?.unlocked || false,
  }));
}

export function checkAchievements() {
  const stats = { ...state.evolution.stats, level: state.player.level, gold: state.player.gold };

  state.evolution.achievements.forEach(ach => {
    if (ach.unlocked) return;
    if (!ach.condition(stats)) return;

    ach.unlocked = true;
    state.player.gold += ach.rewardGold || 0;
    state.evolution.skillPoints += ach.rewardSP || 0;

    floatingText('🏆 ' + ach.name, state.hero.position, 'gold');
    log(`<span style='color:gold'>🏆 Conquista: ${ach.name}!</span>`);
    EventBus.emit('achievement:unlock', ach);
  });
}

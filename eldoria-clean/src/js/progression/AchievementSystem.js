/**
 * AchievementSystem — conquistas e verificação automática.
 */
import { state } from '../core/GameState.js';
import { floatingText } from '../graphics/VisualEffects.js';
import { log } from '../core/Logger.js';
import { EventBus } from '../core/EventBus.js';

export const ACHIEVEMENTS = [
  { id:'first_blood', name:'Primeiro Sangue', desc:'Derrote seu primeiro inimigo', icon:'⚔️', condition:d=>d.kills>=1,    rewardSP:1, rewardGold:10  },
  { id:'killer_10',   name:'Caçador',         desc:'Derrote 10 inimigos',          icon:'🎯', condition:d=>d.kills>=10,   rewardSP:1, rewardGold:25  },
  { id:'killer_50',   name:'Guerreiro',       desc:'Derrote 50 inimigos',          icon:'🏅', condition:d=>d.kills>=50,   rewardSP:2, rewardGold:75  },
  { id:'killer_100',  name:'Lenda',           desc:'Derrote 100 inimigos',         icon:'👑', condition:d=>d.kills>=100,  rewardSP:3, rewardGold:150 },
  { id:'level_5',     name:'Aprendiz',        desc:'Alcance o nível 5',            icon:'⭐', condition:d=>d.level>=5,    rewardSP:1, rewardGold:50  },
  { id:'level_10',    name:'Veterano',        desc:'Alcance o nível 10',           icon:'🌟', condition:d=>d.level>=10,   rewardSP:2, rewardGold:100 },
  { id:'level_20',    name:'Mestre',          desc:'Alcance o nível 20',           icon:'💫', condition:d=>d.level>=20,   rewardSP:3, rewardGold:200 },
  { id:'level_50',    name:'Divino',          desc:'Alcance o nível 50',           icon:'👼', condition:d=>d.level>=50,   rewardSP:8, rewardGold:1000},
  { id:'looter',      name:'Saqueador',       desc:'Colete 20 itens',              icon:'📦', condition:d=>d.itemsCollected>=20, rewardSP:1, rewardGold:30 },
  { id:'rich',        name:'Mercador',        desc:'Acumule 500 gold',             icon:'💰', condition:d=>d.gold>=500,   rewardSP:1, rewardGold:0   },
  { id:'explorer',    name:'Explorador',      desc:'Visite todos os biomas',       icon:'🗺️', condition:d=>d.biomesVisited>=5, rewardSP:2, rewardGold:100 },
  { id:'boss_slayer', name:'Matador de Bosses',desc:'Derrote 10 bosses',          icon:'👹', condition:d=>d.bossKills>=10, rewardSP:3, rewardGold:200},
];

export function initAchievements() {
  // Merge com estado salvo (preserva unlocked)
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

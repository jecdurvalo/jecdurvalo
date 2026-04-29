/**
 * EldoriaApp — orquestrador central da aplicação.
 * Inicializa todos os sistemas na ordem correta e conecta eventos globais.
 */
import { state, resetPlayer } from './core/GameState.js';
import { initScene } from './graphics/SceneManager.js';
import { buildHero, applyEquipVisual } from './graphics/ModelLoader.js';
import { initInput } from './input/InputHandler.js';
import { initJoystick } from './input/Joystick.js';
import { initHUD, updateBars } from './ui/HUD.js';
import { initUIManager, closeAllMenus, toggleInventory, toggleShop, toggleEvolution, togglePause, toggleMobileMenu } from './ui/UIManager.js';
import { startGameLoop } from './core/GameLoop.js';
import { initAchievements } from './progression/AchievementSystem.js';
import { initQuests } from './progression/QuestSystem.js';
import { getAllSaves, deleteSave, loadGame, saveGame } from './core/SaveSystem.js';
import { spawnMonster } from './world/SpawnSystem.js';
import { EventBus } from './core/EventBus.js';
import { playSound } from './core/AudioManager.js';
import { floatingText } from './graphics/VisualEffects.js';
import { log } from './core/Logger.js';

let startOverlay = null;

export function boot() {
  showStartScreen();
}

// ── TELA INICIAL ─────────────────────────────────────────────────────────────
function showStartScreen() {
  startOverlay = document.createElement('div');
  startOverlay.id = 'startOverlay';
  document.body.appendChild(startOverlay);
  renderStartScreen();
}

function renderStartScreen() {
  const saves = getAllSaves();
  const hasSaves = saves.length > 0;

  startOverlay.innerHTML = `
    <div style="width:100%;max-width:460px;padding-bottom:40px;">
      <div style="text-align:center;margin-bottom:32px;padding-top:20px;">
        <div style="font-size:64px;margin-bottom:8px;">⚔️</div>
        <h1 style="color:#5ab9ff;font-size:44px;margin:0 0 4px 0;text-shadow:0 0 30px rgba(90,185,255,0.6);letter-spacing:3px;">ELDORIA</h1>
        <p style="color:#4a6a8a;font-size:12px;margin:0;letter-spacing:3px;">LEGENDS OF ELDORIA</p>
      </div>

      ${hasSaves ? `
      <div style="margin-bottom:28px;">
        <p style="color:#7ea8cc;font-size:13px;letter-spacing:2px;margin:0 0 14px 0;text-transform:uppercase;">⚔ Heróis Salvos</p>
        <div id="savesList"></div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px;">
        <div style="flex:1;height:1px;background:rgba(90,185,255,0.2);"></div>
        <span style="color:#3a5070;font-size:13px;white-space:nowrap;">ou crie um novo herói</span>
        <div style="flex:1;height:1px;background:rgba(90,185,255,0.2);"></div>
      </div>` : ''}

      <div>
        <p style="color:#7ea8cc;font-size:13px;letter-spacing:2px;margin:0 0 10px 0;text-transform:uppercase;">🎮 Tipo de Controle</p>
        <div style="display:flex;gap:12px;margin-bottom:14px;">
          <button id="btnWASD" onclick="window._setControl('wasd')"
            style="flex:1;padding:12px;font-size:15px;font-weight:bold;border-radius:10px;background:linear-gradient(135deg,rgba(255,215,0,0.3),rgba(255,215,0,0.1));color:white;border:2px solid rgba(255,215,0,0.6);cursor:pointer;">WASD</button>
          <button id="btnArrows" onclick="window._setControl('arrows')"
            style="flex:1;padding:12px;font-size:15px;font-weight:bold;border-radius:10px;background:rgba(255,255,255,0.05);color:white;border:2px solid rgba(255,255,255,0.2);cursor:pointer;">⬆️ Setas</button>
        </div>
        <input id="startNameInput" type="text" maxlength="20" placeholder="Nome do herói..."
          style="width:100%;box-sizing:border-box;padding:14px 18px;font-size:20px;border-radius:12px;border:2px solid rgba(90,185,255,0.4);background:rgba(10,25,60,0.9);color:#ffd66b;outline:none;font-family:inherit;letter-spacing:1px;margin-bottom:14px;"/>
        <button onclick="window._startGame()"
          style="width:100%;padding:15px;font-size:18px;font-weight:bold;border-radius:12px;background:linear-gradient(135deg,#2d7fff,#1a50cc);color:white;border:none;cursor:pointer;letter-spacing:2px;box-shadow:0 4px 20px rgba(45,127,255,0.4);">
          ▶ NOVO JOGO
        </button>
      </div>
    </div>
  `;

  if (hasSaves) {
    const list = document.getElementById('savesList');
    saves.forEach(({ key, data }) => {
      const card = document.createElement('div');
      card.style.cssText = 'display:flex;align-items:center;gap:14px;background:rgba(10,25,55,0.8);border:1px solid rgba(90,185,255,0.25);border-radius:14px;padding:16px 18px;margin-bottom:10px;';
      card.innerHTML = `
        <div style="font-size:36px;">🧙</div>
        <div style="flex:1;">
          <div style="color:#ffd66b;font-size:18px;font-weight:bold;">${data.playerName}</div>
          <div style="color:#7ea8cc;font-size:13px;">Lv.${data.player?.level||1} · 🪙${data.player?.gold||0} · ⚔️${data.evolutionData?.stats?.kills||0} kills</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button data-name="${data.playerName}" style="padding:9px 18px;font-size:14px;font-weight:bold;border-radius:9px;background:linear-gradient(135deg,#2d7fff,#1a50cc);color:white;border:none;cursor:pointer;">▶ Continuar</button>
          <button data-key="${key}" style="padding:6px 12px;font-size:12px;border-radius:9px;background:rgba(180,30,30,0.3);color:#ff7777;border:1px solid rgba(180,30,30,0.5);cursor:pointer;">🗑 Deletar</button>
        </div>
      `;
      const [continueBtn, deleteBtn] = card.querySelectorAll('button');
      continueBtn.onclick = () => launchGame(data.playerName, true);
      deleteBtn.onclick   = () => { if (confirm(`Deletar ${data.playerName}?`)) { deleteSave(key); renderStartScreen(); } };
      list.appendChild(card);
    });
  }

  // Controle padrão = wasd
  state.controlMode = 'wasd';
  window._setControl = (mode) => { state.controlMode = mode; };
  window._startGame  = () => {
    const name = (document.getElementById('startNameInput')?.value || '').trim();
    if (!name) { alert('Digite o nome do herói!'); return; }
    launchGame(name, false);
  };
}

// ── LANÇAR JOGO ───────────────────────────────────────────────────────────────
function launchGame(playerName, loadSave) {
  state.playerName = playerName;

  if (startOverlay) { startOverlay.remove(); startOverlay = null; }

  // Inicializa sistemas gráficos
  initScene();
  buildHero();

  // Inicializa sistemas de progresso
  initAchievements();
  initQuests();

  // Carrega save se existir
  if (loadSave) {
    const saveData = loadGame(playerName);
    if (saveData) applySaveData(saveData);
  } else {
    resetPlayer();
    state.player.name = playerName;
  }

  applyEquipVisual();

  // Inicializa input
  initInput();
  initJoystick();

  // Inicializa UI
  initHUD();
  initUIManager();

  // Expõe funções globais para onclick no HTML
  exposeGlobals();

  // Setup eventos globais (teclado de atalho)
  setupKeyboardShortcuts();

  // Registra handler de morte do player
  EventBus.on('player:die', onPlayerDie);

  // Spawn inicial
  for (let i = 0; i < 5; i++) spawnMonster();

  updateBars();

  // Inicia loop
  startGameLoop();

  log(`<span style='color:cyan'>⚔️ Bem-vindo, ${playerName}!</span>`);
}

function applySaveData(save) {
  if (save.player)    Object.assign(state.player, save.player);
  if (save.inventory) state.inventory = save.inventory;
  if (save.equipped)  Object.assign(state.equipped, save.equipped);
  if (save.controlMode) state.controlMode = save.controlMode;
  if (save.currentBiome !== undefined) state.currentBiome = save.currentBiome;
  if (save.evolutionData) {
    state.evolution.totalXP    = save.evolutionData.totalXP || 0;
    state.evolution.skillPoints = save.evolutionData.skillPoints || 0;
    if (save.evolutionData.stats) Object.assign(state.evolution.stats, save.evolutionData.stats);
    (save.evolutionData.achievements || []).forEach(s => {
      const a = state.evolution.achievements.find(a => a.id === s.id);
      if (a) a.unlocked = s.unlocked;
    });
    (save.evolutionData.quests || []).forEach(s => {
      const q = state.evolution.quests.find(q => q.id === s.id);
      if (q) { q.progress = s.progress; q.completed = s.completed; }
    });
  }
}

function onPlayerDie() {
  playSound('die');
  log("<span style='color:red'>💀 Você morreu!</span>");
  state.gamePaused = true;
  setTimeout(() => {
    if (confirm('Você morreu! Reiniciar?')) {
      resetPlayer();
      state.player.name = state.playerName;
      applyEquipVisual();
      updateBars();
      state.gamePaused = false;
    }
  }, 500);
}

function setupKeyboardShortcuts() {
  window.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'v' || k === 'i')  toggleInventory();
    if (k === 'b')               toggleShop();
    if (k === 'n')               toggleEvolution();
    if (k === 'escape')          closeAllMenus();
    if (k === 'm')               import('./ui/Minimap.js').then(m => m.toggleFullMap());
    if (k === 'tab') { e.preventDefault(); /* quickswap */ }
    if (k === ' ')   { e.preventDefault(); import('./combat/AttackSystem.js').then(m => m.basicAttack()); }
    if (k === 'z')   import('./combat/SkillSystem.js').then(m => m.castFireball());
    if (k === 'x')   import('./combat/SkillSystem.js').then(m => m.castAOE());
    if (k === 'c')   import('./combat/SkillSystem.js').then(m => m.doDash());
    if (k === 'f')   import('./combat/SkillSystem.js').then(m => m.doShield());
    if (k === 'p')   togglePause();
  });
}

function exposeGlobals() {
  // Usado pelos onclicks no HTML
  window.toggleInventory  = toggleInventory;
  window.toggleShop       = toggleShop;
  window.toggleEvolution  = toggleEvolution;
  window.togglePause      = togglePause;
  window.closeAllMenus    = closeAllMenus;
  window.toggleMobileMenu = toggleMobileMenu;
  window.switchMobileTab  = (tab, e) => { if(e) e.preventDefault(); import('./ui/UIManager.js').then(m => m.switchMobileTab(tab)); };
  window.basicAttack      = () => import('./combat/AttackSystem.js').then(m => m.basicAttack());
  window.castFireball     = () => import('./combat/SkillSystem.js').then(m => m.castFireball());
  window.castAOE          = () => import('./combat/SkillSystem.js').then(m => m.castAOE());
  window.doDash           = () => import('./combat/SkillSystem.js').then(m => m.doDash());
  window.doShield         = () => import('./combat/SkillSystem.js').then(m => m.doShield());
}

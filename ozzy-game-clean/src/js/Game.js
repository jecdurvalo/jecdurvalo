/**
 * Game - Classe Principal do Jogo
 * Responsabilidade: orquestrar todas as entidades e gerenciar o game loop
 */

import CONFIG from './core/config.js';
import InputHandler from './input/InputHandler.js';
import Player from './entities/Player.js';
import CollisionHandler from './core/CollisionHandler.js';
import LevelManager from './core/LevelManager.js';

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Componentes
        this.inputHandler = new InputHandler();
        
        // Setup inicial (resize antes de criar LevelManager)
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // LevelManager precisa da altura do canvas
        this.levelManager = new LevelManager(this.canvas.height);
        
        // Estado do jogo
        this.gameState = CONFIG.STATES.START;
        this.currentLevelIdx = 0;
        this.score = 0;
        this.lives = 3;
        this.frames = 0;
        this.cameraX = 0;
        
        // Entidades
        this.player = null;
        this.platforms = [];
        this.enemies = [];
        this.coins = [];
        this.flag = null;
        this.boss = null;
        
        // Elementos da UI
        this.ui = {
            score: document.getElementById('score-hud'),
            level: document.getElementById('level-hud'),
            lives: document.getElementById('lives-hud'),
            startScreen: document.getElementById('start-screen'),
            instructionsScreen: document.getElementById('instructions-screen'),
            pauseScreen: document.getElementById('pause-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            winScreen: document.getElementById('win-screen'),
            finalScore: document.getElementById('final-score'),
            pauseBtn: document.getElementById('pause-btn'),
        };

        // Setup inicial
        this.setupTouchControls();
        this.setupButtonListeners();
    }

    /**
     * Configura listeners de todos os botões das telas
     */
    setupButtonListeners() {
        // Botão Iniciar
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.start());
        }

        // Botão Instruções
        const instructionsBtn = document.getElementById('instructions-btn');
        if (instructionsBtn) {
            instructionsBtn.addEventListener('click', () => this.showInstructions());
        }

        // Botão Voltar das instruções
        const backFromInstructions = document.getElementById('back-from-instructions');
        if (backFromInstructions) {
            backFromInstructions.addEventListener('click', () => this.hideInstructions());
        }

        // Botões de Retry/Play Again
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.reset());
        }

        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.reset());
        }

        // Botões de Menu
        const menuButtons = document.querySelectorAll('.btn-menu');
        menuButtons.forEach(btn => {
            btn.addEventListener('click', () => this.goToMenu());
        });

        // Botões de Pausa
        const resumeBtn = document.getElementById('resume-btn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => this.resume());
        }

        const quitBtn = document.getElementById('quit-btn');
        if (quitBtn) {
            quitBtn.addEventListener('click', () => this.quitToMenu());
        }

        // Botão de Pause na UI
        if (this.ui.pauseBtn) {
            this.ui.pauseBtn.addEventListener('click', () => this.pause());
        }
    }

    /**
     * Configura controles de touch para mobile
     */
    setupTouchControls() {
        this.inputHandler.setupTouchButton('btn-left', 'left');
        this.inputHandler.setupTouchButton('btn-right', 'right');
        this.inputHandler.setupTouchButton('btn-jump', 'up');
    }

    /**
     * Ajusta tamanho do canvas
     */
    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    /**
     * Mostra tela de instruções
     */
    showInstructions() {
        this.hideAllScreens();
        this.ui.instructionsScreen.style.display = 'flex';
    }

    /**
     * Esconde tela de instruções
     */
    hideInstructions() {
        this.ui.instructionsScreen.style.display = 'none';
        this.ui.startScreen.style.display = 'flex';
    }

    /**
     * Esconde todas as telas
     */
    hideAllScreens() {
        this.ui.startScreen.style.display = 'none';
        this.ui.instructionsScreen.style.display = 'none';
        this.ui.pauseScreen.style.display = 'none';
        this.ui.gameOverScreen.style.display = 'none';
        this.ui.winScreen.style.display = 'none';
    }

    /**
     * Inicia o jogo
     */
    start() {
        this.hideAllScreens();
        this.loadLevel(0);
        this.gameState = CONFIG.STATES.PLAYING;
        this.ui.pauseBtn.style.display = 'flex';
        this.gameLoop();
    }

    /**
     * Carrega um nível específico
     * @param {number} levelIndex 
     */
    loadLevel(levelIndex) {
        const levelData = this.levelManager.loadLevel(levelIndex);
        
        if (!levelData) {
            this.win();
            return;
        }

        this.currentLevelIdx = levelIndex;
        this.platforms = levelData.platforms;
        this.enemies = levelData.enemies;
        this.coins = levelData.coins;
        this.flag = levelData.flag;
        this.boss = levelData.boss;
        
        // Posição inicial do jogador
        const startPos = levelData.playerStart || { x: 50, y: 350 };
        this.player = new Player(startPos.x, startPos.y);
        
        // Reset da câmera
        this.cameraX = 0;
        
        // Atualiza UI
        this.ui.level.innerText = `FASE: ${levelIndex + 1}`;
    }

    /**
     * Avança para próximo nível
     */
    nextLevel() {
        this.loadLevel(this.currentLevelIdx + 1);
    }

    /**
     * Reinicia o jogo completo
     */
    reset() {
        this.score = 0;
        this.lives = 3;
        this.currentLevelIdx = 0;
        
        this.updateUI();
        
        this.hideAllScreens();
        
        this.loadLevel(0);
        this.gameState = CONFIG.STATES.PLAYING;
        this.ui.pauseBtn.style.display = 'flex';
        this.gameLoop();
    }

    /**
     * Vai para o menu principal
     */
    goToMenu() {
        this.hideAllScreens();
        this.ui.startScreen.style.display = 'flex';
        this.ui.pauseBtn.style.display = 'none';
        this.gameState = CONFIG.STATES.START;
    }

    /**
     * Sai do jogo atual e volta ao menu
     */
    quitToMenu() {
        this.goToMenu();
    }

    /**
     * Pausa o jogo
     */
    pause() {
        if (this.gameState === CONFIG.STATES.PLAYING) {
            this.gameState = CONFIG.STATES.PAUSED;
            this.hideAllScreens();
            this.ui.pauseScreen.style.display = 'flex';
        }
    }

    /**
     * Retoma o jogo após pausa
     */
    resume() {
        if (this.gameState === CONFIG.STATES.PAUSED) {
            this.gameState = CONFIG.STATES.PLAYING;
            this.hideAllScreens();
            this.ui.pauseBtn.style.display = 'flex';
            this.gameLoop();
        }
    }

    /**
     * Processa dano ao jogador
     * @param {number} amount 
     */
    takeDamage(amount) {
        this.lives -= amount;
        this.updateUI();

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Respawn no início da fase
            this.player.setInvincible(CONFIG.PLAYER.INVINCIBLE_FRAMES);
            this.loadLevel(this.currentLevelIdx);
        }
    }

    /**
     * Game Over
     */
    gameOver() {
        this.gameState = CONFIG.STATES.GAMEOVER;
        this.hideAllScreens();
        this.ui.gameOverScreen.style.display = 'flex';
        this.ui.pauseBtn.style.display = 'none';
    }

    /**
     * Vitória do jogo
     */
    win() {
        this.gameState = CONFIG.STATES.WIN;
        this.ui.finalScore.innerText = this.score;
        this.hideAllScreens();
        this.ui.winScreen.style.display = 'flex';
        this.ui.pauseBtn.style.display = 'none';
    }

    /**
     * Atualiza elementos da UI
     */
    updateUI() {
        this.ui.score.innerText = `MOEDAS: ${this.score}`;
        this.ui.lives.innerText = `VIDAS: ${this.lives}`;
    }

    /**
     * Atualiza lógica do jogo
     */
    update() {
        // Input de pulo
        if (this.inputHandler.isJumpPressed()) {
            this.player.jump();
        }

        // Atualiza jogador
        this.player.update(this.inputHandler);

        // Colisões com plataformas
        CollisionHandler.handlePlatformCollisions(this.player, this.platforms);

        // Verifica se caiu do mapa
        if (CollisionHandler.checkFallenOffMap(this.player, this.canvas.height)) {
            this.takeDamage(3); // Morte instantânea
            return;
        }

        // Colisões com inimigos
        CollisionHandler.handleEnemyCollisions(
            this.player,
            this.enemies,
            (enemy) => {
                this.score += CONFIG.SCORING.ENEMY_KILL_BONUS;
                this.updateUI();
            },
            () => this.takeDamage(1)
        );

        // Remove inimigos mortos
        this.enemies = this.enemies.filter(e => !e.dead);

        // Colisão com boss
        if (this.boss) {
            CollisionHandler.handleBossCollision(
                this.player,
                this.boss,
                (boss, killed) => {
                    if (killed) {
                        this.score += 100; // Bônus por derrotar boss
                        this.updateUI();
                    }
                },
                () => this.takeDamage(1)
            );
        }

        // Coleta de moedas
        CollisionHandler.handleCoinCollection(
            this.player,
            this.coins,
            (coin, value) => {
                this.score += value;
                this.updateUI();
            }
        );

        // Verifica vitória da fase
        if (CollisionHandler.checkFlagCollision(this.player, this.flag)) {
            this.nextLevel();
        }

        // Atualiza câmera
        this.updateCamera();

        // Atualiza moedas (animação)
        this.coins.forEach(coin => coin.update(this.frames));

        // Atualiza boss
        if (this.boss) {
            this.boss.update();
        }
    }

    /**
     * Atualiza posição da câmera
     */
    updateCamera() {
        const targetX = this.player.x - this.canvas.width / 3;
        
        // Câmera segue suavemente o jogador (apenas para direita)
        if (targetX > this.cameraX) {
            this.cameraX += (targetX - this.cameraX) * 0.1;
        }
        
        // Limita câmera ao início do nível
        if (this.cameraX < 0) {
            this.cameraX = 0;
        }
    }

    /**
     * Renderiza o jogo
     */
    draw() {
        // Limpa tela
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Desenha fundo
        this.drawBackground();

        // Desenha entidades
        this.flag?.draw(this.ctx, this.cameraX, this.frames);
        this.platforms.forEach(p => p.draw(this.ctx, this.cameraX));
        this.coins.forEach(c => c.draw(this.ctx, this.cameraX, this.frames));
        this.enemies.forEach(e => {
            e.update();
            e.draw(this.ctx, this.cameraX, this.frames);
        });

        // Desenha boss
        if (this.boss) {
            this.boss.draw(this.ctx, this.cameraX, this.frames);
        }

        // Desenha jogador
        this.player.draw(this.ctx, this.cameraX, this.frames);
    }

    /**
     * Desenha fundo decorativo
     */
    drawBackground() {
        // Nuvens com parallax
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        const cloudOffset = this.cameraX * 0.5;

        this.ctx.beginPath();
        this.ctx.arc(100 - cloudOffset % 1000, 100, 40, 0, Math.PI * 2);
        this.ctx.arc(150 - cloudOffset % 1000, 120, 50, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(600 - cloudOffset % 1000, 80, 60, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(900 - cloudOffset % 1000, 150, 45, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Game Loop principal
     */
    gameLoop() {
        if (this.gameState !== CONFIG.STATES.PLAYING) {
            return;
        }

        this.update();
        this.draw();

        this.frames++;
        requestAnimationFrame(() => this.gameLoop());
    }
}

export default Game;

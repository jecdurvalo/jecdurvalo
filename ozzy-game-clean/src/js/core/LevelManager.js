/**
 * LevelManager - Gerencia carregamento e dados dos níveis
 * Responsabilidade única: fornecer configurações de cada fase
 */

import Platform from '../entities/Platform.js';
import Enemy from '../entities/Enemy.js';
import Coin from '../entities/Coin.js';
import Flag from '../entities/Flag.js';
import Boss from '../entities/Boss.js';
import CONFIG from '../core/config.js';

class LevelManager {
    constructor() {
        this.levels = this.createLevels();
    }

    /**
     * Carrega os dados de um nível específico
     * @param {number} levelIndex 
     * @returns {Object} Dados do nível
     */
    loadLevel(levelIndex) {
        if (levelIndex >= this.levels.length) {
            return null;
        }
        return this.levels[levelIndex];
    }

    /**
     * Verifica se nível tem boss
     * @param {number} levelIndex 
     * @returns {boolean}
     */
    hasBoss(levelIndex) {
        return CONFIG.LEVELS.BOSS_LEVELS.includes(levelIndex + 1);
    }

    /**
     * Cria todos os 12 níveis do jogo
     * @returns {Array} Array de configurações de níveis
     */
    createLevels() {
        const levels = [];

        // Nível 1 - Tutorial
        levels.push({
            platforms: [
                new Platform(0, 450, 300, 90),
                new Platform(350, 400, 200, 30),
                new Platform(600, 350, 200, 30),
                new Platform(850, 450, 300, 90),
            ],
            enemies: [
                new Enemy(400, 370, 'spider', 0),
            ],
            coins: [
                new Coin(400, 350),
                new Coin(450, 350),
                new Coin(650, 300),
                new Coin(700, 300),
            ],
            flag: new Flag(1050, 350),
            boss: null,
            playerStart: { x: 50, y: 350 },
        });

        // Nível 2
        levels.push({
            platforms: [
                new Platform(0, 450, 200, 90),
                new Platform(250, 400, 150, 30),
                new Platform(450, 350, 150, 30),
                new Platform(650, 300, 150, 30),
                new Platform(850, 450, 200, 90),
            ],
            enemies: [
                new Enemy(270, 370, 'spider', 1),
                new Enemy(500, 320, 'bat', 1),
            ],
            coins: [
                new Coin(300, 370),
                new Coin(500, 320),
                new Coin(700, 270),
            ],
            flag: new Flag(950, 350),
            boss: null,
            playerStart: { x: 50, y: 350 },
        });

        // Nível 3
        levels.push({
            platforms: [
                new Platform(0, 450, 150, 90),
                new Platform(200, 400, 100, 30),
                new Platform(350, 350, 100, 30),
                new Platform(500, 300, 100, 30),
                new Platform(650, 250, 100, 30),
                new Platform(800, 450, 200, 90),
            ],
            enemies: [
                new Enemy(220, 370, 'spider', 2),
                new Enemy(520, 270, 'bat', 2),
                new Enemy(700, 220, 'bat', 2),
            ],
            coins: [
                new Coin(230, 370),
                new Coin(380, 320),
                new Coin(530, 270),
                new Coin(680, 220),
            ],
            flag: new Flag(900, 350),
            boss: null,
            playerStart: { x: 50, y: 350 },
        });

        // Nível 4
        levels.push({
            platforms: [
                new Platform(0, 450, 200, 90),
                new Platform(250, 400, 120, 30),
                new Platform(420, 350, 120, 30),
                new Platform(590, 400, 120, 30),
                new Platform(760, 350, 120, 30),
                new Platform(930, 450, 150, 90),
            ],
            enemies: [
                new Enemy(280, 370, 'spider', 3),
                new Enemy(450, 320, 'spider', 3),
                new Enemy(620, 370, 'bat', 3),
            ],
            coins: [
                new Coin(300, 370),
                new Coin(470, 320),
                new Coin(640, 370),
                new Coin(810, 320),
            ],
            flag: new Flag(1000, 350),
            boss: null,
            playerStart: { x: 50, y: 350 },
        });

        // Nível 5 - BOSS 1
        levels.push({
            platforms: [
                new Platform(0, 450, 1000, 90),
                new Platform(200, 350, 150, 30),
                new Platform(500, 350, 150, 30),
                new Platform(800, 350, 150, 30),
            ],
            enemies: [
                new Enemy(300, 420, 'spider', 4),
                new Enemy(600, 420, 'spider', 4),
            ],
            coins: [
                new Coin(250, 320),
                new Coin(550, 320),
                new Coin(850, 320),
            ],
            flag: new Flag(900, 350),
            boss: new Boss(700, 300),
            playerStart: { x: 50, y: 350 },
        });

        // Nível 6
        levels.push({
            platforms: [
                new Platform(0, 450, 150, 90),
                new Platform(200, 400, 100, 30),
                new Platform(350, 350, 100, 30),
                new Platform(500, 300, 100, 30),
                new Platform(650, 250, 100, 30),
                new Platform(800, 200, 100, 30),
                new Platform(950, 450, 150, 90),
            ],
            enemies: [
                new Enemy(220, 370, 'bat', 5),
                new Enemy(400, 320, 'bat', 5),
                new Enemy(550, 270, 'bat', 5),
                new Enemy(700, 220, 'bat', 5),
            ],
            coins: [
                new Coin(230, 370),
                new Coin(380, 320),
                new Coin(530, 270),
                new Coin(680, 220),
                new Coin(830, 170),
            ],
            flag: new Flag(1050, 350),
            boss: null,
            playerStart: { x: 50, y: 350 },
        });

        // Nível 7
        levels.push({
            platforms: [
                new Platform(0, 450, 200, 90),
                new Platform(250, 400, 150, 30),
                new Platform(450, 350, 150, 30),
                new Platform(650, 400, 150, 30),
                new Platform(850, 350, 150, 30),
                new Platform(1050, 450, 150, 90),
            ],
            enemies: [
                new Enemy(280, 370, 'spider', 6),
                new Enemy(500, 320, 'spider', 6),
                new Enemy(700, 370, 'bat', 6),
                new Enemy(900, 320, 'bat', 6),
            ],
            coins: [
                new Coin(300, 370),
                new Coin(500, 320),
                new Coin(700, 370),
                new Coin(900, 320),
            ],
            flag: new Flag(1150, 350),
            boss: null,
            playerStart: { x: 50, y: 350 },
        });

        // Nível 8
        levels.push({
            platforms: [
                new Platform(0, 450, 100, 90),
                new Platform(150, 400, 80, 30),
                new Platform(280, 350, 80, 30),
                new Platform(410, 300, 80, 30),
                new Platform(540, 250, 80, 30),
                new Platform(670, 200, 80, 30),
                new Platform(800, 250, 80, 30),
                new Platform(930, 300, 80, 30),
                new Platform(1060, 450, 150, 90),
            ],
            enemies: [
                new Enemy(170, 370, 'bat', 7),
                new Enemy(300, 320, 'bat', 7),
                new Enemy(430, 270, 'bat', 7),
                new Enemy(560, 220, 'bat', 7),
                new Enemy(690, 170, 'bat', 7),
            ],
            coins: [
                new Coin(180, 370),
                new Coin(310, 320),
                new Coin(440, 270),
                new Coin(570, 220),
                new Coin(700, 170),
                new Coin(830, 220),
                new Coin(960, 270),
            ],
            flag: new Flag(1160, 350),
            boss: null,
            playerStart: { x: 50, y: 350 },
        });

        // Nível 9
        levels.push({
            platforms: [
                new Platform(0, 450, 250, 90),
                new Platform(300, 400, 100, 30),
                new Platform(450, 350, 100, 30),
                new Platform(600, 300, 100, 30),
                new Platform(750, 350, 100, 30),
                new Platform(900, 400, 100, 30),
                new Platform(1050, 450, 200, 90),
            ],
            enemies: [
                new Enemy(330, 370, 'spider', 8),
                new Enemy(480, 320, 'spider', 8),
                new Enemy(630, 270, 'bat', 8),
                new Entity(780, 320, 'bat', 8),
                new Enemy(930, 370, 'spider', 8),
            ],
            coins: [
                new Coin(340, 370),
                new Coin(490, 320),
                new Coin(640, 270),
                new Coin(790, 320),
                new Coin(940, 370),
            ],
            flag: new Flag(1150, 350),
            boss: null,
            playerStart: { x: 50, y: 350 },
        });

        // Nível 10 - BOSS 2
        levels.push({
            platforms: [
                new Platform(0, 450, 1000, 90),
                new Platform(150, 350, 120, 30),
                new Platform(350, 300, 120, 30),
                new Platform(550, 350, 120, 30),
                new Platform(750, 300, 120, 30),
            ],
            enemies: [
                new Enemy(200, 420, 'spider', 9),
                new Enemy(400, 420, 'spider', 9),
                new Enemy(600, 420, 'bat', 9),
            ],
            coins: [
                new Coin(200, 320),
                new Coin(400, 270),
                new Coin(600, 320),
                new Coin(800, 270),
            ],
            flag: new Flag(900, 350),
            boss: new Boss(650, 250),
            playerStart: { x: 50, y: 350 },
        });

        // Nível 11
        levels.push({
            platforms: [
                new Platform(0, 450, 100, 90),
                new Platform(150, 400, 80, 30),
                new Platform(280, 350, 80, 30),
                new Platform(410, 300, 80, 30),
                new Platform(540, 250, 80, 30),
                new Platform(670, 200, 80, 30),
                new Platform(800, 150, 80, 30),
                new Platform(930, 100, 80, 30),
                new Platform(1060, 450, 150, 90),
            ],
            enemies: [
                new Enemy(170, 370, 'bat', 10),
                new Enemy(300, 320, 'bat', 10),
                new Enemy(430, 270, 'bat', 10),
                new Enemy(560, 220, 'bat', 10),
                new Enemy(690, 170, 'bat', 10),
                new Enemy(820, 120, 'bat', 10),
            ],
            coins: [
                new Coin(180, 370),
                new Coin(310, 320),
                new Coin(440, 270),
                new Coin(570, 220),
                new Coin(700, 170),
                new Coin(830, 120),
                new Coin(960, 70),
            ],
            flag: new Flag(1160, 350),
            boss: null,
            playerStart: { x: 50, y: 350 },
        });

        // Nível 12 - Final
        levels.push({
            platforms: [
                new Platform(0, 450, 150, 90),
                new Platform(200, 400, 100, 30),
                new Platform(350, 350, 100, 30),
                new Platform(500, 300, 100, 30),
                new Platform(650, 250, 100, 30),
                new Platform(800, 200, 100, 30),
                new Platform(950, 150, 100, 30),
                new Platform(1100, 450, 200, 90),
            ],
            enemies: [
                new Enemy(220, 370, 'spider', 11),
                new Enemy(370, 320, 'bat', 11),
                new Enemy(520, 270, 'spider', 11),
                new Enemy(670, 220, 'bat', 11),
                new Enemy(820, 170, 'spider', 11),
                new Enemy(970, 120, 'bat', 11),
            ],
            coins: [
                new Coin(230, 370),
                new Coin(380, 320),
                new Coin(530, 270),
                new Coin(680, 220),
                new Coin(830, 170),
                new Coin(980, 120),
            ],
            flag: new Flag(1200, 350),
            boss: null,
            playerStart: { x: 50, y: 350 },
        });

        return levels;
    }
}

export default LevelManager;

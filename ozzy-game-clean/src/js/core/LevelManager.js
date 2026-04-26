/**
 * LevelManager - Gerencia carregamento e dados dos níveis
 * Responsabilidade única: fornecer configurações de cada fase
 * 
 * Fases baseadas no ozzy-mario.html - 15 níveis com progressão de dificuldade
 */

import Platform from '../entities/Platform.js';
import Enemy from '../entities/Enemy.js';
import Coin from '../entities/Coin.js';
import Flag from '../entities/Flag.js';
import Boss from '../entities/Boss.js';
import CONFIG from '../core/config.js';

class LevelManager {
    constructor(canvasHeight) {
        this.canvasHeight = canvasHeight;
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
     * Cria todos os 15 níveis do jogo (baseados no ozzy-mario.html)
     * @returns {Array} Array de configurações de níveis
     */
    createLevels() {
        const levels = [];
        const H = this.canvasHeight; // Altura dinâmica do canvas

        // FASE 1: Tutorial - Introdução às mecânicas básicas
        levels.push({
            platforms: [
                new Platform(0, H - 50, 500, 50),
                new Platform(580, H - 120, 180, 30),
                new Platform(850, H - 180, 180, 30),
                new Platform(1150, H - 120, 200, 30),
                new Platform(1450, H - 50, 700, 50),
            ],
            enemies: [
                new Enemy(1600, H - 90, 'spider', 0),
            ],
            coins: [
                new Coin(650, H - 160),
                new Coin(920, H - 220),
                new Coin(1230, H - 160),
                new Coin(1600, H - 90),
                new Coin(1750, H - 90),
            ],
            flag: new Flag(2000, H - 150),
            boss: null,
            playerStart: { x: 50, y: H - 150 },
        });

        // FASE 2: Primeiros desafios com morcegos
        levels.push({
            platforms: [
                new Platform(0, H - 50, 500, 50),
                new Platform(550, H - 140, 120, 30),
                new Platform(780, H - 220, 120, 30),
                new Platform(1020, H - 140, 120, 30),
                new Platform(1300, H - 50, 900, 50),
            ],
            enemies: [
                new Enemy(1400, H - 90, 'spider', 1),
                new Enemy(1550, H - 90, 'spider', 1),
                new Enemy(1000, H - 320, 'bat', 1),
            ],
            coins: [
                new Coin(590, H - 180),
                new Coin(820, H - 260),
                new Coin(1060, H - 180),
                new Coin(1500, H - 90),
                new Coin(1650, H - 90),
            ],
            flag: new Flag(2050, H - 150),
            boss: null,
            playerStart: { x: 50, y: H - 150 },
        });

        // FASE 3: Plataformas móveis e mais inimigos
        levels.push({
            platforms: [
                new Platform(0, H - 50, 500, 50),
                new Platform(500, H - 170, 100, 30),
                new Platform(720, H - 270, 100, 30),
                new Platform(940, H - 170, 100, 30),
                new Platform(1160, H - 270, 100, 30),
                new Platform(1400, H - 50, 700, 50),
            ],
            enemies: [
                new Enemy(1500, H - 90, 'spider', 2),
                new Enemy(1680, H - 90, 'spider', 2),
                new Enemy(800, H - 370, 'bat', 2),
                new Enemy(1050, H - 370, 'bat', 2),
            ],
            coins: [
                new Coin(530, H - 210),
                new Coin(750, H - 310),
                new Coin(970, H - 210),
                new Coin(1190, H - 310),
                new Coin(1600, H - 90),
                new Coin(1750, H - 90),
            ],
            flag: new Flag(1950, H - 150),
            boss: null,
            playerStart: { x: 50, y: H - 150 },
        });

        // FASE 4: Escadinha acessível - Estilo Mario clássico
        levels.push({
            platforms: [
                new Platform(0, H - 50, 300, 50),
                new Platform(280, H - 180, 140, 30),
                new Platform(520, H - 280, 140, 30),
                new Platform(760, H - 200, 140, 30),
                new Platform(1000, H - 300, 140, 30),
                new Platform(1240, H - 150, 400, 50),
            ],
            enemies: [
                new Enemy(1290, H - 190, 'spider', 3),
                new Enemy(1440, H - 190, 'spider', 3),
                new Enemy(600, H - 400, 'bat', 3),
                new Enemy(900, H - 400, 'bat', 3),
            ],
            coins: [
                new Coin(330, H - 220),
                new Coin(570, H - 320),
                new Coin(810, H - 240),
                new Coin(1050, H - 340),
                new Coin(1340, H - 190),
                new Coin(1440, H - 190),
                new Coin(1540, H - 190),
            ],
            flag: new Flag(1550, H - 250),
            boss: null,
            playerStart: { x: 50, y: H - 150 },
        });

        // FASE 5: Progressão natural - Gaps moderados
        levels.push({
            platforms: [
                new Platform(0, H - 50, 250, 50),
                new Platform(280, H - 170, 130, 30),
                new Platform(500, H - 270, 130, 30),
                new Platform(720, H - 190, 130, 30),
                new Platform(940, H - 290, 130, 30),
                new Platform(1160, H - 210, 130, 30),
                new Platform(1380, H - 120, 130, 30),
                new Platform(1600, H - 50, 400, 50),
            ],
            enemies: [
                new Enemy(1650, H - 90, 'spider', 4),
                new Enemy(1800, H - 90, 'spider', 4),
                new Enemy(600, H - 390, 'bat', 4),
                new Enemy(1050, H - 410, 'bat', 4),
            ],
            coins: [
                new Coin(320, H - 210),
                new Coin(540, H - 310),
                new Coin(760, H - 230),
                new Coin(980, H - 330),
                new Coin(1200, H - 250),
                new Coin(1420, H - 160),
                new Coin(1700, H - 90),
                new Coin(1850, H - 90),
            ],
            flag: new Flag(1900, H - 150),
            boss: null,
            playerStart: { x: 50, y: H - 150 },
        });

        // FASE 6: Desafio intermediário
        levels.push({
            platforms: [
                new Platform(0, H - 50, 200, 50),
                new Platform(270, H - 180, 120, 30),
                new Platform(490, H - 290, 120, 30),
                new Platform(710, H - 200, 120, 30),
                new Platform(930, H - 310, 140, 30),
                new Platform(1150, H - 220, 120, 30),
                new Platform(1370, H - 130, 120, 30),
                new Platform(1590, H - 50, 450, 50),
            ],
            enemies: [
                new Enemy(950, H - 350, 'spider', 5),
                new Enemy(1640, H - 90, 'spider', 5),
                new Enemy(1790, H - 90, 'spider', 5),
            ],
            coins: [
                new Coin(300, H - 220),
                new Coin(520, H - 330),
                new Coin(740, H - 240),
                new Coin(970, H - 350),
                new Coin(1180, H - 260),
                new Coin(1400, H - 170),
                new Coin(1690, H - 90),
                new Coin(1840, H - 90),
                new Coin(1940, H - 90),
            ],
            flag: new Flag(1940, H - 150),
            boss: null,
            playerStart: { x: 50, y: H - 150 },
        });

        // FASE 7: Dificuldade alta
        levels.push({
            platforms: [
                new Platform(0, H - 50, 180, 50),
                new Platform(250, H - 170, 110, 30),
                new Platform(450, H - 280, 110, 30),
                new Platform(650, H - 190, 110, 30),
                new Platform(850, H - 300, 120, 30),
                new Platform(1050, H - 210, 110, 30),
                new Platform(1250, H - 320, 120, 30),
                new Platform(1450, H - 230, 110, 30),
                new Platform(1650, H - 140, 110, 30),
                new Platform(1850, H - 50, 450, 50),
            ],
            enemies: [
                new Enemy(870, H - 340, 'spider', 6),
                new Enemy(1900, H - 90, 'spider', 6),
                new Enemy(2050, H - 90, 'spider', 6),
                new Enemy(2200, H - 90, 'spider', 6),
                new Enemy(350, H - 410, 'bat', 6),
                new Enemy(550, H - 430, 'bat', 6),
                new Enemy(750, H - 410, 'bat', 6),
                new Enemy(950, H - 430, 'bat', 6),
                new Enemy(1150, H - 410, 'bat', 6),
                new Enemy(1350, H - 430, 'bat', 6),
            ],
            coins: [
                new Coin(280, H - 210),
                new Coin(480, H - 320),
                new Coin(680, H - 230),
                new Coin(880, H - 340),
                new Coin(1080, H - 250),
                new Coin(1280, H - 360),
                new Coin(1480, H - 270),
                new Coin(1680, H - 180),
                new Coin(1950, H - 90),
                new Coin(2100, H - 90),
                new Coin(2200, H - 90),
            ],
            flag: new Flag(2200, H - 150),
            boss: null,
            playerStart: { x: 50, y: H - 150 },
        });

        // FASE 8: A Escalada Final (Equilibrada e Possível)
        levels.push({
            platforms: [
                new Platform(0, H - 50, 200, 50),
                new Platform(280, H - 130, 110, 30),
                new Platform(460, H - 210, 110, 30),
                new Platform(650, H - 290, 140, 30),
                new Platform(870, H - 370, 110, 30),
                new Platform(1060, H - 450, 110, 30),
                new Platform(1250, H - 370, 110, 30),
                new Platform(1440, H - 290, 110, 30),
                new Platform(1650, H - 210, 200, 30),
                new Platform(1650, H - 50, 600, 50),
            ],
            enemies: [
                new Enemy(480, H - 250, 'goomba', 7),
                new Enemy(1080, H - 490, 'goomba', 7),
                new Enemy(1800, H - 90, 'goomba', 7),
                new Enemy(2000, H - 90, 'goomba', 7),
            ],
            coins: [
                new Coin(320, H - 170),
                new Coin(700, H - 330),
                new Coin(1290, H - 410),
                new Coin(1750, H - 90),
                new Coin(1900, H - 90),
                new Coin(2050, H - 90),
            ],
            flag: new Flag(2150, H - 150),
            boss: null,
            playerStart: { x: 50, y: H - 150 },
        });

        // FASE 9: O Vale das Sombras
        levels.push({
            platforms: [
                new Platform(0, H - 50, 250, 50),
                new Platform(350, H - 120, 100, 30),
                new Platform(500, H - 200, 100, 30),
                new Platform(650, H - 280, 120, 30),
                new Platform(820, H - 200, 150, 30),
                new Platform(1020, H - 280, 100, 30),
                new Platform(1170, H - 360, 100, 30),
                new Platform(1320, H - 280, 100, 30),
                new Platform(1470, H - 200, 200, 30),
                new Platform(1720, H - 280, 90, 30),
                new Platform(1860, H - 200, 90, 30),
                new Platform(2000, H - 50, 400, 50),
            ],
            enemies: [
                new Enemy(850, H - 240, 'bat', 8),
                new Enemy(920, H - 240, 'bat', 8),
                new Enemy(1500, H - 240, 'spider', 8),
                new Enemy(1620, H - 240, 'spider', 8),
                new Enemy(2100, H - 90, 'goomba', 8),
            ],
            coins: [
                new Coin(380, H - 160),
                new Coin(530, H - 240),
                new Coin(690, H - 320),
                new Coin(880, H - 240),
                new Coin(1200, H - 400),
                new Coin(1350, H - 320),
                new Coin(1550, H - 240),
                new Coin(1750, H - 320),
                new Coin(1890, H - 240),
                new Coin(2150, H - 90),
            ],
            flag: new Flag(2300, H - 150),
            boss: null,
            playerStart: { x: 50, y: H - 150 },
        });

        // FASE 10: A Torre Invertida
        levels.push({
            platforms: [
                new Platform(0, H - 300, 150, 50),
                new Platform(250, H - 250, 100, 30),
                new Platform(400, H - 200, 100, 30),
                new Platform(550, H - 250, 100, 30),
                new Platform(700, H - 300, 100, 30),
                new Platform(850, H - 250, 120, 30),
                new Platform(1020, H - 200, 100, 30),
                new Platform(1170, H - 280, 80, 30),
                new Platform(1300, H - 360, 80, 30),
                new Platform(1430, H - 280, 80, 30),
                new Platform(1560, H - 150, 150, 30),
                new Platform(1560, H - 50, 600, 50),
            ],
            enemies: [
                new Enemy(870, H - 290, 'bat', 9),
                new Enemy(1040, H - 240, 'bat', 9),
                new Enemy(1600, H - 190, 'spider', 9),
                new Enemy(1700, H - 90, 'goomba', 9),
                new Enemy(1850, H - 90, 'goomba', 9),
                new Enemy(2000, H - 90, 'goomba', 9),
            ],
            coins: [
                new Coin(280, H - 290),
                new Coin(430, H - 240),
                new Coin(580, H - 290),
                new Coin(730, H - 340),
                new Coin(890, H - 290),
                new Coin(1050, H - 240),
                new Coin(1330, H - 400),
                new Coin(1460, H - 320),
                new Coin(1600, H - 190),
                new Coin(1750, H - 90),
                new Coin(1900, H - 90),
            ],
            flag: new Flag(2100, H - 150),
            boss: null,
            playerStart: { x: 50, y: H - 350 },
        });

        // FASE 11: O Labirinto Flutuante
        levels.push({
            platforms: [
                new Platform(0, H - 50, 150, 50),
                new Platform(250, H - 100, 80, 30),
                new Platform(380, H - 180, 80, 30),
                new Platform(510, H - 260, 80, 30),
                new Platform(640, H - 180, 80, 30),
                new Platform(770, H - 100, 80, 30),
                new Platform(920, H - 100, 150, 30),
                new Platform(1120, H - 180, 70, 30),
                new Platform(1240, H - 260, 70, 30),
                new Platform(1360, H - 180, 70, 30),
                new Platform(1480, H - 100, 70, 30),
                new Platform(1620, H - 100, 120, 30),
                new Platform(1790, H - 180, 80, 30),
                new Platform(1920, H - 260, 80, 30),
                new Platform(2050, H - 180, 80, 30),
                new Platform(2200, H - 50, 400, 50),
            ],
            enemies: [
                new Enemy(950, H - 140, 'spider', 10),
                new Enemy(1020, H - 140, 'bat', 10),
                new Enemy(2300, H - 90, 'goomba', 10),
                new Enemy(2450, H - 90, 'goomba', 10),
            ],
            coins: [
                new Coin(270, H - 140),
                new Coin(400, H - 220),
                new Coin(530, H - 300),
                new Coin(660, H - 220),
                new Coin(790, H - 140),
                new Coin(970, H - 140),
                new Coin(1140, H - 220),
                new Coin(1260, H - 300),
                new Coin(1380, H - 220),
                new Coin(1500, H - 140),
                new Coin(1670, H - 140),
                new Coin(1810, H - 220),
                new Coin(1940, H - 300),
                new Coin(2070, H - 220),
                new Coin(2350, H - 90),
            ],
            flag: new Flag(2500, H - 150),
            boss: null,
            playerStart: { x: 50, y: H - 150 },
        });

        // FASE 12: A Caverna do Boss - Ozzy vs Dark Bat
        levels.push({
            platforms: [
                new Platform(0, H - 50, 2400, 50),
                new Platform(200, H - 150, 150, 30),
                new Platform(450, H - 250, 120, 30),
                new Platform(700, H - 150, 150, 30),
                new Platform(1000, H - 250, 200, 30),
                new Platform(1300, H - 150, 150, 30),
                new Platform(1550, H - 250, 120, 30),
                new Platform(1800, H - 150, 150, 30),
            ],
            enemies: [
                new Enemy(1600, H - 90, 'bat', 11),
            ],
            coins: [
                new Coin(250, H - 190),
                new Coin(500, H - 290),
                new Coin(750, H - 190),
                new Coin(1050, H - 290),
                new Coin(1350, H - 190),
                new Coin(1600, H - 290),
                new Coin(1850, H - 190),
            ],
            flag: new Flag(2300, H - 150, false),
            boss: new Boss(1200, H - 150),
            playerStart: { x: 50, y: H - 150 },
        });

        // FASE 13: A Ponte Quebrada
        levels.push({
            platforms: [
                new Platform(0, H - 50, 200, 50),
                new Platform(300, H - 100, 150, 30),
                new Platform(500, H - 150, 120, 30),
                new Platform(670, H - 100, 150, 30),
                new Platform(870, H - 50, 180, 50),
                new Platform(1100, H - 100, 100, 30),
                new Platform(1250, H - 180, 100, 30),
                new Platform(1400, H - 100, 100, 30),
                new Platform(1550, H - 180, 100, 30),
                new Platform(1700, H - 100, 150, 30),
                new Platform(1900, H - 50, 600, 50),
            ],
            enemies: [
                new Enemy(520, H - 190, 'bat', 12),
                new Enemy(1270, H - 220, 'bat', 12),
                new Enemy(1570, H - 220, 'bat', 12),
                new Enemy(1750, H - 140, 'spider', 12),
                new Enemy(2000, H - 90, 'goomba', 12),
                new Enemy(2150, H - 90, 'goomba', 12),
                new Enemy(2300, H - 90, 'spider', 12),
            ],
            coins: [
                new Coin(920, H - 90),
                new Coin(970, H - 90),
                new Coin(1020, H - 90),
                new Coin(1150, H - 140),
                new Coin(1300, H - 220),
                new Coin(1450, H - 140),
                new Coin(1600, H - 220),
                new Coin(2050, H - 90),
                new Coin(2200, H - 90),
                new Coin(2350, H - 90),
                new Coin(2400, H - 150),
            ],
            flag: new Flag(2450, H - 150),
            boss: null,
            playerStart: { x: 50, y: H - 150 },
        });

        // FASE 14: A Torre Invertida (Descendente)
        levels.push({
            platforms: [
                new Platform(50, 100, 200, 50),
                new Platform(300, 150, 120, 40),
                new Platform(470, 220, 120, 40),
                new Platform(640, 290, 120, 40),
                new Platform(810, 360, 120, 40),
                new Platform(980, 400, 200, 40),
                new Platform(1230, 320, 100, 30),
                new Platform(1380, 250, 100, 30),
                new Platform(1530, 180, 100, 30),
                new Platform(1680, 120, 100, 30),
                new Platform(1830, 150, 150, 40),
                new Platform(2030, 200, 90, 30),
                new Platform(2170, 280, 90, 30),
                new Platform(2310, 360, 90, 30),
                new Platform(2450, H - 50, 400, 50),
            ],
            enemies: [
                new Enemy(490, 180, 'spider', 13),
                new Enemy(660, 250, 'spider', 13),
                new Enemy(1050, 360, 'bat', 13),
                new Enemy(1150, 360, 'bat', 13),
                new Enemy(1400, 210, 'spider', 13),
                new Enemy(1550, 140, 'bat', 13),
                new Enemy(1880, 110, 'spider', 13),
                new Enemy(2550, H - 90, 'goomba', 13),
                new Enemy(2700, H - 90, 'goomba', 13),
            ],
            coins: [
                new Coin(150, 60),
                new Coin(350, 110),
                new Coin(520, 180),
                new Coin(690, 250),
                new Coin(860, 320),
                new Coin(1030, 360),
                new Coin(1130, 360),
                new Coin(1280, 280),
                new Coin(1430, 210),
                new Coin(1580, 140),
                new Coin(1730, 80),
                new Coin(2075, 160),
                new Coin(2215, 240),
                new Coin(2355, 320),
                new Coin(2600, H - 90),
                new Coin(2750, H - 90),
            ],
            flag: new Flag(2800, H - 150),
            boss: null,
            playerStart: { x: 50, y: 50 },
        });

        // FASE 15: O Boss Final - Ozzy vs Shadow King
        levels.push({
            platforms: [
                new Platform(0, H - 50, 3000, 50),
                new Platform(300, H - 150, 150, 30),
                new Platform(600, H - 250, 150, 30),
                new Platform(900, H - 150, 150, 30),
                new Platform(1200, H - 250, 200, 30),
                new Platform(1500, H - 150, 150, 30),
                new Platform(1800, H - 250, 150, 30),
                new Platform(2100, H - 150, 150, 30),
            ],
            enemies: [
                new Enemy(500, H - 90, 'bat', 14),
                new Enemy(1000, H - 90, 'bat', 14),
                new Enemy(1500, H - 90, 'bat', 14),
                new Enemy(2000, H - 90, 'bat', 14),
            ],
            coins: [
                new Coin(350, H - 190),
                new Coin(650, H - 290),
                new Coin(950, H - 190),
                new Coin(1250, H - 290),
                new Coin(1550, H - 190),
                new Coin(1850, H - 290),
                new Coin(2150, H - 190),
            ],
            flag: new Flag(2800, H - 150, false),
            boss: new Boss(1500, H - 200),
            playerStart: { x: 50, y: H - 150 },
        });

        return levels;
    }
}

export default LevelManager;

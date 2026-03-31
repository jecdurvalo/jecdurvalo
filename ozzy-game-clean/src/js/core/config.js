/**
 * Configurações Globais do Jogo
 * Centraliza todas as constantes e parâmetros ajustáveis
 */

const CONFIG = {
    // Dimensões do Canvas
    CANVAS: {
        MAX_WIDTH: 960,
        MAX_HEIGHT: 540,
    },

    // Física do Jogador
    PLAYER: {
        WIDTH: 50,
        HEIGHT: 50,
        SPEED: 5,
        JUMP_FORCE: -15,
        GRAVITY: 0.65,
        FRICTION: 0.8,
        INVINCIBLE_FRAMES: 60,
    },

    // Inimigos
    ENEMY: {
        SPIDER: {
            WIDTH: 40,
            HEIGHT: 40,
            BASE_SPEED: 2,
            PATROL_DISTANCE: 150,
        },
        BAT: {
            WIDTH: 40,
            HEIGHT: 40,
            BASE_SPEED: 2,
            WING_FREQUENCY: 0.3,
        },
    },

    // Boss
    BOSS: {
        WIDTH: 120,
        HEIGHT: 120,
        HP: 3,
        SPEED: 1.5,
        DAMAGE_COOLDOWN: 30,
    },

    // Moedas e Pontuação
    SCORING: {
        COIN_VALUE: 10,
        ENEMY_KILL_BONUS: 20,
    },

    // Níveis
    LEVELS: {
        TOTAL: 12,
        BOSS_LEVELS: [5, 10], // Níveis com boss
    },

    // Estados do Jogo
    STATES: {
        START: 'START',
        PLAYING: 'PLAYING',
        GAMEOVER: 'GAMEOVER',
        WIN: 'WIN',
    },

    // Inputs
    INPUTS: {
        MOVE_RIGHT: ['ArrowRight', 'KeyD'],
        MOVE_LEFT: ['ArrowLeft', 'KeyA'],
        JUMP: ['Space', 'ArrowUp', 'KeyW'],
    },
};

export default CONFIG;

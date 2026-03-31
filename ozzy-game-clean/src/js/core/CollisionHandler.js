/**
 * CollisionHandler - Gerencia detecção e resolução de colisões
 * Responsabilidade única: verificar e processar colisões entre entidades
 */

import CONFIG from '../core/config.js';

class CollisionHandler {
    /**
     * Verifica colisão entre dois bounds retangulares
     * @param {Object} a - Bounds A {x, y, width, height}
     * @param {Object} b - Bounds B {x, y, width, height}
     * @returns {boolean}
     */
    static checkRectCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    /**
     * Processa colisões do jogador com plataformas
     * @param {Player} player 
     * @param {Platform[]} platforms 
     */
    static handlePlatformCollisions(player, platforms) {
        player.grounded = false;

        for (const platform of platforms) {
            const bounds = player.getBounds();
            
            if (this.checkRectCollision(bounds, platform.getBounds())) {
                this.resolvePlatformCollision(player, platform);
            }
        }
    }

    /**
     * Resolve colisão entre jogador e plataforma
     * @param {Player} player 
     * @param {Platform} platform 
     */
    static resolvePlatformCollision(player, platform) {
        const prevY = player.y - player.vy;
        const prevX = player.x - player.vx;

        // Colisão vertical (chão)
        if (prevY + player.height <= platform.y &&
            player.y + player.height >= platform.y &&
            player.vy >= 0) {
            player.y = platform.y - player.height;
            player.vy = 0;
            player.grounded = true;
            player.jumping = false;
        }
        // Colisão vertical (teto)
        else if (prevY >= platform.y + platform.h &&
                 player.y <= platform.y + platform.h &&
                 player.vy < 0) {
            player.y = platform.y + platform.h;
            player.vy = 0;
        }

        // Colisão horizontal
        if (prevX + player.width <= platform.x &&
            player.x + player.width >= platform.x) {
            player.x = platform.x - player.width;
            player.vx = 0;
        } else if (prevX >= platform.x + platform.w &&
                   player.x <= platform.x + platform.w) {
            player.x = platform.x + platform.w;
            player.vx = 0;
        }
    }

    /**
     * Processa colisões com inimigos
     * @param {Player} player 
     * @param {Enemy[]} enemies 
     * @param {Function} onEnemyKill - Callback quando inimigo é derrotado
     * @param {Function} onPlayerHit - Callback quando jogador é atingido
     */
    static handleEnemyCollisions(player, enemies, onEnemyKill, onPlayerHit) {
        for (const enemy of enemies) {
            if (enemy.dead || !enemy.collidesWith(player)) continue;

            if (enemy.wasStomped(player)) {
                enemy.kill();
                player.vy = -8; // Rebote
                onEnemyKill && onEnemyKill(enemy);
            } else if (player.invincible === 0) {
                onPlayerHit && onPlayerHit(enemy);
            }
        }
    }

    /**
     * Processa colisão com boss
     * @param {Player} player 
     * @param {Boss} boss 
     * @param {Function} onBossHit - Callback quando boss é atingido
     * @param {Function} onPlayerHit - Callback quando jogador é atingido
     */
    static handleBossCollision(player, boss, onBossHit, onPlayerHit) {
        if (!boss || boss.isDead() || !boss.collidesWith(player)) return;

        if (boss.wasStomped(player)) {
            const killed = boss.takeDamage();
            player.vy = -10; // Rebote mais alto
            
            if (killed) {
                onBossHit && onBossHit(boss, true);
            } else {
                onBossHit && onBossHit(boss, false);
            }
        } else if (player.invincible === 0) {
            onPlayerHit && onPlayerHit(boss);
        }
    }

    /**
     * Processa coleta de moedas
     * @param {Player} player 
     * @param {Coin[]} coins 
     * @param {Function} onCoinCollect - Callback quando moeda é coletada
     */
    static handleCoinCollection(player, coins, onCoinCollect) {
        for (const coin of coins) {
            if (coin.collected) continue;

            if (coin.collidesWith(player)) {
                const value = coin.collect();
                onCoinCollect && onCoinCollect(coin, value);
            }
        }
    }

    /**
     * Verifica se jogador alcançou a bandeira
     * @param {Player} player 
     * @param {Flag} flag 
     * @returns {boolean}
     */
    static checkFlagCollision(player, flag) {
        return flag && flag.collidesWith(player);
    }

    /**
     * Verifica se jogador caiu do mapa
     * @param {Player} player 
     * @param {number} canvasHeight 
     * @returns {boolean}
     */
    static checkFallenOffMap(player, canvasHeight) {
        return player.hasFallenOffMap(canvasHeight);
    }
}

export default CollisionHandler;

/**
 * Enemy - Classe de Inimigos
 * Responsabilidade: gerenciar comportamento e renderização de inimigos
 */

import CONFIG from '../core/config.js';

class Enemy {
    /**
     * @param {number} x - Posição X inicial
     * @param {number} y - Posição Y inicial
     * @param {string} type - Tipo: 'spider' ou 'bat'
     * @param {number} levelIndex - Índice do nível para dificuldade progressiva
     */
    constructor(x, y, type, levelIndex = 0) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = CONFIG.ENEMY[type === 'spider' ? 'SPIDER' : 'BAT'].WIDTH;
        this.height = CONFIG.ENEMY[type === 'spider' ? 'SPIDER' : 'BAT'].HEIGHT;
        
        this.startX = x;
        this.angle = 0;
        this.direction = 1;
        this.dead = false;

        // Dificuldade progressiva
        const difficultyMultiplier = 1 + (levelIndex * 0.15);
        this.patrolDistance = CONFIG.ENEMY.SPIDER.PATROL_DISTANCE * difficultyMultiplier;
        this.speed = CONFIG.ENEMY.SPIDER.BASE_SPEED * difficultyMultiplier;
    }

    /**
     * Atualiza comportamento do inimigo
     */
    update() {
        if (this.type === 'spider') {
            this.updateSpider();
        } else {
            this.updateBat();
        }
    }

    /**
     * Comportamento da aranha (patrulha)
     */
    updateSpider() {
        this.x += this.speed * this.direction;
        
        if (this.x > this.startX + this.patrolDistance || 
            this.x < this.startX) {
            this.direction *= -1;
        }
    }

    /**
     * Comportamento do morcego (voo senoidal)
     */
    updateBat() {
        this.x -= this.speed;
        this.angle += CONFIG.ENEMY.BAT.WING_FREQUENCY;
        this.y += Math.sin(this.angle) * 1.5;
    }

    /**
     * Renderiza o inimigo no canvas
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} cameraX 
     * @param {number} frames 
     */
    draw(ctx, cameraX, frames) {
        const drawX = this.x - cameraX;

        // Culling - não desenha se fora da tela
        if (drawX < -50 || drawX > ctx.canvas.width + 50) {
            return;
        }

        ctx.save();
        ctx.translate(drawX + this.width / 2, this.y + this.height / 2);

        if (this.type === 'spider') {
            this.drawSpider(ctx);
        } else {
            this.drawBat(ctx, frames);
        }

        ctx.restore();
    }

    /**
     * Desenha aranha
     */
    drawSpider(ctx) {
        ctx.scale(this.direction, 1);
        
        // Corpo
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        // Olhos vermelhos
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(-5, -5, 3, 0, Math.PI * 2);
        ctx.arc(5, -5, 3, 0, Math.PI * 2);
        ctx.fill();

        // Patas
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
            const legAngle = (i - 1.5) * 0.4;
            const legLength = 25;
            
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(
                -10 + Math.cos(legAngle) * legLength,
                Math.sin(legAngle) * legLength
            );
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(
                10 + Math.cos(Math.PI - legAngle) * legLength,
                Math.sin(Math.PI - legAngle) * legLength
            );
            ctx.stroke();
        }
    }

    /**
     * Desenha morcego
     */
    drawBat(ctx, frames) {
        // Corpo
        ctx.fillStyle = '#4a0080';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        // Asas (animação)
        const wingFlap = Math.sin(frames * CONFIG.ENEMY.BAT.WING_FREQUENCY) * 10;
        
        ctx.fillStyle = '#6a00a0';
        ctx.beginPath();
        ctx.moveTo(-10, -5);
        ctx.lineTo(-30, -15 + wingFlap);
        ctx.lineTo(-15, 5);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(10, -5);
        ctx.lineTo(30, -15 + wingFlap);
        ctx.lineTo(15, 5);
        ctx.fill();

        // Olhos amarelos
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(-4, -3, 3, 0, Math.PI * 2);
        ctx.arc(4, -3, 3, 0, Math.PI * 2);
        ctx.fill();

        // Orelhas
        ctx.fillStyle = '#4a0080';
        ctx.beginPath();
        ctx.moveTo(-8, -10);
        ctx.lineTo(-12, -18);
        ctx.lineTo(-4, -12);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(8, -10);
        ctx.lineTo(12, -18);
        ctx.lineTo(4, -12);
        ctx.fill();
    }

    /**
     * Verifica colisão com jogador
     * @param {Player} player 
     * @returns {boolean}
     */
    collidesWith(player) {
        const bounds = player.getBounds();
        
        return this.x < bounds.x + bounds.width &&
               this.x + this.width > bounds.x &&
               this.y < bounds.y + bounds.height &&
               this.y + this.height > bounds.y;
    }

    /**
     * Verifica se foi atingido por cima (estilo Mario)
     * @param {Player} player 
     * @returns {boolean}
     */
    wasStomped(player) {
        return (player.vy > 0) &&
               (player.y + player.height - player.vy <= this.y + this.height * 0.5);
    }

    /**
     * Marca inimigo como morto
     */
    kill() {
        this.dead = true;
    }

    /**
     * Obtém bounds para colisão
     * @returns {Object}
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    }
}

export default Enemy;

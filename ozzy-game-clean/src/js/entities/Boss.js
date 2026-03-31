/**
 * Boss - Classe do Chefe de Fase
 * Responsabilidade: gerenciar comportamento, estado e renderização do boss
 */

import CONFIG from '../core/config.js';

class Boss {
    /**
     * @param {number} x - Posição X inicial
     * @param {number} y - Posição Y inicial
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.BOSS.WIDTH;
        this.height = CONFIG.BOSS.HEIGHT;
        
        this.startX = x;
        this.hp = CONFIG.BOSS.HP;
        this.maxHp = CONFIG.BOSS.HP;
        this.speed = CONFIG.BOSS.SPEED;
        this.direction = 1;
        this.angle = 0;
        this.dead = false;
        this.damageCooldown = 0;
        this.patrolRange = 200;
    }

    /**
     * Atualiza comportamento do boss
     */
    update() {
        if (this.dead) return;

        // Movimento de patrulha
        this.x += this.speed * this.direction;
        
        if (this.x > this.startX + this.patrolRange || 
            this.x < this.startX) {
            this.direction *= -1;
        }

        // Animação de voo
        this.angle += 0.05;
        this.y = this.startX + Math.sin(this.angle) * 30;

        // Cooldown de dano
        if (this.damageCooldown > 0) {
            this.damageCooldown--;
        }
    }

    /**
     * Renderiza o boss no canvas
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} cameraX 
     * @param {number} frames 
     */
    draw(ctx, cameraX, frames) {
        if (this.dead) return;

        const drawX = this.x - cameraX;

        ctx.save();
        ctx.translate(drawX + this.width / 2, this.y + this.height / 2);
        ctx.scale(this.direction, 1);

        // Corpo do boss (morcego gigante)
        this.drawBody(ctx);
        this.drawWings(ctx, frames);
        this.drawFace(ctx);
        this.drawHealthBar(ctx);

        ctx.restore();
    }

    /**
     * Desenha corpo do boss
     */
    drawBody(ctx) {
        ctx.fillStyle = this.damageCooldown > 0 ? '#ff0000' : '#4a0080';
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, Math.PI * 2);
        ctx.fill();

        // Detalhe interno
        ctx.fillStyle = this.damageCooldown > 0 ? '#ff4444' : '#6a00a0';
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Desenha asas do boss
     */
    drawWings(ctx, frames) {
        const wingFlap = Math.sin(frames * 0.1) * 20;

        ctx.fillStyle = this.damageCooldown > 0 ? '#ff0000' : '#5a0090';
        
        // Asa esquerda
        ctx.beginPath();
        ctx.moveTo(-30, -10);
        ctx.lineTo(-80, -30 + wingFlap);
        ctx.lineTo(-40, 20);
        ctx.closePath();
        ctx.fill();

        // Asa direita
        ctx.beginPath();
        ctx.moveTo(30, -10);
        ctx.lineTo(80, -30 + wingFlap);
        ctx.lineTo(40, 20);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Desenha rosto do boss
     */
    drawFace(ctx) {
        // Olhos vermelhos brilhantes
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(-15, -10, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(15, -10, 10, 0, Math.PI * 2);
        ctx.fill();

        // Pupilas
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(-15, -10, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(15, -10, 4, 0, Math.PI * 2);
        ctx.fill();

        // Presas
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(-10, 15);
        ctx.lineTo(-5, 25);
        ctx.lineTo(0, 15);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(5, 25);
        ctx.lineTo(10, 15);
        ctx.fill();

        // Orelhas pontudas
        ctx.fillStyle = '#4a0080';
        ctx.beginPath();
        ctx.moveTo(-25, -30);
        ctx.lineTo(-35, -50);
        ctx.lineTo(-15, -35);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(25, -30);
        ctx.lineTo(35, -50);
        ctx.lineTo(15, -35);
        ctx.fill();
    }

    /**
     * Desenha barra de vida do boss
     */
    drawHealthBar(ctx) {
        const barWidth = 80;
        const barHeight = 8;
        const barX = -barWidth / 2;
        const barY = -this.height / 2 - 20;

        // Fundo da barra
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Vida atual
        const hpPercent = this.hp / this.maxHp;
        const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
        gradient.addColorStop(0, '#00ff00');
        gradient.addColorStop(0.5, '#ffff00');
        gradient.addColorStop(1, '#ff0000');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

        // Borda da barra
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    /**
     * Aplica dano ao boss
     * @returns {boolean} true se o boss morreu
     */
    takeDamage() {
        if (this.damageCooldown > 0 || this.dead) return false;

        this.hp--;
        this.damageCooldown = CONFIG.BOSS.DAMAGE_COOLDOWN;

        if (this.hp <= 0) {
            this.dead = true;
            return true;
        }
        return false;
    }

    /**
     * Verifica colisão com jogador
     * @param {Player} player 
     * @returns {boolean}
     */
    collidesWith(player) {
        if (this.dead) return false;

        const bounds = player.getBounds();
        
        return this.x < bounds.x + bounds.width &&
               this.x + this.width > bounds.x &&
               this.y < bounds.y + bounds.height &&
               this.y + this.height > bounds.y;
    }

    /**
     * Verifica se foi atingido por cima
     * @param {Player} player 
     * @returns {boolean}
     */
    wasStomped(player) {
        return (player.vy > 0) &&
               (player.y + player.height - player.vy <= this.y + this.height * 0.5);
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

    /**
     * Verifica se o boss está morto
     * @returns {boolean}
     */
    isDead() {
        return this.dead;
    }
}

export default Boss;

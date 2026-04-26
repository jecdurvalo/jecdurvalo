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
        this.startY = y;
        this.hp = CONFIG.BOSS.HP;
        this.maxHp = CONFIG.BOSS.HP;
        this.speed = CONFIG.BOSS.SPEED;
        this.direction = 1;
        this.angle = 0;
        this.dead = false;
        this.damageCooldown = 0;
        this.patrolRange = CONFIG.BOSS.PATROL_DISTANCE / 2;
    }

    /**
     * Atualiza comportamento do boss
     */
    update() {
        if (this.dead) return;

        // Movimento de patrulha
        this.x += this.speed * this.direction;
        
        if (this.x > this.startX + this.patrolRange || 
            this.x < this.startX - this.patrolRange) {
            this.direction *= -1;
        }

        // Animação de voo ondulatória
        this.angle += 0.05;
        this.y = this.startY + Math.sin(this.angle) * 50;

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
        if (drawX < -150 || drawX > ctx.canvas.width + 150) return;

        ctx.save();
        ctx.translate(drawX + this.width / 2, this.y + this.height / 2);

        // Corpo do morcego gigante (roxo escuro)
        ctx.fillStyle = this.damageCooldown > 0 ? '#ff0000' : '#4a0080';
        ctx.beginPath();
        ctx.ellipse(0, 0, 50, 40, 0, 0, Math.PI * 2);
        ctx.fill();

        // Asas grandes
        ctx.fillStyle = this.damageCooldown > 0 ? '#ff4444' : '#2d004d';
        const wingFlap = Math.sin(this.angle * 2) * 20;

        // Asa esquerda
        ctx.beginPath();
        ctx.moveTo(-30, -10);
        ctx.quadraticCurveTo(-80, -60 + wingFlap, -100, -20 + wingFlap);
        ctx.quadraticCurveTo(-70, 10, -40, 20);
        ctx.fill();

        // Asa direita
        ctx.beginPath();
        ctx.moveTo(30, -10);
        ctx.quadraticCurveTo(80, -60 + wingFlap, 100, -20 + wingFlap);
        ctx.quadraticCurveTo(70, 10, 40, 20);
        ctx.fill();

        // Olhos vermelhos brilhantes
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(-20, -10, 12, 0, Math.PI * 2);
        ctx.arc(20, -10, 12, 0, Math.PI * 2);
        ctx.fill();

        // Pupilas pretas
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-18, -10, 5, 0, Math.PI * 2);
        ctx.arc(22, -10, 5, 0, Math.PI * 2);
        ctx.fill();

        // Brilho nos olhos
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-22, -14, 3, 0, Math.PI * 2);
        ctx.arc(18, -14, 3, 0, Math.PI * 2);
        ctx.fill();

        // Orelhas pontudas
        ctx.fillStyle = this.damageCooldown > 0 ? '#ff0000' : '#4a0080';
        ctx.beginPath();
        ctx.moveTo(-30, -30);
        ctx.lineTo(-45, -60);
        ctx.lineTo(-15, -45);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(30, -30);
        ctx.lineTo(45, -60);
        ctx.lineTo(15, -45);
        ctx.fill();

        ctx.restore();

        // Desenhar barra de vida acima do boss
        const barWidth = 80;
        const barHeight = 8;
        const barX = drawX + this.width / 2 - barWidth / 2;
        const barY = this.y - this.height / 2 - 20;

        // Fundo da barra
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Vida atual
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = hpPercent > 0.5 ? '#0f0' : hpPercent > 0.25 ? '#ff0' : '#f00';
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

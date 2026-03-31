/**
 * Coin - Classe de Moedas
 * Responsabilidade: gerenciar estado e renderização de moedas coletáveis
 */

import CONFIG from '../core/config.js';

class Coin {
    /**
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.collected = false;
        this.baseY = y;
        this.floatOffset = Math.random() * Math.PI * 2;
    }

    /**
     * Atualiza animação da moeda
     * @param {number} frames 
     */
    update(frames) {
        // Animação de flutuar
        this.y = this.baseY + Math.sin(frames * 0.05 + this.floatOffset) * 3;
    }

    /**
     * Renderiza a moeda no canvas
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} cameraX 
     * @param {number} frames 
     */
    draw(ctx, cameraX, frames) {
        if (this.collected) return;

        const drawX = this.x - cameraX;

        // Culling
        if (drawX < -30 || drawX > ctx.canvas.width + 30) {
            return;
        }

        // Brilho externo
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(drawX + this.width / 2, this.y + this.height / 2, 15, 0, Math.PI * 2);
        ctx.fill();

        // Moeda dourada
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(drawX + this.width / 2, this.y + this.height / 2, 10, 0, Math.PI * 2);
        ctx.fill();

        // Brilho interno
        ctx.fillStyle = '#fff8dc';
        ctx.beginPath();
        ctx.arc(drawX + this.width / 2 - 3, this.y + this.height / 2 - 3, 4, 0, Math.PI * 2);
        ctx.fill();

        // Símbolo de cifrão
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 2;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText('$', drawX + this.width / 2, this.y + this.height / 2);
        ctx.fillText('$', drawX + this.width / 2, this.y + this.height / 2);
    }

    /**
     * Verifica colisão com jogador
     * @param {Player} player 
     * @returns {boolean}
     */
    collidesWith(player) {
        if (this.collected) return false;

        const bounds = player.getBounds();
        
        return this.x < bounds.x + bounds.width &&
               this.x + this.width > bounds.x &&
               this.y < bounds.y + bounds.height &&
               this.y + this.height > bounds.y;
    }

    /**
     * Coleta a moeda
     * @returns {number} Valor da moeda
     */
    collect() {
        if (!this.collected) {
            this.collected = true;
            return CONFIG.SCORING.COIN_VALUE;
        }
        return 0;
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

export default Coin;

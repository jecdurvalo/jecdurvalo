/**
 * Flag - Classe da Bandeira (Objetivo da Fase)
 * Responsabilidade: gerenciar renderização da bandeira de vitória
 */

class Flag {
    /**
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {boolean} visible - Se a bandeira está visível
     */
    constructor(x, y, visible = true) {
        this.x = x;
        this.y = y;
        this.w = 10;
        this.h = 100;
        this.visible = visible;
    }

    /**
     * Renderiza a bandeira no canvas
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} cameraX 
     * @param {number} frames 
     */
    draw(ctx, cameraX, frames) {
        if (!this.visible) return;
        
        const drawX = this.x - cameraX;
        
        // Haste branca (igual ao ozzy-mario.html)
        ctx.fillStyle = '#fff';
        ctx.fillRect(drawX, this.y, 5, 100);
        
        // Bandeira vermelha triangular
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.moveTo(drawX + 5, this.y);
        ctx.lineTo(drawX + 40, this.y + 15);
        ctx.lineTo(drawX + 5, this.y + 30);
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
               this.x + this.w > bounds.x &&
               this.y < bounds.y + bounds.height &&
               this.y + this.h > bounds.y;
    }

    /**
     * Obtém bounds para colisão
     * @returns {Object}
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.w,
            height: this.h,
        };
    }
}

export default Flag;

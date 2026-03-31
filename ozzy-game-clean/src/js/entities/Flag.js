/**
 * Flag - Classe da Bandeira (Objetivo da Fase)
 * Responsabilidade: gerenciar renderização da bandeira de vitória
 */

class Flag {
    /**
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 100;
        this.poleHeight = 80;
    }

    /**
     * Renderiza a bandeira no canvas
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} cameraX 
     * @param {number} frames 
     */
    draw(ctx, cameraX, frames) {
        const drawX = this.x - cameraX;

        // Poste
        ctx.fillStyle = '#888';
        ctx.fillRect(drawX + 5, this.y, 8, this.poleHeight);

        // Base do poste
        ctx.fillStyle = '#654321';
        ctx.fillRect(drawX, this.y + this.poleHeight - 10, 18, 10);

        // Bandeira (animação de ondulação)
        const wave = Math.sin(frames * 0.05) * 3;
        
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.moveTo(drawX + 13, this.y + 10);
        ctx.lineTo(drawX + 55 + wave, this.y + 25);
        ctx.lineTo(drawX + 13, this.y + 40);
        ctx.closePath();
        ctx.fill();

        // Estrela na bandeira
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(drawX + 30 + wave / 2, this.y + 25, 5, 0, Math.PI * 2);
        ctx.fill();

        // Efeito de brilho
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(drawX + 30, this.y + 50, 30, 0, Math.PI * 2);
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

export default Flag;

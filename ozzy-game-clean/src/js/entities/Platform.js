/**
 * Platform - Classe de Plataformas
 * Responsabilidade: gerenciar renderização de plataformas
 */

class Platform {
    /**
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} w - Largura
     * @param {number} h - Altura
     */
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    /**
     * Renderiza a plataforma no canvas
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} cameraX 
     */
    draw(ctx, cameraX) {
        // Terra marrom
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x - cameraX, this.y, this.w, this.h);
        
        // Grama no topo
        ctx.fillStyle = '#3cb371';
        ctx.fillRect(this.x - cameraX, this.y, this.w, 10);
        
        // Detalhe de blocos
        ctx.strokeStyle = '#4a3020';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - cameraX, this.y, this.w, this.h);
    }

    /**
     * Verifica colisão com bounds
     * @param {Object} bounds - {x, y, width, height}
     * @returns {boolean}
     */
    collidesWith(bounds) {
        return bounds.x < this.x + this.w &&
               bounds.x + bounds.width > this.x &&
               bounds.y < this.y + this.h &&
               bounds.y + bounds.height > this.y;
    }

    /**
     * Obtém bounds da plataforma
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

export default Platform;

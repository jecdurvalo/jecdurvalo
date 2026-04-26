/**
 * Enemy - Classe de Inimigos
 * Responsabilidade: gerenciar comportamento e renderização de inimigos
 */

class Enemy {
    /**
     * @param {number} x - Posição X inicial
     * @param {number} y - Posição Y inicial
     * @param {string} type - Tipo: 'spider', 'bat' ou 'goomba'
     * @param {number} levelIndex - Índice do nível para dificuldade progressiva
     */
    constructor(x, y, type, levelIndex = 0) {
        this.x = x;
        this.y = y;
        this.type = type;
        
        // Tamanho fixo igual ao ozzy-mario.html
        this.w = 40;
        this.h = 40;
        
        this.startX = x;
        this.angle = 0;
        this.dir = 1;
        this.dead = false;

        // Dificuldade progressiva (igual ao ozzy-mario.html)
        this.patrolDist = 150 + (levelIndex * 30);
        this.speed = 2 + (levelIndex * 0.8);
    }

    /**
     * Atualiza comportamento do inimigo
     */
    update() {
        if (this.type === 'spider') {
            this.x += this.speed * this.dir;
            
            if (this.x > this.startX + this.patrolDist || 
                this.x < this.startX) {
                this.dir *= -1;
            }
        } else {
            // Morcego (voo senoidal)
            this.x -= this.speed;
            this.angle += 0.1;
            this.y += Math.sin(this.angle) * 1.5;
        }
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
        ctx.translate(drawX + this.w / 2, this.y + this.h / 2);

        if (this.type === 'spider') {
            // Aranha igual ao ozzy-mario.html
            ctx.scale(this.dir, 1);
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
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(-10, 0);
                ctx.lineTo(-25, -10 + i * 6);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(10, 0);
                ctx.lineTo(25, -10 + i * 6);
                ctx.stroke();
            }
        } else {
            // Morcego igual ao ozzy-mario.html
            ctx.fillStyle = '#4b0082';
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // Asas animadas
            const wing = Math.sin(frames * 0.3) * 10;
            ctx.beginPath();
            ctx.moveTo(-10, -5);
            ctx.lineTo(-25, -15 + wing);
            ctx.lineTo(-10, 5);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(10, -5);
            ctx.lineTo(25, -15 - wing);
            ctx.lineTo(10, 5);
            ctx.fill();
            
            // Olhos amarelos
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(-4, -2, 2, 0, Math.PI * 2);
            ctx.arc(4, -2, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
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
     * Verifica se foi atingido por cima (estilo Mario)
     * @param {Player} player 
     * @returns {boolean}
     */
    wasStomped(player) {
        return (player.vy > 0) &&
               (player.y + player.height - player.vy <= this.y + this.h * 0.5);
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
            width: this.w,
            height: this.h,
        };
    }
}

export default Enemy;

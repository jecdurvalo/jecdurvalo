/**
 * Player - Classe do Jogador
 * Responsabilidade: gerenciar estado, física e renderização do jogador
 */

import CONFIG from '../core/config.js';

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PLAYER.WIDTH;
        this.height = CONFIG.PLAYER.HEIGHT;
        
        // Física
        this.vx = 0;
        this.vy = 0;
        this.speed = CONFIG.PLAYER.SPEED;
        this.jumpForce = CONFIG.PLAYER.JUMP_FORCE;
        this.gravity = CONFIG.PLAYER.GRAVITY;
        
        // Estado
        this.grounded = false;
        this.jumping = false;
        this.direction = 1; // 1 = direita, -1 = esquerda
        this.invincible = 0;
    }

    /**
     * Atualiza física e movimento do jogador
     * @param {InputHandler} input - Handler de inputs
     */
    update(input) {
        this.handleMovement(input);
        this.applyPhysics();
        this.updateInvincibility();
    }

    /**
     * Processa movimento baseado nos inputs
     * @param {InputHandler} input 
     */
    handleMovement(input) {
        if (input.isMovingRight()) {
            this.vx = this.speed;
            this.direction = 1;
        } else if (input.isMovingLeft()) {
            this.vx = -this.speed;
            this.direction = -1;
        } else {
            // Aplica fricção quando não há input
            this.vx *= CONFIG.PLAYER.FRICTION;
        }

        this.x += this.vx;

        // Limita ao início do mundo
        if (this.x < 0) {
            this.x = 0;
            this.vx = 0;
        }
    }

    /**
     * Aplica gravidade e atualiza posição Y
     */
    applyPhysics() {
        this.vy += this.gravity;
        this.y += this.vy;
    }

    /**
     * Atualiza contador de invencibilidade
     */
    updateInvincibility() {
        if (this.invincible > 0) {
            this.invincible--;
        }
    }

    /**
     * Executa pulo se estiver no chão
     */
    jump() {
        if (this.grounded) {
            this.vy = this.jumpForce;
            this.grounded = false;
            this.jumping = true;
        }
    }

    /**
     * Processa colisão com plataforma
     * @param {Platform} platform 
     */
    handlePlatformCollision(platform) {
        const prevY = this.y - this.vy;
        
        // Colisão vertical (chão/teto)
        if (prevY + this.height <= platform.y && 
            this.y + this.height >= platform.y &&
            this.vy >= 0) {
            this.y = platform.y - this.height;
            this.vy = 0;
            this.grounded = true;
            this.jumping = false;
        }
        // Colisão vindo de baixo (cabeça no teto)
        else if (prevY >= platform.y + platform.h && 
                 this.y <= platform.y + platform.h &&
                 this.vy < 0) {
            this.y = platform.y + platform.h;
            this.vy = 0;
        }

        // Colisão horizontal
        const prevX = this.x - this.vx;
        if (prevX + this.width <= platform.x && 
            this.x + this.width >= platform.x) {
            this.x = platform.x - this.width;
            this.vx = 0;
        } else if (prevX >= platform.x + platform.w && 
                   this.x <= platform.x + platform.w) {
            this.x = platform.x + platform.w;
            this.vx = 0;
        }
    }

    /**
     * Verifica se caiu do mapa
     * @param {number} canvasHeight 
     * @returns {boolean}
     */
    hasFallenOffMap(canvasHeight) {
        return this.y > canvasHeight + 100;
    }

    /**
     * Define estado de invencibilidade
     * @param {number} frames 
     */
    setInvincible(frames) {
        this.invincible = frames;
    }

    /**
     * Renderiza o jogador no canvas
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} cameraX 
     * @param {number} frames 
     */
    draw(ctx, cameraX, frames) {
        // Piscar quando invencível
        if (this.invincible > 0 && Math.floor(frames / 4) % 2 === 0) {
            return;
        }

        ctx.save();
        ctx.translate(this.x + this.width / 2 - cameraX, this.y + this.height / 2);
        ctx.scale(this.direction, 1);

        this.drawCatBody(ctx);
        this.drawCatEars(ctx);
        this.drawCatEyes(ctx);
        this.drawCatFace(ctx);
        this.drawLimbs(ctx, frames);
        this.drawTail(ctx, frames);

        ctx.restore();
    }

    /**
     * Desenha corpo do gato
     */
    drawCatBody(ctx) {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, 5, 25, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Desenha orelhas do gato
     */
    drawCatEars(ctx) {
        // Orelhas externas
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(-15, -15);
        ctx.lineTo(-25, -35);
        ctx.lineTo(-5, -25);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(15, -15);
        ctx.lineTo(25, -35);
        ctx.lineTo(5, -25);
        ctx.fill();

        // Orelhas internas (rosa)
        ctx.fillStyle = '#ffb6c1';
        ctx.beginPath();
        ctx.moveTo(-15, -15);
        ctx.lineTo(-22, -30);
        ctx.lineTo(-8, -22);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(15, -15);
        ctx.lineTo(22, -30);
        ctx.lineTo(8, -22);
        ctx.fill();
    }

    /**
     * Desenha olhos do gato
     */
    drawCatEyes(ctx) {
        // Olhos verdes
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.ellipse(-8, -5, 8, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(8, -5, 8, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pupilas
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(-8, -5, 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(8, -5, 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Brilho dos olhos
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-10, -8, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(6, -8, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Desenha rosto (nariz e boca)
     */
    drawCatFace(ctx) {
        // Nariz
        ctx.fillStyle = '#ffb6c1';
        ctx.beginPath();
        ctx.arc(0, 5, 4, 0, Math.PI * 2);
        ctx.fill();

        // Boca
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 10, 6, 0, Math.PI);
        ctx.stroke();

        // Bigodes
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-10, 5);
        ctx.lineTo(-30, 0);
        ctx.moveTo(-10, 8);
        ctx.lineTo(-30, 8);
        ctx.moveTo(-10, 11);
        ctx.lineTo(-30, 16);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(10, 5);
        ctx.lineTo(30, 0);
        ctx.moveTo(10, 8);
        ctx.lineTo(30, 8);
        ctx.moveTo(10, 11);
        ctx.lineTo(30, 16);
        ctx.stroke();
    }

    /**
     * Desenha membros (braços e pernas)
     */
    drawLimbs(ctx, frames) {
        // Braços
        ctx.fillStyle = '#000';
        if (this.jumping) {
            ctx.beginPath();
            ctx.arc(-18, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(18, 0, 8, 0, Math.PI * 2);
            ctx.fill();

            // Patinhas das mãos
            ctx.fillStyle = '#ffb6c1';
            ctx.beginPath();
            ctx.arc(-18, 2, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(18, 2, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(-18, 15, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(18, 15, 8, 0, Math.PI * 2);
            ctx.fill();

            // Patinhas das mãos
            ctx.fillStyle = '#ffb6c1';
            ctx.beginPath();
            ctx.arc(-18, 17, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(18, 17, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Pernas
        ctx.fillStyle = '#000';
        if (this.jumping) {
            ctx.beginPath();
            ctx.arc(-12, 20, 9, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(12, 20, 9, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Animação de andar
            const walkOffset = Math.sin(frames * 0.2) * 5;
            ctx.beginPath();
            ctx.arc(-12 + walkOffset, 22, 9, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(12 - walkOffset, 22, 9, 0, Math.PI * 2);
            ctx.fill();
        }

        // Almofadas das patas
        ctx.fillStyle = '#ffb6c1';
        const footY = this.jumping ? 22 : 24;
        ctx.beginPath();
        ctx.arc(-12, footY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(12, footY, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Desenha cauda do gato
     */
    drawTail(ctx, frames) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        
        const tailWag = Math.sin(frames / 10) * 10;
        
        ctx.beginPath();
        ctx.moveTo(20, 10);
        ctx.quadraticCurveTo(35, 5 + tailWag, 45, -5 + tailWag);
        ctx.stroke();
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

export default Player;

/**
 * Ozzy Game - Main JavaScript
 * Arquivo principal do jogo com boas práticas de Clean Code
 */

/* ========================================
   CONSTANTES E CONFIGURAÇÕES
   ======================================== */
const CONFIG = {
    PLAYER: {
        WIDTH: 50,
        HEIGHT: 50,
        SPEED: 5,
        JUMP_FORCE: -15,
        GRAVITY: 0.65,
        FRICTION: 0.8,
        INVINCIBLE_FRAMES: 60
    },
    ENEMY: {
        BASE_SPEED: 2,
        PATROL_DISTANCE: 150,
        SPEED_INCREMENT_PER_LEVEL: 0.8,
        PATROL_INCREMENT_PER_LEVEL: 30
    },
    GAME: {
        TOTAL_LEVELS: 12,
        INITIAL_LIVES: 3,
        COIN_SCORE: 10,
        ENEMY_KILL_SCORE: 20
    }
};

/* ========================================
   GERENCIADOR DE INPUT
   ======================================== */
class InputHandler {
    constructor(player) {
        this.player = player;
        this.keys = {
            right: false,
            left: false,
            up: false
        };

        this.setupKeyboardListeners();
        this.setupTouchListeners();
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        const keyMap = {
            'ArrowRight': 'right',
            'KeyD': 'right',
            'ArrowLeft': 'left',
            'KeyA': 'left',
            'Space': 'up',
            'ArrowUp': 'up',
            'KeyW': 'up'
        };

        const key = keyMap[e.code];
        if (key) {
            if (key === 'up' && !this.keys.up) {
                this.player.jump();
            }
            this.keys[key] = true;
        }
    }

    handleKeyUp(e) {
        const keyMap = {
            'ArrowRight': 'right',
            'KeyD': 'right',
            'ArrowLeft': 'left',
            'KeyA': 'left',
            'Space': 'up',
            'ArrowUp': 'up',
            'KeyW': 'up'
        };

        const key = keyMap[e.code];
        if (key) {
            this.keys[key] = false;
        }
    }

    setupTouchListeners() {
        const setupTouch = (id, key) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            const handleStart = (e) => {
                e.preventDefault();
                if (key === 'up') {
                    this.player.jump();
                }
                this.keys[key] = true;
            };

            const handleEnd = (e) => {
                e.preventDefault();
                this.keys[key] = false;
            };

            btn.addEventListener('touchstart', handleStart);
            btn.addEventListener('touchend', handleEnd);
            btn.addEventListener('mousedown', () => {
                if (key === 'up') {
                    this.player.jump();
                }
                this.keys[key] = true;
            });
            btn.addEventListener('mouseup', () => {
                this.keys[key] = false;
            });
        };

        setupTouch('btn-left', 'left');
        setupTouch('btn-right', 'right');
        setupTouch('btn-jump', 'up');
    }

    getKeys() {
        return this.keys;
    }
}

/* ========================================
   ENTIDADE JOGADOR
   ======================================== */
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PLAYER.WIDTH;
        this.height = CONFIG.PLAYER.HEIGHT;
        this.vx = 0;
        this.vy = 0;
        this.speed = CONFIG.PLAYER.SPEED;
        this.jumpForce = CONFIG.PLAYER.JUMP_FORCE;
        this.gravity = CONFIG.PLAYER.GRAVITY;
        this.grounded = false;
        this.jumping = false;
        this.direction = 1;
        this.invincible = 0;
    }

    update(keys, frames) {
        this.handleMovement(keys);
        this.applyGravity();
        this.updateInvincibility(frames);
    }

    handleMovement(keys) {
        if (keys.right) {
            this.vx = this.speed;
            this.direction = 1;
        } else if (keys.left) {
            this.vx = -this.speed;
            this.direction = -1;
        } else {
            this.vx *= CONFIG.PLAYER.FRICTION;
        }

        this.x += this.vx;

        // Limite esquerdo do mundo
        if (this.x < 0) {
            this.x = 0;
            this.vx = 0;
        }
    }

    applyGravity() {
        this.vy += this.gravity;
        this.y += this.vy;
    }

    updateInvincibility(frames) {
        if (this.invincible > 0) {
            this.invincible--;
        }
    }

    jump() {
        if (this.grounded) {
            this.vy = this.jumpForce;
            this.grounded = false;
            this.jumping = true;
        }
    }

    draw(ctx, cameraX, frames) {
        if (this.isBlinking(frames)) return;

        ctx.save();
        ctx.translate(this.x + this.width / 2 - cameraX, this.y + this.height / 2);
        ctx.scale(this.direction, 1);

        this.drawCatSprite(ctx, frames);

        ctx.restore();
    }

    isBlinking(frames) {
        return this.invincible > 0 && Math.floor(frames / 4) % 2 === 0;
    }

    drawCatSprite(ctx, frames) {
        // Corpo (gato preto redondo)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, 5, 25, 0, Math.PI * 2);
        ctx.fill();

        // Orelhas (pontudas)
        this.drawEars(ctx);

        // Olhos (grandes e verdes)
        this.drawEyes(ctx);

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
        this.drawWhiskers(ctx);

        // Braços
        this.drawArms(ctx, frames);

        // Pernas
        this.drawLegs(ctx, frames);

        // Almofadas das patas
        this.drawPawPads(ctx, frames);

        // Cauda
        this.drawTail(ctx, frames);
    }

    drawEars(ctx) {
        ctx.fillStyle = '#000';
        // Orelha esquerda
        ctx.beginPath();
        ctx.moveTo(-15, -15);
        ctx.lineTo(-25, -35);
        ctx.lineTo(-5, -25);
        ctx.fill();

        // Orelha direita
        ctx.beginPath();
        ctx.moveTo(15, -15);
        ctx.lineTo(25, -35);
        ctx.lineTo(5, -25);
        ctx.fill();

        // Interior rosa das orelhas
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

    drawEyes(ctx) {
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

    drawWhiskers(ctx) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;

        // Bigodes esquerdos
        ctx.beginPath();
        ctx.moveTo(-10, 5);
        ctx.lineTo(-30, 0);
        ctx.moveTo(-10, 8);
        ctx.lineTo(-30, 8);
        ctx.moveTo(-10, 11);
        ctx.lineTo(-30, 16);
        ctx.stroke();

        // Bigodes direitos
        ctx.beginPath();
        ctx.moveTo(10, 5);
        ctx.lineTo(30, 0);
        ctx.moveTo(10, 8);
        ctx.lineTo(30, 8);
        ctx.moveTo(10, 11);
        ctx.lineTo(30, 16);
        ctx.stroke();
    }

    drawArms(ctx, frames) {
        ctx.fillStyle = '#000';
        if (this.jumping) {
            ctx.beginPath();
            ctx.arc(-18, 0, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(18, 0, 8, 0, Math.PI * 2);
            ctx.fill();

            // Almofadas das mãos
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

            // Almofadas das mãos
            ctx.fillStyle = '#ffb6c1';
            ctx.beginPath();
            ctx.arc(-18, 17, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(18, 17, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawLegs(ctx, frames) {
        ctx.fillStyle = '#000';
        if (this.jumping) {
            ctx.beginPath();
            ctx.arc(-12, 20, 9, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(12, 20, 9, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Animação simples de andar
            const walkOffset = Math.sin(frames * 0.2) * 5;
            ctx.beginPath();
            ctx.arc(-12 + walkOffset, 22, 9, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(12 - walkOffset, 22, 9, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawPawPads(ctx, frames) {
        ctx.fillStyle = '#ffb6c1';
        const footY = this.jumping ? 22 : 24;

        ctx.beginPath();
        ctx.arc(-12, footY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(12, footY, 3, 0, Math.PI * 2);
        ctx.fill();
    }

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

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.grounded = false;
        this.jumping = false;
        this.invincible = 0;
    }
}

/* ========================================
   ENTIDADES DO MUNDO
   ======================================== */
class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx, cameraX, canvasWidth) {
        // Terra marrom
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);

        // Grama no topo
        ctx.fillStyle = '#3cb371';
        ctx.fillRect(this.x - cameraX, this.y, this.width, 10);

        // Detalhe de blocos
        ctx.strokeStyle = '#4a3020';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - cameraX, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor(x, y, type, levelIndex) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 40;
        this.height = 40;
        this.startX = x;
        this.patrolDistance = CONFIG.ENEMY.PATROL_DISTANCE + (levelIndex * CONFIG.ENEMY.PATROL_INCREMENT_PER_LEVEL);
        this.speed = CONFIG.ENEMY.BASE_SPEED + (levelIndex * CONFIG.ENEMY.SPEED_INCREMENT_PER_LEVEL);
        this.direction = 1;
        this.angle = 0;
        this.dead = false;
    }

    update() {
        if (this.dead) return;

        if (this.type === 'spider' || this.type === 'goomba') {
            this.x += this.speed * this.direction;
            if (this.x > this.startX + this.patrolDistance || this.x < this.startX) {
                this.direction *= -1;
            }
        } else if (this.type === 'bat') {
            this.x -= this.speed;
            this.angle += 0.1;
            this.y += Math.sin(this.angle) * 1.5;
        }
    }

    draw(ctx, cameraX, canvasWidth) {
        if (this.dead) return;

        const drawX = this.x - cameraX;
        
        // Culling - não desenhar se fora da tela
        if (drawX < -50 || drawX > canvasWidth + 50) return;

        ctx.save();
        ctx.translate(drawX + this.width / 2, this.y + this.height / 2);

        if (this.type === 'spider' || this.type === 'goomba') {
            ctx.scale(this.direction, 1);
            this.drawSpider(ctx);
        } else if (this.type === 'bat') {
            this.drawBat(ctx);
        }

        ctx.restore();
    }

    drawSpider(ctx) {
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
            const angle = (i / 4) * Math.PI - Math.PI / 2;
            const legLength = 20;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * 15, Math.sin(angle) * 15);
            ctx.lineTo(Math.cos(angle) * legLength, Math.sin(angle) * legLength);
            ctx.stroke();
        }
    }

    drawBat(ctx) {
        // Corpo
        ctx.fillStyle = '#4a004a';
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        // Asas (animadas)
        ctx.fillStyle = '#6a006a';
        const wingFlap = Math.sin(this.angle * 2) * 10;
        
        ctx.beginPath();
        ctx.moveTo(-10, -5);
        ctx.lineTo(-25, -15 + wingFlap);
        ctx.lineTo(-15, 5);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(10, -5);
        ctx.lineTo(25, -15 + wingFlap);
        ctx.lineTo(15, 5);
        ctx.fill();

        // Olhos amarelos
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(-4, -3, 3, 0, Math.PI * 2);
        ctx.arc(4, -3, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.collected = false;
        this.rotation = 0;
    }

    update() {
        this.rotation += 0.1;
    }

    draw(ctx, cameraX) {
        if (this.collected) return;

        const drawX = this.x - cameraX;
        const drawY = this.y + Math.sin(this.rotation) * 5;

        ctx.save();
        ctx.translate(drawX + this.width / 2, drawY + this.height / 2);
        ctx.scale(Math.cos(this.rotation), 1);

        // Moeda dourada
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        // Brilho
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(-3, -3, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class Flag {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 100;
    }

    draw(ctx, cameraX) {
        const drawX = this.x - cameraX;

        // Poste
        ctx.fillStyle = '#888';
        ctx.fillRect(drawX + 20, this.y, 10, this.height);

        // Bandeira
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.moveTo(drawX + 30, this.y);
        ctx.lineTo(drawX + 70, this.y + 25);
        ctx.lineTo(drawX + 30, this.y + 50);
        ctx.fill();
    }
}

class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.health = 5;
        this.maxHealth = 5;
        this.speed = 3;
        this.direction = 1;
        this.dead = false;
        this.angle = 0;
        this.hitFlash = 0;
    }

    update(playerX) {
        if (this.dead) return;

        // Movimento simples de perseguição
        if (this.x < playerX) {
            this.x += this.speed;
            this.direction = 1;
        } else {
            this.x -= this.speed;
            this.direction = -1;
        }

        // Movimento vertical oscilante
        this.angle += 0.05;
        this.y += Math.sin(this.angle) * 2;

        if (this.hitFlash > 0) {
            this.hitFlash--;
        }
    }

    takeDamage() {
        this.health--;
        this.hitFlash = 10;
        if (this.health <= 0) {
            this.dead = true;
        }
    }

    draw(ctx, cameraX) {
        if (this.dead) return;

        const drawX = this.x - cameraX;

        ctx.save();
        ctx.translate(drawX + this.width / 2, this.y + this.height / 2);
        ctx.scale(this.direction, 1);

        // Corpo do boss (morcego gigante)
        if (this.hitFlash > 0 && Math.floor(this.hitFlash / 2) % 2 === 0) {
            ctx.fillStyle = '#fff';
        } else {
            ctx.fillStyle = '#4a004a';
        }

        ctx.beginPath();
        ctx.ellipse(0, 0, 50, 40, 0, 0, Math.PI * 2);
        ctx.fill();

        // Asas gigantes
        ctx.fillStyle = '#6a006a';
        const wingFlap = Math.sin(this.angle) * 20;

        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(-80, -30 + wingFlap);
        ctx.lineTo(-50, 30);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(30, 0);
        ctx.lineTo(80, -30 + wingFlap);
        ctx.lineTo(50, 30);
        ctx.fill();

        // Olhos vermelhos brilhantes
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(-15, -10, 10, 0, Math.PI * 2);
        ctx.arc(15, -10, 10, 0, Math.PI * 2);
        ctx.fill();

        // Presas
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(-10, 15);
        ctx.lineTo(-5, 30);
        ctx.lineTo(0, 15);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(5, 15);
        ctx.lineTo(10, 30);
        ctx.lineTo(15, 15);
        ctx.fill();

        ctx.restore();

        // Barra de vida
        this.drawHealthBar(ctx, drawX);
    }

    drawHealthBar(ctx, drawX) {
        const barWidth = 100;
        const barHeight = 10;
        const barX = drawX;
        const barY = this.y - 20;

        // Fundo da barra
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Vida atual
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // Borda
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

/* ========================================
   GERENCIADOR DE COLISÕES
   ======================================== */
class CollisionHandler {
    static checkPlatformCollision(player, platform) {
        // Colisão AABB simples
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {

            const prevY = player.y - player.vy;

            // Colisão vindo de cima (pousar)
            if (prevY + player.height <= platform.y + 10) {
                player.y = platform.y - player.height;
                player.vy = 0;
                player.grounded = true;
                player.jumping = false;
                return true;
            }
            // Colisão vindo de baixo (bater cabeça)
            else if (prevY >= platform.y + platform.height - 10) {
                player.y = platform.y + platform.height;
                player.vy = 0;
                return true;
            }
            // Colisões laterais
            else {
                if (player.vx > 0) {
                    player.x = platform.x - player.width;
                } else if (player.vx < 0) {
                    player.x = platform.x + platform.width;
                }
                player.vx = 0;
                return true;
            }
        }
        return false;
    }

    static checkEntityCollision(entity1, entity2) {
        return entity1.x < entity2.x + entity2.width &&
               entity1.x + entity1.width > entity2.x &&
               entity1.y < entity2.y + entity2.height &&
               entity1.y + entity1.height > entity2.y;
    }

    static checkEnemyCollision(player, enemy, scoreDisplay, scoreRef) {
        if (!this.checkEntityCollision(player, enemy)) return false;

        const hitFromAbove = (player.vy > 0) &&
                            (player.y + player.height - player.vy <= enemy.y + enemy.height * 0.5);

        if (hitFromAbove) {
            enemy.dead = true;
            player.vy = -8;
            scoreRef.value += CONFIG.GAME.ENEMY_KILL_SCORE;
            scoreDisplay.innerText = `MOEDAS: ${scoreRef.value}`;
            return true;
        } else if (player.invincible === 0) {
            return 'damage';
        }

        return false;
    }

    static checkBossCollision(player, boss, scoreDisplay, scoreRef) {
        if (!boss || boss.dead) return false;

        if (!this.checkEntityCollision(player, boss)) return false;

        const hitFromAbove = (player.vy > 0) &&
                            (player.y + player.height - player.vy <= boss.y + boss.height * 0.5);

        if (hitFromAbove) {
            boss.takeDamage();
            player.vy = -10;
            return 'hit';
        } else if (player.invincible === 0) {
            return 'damage';
        }

        return false;
    }

    static checkCoinCollection(player, coin, scoreDisplay, scoreRef) {
        if (coin.collected) return false;

        if (this.checkEntityCollision(player, coin)) {
            coin.collected = true;
            scoreRef.value += CONFIG.GAME.COIN_SCORE;
            scoreDisplay.innerText = `MOEDAS: ${scoreRef.value}`;
            return true;
        }

        return false;
    }

    static checkFlagCollision(player, flag) {
        return this.checkEntityCollision(player, flag);
    }
}

/* ========================================
   GERENCIADOR DE NÍVEIS
   ======================================== */
class LevelManager {
    constructor(canvas) {
        this.canvas = canvas;
    }

    loadLevel(levelIndex, platforms, enemies, coins, bossRef) {
        // Limpar entidades existentes
        platforms.length = 0;
        enemies.length = 0;
        coins.length = 0;
        bossRef.value = null;

        const canvasHeight = this.canvas.height;

        // Carregar nível específico
        switch (levelIndex) {
            case 0:
                this.loadLevel1(canvasHeight, platforms, enemies, coins);
                break;
            case 1:
                this.loadLevel2(canvasHeight, platforms, enemies, coins);
                break;
            case 2:
                this.loadLevel3(canvasHeight, platforms, enemies, coins);
                break;
            case 3:
                this.loadLevel4(canvasHeight, platforms, enemies, coins);
                break;
            case 4:
                this.loadLevel5(canvasHeight, platforms, enemies, coins);
                break;
            case 5:
                this.loadLevel6(canvasHeight, platforms, enemies, coins);
                break;
            case 6:
                this.loadLevel7(canvasHeight, platforms, enemies, coins);
                break;
            case 7:
                this.loadLevel8(canvasHeight, platforms, enemies, coins);
                break;
            case 8:
                this.loadLevel9(canvasHeight, platforms, enemies, coins);
                break;
            case 9:
                this.loadLevel10(canvasHeight, platforms, enemies, coins);
                break;
            case 10:
                this.loadLevel11(canvasHeight, platforms, enemies, coins);
                break;
            case 11:
                this.loadLevel12(canvasHeight, platforms, enemies, coins, bossRef);
                break;
            default:
                this.loadLevel1(canvasHeight, platforms, enemies, coins);
        }
    }

    loadLevel1(h, platforms, enemies, coins) {
        platforms.push(new Platform(50, h - 50, 300, 50));
        platforms.push(new Platform(400, h - 100, 150, 50));
        platforms.push(new Platform(600, h - 150, 150, 50));
        platforms.push(new Platform(800, h - 200, 150, 50));
        platforms.push(new Platform(1000, h - 150, 150, 50));
        platforms.push(new Platform(1200, h - 100, 150, 50));
        platforms.push(new Platform(1400, h - 50, 400, 50));

        enemies.push(new Enemy(450, h - 140, 'spider', 0));
        enemies.push(new Enemy(850, h - 240, 'spider', 0));
        enemies.push(new Enemy(1450, h - 90, 'goomba', 0));

        coins.push(new Coin(450, h - 140));
        coins.push(new Coin(650, h - 190));
        coins.push(new Coin(850, h - 240));
        coins.push(new Coin(1050, h - 190));
        coins.push(new Coin(1250, h - 140));
        coins.push(new Coin(1500, h - 90));
        coins.push(new Coin(1600, h - 90));

        return new Flag(1700, h - 150);
    }

    loadLevel2(h, platforms, enemies, coins) {
        platforms.push(new Platform(50, h - 50, 200, 50));
        platforms.push(new Platform(300, h - 120, 100, 50));
        platforms.push(new Platform(450, h - 200, 100, 50));
        platforms.push(new Platform(600, h - 280, 100, 50));
        platforms.push(new Platform(750, h - 200, 150, 50));
        platforms.push(new Platform(950, h - 120, 100, 50));
        platforms.push(new Platform(1100, h - 50, 400, 50));

        enemies.push(new Enemy(320, h - 160, 'spider', 1));
        enemies.push(new Enemy(770, h - 240, 'spider', 1));
        enemies.push(new Enemy(1200, h - 90, 'goomba', 1));
        enemies.push(new Enemy(1350, h - 90, 'goomba', 1));

        coins.push(new Coin(330, h - 160));
        coins.push(new Coin(480, h - 240));
        coins.push(new Coin(630, h - 320));
        coins.push(new Coin(800, h - 240));
        coins.push(new Coin(980, h - 160));
        coins.push(new Coin(1250, h - 90));
        coins.push(new Coin(1400, h - 90));

        return new Flag(1400, h - 150);
    }

    loadLevel3(h, platforms, enemies, coins) {
        platforms.push(new Platform(50, h - 50, 250, 50));
        platforms.push(new Platform(350, h - 150, 80, 50));
        platforms.push(new Platform(500, h - 250, 80, 50));
        platforms.push(new Platform(650, h - 350, 80, 50));
        platforms.push(new Platform(800, h - 250, 150, 50));
        platforms.push(new Platform(1000, h - 150, 80, 50));
        platforms.push(new Platform(1150, h - 50, 400, 50));

        enemies.push(new Enemy(820, h - 290, 'spider', 2));
        enemies.push(new Enemy(350, h - 190, 'bat', 2));
        enemies.push(new Enemy(500, h - 290, 'bat', 2));
        enemies.push(new Enemy(1200, h - 90, 'goomba', 2));

        coins.push(new Coin(380, h - 190));
        coins.push(new Coin(530, h - 290));
        coins.push(new Coin(680, h - 390));
        coins.push(new Coin(850, h - 290));
        coins.push(new Coin(1030, h - 190));
        coins.push(new Coin(1300, h - 90));

        return new Flag(1450, h - 150);
    }

    loadLevel4(h, platforms, enemies, coins) {
        platforms.push(new Platform(50, h - 50, 200, 50));
        platforms.push(new Platform(300, h - 100, 120, 50));
        platforms.push(new Platform(470, h - 180, 80, 50));
        platforms.push(new Platform(600, h - 260, 80, 50));
        platforms.push(new Platform(730, h - 340, 80, 50));
        platforms.push(new Platform(860, h - 260, 150, 50));
        platforms.push(new Platform(1060, h - 180, 80, 50));
        platforms.push(new Platform(1190, h - 100, 80, 50));
        platforms.push(new Platform(1320, h - 50, 400, 50));

        enemies.push(new Enemy(320, h - 140, 'spider', 3));
        enemies.push(new Enemy(880, h - 300, 'spider', 3));
        enemies.push(new Enemy(470, h - 220, 'bat', 3));
        enemies.push(new Enemy(600, h - 300, 'bat', 3));
        enemies.push(new Enemy(1400, h - 90, 'goomba', 3));

        coins.push(new Coin(340, h - 140));
        coins.push(new Coin(500, h - 220));
        coins.push(new Coin(630, h - 300));
        coins.push(new Coin(760, h - 380));
        coins.push(new Coin(910, h - 300));
        coins.push(new Coin(1090, h - 220));
        coins.push(new Coin(1220, h - 140));
        coins.push(new Coin(1450, h - 90));

        return new Flag(1600, h - 150);
    }

    loadLevel5(h, platforms, enemies, coins) {
        platforms.push(new Platform(50, h - 50, 150, 50));
        platforms.push(new Platform(250, h - 120, 100, 50));
        platforms.push(new Platform(400, h - 200, 100, 50));
        platforms.push(new Platform(550, h - 280, 100, 50));
        platforms.push(new Platform(700, h - 360, 100, 50));
        platforms.push(new Platform(850, h - 280, 150, 50));
        platforms.push(new Platform(1050, h - 200, 100, 50));
        platforms.push(new Platform(1200, h - 120, 100, 50));
        platforms.push(new Platform(1350, h - 50, 400, 50));

        enemies.push(new Enemy(270, h - 160, 'spider', 4));
        enemies.push(new Enemy(870, h - 320, 'spider', 4));
        enemies.push(new Enemy(400, h - 240, 'bat', 4));
        enemies.push(new Enemy(550, h - 320, 'bat', 4));
        enemies.push(new Enemy(700, h - 400, 'bat', 4));
        enemies.push(new Enemy(1400, h - 90, 'goomba', 4));
        enemies.push(new Enemy(1550, h - 90, 'goomba', 4));

        coins.push(new Coin(280, h - 160));
        coins.push(new Coin(430, h - 240));
        coins.push(new Coin(580, h - 320));
        coins.push(new Coin(730, h - 400));
        coins.push(new Coin(900, h - 320));
        coins.push(new Coin(1080, h - 240));
        coins.push(new Coin(1230, h - 160));
        coins.push(new Coin(1450, h - 90));
        coins.push(new Coin(1600, h - 90));

        return new Flag(1650, h - 150);
    }

    loadLevel6(h, platforms, enemies, coins) {
        platforms.push(new Platform(50, h - 50, 200, 50));
        platforms.push(new Platform(300, h - 150, 80, 50));
        platforms.push(new Platform(430, h - 250, 80, 50));
        platforms.push(new Platform(560, h - 350, 80, 50));
        platforms.push(new Platform(690, h - 450, 80, 50));
        platforms.push(new Platform(820, h - 350, 150, 50));
        platforms.push(new Platform(1020, h - 250, 80, 50));
        platforms.push(new Platform(1150, h - 150, 80, 50));
        platforms.push(new Platform(1280, h - 50, 400, 50));

        enemies.push(new Enemy(840, h - 390, 'spider', 5));
        enemies.push(new Enemy(300, h - 190, 'bat', 5));
        enemies.push(new Enemy(430, h - 290, 'bat', 5));
        enemies.push(new Enemy(560, h - 390, 'bat', 5));
        enemies.push(new Enemy(690, h - 490, 'bat', 5));
        enemies.push(new Enemy(1350, h - 90, 'goomba', 5));

        coins.push(new Coin(320, h - 190));
        coins.push(new Coin(450, h - 290));
        coins.push(new Coin(580, h - 390));
        coins.push(new Coin(710, h - 490));
        coins.push(new Coin(870, h - 390));
        coins.push(new Coin(1050, h - 290));
        coins.push(new Coin(1180, h - 190));
        coins.push(new Coin(1400, h - 90));

        return new Flag(1550, h - 150);
    }

    loadLevel7(h, platforms, enemies, coins) {
        platforms.push(new Platform(50, h - 50, 200, 50));
        platforms.push(new Platform(280, h - 130, 110, 50));
        platforms.push(new Platform(460, h - 210, 110, 50));
        platforms.push(new Platform(650, h - 290, 140, 50));
        platforms.push(new Platform(870, h - 370, 110, 50));
        platforms.push(new Platform(1060, h - 450, 110, 50));
        platforms.push(new Platform(1250, h - 370, 110, 50));
        platforms.push(new Platform(1440, h - 290, 110, 50));
        platforms.push(new Platform(1650, h - 210, 200, 50));
        platforms.push(new Platform(1650, h - 50, 600, 50));

        enemies.push(new Enemy(480, h - 250, 'goomba', 6));
        enemies.push(new Enemy(1080, h - 490, 'goomba', 6));
        enemies.push(new Enemy(1800, h - 90, 'goomba', 6));
        enemies.push(new Enemy(2000, h - 90, 'goomba', 6));

        coins.push(new Coin(320, h - 170));
        coins.push(new Coin(700, h - 330));
        coins.push(new Coin(1290, h - 410));
        coins.push(new Coin(1750, h - 90));
        coins.push(new Coin(1900, h - 90));
        coins.push(new Coin(2050, h - 90));

        return new Flag(2150, h - 150);
    }

    loadLevel8(h, platforms, enemies, coins) {
        platforms.push(new Platform(50, h - 50, 250, 50));
        platforms.push(new Platform(350, h - 120, 100, 50));
        platforms.push(new Platform(500, h - 200, 100, 50));
        platforms.push(new Platform(650, h - 280, 120, 50));
        platforms.push(new Platform(820, h - 200, 150, 50));
        platforms.push(new Platform(1020, h - 280, 100, 50));
        platforms.push(new Platform(1170, h - 360, 100, 50));
        platforms.push(new Platform(1320, h - 280, 100, 50));
        platforms.push(new Platform(1470, h - 200, 200, 50));
        platforms.push(new Platform(1720, h - 280, 90, 50));
        platforms.push(new Platform(1860, h - 200, 90, 50));
        platforms.push(new Platform(2000, h - 50, 400, 50));

        enemies.push(new Enemy(850, h - 240, 'bat', 7));
        enemies.push(new Enemy(920, h - 240, 'bat', 7));
        enemies.push(new Enemy(1500, h - 240, 'spider', 7));
        enemies.push(new Enemy(1620, h - 240, 'spider', 7));
        enemies.push(new Enemy(2100, h - 90, 'goomba', 7));

        coins.push(new Coin(380, h - 160));
        coins.push(new Coin(530, h - 240));
        coins.push(new Coin(690, h - 320));
        coins.push(new Coin(880, h - 240));
        coins.push(new Coin(1200, h - 400));
        coins.push(new Coin(1350, h - 320));
        coins.push(new Coin(1550, h - 240));
        coins.push(new Coin(1750, h - 320));
        coins.push(new Coin(1890, h - 240));
        coins.push(new Coin(2150, h - 90));

        return new Flag(2300, h - 150);
    }

    loadLevel9(h, platforms, enemies, coins) {
        platforms.push(new Platform(50, h - 300, 150, 50));
        platforms.push(new Platform(250, h - 250, 100, 50));
        platforms.push(new Platform(400, h - 200, 100, 50));
        platforms.push(new Platform(550, h - 250, 100, 50));
        platforms.push(new Platform(700, h - 300, 100, 50));
        platforms.push(new Platform(850, h - 250, 120, 50));
        platforms.push(new Platform(1020, h - 200, 100, 50));
        platforms.push(new Platform(1170, h - 280, 80, 50));
        platforms.push(new Platform(1300, h - 360, 80, 50));
        platforms.push(new Platform(1430, h - 280, 80, 50));
        platforms.push(new Platform(1560, h - 150, 150, 50));
        platforms.push(new Platform(1560, h - 50, 600, 50));

        enemies.push(new Enemy(870, h - 290, 'bat', 8));
        enemies.push(new Enemy(1040, h - 240, 'bat', 8));
        enemies.push(new Enemy(1600, h - 190, 'spider', 8));
        enemies.push(new Enemy(1700, h - 90, 'goomba', 8));
        enemies.push(new Enemy(1850, h - 90, 'goomba', 8));
        enemies.push(new Enemy(2000, h - 90, 'goomba', 8));

        coins.push(new Coin(280, h - 290));
        coins.push(new Coin(430, h - 240));
        coins.push(new Coin(580, h - 290));
        coins.push(new Coin(730, h - 340));
        coins.push(new Coin(890, h - 290));
        coins.push(new Coin(1050, h - 240));
        coins.push(new Coin(1330, h - 400));
        coins.push(new Coin(1460, h - 320));
        coins.push(new Coin(1600, h - 190));
        coins.push(new Coin(1750, h - 90));
        coins.push(new Coin(1900, h - 90));

        return new Flag(2100, h - 150);
    }

    loadLevel10(h, platforms, enemies, coins) {
        platforms.push(new Platform(50, h - 50, 150, 50));
        platforms.push(new Platform(250, h - 100, 80, 50));
        platforms.push(new Platform(380, h - 180, 80, 50));
        platforms.push(new Platform(510, h - 260, 80, 50));
        platforms.push(new Platform(640, h - 180, 80, 50));
        platforms.push(new Platform(770, h - 100, 80, 50));
        platforms.push(new Platform(920, h - 100, 150, 50));
        platforms.push(new Platform(1120, h - 180, 70, 50));
        platforms.push(new Platform(1240, h - 260, 70, 50));
        platforms.push(new Platform(1360, h - 180, 70, 50));
        platforms.push(new Platform(1480, h - 100, 70, 50));
        platforms.push(new Platform(1620, h - 100, 120, 50));
        platforms.push(new Platform(1790, h - 180, 80, 50));
        platforms.push(new Platform(1920, h - 260, 80, 50));
        platforms.push(new Platform(2050, h - 180, 80, 50));
        platforms.push(new Platform(2200, h - 50, 400, 50));

        enemies.push(new Enemy(950, h - 140, 'spider', 9));
        enemies.push(new Enemy(1020, h - 140, 'bat', 9));
        enemies.push(new Enemy(2300, h - 90, 'goomba', 9));
        enemies.push(new Enemy(2450, h - 90, 'goomba', 9));

        coins.push(new Coin(270, h - 140));
        coins.push(new Coin(400, h - 220));
        coins.push(new Coin(530, h - 300));
        coins.push(new Coin(660, h - 220));
        coins.push(new Coin(790, h - 140));
        coins.push(new Coin(970, h - 140));
        coins.push(new Coin(1140, h - 220));
        coins.push(new Coin(1260, h - 300));
        coins.push(new Coin(1380, h - 220));
        coins.push(new Coin(1500, h - 140));
        coins.push(new Coin(1670, h - 140));
        coins.push(new Coin(1810, h - 220));
        coins.push(new Coin(1940, h - 300));
        coins.push(new Coin(2070, h - 220));
        coins.push(new Coin(2350, h - 90));

        return new Flag(2500, h - 150);
    }

    loadLevel11(h, platforms, enemies, coins, bossRef) {
        platforms.push(new Platform(50, h - 50, 2400, 50));
        platforms.push(new Platform(200, h - 150, 150, 50));
        platforms.push(new Platform(450, h - 250, 120, 50));
        platforms.push(new Platform(700, h - 150, 150, 50));
        platforms.push(new Platform(1000, h - 250, 200, 50));
        platforms.push(new Platform(1300, h - 150, 150, 50));
        platforms.push(new Platform(1550, h - 250, 120, 50));
        platforms.push(new Platform(1800, h - 150, 150, 50));

        bossRef.value = new Boss(1200, h - 150);

        enemies.push(new Enemy(400, h - 90, 'bat', 10));
        enemies.push(new Enemy(800, h - 90, 'bat', 10));
        enemies.push(new Enemy(1600, h - 90, 'bat', 10));

        coins.push(new Coin(250, h - 190));
        coins.push(new Coin(500, h - 290));
        coins.push(new Coin(750, h - 190));
        coins.push(new Coin(1050, h - 290));
        coins.push(new Coin(1350, h - 190));
        coins.push(new Coin(1600, h - 290));
        coins.push(new Coin(1850, h - 190));

        return new Flag(2300, h - 150);
    }
}

/* ========================================
   GERENCIADOR DO JOGO (MAIN)
   ======================================== */
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Elementos da UI
        this.uiElements = {
            score: document.getElementById('score-hud'),
            level: document.getElementById('level-hud'),
            lives: document.getElementById('lives-hud'),
            startScreen: document.getElementById('start-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            winScreen: document.getElementById('win-screen'),
            finalScore: document.getElementById('final-score')
        };

        // Estado do jogo
        this.gameState = 'START';
        this.currentLevelIdx = 0;
        this.score = 0;
        this.lives = CONFIG.GAME.INITIAL_LIVES;
        this.cameraX = 0;
        this.frames = 0;

        // Entidades
        this.player = null;
        this.inputHandler = null;
        this.platforms = [];
        this.enemies = [];
        this.coins = [];
        this.flag = null;
        this.boss = null;

        // Gerenciadores
        this.levelManager = new LevelManager(this.canvas);

        // Referências mutáveis para passar às funções
        this.bossRef = { value: null };
        this.scoreRef = { value: this.score };

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.player = new Player(50, 0);
        this.inputHandler = new InputHandler(this.player);
    }

    resize() {
        const container = document.getElementById('game-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    start() {
        this.uiElements.startScreen.style.display = 'none';
        this.loadLevel(0);
        this.gameState = 'PLAYING';
        this.gameLoop();
    }

    reset() {
        this.score = 0;
        this.lives = CONFIG.GAME.INITIAL_LIVES;
        this.currentLevelIdx = 0;
        this.cameraX = 0;

        this.scoreRef.value = this.score;
        this.updateUI();

        this.uiElements.gameOverScreen.style.display = 'none';
        this.uiElements.winScreen.style.display = 'none';

        this.loadLevel(0);
        this.gameState = 'PLAYING';
        this.gameLoop();
    }

    loadLevel(levelIndex) {
        this.currentLevelIdx = levelIndex;
        this.flag = this.levelManager.loadLevel(
            levelIndex,
            this.platforms,
            this.enemies,
            this.coins,
            this.bossRef
        );
        this.boss = this.bossRef.value;
        this.player.reset(50, 0);
        this.cameraX = 0;
        this.updateUI();
    }

    updateUI() {
        this.uiElements.score.innerText = `MOEDAS: ${this.score}`;
        this.uiElements.level.innerText = `FASE: ${this.currentLevelIdx + 1}`;
        this.uiElements.lives.innerText = `VIDAS: ${this.lives}`;
    }

    takeDamage(amount) {
        this.lives -= amount;
        this.updateUI();

        if (this.lives <= 0) {
            this.gameState = 'GAMEOVER';
            this.uiElements.gameOverScreen.style.display = 'flex';
        } else {
            this.player.reset(50, 0);
            this.cameraX = 0;
            this.loadLevel(this.currentLevelIdx);
        }
    }

    nextLevel() {
        this.currentLevelIdx++;
        if (this.currentLevelIdx >= CONFIG.GAME.TOTAL_LEVELS) {
            this.gameState = 'WIN';
            this.uiElements.finalScore.innerText = this.score;
            this.uiElements.winScreen.style.display = 'flex';
        } else {
            this.loadLevel(this.currentLevelIdx);
        }
    }

    updateCamera() {
        const targetX = this.player.x - this.canvas.width / 3;
        if (targetX > this.cameraX) {
            this.cameraX += (targetX - this.cameraX) * 0.1;
        }
        if (this.cameraX < 0) {
            this.cameraX = 0;
        }
    }

    drawBackground() {
        const cloudOffset = this.cameraX * 0.5;

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

        this.ctx.beginPath();
        this.ctx.arc(100 - cloudOffset % 1000, 100, 40, 0, Math.PI * 2);
        this.ctx.arc(150 - cloudOffset % 1000, 120, 50, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(600 - cloudOffset % 1000, 80, 60, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(900 - cloudOffset % 1000, 150, 45, 0, Math.PI * 2);
        this.ctx.fill();
    }

    update() {
        const keys = this.inputHandler.getKeys();

        this.player.update(keys, this.frames);

        // Verificar colisão com plataformas
        for (const platform of this.platforms) {
            CollisionHandler.checkPlatformCollision(this.player, platform);
        }

        // Verificar queda no abismo
        if (this.player.y > this.canvas.height + 100) {
            this.takeDamage(3);
            return;
        }

        // Verificar colisão com inimigos
        for (const enemy of this.enemies) {
            enemy.update();
            const result = CollisionHandler.checkEnemyCollision(
                this.player,
                enemy,
                this.uiElements.score,
                this.scoreRef
            );
            if (result === 'damage') {
                this.takeDamage(1);
                return;
            }
        }

        // Remover inimigos mortos
        this.enemies = this.enemies.filter(e => !e.dead);

        // Verificar colisão com boss
        if (this.boss && !this.boss.dead) {
            this.boss.update(this.player.x);
            const result = CollisionHandler.checkBossCollision(
                this.player,
                this.boss,
                this.uiElements.score,
                this.scoreRef
            );
            if (result === 'damage') {
                this.takeDamage(1);
                return;
            }
        }

        // Verificar coleta de moedas
        for (const coin of this.coins) {
            coin.update();
            CollisionHandler.checkCoinCollection(
                this.player,
                coin,
                this.uiElements.score,
                this.scoreRef
            );
        }

        // Verificar colisão com bandeira
        if (this.flag && CollisionHandler.checkFlagCollision(this.player, this.flag)) {
            this.nextLevel();
        }

        this.updateCamera();
        this.score = this.scoreRef.value;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();

        this.flag?.draw(this.ctx, this.cameraX);

        for (const platform of this.platforms) {
            platform.draw(this.ctx, this.cameraX, this.canvas.width);
        }

        for (const coin of this.coins) {
            coin.draw(this.ctx, this.cameraX);
        }

        for (const enemy of this.enemies) {
            enemy.draw(this.ctx, this.cameraX, this.canvas.width);
        }

        if (this.boss) {
            this.boss.draw(this.ctx, this.cameraX);
        }

        this.player.draw(this.ctx, this.cameraX, this.frames);
    }

    gameLoop() {
        if (this.gameState !== 'PLAYING') return;

        this.update();
        this.draw();

        this.frames++;
        requestAnimationFrame(() => this.gameLoop());
    }
}

/* ========================================
   INICIALIZAÇÃO DO JOGO
   ======================================== */
let game = null;

window.addEventListener('DOMContentLoaded', () => {
    game = new Game();

    // Configurar botões das telas
    const startButton = document.querySelector('#start-screen button');
    const restartButton = document.querySelector('#game-over-screen button');
    const playAgainButton = document.querySelector('#win-screen button');

    if (startButton) {
        startButton.addEventListener('click', () => game.start());
    }

    if (restartButton) {
        restartButton.addEventListener('click', () => game.reset());
    }

    if (playAgainButton) {
        playAgainButton.addEventListener('click', () => game.reset());
    }
});

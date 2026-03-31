/**
 * InputHandler - Gerencia entradas de teclado e touch
 * Responsabilidade única: capturar e fornecer estado dos inputs
 */

import CONFIG from '../core/config.js';

class InputHandler {
    constructor() {
        this.keys = {
            right: false,
            left: false,
            up: false,
        };
        
        this.touchButtons = {
            left: null,
            right: null,
            jump: null,
        };

        this.setupKeyboardListeners();
    }

    /**
     * Configura listeners de teclado
     */
    setupKeyboardListeners() {
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    /**
     * Configura listeners de touch para botões mobile
     * @param {string} buttonId - ID do elemento botão
     * @param {string} keyName - Nome da tecla associada
     */
    setupTouchButton(buttonId, keyName) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        this.touchButtons[keyName] = button;

        // Touch events
        button.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.setKeyState(keyName, true);
        });

        button.addEventListener('touchend', (event) => {
            event.preventDefault();
            this.setKeyState(keyName, false);
        });

        // Mouse events (para teste no desktop)
        button.addEventListener('mousedown', () => this.setKeyState(keyName, true));
        button.addEventListener('mouseup', () => this.setKeyState(keyName, false));
        button.addEventListener('mouseleave', () => this.setKeyState(keyName, false));
    }

    /**
     * Processa evento de pressionar tecla
     * @param {KeyboardEvent} event 
     */
    handleKeyDown(event) {
        const { code } = event;

        if (CONFIG.INPUTS.MOVE_RIGHT.includes(code)) {
            this.keys.right = true;
        }
        if (CONFIG.INPUTS.MOVE_LEFT.includes(code)) {
            this.keys.left = true;
        }
        if (CONFIG.INPUTS.JUMP.includes(code) && !this.keys.up) {
            this.keys.up = true;
            return true; // Indica que foi um pulo
        }

        return false;
    }

    /**
     * Processa evento de soltar tecla
     * @param {KeyboardEvent} event 
     */
    handleKeyUp(event) {
        const { code } = event;

        if (CONFIG.INPUTS.MOVE_RIGHT.includes(code)) {
            this.keys.right = false;
        }
        if (CONFIG.INPUTS.MOVE_LEFT.includes(code)) {
            this.keys.left = false;
        }
        if (CONFIG.INPUTS.JUMP.includes(code)) {
            this.keys.up = false;
        }
    }

    /**
     * Define estado de uma tecla (usado para touch)
     * @param {string} keyName 
     * @param {boolean} isPressed 
     */
    setKeyState(keyName, isPressed) {
        if (keyName in this.keys) {
            this.keys[keyName] = isPressed;
        }
    }

    /**
     * Verifica se direção direita está ativa
     * @returns {boolean}
     */
    isMovingRight() {
        return this.keys.right;
    }

    /**
     * Verifica se direção esquerda está ativa
     * @returns {boolean}
     */
    isMovingLeft() {
        return this.keys.left;
    }

    /**
     * Verifica se input de pulo está ativo
     * @returns {boolean}
     */
    isJumpPressed() {
        return this.keys.up;
    }

    /**
     * Obtém objeto completo de inputs (para compatibilidade)
     * @returns {Object}
     */
    getKeys() {
        return { ...this.keys };
    }
}

export default InputHandler;

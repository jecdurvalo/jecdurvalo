/**
 * Ozzy Game - Main Entry Point
 * Inicializa e inicia o jogo
 */

import Game from './js/Game.js';

// Aguarda DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
    // Cria instância do jogo
    const game = new Game('gameCanvas');

    // Configura botões das telas
    const startBtn = document.querySelector('#start-screen button');
    const resetBtns = document.querySelectorAll('#game-over-screen button, #win-screen button');

    // Event listeners dos botões
    if (startBtn) {
        startBtn.addEventListener('click', () => game.start());
    }

    resetBtns.forEach(btn => {
        btn.addEventListener('click', () => game.reset());
    });
});

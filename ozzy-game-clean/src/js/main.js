/**
 * Ozzy Game - Main Entry Point
 * Inicializa e inicia o jogo
 */

import Game from './Game.js';

// Aguarda DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
    // Cria instância do jogo
    const game = new Game('gameCanvas');

    // Nota: Os listeners de botões agora são configurados dentro da classe Game
    // no método setupButtonListeners() para melhor encapsulamento
});

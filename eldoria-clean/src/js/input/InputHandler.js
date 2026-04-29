/**
 * InputHandler — teclado e mapeamento de controles.
 */
import { state } from '../core/GameState.js';
import { initAudio } from '../core/AudioManager.js';

export function initInput() {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup',   onKeyUp);
}

function onKeyDown(e) {
  initAudio();
  const k = e.key.toLowerCase();
  state.keys[k] = true;

  // Previne scroll da página com setas
  if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) {
    e.preventDefault();
  }
}

function onKeyUp(e) {
  state.keys[e.key.toLowerCase()] = false;
}

export function isMoving() {
  const { keys, joystick, controlMode } = state;
  if (joystick.active) return Math.abs(joystick.x) > 0.05 || Math.abs(joystick.y) > 0.05;
  if (controlMode === 'wasd') return keys.w || keys.s || keys.a || keys.d;
  return keys.arrowup || keys.arrowdown || keys.arrowleft || keys.arrowright;
}

export function getMoveVector() {
  const THREE = window.THREE;
  const { keys, joystick, controlMode } = state;
  const move = new THREE.Vector3(0, 0, 0);

  if (joystick.active) {
    move.x = joystick.x;
    move.z = joystick.y;
  } else if (controlMode === 'wasd') {
    if (keys.w) move.z -= 1;
    if (keys.s) move.z += 1;
    if (keys.a) move.x -= 1;
    if (keys.d) move.x += 1;
  } else {
    if (keys.arrowup)    move.z -= 1;
    if (keys.arrowdown)  move.z += 1;
    if (keys.arrowleft)  move.x -= 1;
    if (keys.arrowright) move.x += 1;
  }
  return move;
}

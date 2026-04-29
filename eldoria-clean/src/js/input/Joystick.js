/**
 * Joystick — controle virtual para mobile.
 */
import { state } from '../core/GameState.js';
import { initAudio } from '../core/AudioManager.js';

export function initJoystick() {
  const joyArea  = document.getElementById('joystickArea');
  const joyStick = document.getElementById('joystickStick');
  if (!joyArea || !joyStick) return;

  joyArea.addEventListener('touchstart', e => {
    state.joystick.active = true;
    handleJoy(e, joyArea, joyStick);
    initAudio();
  });

  window.addEventListener('touchmove', e => {
    if (!state.joystick.active) return;
    handleJoy(e, joyArea, joyStick);
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchend', () => {
    state.joystick.active = false;
    state.joystick.x = 0;
    state.joystick.y = 0;
    joyStick.style.transform = 'translate(0,0)';
  });
}

function handleJoy(e, joyArea, joyStick) {
  const touch = e.touches ? e.touches[0] : e;
  const rect = joyArea.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = touch.clientX - cx;
  const dy = touch.clientY - cy;
  const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 45);
  const angle = Math.atan2(dy, dx);

  state.joystick.x = Math.cos(angle) * (dist / 45);
  state.joystick.y = Math.sin(angle) * (dist / 45);
  joyStick.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
}

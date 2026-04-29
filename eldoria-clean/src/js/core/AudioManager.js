/**
 * AudioManager — sistema de áudio isolado usando Web Audio API.
 * Sons chiptune gerados proceduralmente (sem arquivos externos).
 */

let audioCtx = null;

export function initAudio() {
  if (audioCtx) return;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
}

export function playSound(type) {
  if (!audioCtx) return;
  try {
    const t = audioCtx.currentTime;

    function chip(freq, dur, vol, delay) {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.type = 'square';
      o.frequency.setValueAtTime(freq, t + delay);
      g.gain.setValueAtTime(vol, t + delay);
      g.gain.setValueAtTime(vol, t + delay + dur * 0.7);
      g.gain.linearRampToValueAtTime(0, t + delay + dur);
      o.start(t + delay); o.stop(t + delay + dur + 0.01);
    }

    function chipSweep(f1, f2, dur, vol, delay) {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.type = 'square';
      o.frequency.setValueAtTime(f1, t + delay);
      o.frequency.linearRampToValueAtTime(f2, t + delay + dur);
      g.gain.setValueAtTime(vol, t + delay);
      g.gain.linearRampToValueAtTime(0, t + delay + dur);
      o.start(t + delay); o.stop(t + delay + dur + 0.01);
    }

    switch (type) {
      case 'attack':    chipSweep(900, 200, 0.07, 0.22, 0); break;
      case 'hit':       chipSweep(600, 80, 0.1, 0.3, 0); chip(120, 0.08, 0.2, 0.05); break;
      case 'levelup':   [523,659,784,1047,1319].forEach((f,i) => chip(f, 0.12, 0.25, i*0.1)); break;
      case 'bossSpawn': chip(110,0.5,0.4,0); chip(220,0.5,0.3,0); chipSweep(880,440,0.4,0.25,0.1); break;
      case 'bossKill':  [523,659,784,659,784,1047].forEach((f,i) => chip(f, 0.1, 0.3, i*0.09)); chip(1319,0.25,0.35,0.56); break;
      case 'fireball':  chipSweep(400,900,0.06,0.2,0); chipSweep(900,300,0.1,0.15,0.06); break;
      case 'aoe':       [220,330,440].forEach(f => chip(f,0.4,0.35,0)); chipSweep(880,220,0.35,0.25,0.05); break;
      case 'collect':   chip(1320,0.08,0.22,0); chip(1760,0.1,0.22,0.08); break;
      case 'die':       [494,440,415,392,370,330,294,262].forEach((f,i) => chip(f,0.12,0.28,i*0.1)); break;
      case 'dash':      chipSweep(300,1400,0.12,0.25,0); break;
      case 'buy':       chip(880,0.07,0.2,0); chip(1320,0.1,0.22,0.07); break;
      case 'rareDrop':  [784,988,1175,1568].forEach((f,i) => chip(f,0.1,0.22,i*0.08)); break;
      case 'bossFireball': chip(440,0.05,0.2,0); chipSweep(440,150,0.12,0.2,0.05); break;
      case 'shield':    [523,784,1047].forEach((f,i) => chip(f,0.15,0.22,i*0.06)); break;
    }
  } catch(e) {}
}

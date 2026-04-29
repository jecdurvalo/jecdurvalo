/**
 * Testes unitários: EventBus
 */
import { describe, it, expect } from './runner.js';
import { EventBus } from '../src/js/core/EventBus.js';

describe('EventBus — on / emit', () => {
  it('handler é chamado ao emitir evento', () => {
    let called = false;
    EventBus.on('test:basic', () => { called = true; });
    EventBus.emit('test:basic');
    expect(called).toBeTruthy();
  });

  it('data é passada para o handler', () => {
    let received = null;
    EventBus.on('test:data', (d) => { received = d; });
    EventBus.emit('test:data', { value: 42 });
    expect(received?.value).toBe(42);
  });

  it('off remove o handler', () => {
    let count = 0;
    const handler = () => { count++; };
    EventBus.on('test:off', handler);
    EventBus.off('test:off', handler);
    EventBus.emit('test:off');
    expect(count).toBe(0);
  });

  it('once dispara apenas uma vez', () => {
    let count = 0;
    EventBus.once('test:once', () => { count++; });
    EventBus.emit('test:once');
    EventBus.emit('test:once');
    EventBus.emit('test:once');
    expect(count).toBe(1);
  });

  it('múltiplos handlers no mesmo evento', () => {
    let a = 0, b = 0;
    EventBus.on('test:multi', () => { a++; });
    EventBus.on('test:multi', () => { b++; });
    EventBus.emit('test:multi');
    expect(a).toBe(1);
    expect(b).toBe(1);
  });
});

/**
 * EventBus — padrão Observer para comunicação desacoplada entre módulos.
 * Uso: EventBus.on('evento', handler)  /  EventBus.emit('evento', dados)
 */
const listeners = new Map();

export const EventBus = {
  on(event, handler) {
    if (!listeners.has(event)) listeners.set(event, []);
    listeners.get(event).push(handler);
    return () => this.off(event, handler); // retorna unsubscribe
  },

  off(event, handler) {
    if (!listeners.has(event)) return;
    listeners.set(event, listeners.get(event).filter(h => h !== handler));
  },

  emit(event, data) {
    if (!listeners.has(event)) return;
    listeners.get(event).forEach(h => h(data));
  },

  once(event, handler) {
    const wrapper = (data) => { handler(data); this.off(event, wrapper); };
    this.on(event, wrapper);
  }
};

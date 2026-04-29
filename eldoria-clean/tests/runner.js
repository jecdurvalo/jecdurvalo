/**
 * Test runner minimalista — sem npm, sem bundler.
 * Abre tests/index.html no browser para ver os resultados.
 */
let passed = 0;
let failed = 0;
const results = [];

export function describe(suiteName, fn) {
  results.push({ type: 'suite', name: suiteName });
  fn();
}

export function it(testName, fn) {
  try {
    fn();
    passed++;
    results.push({ type: 'pass', name: testName });
  } catch (err) {
    failed++;
    results.push({ type: 'fail', name: testName, error: err.message });
  }
}

export function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected)
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toEqual(expected) {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b)
        throw new Error(`Expected ${b}, got ${a}`);
    },
    toBeGreaterThan(n) {
      if (!(actual > n))
        throw new Error(`Expected ${actual} > ${n}`);
    },
    toBeLessThanOrEqual(n) {
      if (!(actual <= n))
        throw new Error(`Expected ${actual} <= ${n}`);
    },
    toBeTruthy() {
      if (!actual)
        throw new Error(`Expected truthy, got ${actual}`);
    },
    toBeFalsy() {
      if (actual)
        throw new Error(`Expected falsy, got ${actual}`);
    },
    toContain(item) {
      if (!actual?.includes?.(item))
        throw new Error(`Expected array/string to contain ${item}`);
    },
    toBeInstanceOf(Cls) {
      if (!(actual instanceof Cls))
        throw new Error(`Expected instance of ${Cls.name}`);
    },
  };
}

export function getResults() { return { passed, failed, results }; }

export function renderResults(containerId = 'test-results') {
  const el = document.getElementById(containerId);
  if (!el) return;

  const total = passed + failed;
  el.innerHTML = `
    <div style="font-family:monospace;padding:16px;">
      <h2 style="color:${failed === 0 ? '#4caf50' : '#f44336'}">
        ${failed === 0 ? '✅' : '❌'} ${passed}/${total} testes passando
      </h2>
      ${results.map(r => {
        if (r.type === 'suite') return `<h3 style="color:#90caf9;margin:16px 0 6px">${r.name}</h3>`;
        if (r.type === 'pass')  return `<div style="color:#4caf50">  ✓ ${r.name}</div>`;
        return `<div style="color:#f44336">  ✗ ${r.name}<br><small style="color:#ff8a65;margin-left:16px">${r.error}</small></div>`;
      }).join('')}
    </div>
  `;
}

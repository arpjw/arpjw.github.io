/** A discrete, two-road teaching model. Ticks have no physical time unit. */
export const MODES = ['conflict', 'all-red', 'priority', 'cycle'];
export const DEFAULT_CONFIG = Object.freeze({ northGreen: 4, eastGreen: 4, yellow: 2, clearance: 1 });
export const INPUTS = Object.freeze([
  { north: false, east: false }, { north: false, east: true },
  { north: true, east: false }, { north: true, east: true },
]);
export const PHASES = ['N_GREEN', 'N_YELLOW', 'CLEAR_E', 'E_GREEN', 'E_YELLOW', 'CLEAR_N'];

export function validateConfig(config) {
  for (const name of ['northGreen', 'eastGreen', 'yellow', 'clearance']) {
    if (!Number.isInteger(config[name]) || config[name] < 1 || config[name] > 12) {
      throw new RangeError(`${name} must be an integer from 1 to 12`);
    }
  }
}
export function duration(phase, config) {
  return { N_GREEN: config.northGreen, E_GREEN: config.eastGreen,
    N_YELLOW: config.yellow, E_YELLOW: config.yellow,
    CLEAR_N: config.clearance, CLEAR_E: config.clearance }[phase];
}
export function initial(mode, config = DEFAULT_CONFIG) {
  validateConfig(config);
  if (!MODES.includes(mode)) throw new RangeError('Unknown controller');
  return mode === 'all-red' || mode === 'conflict'
    ? { phase: 'STOP', remaining: 1 }
    : { phase: 'N_GREEN', remaining: config.northGreen };
}
export function signals(state) {
  return {
    north: state.phase === 'BOTH' || state.phase === 'N_GREEN' ? 'green' : state.phase === 'N_YELLOW' ? 'yellow' : 'red',
    east: state.phase === 'BOTH' || state.phase === 'E_GREEN' ? 'green' : state.phase === 'E_YELLOW' ? 'yellow' : 'red',
  };
}
export function key(state) { return `${state.phase}:${state.remaining}`; }
export function step(mode, state, input = INPUTS[3], config = DEFAULT_CONFIG) {
  if (mode === 'all-red') return { phase: 'STOP', remaining: 1 };
  if (mode === 'conflict') return { phase: 'BOTH', remaining: 1 };
  if (state.remaining > 1) return { ...state, remaining: state.remaining - 1 };
  // Deliberately flawed: north demand can extend green forever despite east demand.
  if (mode === 'priority' && state.phase === 'N_GREEN' && input.north) {
    return { phase: 'N_GREEN', remaining: 1 };
  }
  const phase = PHASES[(PHASES.indexOf(state.phase) + 1) % PHASES.length];
  return { phase, remaining: duration(phase, config) };
}

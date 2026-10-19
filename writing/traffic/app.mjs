import { initial, step, signals, DEFAULT_CONFIG, key } from './src/controller.mjs';
import { check } from './src/checker.mjs';
const $ = id => document.getElementById(id);
const copy = {
  conflict: ['01', 'Everyone goes.', 'A broken controller gives both crossing roads green. One step is enough to expose the conflict.'],
  'all-red': ['02', 'Nobody goes.', 'Keeping every light red avoids conflicting greens forever. It also keeps everyone waiting forever.'],
  priority: ['03', 'One road wins.', 'North–south keeps green while its detector stays active. East–west demand is always present in this demonstration, but it can wait forever.'],
  cycle: ['04', 'Take turns.', 'A fixed cycle gives each road green, then yellow, then a red clearance before the other road can go.'],
};
const labels = { STOP: 'Both roads stopped', BOTH: 'Conflicting greens', N_GREEN: 'North–south green', N_YELLOW: 'North–south yellow', CLEAR_E: 'Clearance before east–west', E_GREEN: 'East–west green', E_YELLOW: 'East–west yellow', CLEAR_N: 'Clearance before north–south' };
let mode = 'cycle';
let config = { ...DEFAULT_CONFIG };
let state = initial(mode, config);
let tick = 0;
let timer = null;
function stop() { clearInterval(timer); timer = null; $('play').textContent = 'Play'; }
function render() {
  const light = signals(state);
  $('state-label').textContent = labels[state.phase];
  $('tick').textContent = `Tick ${tick}`;
  for (const road of ['north', 'east']) {
    $('' + road + '-signal').textContent = light[road][0].toUpperCase() + light[road].slice(1);
    for (const color of ['red', 'yellow', 'green']) $(road + '-' + color).setAttribute('class', color + (light[road] === color ? ' lit' : ''));
    $(road + '-route').setAttribute('class', 'route' + (light[road] === 'green' ? ' active' : light[road] === 'yellow' ? ' caution' : ''));
  }
  const [number, title, description] = copy[mode];
  $('mode-number').textContent = `CONTROLLER ${number}`;
  $('mode-title').textContent = title;
  $('mode-description').textContent = description;
  $('verdict').className = 'verdict' + (state.phase === 'BOTH' ? ' bad' : mode === 'cycle' ? ' good' : '');
  $('verdict').textContent = state.phase === 'BOTH' ? 'Conflict now: both roads have green.' : mode === 'conflict' ? 'Step once to reveal the conflict.' : mode === 'all-red' ? 'No conflicting greens. No service, either.' : mode === 'priority' ? (state.phase === 'N_GREEN' && $('north-demand').checked ? 'North demand can hold this green indefinitely.' : 'The detector affects the next north green extension.') : `This cycle has ${config.northGreen + config.eastGreen + 6} ticks. Every road gets a turn.`;
  document.querySelector('.timing').hidden = mode !== 'cycle';
  $('demand-control').hidden = mode !== 'priority';
  $('timing-note').textContent = mode === 'cycle' ? `Lengthening one green increases the other road’s longest red interval. Yellow and clearance remain fixed.` : 'Select Take turns to change the green durations.';
  document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
}
function reset() {
  stop(); state = initial(mode, config); tick = 0;
  $('check-result').innerHTML = '<p>Run the check to see what this controller guarantees.</p>';
  render();
}
function advance() { state = step(mode, state, { north: $('north-demand').checked, east: true }, config); tick++; render(); }
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => { mode = button.dataset.mode; reset(); }));
$('play').addEventListener('click', () => {
  if (timer) stop(); else { timer = setInterval(advance, 700); $('play').textContent = 'Pause'; }
});
$('step').addEventListener('click', () => { stop(); advance(); });
$('reset').addEventListener('click', reset);
$('north-demand').addEventListener('change', render);
for (const road of ['north', 'east']) {
  $(road + '-duration').addEventListener('input', event => {
    config[road + 'Green'] = Number(event.target.value);
    $(road + '-value').textContent = `${event.target.value} ticks`;
    reset();
  });
}
$('check').addEventListener('click', () => {
  const report = check(mode, config);
  const bound = road => report[road].guaranteed ? `Within ${report[road].maxTicksToGreen} ticks` : 'Can wait forever';
  let explanation = '';
  if (report.conflictTrace) explanation = 'Counterexample: ' + report.conflictTrace.map(edge => `${edge.from} → ${edge.to}`).join('; ') + '.';
  else if (!report.east.guaranteed) explanation = mode === 'all-red' ? 'Counterexample: STOP repeats forever. Neither road reaches green.' : 'Counterexample: N_GREEN:1 can repeat forever when north demand stays on, even if east demand stays on too.';
  else explanation = 'No reachable conflicting-green state and no cycle that avoids either road’s green. These are checks of the complete finite graph, not just the animation.';
  $('check-result').innerHTML = `<p><strong>${report.reachableStates} reachable states · ${report.inputTransitions} input-labeled transitions</strong></p><div class="results"><div class="result"><span>No conflicting greens</span><strong>${report.noConflictingGreens ? 'Pass' : 'Fail'}</strong></div><div class="result"><span>North–south green</span><strong>${bound('north')}</strong></div><div class="result"><span>East–west green</span><strong>${bound('east')}</strong></div></div><p class="trace">${explanation}</p><p class="small">Bounds start at tick boundaries and mean time to a green opportunity, not individual vehicle delay. All detector input sequences are included.</p>`;
});
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
// Exposes read-only state for reproducible browser checks and the screen recording.
window.trafficSnapshot = () => ({ mode, config: { ...config }, state: key(state), tick, signals: signals(state) });
window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'traffic-theme') return;
  document.documentElement.dataset.theme = event.data.dark ? 'dark' : 'light';
});
new ResizeObserver(() => {
  if (parent !== window) parent.postMessage({ type: 'traffic-height', height: Math.ceil(document.querySelector('main').getBoundingClientRect().height) + 2 }, location.origin);
}).observe(document.querySelector('main'));
render();

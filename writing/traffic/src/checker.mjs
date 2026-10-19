import { initial, step, signals, key, INPUTS, DEFAULT_CONFIG } from './controller.mjs';

/** Explore every reachable state under all four detector input combinations. */
export function explore(mode, config = DEFAULT_CONFIG) {
  const start = initial(mode, config);
  const nodes = new Map([[key(start), start]]);
  const edges = new Map();
  const parents = new Map([[key(start), null]]);
  const queue = [key(start)];
  for (let i = 0; i < queue.length; i++) {
    const from = queue[i];
    const outgoing = INPUTS.map(input => {
      const next = step(mode, nodes.get(from), input, config);
      const to = key(next);
      if (!nodes.has(to)) {
        nodes.set(to, next);
        parents.set(to, { from, input });
        queue.push(to);
      }
      return { to, input };
    });
    edges.set(from, outgoing);
  }
  return { nodes, edges, parents, start: key(start) };
}
function prefix(graph, target) {
  const path = [];
  for (let at = target; graph.parents.get(at);) {
    const edge = graph.parents.get(at);
    path.unshift({ from: edge.from, to: at, input: edge.input });
    at = edge.from;
  }
  return path;
}

/** A reachable cycle without this road's green is an infinite counterexample.
 * Otherwise this induced graph is a DAG; its longest path gives the exact
 * worst-case number of transitions to green from any reachable state.
 */
function service(graph, road) {
  const visiting = new Set();
  const memo = new Map();
  const stack = [];
  let witness = null;
  function visit(at) {
    if (signals(graph.nodes.get(at))[road] === 'green') return 0;
    if (visiting.has(at)) {
      const start = stack.findIndex(edge => edge.from === at);
      witness ??= { prefix: prefix(graph, at), cycle: stack.slice(start) };
      return Infinity;
    }
    if (memo.has(at)) return memo.get(at);
    visiting.add(at);
    let longest = 0;
    for (const edge of graph.edges.get(at)) {
      stack.push({ from: at, ...edge });
      longest = Math.max(longest, 1 + visit(edge.to));
      stack.pop();
    }
    visiting.delete(at);
    memo.set(at, longest);
    return longest;
  }
  let maximum = 0;
  for (const at of graph.nodes.keys()) maximum = Math.max(maximum, visit(at));
  return { guaranteed: Number.isFinite(maximum), maxTicksToGreen: Number.isFinite(maximum) ? maximum : null, witness };
}

export function check(mode, config = DEFAULT_CONFIG) {
  const graph = explore(mode, config);
  const bad = [...graph.nodes].find(([, state]) => {
    const light = signals(state);
    return light.north === 'green' && light.east === 'green';
  });
  return {
    mode, config: { ...config }, reachableStates: graph.nodes.size,
    inputTransitions: [...graph.edges.values()].reduce((sum, edges) => sum + edges.length, 0),
    noConflictingGreens: !bad,
    conflictTrace: bad ? prefix(graph, bad[0]) : null,
    north: service(graph, 'north'), east: service(graph, 'east'),
  };
}

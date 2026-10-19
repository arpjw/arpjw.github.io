(function () {
  'use strict';
  var cases = window.RNA_CASES;
  if (!Array.isArray(cases) || !cases.length) return;
  var caseSelect = document.getElementById('fold-case');
  var modelSelect = document.getElementById('fold-model');
  if (!caseSelect || !modelSelect) return;
  function pairs(structure) {
    var stack = [], result = [];
    Array.from(structure).forEach(function (c, i) {
      if (c === '(') stack.push(i);
      if (c === ')') result.push([stack.pop(), i]);
    });
    return result;
  }
  function svgElement(name, attrs, text) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attrs).forEach(function (key) { element.setAttribute(key, attrs[key]); });
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function update() {
    var item = cases[Number(caseSelect.value)];
    var sample = item.models[modelSelect.value];
    var svg = document.getElementById('fold-arcs');
    var target = pairs(item.target), predicted = pairs(sample.fold);
    var targetSet = new Set(target.map(String)), predictedSet = new Set(predicted.map(String));
    svg.replaceChildren();
    svg.setAttribute('aria-label', modelSelect.value + ' on ' + item.label + '. Requested pairs above, predicted pairs below. ' + (sample.exact ? 'Exact match.' : 'Not an exact match.'));
    svg.appendChild(svgElement('title', {}, 'Requested base pairs above the sequence; predicted base pairs below. ' + (sample.exact ? 'The prediction matches exactly.' : 'Some pairs differ.')));
    svg.appendChild(svgElement('text', {x: 16, y: 22, fill: 'var(--muted)', 'font-size': '12', 'font-family': 'var(--sans)'}, 'Requested pairs'));
    svg.appendChild(svgElement('text', {x: 16, y: 314, fill: 'var(--muted)', 'font-size': '12', 'font-family': 'var(--sans)'}, 'Predicted pairs'));
    var n = item.target.length, x = function (i) { return 18 + i * 604 / (n - 1); }, y = 166;
    svg.appendChild(svgElement('line', {x1: 18, x2: 622, y1: y, y2: y, stroke: 'var(--border)', 'stroke-width': 1}));
    function draw(pair, above, shared) {
      var left = x(pair[0]), right = x(pair[1]), height = Math.min(126, (right - left) * .55 + 8);
      var offset = above ? -height : height;
      var path = 'M ' + left + ' ' + y + ' Q ' + ((left+right)/2) + ' ' + (y + 2*offset) + ' ' + right + ' ' + y;
      svg.appendChild(svgElement('path', {d: path, fill: 'none', stroke: shared ? 'var(--article-accent)' : (above ? 'var(--plot-rust)' : 'var(--plot-blue)'), 'stroke-width': shared ? 1.5 : 2.2, 'stroke-dasharray': !shared && above ? '4 3' : 'none', opacity: .9}));
    }
    target.forEach(function (pair) { draw(pair,true,predictedSet.has(String(pair))); });
    predicted.forEach(function (pair) { draw(pair,false,targetSet.has(String(pair))); });
    for (var i=0;i<n;i++) svg.appendChild(svgElement('circle',{cx:x(i),cy:y,r:2.2,fill:'var(--foreground)'}));
    document.getElementById('fold-note').textContent = item.note + ' Target ID: ' + item.id + '.';
    document.getElementById('fold-sequence').textContent = sample.sequence;
    document.getElementById('fold-stats').textContent = (sample.exact ? 'Exact predicted fold' : 'Not an exact predicted fold') + ' · Pair F1 ' + sample.f1.toFixed(3) + ' · Ensemble defect ' + (sample.ensemble_defect*100).toFixed(1) + '%';
    document.getElementById('fold-target-text').textContent = item.target;
    document.getElementById('fold-prediction-text').textContent = sample.fold;
  }
  cases.forEach(function (item,index) {
    var option = document.createElement('option'); option.value = String(index); option.textContent = item.label; caseSelect.appendChild(option);
  });
  Object.keys(cases[0].models).forEach(function (model) {
    var option = document.createElement('option'); option.value = model; option.textContent = model; modelSelect.appendChild(option);
  });
  modelSelect.value = 'RL seed 17';
  caseSelect.addEventListener('change',update); modelSelect.addEventListener('change',update); update();
})();

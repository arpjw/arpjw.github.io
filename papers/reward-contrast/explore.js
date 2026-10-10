(function () {
  'use strict';
  var data = JSON.parse(document.getElementById('groups').textContent);
  var arm = document.getElementById('arm');
  var step = document.getElementById('step');
  var previous = document.getElementById('previous-group');
  var next = document.getElementById('next-group');
  var rows = document.getElementById('trajectory-rows');
  var maxCost = Math.max.apply(null, Object.keys(data).flatMap(function (key) {
    return data[key].flatMap(function (record) { return record.costs; });
  }));

  function element(tag, className, text) {
    var node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function render() {
    var group = Number(step.value);
    var record = data[arm.value][group - 1];
    document.getElementById('step-label').value = group + ' / ' + data[arm.value].length;
    document.getElementById('task-id').textContent = record.task_id;
    var status = document.getElementById('update-status');
    status.textContent = record.optimizer_updated ? 'Update applied' : 'Skipped: tied rewards';
    status.classList.toggle('active', record.optimizer_updated);
    previous.disabled = group === 1;
    next.disabled = group === data[arm.value].length;
    rows.replaceChildren();
    record.costs.forEach(function (cost, i) {
      var row = element('div', 'trajectory-row');
      row.appendChild(element('span', 'sample-number', String(i + 1).padStart(2, '0')));
      var visual = element('div', 'cost-visual');
      var meta = element('div', 'cost-meta');
      meta.appendChild(element('span', '', cost.toLocaleString('en-US') + ' tokens'));
      var track = element('div', 'cost-track');
      track.setAttribute('aria-hidden', 'true');
      var fill = element('span', 'cost-fill');
      fill.style.width = (100 * cost / maxCost) + '%';
      track.appendChild(fill);
      visual.appendChild(meta);
      visual.appendChild(track);
      row.appendChild(visual);
      var advantage = record.advantages[i];
      var value = element('div', 'advantage', (advantage > 0 ? '+' : '') + advantage.toFixed(6));
      value.appendChild(element('small', '', 'advantage'));
      row.appendChild(value);
      rows.appendChild(row);
    });
    document.getElementById('correct-count').textContent = record.successes + ' of 4 correct';
    document.getElementById('gradient-norm').textContent = 'Raw gradient norm ' + record.preclip_grad_norm.toFixed(2);
    document.getElementById('ceiling-count').textContent = record.ceiling_hits + ' of 4 ceiling hits';
  }

  arm.addEventListener('change', render);
  step.addEventListener('input', render);
  previous.addEventListener('click', function () { step.value = String(Number(step.value) - 1); render(); });
  next.addEventListener('click', function () { step.value = String(Number(step.value) + 1); render(); });
  render();
})();

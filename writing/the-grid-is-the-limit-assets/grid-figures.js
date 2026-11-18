// Interactive figures for The Grid Is the Limit. Every figure is fully rendered in HTML in its
// default state; this script only reveals controls and recomputes the same formulas used in
// graphics.py. Without JavaScript, all panes show stacked and the controls stay hidden.
(function () {
  var dataEl = document.getElementById('gl-data');
  if (!dataEl) return;
  var D = JSON.parse(dataEl.textContent);
  var H = D.hours;

  function $(root, sel) { return root.querySelector(sel); }
  function all(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function set(root, key, text) { all(root, '[data-gl-out="' + key + '"]').forEach(function (el) { el.textContent = text; }); }
  function html(root, key, markup) { all(root, '[data-gl-out="' + key + '"]').forEach(function (el) { el.innerHTML = markup; }); }
  function bar(root, key, value, max) { all(root, '[data-gl-bar="' + key + '"]').forEach(function (el) { el.style.width = Math.max(0, Math.min(100, 100 * value / max)).toFixed(3) + '%'; }); }
  function pct(x, d) { return (100 * x).toFixed(d) + '%'; }
  function comma(x, d) { return x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function later(fn) { var t; return function () { clearTimeout(t); t = setTimeout(fn, 350); }; }
  function reveal(fig) {
    fig.classList.add('gl-js');
    all(fig, '[data-gl-ctl]').forEach(function (el) { el.hidden = false; });
  }
  function tabs(fig, name) {
    var radios = all(fig, 'input[name="' + name + '"]');
    function show() {
      var v = radios.filter(function (r) { return r.checked; })[0].value;
      all(fig, '.gl-pane').forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== v; });
    }
    radios.forEach(function (r) { r.addEventListener('change', show); });
    show();
  }

  var setups = {
    quantities: function (fig) {
      tabs(fig, 'gl-q-tab');
      var input = $(fig, '#gl-q-lf');
      var announce = later(function () { set(fig, 'read', msg); });
      var msg = '';
      function render() {
        var lf = Number(input.value) / 100;
        var one = 1 * H * lf;
        var conn = D.lbnlRef / H / lf;
        set(fig, 'lf', pct(lf, 0));
        set(fig, 'lf2', lf.toFixed(2));
        set(fig, 'one', one.toFixed(3) + ' TWh a year');
        set(fig, 'one-v', one.toFixed(2) + ' TWh');
        set(fig, 'conn', conn.toFixed(1) + ' GW');
        bar(fig, 'one', one, 10.95);
        bar(fig, 'conn', conn, 320);
        input.setAttribute('aria-valuetext', pct(lf, 0) + ' load factor');
        msg = 'At ' + pct(lf, 0) + ' average use, a 1 GW connection uses ' + one.toFixed(3) + ' TWh a year, and ' + comma(D.lbnlRef, 0) +
          ' TWh implies about ' + conn.toFixed(1) + ' GW of connection. Berkeley Lab assumed 50%, which gives ' + D.lbnlConn50.toFixed(1) + ' GW.';
        announce();
      }
      input.addEventListener('input', render);
      render();
    },

    tabs: function (fig) {
      var radio = $(fig, 'input[type="radio"]');
      if (radio) tabs(fig, radio.name);
    },

    whopays: function (fig) {
      var ids = ['cap', 'crf', 'mw', 'lf'];
      var defaults = { cap: 500, crf: 8, mw: 200, lf: 80 };
      var inputs = {};
      ids.forEach(function (k) { inputs[k] = $(fig, '#gl-w-' + k); });
      var msg = '';
      var announce = later(function () { html(fig, 'read', msg); });
      function money(m) { return m >= 1000 ? '$' + (m / 1000).toFixed(2).replace(/\.?0+$/, '') + ' billion' : '$' + m.toFixed(0) + ' million'; }
      function render() {
        var cap = Number(inputs.cap.value), crf = Number(inputs.crf.value) / 100, mw = Number(inputs.mw.value), lf = Number(inputs.lf.value) / 100;
        var annual = cap * 1e6 * crf;
        var kwh = mw * 1000 * 8760 * lf;
        var kwhFull = 1000 * 1000 * 8760 * lf;
        var c = 100 * annual / kwh;
        var cFull = 100 * annual / kwhFull;
        var short = annual * (1 - mw / 1000);
        set(fig, 'cap', money(cap));
        set(fig, 'crf', pct(crf, 1));
        set(fig, 'mw', comma(mw, 0) + ' MW');
        set(fig, 'lf', pct(lf, 0));
        set(fig, 'annual', '$' + (annual / 1e6).toFixed(1) + ' million');
        set(fig, 'kwh', (kwh / 1e9).toFixed(4) + ' billion kWh');
        set(fig, 'c', c.toFixed(3) + '¢');
        set(fig, 'cfull', cFull.toFixed(3) + '¢');
        set(fig, 'c-v', c.toFixed(3) + '¢/kWh');
        set(fig, 'cfull-v', cFull.toFixed(3) + '¢/kWh');
        html(fig, 'mwlabel', 'Realized ' + comma(mw, 0) + ' MW<small>same fixed cost</small>');
        bar(fig, 'c', 0.7 * c, c);
        bar(fig, 'cfull', 0.7 * cFull, c);
        html(fig, 'eq', '$' + cap.toFixed(0) + 'M × ' + pct(crf, 1) + ' = $' + (annual / 1e6).toFixed(1) + 'M a year ÷ (' + comma(mw, 0) + ' MW × 8,760 h × ' + pct(lf, 0) +
          ' = ' + (kwh / 1e9).toFixed(4) + 'B kWh) = <span class="gl-res">' + c.toFixed(3) + '¢ per kWh</span>');
        inputs.cap.setAttribute('aria-valuetext', money(cap));
        inputs.crf.setAttribute('aria-valuetext', pct(crf, 1));
        inputs.mw.setAttribute('aria-valuetext', comma(mw, 0) + ' megawatts');
        inputs.lf.setAttribute('aria-valuetext', pct(lf, 0));
        msg = mw >= 1000
          ? 'At full use the per-kWh charge recovers the whole <b>$' + (annual / 1e6).toFixed(1) + ' million a year</b>; nothing is left unrecovered in this simplification.'
          : 'If the upgrade were recovered through a per-kWh charge set for full use, <b>$' + (short / 1e6).toFixed(1) + ' million a year</b> would go unrecovered at ' + comma(mw, 0) + ' MW, and a tariff or contract must say who pays it.';
        announce();
      }
      ids.forEach(function (k) { inputs[k].addEventListener('input', render); });
      $(fig, '[data-gl-reset]').addEventListener('click', function () {
        ids.forEach(function (k) { inputs[k].value = defaults[k]; });
        render();
        inputs.cap.focus();
      });
      render();
    },

    compute: function (fig) {
      var radios = all(fig, 'input[name="gl-c-s"]');
      var span = 54;
      function place(row, a, b) {
        var bar = $(fig, '[data-gl-row="' + row + '"] .gl-gantt__bar');
        if (!bar) return;
        bar.style.left = (100 * a / span).toFixed(3) + '%';
        bar.style.width = (100 * Math.max(0, b - a) / span).toFixed(3) + '%';
      }
      function render() {
        var key = radios.filter(function (r) { return r.checked; })[0].value;
        var s = D.timeline[key];
        place('chips', 0, s.chips_end);
        place('grid', 8, s.grid_end);
        place('wait', s.chips_end, s.powered - 3);
        place('comm', s.powered - 3, s.powered);
        place('ramp', s.powered, s.sustained);
        var ms = all(fig, '.gl-gantt__ms');
        // milestones: GPU order, connection reserved, energized, powered compute
        [[2, s.grid_end], [3, s.powered]].forEach(function (pair) {
          var m = ms[pair[0]];
          if (!m) return;
          m.style.left = (100 * pair[1] / span).toFixed(3) + '%';
          m.classList.toggle('is-left', pair[1] > span * 0.6);
        });
        set(fig, 'powered', 'month ' + s.powered);
        set(fig, 'sustained', 'month ' + s.sustained);
        set(fig, 'idle', s.idle + ' months');
        var text = {
          plan: 'On plan, the grid connection is the last dependency, so powered compute begins in month ' + s.powered + ' and delivered chips wait ' + s.idle + ' months.',
          grid: 'A 12-month transformer delay moves powered compute to month ' + s.powered + '; delivered chips now wait ' + s.idle + ' months.',
          chips: 'A 6-month chip delay changes nothing about the start date, month ' + s.powered + ', because the grid still binds; chips wait ' + s.idle + ' months instead.'
        }[key];
        set(fig, 'read', text);
      }
      radios.forEach(function (r) { r.addEventListener('change', render); });
      render();
    },

    scenarios: function (fig) {
      var years = all(fig, 'input[name="gl-s-y"]');
      var cases = all(fig, 'input[name="gl-s-c"]');
      var gw = $(fig, '#gl-s-gw');
      var lfIn = $(fig, '#gl-s-lf');
      var msg = '';
      var announce = later(function () { set(fig, 'read', msg); });
      function checked(list) { var c = list.filter(function (r) { return r.checked; })[0]; return c ? c.value : null; }
      function labelCases() {
        var y = checked(years);
        D.scen[y].forEach(function (g, i) {
          var name = ['Low', 'Middle', 'High'][i];
          set(fig, 'case-' + name, '');
          var span = $(fig, '[data-gl-case="' + name + '"]');
          if (span) span.textContent = name + ' · ' + g + ' GW';
        });
      }
      function fromCase() {
        var y = checked(years), c = checked(cases);
        if (!c) return;
        gw.value = D.scen[y][['Low', 'Middle', 'High'].indexOf(c)];
        lfIn.value = 80;
      }
      function render() {
        var g = Number(gw.value), lf = Number(lfIn.value) / 100;
        var twh = g * H * lf;
        var y = checked(years), c = checked(cases);
        var matches = c && D.scen[y][['Low', 'Middle', 'High'].indexOf(c)] === g && lf === 0.8;
        if (!matches) cases.forEach(function (r) { r.checked = false; });
        set(fig, 'gw', g + ' GW');
        set(fig, 'gw2', g + ' GW');
        set(fig, 'lf', pct(lf, 0));
        set(fig, 'lf2', lf.toFixed(2));
        set(fig, 'twh', twh.toFixed(2) + ' TWh a year');
        set(fig, 'twh-v', twh.toFixed(2) + ' TWh');
        set(fig, 'share', pct(twh / D.eiaGen, 1));
        set(fig, 'avg', (g * lf).toFixed(1) + ' GW');
        bar(fig, 'twh', twh, 1400);
        gw.setAttribute('aria-valuetext', g + ' gigawatts operating');
        lfIn.setAttribute('aria-valuetext', pct(lf, 0) + ' load factor');
        var label = matches ? y + ' ' + c.toLowerCase() + ' case: ' : 'Custom: ';
        msg = label + g + ' GW operating at ' + pct(lf, 0) + ' uses ' + twh.toFixed(2) + ' TWh a year, ' + pct(twh / D.eiaGen, 1) + " of EIA's 2026 generation forecast.";
        announce();
      }
      years.forEach(function (r) { r.addEventListener('change', function () { labelCases(); if (!checked(cases)) { cases[1].checked = true; } fromCase(); render(); }); });
      cases.forEach(function (r) { r.addEventListener('change', function () { fromCase(); render(); }); });
      gw.addEventListener('input', render);
      lfIn.addEventListener('input', render);
      labelCases();
      render();
    }
  };

  all(document, '[data-gl]').forEach(function (fig) {
    var fn = setups[fig.getAttribute('data-gl')];
    if (!fn) return;
    reveal(fig);
    fn(fig);
  });
})();

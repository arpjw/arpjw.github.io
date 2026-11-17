// Figure 1: GS-5 billing floors. Without JavaScript the figure shows the 50 MW case and the slider stays hidden.
(function () {
  var figure = document.querySelector('.dm-grid');
  if (!figure) return;
  var controls = figure.querySelector('[data-dm-grid-controls]');
  var input = figure.querySelector('#dm-grid-d');
  var output = figure.querySelector('#dm-grid-out');
  var readout = figure.querySelector('#dm-grid-readout');
  var reset = figure.querySelector('[data-dm-grid-reset]');
  var CONTRACT = 100;
  var DEFAULT = 50;
  var announce;

  function describe(d) {
    var dt = Math.max(d, 85);
    var gen = Math.max(d, 60);
    return 'At ' + d + ' MW of measured demand, distribution and transmission are each billed on ' + dt + ' MW, ' +
      (d < 85 ? 'set by the 85 MW floor' : 'set by measured demand') + '. Generation is billed on ' + gen + ' MW, ' +
      (d < 60 ? 'set by the 60 MW floor' : 'set by measured demand') + '.';
  }

  function render(d) {
    figure.querySelectorAll('svg[data-dm-grid]').forEach(function (svg) {
      var x0 = Number(svg.getAttribute('data-x0'));
      var x1 = Number(svg.getAttribute('data-x1'));
      var x = function (mw) { return x0 + (x1 - x0) * mw / CONTRACT; };
      svg.querySelectorAll('[data-row]').forEach(function (row) {
        var floor = Number(row.getAttribute('data-floor'));
        var meas = row.querySelector('[data-part="meas"]');
        var top = row.querySelector('[data-part="top"]');
        var y = Number(meas.getAttribute('y'));
        meas.setAttribute('width', x(d) - x0);
        top.setAttribute('x', x(d));
        top.setAttribute('width', Math.max(0, x(floor) - x(d)));
        row.querySelector('[data-part="mark"]').setAttribute('d', 'M' + x(d) + ' ' + (y - 3) + 'V' + (y + 23));
        row.querySelector('[data-part="v1"]').textContent = Math.max(d, floor) + ' MW billed';
        row.querySelector('[data-part="v2"]').textContent = d < floor
          ? ' · ' + d + ' measured + ' + (floor - d) + ' from the floor'
          : ' · measured demand; floor not binding';
      });
      var label = svg.querySelector('[data-part="dlabel"]');
      label.setAttribute('x', x(d));
      label.setAttribute('text-anchor', d < 15 ? 'start' : d > 85 ? 'end' : 'middle');
      label.textContent = 'measured demand ' + d + ' MW';
    });
    output.textContent = d + ' MW';
    input.setAttribute('aria-valuetext', d + ' megawatts');
    // Announce once the reader pauses, not on every step of a drag.
    clearTimeout(announce);
    announce = setTimeout(function () { readout.textContent = describe(d); }, 350);
  }

  controls.hidden = false;
  input.addEventListener('input', function () { render(Number(input.value)); });
  reset.addEventListener('click', function () {
    input.value = DEFAULT;
    render(DEFAULT);
    input.focus();
  });
  render(Number(input.value));
})();

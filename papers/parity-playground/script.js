(function () {
  'use strict';

  var sequences = {
    quiet: [0.48, 0.48, 0.48, 0.48, 0.50, 0.50, 0.50, 0.49, 0.49, 0.49, 0.49, 0.52, 0.52, 0.52, 0.51, 0.51],
    mixed: [0.42, 0.42, 0.44, 0.44, 0.43, 0.46, 0.46, 0.47, 0.45, 0.45, 0.48, 0.47, 0.47, 0.50, 0.49, 0.51],
    active: [0.35, 0.38, 0.34, 0.40, 0.37, 0.43, 0.39, 0.46, 0.42, 0.48, 0.44, 0.51, 0.47, 0.54, 0.50, 0.56]
  };

  var selectedSequence = 'quiet';
  var deduplicate = document.querySelector('[data-deduplicate]');
  var manufacturedLab = document.querySelector('.manufactured-lab');
  var chart = document.querySelector('[data-price-chart]');
  var sequenceButtons = document.querySelectorAll('[data-sequence]');

  function formatPercent(value) {
    return (value * 100).toFixed(1) + '%';
  }

  function escapeXml(value) {
    return String(value).replace(/[<>&'\"]/g, function (character) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character];
    });
  }

  function filteredSequence(values) {
    if (!deduplicate.checked) return values.slice();
    return values.filter(function (value, index) { return index === 0 || value !== values[index - 1]; });
  }

  function persistenceMetrics(values) {
    var squareError = 0;
    var flat = 0;
    for (var index = 1; index < values.length; index += 1) {
      var change = values[index] - values[index - 1];
      squareError += change * change;
      if (change === 0) flat += 1;
    }
    var transitions = Math.max(1, values.length - 1);
    return {
      flat: flat,
      flatShare: flat / transitions,
      direction: flat / transitions,
      rmse: Math.sqrt(squareError / transitions)
    };
  }

  function renderPriceChart(values) {
    var width = 900;
    var height = 260;
    var inset = { top: 20, right: 18, bottom: 30, left: 42 };
    var min = Math.min.apply(null, values) - 0.02;
    var max = Math.max.apply(null, values) + 0.02;
    var x = function (index) { return inset.left + index * (width - inset.left - inset.right) / Math.max(1, values.length - 1); };
    var y = function (value) { return inset.top + (max - value) * (height - inset.top - inset.bottom) / Math.max(0.01, max - min); };
    var points = values.map(function (value, index) { return x(index).toFixed(1) + ',' + y(value).toFixed(1); }).join(' ');
    var grid = [0, 0.5, 1].map(function (fraction) {
      var gridY = inset.top + fraction * (height - inset.top - inset.bottom);
      var label = (max - fraction * (max - min)).toFixed(2);
      return '<line class="chart-grid" x1="' + inset.left + '" y1="' + gridY + '" x2="' + (width - inset.right) + '" y2="' + gridY + '"></line>' +
        '<text class="chart-label" x="0" y="' + (gridY + 3) + '">' + escapeXml(label) + '</text>';
    }).join('');
    var dots = values.map(function (value, index) {
      var flat = index > 0 && value === values[index - 1];
      return '<circle class="chart-dot' + (flat ? ' chart-flat' : '') + '" cx="' + x(index).toFixed(1) + '" cy="' + y(value).toFixed(1) + '" r="4"></circle>';
    }).join('');
    var note = deduplicate.checked
      ? '<text class="chart-note" x="' + (width - inset.right) + '" y="14" text-anchor="end">Every remaining step moves</text>'
      : '<text class="chart-label" x="' + (width - inset.right) + '" y="14" text-anchor="end">Rust dots are correctly predicted flat steps</text>';

    chart.innerHTML = '<svg viewBox="0 0 ' + width + ' ' + height + '" aria-hidden="true">' + grid +
      '<polyline class="chart-path" points="' + points + '"></polyline>' + dots + note +
      '<text class="chart-label" x="' + (width - inset.right) + '" y="' + (height - 3) + '" text-anchor="end">observation →</text></svg>';
  }

  function updateManufactured() {
    var source = sequences[selectedSequence];
    var values = filteredSequence(source);
    var metrics = persistenceMetrics(values);
    renderPriceChart(values);
    document.querySelector('[data-observations]').textContent = String(values.length);
    document.querySelector('[data-flat-share]').textContent = formatPercent(metrics.flatShare);
    document.querySelector('[data-direction-accuracy]').textContent = formatPercent(metrics.direction);
    document.querySelector('[data-persistence-rmse]').textContent = metrics.rmse.toFixed(3);
    manufacturedLab.classList.toggle('is-deduplicated', deduplicate.checked);
    document.querySelector('[data-manufactured-verdict]').textContent = deduplicate.checked
      ? 'The data now guarantees that persistence is wrong on direction at every step. The benchmark changed before the model did.'
      : 'Keep every tick and persistence receives credit for correctly predicting quiet steps.';
    chart.setAttribute('aria-label', (deduplicate.checked ? 'Deduplicated' : 'Raw') + ' illustrative price sequence with ' + values.length + ' observations and ' + formatPercent(metrics.flatShare) + ' flat steps.');
  }

  sequenceButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectedSequence = button.dataset.sequence;
      sequenceButtons.forEach(function (candidate) { candidate.setAttribute('aria-pressed', String(candidate === button)); });
      updateManufactured();
    });
  });
  deduplicate.addEventListener('change', updateManufactured);

  var ladderData = {
    partition: {
      labels: ['≤ 57°F', '58°F', '59°F', '≥ 60°F'],
      actual: [0.12, 0.25, 0.38, 0.25],
      coherent: [0.14, 0.23, 0.40, 0.23],
      incoherent: [0.14, 0.27, 0.40, 0.27]
    },
    cdf: {
      labels: ['Over 44.5', 'Over 45.5', 'Over 46.5', 'Over 47.5'],
      actual: [0.56, 0.53, 0.50, 0.47],
      coherent: [0.54, 0.54, 0.49, 0.49],
      incoherent: [0.54, 0.55, 0.48, 0.49]
    }
  };
  var selectedGeometry = 'partition';
  var selectedPreset = 'coherent';
  var geometryButtons = document.querySelectorAll('[data-geometry]');
  var presetButtons = document.querySelectorAll('[data-preset]');
  var ladder = document.querySelector('[data-ladder]');
  var coherenceLab = document.querySelector('.coherence-lab');

  function setButtonGroup(buttons, active) {
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.geometry === active || button.dataset.preset === active));
    });
  }

  function currentForecast() {
    return Array.from(ladder.querySelectorAll('input[type="range"]')).map(function (input) { return Number(input.value); });
  }

  function calculateCoherence(values) {
    var actual = ladderData[selectedGeometry].actual;
    var mse = values.reduce(function (total, value, index) {
      return total + Math.pow(value - actual[index], 2);
    }, 0) / values.length;
    var error;
    if (selectedGeometry === 'partition') {
      var predictedMass = values.reduce(function (total, value) { return total + value; }, 0);
      var actualMass = actual.reduce(function (total, value) { return total + value; }, 0);
      error = Math.abs(predictedMass - actualMass);
    } else {
      error = values.slice(1).reduce(function (total, value, index) {
        return total + Math.max(value - values[index], 0);
      }, 0);
    }
    return { rmse: Math.sqrt(mse), coherence: error };
  }

  function updateLadderScores() {
    var values = currentForecast();
    var scores = calculateCoherence(values);
    ladder.querySelectorAll('.ladder-value strong').forEach(function (value, index) { value.textContent = values[index].toFixed(2); });
    document.querySelector('[data-ladder-rmse]').textContent = scores.rmse.toFixed(3);
    document.querySelector('[data-coherence-error]').textContent = scores.coherence.toFixed(3);
    document.querySelector('[data-coherence-unit]').textContent = selectedGeometry === 'partition' ? 'mass' : 'violation';
    document.querySelector('[data-rmse-track]').style.width = Math.min(100, scores.rmse * 500) + '%';
    document.querySelector('[data-coherence-track]').style.width = Math.min(100, scores.coherence * 800) + '%';
    var coherent = scores.coherence < 0.0005;
    coherenceLab.classList.toggle('is-coherent', coherent);
    coherenceLab.classList.toggle('is-incoherent', !coherent);
    if (selectedGeometry === 'partition') {
      document.querySelector('[data-coherence-verdict]').textContent = coherent
        ? 'This forecast preserves total probability mass. Its accuracy is not the whole story, but it is internally possible.'
        : 'The bins carry ' + scores.coherence.toFixed(3) + ' too much or too little total mass. RMSE does not identify that structural error.';
    } else {
      document.querySelector('[data-coherence-verdict]').textContent = coherent
        ? 'Probabilities never rise as the threshold gets harder. This forecast respects the ladder ordering.'
        : 'The forecast rises by ' + scores.coherence.toFixed(3) + ' across harder thresholds. That is a no-arbitrage violation visible without labels.';
    }
  }

  function renderLadder() {
    var data = ladderData[selectedGeometry];
    var values = data[selectedPreset];
    ladder.innerHTML = data.labels.map(function (label, index) {
      return '<label class="ladder-row">' +
        '<span class="ladder-label"><strong>' + escapeXml(label) + '</strong><span>realized next: ' + data.actual[index].toFixed(2) + '</span></span>' +
        '<input type="range" min="0" max="1" step="0.01" value="' + values[index].toFixed(2) + '" aria-label="Forecast probability for ' + escapeXml(label) + '">' +
        '<span class="ladder-value"><strong>' + values[index].toFixed(2) + '</strong> <span>forecast</span></span>' +
        '</label>';
    }).join('');
    ladder.querySelectorAll('input[type="range"]').forEach(function (input) {
      input.addEventListener('input', function () {
        selectedPreset = 'custom';
        setButtonGroup(presetButtons, selectedPreset);
        updateLadderScores();
      });
    });
    updateLadderScores();
  }

  geometryButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectedGeometry = button.dataset.geometry;
      selectedPreset = 'coherent';
      setButtonGroup(geometryButtons, selectedGeometry);
      setButtonGroup(presetButtons, selectedPreset);
      renderLadder();
    });
  });
  presetButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectedPreset = button.dataset.preset;
      setButtonGroup(presetButtons, selectedPreset);
      renderLadder();
    });
  });

  updateManufactured();
  renderLadder();
})();

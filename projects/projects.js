(function () {
  var groups = document.querySelectorAll('.project-group');
  var frame = 0;

  function drawBranches() {
    frame = 0;
    groups.forEach(function (group) {
      var svg = group.querySelector('.project-branches');
      var bounds = svg.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      var label = group.querySelector('h2').getBoundingClientRect();
      var sourceY = label.top + label.height / 2 - bounds.top;
      var bend = bounds.width * 0.48;
      var paths = [];

      group.querySelectorAll('.project-items > li').forEach(function (item) {
        var link = item.querySelector('a');
        var firstLine = link.getClientRects()[0];
        if (!firstLine) return;
        var targetY = firstLine.top + firstLine.height / 2 - bounds.top;
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 0 ' + sourceY + ' C ' + bend + ' ' + sourceY + ', ' + bend + ' ' + targetY + ', ' + bounds.width + ' ' + targetY);
        paths.push(path);
      });

      svg.setAttribute('viewBox', '0 0 ' + bounds.width + ' ' + bounds.height);
      svg.replaceChildren.apply(svg, paths);
    });
  }

  function scheduleDraw() {
    if (!frame) frame = requestAnimationFrame(drawBranches);
  }

  if ('ResizeObserver' in window) {
    var observer = new ResizeObserver(scheduleDraw);
    groups.forEach(function (group) { observer.observe(group); });
  } else {
    window.addEventListener('resize', scheduleDraw);
  }

  if (document.fonts) document.fonts.ready.then(scheduleDraw);
  scheduleDraw();
})();

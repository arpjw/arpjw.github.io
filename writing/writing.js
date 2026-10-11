(function () {
  var toc = document.querySelector('.writing-toc');
  if (!toc) return;

  var links = Array.from(toc.querySelectorAll('a[href^="#"]'));
  var sections = links.map(function (link) {
    return document.getElementById(link.hash.slice(1));
  });
  var scheduled = false;

  function updateCurrentSection() {
    scheduled = false;
    var current = 0;
    sections.forEach(function (section, index) {
      if (section && section.getBoundingClientRect().top <= 180) current = index;
    });
    links.forEach(function (link, index) {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateCurrentSection);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  updateCurrentSection();

  document.querySelectorAll('.writing-toc-mobile a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var details = link.closest('details');
      if (details) details.open = false;
    });
  });
})();

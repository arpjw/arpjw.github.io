(function () {
  var body = document.querySelector('.writing-post__body');
  var citations = document.querySelectorAll('.writing-citation');
  function positionCitations() {
    citations.forEach(function (citation) {
      var note = citation.querySelector('.writing-citation__note');
      if (!note) return;
      if (window.matchMedia('(max-width: 68rem)').matches) {
        note.classList.remove('is-rail');
        note.style.removeProperty('left');
      } else if (body) {
        note.classList.add('is-rail');
        note.style.left = (body.getBoundingClientRect().right - citation.getBoundingClientRect().left + 36) + 'px';
      }
    });
  }
  window.addEventListener('resize', positionCitations);
  positionCitations();
  if (document.fonts) document.fonts.ready.then(positionCitations);

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

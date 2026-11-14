(function () {
  var body = document.querySelector('.writing-post__body');
  var citations = document.querySelectorAll('.writing-citation');
  var endnotes = document.querySelector('[data-writing-endnotes]');
  var noteHomes = new Map();
  var printing = false;
  if (endnotes) {
    endnotes.querySelectorAll('.writing-citation__note[id]').forEach(function (note) {
      noteHomes.set(note.id, { note: note, parent: note.parentElement });
    });
  }
  function positionCitations() {
    var useRail = body && !printing && window.matchMedia('(width > 68rem)').matches;
    var railEdge = useRail ? body.getBoundingClientRect().right + 36 : 0;
    var previousBottom = -Infinity;
    citations.forEach(function (citation) {
      var mark = endnotes && citation.querySelector('.writing-citation__mark');
      var home = mark && noteHomes.get(mark.hash.slice(1));
      var note = home ? home.note : citation.querySelector('.writing-citation__note');
      if (!note) return;
      if (home) {
        var target = useRail ? citation : home.parent;
        if (note.parentElement !== target) target.appendChild(note);
      }
      if (!useRail) {
        note.classList.remove('is-rail');
        note.style.removeProperty('left');
        note.style.removeProperty('top');
      } else {
        var markBox = citation.getBoundingClientRect();
        note.classList.add('is-rail');
        note.style.left = (railEdge - markBox.left) + 'px';
        note.style.top = Math.max(0, previousBottom + 10 - markBox.top) + 'px';
        previousBottom = note.getBoundingClientRect().bottom;
      }
    });
    if (endnotes) endnotes.hidden = useRail;
  }
  window.addEventListener('resize', positionCitations);
  if (endnotes) {
    window.addEventListener('beforeprint', function () { printing = true; positionCitations(); });
    window.addEventListener('afterprint', function () { printing = false; positionCitations(); });
  }
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

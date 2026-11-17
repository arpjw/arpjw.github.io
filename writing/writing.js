(function () {
  var body = document.querySelector('.writing-post__body');
  var citations = document.querySelectorAll('.writing-citation');
  var endnotes = document.querySelector('[data-writing-endnotes]');
  var noteHomes = new Map();
  var printing = false;

  // Number sections (01, 02) and subsections (1.1, 1.2), and mirror the numbers in the guides.
  if (body) {
    var section = 0;
    var subsection = 0;
    body.querySelectorAll('h2, h3').forEach(function (heading) {
      if (heading.closest('.writing-post__notes, figure, aside, details, [data-unnumbered]') || heading.hasAttribute('data-unnumbered')) return;
      if (heading.tagName === 'H2') {
        section += 1;
        subsection = 0;
        heading.setAttribute('data-number', (section < 10 ? '0' : '') + section);
      } else if (section) {
        subsection += 1;
        heading.setAttribute('data-number', section + '.' + subsection);
      }
    });
    document.querySelectorAll('.writing-toc a[href^="#"], .writing-toc-mobile a[href^="#"]').forEach(function (link) {
      var target = document.getElementById(link.hash.slice(1));
      var number = target && target.getAttribute('data-number');
      if (!number || link.querySelector('.writing-toc__number')) return;
      var label = document.createElement('span');
      label.className = 'writing-toc__number';
      label.textContent = number;
      link.insertBefore(label, link.firstChild);
      if (target.tagName === 'H3') link.classList.add('is-subsection');
    });
  }
  citations.forEach(function (citation) {
    var mark = citation.querySelector('.writing-citation__mark');
    var note = mark && document.getElementById(mark.hash.slice(1));
    if (note && !note.hasAttribute('data-note')) note.setAttribute('data-note', mark.textContent.trim());
  });
  if (endnotes) {
    endnotes.querySelectorAll('.writing-citation__note[id]').forEach(function (note) {
      noteHomes.set(note.id, { note: note, parent: note.parentElement });
    });
  }
  function positionCitations() {
    var useRail = body && !printing && window.matchMedia('screen and (min-width: 61rem)').matches;
    var railEdge = useRail ? body.getBoundingClientRect().right : 0;
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
        note.style.left = 'calc(' + (railEdge - markBox.left) + 'px + var(--writing-rail-gap))';
        note.style.top = Math.max(0, previousBottom + 10 - markBox.top) + 'px';
        previousBottom = note.getBoundingClientRect().bottom;
      }
    });
    if (endnotes) endnotes.hidden = useRail;
  }
  // Draw-in charts once, when they first scroll into view. Static without JS or with reduced motion.
  var animated = document.querySelectorAll('[data-wa-animate]');
  if (animated.length && 'IntersectionObserver' in window && window.matchMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    animated.forEach(function (figure) {
      var box = figure.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) return;
      figure.classList.add('wa-anim');
      reveal.observe(figure);
    });
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
      if (section && section.getBoundingClientRect().top <= 100) current = index;
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

// Back-to-top button: shown once the reader reaches the end of an article.
(function () {
  if (!document.body.classList.contains('writing-article-page')) return;
  var target = document.getElementById('top') || document.querySelector('main');
  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'writing-back-to-top';
  button.setAttribute('aria-label', 'Back to top');
  button.innerHTML = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(button);

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var ticking = false;
  function update() {
    ticking = false;
    var doc = document.documentElement;
    var fromBottom = doc.scrollHeight - (window.scrollY + window.innerHeight);
    var nearEnd = fromBottom < Math.max(480, window.innerHeight * 0.6) && window.scrollY > window.innerHeight;
    // Keep a focused button visible so keyboard users are not left on a hidden control.
    button.classList.toggle('is-visible', nearEnd || document.activeElement === button);
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  button.addEventListener('blur', onScroll);
  button.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion && reduceMotion.matches ? 'auto' : 'smooth' });
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  update();
})();

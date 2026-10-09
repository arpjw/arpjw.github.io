(function () {
  var toggle = document.querySelector('.theme-toggle');
  var splash = document.querySelector('.splash');
  var startGalleryAutoplay;

  function setThemeButton() {
    var dark = document.documentElement.classList.contains('dark');
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  toggle.addEventListener('click', function () {
    var dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (error) {}
    document.querySelector('meta[name="theme-color"]').content = dark ? '#000000' : '#ffffff';
    setThemeButton();
  });
  setThemeButton();

  var lifespanAge = document.querySelector('[data-lifespan-age]');
  var lifespanPercent = document.querySelector('[data-lifespan-percent]');
  var lifespanBar = document.querySelector('[data-lifespan-bar]');
  var lifespanFill = document.querySelector('[data-lifespan-fill]');
  if (lifespanAge && lifespanPercent && lifespanBar && lifespanFill) {
    var birthTime = Date.parse('2006-07-19T02:34:00.000Z');
    var expectedYears = 86.53;
    var millisecondsPerYear = 31556952000;
    var lifespanTimer;

    function updateLifespan() {
      var age = (Date.now() - birthTime) / millisecondsPerYear;
      var percent = Math.min(100, Math.max(0, (age / expectedYears) * 100));
      lifespanAge.textContent = age.toFixed(8);
      lifespanPercent.textContent = percent.toFixed(2);
      lifespanFill.style.width = percent + '%';
      lifespanBar.setAttribute('aria-valuenow', percent.toFixed(2));
      lifespanTimer = setTimeout(updateLifespan, 250);
    }

    updateLifespan();
    window.addEventListener('pagehide', function () { clearTimeout(lifespanTimer); }, { once: true });
  }

  var visitorCount = document.querySelector('[data-visitor-count]');
  if (visitorCount) {
    fetch('https://countapi.mileshilliard.com/api/v1/hit/aryasomu_com_all_time_visits_2026')
      .then(function (response) {
        if (!response.ok) throw new Error('Visitor count request failed');
        return response.json();
      })
      .then(function (data) {
        var count = Number(data.value);
        if (Number.isFinite(count)) visitorCount.textContent = count.toLocaleString();
      })
      .catch(function () {});
  }

  var gallery = document.querySelector('.photo-gallery');
  if (gallery) {
    var photos = [
      {
        src: 'friends/01-before-college.jpg',
        caption: 'Summer 2024',
        alt: 'Summer 2024'
      },
      {
        src: 'friends/02-de-anza.jpg',
        caption: 'Summer 2025',
        alt: 'Summer 2025'
      },
      {
        src: 'friends/03-lake-trip.jpg',
        caption: 'Summer 2025',
        alt: 'Summer 2025'
      },
      {
        src: 'friends/04-pbl-banquet-2025.jpg',
        caption: 'Spring 2026',
        alt: 'Spring 2025'
      },
      {
        src: 'friends/05-last-high-school-event.jpg',
        caption: 'Summer 2024',
        alt: 'Summer 2024'
      },
      {
        src: 'friends/06-first-college-party.jpg',
        caption: 'Winter 2025',
        alt: 'Winter 2025'
      },
      {
        src: 'friends/07-senior-trip.jpg',
        caption: 'Summer 2024',
        alt: 'Summer 2024'
      },
      {
        src: 'friends/08-banquet-2025.jpg',
        caption: 'Summer 2025',
        alt: 'Summer 2025'
      },
      {
        src: 'friends/09-classic-pose.jpg',
        caption: 'Summer 2025',
        alt: 'Summer 2025'
      },
      {
        src: 'friends/10-pbl-banquet-2026.jpg',
        caption: 'Summer 2026',
        alt: 'Summer 2026'
      },
      {
        src: 'friends/11-fbla-nationals-2026.jpg',
        caption: 'Spring 2026',
        alt: 'Spring 2026'
      },
      {
        src: 'friends/12-last-pbl-group-photo.jpg',
        caption: 'Spring 2026',
        alt: 'Spring 2026'
      },
      {
        src: 'friends/13-guys-nyc-2026.jpg',
        caption: 'Fall 2026',
        alt: 'Fall 2026'
      }
    ];
    var galleryImage = gallery.querySelector('.photo-gallery__image');
    var galleryCaption = gallery.querySelector('[data-gallery-caption]');
    var galleryStatus = gallery.querySelector('[data-gallery-status]');
    var previousButton = gallery.querySelector('.photo-gallery__arrow--previous');
    var nextButton = gallery.querySelector('.photo-gallery__arrow--next');
    var autoplayButton = gallery.querySelector('.photo-gallery__autoplay');
    var caption = gallery.querySelector('figcaption');
    var dots = gallery.querySelector('.photo-gallery__dots');
    var dotButtons = photos.map(function (photo, index) {
      var dot = document.createElement('button');
      dot.className = 'photo-gallery__dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show photo ' + (index + 1) + ' of ' + photos.length);
      dot.addEventListener('click', function () { pauseAutoplay(); showPhoto(index); });
      dots.appendChild(dot);
      return dot;
    });
    var galleryIndex = 0;
    var visibleDotCount = Math.min(7, photos.length);
    var touchStartX = 0;
    var autoplayTimer = 0;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var autoplayPaused = reducedMotion.matches;

    function updateAutoplayButton() {
      var label = autoplayPaused ? 'Play slideshow' : 'Pause slideshow';
      autoplayButton.setAttribute('aria-label', label);
      autoplayButton.title = label;
      autoplayButton.classList.toggle('is-paused', autoplayPaused);
      caption.setAttribute('aria-live', autoplayPaused ? 'polite' : 'off');
    }

    function stopAutoplay() {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = 0;
    }

    function scheduleAutoplay() {
      stopAutoplay();
      if (autoplayPaused || document.hidden) return;
      autoplayTimer = window.setTimeout(function () {
        showPhoto(galleryIndex + 1);
        scheduleAutoplay();
      }, 3500);
    }

    function pauseAutoplay() {
      autoplayPaused = true;
      stopAutoplay();
      updateAutoplayButton();
    }

    startGalleryAutoplay = scheduleAutoplay;

    function showPhoto(index) {
      galleryIndex = (index + photos.length) % photos.length;
      var photo = photos[galleryIndex];
      galleryImage.src = photo.src;
      galleryImage.alt = photo.alt;
      galleryCaption.textContent = photo.caption;
      galleryStatus.textContent = 'Photo ' + (galleryIndex + 1) + ' of ' + photos.length;
      var firstVisibleDot = Math.floor(galleryIndex / visibleDotCount) * visibleDotCount;
      dotButtons.forEach(function (dot, index) {
        dot.hidden = index < firstVisibleDot || index >= firstVisibleDot + visibleDotCount;
        if (index === galleryIndex) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });

      var nextPhoto = photos[(galleryIndex + 1) % photos.length];
      var preload = new Image();
      preload.src = nextPhoto.src;
    }

    previousButton.addEventListener('click', function () { pauseAutoplay(); showPhoto(galleryIndex - 1); });
    nextButton.addEventListener('click', function () { pauseAutoplay(); showPhoto(galleryIndex + 1); });
    autoplayButton.addEventListener('click', function () {
      autoplayPaused = !autoplayPaused;
      updateAutoplayButton();
      scheduleAutoplay();
    });
    gallery.addEventListener('focusin', function (event) {
      if (event.target !== autoplayButton) pauseAutoplay();
    });
    document.addEventListener('visibilitychange', scheduleAutoplay);
    window.addEventListener('pagehide', stopAutoplay, { once: true });
    reducedMotion.addEventListener('change', function (event) {
      if (event.matches) pauseAutoplay();
    });
    gallery.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        pauseAutoplay();
        showPhoto(galleryIndex - 1);
        if (event.target.classList.contains('photo-gallery__dot')) dotButtons[galleryIndex].focus();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        pauseAutoplay();
        showPhoto(galleryIndex + 1);
        if (event.target.classList.contains('photo-gallery__dot')) dotButtons[galleryIndex].focus();
      }
    });
    gallery.addEventListener('touchstart', function (event) {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    gallery.addEventListener('touchend', function (event) {
      var distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) < 45) return;
      pauseAutoplay();
      showPhoto(galleryIndex + (distance < 0 ? 1 : -1));
    }, { passive: true });
    showPhoto(Math.floor(Math.random() * photos.length));
    updateAutoplayButton();
    if (!splash) scheduleAutoplay();
  }

  if (!splash) return;

  var art = document.querySelector('.splash__art');
  var lines = [
    ' ,6"Yb.  `7Mb,od8 `7M\'   `MF\',6"Yb.      ,pP"Ybd  ,pW"Wq.`7MMpMMMb.pMMMb.`7MM  `7MM  ',
    '8)   MM    MM\' "\'   VA   ,V 8)   MM      8I   `" 6W\'   `Wb MM    MM    MM  MM    MM  ',
    ' ,pm9MM    MM        VA ,V   ,pm9MM      `YMMMa. 8M     M8 MM    MM    MM  MM    MM  ',
    '8M   MM    MM         VVV   8M   MM      L.   I8 YA.   ,A9 MM    MM    MM  MM    MM  ',
    '`Moo9^Yo..JMML.       ,V    `Moo9^Yo.    M9mmmP\'  `Ybmd9\'.JMML  JMML  JMML.`Mbod"YML.',
    '                     ,V                                                              ',
    '                  OOb"                                                               '
  ];
  var width = Math.max.apply(null, lines.map(function (line) { return line.length; }));
  var source = lines.map(function (line) { return line.padEnd(width, ' '); });
  var blockDigits = '00000000123456789';
  var raf = 0;
  var start = 0;
  var finished = false;

  function ease(value) {
    return -(Math.cos(Math.PI * value) - 1) / 2;
  }

  function finish(skipTransition) {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    try { sessionStorage.setItem('intro-seen-v3', 'true'); } catch (error) {}
    if (skipTransition) {
      splash.remove();
      document.body.classList.add('no-splash');
    } else {
      splash.classList.add('is-leaving');
      document.body.classList.add('is-ready');
      window.setTimeout(function () { splash.remove(); }, 600);
    }
    if (startGalleryAutoplay) startGalleryAutoplay();
  }

  function frame(now) {
    if (!start) start = now;
    var progress = Math.min(1, (now - start) / 2050);
    var frontier = ease(progress) * (width + 11);
    art.textContent = source.map(function (line) {
      return Array.from(line).map(function (character, index) {
        var distance = frontier - index;
        if (distance >= 11) return character;
        if (distance > 0 && character !== ' ') {
          return blockDigits[Math.floor(Math.random() * blockDigits.length)];
        }
        return ' ';
      }).join('');
    }).join('\n');

    if (progress < 1) {
      raf = requestAnimationFrame(frame);
    } else {
      art.textContent = source.join('\n');
      window.setTimeout(function () { finish(false); }, 650);
    }
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false;
  try { seen = sessionStorage.getItem('intro-seen-v3') === 'true'; } catch (error) {}
  if (reduceMotion || seen) finish(true);
  else raf = requestAnimationFrame(frame);

  splash.addEventListener('click', function () { finish(false); });
  splash.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') finish(false);
  });
})();

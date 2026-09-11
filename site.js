(function () {
  var toggle = document.querySelector('.theme-toggle');
  var splash = document.querySelector('.splash');

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

  var gallery = document.querySelector('.hopper-gallery');
  if (gallery) {
    var paintings = [
      {
        src: 'early-sunday-morning.png',
        title: 'Early Sunday Morning',
        year: '1930',
        alt: 'A quiet row of red-brick storefronts in early morning light, painted by Edward Hopper'
      },
      {
        src: 'hopper/automat.jpg',
        title: 'Automat',
        year: '1927',
        alt: 'A woman sitting alone at a cafe table at night, painted by Edward Hopper'
      },
      {
        src: 'hopper/house-by-the-railroad.jpg',
        title: 'House by the Railroad',
        year: '1925',
        alt: 'A tall Victorian house beyond a railroad track, painted by Edward Hopper'
      },
      {
        src: 'hopper/night-windows.jpg',
        title: 'Night Windows',
        year: '1928',
        alt: 'A nighttime view into the lit windows of an apartment, painted by Edward Hopper'
      },
      {
        src: 'hopper/railroad-sunset.jpg',
        title: 'Railroad Sunset',
        year: '1929',
        alt: 'Railroad tracks beneath a deep orange and purple sunset, painted by Edward Hopper'
      },
      {
        src: 'hopper/lighthouse-at-two-lights.jpg',
        title: 'The Lighthouse at Two Lights',
        year: '1929',
        alt: 'A white lighthouse rising above a sunlit rocky hill, painted by Edward Hopper'
      },
      {
        src: 'hopper/chop-suey.jpg',
        title: 'Chop Suey',
        year: '1929',
        alt: 'Two women sitting across from one another at a restaurant table, painted by Edward Hopper'
      },
      {
        src: 'hopper/sunday.jpg',
        title: 'Sunday',
        year: '1926',
        alt: 'A solitary man sitting on a curb before a row of storefronts, painted by Edward Hopper'
      }
    ];
    var galleryImage = gallery.querySelector('.hopper-gallery__image');
    var galleryTitle = gallery.querySelector('[data-gallery-title]');
    var galleryYear = gallery.querySelector('[data-gallery-year]');
    var galleryStatus = gallery.querySelector('[data-gallery-status]');
    var previousButton = gallery.querySelector('.hopper-gallery__arrow--previous');
    var nextButton = gallery.querySelector('.hopper-gallery__arrow--next');
    var galleryIndex = 0;
    var touchStartX = 0;

    function showPainting(index) {
      galleryIndex = (index + paintings.length) % paintings.length;
      var painting = paintings[galleryIndex];
      galleryImage.src = painting.src;
      galleryImage.alt = painting.alt;
      galleryTitle.textContent = painting.title;
      galleryYear.textContent = painting.year;
      galleryStatus.textContent = 'Painting ' + (galleryIndex + 1) + ' of ' + paintings.length;

      var nextPainting = paintings[(galleryIndex + 1) % paintings.length];
      var preload = new Image();
      preload.src = nextPainting.src;
    }

    previousButton.addEventListener('click', function () { showPainting(galleryIndex - 1); });
    nextButton.addEventListener('click', function () { showPainting(galleryIndex + 1); });
    gallery.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPainting(galleryIndex - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showPainting(galleryIndex + 1);
      }
    });
    gallery.addEventListener('touchstart', function (event) {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    gallery.addEventListener('touchend', function (event) {
      var distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) < 45) return;
      showPainting(galleryIndex + (distance < 0 ? 1 : -1));
    }, { passive: true });
    showPainting(0);
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

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

  var gallery = document.querySelector('.photo-gallery');
  if (gallery) {
    var photos = [
      {
        src: 'friends/01-before-college.jpg',
        caption: 'My friends and I before splitting up for college!',
        alt: 'Arya and friends together before leaving for college'
      },
      {
        src: 'friends/02-de-anza.jpg',
        caption: 'My OG friend group at De Anza',
        alt: 'Seven friends pose for a group selfie outdoors'
      },
      {
        src: 'friends/03-lake-trip.jpg',
        caption: 'My friends and I on our lake trip! (Summer 2025)',
        alt: 'Four friends in life jackets relax together on inflatable tubes in a lake'
      },
      {
        src: 'friends/04-pbl-banquet-2025.jpg',
        caption: 'The guys at PBLs 2025 Banquet',
        alt: 'Four friends in suits pose together in a courtyard'
      },
      {
        src: 'friends/05-last-high-school-event.jpg',
        caption: 'Our last high school event! (The last time all of these people were pictured together lol)',
        alt: 'A large group of friends gathers on a field at night'
      },
      {
        src: 'friends/06-first-college-party.jpg',
        caption: 'First party with my friends after our first term of college!',
        alt: 'Friends sit together on a couch at a party'
      },
      {
        src: 'friends/07-senior-trip.jpg',
        caption: 'Me and my guys in LA for our senior trip! (Summer 2024)',
        alt: 'A group of friends poses outdoors at night during their senior trip'
      },
      {
        src: 'friends/08-banquet-2025.jpg',
        caption: 'Me and the guys during banquet 2025',
        alt: 'Four friends in suits give thumbs up outside their banquet'
      },
      {
        src: 'friends/09-classic-pose.jpg',
        caption: 'George and I hitting our classic pose',
        alt: 'Two friends seated in stadium stands strike their classic pose'
      },
      {
        src: 'friends/10-pbl-banquet-2026.jpg',
        caption: 'PBL banquet 2026, our last PBL event!',
        alt: 'Six friends in suits crowd together in front of a red curtain'
      },
      {
        src: 'friends/11-fbla-nationals-2026.jpg',
        caption: 'EBOD at FBLA Nationals 2026 in Vegas',
        alt: 'Friends pose together beside the Bellagio fountains in Las Vegas'
      },
      {
        src: 'friends/12-last-pbl-group-photo.jpg',
        caption: 'My favorite group of people, our last PBL group photo',
        alt: 'A large PBL group poses together in formal attire at FBLA Nationals'
      }
    ];
    var galleryImage = gallery.querySelector('.photo-gallery__image');
    var galleryCaption = gallery.querySelector('[data-gallery-caption]');
    var galleryStatus = gallery.querySelector('[data-gallery-status]');
    var previousButton = gallery.querySelector('.photo-gallery__arrow--previous');
    var nextButton = gallery.querySelector('.photo-gallery__arrow--next');
    var galleryIndex = 0;
    var touchStartX = 0;

    function showPhoto(index) {
      galleryIndex = (index + photos.length) % photos.length;
      var photo = photos[galleryIndex];
      galleryImage.src = photo.src;
      galleryImage.alt = photo.alt;
      galleryCaption.textContent = photo.caption;
      galleryStatus.textContent = 'Photo ' + (galleryIndex + 1) + ' of ' + photos.length;

      var nextPhoto = photos[(galleryIndex + 1) % photos.length];
      var preload = new Image();
      preload.src = nextPhoto.src;
    }

    previousButton.addEventListener('click', function () { showPhoto(galleryIndex - 1); });
    nextButton.addEventListener('click', function () { showPhoto(galleryIndex + 1); });
    gallery.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPhoto(galleryIndex - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showPhoto(galleryIndex + 1);
      }
    });
    gallery.addEventListener('touchstart', function (event) {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    gallery.addEventListener('touchend', function (event) {
      var distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) < 45) return;
      showPhoto(galleryIndex + (distance < 0 ? 1 : -1));
    }, { passive: true });
    showPhoto(0);
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

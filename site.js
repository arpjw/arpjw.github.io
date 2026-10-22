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
    showPhoto(Math.floor(Math.random() * photos.length));
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

(function () {
  var trigger = document.querySelector('[data-secret-phrase]');
  var dialog = document.querySelector('[data-secret-dialog]');
  if (!trigger || !dialog) return;

  var form = dialog.querySelector('[data-secret-form]');
  var input = dialog.querySelector('[data-secret-password]');
  var error = dialog.querySelector('[data-secret-error]');
  var close = dialog.querySelector('[data-secret-close]');
  var salt = 'QWTAnXX3476XxPDucmZDqA==';
  var iv = 'MJ516FI05PFotyra';
  var ciphertext = 'OtTy9pLob+nPvN/ZAacqoSxW2L1RDB2yxOjqSF0fdB5zKRGcKFMvDOxAxUu1XHJmoF7IOtKK';

  function bytes(base64) {
    return Uint8Array.from(atob(base64), function (character) { return character.charCodeAt(0); });
  }

  trigger.addEventListener('click', function () {
    if (!trigger.classList.contains('is-unlocked')) {
      dialog.showModal();
      input.focus();
    }
  });

  close.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () {
    form.reset();
    error.textContent = '';
  });

  input.addEventListener('input', function () { error.textContent = ''; });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    var submittedPassword = input.value;
    input.value = '';

    try {
      var source = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(submittedPassword), 'PBKDF2', false, ['deriveKey']
      );
      var key = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: bytes(salt), iterations: 150000, hash: 'SHA-256' },
        source, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
      );
      var plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: bytes(iv) }, key, bytes(ciphertext)
      );
      trigger.textContent = new TextDecoder().decode(plaintext);
      trigger.classList.add('is-unlocked');
      trigger.removeAttribute('aria-label');
      dialog.close();
      trigger.focus();
    } catch (failure) {
      error.textContent = 'Incorrect password.';
      input.focus();
    }
  });
})();

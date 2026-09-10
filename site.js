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

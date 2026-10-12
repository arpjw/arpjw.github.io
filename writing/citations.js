(function () {
  document.querySelectorAll('.writing-post__cite').forEach(function (citation) {
    var button = citation.querySelector('.writing-post__copy');
    var code = citation.querySelector('code');
    if (!button || !code) return;

    button.setAttribute('aria-live', 'polite');
    button.addEventListener('click', function () {
      var value = code.textContent.trim();
      var copy = navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(value)
        : Promise.reject();

      copy.then(function () {
        button.textContent = 'Copied';
      }).catch(function () {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = 'Selected to copy';
      }).finally(function () {
        window.setTimeout(function () { button.textContent = 'Copy BibTeX'; }, 2200);
      });
    });
  });
})();

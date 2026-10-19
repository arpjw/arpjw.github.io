// Keep the local embedded demo aligned with the site's explicit theme toggle.
(() => {
  const frame = document.querySelector('.traffic-demo-wrap iframe');
  function sync() {
    frame?.contentWindow?.postMessage({ type: 'traffic-theme', dark: document.documentElement.classList.contains('dark') }, location.origin);
  }
  frame?.addEventListener('load', sync);
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame?.contentWindow || event.data?.type !== 'traffic-height') return;
    if (Number.isFinite(event.data.height) && event.data.height >= 400 && event.data.height <= 3000) frame.style.height = `${event.data.height}px`;
  });
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
})();

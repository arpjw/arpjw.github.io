(() => {
  const frame = document.querySelector('.traffic-demo-wrap iframe');
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame?.contentWindow || event.data?.type !== 'traffic-height') return;
    if (Number.isFinite(event.data.height) && event.data.height >= 400 && event.data.height <= 3000) frame.style.height = `${event.data.height}px`;
  });
})();

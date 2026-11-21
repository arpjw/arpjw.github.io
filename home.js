const email = document.querySelector('.home-email');
const emailToggle = email.querySelector('summary');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

window.setInterval(() => {
  if (!document.hidden && !reducedMotion.matches && !email.open) {
    email.toggleAttribute('data-show-laplace');
  }
}, 2000);

function closeEmailOutside(event) {
  if (email.open && !email.contains(event.target)) email.open = false;
}

document.addEventListener('click', closeEmailOutside);
document.addEventListener('focusin', closeEmailOutside);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && email.open) {
    if (email.contains(document.activeElement)) emailToggle.focus();
    email.open = false;
  }
});

document.body.style.overflow = 'hidden';

const timeEl = document.getElementById('loader-time');
function updateTime() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
updateTime();
const timeTick = setInterval(updateTime, 1000);

gsap.set('#loader', { clipPath: 'inset(0 0 0% 0)' });

const isPageTransition = sessionStorage.getItem('page-transition');
sessionStorage.removeItem('page-transition');

if (isPageTransition) {
  clearInterval(timeTick);
  document.querySelector('.loader-top').style.display = 'none';
  document.querySelector('.loader-bottom').style.display = 'none';
  gsap.to('#loader', {
    clipPath: 'inset(0 0 100% 0)',
    duration: 0.7,
    ease: 'power4.inOut',
    delay: 0.05,
    onComplete() {
      document.body.style.overflow = '';
      document.getElementById('loader').remove();
      document.dispatchEvent(new Event('loader:done'));
    }
  });
} else {
  const numEl = document.getElementById('loader-num');
  const counter = { val: 0 };
  gsap.timeline()
    .to(counter, {
      val: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate() { numEl.textContent = `(${Math.round(counter.val)})`; }
    })
    .to('#loader', {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.9,
      ease: 'power4.inOut',
      onComplete() {
        document.body.style.overflow = '';
        document.getElementById('loader').remove();
        document.dispatchEvent(new Event('loader:done'));
      }
    }, "+=0.2");
}

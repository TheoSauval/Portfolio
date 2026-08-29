
// Smooth scroll
const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Nav color on dark sections
const navEl = document.querySelector('nav');
let darkRanges = [];

function buildDarkRanges() {
  darkRanges = ['.content-about', '.projects-section', '.about-section', '.projects-page-hero', '.projects-list', '.services-detail', '.services-cta', '.about-details', '.contact-hero']
    .map(sel => document.querySelector(sel))
    .filter(Boolean)
    .map(el => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      return { top, bottom: top + el.offsetHeight };
    });
}

function updateNavColor() {
  const y = window.scrollY;
  const isOnDark = darkRanges.some(r => y + 55 >= r.top && y < r.bottom);
  navEl.classList.toggle('nav--on-dark', isOnDark);
}

buildDarkRanges();
updateNavColor();
window.addEventListener('load', () => { buildDarkRanges(); updateNavColor(); });
window.addEventListener('scroll', updateNavColor, { passive: true });
window.addEventListener('resize', () => { buildDarkRanges(); updateNavColor(); });

// Custom cursor
const cursor = document.getElementById('cursor');

const xCursor = gsap.quickTo(cursor, 'x', { duration: 0.5, ease: 'power3.out' });
const yCursor = gsap.quickTo(cursor, 'y', { duration: 0.5, ease: 'power3.out' });

window.addEventListener('mousemove', (e) => {
  xCursor(e.clientX - 5.5);
  yCursor(e.clientY - 10);
});

// Title letter hover effect
const title = document.querySelector('.title');

if (title) {
  window.buildTitleLetters = function() {
    title.innerHTML = title.textContent.split(' ').map(word =>
      `<span class="title-word">${[...word].map(char =>
        `<span class="letter"><span class="letter-inner">${char}</span><span class="letter-clone">${char}</span></span>`
      ).join('')}</span>`
    ).join(' ');
  };

  title.addEventListener('mouseenter', () => {
    [...title.querySelectorAll('.letter')].forEach((letter, i) => {
      gsap.killTweensOf([letter.querySelector('.letter-inner'), letter.querySelector('.letter-clone')]);
      gsap.to(letter.querySelector('.letter-inner'), { y: '-100%', duration: 0.5, ease: 'power3.inOut', delay: i * 0.04 });
      gsap.to(letter.querySelector('.letter-clone'), { y: '-100%', duration: 0.5, ease: 'power3.inOut', delay: i * 0.04 });
    });
  });

  title.addEventListener('mouseleave', () => {
    [...title.querySelectorAll('.letter')].forEach((letter, i) => {
      gsap.killTweensOf([letter.querySelector('.letter-inner'), letter.querySelector('.letter-clone')]);
      gsap.to(letter.querySelector('.letter-inner'), { y: '0%', duration: 0.5, ease: 'power3.inOut', delay: i * 0.04 });
      gsap.to(letter.querySelector('.letter-clone'), { y: '0%', duration: 0.5, ease: 'power3.inOut', delay: i * 0.04 });
    });
  });

  window.buildTitleLetters();
}

// Hero photo — reveal from bottom to top once the loader clears
const heroPhotoImg = document.querySelector('.hero-photo img');
if (heroPhotoImg) {
  gsap.set(heroPhotoImg, { yPercent: 100 });
  const revealHeroPhoto = () => {
    gsap.to(heroPhotoImg, { yPercent: 0, duration: 1.2, delay: 0.2, ease: 'power4.out' });
  };
  document.getElementById('loader')
    ? document.addEventListener('loader:done', revealHeroPhoto, { once: true })
    : revealHeroPhoto();
}

// Hero scroll indicator — bar sliding along the track
const heroScrollBar = document.querySelector('.hero-scroll-bar');
if (heroScrollBar) {
  const trackHeight = heroScrollBar.parentElement.offsetHeight;
  const barHeight = heroScrollBar.offsetHeight;
  gsap.to(heroScrollBar, {
    y: trackHeight - barHeight,
    duration: 1.2,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true,
  });
}

// Hover image/video follower
const cursorImage = document.getElementById('cursor-image');
const cursorImg = document.getElementById('cursor-img');
const cursorVid = document.getElementById('cursor-vid');

window.setupHoverTriggers = function() {
  document.querySelectorAll('.hover-trigger').forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
      const rect = trigger.getBoundingClientRect();
      gsap.killTweensOf(cursorImage);
      if (trigger.dataset.video) {
        gsap.set(cursorImage, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, rotation: -8 });
      } else {
        gsap.set(cursorImage, { x: rect.right + 200, y: rect.top + rect.height / 2, rotation: 8 });
      }
      if (trigger.dataset.video) {
        cursorImg.style.display = 'none';
        cursorVid.style.display = 'block';
        if (cursorVid.getAttribute('src') !== trigger.dataset.video) {
          cursorVid.src = trigger.dataset.video;
        }
        cursorVid.currentTime = parseFloat(trigger.dataset.start || 0);
        cursorVid.play().catch(() => {});
      } else {
        cursorVid.style.display = 'none';
        cursorImg.style.display = 'block';
        cursorImg.src = trigger.dataset.image;
      }
      gsap.to(cursorImage, { autoAlpha: 1, scale: 1, rotation: trigger.dataset.video ? 6 : -6, duration: 0.5, ease: 'power3.out' });
    });
    trigger.addEventListener('mouseleave', () => {
      gsap.killTweensOf(cursorImage);
      gsap.to(cursorImage, { autoAlpha: 0, scale: 0.8, rotation: -8, duration: 0.3, ease: 'power3.in', onComplete: () => cursorVid.pause() });
    });
  });
};

window.setupHoverTriggers();

// Services — cursor tracking image/video preview (gsap.quickTo)
const serviceItems = document.querySelectorAll('.service-item');
const servicePreview = document.getElementById('service-preview');
const servicePreviewImg = document.getElementById('service-preview-img');
const servicePreviewVid = document.getElementById('service-preview-vid');

if (servicePreview) {
  const xTo = gsap.quickTo(servicePreview, 'x', { duration: 0.5, ease: 'power3' });
  const yTo = gsap.quickTo(servicePreview, 'y', { duration: 0.5, ease: 'power3' });

  window.addEventListener('mousemove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  let currentServiceSrc = null;

  serviceItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      serviceItems.forEach(s => s.classList.remove('active'));
      item.classList.add('active');

      if (!item.dataset.video && !item.dataset.image) {
        gsap.killTweensOf(servicePreview, 'opacity,scale');
        gsap.to(servicePreview, { opacity: 0, scale: 0.85, duration: 0.3, ease: 'power3.in', onComplete: () => {
          if (servicePreviewVid) servicePreviewVid.pause();
        }});
        return;
      }

      if (item.dataset.video) {
        servicePreviewImg.style.display = 'none';
        if (servicePreviewVid) {
          servicePreviewVid.style.display = 'block';
          if (currentServiceSrc !== item.dataset.video) {
            currentServiceSrc = item.dataset.video;
            servicePreviewVid.src = item.dataset.video;
            servicePreviewVid.load();
          }
          if (servicePreviewVid.paused) servicePreviewVid.play().catch(() => {});
        }
      } else {
        if (servicePreviewVid) { servicePreviewVid.style.display = 'none'; servicePreviewVid.pause(); }
        servicePreviewImg.style.display = 'block';
        servicePreviewImg.src = item.dataset.image || '';
      }

      gsap.killTweensOf(servicePreview, 'opacity,scale');
      gsap.to(servicePreview, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' });
    });

    item.addEventListener('mouseleave', () => {
      gsap.killTweensOf(servicePreview, 'opacity,scale');
      gsap.to(servicePreview, { opacity: 0, scale: 0.85, duration: 0.3, ease: 'power3.in', onComplete: () => {
        if (servicePreviewVid) servicePreviewVid.pause();
      }});
    });
  });
}

// Services — activation auto au scroll sur mobile (touch)
if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
  function updateActiveService() {
    const centerY = window.innerHeight / 2;
    let closestItem = null;
    let closestDist = Infinity;

    serviceItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const dist = Math.abs((rect.top + rect.height / 2) - centerY);
        if (dist < closestDist) {
          closestDist = dist;
          closestItem = item;
        }
      }
    });

    if (closestItem) {
      serviceItems.forEach(s => s.classList.remove('active'));
      closestItem.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActiveService, { passive: true });
  updateActiveService();
}

// Form submit → /api/contact (Resend via Vercel serverless)
document.querySelectorAll('.contact-form, .projects-contact-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '…';
    btn.disabled = true;

    const data = Object.fromEntries(
      [...form.querySelectorAll('[name]')].map(el => [el.name, el.value])
    );

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.reset();
        btn.textContent = '✓ Sent';
        setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 3000);
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = 'Error, try again';
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 3000);
    }
  });
});

// Video scroll scrubbing
const video = document.getElementById('bg-video');
let targetTime = 0;

if (video) video.addEventListener('loadedmetadata', () => {
  window.addEventListener('scroll', () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    targetTime = (window.scrollY / scrollMax) * video.duration;
  });

  function tick() {
    const diff = targetTime - video.currentTime;
    if (Math.abs(diff) > 0.01) {
      video.currentTime += diff * 0.1;
    }
    requestAnimationFrame(tick);
  }

  tick();
});

const trigger = document.getElementById("menu-trigger");

let tl = gsap
  .timeline({ paused: true })
  .to("#expanded-menu", {
    duration: 1.2,
    height: "100vh",
    ease: "power4.out"
  }, "+=0.1")
  .to(
    "#sub-menu a",
    {
      duration: 0.8,
      opacity: 1,
      y: 0,
      ease: "power4.out",
      stagger: 0.08
    },
    0.4
  )
  .reverse();

const nav = document.querySelector("nav");

trigger.addEventListener("click", () => {
  const isOpening = tl.reversed();
  tl.reversed(!tl.reversed());
  document.body.style.overflow = isOpening ? "hidden" : "";
  nav.classList.toggle("menu-open", isOpening);
});

// Split menu links into letters with clone effect
window.buildMenuLetters = function() {
  document.querySelectorAll("#sub-menu > a").forEach(link => {
    link.innerHTML = [...link.textContent.trim()].map(char =>
      `<span class="menu-letter"><span class="menu-letter-inner">${char}</span><span class="menu-letter-clone">${char}</span></span>`
    ).join("");

    link.addEventListener("mouseenter", () => {
      [...link.querySelectorAll(".menu-letter")].forEach((letter, i) => {
        gsap.to(letter.querySelector(".menu-letter-inner"), { y: "-100%", duration: 0.45, ease: "power3.inOut", delay: i * 0.025 });
        gsap.to(letter.querySelector(".menu-letter-clone"), { y: "-100%", duration: 0.45, ease: "power3.inOut", delay: i * 0.025 });
      });
    });

    link.addEventListener("mouseleave", () => {
      [...link.querySelectorAll(".menu-letter")].forEach((letter, i) => {
        gsap.to(letter.querySelector(".menu-letter-inner"), { y: "0%", duration: 0.45, ease: "power3.inOut", delay: i * 0.025 });
        gsap.to(letter.querySelector(".menu-letter-clone"), { y: "0%", duration: 0.45, ease: "power3.inOut", delay: i * 0.025 });
      });
    });
  });
};

window.buildMenuLetters();

// Page transition on internal link clicks
document.addEventListener('click', e => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#') || href.startsWith('tel')) return;
  e.preventDefault();
  sessionStorage.setItem('page-transition', '1');
  const curtain = document.createElement('div');
  curtain.style.cssText = 'position:fixed;inset:0;background:#000;z-index:9999;transform:translateY(100%)';
  document.body.appendChild(curtain);
  gsap.to(curtain, {
    y: '0%',
    duration: 0.6,
    ease: 'power4.inOut',
    onComplete() { window.location.href = href; }
  });
});

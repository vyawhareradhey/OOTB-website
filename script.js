// script.js - nav, dropdown behavior & 3D carousel

// ===============================
// Helper: find nearest ancestor with class
// ===============================
function closestByClass(el, className) {
  while (el && el !== document.documentElement) {
    if (el.classList && el.classList.contains(className)) return el;
    el = el.parentNode;
  }
  return null;
}

// ===============================
// Menu toggles (mobile nav)
// ===============================
document.querySelectorAll('.menu-toggle, .nav-toggle, #navToggle, #menu-toggle, #menu-toggle-2, #menu-toggle-3').forEach(btn => {
  btn.addEventListener('click', () => {
    const controls = btn.getAttribute('aria-controls');
    if (controls) {
      const target = document.getElementById(controls);
      if (target) {
        const open = target.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    } else {
      const header = closestByClass(btn, 'header-row') || btn.parentNode;
      const nav = header.querySelector('.nav');
      if (nav) {
        const open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    }
  });
});

// ===============================
// Mobile dropdown toggle
// ===============================
document.querySelectorAll('.nav-dropdown .dropbtn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 680px)').matches) {
      const parent = closestByClass(btn, 'nav-dropdown');
      if (!parent) return;
      const currentlyOpen = parent.classList.toggle('open');
      btn.setAttribute('aria-expanded', currentlyOpen ? 'true' : 'false');
      e.stopPropagation();
    }
  });
});

// ===============================
// Desktop dropdown toggle
// ===============================
document.querySelectorAll('.nav-dropdown .dropbtn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (!window.matchMedia('(max-width: 680px)').matches) {
      e.preventDefault();
      e.stopPropagation();
      const dropdown = btn.nextElementSibling;
      if (dropdown && dropdown.classList.contains('dropdown-content')) {
        dropdown.classList.toggle('show');
      }
    }
  });
});

// Close desktop dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!window.matchMedia('(max-width: 680px)').matches) {
    document.querySelectorAll('.dropdown-content.show').forEach(dd => {
      if (!dd.contains(e.target) && !dd.previousElementSibling.contains(e.target)) {
        dd.classList.remove('show');
      }
    });
  }
});

// Ensure only one dropdown is open at a time
document.querySelectorAll('.nav-dropdown .dropbtn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const parent = btn.closest('.nav-dropdown');

    document.querySelectorAll('.nav-dropdown.open').forEach(dd => {
      if (dd !== parent) {
        dd.classList.remove('open');
        dd.querySelector('.dropbtn').setAttribute('aria-expanded', 'false');
      }
    });

    parent.classList.toggle('open');
    btn.setAttribute('aria-expanded', parent.classList.contains('open'));
  });
});

// ===============================
// Year auto-population
// ===============================
['year-home','year-about','year-services','year-thankyou','year'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.textContent = new Date().getFullYear();
});

// ===============================
// Reveal on scroll
// ===============================
function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < (window.innerHeight - 80)) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===============================
// 3D Carousel (About Section)
// ===============================
(function initAboutCarousel(){
  const container = document.querySelector('.about-carousel');
  const track = container ? container.querySelector('.carousel-track') : null;
  const items = track ? track.querySelectorAll('.carousel-item') : null;
  if (!container || !track || !items || items.length === 0) return;

  // ---- Config ----
  // Speed (deg per frame). Negative = right-to-left.
  const BASE_SPEED = parseFloat(container.dataset.speed) || 1.2; // bump this up to go faster
  let speed = -Math.abs(BASE_SPEED);

  let rotationY = 0;
  let radius = 380; // will be recalculated below based on container size

  function layout() {
    // Calculate a pleasant radius based on container dimensions
    const minSide = Math.min(container.clientWidth, container.clientHeight);
    radius = Math.max(260, Math.floor(minSide * 0.75)); // keep it roomy but centered

    const total = items.length;
    const angleStep = 360 / total;

    items.forEach((item, index) => {
      // Keep the item centered, then rotate around Y and push outwards
      const angle = angleStep * index;
      item.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`;
    });
  }

  function animate() {
    rotationY += speed; // negative = right-to-left
    track.style.transform = `translateZ(-1px) rotateY(${rotationY}deg)`; // tiny translateZ to enforce 3D render
    requestAnimationFrame(animate);
  }

  // Hover to pause (optional feel); comment out if you want constant speed
  container.addEventListener('mouseenter', () => { speed = speed * 0.2; });
  container.addEventListener('mouseleave', () => {
    const s = parseFloat(container.dataset.speed) || BASE_SPEED;
    speed = -Math.abs(s);
  });

  // Re-layout on resize for perfect alignment with the text column height
  window.addEventListener('resize', layout, { passive: true });

  // Kickoff
  layout();
  animate();
})();

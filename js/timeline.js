/* ============================================================
   ESS Timeline — timeline.js
   ============================================================ */

// ── Project Dates ─────────────────────────────────────────────
const START    = new Date('2026-03-11');
const DEADLINE = new Date('2026-06-21');
const TOTAL    = 102; // days Mar 11 → Jun 21

function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

// ── Date Stats (elapsed / remaining / overall %) ───────────────
function updateDateStats() {
  const now     = new Date();
  const elapsed = Math.max(0, Math.min(daysBetween(START, now), TOTAL));
  const remain  = Math.max(0, daysBetween(now, DEADLINE));
  const pct     = Math.min(100, Math.round((elapsed / TOTAL) * 100));

  const elEl  = document.getElementById('stat-elapsed');
  const reEl  = document.getElementById('stat-remain');
  const pctEl = document.getElementById('overallPct');
  const fill  = document.getElementById('mainProgressFill');

  if (elEl)  elEl.textContent         = elapsed;
  if (reEl)  reEl.textContent         = remain;
  if (pctEl) pctEl.textContent        = pct + '%';
  if (fill)  fill.dataset.pct         = pct;
}

// ── Countdown Timer ────────────────────────────────────────────
function updateCountdown() {
  const diff = DEADLINE - new Date();
  const dEl  = document.getElementById('cd-days');
  const hEl  = document.getElementById('cd-hrs');
  const mEl  = document.getElementById('cd-min');
  if (!dEl) return;

  if (diff <= 0) {
    dEl.textContent = hEl.textContent = mEl.textContent = '0';
    return;
  }
  dEl.textContent = Math.floor(diff / 86400000);
  hEl.textContent = Math.floor((diff % 86400000) / 3600000);
  mEl.textContent = Math.floor((diff % 3600000) / 60000);
}

updateDateStats();
updateCountdown();
setInterval(updateCountdown, 60000);

// ── Scroll Reveal (.reveal) ────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Timeline Items Stagger ─────────────────────────────────────
const tlObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('tl-visible'), 80);
      tlObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.tl-item').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.06) + 's';
  tlObs.observe(el);
});

// ── Progress Bar Animate on Scroll ─────────────────────────────
const progressObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = document.getElementById('mainProgressFill');
      if (fill) {
        updateDateStats();
        setTimeout(() => { fill.style.width = (fill.dataset.pct || '0') + '%'; }, 200);
      }
      document.querySelectorAll('.tmb-fill').forEach(f => {
        setTimeout(() => { f.style.width = (f.dataset.pct || '0') + '%'; }, 300);
      });
      progressObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

const pw = document.querySelector('.tl-progress-wrap');
if (pw) progressObs.observe(pw);

// ── WBS Cards Stagger + Fill ───────────────────────────────────
const wbsObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('wbs-visible');
      const fill = e.target.querySelector('.wbs-progress-fill');
      if (fill) requestAnimationFrame(() => { fill.style.width = (fill.dataset.pct || '0') + '%'; });
      wbsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.wbs-card').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.07) + 's';
  wbsObs.observe(el);
});

// ── Gantt Bars Animate on Scroll ───────────────────────────────
const ganttObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.gantt-bar').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.left  = bar.dataset.left;
          bar.style.width = bar.dataset.width;
        }, i * 90);
      });
      ganttObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

const gw = document.querySelector('.gantt-wrap');
if (gw) ganttObs.observe(gw);

// ── Back To Top ────────────────────────────────────────────────
const btt = document.getElementById('backToTop');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Mobile Hamburger ───────────────────────────────────────────
const mBtn = document.getElementById('mobileMenuBtn');
if (mBtn) {
  mBtn.addEventListener('click', () => {
    mBtn.classList.toggle('is-open');
    const bars = mBtn.querySelectorAll('span');
    if (mBtn.classList.contains('is-open')) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });
}

console.log(
  '%c ESS Timeline loaded ✓ ',
  'background:linear-gradient(90deg,#1a9b5f,#1a6bb5);color:#fff;font-weight:700;padding:4px 12px;border-radius:99px;font-family:Poppins,sans-serif'
);

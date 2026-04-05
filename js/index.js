/* ============================================================
   ESS Workflow — workflow.js
   ============================================================ */

// ── Scroll Reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.06, rootMargin: '0px 0px -32px 0px' }
);

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = i;
  revealObserver.observe(el);
});

// ── Flow Nav: Click → Smooth Scroll ──────────────────────────
const headerEl  = document.querySelector('.site-header');
const flowNavEl = document.querySelector('.flow-nav');

function getHeaderOffset() {
  return (headerEl?.offsetHeight || 62) + (flowNavEl?.offsetHeight || 46) + 8;
}

document.querySelectorAll('.flow-step').forEach(step => {
  step.addEventListener('click', () => {
    const id = step.dataset.target;
    const target = document.getElementById(id);
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// ── Flow Nav: Highlight Active Step on Scroll ─────────────────
const moduleIds = ['home', 'auth', 'matching', 'sna', 'gei', 'chatbot', 'admin'];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('active-flow'));
        const active = document.querySelector(`.flow-step[data-target="${entry.target.id}"]`);
        if (active) {
          active.classList.add('active-flow');
          // Scroll the active step into view on mobile (flow nav is scrollable)
          active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        }
      }
    });
  },
  { threshold: 0.3 }
);

moduleIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// ── Back To Top Button ────────────────────────────────────────
const bttBtn = document.getElementById('backToTop');
if (bttBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      bttBtn.classList.add('visible');
    } else {
      bttBtn.classList.remove('visible');
    }
  }, { passive: true });

  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Mobile Menu Button (hamburger) ───────────────────────────
// On mobile the header badge is hidden; the hamburger is cosmetic
// but wired to toggle a "mobile-open" class for potential future drawer
const mobileBtn = document.getElementById('mobileMenuBtn');
if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    mobileBtn.classList.toggle('is-open');
    // Toggle animated bars
    const bars = mobileBtn.querySelectorAll('span');
    if (mobileBtn.classList.contains('is-open')) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });
}

// ── Tool chip tooltips ────────────────────────────────────────
const toolTips = {
  'NetworkX':       'Complex network analysis in Python',
  'LangChain':      'Framework for LLM-powered RAG apps',
  'FAISS':          'Vector similarity search by Meta AI',
  'ChromaDB':       'Open-source embedding vector database',
  'Kumu.io API':    'Network diagram visualization platform',
  'Leaflet.js':     'Open-source interactive mapping library',
  'Chart.js':       'Flexible open-source chart library',
  'D3.js':          'Data-driven DOM + SVG chart library',
  'Bull / BullMQ':  'Redis-based job queue for Node.js',
  'pdfminer.six':   'PDF text extraction for Python',
  'Ollama':         'Run large language models locally',
  'Pinia':          'Official Vue 3 state management',
  'Vite':           'Next-gen frontend build tool',
  'Scrapy':         'High-level Python web scraping framework',
  'BeautifulSoup4': 'HTML/XML parsing and screen-scraping',
  'Power Query':    'Data transformation tool in Excel/Power BI',
};

document.querySelectorAll('.chip').forEach(chip => {
  const label = chip.textContent.trim();
  const key = Object.keys(toolTips).find(k => label.includes(k));
  if (key) {
    chip.title = toolTips[key];
    chip.style.cursor = 'help';
  }
});

console.log(
  '%c ESS Workflow loaded ✓ ',
  'background:linear-gradient(90deg,#1a9b5f,#1a6bb5);color:#fff;font-weight:700;padding:4px 12px;border-radius:99px;font-family:Poppins,sans-serif'
);

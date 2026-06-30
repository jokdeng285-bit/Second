#!/bin/bash
# ═══════════════════════════════════════════════════
#  SPARK DATING APP — PHASE 4: JAVASCRIPT
#  8 commits | Creator: Jok
#  Run AFTER phase3-css.sh
# ═══════════════════════════════════════════════════

set -e

echo "⚡ SPARK — Phase 4: JavaScript"
echo "================================"

# ══════════════════════════════════════════════════
# COMMIT #25 — Floating heart particles
# ══════════════════════════════════════════════════
cat > js/main.js << 'JSEOF'
/* ===== SPARK — MAIN JAVASCRIPT | Creator: Jok ===== */

// ── Floating Heart Particles (homepage hero) ─────────────────────
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const HEARTS = ['♥', '♡', '❤'];
  const COLORS = ['rgba(240,62,110,', 'rgba(255,145,176,', 'rgba(139,92,246,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 20;
      this.size = 10 + Math.random() * 18;
      this.speed = 0.4 + Math.random() * 0.8;
      this.drift = (Math.random() - 0.5) * 0.4;
      this.alpha = 0;
      this.targetAlpha = 0.08 + Math.random() * 0.18;
      this.char = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.fade = 'in';
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.fade === 'in') { this.alpha = Math.min(this.alpha + 0.005, this.targetAlpha); if (this.alpha >= this.targetAlpha) this.fade = 'hold'; }
      if (this.y < H * 0.15) { this.alpha -= 0.007; if (this.alpha <= 0) this.reset(false); }
    }
    draw() {
      ctx.font = `${this.size}px serif`;
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fillText(this.char, this.x, this.y);
    }
  }

  for (let i = 0; i < 45; i++) particles.push(new Particle());

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  })();
}
initParticles();
JSEOF

git add js/main.js
git commit -m "feat: implement floating heart particle canvas animation on homepage"
echo "✅ Commit #25 done"

# ══════════════════════════════════════════════════
# COMMIT #26 — Scroll progress bar
# ══════════════════════════════════════════════════
cat >> js/main.js << 'JSEOF'

// ── Scroll Progress Bar ───────────────────────────────────────────
(function initScrollBar() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = scrolled + '%';
  });
})();
JSEOF

git add js/main.js
git commit -m "feat: add scroll progress bar that fills as user scrolls"
echo "✅ Commit #26 done"

# ══════════════════════════════════════════════════
# COMMIT #27 — Cursor glow effect
# ══════════════════════════════════════════════════
cat >> js/main.js << 'JSEOF'

// ── Cursor Glow Effect ────────────────────────────────────────────
(function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.matchMedia('(max-width: 768px)').matches) return;
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();
JSEOF

git add js/main.js
git commit -m "feat: implement cursor glow effect that follows mouse"
echo "✅ Commit #27 done"

# ══════════════════════════════════════════════════
# COMMIT #28 — Mobile nav drawer
# ══════════════════════════════════════════════════
cat >> js/main.js << 'JSEOF'

// ── Mobile Nav Drawer ──────────────────────────────────────────────
(function initMobileNav() {
  const burger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.nav-drawer');
  if (!burger || !drawer) return;
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    drawer.classList.toggle('open');
  });
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      drawer.classList.remove('open');
    });
  });
})();

// ── Navbar scroll shrink ───────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nb = document.querySelector('.navbar');
  if (!nb) return;
  nb.classList.toggle('scrolled', window.scrollY > 40);
});
JSEOF

git add js/main.js
git commit -m "feat: build hamburger mobile nav drawer with open/close toggle"
echo "✅ Commit #28 done"

# ══════════════════════════════════════════════════
# COMMIT #29 — Dark/light mode toggle
# ══════════════════════════════════════════════════
cat >> js/main.js << 'JSEOF'

// ── Dark / Light Mode Toggle ───────────────────────────────────────
(function initTheme() {
  const toggle = document.getElementById('dark-toggle');
  if (!toggle) return;
  const saved = localStorage.getItem('spark-theme');
  if (saved === 'light') { document.body.classList.add('light'); toggle.textContent = '🌙'; }
  toggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    toggle.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('spark-theme', isLight ? 'light' : 'dark');
  });
})();
JSEOF

git add js/main.js
git commit -m "feat: add dark/light mode toggle with localStorage persistence"
echo "✅ Commit #29 done"

# ══════════════════════════════════════════════════
# COMMIT #30 — Scroll reveal (IntersectionObserver)
# ══════════════════════════════════════════════════
cat >> js/main.js << 'JSEOF'

// ── Scroll Reveal Animation ────────────────────────────────────────
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();
JSEOF

git add js/main.js
git commit -m "feat: implement IntersectionObserver scroll-reveal for all sections"
echo "✅ Commit #30 done"

# ══════════════════════════════════════════════════
# COMMIT #31 — FAQ accordion
# ══════════════════════════════════════════════════
cat >> js/main.js << 'JSEOF'

// ── FAQ Accordion ───────────────────────────────────────────────────
document.querySelectorAll('.faq-q, .faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const icon   = btn.querySelector('.faq-ico, .faq-icon');
    const isOpen = answer.classList.contains('open');

    document.querySelectorAll('.faq-a.open, .faq-answer.open').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-ico.open, .faq-icon.open').forEach(i => i.classList.remove('open'));

    if (!isOpen) { answer.classList.add('open'); if (icon) icon.classList.add('open'); }
  });
});
JSEOF

git add js/main.js
git commit -m "feat: add FAQ accordion — one open at a time, animated max-height"
echo "✅ Commit #31 done"

# ══════════════════════════════════════════════════
# COMMIT #32 — Profile filter + search
# ══════════════════════════════════════════════════
cat >> js/main.js << 'JSEOF'

// ── Profile Filter & Search (browse.html) ────────────────────────────
(function initProfileFilter() {
  const btns   = document.querySelectorAll('.filter-btn');
  const cards  = document.querySelectorAll('.p-card[data-interest], .profile-card[data-interest]');
  const search = document.getElementById('profile-search');
  if (!btns.length) return;

  let activeFilter = 'all';

  function applyFilters() {
    const q = search ? search.value.toLowerCase() : '';
    cards.forEach(card => {
      const interest = card.dataset.interest || '';
      const name     = (card.dataset.name || '').toLowerCase();
      const matchF   = activeFilter === 'all' || interest === activeFilter;
      const matchQ   = !q || name.includes(q);
      const col = card.closest('[class*="col-"]');
      if (col) col.style.display = (matchF && matchQ) ? '' : 'none';
    });
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  if (search) search.addEventListener('input', applyFilters);
})();
JSEOF

git add js/main.js
git commit -m "feat: implement profile interest filter and name search on browse page"
echo "✅ Commit #32 done"

echo ""
echo "🎉 Phase 4 complete — 8 commits done! (32 total)"
echo "Next: run phase5-features.sh"
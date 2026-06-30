/* ===== SPARK — MAIN JAVASCRIPT ===== */

// ── Dark / Light Mode Toggle ────────────────────────────────────
(function initTheme() {
  const toggle = document.getElementById('dark-toggle');
  if (!toggle) return;
  const saved = localStorage.getItem('spark-theme');
  if (saved === 'light') { document.body.classList.add('light-mode'); toggle.textContent = '🌙'; }
  toggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    toggle.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('spark-theme', isLight ? 'light' : 'dark');
  });
})();

// ── Floating Heart Particles (index.html) ───────────────────────
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
  const COLORS = ['rgba(255,61,120,', 'rgba(255,122,165,', 'rgba(155,93,229,'];

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

// ── FAQ Accordion ────────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const icon   = btn.querySelector('.faq-icon');
    const isOpen = answer.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-icon.open').forEach(i => i.classList.remove('open'));

    if (!isOpen) { answer.classList.add('open'); icon.classList.add('open'); }
  });
});

// ── Contact Form Validation ──────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  function showError(fieldId, msg) {
    const el = document.getElementById(fieldId + '-error');
    if (el) { el.textContent = msg; el.classList.add('show'); }
  }
  function clearError(fieldId) {
    const el = document.getElementById(fieldId + '-error');
    if (el) el.classList.remove('show');
  }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    ['name','email','message'].forEach(f => clearError(f));

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (name.length < 2) { showError('name', 'Please enter your full name.'); valid = false; }
    if (!isEmail(email))  { showError('email', 'Enter a valid email address.'); valid = false; }
    if (message.length < 10) { showError('message', 'Message must be at least 10 characters.'); valid = false; }

    if (valid) {
      const btn = form.querySelector('[type=submit]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        form.innerHTML = `<div class="text-center py-4">
          <div style="font-size:3rem">💌</div>
          <h4 class="mt-3" style="font-family:'Playfair Display',serif">Message sent!</h4>
          <p class="text-muted-spark mt-2">We'll get back to you within 24 hours.</p>
        </div>`;
      }, 1200);
    }
  });
})();

// ── Profile Filter (browse.html) ─────────────────────────────────
(function initProfileFilter() {
  const btns    = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.profile-card[data-interest]');
  const search  = document.getElementById('profile-search');
  if (!btns.length) return;

  let activeFilter = 'all';

  function applyFilters() {
    const q = search ? search.value.toLowerCase() : '';
    cards.forEach(card => {
      const interest = card.dataset.interest || '';
      const name     = (card.dataset.name || '').toLowerCase();
      const matchF   = activeFilter === 'all' || interest === activeFilter;
      const matchQ   = !q || name.includes(q);
      card.closest('.col').style.display = (matchF && matchQ) ? '' : 'none';
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

// ── Navbar scroll shrink ─────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nb = document.querySelector('.navbar');
  if (!nb) return;
  nb.style.height = window.scrollY > 40 ? '60px' : '';
});

// ── Animate elements on scroll ───────────────────────────────────
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();
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


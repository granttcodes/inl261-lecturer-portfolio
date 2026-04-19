document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile nav ─────────────────────────────────────────── */
  const hamburgerBtn     = document.getElementById('hamburger-btn');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks   = document.querySelectorAll('.mobile-nav-link');

  function openNav() {
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileNavOverlay.classList.add('open');
    mobileNavOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
  }

  function closeNav() {
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNavOverlay.classList.remove('open');
    mobileNavOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
  }

  hamburgerBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    hamburgerBtn.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav();
  });

  mobileNavLinks.forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  mobileNavOverlay.addEventListener('click', e => { if (e.target === mobileNavOverlay) closeNav(); });

  /* ── Avatar animations ──────────────────────────────────── */
  const avatar          = document.querySelector('.avatar-photo');
  const avatarContainer = document.querySelector('.avatar-container');
  const animButtons     = document.querySelectorAll('.animation-buttons button');
  const hero            = document.querySelector('.hero');

  const ANIM_CONFIG = {
    pulse:     { css: 'pulse 3s ease-in-out infinite',       ringColor: '#ff4466', bgColor1: 'rgba(255,60,80,0.12)',  bgColor2: 'rgba(180,0,40,0.05)',   btnDot: '#ff4466' },
    bounce:    { css: 'bounce 2s ease-in-out infinite',       ringColor: '#FFD700', bgColor1: 'rgba(255,220,0,0.12)',  bgColor2: 'rgba(180,140,0,0.05)',  btnDot: '#FFD700' },
    rotate:    { css: 'rotate 4s linear infinite',            ringColor: '#00ff99', bgColor1: 'rgba(0,255,150,0.10)',  bgColor2: 'rgba(0,160,80,0.04)',   btnDot: '#00ff99' },
    fade:      { css: 'avatarFade 3s ease-in-out infinite',   ringColor: '#cc88ff', bgColor1: 'rgba(180,80,255,0.12)', bgColor2: 'rgba(100,0,200,0.05)',  btnDot: '#cc88ff' },
    heartbeat: { css: 'heartbeat 1.2s ease-in-out infinite',  ringColor: '#ff2255', bgColor1: 'rgba(255,20,60,0.14)',  bgColor2: 'rgba(160,0,30,0.06)',   btnDot: '#ff2255' },
    shake:     { css: 'shake 0.6s ease-in-out infinite',      ringColor: '#ff8800', bgColor1: 'rgba(255,140,0,0.12)',  bgColor2: 'rgba(180,80,0,0.05)',   btnDot: '#ff8800' },
    glitch:    { css: 'glitch 2.5s steps(1) infinite',        ringColor: '#00ffff', bgColor1: 'rgba(0,255,255,0.10)',  bgColor2: 'rgba(0,150,180,0.05)',  btnDot: '#00ffff' },
    morph:     { css: 'morph 4s ease-in-out infinite',        ringColor: '#ff66cc', bgColor1: 'rgba(255,80,200,0.12)', bgColor2: 'rgba(160,0,120,0.05)', btnDot: '#ff66cc' },
    orbit:     { css: '', orbit: true,                        ringColor: '#FFD700', bgColor1: 'rgba(255,200,0,0.10)',  bgColor2: 'rgba(160,120,0,0.04)', btnDot: '#FFD700' },
  };

  let orbitRing = avatarContainer.querySelector('.orbit-ring');
  if (!orbitRing) {
    orbitRing = document.createElement('div');
    orbitRing.className = 'orbit-ring';
    orbitRing.innerHTML = '<div class="orbit-dot"></div>';
    avatarContainer.appendChild(orbitRing);
  }

  let activeAnimations = ['pulse'];

  function blendRgba(colors) {
    let r = 0, g = 0, b = 0, a = 0;
    colors.forEach(c => {
      const m = c.match(/[\d.]+/g);
      if (m) { r += +m[0]; g += +m[1]; b += +m[2]; a += +m[3]; }
    });
    const n = colors.length || 1;
    return `rgba(${Math.round(r/n)},${Math.round(g/n)},${Math.round(b/n)},${+(a/n).toFixed(2)})`;
  }

  function updateAll() {
    const cssParts = [];
    let orbitActive = false;

    activeAnimations.forEach(name => {
      const cfg = ANIM_CONFIG[name];
      if (!cfg) return;
      if (cfg.orbit) { orbitActive = true; return; }
      if (cfg.css)   cssParts.push(cfg.css);
    });

    avatar.style.transition = 'opacity 0.35s ease, border-radius 0.6s ease, box-shadow 0.8s ease';
    avatar.style.opacity = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      avatar.style.animation = cssParts.length ? cssParts.join(', ') : 'none';
      avatar.style.opacity = '1';
    }));

    orbitRing.classList.toggle('active', orbitActive);

    const ringColors = activeAnimations.map(n => ANIM_CONFIG[n]?.ringColor).filter(Boolean);
    avatarContainer.style.setProperty('--ring-color',
      ringColors.length ? ringColors[Math.floor(ringColors.length / 2)] : '#00C6FF');

    const bg1s = activeAnimations.map(n => ANIM_CONFIG[n]?.bgColor1).filter(Boolean);
    const bg2s = activeAnimations.map(n => ANIM_CONFIG[n]?.bgColor2).filter(Boolean);
    if (hero) {
      hero.style.setProperty('--anim-color1', bg1s.length ? blendRgba(bg1s) : 'rgba(0,198,255,0.08)');
      hero.style.setProperty('--anim-color2', bg2s.length ? blendRgba(bg2s) : 'rgba(0,100,160,0.04)');
    }

    avatarContainer.classList.toggle('speaking', activeAnimations.length > 0);
  }

  animButtons.forEach(button => {
    const name = button.id.replace('-btn', '');
    const cfg  = ANIM_CONFIG[name];
    if (cfg) button.style.setProperty('--btn-dot-color', cfg.btnDot || 'transparent');
    if (activeAnimations.includes(name)) button.classList.add('active');

    button.addEventListener('click', function () {
      if (activeAnimations.includes(name)) {
        activeAnimations = activeAnimations.filter(a => a !== name);
        this.classList.remove('active');
      } else {
        activeAnimations.push(name);
        this.classList.add('active');
      }
      updateAll();
    });
  });

  /* ── Animations panel toggle ────────────────────────────── */
  const menuToggle  = document.getElementById('menu-toggle');
  const controlMenu = document.getElementById('control-menu');

  menuToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    controlMenu.classList.toggle('open');
  });

  document.addEventListener('click', function (e) {
    if (!controlMenu.contains(e.target)) controlMenu.classList.remove('open');
  });

  /* ── Scroll fade-in ─────────────────────────────────────── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('fade-in'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-section').forEach(s => observer.observe(s));

  updateAll();
});

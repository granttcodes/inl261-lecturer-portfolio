document.addEventListener('DOMContentLoaded', function () {

  const navList = document.getElementById('nav-list');
  const navEl = navList.closest('nav');
  const avatar          = document.querySelector('.avatar-photo');
  const avatarContainer = document.querySelector('.avatar-container');
  const buttons         = document.querySelectorAll('.animation-buttons button');
  const hero            = document.querySelector('.hero');
  const particles        = document.querySelector('.particles-container');

  /* ═══════════════════════════════════════════════════════════════
     HAMBURGER / MOBILE NAV
  ═══════════════════════════════════════════════════════════════ */
  const hamburgerBtn = document.getElementById('hamburger-btn');

  function toggleMobileNav() {
    const isOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    const newState = !isOpen;
    
    hamburgerBtn.setAttribute('aria-expanded', newState);
    navEl.classList.toggle('mobile-open', newState);
    document.body.classList.toggle('nav-open', newState);
  }

  function closeMobileNav() {
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    navEl.classList.remove('mobile-open');
    document.body.classList.remove('nav-open');
  }

  hamburgerBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleMobileNav();
  });

  // Close when a nav link is tapped
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (!navList.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      closeMobileNav();
    }
  });

  /* ── Animation catalogue ───────────────────────────────────────────
     Each entry defines:
       css        – animation shorthand passed to avatar.style.animation
       ringColor  – colour of the speakRing ripples
       bgColor1   – inner radial gradient stop on the hero
       bgColor2   – outer radial gradient stop on the hero
       btnDot     – small colour dot shown on the button
       orbit      – true if the orbit ring should spin
  ─────────────────────────────────────────────────────────────────── */
  const ANIM_CONFIG = {
    pulse: {
      css:       'pulse 3s ease-in-out infinite',
      ringColor: '#ff4466',
      bgColor1:  'rgba(255,60,80,0.12)',
      bgColor2:  'rgba(180,0,40,0.05)',
      btnDot:    '#ff4466',
    },
    bounce: {
      css:       'bounce 2s ease-in-out infinite',
      ringColor: '#FFD700',
      bgColor1:  'rgba(255,220,0,0.12)',
      bgColor2:  'rgba(180,140,0,0.05)',
      btnDot:    '#FFD700',
    },
    rotate: {
      css:       'rotate 4s linear infinite',
      ringColor: '#00ff99',
      bgColor1:  'rgba(0,255,150,0.10)',
      bgColor2:  'rgba(0,160,80,0.04)',
      btnDot:    '#00ff99',
    },
    fade: {
      css:       'avatarFade 3s ease-in-out infinite',
      ringColor: '#cc88ff',
      bgColor1:  'rgba(180,80,255,0.12)',
      bgColor2:  'rgba(100,0,200,0.05)',
      btnDot:    '#cc88ff',
    },
    heartbeat: {
      css:       'heartbeat 1.2s ease-in-out infinite',
      ringColor: '#ff2255',
      bgColor1:  'rgba(255,20,60,0.14)',
      bgColor2:  'rgba(160,0,30,0.06)',
      btnDot:    '#ff2255',
    },
    shake: {
      css:       'shake 0.6s ease-in-out infinite',
      ringColor: '#ff8800',
      bgColor1:  'rgba(255,140,0,0.12)',
      bgColor2:  'rgba(180,80,0,0.05)',
      btnDot:    '#ff8800',
    },
    glitch: {
      css:       'glitch 2.5s steps(1) infinite',
      ringColor: '#00ffff',
      bgColor1:  'rgba(0,255,255,0.10)',
      bgColor2:  'rgba(0,150,180,0.05)',
      btnDot:    '#00ffff',
    },
    morph: {
      css:       'morph 4s ease-in-out infinite',
      ringColor: '#ff66cc',
      bgColor1:  'rgba(255,80,200,0.12)',
      bgColor2:  'rgba(160,0,120,0.05)',
      btnDot:    '#ff66cc',
    },
    orbit: {
      css:       '',           // avatar itself stays still; only the ring spins
      ringColor: '#FFD700',
      bgColor1:  'rgba(255,200,0,0.10)',
      bgColor2:  'rgba(160,120,0,0.04)',
      btnDot:    '#FFD700',
      orbit:     true,
    },
  };

  /* ── Build / find orbit ring element ──────────────────────────── */
  let orbitRing = avatarContainer.querySelector('.orbit-ring');
  if (!orbitRing) {
    orbitRing = document.createElement('div');
    orbitRing.className = 'orbit-ring';
    orbitRing.innerHTML = '<div class="orbit-dot"></div>';
    avatarContainer.appendChild(orbitRing);
  }

  /* ── State ─────────────────────────────────────────────────────── */
  let activeAnimations = ['pulse'];

  /* ── Helpers ───────────────────────────────────────────────────── */
  // for(particles in {length: 15}) {
  //   const p = document.createElement('div');
  //   p.className = 'particle';
  //   // p.style.setProperty('--x', `${Math.random() * 200 - 100}vw`);
  //   // p.style.setProperty('--y', `${Math.random() * 200 - 100}vh`);
  //   // p.style.setProperty('--size', `${Math.random() * 4 + 1}px`);
  //   // p.style.setProperty('--delay', `${Math.random() * 5}s`);
  //   particles.appendChild(p);
  // }
  /* Blend two hex/rgba colours together (very simple average) */
  function blendRgba(colors) {
    // colours are CSS rgba strings like "rgba(r,g,b,a)"
    let r = 0, g = 0, b = 0, a = 0;
    colors.forEach(c => {
      const m = c.match(/[\d.]+/g);
      if (m) { r += +m[0]; g += +m[1]; b += +m[2]; a += +m[3]; }
    });
    const n = colors.length || 1;
    return `rgba(${Math.round(r/n)},${Math.round(g/n)},${Math.round(b/n)},${+(a/n).toFixed(2)})`;
  }

  function updateAll() {
    /* ── Build composite animation string ── */
    const cssParts    = [];
    let orbitActive   = false;

    activeAnimations.forEach(name => {
      const cfg = ANIM_CONFIG[name];
      if (!cfg) return;
      if (cfg.orbit) { orbitActive = true; return; }
      if (cfg.css)    cssParts.push(cfg.css);
    });

    /* Crossfade: set opacity to 0, swap animation, restore opacity */
    avatar.style.transition = 'opacity 0.35s ease, border-radius 0.6s ease, box-shadow 0.8s ease';
    avatar.style.opacity = '0';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        avatar.style.animation = cssParts.length ? cssParts.join(', ') : 'none';
        avatar.style.opacity   = '1';
      });
    });

    /* ── Orbit ring ── */
    orbitRing.classList.toggle('active', orbitActive);

    /* ── Ripple ring colour (mix active colours) ── */
    const ringColors = activeAnimations
      .map(n => ANIM_CONFIG[n]?.ringColor)
      .filter(Boolean);

    const ringColor = ringColors.length
      ? ringColors[Math.floor(ringColors.length / 2)]   // use dominant middle colour
      : '#00C6FF';
    avatarContainer.style.setProperty('--ring-color', ringColor);

    /* ── Ambient background ── */
    const bg1s = activeAnimations.map(n => ANIM_CONFIG[n]?.bgColor1).filter(Boolean);
    const bg2s = activeAnimations.map(n => ANIM_CONFIG[n]?.bgColor2).filter(Boolean);

    if (bg1s.length && hero) {
      hero.style.setProperty('--anim-color1', blendRgba(bg1s));
      hero.style.setProperty('--anim-color2', blendRgba(bg2s));
    } else if (hero) {
      hero.style.setProperty('--anim-color1', 'rgba(0,198,255,0.08)');
      hero.style.setProperty('--anim-color2', 'rgba(0,100,160,0.04)');
    }

    /* ── Speaking rings ── */
    if (activeAnimations.length === 0) {
      avatarContainer.classList.remove('speaking');
    } else {
      avatarContainer.classList.add('speaking');
    }
  }

  /* ── Wire up buttons ────────────────────────────────────────────── */
  buttons.forEach(button => {
    const name = button.id.replace('-btn', '');
    const cfg  = ANIM_CONFIG[name];

    // Colour dot hint on button
    if (cfg) button.style.setProperty('--btn-dot-color', cfg.btnDot || 'transparent');

    // Restore active state
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

  /* ── Animated toggle menu ───────────────────────────────────────── */
  const menuToggle  = document.getElementById('menu-toggle');
  const controlMenu = document.getElementById('control-menu');

  menuToggle.addEventListener('click', function () {
    controlMenu.classList.toggle('open');
  });

  /* Close panel when clicking outside */
  document.addEventListener('click', function (e) {
    if (!controlMenu.contains(e.target) && e.target !== menuToggle) {
      controlMenu.classList.remove('open');
    }
  });

  /* ── Initial render ─────────────────────────────────────────────── */
  updateAll();

  // Redundant navToggle logic removed

  /* ── Scroll fade-in for sections ────────────────────────────────── */
  const fadeSections = document.querySelectorAll('.fade-section');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  fadeSections.forEach(section => {
    observer.observe(section);
  });
});
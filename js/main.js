/* =========================================================
   Usman Tariq — Portfolio JS
   Vanilla JS only, no build step, GitHub Pages ready.
   ========================================================= */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- CONFIG ---------- */
  const CONFIG = {
    githubUsername: 'iusmantariq', // change to your real GitHub username
    // Set one of these to make the contact form live (see README for setup):
    formspreeEndpoint: '', // e.g. 'https://formspree.io/f/xxxxxxx'
    emailjs: { serviceId: '', templateId: '', publicKey: '' }
  };

  /* ---------- (Project data removed — Portfolio section shows a "coming soon" state.
     Re-add a PROJECTS array + the filter/render logic here when you have real work to show.) ---------- */

  /* =========================================================
     Loader
     ========================================================= */
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 400);
  });

  /* =========================================================
     Theme toggle (persisted)
     ========================================================= */
  const root = document.documentElement;
  const themeToggle = $('#themeToggle');
  const savedTheme = localStorage.getItem('ut-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  root.setAttribute('data-theme', savedTheme || (prefersLight ? 'light' : 'dark'));

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ut-theme', next);
  });

  /* =========================================================
     Sticky nav shrink + active section + scroll progress
     ========================================================= */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav-link');
  const progressBar = $('#scroll-progress');
  const backToTop = $('#backToTop');

  const onScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = `${(scrollY / docHeight) * 100}%`;
    if (backToTop) backToTop.classList.toggle('show', scrollY > 600);

    let currentId = sections[0]?.id;
    for (const sec of sections) {
      if (scrollY + 140 >= sec.offsetTop) currentId = sec.id;
    }
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  $('#scrollCue')?.addEventListener('click', () => $('#about')?.scrollIntoView({ behavior: 'smooth' }));

  /* =========================================================
     Mobile menu
     ========================================================= */
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  hamburger?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  $$('.mobile-link').forEach(link => link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  }));

  /* =========================================================
     Scroll reveal (IntersectionObserver)
     ========================================================= */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* =========================================================
     Counter animation for stats
     ========================================================= */
  const counters = $$('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* =========================================================
     Typed hero words
     ========================================================= */
  const typedWords = ['ship.', 'convert.', 'scale.', 'stand out.', 'sell themselves.'];
  const typedEl = $('#typedWord');
  if (typedEl) {
    let wordIndex = 0, charIndex = 0, deleting = false;
    const type = () => {
      const word = typedWords[wordIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) { deleting = true; setTimeout(type, 1400); return; }
      } else {
        charIndex--;
        typedEl.textContent = word.slice(0, charIndex);
        if (charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % typedWords.length; }
      }
      setTimeout(type, deleting ? 45 : 85);
    };
    setTimeout(type, 600);
  }

  /* =========================================================
     Hero particle canvas (lightweight, no deps)
     ========================================================= */
  const canvas = $('#particleCanvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(148,163,184,0.5)';
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  /* =========================================================
     Skill tabs + animated bars
     ========================================================= */
  const skillTabs = $$('.skill-tab');
  const skillPanels = $$('.skill-panel');
  const animateBars = (panel) => $$('.bar', panel).forEach(bar => bar.classList.add('animated'));

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      skillPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = $('#' + tab.dataset.target);
      panel.classList.add('active');
      animateBars(panel);
    });
  });
  // animate the first visible panel once scrolled into view
  const firstPanel = $('.skill-panel.active');
  if (firstPanel) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animateBars(firstPanel); obs.disconnect(); } });
    }, { threshold: 0.3 });
    obs.observe(firstPanel);
  }

  /* =========================================================
     GitHub API integration
     ========================================================= */
  const loadGithubStats = async () => {
    const { githubUsername } = CONFIG;
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${githubUsername}`),
        fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`)
      ]);
      if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API request failed');
      const user = await userRes.json();
      const repos = await reposRes.json();

      $('#ghAvatar').src = user.avatar_url;
      $('#ghName').textContent = `@${user.login}`;
      $('#ghBio').textContent = user.bio || `${user.public_repos} public repositories on GitHub.`;
      $('#ghRepos').textContent = user.public_repos ?? '—';
      $('#ghFollowers').textContent = user.followers ?? '—';
      $('#ghFollowing').textContent = user.following ?? '—';

      const totalStars = Array.isArray(repos) ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0) : 0;
      $('#ghStars').textContent = totalStars;

      const repoList = $('#ghRepoList');
      if (repoList && Array.isArray(repos)) {
        repoList.innerHTML = repos.slice(0, 6).map(r => `
          <a class="gh-repo" href="${r.html_url}" target="_blank" rel="noopener">
            <strong>${r.name}</strong>
            <p>${r.description ? r.description.slice(0, 70) : 'No description'} · ★ ${r.stargazers_count}</p>
          </a>
        `).join('');
      }
    } catch (err) {
      const bio = $('#ghBio');
      if (bio) bio.textContent = `Live stats unavailable right now — check github.com/${githubUsername} directly.`;
      console.warn('GitHub stats failed to load:', err);
    }
  };
  loadGithubStats();

  /* =========================================================
     Testimonials slider
     ========================================================= */
  const track = $('#testimonialTrack');
  const dotsWrap = $('#testimonialDots');
  if (track && dotsWrap) {
    const slides = $$('.testimonial-card', track);
    let index = 0;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = $$('button', dotsWrap);
    const goTo = (i) => {
      index = i;
      track.style.transform = `translateX(-${i * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === i));
    };
    setInterval(() => goTo((index + 1) % slides.length), 5500);
  }

  /* =========================================================
     Contact form (Formspree / EmailJS ready, graceful fallback)
     ========================================================= */
  const form = $('#contactForm');
  const status = $('#formStatus');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || !data.email || !data.message) {
      status.textContent = 'Please fill in all required fields.';
      return;
    }

    status.textContent = 'Sending…';

    try {
      if (CONFIG.formspreeEndpoint) {
        const res = await fetch(CONFIG.formspreeEndpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });
        if (!res.ok) throw new Error('Formspree error');
        status.textContent = 'Message sent — thanks! I\'ll reply soon.';
        form.reset();
      } else if (CONFIG.emailjs.serviceId && window.emailjs) {
        await window.emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, data, CONFIG.emailjs.publicKey);
        status.textContent = 'Message sent — thanks! I\'ll reply soon.';
        form.reset();
      } else {
        // No backend configured yet — fall back to a mailto draft so it's still usable.
        const mailto = `mailto:usmanofficial550@gmail.com?subject=${encodeURIComponent(data.subject || 'Portfolio contact')}&body=${encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`)}`;
        window.location.href = mailto;
        status.textContent = 'Opening your email client — add a Formspree/EmailJS ID in js/main.js to send in-page instead.';
      }
    } catch (err) {
      status.textContent = 'Something went wrong — please email usmanofficial550@gmail.com directly.';
      console.error(err);
    }
  });

  /* =========================================================
     Email quick-link: scroll to form and focus it
     ========================================================= */
  $('#emailContactLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    $('#contactForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => $('#cName')?.focus(), 500);
  });

  /* =========================================================
     Ripple effect on buttons
     ========================================================= */
  $$('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      circle.className = 'ripple-circle';
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${e.clientX - rect.left - size / 2}px`;
      circle.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  /* =========================================================
     Custom cursor
     ========================================================= */
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  if (dot && ring && window.matchMedia('(hover:hover)').matches) {
    let ringX = 0, ringY = 0;
    window.addEventListener('mousemove', (e) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      ringX = e.clientX; ringY = e.clientY;
    });
    const animateRing = () => {
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    };
    animateRing();
    $$('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.6)');
      el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  }

  /* =========================================================
     Command palette (Ctrl/Cmd + K)
     ========================================================= */
  const paletteOverlay = $('#paletteOverlay');
  const paletteInput = $('#paletteInput');
  const paletteResults = $('#paletteResults');
  const paletteItems = [
    { label: 'Home', target: '#home' },
    { label: 'About', target: '#about' },
    { label: 'Skills', target: '#skills' },
    { label: 'Services', target: '#services' },
    { label: 'Portfolio', target: '#portfolio' },
    { label: 'Experience', target: '#experience' },
    { label: 'GitHub Stats', target: '#github' },
    { label: 'Contact', target: '#contact' },
    { label: 'Toggle theme', action: () => themeToggle?.click() }
  ];

  const openPalette = () => {
    paletteOverlay.classList.add('open');
    paletteInput.value = '';
    renderPaletteResults('');
    setTimeout(() => paletteInput.focus(), 50);
  };
  const closePalette = () => paletteOverlay.classList.remove('open');

  const renderPaletteResults = (query) => {
    const filtered = paletteItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
    paletteResults.innerHTML = filtered.map((item, i) => `<li data-index="${i}">${item.label}</li>`).join('') || '<li>No matches</li>';
    $$('li', paletteResults).forEach((li, i) => {
      li.addEventListener('click', () => {
        const item = filtered[i];
        if (item.target) $(item.target)?.scrollIntoView({ behavior: 'smooth' });
        if (item.action) item.action();
        closePalette();
      });
    });
  };

  paletteInput?.addEventListener('input', () => renderPaletteResults(paletteInput.value));
  $('#paletteBtn')?.addEventListener('click', openPalette);
  paletteOverlay?.addEventListener('click', (e) => { if (e.target === paletteOverlay) closePalette(); });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      paletteOverlay.classList.contains('open') ? closePalette() : openPalette();
    }
    if (e.key === 'Escape') closePalette();
  });

  /* =========================================================
     Footer year
     ========================================================= */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();

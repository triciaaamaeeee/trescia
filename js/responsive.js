(() => {
  'use strict';
  const root = document.documentElement;
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-menu');
  const menuIcon = document.getElementById('menu-icon');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');
  const mobile = window.matchMedia('(max-width: 1100px)');

  function setMenu(open, restoreFocus = false) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuIcon.textContent = open ? '\u00d7' : '\u2630';
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) setMenu(false);
  });
  mobile.addEventListener('change', () => setMenu(false));
  setMenu(false);

  function applyTheme(theme) {
    root.dataset.theme = theme;
    themeIcon.textContent = theme === 'dark' ? '\u2600' : '\u263e';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#171615' : '#fff8ed';
  }
  let savedTheme;
  try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) { /* Storage is optional. */ }
  applyTheme(savedTheme === 'light' ? 'light' : 'dark');
  themeToggle.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (_) { /* Storage is optional. */ }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  function updateScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
    if (!backToTop) return;
    const visible = window.scrollY > 500;
    backToTop.classList.toggle('visible', visible);
    backToTop.setAttribute('aria-hidden', String(!visible));
    backToTop.tabIndex = visible ? 0 : -1;
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window) {
    const links = [...menu.querySelectorAll('a')];
    const sections = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const active = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => sections.observe(section));
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else if (!motionPreference.matches) {
          entry.target.classList.remove('show');
        }
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.section-heading').forEach(item => item.classList.add('reveal'));
    document.querySelectorAll('.reveal').forEach(item => {
      const siblings = [...item.parentElement.children].filter(child => child.classList.contains('reveal'));
      item.style.setProperty('--reveal-delay', Math.min(siblings.indexOf(item), 3) * 90 + 'ms');
      if (motionPreference.matches) item.classList.add('show');
      else reveal.observe(item);
    });
    motionPreference.addEventListener('change', () => {
      if (motionPreference.matches) document.querySelectorAll('.reveal').forEach(item => item.classList.add('show'));
    });
    root.classList.add('js');
  }

  // Short entrance animations preserve the final layout and remain optional.
  const homeItems = document.querySelectorAll('.hero-content > *, .hero-visual');
  const entrances = [];
  if (!motionPreference.matches) {
    homeItems.forEach((item, index) => {
      if (typeof item.animate !== 'function') return;
      entrances.push(item.animate([
        { opacity: 0, transform: 'translateY(22px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 650, delay: Math.min(index, 5) * 110, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }));
    });
  }

  // Type the existing role once; its full text remains available to screen readers.
  const role = document.querySelector('.hero-content h2 .home-accent');
  let typingTimer;
  let finishTyping = () => {};
  if (role && !motionPreference.matches) {
    const text = role.textContent;
    role.textContent = '';
    const accessible = document.createElement('span');
    accessible.className = 'motion-sr-only';
    accessible.textContent = text;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    const reserve = document.createElement('span');
    reserve.className = 'typing-reserve';
    reserve.setAttribute('aria-hidden', 'true');
    reserve.textContent = text;
    role.classList.add('typing-role');
    role.append(accessible, reserve, visual);
    let position = 0;
    finishTyping = () => {
      clearTimeout(typingTimer);
      visual.textContent = text;
      role.classList.remove('is-typing');
    };
    const type = () => {
      if (motionPreference.matches) { finishTyping(); return; }
      visual.textContent = text.slice(0, ++position);
      if (position < text.length) typingTimer = setTimeout(type, 95);
      else finishTyping();
    };
    role.classList.add('is-typing');
    typingTimer = setTimeout(type, 500);
  }
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) {
      entrances.forEach(animation => animation.cancel());
      finishTyping();
    }
  });
})();
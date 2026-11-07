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
    const visible = window.scrollY > 500;
    backToTop.classList.toggle('visible', visible);
    backToTop.setAttribute('aria-hidden', String(!visible));
    backToTop.tabIndex = visible ? 0 : -1;
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

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
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(item => reveal.observe(item));
    root.classList.add('js');
  }
})();
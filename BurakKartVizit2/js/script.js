/* ============================================================
   Burak Yiğit Solmaz — Kartvizit | js/script.js
   ============================================================ */

// ---------- HTML elementleri ----------
const header = document.getElementById('header');
const navToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const kartFlip = document.getElementById('kartFlip');
const yearEl = document.getElementById('year');

// ---------- Header scroll efekti ----------
function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Mobil menü ----------
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Kart çevir (ön / arka) ----------
function flipCard() {
  kartFlip.classList.toggle('flipped');
}
kartFlip.addEventListener('click', flipCard);
document.getElementById('flipCard').addEventListener('click', (e) => {
  e.stopPropagation();
  flipCard();
});

// ---------- Dark / Light tema ----------
const THEME_KEY = 'burak-theme';

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
});

initTheme();

// ---------- Scroll reveal animasyonları ----------
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

if ('IntersectionObserver' in window) {
  revealElements.forEach(el => revealObserver.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('visible'));
}

// ---------- Yıl ----------
yearEl.textContent = new Date().getFullYear();

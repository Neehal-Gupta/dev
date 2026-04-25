/* ─── DATA ─── */
const CERTS = {
  Oracle: [
    { name:"OCI AI Foundations Associate",          issuer:"Oracle University", date:"Oct 2025", file:"OCI AI Foundations Associate.pdf" },
    { name:"OCI Generative AI Professional",         issuer:"Oracle University", date:"Oct 2025", file:"OCI Generative AI Professional.pdf" },
    { name:"Oracle Analytics Cloud 2025 Certified Professional", issuer:"Oracle University", date:"Oct 2025", file:"Oracle Analytics Cloud 2025 Certified Professional.pdf" },
    { name:"OCI Foundations Associate",              issuer:"Oracle University", date:"Oct 2025", file:"Foundations Associate.pdf" },
  ],
  "Google Cloud": [
    { name:"Generative AI Leader", issuer:"Google Cloud", date:"Nov 2025", file:"GenerativeAILeader20251107-29-k01nje.pdf" },
  ],
  AWS: [
    { name:"AWS Certified Cloud Practitioner", issuer:"Amazon Web Services", date:"May 2022", file:"Foundations Associate.pdf" },
  ]
};
const CERT_BASE = "https://neehal-gupta.github.io/certifications/";
const RESUME_URL = "https://neehal-gupta.github.io/NeehalRajGupta.pdf";

/* ─── LOADER ─── */
let p = 0;
const pctEl = document.getElementById('loader-pct');
const fillEl = document.getElementById('loader-fill');
const loaderEl = document.getElementById('loader');
const t = setInterval(() => {
  p = Math.min(p + Math.random() * 10 + 2, 100);
  const v = Math.floor(p);
  pctEl.textContent = String(v).padStart(2,'0') + '%';
  fillEl.style.width = p + '%';
  if (p >= 100) {
    clearInterval(t);
    setTimeout(() => {
      loaderEl.style.transition = 'opacity .5s';
      loaderEl.style.opacity = '0';
      setTimeout(() => loaderEl.remove(), 500);
    }, 200);
  }
}, 55);

/* ─── CURSOR ─── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
  rx += (mx - rx) * 0.10; ry += (my - ry) * 0.10;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
// Use event delegation — works for dynamically added cards too
const HOVER_SEL = 'a, button, .skill-row, .proj-card, .cert-card, .stat-box, .float-btn, .cert-tab, .nav-logo, .btn-primary, .btn-outline, .hero-stat, .hero-title';
document.addEventListener('mouseover', e => {
  if (e.target.closest(HOVER_SEL)) document.body.classList.add('cur-hover');
});
document.addEventListener('mouseout', e => {
  if (e.target.closest(HOVER_SEL)) document.body.classList.remove('cur-hover');
});

/* ─── SCROLL PROGRESS ─── */
const progBar = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  progBar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
});

/* ─── REVEAL ─── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ─── THEME ─── */
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
function isDark() { return html.dataset.theme === 'dark'; }
themeBtn.addEventListener('click', () => {
  html.dataset.theme = isDark() ? 'light' : 'dark';
  themeBtn.textContent = isDark() ? '☀' : '☾';
  localStorage.setItem('theme', html.dataset.theme);
});
const saved = localStorage.getItem('theme');
if (saved) { html.dataset.theme = saved; themeBtn.textContent = saved === 'dark' ? '☀' : '☾'; }

/* ─── MOBILE MENU ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ─── PROJECTS ─── */
fetch('https://api.github.com/users/Neehal-Gupta/repos?sort=updated&per_page=12')
  .then(r => r.json())
  .then(data => {
    const repos = data.filter(r => !r.fork && r.description).slice(0, 6);
    const grid = document.getElementById('proj-grid');
    if (!repos.length) { grid.innerHTML = '<div class="proj-empty">No public projects found.</div>'; return; }
    grid.innerHTML = repos.map((r, i) => `
      <a class="proj-card" href="${r.html_url}" target="_blank" rel="noreferrer">
        <div class="proj-card-num">0${i+1}</div>
        <div class="proj-card-name">${r.name.replace(/-/g,' ')}</div>
        <div class="proj-card-desc">${r.description}</div>
        <div class="proj-card-footer">
          <span class="proj-lang">${r.language || ''}</span>
          <span class="proj-link">View on GitHub ↗</span>
        </div>
      </a>`).join('');
    document.querySelectorAll('.proj-card, .float-btn').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  })
  .catch(() => { document.getElementById('proj-grid').innerHTML = '<div class="proj-empty">Could not load repositories.</div>'; });

/* ─── CERTIFICATIONS ─── */
function renderCerts(provider) {
  const grid = document.getElementById('certGrid');
  grid.classList.remove('show');
  setTimeout(() => {
    grid.innerHTML = CERTS[provider].map(c => `
      <div class="cert-card">
        <div class="cert-provider-tag">${c.issuer}</div>
        <div class="cert-name">${c.name}</div>
        <div class="cert-date">${c.date}</div>
        <div class="cert-actions">
          <a class="cert-action" href="${CERT_BASE}${encodeURIComponent(c.file)}" target="_blank">View ↗</a>
          <a class="cert-action" href="${CERT_BASE}${encodeURIComponent(c.file)}" download="${c.file}">Download ↓</a>
        </div>
      </div>`).join('');
    grid.classList.add('show');
  }, 180);
}
renderCerts('Oracle');
document.getElementById('certTabs').addEventListener('click', e => {
  const btn = e.target.closest('.cert-tab');
  if (!btn) return;
  document.querySelectorAll('.cert-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCerts(btn.dataset.p);
});
// ─── DYNAMIC TAB TITLE ───
// (function () {
//   const titles = [
//     "Neehal Raj Gupta | Backend Engineer",
//     "Neehal Raj Gupta | Java Developer",
//     "Neehal Raj Gupta | AI Systems"
//   ];

//   let index = 0;

//   setInterval(() => {
//     document.title = titles[index];
//     index = (index + 1) % titles.length;
//   }, 2000);
// })();

// ─── SMOOTH SCROLLING TAB TITLE ───
(function () {
  const titleText = "  Neehal Raj Gupta | Backend Engineer | Java & AI Systems  •  ";
  let position = 0;

  function scrollTitle() {
    document.title =
      titleText.substring(position) + titleText.substring(0, position);
    position = (position + 1) % titleText.length;
  }

  setInterval(scrollTitle, 100); // adjust speed here
})();

// let interval;

// function startScroll() {
//   interval = setInterval(scrollTitle, 150);
// }

// function stopScroll() {
//   clearInterval(interval);
// }

// document.addEventListener("visibilitychange", () => {
//   if (document.hidden) {
//     stopScroll();
//   } else {
//     startScroll();
//   }
// });

// startScroll();
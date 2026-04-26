// 🔥 COMPLETE INTENTS
const intents = [

  {
    question: "Tell me about yourself",
    keywords: ["about", "yourself", "who are you", "introduction","intro"],
    response: `
I'm Neehal Raj Gupta, a Backend Engineer with 3+ years of experience at Genpact.

I specialize in building scalable backend systems using Java, Spring Boot, and microservices. 
I’ve also worked on Generative AI solutions using OCI and Vertex AI.

👉 I focus on clean architecture, performance, and production-grade systems.
`
  },

  {
    question: "What is your experience?",
    keywords: ["experience", "years", "work"],
    response: `
I have 3+ years of experience building enterprise backend systems.

At Genpact, I’ve:
✔ Delivered 50+ production features  
✔ Built scalable microservices  
✔ Worked on AI-driven enhancements  

👉 I focus on reliability, scalability, and performance.
`
  },

  {
    question: "What tech stack do you use?",
    keywords: ["tech", "stack", "skills", "technology"],
    response: `
My core tech stack includes:

⚙️ Java, Spring Boot, Microservices  
☁️ Cloud & DevOps (Docker, CI/CD)  
📊 Kafka, PostgreSQL  
🤖 Generative AI (OCI GenAI, Vertex AI)

👉 I work across backend + cloud + AI systems.
`
  },

  {
    question: "What kind of backend systems have you built?",
    keywords: ["backend", "systems", "architecture"],
    response: `
I’ve built enterprise-grade backend systems using microservices architecture.

✔ REST APIs with Spring Boot  
✔ Event-driven systems using Kafka  
✔ Scalable and modular services  
✔ Integration with multiple enterprise systems  

👉 Focus has been on scalability and maintainability.
`
  },

  {
    question: "Do you have experience with microservices?",
    keywords: ["microservices", "architecture"],
    response: `
Yes, I’ve worked extensively with microservices architecture.

✔ Designed modular services  
✔ Independent deployment pipelines  
✔ API-based communication  
✔ Scalable service design  

👉 Helps improve system flexibility and scalability.
`
  },

  {
    question: "Tell me about your AI experience",
    keywords: ["ai", "genai", "machine learning"],
    response: `
I’ve worked on Generative AI integrations using:

🤖 OCI Generative AI  
🤖 Google Vertex AI  

Use cases include:
✔ Intelligent insights generation  
✔ Automation workflows  
✔ AI-assisted decision systems  

👉 Focus is on practical AI applications in enterprise systems.
`
  },

  {
    question: "What performance improvements have you done?",
    keywords: ["performance", "optimization", "improvement"],
    response: `
I’ve worked extensively on performance optimization:

⚡ Reduced API response time by ~15–20%  
⚡ Optimized PostgreSQL queries  
⚡ Improved system throughput and reliability  

👉 Performance engineering is a key focus area for me.
`
  },

  {
    question: "What projects have you worked on?",
    keywords: ["projects", "portfolio"],
    response: `
Some of my key work includes:

🚀 Backend services for enterprise applications  
📊 KPI dashboards and analytics features  
🤖 AI-driven enhancements  

👉 You can explore detailed projects in the Projects section below.
`
  },

  {
    question: "How do you work in teams?",
    keywords: ["team", "collaboration", "agile"],
    response: `
I work in cross-functional Agile teams.

✔ Collaborate with product, QA, and DevOps  
✔ Participate in code reviews  
✔ Own features end-to-end  

👉 I enjoy building systems collaboratively.
`
  },

  {
    question: "Have you worked with databases?",
    keywords: ["database", "postgresql", "sql"],
    response: `
Yes, I’ve worked with PostgreSQL extensively.

✔ Query optimization  
✔ Data modeling  
✔ Performance tuning  

👉 Strong focus on efficient data handling.
`
  },

  {
    question: "What is your development approach?",
    keywords: ["approach", "development", "process"],
    response: `
My development approach focuses on:

✔ Clean and maintainable code  
✔ Scalable architecture  
✔ Performance optimization  
✔ End-to-end ownership  

👉 I aim to build production-ready systems.
`
  },

  {
    question: "Are you open to opportunities?",
    keywords: ["hire", "opportunity", "job", "open"],
    response: `
Yes, I’m open to backend, cloud, and AI-related opportunities.

👉 I’m particularly interested in building scalable systems and solving complex problems.
`
  },

  {
    question: "How can I contact you?",
    keywords: ["contact", "email", "reach"],
    response: `
You can reach me at:

📧 <a href="mailto:nrg9922@gmail.com">nrg9922@gmail.com</a> <br> 
📞 <a href="tel:+919065802656">+91 9065802656</a><br>

👉 Feel free to connect for opportunities or discussions.
`
  },

  {
    question: "Can you explain your recent work?",
    keywords: ["recent", "latest work"],
    response: `
Recently, I’ve been working on backend enhancements and AI integrations.

✔ Improved system performance  
✔ Built scalable services  
✔ Integrated AI-driven features  

👉 Focus is on real-world impact and scalability.
`
  },

  {
    question: "What makes you different?",
    keywords: ["different", "why you", "strength"],
    response: `
My strengths include:

✔ Strong backend fundamentals  
✔ Experience with scalable systems  
✔ Exposure to AI + cloud technologies  
✔ Focus on performance and clean design  

👉 I combine engineering depth with practical impact.
`
  }

];

function renderSuggestions() {
  const suggestionBox = document.getElementById("chat-suggestions");

  if (!suggestionBox) {
    console.error("chat-suggestions div not found");
    return;
  }

  suggestionBox.innerHTML = "";

  intents.forEach(intent => {
    const btn = document.createElement("button");
    btn.innerText = intent.question;

    btn.onclick = () => {
      addMessage(intent.question, "user");

      showTyping(() => {
        addMessage(intent.response, "bot");
      });
    };

    suggestionBox.appendChild(btn);
  });
}

/* ─── DATA ─── */
const CERTS = {
  Oracle: [
    { name: "OCI AI Foundations Associate", issuer: "Oracle University", date: "Oct 2025", file: "OCI AI Foundations Associate.pdf" },
    { name: "OCI Generative AI Professional", issuer: "Oracle University", date: "Oct 2025", file: "OCI Generative AI Professional.pdf" },
    { name: "Oracle Analytics Cloud 2025 Certified Professional", issuer: "Oracle University", date: "Oct 2025", file: "Oracle Analytics Cloud 2025 Certified Professional.pdf" },
    { name: "OCI Foundations Associate", issuer: "Oracle University", date: "Oct 2025", file: "Foundations Associate.pdf" },
  ],
  "Google Cloud": [
    { name: "Generative AI Leader", issuer: "Google Cloud", date: "Nov 2025", file: "GenerativeAILeader20251107-29-k01nje.pdf" },
  ],
  AWS: [
    { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", date: "May 2022", file: "Foundations Associate.pdf" },
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
  pctEl.textContent = String(v).padStart(2, '0') + '%';
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
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
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
        <div class="proj-card-num">0${i + 1}</div>
        <div class="proj-card-name">${r.name.replace(/-/g, ' ')}</div>
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

// 🔥 CHAT TOGGLE
// const toggle = document.getElementById("chat-toggle");
// const chatWindow = document.getElementById("chat-window");
// const closeBtn = document.getElementById("chat-close");

// toggle.addEventListener("click", () => {
//   chatWindow.style.display =
//     chatWindow.style.display === "flex" ? "none" : "flex";
// });
// closeBtn.onclick = () => chatWindow.style.display = "none";

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("chat-toggle");
  const chatWindow = document.getElementById("chat-window");
  const closeBtn = document.getElementById("chat-close");
  const backBtn = document.getElementById("back-to-chat");

  if (!toggle || !chatWindow) {
    console.error("Chat elements not found");
    return;
  }


  toggle.addEventListener("click", () => {
    chatWindow.classList.toggle("open");

    if (chatWindow.classList.contains("open")) {
      backBtn.style.display = "none";
    }
  });

  // 🔥 Close button
  closeBtn.addEventListener("click", () => {
    chatWindow.classList.remove("open");
  });

  // 🔥 Scroll logic (ONLY place this should exist)
  window.addEventListener("scroll", () => {
    if (chatWindow.classList.contains("open")) {
      backBtn.style.display = "none";
      return;
    }

    if (window.scrollY > 300) {
      backBtn.style.display = "block";
      toggle.style.display = "none";  
    } else {
      backBtn.style.display = "none";
      toggle.style.display = "flex";  
    }
  });

  // 🔥 Back button click
  backBtn.addEventListener("click", () => {
    chatWindow.classList.add("open");
    backBtn.style.display = "none";
    toggle.style.display = "flex";
  });
});

// 📩 ELEMENTS
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("chat-send");
const messages = document.getElementById("chat-messages");

// ✨ ADD MESSAGE
function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = "message " + type;
  msg.innerHTML = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;

  messages.scrollTo({
  top: messages.scrollHeight,
  behavior: "smooth"
});

}

// ⏳ TYPING ANIMATION
// function showTyping(callback) {
//   const typing = document.createElement("div");
//   typing.className = "message bot";
//   typing.innerHTML = "● ● ●";
//   messages.appendChild(typing);

//   setTimeout(() => {
//     typing.remove();
//     callback();
//   }, 800);
// }

function showTyping(callback) {
  const typing = document.createElement("div");
  typing.className = "message bot typing";

  typing.innerHTML = `<span></span><span></span><span></span>`;
  messages.appendChild(typing);

  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    typing.remove();
    callback();
  }, 900);
}

// 🤖 BOT LOGIC (use your intents)
// function getBotReply(inputText) {
//   inputText = inputText.toLowerCase();

//   if (inputText.includes("about")) {
//     return "I'm Neehal, a Backend Engineer with 3+ years at Genpact building scalable systems.";
//   }

//   if (inputText.includes("tech")) {
//     return "I work with Java, Spring Boot, Microservices, Cloud, and AI systems.";
//   }

//   if (inputText.includes("project")) {
//     return "You can explore my projects section below 👇";
//   }

//   if (inputText.includes("ai")) {
//     return "I’ve worked on Generative AI using OCI and Vertex AI.";
//   }

//   return "You can ask about my experience, tech stack, or projects 👇";
// }

function getBotReply(input) {
  input = input.toLowerCase();

  let bestMatch = null;
  let maxMatches = 0;

  for (let intent of intents) {
    let matches = intent.keywords.filter(k => input.includes(k)).length;

    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = intent;
    }
  }

  if (bestMatch) return bestMatch.response;

  return `
That’s a great question 🤔  

I may not have a direct answer yet.

👉 Meanwhile you can explore:
<button class="chat-link-btn" data-target="projects">Projects</button>
<button class="chat-link-btn" data-target="experience">Experience</button> <br>

You can reach me at:<br>
<div>📧 <a href="mailto:nrg9922@gmail.com">nrg9922@gmail.com</a></div>
<div>📞 <a href="tel:+919065802656">+91 90658 02656</a></div>

👉 Feel free to connect for discussions.
`;
}

// 🚀 SEND MESSAGE
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  showTyping(() => {
    const reply = getBotReply(text);
    addMessage(reply, "bot");
  });
}

sendBtn.onclick = sendMessage;
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

// 💡 SUGGESTIONS
// document.querySelectorAll(".chat-suggestions button").forEach(btn => {
//   btn.onclick = () => {
//     input.value = btn.innerText;
//     sendMessage();
//   };
// });

// function saveChat() {
//   localStorage.setItem("chatHistory", messages.innerHTML);
// }

// function loadChat() {
//   const saved = localStorage.getItem("chatHistory");
//   if (saved) messages.innerHTML = saved;
// }

// loadChat();

renderSuggestions();

const chatMessages = document.getElementById("chat-messages");

// chatMessages.addEventListener("wheel", (e) => {
//   e.stopPropagation();
// });

chatMessages.addEventListener("wheel", (e) => {
  const atTop = chatMessages.scrollTop === 0;
  const atBottom =
    chatMessages.scrollHeight - chatMessages.scrollTop === chatMessages.clientHeight;

  if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
    e.preventDefault();
  }

  e.stopPropagation();
});

const chatWindowEl = document.getElementById("chat-window");

chatWindowEl.addEventListener("mouseenter", () => {
  document.body.style.overflow = "hidden";
});

chatWindowEl.addEventListener("mouseleave", () => {
  document.body.style.overflow = "";
});

document.addEventListener("click", function (e) {
  if (e.target.matches(".message a")) {
    const chatWindow = document.getElementById("chat-window");

    setTimeout(() => {
      chatWindow.classList.remove("open");
    }, 200);
  }
});

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener("load", () => {
  // Always start from top
  window.scrollTo(0, 0);

  // Remove #section from URL if present
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }
});

// 🔥 SECTION BASED SUGGESTIONS
const sectionSuggestions = {
  hero: [
    "Tell me about yourself",
    "What do you do?"
  ],
  projects: [
    "Explain your projects",
    "What tech stack did you use?"
  ],
  experience: [
    "What is your experience?",
    "What impact did you deliver?"
  ]
};

let hasUserScrolled = false;

window.addEventListener("scroll", () => {
  hasUserScrolled = true;
});

// 🔥 Detect visible section
const sectionObserver = new IntersectionObserver((entries) => {
  if (!hasUserScrolled) return; // 🔥 prevents override on page load

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionId = entry.target.id;

      if (sectionSuggestions[sectionId]) {
        updateSuggestions(sectionSuggestions[sectionId]);
      }
    }
  });
}, { threshold: 0.5 });

// Observe sections
["hero", "projects", "experience"].forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// 🔥 Update suggestions dynamically
function updateSuggestions(questions) {
  const suggestionBox = document.getElementById("chat-suggestions");
  if (!suggestionBox) return;

  suggestionBox.innerHTML = "";

  questions.forEach(q => {
    const btn = document.createElement("button");
    btn.innerText = q;

    btn.onclick = () => {
      addMessage(q, "user");

      showTyping(() => {
        const reply = getBotReply(q);
        addMessage(reply, "bot");
      });
    };

    suggestionBox.appendChild(btn);
  });
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("chat-link-btn")) {

    const targetId = e.target.getAttribute("data-target");
    const target = document.getElementById(targetId);

    if (!target) return;

    const offset = 80;

    const topPosition =
      target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: topPosition,
      behavior: "smooth",
    });

    // close chat
    const chatWindow = document.getElementById("chat-window");
    chatWindow.classList.remove("open");
  }
});
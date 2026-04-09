/* =============================================
   PORTFOLIO SCRIPT
   ============================================= */

// ── Custom Cursor ───────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .project-card, .skill-group').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '18px';
    cursor.style.height = '18px';
    follower.style.width = '56px';
    follower.style.height = '56px';
    follower.style.borderColor = 'rgba(0,212,255,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    follower.style.width = '36px';
    follower.style.height = '36px';
    follower.style.borderColor = 'rgba(0,212,255,0.5)';
  });
});

// ── Navbar scroll ───────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Hamburger ───────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Background Canvas ───────────────────────
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.life = Math.random() * 200 + 100;
    this.age = 0;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.age++;
    if (this.age > this.life || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
      this.reset();
    }
  }
  draw() {
    const fade = this.age < 20 ? this.age / 20 : this.age > this.life - 20 ? (this.life - this.age) / 20 : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity * fade})`;
    ctx.fill();
  }
}

// Grid lines
function drawGrid() {
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.02)';
  ctx.lineWidth = 1;
  const spacing = 80;
  for (let x = 0; x < W; x += spacing) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

// Connection lines
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / 120) * 0.08})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function animateBg() {
  ctx.clearRect(0, 0, W, H);
  drawGrid();
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateBg);
}
animateBg();

// ── Code Typer ──────────────────────────────
const codeLines = [
  `<span class="cm">// Hola, soy un dev & designer</span>`,
  `<span class="kw">const</span> <span class="fn">developer</span> = {`,
  `  name: <span class="str">"Cristian Vargas García"</span>,`,
  `  stack: [<span class="str">"JS"</span>, <span class="str">"PHP"</span>, <span class="str">"Python"</span>],`,
  `  frontend: [<span class="str">"Angular"</span>, <span class="str">"HTML"</span>, <span class="str">"CSS"</span>],`,
  `  backend: [<span class="str">"Django"</span>, <span class="str">"MySQL"</span>],`,
  `  design: [<span class="str">"AI"</span>, <span class="str">"PS"</span>, <span class="str">"AE"</span>],`,
  `  marketing: [<span class="str">"Mailchimp"</span>, <span class="str">"SendPulse"</span>],`,
  `  available: <span class="num">true</span>`,
  `};`,
  ``,
  `<span class="fn">developer</span>.<span class="fn">build</span>(<span class="str">"amazing things"</span>);`,
];

const codeEl = document.getElementById('codeTyper');
let lineIndex = 0;

function typeLine() {
  if (lineIndex >= codeLines.length) return;
  const div = document.createElement('div');
  div.innerHTML = codeLines[lineIndex] + (lineIndex === codeLines.length - 1 ? '<span class="cursor-blink"></span>' : '');
  div.style.opacity = '0';
  div.style.transform = 'translateX(-8px)';
  div.style.transition = 'opacity 0.3s, transform 0.3s';
  codeEl.appendChild(div);
  setTimeout(() => { div.style.opacity = '1'; div.style.transform = 'translateX(0)'; }, 20);
  lineIndex++;
  if (lineIndex < codeLines.length) setTimeout(typeLine, 180);
}
setTimeout(typeLine, 1200);

// ── Intersection Observer ───────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Trigger skill bars
        const bars = entry.target.querySelectorAll('.skill-fill');
        bars.forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
      }, 120 * (Array.from(revealEls).indexOf(entry.target) % 3));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ── Counter Animation ───────────────────────
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 18);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

// ── Contact Form ────────────────────────────
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('.form-btn');
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  setTimeout(() => {
    form.reset();
    btn.innerHTML = 'Enviar mensaje <span class="arrow">→</span>';
    btn.disabled = false;
    successMsg.classList.add('show');
    setTimeout(() => successMsg.classList.remove('show'), 5000);
  }, 1500);
});

// ── Active nav link on scroll ───────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
});

// ── Smooth scroll offset ────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ── Parallax subtle on hero ─────────────────
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.transform = `translateY(${y * 0.08}px)`;
  }
});

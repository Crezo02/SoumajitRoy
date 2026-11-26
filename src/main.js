import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { site } from './data.js';
import { scene } from './scenes.js';
import { initCar3D } from './car3d.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const arrow =
  '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M5 3h8v8"/></svg>';

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */
function renderProjects() {
  $('#workList').innerHTML = site.projects
    .map(
      (p) => `
      <article class="work-card" data-reveal>
        <div class="work-card__inner">
          <div class="work-card__body">
            <div class="work-card__meta">
              <span>${p.n}</span><span>${p.year}</span><span>${p.role}</span>
            </div>
            <h3>${p.title}</h3>
            <p>${p.blurb}</p>
            <ul class="tags">${p.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
            <div class="work-card__foot">
              <span class="metric">${p.metric}</span>
              <a class="link-arrow" href="${p.href}" target="_blank" rel="noreferrer noopener" data-cursor="Open">
                ${p.repo ? 'View repo' : 'Visit site'} ${arrow}
              </a>
            </div>
          </div>
          <div class="work-card__art">
            <div class="art-scene" aria-hidden="true">${scene(p.scene)}</div>
            <video class="art-video" poster="${p.shot}" autoplay muted loop playsinline preload="none" aria-hidden="true" tabindex="-1">
              <source src="${p.clip}" type="video/mp4" />
            </video>
            <span class="art-shade" aria-hidden="true"></span>
            <span class="art-index" aria-hidden="true">${p.n}</span>
            <a class="art-still" href="${p.href}" target="_blank" rel="noreferrer noopener" data-cursor="Open">
              <img src="${p.shot}" alt="${p.shotAlt}" loading="lazy" width="1280" height="800" />
              <span class="art-still__tag">Still</span>
            </a>
          </div>
        </div>
      </article>`
    )
    .join('');
}

function renderScreens() {
  $('#screensTrack').innerHTML = site.projects
    .map(
      (p) => `
      <figure class="screen">
        <div class="screen__frame">
          <img src="${p.shot}" alt="${p.shotAlt}" loading="lazy" width="1280" height="800" />
        </div>
        <figcaption class="screen__meta">
          <span class="screen__name">${p.title}</span>
          <span class="screen__note">${p.year} · ${p.role}</span>
        </figcaption>
      </figure>`
    )
    .join('');
}

function renderCapabilities() {
  $('#capGrid').innerHTML = site.capabilities
    .map(
      (c, i) => `
      <article class="cap-card" data-num="0${i + 1}" data-reveal data-delay="${i * 60}">
        <span class="cap-num">0${i + 1}</span>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
      </article>`
    )
    .join('');
}

function renderJourney() {
  $('#journeyList').innerHTML =
    `<span class="journey-progress" id="journeyProgress"></span>` +
    site.journey
      .map(
        (j) => `
      <article class="journey-item" data-reveal>
        <span class="journey-period">${j.period}</span>
        <h3 class="journey-title">${j.title}</h3>
        <p class="journey-role">${j.role}</p>
        <p class="journey-blurb">${j.blurb}</p>
        <a class="journey-link" href="${j.href}" target="_blank" rel="noreferrer noopener" data-cursor="Open">
          Open ${arrow}
        </a>
      </article>`
      )
      .join('');
}

const socialIcons = {
  github:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.3 1.19-3.1-.12-.3-.52-1.48.11-3.08 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.6.23 2.79.11 3.08.74.8 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.26.07 1.64.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.22-1.66 4.77-4.92 4.92-1.26.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12c0-3.2.01-3.59.07-4.85.15-3.23 1.66-4.77 4.92-4.92C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"/></svg>',
};

function renderSocials() {
  $('#socials').innerHTML = site.socials
    .map(
      (s, i) => `
      <a class="social-card" href="${s.href}" target="_blank" rel="noreferrer noopener" data-cursor="Open" data-reveal data-delay="${i * 70}">
        <span class="social-card__icon">${
          s.mark
            ? `<img class="social-card__glyph" src="${s.mark}" alt="" width="18" height="18" />`
            : socialIcons[s.icon]
        }</span>
        <span class="social-card__text">
          <span class="social-card__label">${s.label}</span>
          <span class="social-card__handle">${s.handle}</span>
        </span>
        <span class="social-card__arrow" aria-hidden="true">
          <svg viewBox="0 0 16 16"><path d="M3 13 13 3M5 3h8v8" /></svg>
        </span>
      </a>`
    )
    .join('');
}

function renderTicker() {
  const items = site.stack.map((s) => `<span class="ticker__item">${s}</span>`).join('');
  const group = `<div class="ticker__group">${items}</div>`;
  $('#tickerTrack').innerHTML = group + group + group;
}

function renderFooterMarquee() {
  const words = ['Let’s build', 'something', 'that lasts'];
  const group = `<div class="footer-marquee__group">${words
    .map((w, i) => `<span>${i === 1 ? `<em>${w}</em>` : w}</span>`)
    .join('')}</div>`;
  $('#footerTrack').innerHTML = group + group;
}

function syncIdentity() {
  document.title = `${site.name} — Engineer, ${site.location.split(',')[0]}`;
  const mail = $('#mailText');
  if (mail) mail.textContent = site.email;
  const mailBtn = $('#mailBtn');
  if (mailBtn) mailBtn.setAttribute('href', `mailto:${site.email}`);
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
}

/* ------------------------------------------------------------------ */
/* Text splitting                                                      */
/* ------------------------------------------------------------------ */
function splitWords(root) {
  let index = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        if (!child.textContent.trim()) {
          child.textContent = ' ';
          return;
        }
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((seg) => {
          if (!seg) return;
          if (/^\s+$/.test(seg)) {
            frag.appendChild(document.createTextNode(' '));
            return;
          }
          const outer = document.createElement('span');
          outer.className = 'word';
          const inner = document.createElement('span');
          inner.className = 'word-in';
          inner.textContent = seg;
          inner.style.setProperty('--i', String(index++));
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(root);
}

/* ------------------------------------------------------------------ */
/* Preloader                                                           */
/* ------------------------------------------------------------------ */
function runPreloader() {
  const pre = $('#preloader');
  const bar = $('#preloaderBar');
  const num = $('#preloaderNum');
  if (!pre) return Promise.resolve();

  return new Promise((resolve) => {
    const counter = { v: 0 };
    gsap.to(counter, {
      v: 100,
      duration: reduce ? 0.2 : 1.25,
      ease: 'power2.inOut',
      onUpdate() {
        const v = Math.round(counter.v);
        if (num) num.textContent = `${String(v * 90).padStart(4, '0')} RPM`;
        if (bar) bar.style.transform = `scaleX(${v / 100})`;
      },
      onComplete() {
        gsap.to(pre, {
          yPercent: -100,
          duration: reduce ? 0.2 : 0.85,
          ease: 'power4.inOut',
          onComplete() {
            pre.remove();
            document.body.classList.remove('is-locked');
            resolve();
          },
        });
      },
    });
  });
}

/* ------------------------------------------------------------------ */
/* Smooth scroll + scroll engine                                       */
/* ------------------------------------------------------------------ */
let lenis = null;

function initScrollEngine() {
  if (reduce) return;

  lenis = new Lenis({
    duration: 1.15,
    lerp: 0.09,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Velocity-reactive ticker + footer marquee
  const drive = (el, groups, dir) => {
    if (!el) return;
    const width = el.scrollWidth / groups || 1;
    const tween = gsap.to(el, {
      x: -width,
      duration: 26,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: (x) => `${parseFloat(x) % width}px`,
      },
    });
    tween.progress(dir > 0 ? 0.5 : 0);
    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 900, 2.6);
        gsap.to(tween, { timeScale: boost, duration: 0.4, overwrite: true });
      },
    });
  };

  drive($('#tickerTrack'), 3, 1);
  drive($('#footerTrack'), 2, -1);
}

/* ------------------------------------------------------------------ */
/* Cursor                                                              */
/* ------------------------------------------------------------------ */
function initCursor() {
  if (!finePointer || reduce) return;
  const dot = $('.cursor__dot');
  const ring = $('.cursor__ring');
  const label = $('#cursorLabel');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  dot.style.left = `${mx}px`;
  dot.style.top = `${my}px`;
  ring.style.left = `${mx}px`;
  ring.style.top = `${my}px`;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (!document.body.classList.contains('has-cursor')) {
        document.body.classList.add('has-cursor');
        mx = e.clientX;
        my = e.clientY;
        rx = mx;
        ry = my;
        ring.style.left = `${mx}px`;
        ring.style.top = `${my}px`;
      }
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    },
    { passive: true }
  );

  const loop = () => {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const hoverables = 'a, button, .cap-card, .work-card, .repo-row, [data-magnetic]';
  document.addEventListener('pointerover', (e) => {
    const hit = e.target.closest(hoverables);
    if (!hit) return;
    document.body.classList.add('cursor-hover');
    if (label) label.textContent = hit.dataset.cursor || '';
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest(hoverables)) {
      document.body.classList.remove('cursor-hover');
      if (label) label.textContent = '';
    }
  });
}

/* ------------------------------------------------------------------ */
/* Magnetic buttons + tilt                                             */
/* ------------------------------------------------------------------ */
function initMagnetic() {
  if (!finePointer || reduce) return;
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
      el.style.setProperty('--rx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--ry', `${e.clientY - rect.top}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

function initTilt() {
  if (!finePointer || reduce) return;
  $$('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1000px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });

  const spot = (sel) =>
    $$(sel).forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });
  spot('.cap-card');
  spot('.work-card__inner');

  $$('.art-video').forEach((art) => {
    const card = art.closest('.work-card__inner');
    if (!card) return;
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      art.style.transform = `translate(${px * 10}px, ${py * 7}px) scale(1.03)`;
    });
    card.addEventListener('pointerleave', () => {
      art.style.transform = '';
    });
  });
}

function initScramble() {
  const el = $('#mailText');
  const btn = $('#mailBtn');
  if (!el || !btn || reduce) return;

  const original = el.textContent;
  const glyphs = '!<>-_\\/[]{}=+*^?#';
  let raf = 0;
  let frame = 0;

  const tick = () => {
    frame++;
    el.textContent = [...original]
      .map((ch, i) => (frame / 2 > i ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]))
      .join('');
    if (frame < 18) raf = requestAnimationFrame(tick);
    else el.textContent = original;
  };

  btn.addEventListener('pointerenter', () => {
    cancelAnimationFrame(raf);
    frame = 0;
    raf = requestAnimationFrame(tick);
  });
  btn.addEventListener('pointerleave', () => {
    cancelAnimationFrame(raf);
    el.textContent = original;
  });
}

/* ------------------------------------------------------------------ */
/* Reveals, counters, stacking                                         */
/* ------------------------------------------------------------------ */
function initReveals() {
  const targets = $$('[data-reveal], [data-split]');
  targets.forEach((el) => {
    const d = el.dataset.delay;
    if (d) el.style.setProperty('--rd', `${d}ms`);
  });

  if (reduce) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  ScrollTrigger.batch(targets, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      batch.forEach((el) => {
        el.classList.add('is-in');
      }),
  });
}

function initCounters() {
  const nodes = $$('[data-count]');
  if (!nodes.length) return;

  const run = (el) => {
    const target = Number(el.dataset.count);
    const counter = { v: 0 };
    gsap.to(counter, {
      v: target,
      duration: reduce ? 0 : 1.5,
      ease: 'power3.out',
      onUpdate() {
        el.textContent = String(Math.round(counter.v));
      },
    });
  };

  ScrollTrigger.batch(nodes, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => batch.forEach(run),
  });
}

function initStackedCards() {
  const cards = $$('.work-card');
  if (!cards.length || reduce) return;

  cards.forEach((card, i) => {
    const inner = card.querySelector('.work-card__inner');
    const next = cards[i + 1];
    if (!inner || !next) return;

    ScrollTrigger.create({
      trigger: card,
      start: 'top top+=120',
      end: () => `bottom top+=${window.innerHeight * 0.18}`,
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        inner.style.transform = `scale(${(1 - p * 0.07).toFixed(4)}) translateY(${(-p * 16).toFixed(1)}px)`;
        inner.style.opacity = (1 - p * 0.55).toFixed(3);
      },
    });
  });
}

function initHeroParallax() {
  if (reduce) return;
  const aurora = $('.hero-aurora');
  const grid = $('.hero-grid');
  const copy = $('.hero-copy');
  if (!aurora && !grid && !copy) return;

  gsap.to(aurora, {
    yPercent: 26,
    xPercent: -8,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  });
  gsap.to(grid, {
    yPercent: 16,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  });
  gsap.to(copy, {
    yPercent: 12,
    opacity: 0.25,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  });
}

function initJourneyProgress() {
  const fill = $('#journeyProgress');
  const list = $('#journeyList');
  if (!fill || !list) return;

  gsap.to(fill, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: list,
      start: 'top 72%',
      end: 'bottom 82%',
      scrub: 0.4,
    },
  });

  $$('.journey-item').forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 80%',
      once: true,
      onEnter: () => item.classList.add('is-in'),
    });
  });
}

/* ------------------------------------------------------------------ */
/* Navigation state                                                    */
/* ------------------------------------------------------------------ */
function initNav() {
  const nav = $('#nav');
  const links = $$('.nav-link');
  const indicator = $('#navIndicator');
  const map = new Map();

  links.forEach((link) => {
    const id = link.getAttribute('href')?.slice(1);
    const section = id ? document.getElementById(id) : null;
    if (section) map.set(section, link);
  });

  const moveIndicator = (link) => {
    if (!indicator || !link) return;
    const parent = link.parentElement.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    gsap.to(indicator, {
      x: rect.left - parent.left,
      width: rect.width,
      opacity: 1,
      duration: 0.45,
      ease: 'power3.out',
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.remove('is-active'));
        const link = map.get(entry.target);
        if (link) {
          link.classList.add('is-active');
          moveIndicator(link);
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  map.forEach((_, section) => io.observe(section));

  links.forEach((link) => {
    link.addEventListener('pointerenter', () => moveIndicator(link));
  });

  const burger = $('#burger');
  const navLinks = $('#navLinks');
  burger?.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    navLinks?.classList.toggle('is-open', !open);
    document.body.classList.toggle('is-locked', !open);
  });
  links.forEach((link) =>
    link.addEventListener('click', () => {
      burger?.setAttribute('aria-expanded', 'false');
      navLinks?.classList.remove('is-open');
      document.body.classList.remove('is-locked');
    })
  );

  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initProgressBars() {
  const bar = $('#progressBar');
  const rail = $('#railFill');
  if (!bar && !rail) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    if (bar) bar.style.transform = `scaleX(${p})`;
    if (rail) rail.style.transform = `scaleY(${p})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ------------------------------------------------------------------ */
/* Terminal typewriter + role rotator                                   */
/* ------------------------------------------------------------------ */
function initTerminal() {
  const host = $('#terminal');
  if (!host) return;

  const write = () => {
    const el = document.createElement('span');
    el.className = 't-line';
    host.appendChild(el);
    return el;
  };

  const typeInto = (el, text, speed, done) => {
    if (reduce) {
      el.textContent = text;
      done?.();
      return;
    }
    let i = 0;
    const caret = document.createElement('span');
    caret.className = 't-caret';
    const tick = () => {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, speed);
      } else {
        caret.remove();
        done?.();
      }
    };
    el.appendChild(caret);
    tick();
  };

  const lines = site.terminal;
  let idx = 0;

  const next = () => {
    if (idx >= lines.length) {
      const tail = write();
      tail.classList.add('t-accent');
      typeInto(tail, 'ready.', 90);
      return;
    }
    const line = lines[idx++];
    const el = write();
    if (line.startsWith('$')) el.classList.add('t-cmd');
    else if (line.includes('—')) el.classList.add('t-accent');
    else el.classList.add('t-ok');
    typeInto(el, line, 20, () => {
      setTimeout(next, 220);
    });
  };

  next();
}

function initRotator() {
  const host = $('#rotator');
  if (!host) return;
  const roles = site.roles;
  let i = 0;
  let timer = 0;

  const cycle = () => {
    gsap.to(host, {
      yPercent: -100,
      opacity: 0,
      duration: 0.32,
      ease: 'power2.in',
      onComplete() {
        i = (i + 1) % roles.length;
        host.textContent = roles[i];
        gsap.fromTo(
          host,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.42, ease: 'power3.out' }
        );
      },
    });
  };

  timer = window.setInterval(cycle, 2800);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearInterval(timer);
    else timer = window.setInterval(cycle, 2800);
  });
}

/* ------------------------------------------------------------------ */
/* Clock                                                               */
/* ------------------------------------------------------------------ */
function initClock() {
  const navClock = $('#clock');
  const footClock = $('#footerClock');
  if (!navClock && !footClock) return;

  const tick = () => {
    const time = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: site.timezone,
    }).format(new Date());
    if (navClock) navClock.textContent = `${time} IST`;
    if (footClock) footClock.textContent = `Bengaluru — ${time}`;
  };
  tick();
  window.setInterval(tick, 1000);
}

/* ------------------------------------------------------------------ */
/* GitHub live data                                                    */
/* ------------------------------------------------------------------ */
function relativeDate(iso) {
  const then = new Date(iso).getTime();
  const days = Math.max(0, Math.round((Date.now() - then) / 86400000));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

function renderRepos(repos, languageMap) {
  const list = $('#repoList');
  list.innerHTML = repos
    .map((r) => {
      const langs = languageMap[r.name] || [];
      const total = langs.reduce((a, l) => a + l.bytes, 0);
      const primary = langs.length
        ? langs.slice().sort((a, b) => b.bytes - a.bytes)[0]
        : { name: r.language || 'Other', bytes: 1 };
      const color = site.langColors[primary.name] || '#d92626';
      const bars = langs.length
        ? langs
            .map(
              (l) =>
                `<i style="background:${
                  site.langColors[l.name] || '#d92626'
                };width:${((l.bytes / total) * 100).toFixed(1)}%"></i>`
            )
            .join('')
        : `<i style="background:${color};width:100%"></i>`;

      const breakdown = langs.length
        ? langs.map((l) => `${l.name} ${Math.round((l.bytes / total) * 100)}%`).join(' · ')
        : primary.name;

      return `
      <li class="repo-row">
        <a class="repo-name" href="${r.html_url}" target="_blank" rel="noreferrer noopener" data-cursor="Open">
          <b>${r.name}</b>
        </a>
        <span class="repo-lang"><i style="background:${color}"></i>${primary.name}</span>
        <span class="repo-bar" title="${breakdown}">${bars}</span>
        <span class="repo-date">${relativeDate(r.pushed_at)}</span>
      </li>`;
    })
    .join('');

  requestAnimationFrame(() => {
    $$('.repo-bar i').forEach((bar) => {
      const w = bar.style.width;
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        bar.style.width = w;
      });
    });
  });
}

function renderStaticRepos() {
  const repos = site.githubRepos.map((r) => ({
    name: r.name,
    html_url: `https://github.com/Crezo02/${r.name}`,
    pushed_at: r.pushed,
    language: r.langs[0][0],
  }));
  const languageMap = Object.fromEntries(
    site.githubRepos.map((r) => [
      r.name,
      r.langs.map(([name, bytes]) => ({ name, bytes })),
    ])
  );
  renderRepos(repos, languageMap);
  const status = $('#ghStatus');
  if (status) status.textContent = 'GitHub API unreachable — showing the last snapshot';
}

const CACHE_KEY = 'sr:github-cache';
const CACHE_TTL = 10 * 60 * 1000;

async function initGitHub() {
  const status = $('#ghStatus');
  const setCounts = (repos, followers) => {
    const ghRepos = $('#ghRepos');
    const ghFollowers = $('#ghFollowers');
    if (ghRepos) ghRepos.textContent = String(repos);
    if (ghFollowers) ghFollowers.textContent = String(followers);
  };

  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.at < CACHE_TTL) {
      setCounts(cached.counts, cached.followers);
      renderRepos(cached.repos, cached.languages);
      if (status) status.textContent = `Live from the GitHub API — ${cached.counts} public repos`;
      return;
    }
  } catch {
    /* corrupted cache — fall through to a fresh fetch */
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/Crezo02'),
      fetch('https://api.github.com/users/Crezo02/repos?per_page=100&sort=pushed'),
    ]);
    if (!userRes.ok || !reposRes.ok) throw new Error('bad status');

    const user = await userRes.json();
    const repos = (await reposRes.json())
      .filter((r) => !r.fork)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    const top = repos.slice(0, 9);
    const languageMap = {};
    await Promise.all(
      top.map(async (r) => {
        try {
          const res = await fetch(r.languages_url);
          if (res.ok) {
            languageMap[r.name] = Object.entries(await res.json()).map(
              ([name, bytes]) => ({ name, bytes })
            );
          }
        } catch {
          /* fall back to the primary language badge */
        }
      })
    );

    setCounts(user.public_repos ?? repos.length, user.followers ?? 0);
    if (status) status.textContent = `Live from the GitHub API — ${repos.length} public repos`;
    renderRepos(top, languageMap);

    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          at: Date.now(),
          counts: user.public_repos ?? repos.length,
          followers: user.followers ?? 0,
          repos: top.map((r) => ({
            name: r.name,
            html_url: r.html_url,
            pushed_at: r.pushed_at,
            language: r.language,
          })),
          languages: languageMap,
        })
      );
    } catch {
      /* private mode — skip the cache */
    }
  } catch {
    renderStaticRepos();
    setCounts(site.githubRepos.length, '—');
  }
}

/* ------------------------------------------------------------------ */
/* Copy email                                                          */
/* ------------------------------------------------------------------ */
function initCopy() {
  const button = $('#copyBtn');
  if (!button) return;
  const label = $('.copy-label', button);
  let timer = 0;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      if (label) label.textContent = 'Copied ✓';
    } catch {
      window.location.href = `mailto:${site.email}`;
      return;
    }
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (label) label.textContent = 'Copy address';
    }, 1800);
  });
}

/* ------------------------------------------------------------------ */
/* Video playback + gallery motion                                     */
/* ------------------------------------------------------------------ */
function initVideoPlayback() {
  const videos = $$('.art-video');
  if (!videos.length) return;

  if (reduce) {
    videos.forEach((v) => {
      v.removeAttribute('autoplay');
      v.pause();
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const v = entry.target;
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      });
    },
    { threshold: 0.2 }
  );
  videos.forEach((v) => io.observe(v));
}

function initScreens() {
  const track = $('#screensTrack');
  if (!track || reduce) return;

  $$('.screen__frame').forEach((frame, i) => {
    gsap.fromTo(
      frame,
      { x: i % 2 ? 26 : -26 },
      {
        x: i % 2 ? -26 : 26,
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.9,
        },
      }
    );
  });
}

/* ------------------------------------------------------------------ */
/* Automotive Telemetry HUD + Drive Mode Switcher                      */
/* ------------------------------------------------------------------ */
function initTelemetryHUD(carController) {
  const hud = $('#telemetryHud');
  const toggleBtn = $('#hudToggle');
  const closeBtn = $('#hudClose');
  const speedEl = $('#hudSpeed');
  const gearEl = $('#hudGear');
  const aeroEl = $('#hudAero');
  const leds = $$('#hudLeds i');
  if (!speedEl || !gearEl || !leds.length) return;

  const setOpen = (open) => {
    if (!hud || !toggleBtn) return;
    hud.hidden = !open;
    toggleBtn.classList.toggle('is-hidden', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
  };

  toggleBtn?.addEventListener('click', () => setOpen(true));
  closeBtn?.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hud && !hud.hidden) setOpen(false);
  });

  let currentSpeed = 0;
  let targetSpeed = 0;
  let lastY = window.scrollY;

  window.addEventListener(
    'scroll',
    () => {
      const delta = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      targetSpeed = Math.min(340, Math.max(targetSpeed, delta * 4.2));
    },
    { passive: true }
  );

  const tick = () => {
    currentSpeed += (targetSpeed - currentSpeed) * 0.14;
    targetSpeed *= 0.9;
    const kmh = Math.round(currentSpeed);
    speedEl.textContent = String(kmh).padStart(3, '0');

    const gear = kmh < 5 ? 'N' : kmh < 55 ? '1' : kmh < 105 ? '2' : kmh < 160 ? '3' : kmh < 220 ? '4' : kmh < 280 ? '5' : '6';
    gearEl.textContent = gear;

    if (aeroEl) aeroEl.classList.toggle('is-active', kmh > 110);

    const lit = Math.round((kmh / 340) * leds.length);
    leds.forEach((led, idx) => {
      led.classList.toggle('is-on', idx < lit && idx < 4);
      led.classList.toggle('is-red', idx < lit && idx >= 4);
    });

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  if (carController) {
    const swatches = $$('.hud-swatch');
    swatches.forEach((btn) => {
      btn.addEventListener('click', () => {
        swatches.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        carController.setPaint(btn.dataset.paint);
      });
    });

    const lightsBtn = $('#hudLights');
    lightsBtn?.addEventListener('click', () => {
      const on = carController.toggleLights();
      lightsBtn.classList.toggle('is-on', on);
    });
  }
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */
async function boot() {
  document.body.classList.add('is-locked');

  renderProjects();
  renderScreens();
  renderCapabilities();
  renderJourney();
  renderSocials();
  renderTicker();
  renderFooterMarquee();
  syncIdentity();

  $$('[data-split]').forEach(splitWords);

  initScrollEngine();
  initCursor();
  initMagnetic();
  initTilt();
  initNav();
  initProgressBars();
  initCounters();
  initStackedCards();
  initJourneyProgress();
  initHeroParallax();
  initVideoPlayback();
  const carController = initCar3D(reduce);
  initTelemetryHUD(carController);
  initScreens();
  initRotator();
  initClock();
  initCopy();
  initReveals();
  initScramble();

  await runPreloader();

  const heroTitle = $('.hero-title');
  if (heroTitle) heroTitle.classList.add('is-in');

  if (!reduce) {
    gsap.from('.hero-copy > *', {
      y: 26,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.1,
    });
    gsap.from('.nav', {
      y: -24,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }

  initTerminal();
  initGitHub();

  ScrollTrigger.refresh();
  if (lenis) lenis.scrollTo(0, { immediate: true });
}

boot();

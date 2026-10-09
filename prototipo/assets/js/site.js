/* =========================================================
   Comportamiento del sitio público (portal y guía).
   Cada módulo verifica que sus elementos existan, así un
   mismo archivo sirve para todas las páginas.
   Sin dependencias externas ni HTML inyectado desde datos
   sin escapar (ver esc()).
   ========================================================= */
(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Curvas de nivel (relieve de Los Altos) ---------- */
  function topo(svg) {
    const [cx, cy, rings, seed] = svg.dataset.topo.split(',').map(Number);
    let d = '';
    for (let k = 0; k < rings; k++) {
      const r = 30 + k * 26, pts = [];
      for (let i = 0; i <= 96; i++) {
        const a = i / 96 * Math.PI * 2;
        const w = 1 + .16 * Math.sin(3 * a + k * .35 + seed) + .09 * Math.sin(5 * a - k * .22) + .05 * Math.sin(9 * a + seed * 2);
        pts.push((cx + Math.cos(a) * r * w * 1.25).toFixed(1) + ' ' + (cy + Math.sin(a) * r * w).toFixed(1));
      }
      d += 'M' + pts.join('L') + 'Z';
    }
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d); svg.appendChild(p);
  }
  $$('svg[data-topo]').forEach(topo);

  /* ---------- Navegación ---------- */
  const nav = $('#nav'), menu = $('#menu'), burger = $('#burger');
  if (burger) {
    burger.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
    $$('a', menu).forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  /* ---------- Brillo que sigue al cursor ---------- */
  const glow = $('[data-glow]');
  if (glow && fine && !reduce) glow.addEventListener('pointermove', e => {
    const r = glow.getBoundingClientRect();
    glow.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    glow.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  /* ---------- Sendero del portal ---------- */
  const hp = $('#heroPath');
  if (hp) {
    const len = hp.getTotalLength(), dots = $$('.hero-trail circle');
    dots.forEach(c => { const p = hp.getPointAtLength(+c.dataset.t * len); c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); });
    hp.style.strokeDasharray = len; hp.style.strokeDashoffset = len;
    const t0 = performance.now();
    (function draw(now) {
      const k = reduce ? 1 : Math.min(1, Math.max(0, (now - t0 - 600) / 2600)), e = 1 - Math.pow(1 - k, 3);
      hp.style.strokeDashoffset = len * (1 - e);
      dots.forEach(c => c.classList.toggle('on', e >= +c.dataset.t));
      if (k < 1) requestAnimationFrame(draw);
    })(t0);
  }

  /* ---------- Datos del portal ---------- */
  const D = window.PORTAL_DATA;
  if (D) {
    $$('[data-periodo]').forEach(el => el.textContent = D.periodo.nombre);
    $$('[data-status]').forEach(el => el.textContent = D.periodo.estadoServicio);
    $$('[data-version]').forEach(el => el.textContent = D.periodo.version);
    const cal = $('#calendario');
    if (cal) cal.innerHTML = D.calendario.map(c => `
      <li class="${esc(c.estado)}">
        <div class="d"><b>${esc(c.dia)}</b><small>${esc(c.mes)}</small></div>
        <span class="pt" aria-hidden="true"></span>
        <div><h4>${esc(c.titulo)}${c.estado === 'now' ? '<span class="tag now">En curso</span>' : c.estado === 'done' ? '<span class="tag done">Concluido</span>' : ''}</h4><p>${esc(c.detalle)}</p></div>
      </li>`).join('');
    const prox = $('#proxima'), next = D.calendario.find(c => c.estado !== 'done');
    if (prox && next) prox.textContent = `${next.titulo} · ${next.dia} ${next.mes}`;
    const av = $('#avisos');
    if (av) av.innerHTML = D.avisos.map(a => `
      <li><div class="k"><span>${esc(a.tipo)}</span><time>${esc(a.fecha)}</time></div>
      <h4>${esc(a.titulo)}</h4><p>${esc(a.texto)}</p></li>`).join('');
  }

  /* ---------- Texto que se enciende palabra por palabra ---------- */
  const words = $('#words'), ws = [];
  if (words) {
    const gold = (words.dataset.gold || '').split('|');
    words.innerHTML = words.textContent.trim().split(/\s+/).map(w => `<span class="w${gold.includes(w) ? ' gold' : ''}">${esc(w)}</span>`).join(' ');
    ws.push(...words.children);
  }

  /* ---------- Scroll ---------- */
  const steps = $('#steps'), mBar = $('#mBar'), mCount = $('#mCount');
  const blocks = $$('.cblock');
  const sig = $('#sig'); let sigLen = 0;
  if (sig) { sigLen = sig.getTotalLength(); sig.style.strokeDasharray = sigLen; sig.style.strokeDashoffset = sigLen; }
  let lastY = 0, ticking = false;

  function onScroll() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    if (nav) {
      nav.classList.toggle('scrolled', y > 40);
      nav.classList.toggle('hide', y > lastY && y > 600 && !(menu && menu.classList.contains('open')));
    }
    lastY = y;

    if (ws.length) {
      const r = words.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
      const lit = reduce ? ws.length : Math.round(p * ws.length);
      ws.forEach((w, i) => w.classList.toggle('lit', i < lit));
    }
    if (steps && mBar) {
      const r = steps.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * .5 - r.top) / r.height));
      mBar.style.height = (p * 100) + '%';
      mCount.textContent = '0' + Math.min(6, Math.max(1, Math.ceil(p * 6)));
    }
    if (!reduce) blocks.forEach((b, i) => {
      const next = blocks[i + 1]; if (!next) return;
      const nr = next.getBoundingClientRect(), br = b.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, 1 - (nr.top - br.top) / br.height));
      b.style.transform = `scale(${1 - k * .05})`; b.style.filter = `brightness(${1 - k * .3})`;
    });
    if (sig && sig.getBoundingClientRect().top < vh * .85) {
      sig.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(.2,.7,.1,1)'; sig.style.strokeDashoffset = 0;
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Revelado al entrar en pantalla ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .15 });
    $$('.rv, .steps li').forEach(el => io.observe(el));
  } else $$('.rv').forEach(el => el.classList.add('in'));

  /* ---------- Inclinación del mockup ---------- */
  const mock = $('#mock');
  if (mock && fine && !reduce) {
    mock.parentElement.addEventListener('pointermove', e => {
      const r = mock.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      mock.style.transform = `rotateY(${x * 10 - 4}deg) rotateX(${-y * 8 + 2}deg)`;
    });
    mock.parentElement.addEventListener('pointerleave', () => { mock.style.transform = ''; });
  }
})();

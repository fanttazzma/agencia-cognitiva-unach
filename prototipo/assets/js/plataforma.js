/* =========================================================
   Plataforma · Agencia Cognitiva UNACH (prototipo)
   - Sin manejadores en línea: un solo listener delegado
     (data-go = navegar, data-act = acción).
   - Todo texto variable pasa por esc() antes de insertarse.
   ========================================================= */
(() => {
  'use strict';
  const D = window.AC;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Íconos de línea ---------- */
  const P = {
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>',
    board: '<rect x="3.5" y="4.5" width="17" height="11" rx="1.5"/><path d="M8 20h8M12 15.5V20"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2-2.4 3.6M12 17h.01"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.3-4.3"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h6"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    file: '<path d="M7 3h7l4 4v14H7Z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
    upload: '<path d="M12 16V5M7.5 9.5 12 5l4.5 4.5M5 19h14"/>',
    download: '<path d="M12 5v11M7.5 11.5 12 16l4.5-4.5M5 19h14"/>',
    msg: '<path d="M5 5h14v10H10l-5 4Z"/>',
    award: '<circle cx="12" cy="9" r="5"/><path d="M8.5 13 7 21l5-2.5L17 21l-1.5-8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    alert: '<path d="M12 4 2.8 19.5h18.4Z"/><path d="M12 10v4M12 17h.01"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    layers: '<path d="M12 3 3 8l9 5 9-5Z"/><path d="M3 13l9 5 9-5"/>',
  };
  const ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
  const hydrateIcons = (root = document) => $$('[data-icon]', root).forEach(el => { el.innerHTML = ic(el.dataset.icon); el.removeAttribute('data-icon'); });

  /* ---------- Fechas ---------- */
  const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const dt = s => new Date(s + 'T12:00:00');
  const fmt = s => { const d = dt(s); return `${d.getDate()} ${MES[d.getMonth()]}`; };
  const fmtL = s => { const d = dt(s); return `${DIA[d.getDay()]} ${d.getDate()} de ${MES[d.getMonth()]}`; };
  const days = s => Math.round((dt(s) - dt(D.hoy)) / 864e5);
  const addDays = (s, n) => { const d = dt(s); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const dueChip = s => { const k = days(s); return k < 0 ? `<span class="chip bad">${ic('alert', 'sm')}Vencida hace ${-k} d</span>` : k <= 3 ? `<span class="chip warn">${ic('clock', 'sm')}Vence en ${k} d</span>` : `<span class="chip">${ic('clock', 'sm')}Vence ${fmt(s)}</span>`; };

  /* ---------- Estado ---------- */
  const etapaN = (nombre, fecha, first) => ({ nombre, fecha, entregable: '', instrucciones: '', preguntas: first ? ['¿Qué entendiste del reto con tus propias palabras?', '¿Qué necesitas investigar para resolverlo?', '¿Qué harás en esta etapa?'] : ['¿Qué cambiaste a partir de la retroalimentación?'] });
  const itemN = f => ({ titulo: '', tipoReto: 'Situado', desc: '', proposito: '', producto: '', organizacion: 'Individual', integrantes: '3', criterios: '', recursos: '', ia: '', ejemplo: '', open: new Set([0]),
    etapas: [etapaN('Comprender y explorar', f, true), etapaN('Mejora y adapta', addDays(f, 14))] });
  const S = { role: 'est', view: 'trayecto', arg: null, stage: 1, open: new Set([5]), sent2: false, reviewing: null, revMat: 'todas',
    nuevo: { materia: '5.2', modo: 'integrador', act: 0, invitar: '',
      integr: [itemN('2026-11-03')], acts: [itemN('2026-08-25'), itemN('2026-09-22'), itemN('2026-10-20')],
      compartido: [{ m: '5.3 Calidad de los Procesos', d: 'Mtra. Laura Gómez Ruiz', e: 'Aceptada' }, { m: '5.6 Taller de Desarrollo', d: 'Ing. Pablo Torres Díaz', e: 'Pendiente' }] } };

  /* ---------- Utilidades de interfaz ---------- */
  function toast(m) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); }
  function modal(html) { $('#modalRoot').innerHTML = `<div class="ov" data-act="closeOv"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`; }
  const closeModal = () => { $('#modalRoot').innerHTML = ''; };

  let saveT;
  function saving() {
    $$('.saved').forEach(s => { s.classList.add('ing'); s.textContent = 'Guardando'; });
    clearTimeout(saveT);
    saveT = setTimeout(() => $$('.saved').forEach(s => { s.classList.remove('ing'); s.textContent = 'Guardado automáticamente'; }), 800);
  }

  function field(label, path, o = {}) {
    const v = path.split('.').reduce((a, k) => a?.[k], D.cedula);
    const ro = o.ro ? 'readonly' : '';
    const el = o.input
      ? `<input class="in" data-bind="${path}" value="${esc(v)}" ${ro}>`
      : `<textarea class="in" data-bind="${path}" ${ro} rows="${o.rows || 3}">${esc(v)}</textarea>`;
    return `<label class="f"><span class="${o.req === false ? '' : 'req'}">${label}${o.hint ? ` <em>· ${o.hint}</em>` : ''}</span>${el}</label>`;
  }

  /* =========================================================
     BARRA LATERAL
     ========================================================= */
  function semStats(s) {
    let d = 0, t = 0; s.materias.forEach(m => { d += m[2][0]; t += m[2][1]; }); return [d, t];
  }
  function sideEst() {
    const tab = S.sideTab || 'tray';
    const semDone = D.semestres.filter(s => s.estado === 'done').length;
    const cur = D.semestres.find(s => s.estado === 'now'); const [cd, ct] = semStats(cur);
    const pct = Math.round(((semDone + cd / ct) / 8) * 100);
    const outline = D.semestres.map(s => {
      const [d, t] = semStats(s), open = S.open.has(s.n), lock = s.estado === 'lock';
      const items = s.materias.map(([c, n, [a, b]]) => {
        const st = a >= b ? 'done' : a > 0 || s.estado === 'now' ? 'prog' : '';
        const p = Math.round(a / b * 100);
        const cur = S.view === 'materia' && S.arg === c;
        return `<li><button class="item" data-go="materia" data-arg="${c}" ${cur ? 'aria-current="true"' : ''}>
          <span class="st ${st}" style="--p:${p}%">${st === 'done' ? ic('check') : ''}</span>
          <span class="code">${c}</span><span>${esc(n)}</span><span class="cnt">${a}/${b}</span></button></li>`;
      }).join('');
      return `<div class="mod ${open ? 'open' : ''} ${lock ? 'locked' : ''}">
        <button class="mod-h" data-act="toggleMod" data-arg="${s.n}" aria-expanded="${open}">
          <span><b>Semestre ${s.n}</b><small>${lock ? 'Se habilita al concluir el semestre anterior' : s.estado === 'done' ? 'Completado' : 'En curso · ' + D.periodo}</small></span>
          <span class="cnt">${lock ? ic('lock', 'sm') : `${d}/${t}`}</span><span class="chev">${ic('chev', 'sm')}</span></button>
        ${lock ? '' : `<div class="mod-bar"><i style="width:${t ? d / t * 100 : 0}%"></i></div><ul class="items">${items}</ul>`}
      </div>`;
    }).join('');
    const cal = D.etapas.map(e => `<div class="due"><div class="d"><b>${dt(e.entrega).getDate()}</b><span>${MES[dt(e.entrega).getMonth()]}</span></div>
      <div><h4>Etapa ${e.n} · ${esc(e.nombre)}</h4><p>5.2 · Sistema de control de acceso</p></div>${e.estado === 'done' ? '<span class="chip ok">Cumplida</span>' : dueChip(e.entrega)}</div>`).join('');
    return `<div class="tabs" role="tablist">
        <button class="tab" role="tab" data-act="sideTab" data-arg="tray" aria-selected="${tab === 'tray'}">${ic('route', 'sm')}Mi trayecto</button>
        <button class="tab" role="tab" data-act="sideTab" data-arg="cal" aria-selected="${tab === 'cal'}">${ic('cal', 'sm')}Calendario</button></div>
      ${tab === 'tray' ? `<label class="search">${ic('search', 'sm')}<input placeholder="Buscar materia" data-act-input="filter" aria-label="Buscar materia"></label>
        <div class="outline" id="outline">${outline}</div>
        <button class="cert" data-go="constancia" style="text-align:left;border:0">
          <span class="lk">${ic('lock')}</span><span class="caps">Constancia de Agencia Cognitiva</span>
          <b>Se desbloquea al completar los 8 semestres</b>
          <span class="bar" style="display:block"><i style="width:${pct}%"></i></span>
          <small><span>${semDone} de 8 semestres</span><span>${pct}%</span></small></button>`
      : `<div class="outline" style="padding:8px 16px">${cal}</div>`}`;
  }
  function sideDoc() {
    const c = D.cumplimientoDocente, p = Math.round(c.aTiempo / c.total * 100);
    const nav = [['doc-home', 'board', 'Panel', ''], ['doc-reto', 'plus', 'Nuevo reto', ''], ['doc-rev', 'msg', 'Revisiones pendientes', D.pendientes.length]];
    return `<div class="outline" style="padding-top:10px">
      <div class="mod open"><div class="mod-h" style="cursor:default"><span><b>Docencia</b><small>Periodo ${D.periodo}</small></span><span></span><span></span></div>
      <ul class="items">${nav.map(([v, i, t, n]) => `<li><button class="item" data-go="${v}" ${S.view === v ? 'aria-current="true"' : ''} style="grid-template-columns:24px 1fr auto"><span>${ic(i, 'sm')}</span><span>${t}</span><span class="cnt">${n}</span></button></li>`).join('')}</ul></div>
      <div class="mod open"><div class="mod-h" style="cursor:default"><span><b>Mis materias</b><small>Máximo ${D.maxCedulasPorMateria} cédulas por materia</small></span><span></span><span></span></div>
      <ul class="items">${D.docente.materias.map(m => `<li><button class="item" data-act="revFilter" data-arg="${m.c}" style="grid-template-columns:24px 34px 1fr auto"><span class="st ${m.usadas ? 'prog' : ''}" style="--p:${m.usadas / D.maxCedulasPorMateria * 100}%"></span><span class="code">${m.c}</span><span>${esc(m.n)}<br><span class="small muted">Grupos ${m.grupos.join(', ')}</span></span><span class="cnt">${m.usadas}/${D.maxCedulasPorMateria}</span></button></li>`).join('')}</ul></div></div>
      <div class="cert"><span class="lk">${ic('award')}</span><span class="caps">Carta de cumplimiento docente</span>
        <b>Revisiones a tiempo en el periodo</b><span class="bar" style="display:block"><i style="width:${p}%"></i></span>
        <small><span>${c.aTiempo} de ${c.total}</span><span>${p}%</span></small></div>`;
  }
  function sideAut() {
    const nav = [['aut-home', 'chart', 'Panorama institucional'], ['aut-home', 'layers', 'Por facultad'], ['aut-home', 'list', 'Reportes descargables']];
    return `<div class="outline" style="padding-top:10px"><div class="mod open"><div class="mod-h" style="cursor:default"><span><b>Indicadores</b><small>Periodo ${D.periodo}</small></span><span></span><span></span></div>
      <ul class="items">${nav.map(([v, i, t], k) => `<li><button class="item" data-go="${v}" ${k === 0 ? 'aria-current="true"' : ''} style="grid-template-columns:24px 1fr"><span>${ic(i, 'sm')}</span><span>${t}</span></button></li>`).join('')}</ul></div>
      <div style="padding:16px" class="small muted">Los indicadores miden cumplimiento del proceso, no calificaciones. El detalle por persona solo es visible para las áreas autorizadas.</div></div>`;
  }

  /* =========================================================
     VISTAS · ESTUDIANTE
     ========================================================= */
  const V = {};
  V.trayecto = () => {
    const cur = D.semestres.find(s => s.estado === 'now');
    const tiles = D.semestres.map(s => {
      const cells = s.estado === 'lock' ? Array(6).fill('') : s.materias.map(m => m[2][0] >= m[2][1] ? 'd' : m[2][0] > 0 || s.estado === 'now' ? 'p' : '');
      return `<button class="sem ${s.estado === 'now' ? 'now' : ''} ${s.estado === 'lock' ? 'lock' : ''}" ${s.estado === 'lock' ? 'disabled' : `data-act="openSem" data-arg="${s.n}"`}>
        <span class="n">${s.n}</span><span class="cells">${cells.map(c => `<i class="${c}"></i>`).join('')}</span>
        <small>${s.estado === 'done' ? 'Completado' : s.estado === 'now' ? 'En curso' : 'Bloqueado'}</small></button>`;
    }).join('');
    const e2 = D.etapas[1];
    return `<div class="page">
      <div class="crumb">Mi trayecto</div>
      <div class="ph"><div><h1>Hola, Ana</h1><p>Quinto semestre · ${esc(D.estudiante.programa)}</p></div>
        <button class="btn btn-p" data-go="cedula">Continuar cédula ${ic('right', 'sm')}</button></div>
      <div class="card">
        <div class="between"><div><h3>Trayecto acumulativo</h3><div class="sub">Cada semestre suma sus materias (5.1 a 5.6). Al completar los ocho se desbloquea tu constancia.</div></div>
          <span class="chip gold">${ic('award', 'sm')}4 de 8 semestres</span></div>
        <div class="track" style="margin-top:16px">${tiles}</div>
      </div>
      <div class="grid2" style="margin-top:14px">
        <div class="card"><div class="between"><h3>Próximas entregas</h3><button class="btn btn-o btn-s" data-act="sideTab" data-arg="cal">Ver calendario</button></div>
          <div style="margin-top:8px">
            <div class="due"><div class="d"><b>${dt(e2.entrega).getDate()}</b><span>${MES[dt(e2.entrega).getMonth()]}</span></div><div><h4>5.2 · Etapa 2 · Mejora y adapta</h4><p>Sistema de control de acceso con credencial QR</p></div>${dueChip(e2.entrega)}</div>
            <div class="due"><div class="d"><b>9</b><span>oct</span></div><div><h4>5.1 · Etapa 1 · Comprender y explorar</h4><p>Diseño de la red de un laboratorio</p></div>${dueChip('2026-10-09')}</div>
            <div class="due"><div class="d"><b>27</b><span>oct</span></div><div><h4>5.2 · Conclusión</h4><p>Sistema de control de acceso con credencial QR</p></div>${dueChip('2026-10-27')}</div>
          </div></div>
        <div class="card"><h3>Retroalimentación reciente</h3>
          <div class="fb" style="margin-top:12px"><div class="between"><span class="caps">5.2 · Etapa 1</span><span class="small muted">${fmt(D.cedula.retro1.fecha)}</span></div>
            <p>${esc(D.cedula.retro1.texto)}</p><p class="small muted" style="margin-top:8px">${esc(D.cedula.retro1.autor)}</p></div>
          <button class="btn btn-o btn-s" style="margin-top:12px" data-go="cedula">Atender en la etapa 2 ${ic('right', 'sm')}</button></div>
      </div>
      <div class="card"><div class="between"><div><h3>Semestre ${cur.n} · ${D.periodo}</h3><div class="sub">Cédulas completas / asignadas por materia</div></div></div>
        <table style="margin-top:8px"><thead><tr><th>Materia</th><th>Cédulas</th><th style="width:34%">Avance</th><th></th></tr></thead><tbody>
        ${cur.materias.map(([c, n, [a, b]]) => `<tr><td><b>${c}</b> ${esc(n)}</td><td>${a} de ${b}</td><td><div class="bar gold"><i style="width:${a / b * 100}%"></i></div></td>
          <td style="text-align:right"><button class="btn btn-o btn-s" data-go="materia" data-arg="${c}">Abrir</button></td></tr>`).join('')}</tbody></table></div>
    </div>`;
  };

  V.materia = () => {
    const sem = D.semestres.find(s => s.materias.some(m => m[0] === S.arg));
    const [c, n, [a, b]] = sem.materias.find(m => m[0] === S.arg);
    const isMain = c === '5.2';
    const ced1 = isMain ? `<div class="card ced">
        <div><div class="row"><span class="chip ink">Cédula 1</span><span class="chip gold">${esc(D.reto.tipo)}</span><span class="chip">${ic('link', 'sm')}Proyecto compartido</span></div>
          <h3>${esc(D.reto.titulo)}</h3><div class="sub">${esc(D.reto.docente)} · ${D.etapas.length} etapas</div>
          <div class="shared">${D.reto.compartido.map(([m, d]) => `<span>${ic('link', 'sm')}${esc(m)} · ${esc(d)}</span>`).join('')}</div>
          <div class="stg">${D.etapas.map(e => `<i class="${e.estado === 'done' ? 'd' : e.estado === 'cur' ? 'p' : ''}"></i>`).join('')}</div></div>
        <button class="btn btn-p" data-go="cedula">Continuar ${ic('right', 'sm')}</button></div>
      <div class="card ced"><div><div class="row"><span class="chip">Cédula 2</span><span class="chip">Actividad</span></div>
          <h3>Optimización de consultas sobre datos de CIAE</h3><div class="sub">Inicia el 3 de noviembre</div><div class="stg"><i></i><i></i><i></i></div></div>
        <span class="chip">${ic('lock', 'sm')}Por iniciar</span></div>`
      : `<div class="card ced"><div><div class="row"><span class="chip ink">Cédula 1</span><span class="chip">Actividad</span></div>
          <h3>Reto de ${esc(n)}</h3><div class="sub">${a >= b ? 'Concluida' : 'En curso'}</div><div class="stg">${[0, 1, 2].map(i => `<i class="${a >= b ? 'd' : i === 0 ? 'p' : ''}"></i>`).join('')}</div></div>
        <span class="chip ${a >= b ? 'ok' : 'warn'}">${a >= b ? 'Completa' : 'En curso'}</span></div>`;
    const libres = Math.max(0, D.maxCedulasPorMateria - b);
    return `<div class="page">
      <div class="crumb"><button data-go="trayecto">Mi trayecto</button>${ic('right')}Semestre ${sem.n}${ic('right')}${c}</div>
      <div class="ph"><div><h1>${c} · ${esc(n)}</h1><p>${a} de ${b} cédulas completas</p></div></div>
      ${ced1}
      ${libres ? `<div class="slot" style="margin-top:14px">${ic('layers')}Tu docente puede asignar hasta ${libres} cédula${libres > 1 ? 's' : ''} más en este periodo (máximo ${D.maxCedulasPorMateria} por materia).</div>` : ''}
    </div>`;
  };

  /* ----- Cédula por etapas ----- */
  V.cedula = () => {
    const st = D.etapas.map(e => {
      const sent = e.n === 2 && S.sent2;
      const cls = e.estado === 'done' || sent ? 'done' : e.estado === 'cur' ? 'cur' : '';
      return `<button class="step ${cls}" data-act="stage" data-arg="${e.n}" ${S.stage === e.n ? 'aria-current="true"' : ''}>
        <span class="c">${cls === 'done' ? ic('check', 'sm') : e.n}</span><b>${esc(e.nombre)}</b>
        <small>${e.estado === 'done' ? 'Revisada · ' + fmt(e.revision) : sent ? 'En revisión' : 'Entrega ' + fmt(e.entrega)}</small></button>`;
    }).join('');
    const body = [null, stage1, stage2, stage3][S.stage]();
    const e = D.etapas[S.stage - 1];
    return `<div class="page">
      <div class="crumb"><button data-go="trayecto">Mi trayecto</button>${ic('right')}<button data-go="materia" data-arg="5.2">5.2 Tópicos Avanzados de Bases de Datos</button>${ic('right')}Cédula 1</div>
      <div class="ph"><div><h1>${esc(D.reto.titulo)}</h1><p>Cédula de Rastro Intelectual · ${esc(D.reto.tipo)} · ${esc(D.reto.docente)}</p></div>
        <span class="saved">Guardado automáticamente</span></div>
      <details class="card guide"><summary><span><span class="caps muted">Guía del reto</span><b>Propósito, producto esperado y criterios</b></span>${ic('chev', 'sm')}</summary>
        <dl class="kv">${[['Tipo de reto', D.reto.guia.tipoReto], ['Propósito', D.reto.guia.proposito], ['Producto esperado', D.reto.guia.producto], ['Organización', D.reto.guia.organizacion], ['Criterios', D.reto.guia.criterios], ['Fuentes obligatorias', D.reto.andamiaje.join(' · ')]].map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
        <p class="small muted" style="margin:12px 0 0">Compartido con ${D.reto.compartido.map(([m, d]) => `${esc(m)} (${esc(d)})`).join(' y ')}. Cada materia tiene su propia cédula.</p></details>
      <div class="stepper">${st}</div>
      <div class="ced-grid"><div>${body}
        <div class="nav-pn"><button class="btn btn-o" data-act="stage" data-arg="${Math.max(1, S.stage - 1)}" ${S.stage === 1 ? 'disabled' : ''}>${ic('left', 'sm')}Etapa anterior</button>
          <button class="btn btn-o" data-act="stage" data-arg="${Math.min(3, S.stage + 1)}" ${S.stage === 3 ? 'disabled' : ''}>Etapa siguiente ${ic('right', 'sm')}</button></div></div>
        <aside class="aside">
          <div class="card"><span class="caps muted">Etapa ${e.n}</span><h3 style="margin-top:6px">${esc(e.nombre)}</h3>
            <dl class="kv" style="margin-top:12px"><dt>Tu entrega</dt><dd>${fmtL(e.entrega)}</dd><dt>Revisión docente</dt><dd>a más tardar ${fmt(e.revision)}</dd></dl>
            ${e.estado === 'cur' && !S.sent2 ? `<div style="margin-top:12px">${dueChip(e.entrega)}</div>` : ''}</div>
          <div class="card"><h3 style="font-size:15px">Uso de IA en este reto</h3><p class="small" style="margin:8px 0 0">${esc(D.reto.criteriosIA)}</p></div>
          <div class="note navy">${ic('eye', 'sm')}<span>Tu docente puede apoyarse en un asistente de lectura para revisar tu entrega. Puedes solicitar revisión humana de cualquier retroalimentación.</span></div>
          <div class="note">${ic('alert', 'sm')}<span>No incluyas datos personales en tus prompts. Lineamientos de IA, art. 10.</span></div>
        </aside></div>
    </div>`;
  };
  function stage1() {
    const C = D.cedula;
    return `<div class="card"><div class="between"><h3>Preguntas del docente</h3><span class="chip ok">${ic('check', 'sm')}Entregada ${fmt(D.etapas[0].entrega)}</span></div>
        <div class="sub">Responde con tus propias palabras, sin apoyo de IA.</div>
        ${C.preguntas.map(([q, a], i) => `<div class="qa"><div class="q"><i>${i + 1}.</i><span>${esc(q)}</span></div><textarea class="in" readonly rows="2">${esc(a)}</textarea></div>`).join('')}</div>
      <div class="card"><h3>Bitácora de interacción</h3><div class="sub">Interacciones con IA y diálogos con personas.</div>
        ${C.bitacora.map(b => `<div class="entry"><div class="between"><span class="tg ${b.tipo === 'IA' ? 'ia' : 'hum'}">${b.tipo === 'IA' ? ic('board', 'sm') + 'Interacción con IA' : ic('user', 'sm') + 'Diálogo humano'}</span>
          <span class="small muted">${esc(b.herr)}${b.consent ? ' · consentimiento otorgado' : ''}</span></div>
          <p class="small" style="margin:6px 0 0"><b>${b.tipo === 'IA' ? 'Prompt' : 'Contexto'}:</b> ${esc(b.a)}</p><p class="small" style="margin:6px 0 0"><b>${b.tipo === 'IA' ? 'Respuesta clave' : 'Puntos medulares'}:</b> ${esc(b.b)}</p></div>`).join('')}</div>
      <div class="card"><h3>Propuesta inicial</h3>${field('Tu primera idea, antes de investigar', 'propuesta', { ro: true, req: false })}
        <div class="upload ok">${ic('file', 'lg')}<div><b>Avance_1_requerimientos.pdf</b><div class="small muted">Primer avance · 1.2 MB</div></div></div></div>
      <div class="fb"><div class="between"><span class="caps">Retroalimentación del docente</span><span class="chip ok">${ic('check', 'sm')}Etapa cumplida</span></div>
        <p>${esc(C.retro1.texto)}</p><p class="small muted" style="margin-top:8px">${esc(C.retro1.autor)} · ${fmt(C.retro1.fecha)}</p></div>`;
  }
  function stage2() {
    const C = D.cedula, ro = S.sent2;
    return `<div class="fb"><div class="between"><span class="caps">Retroalimentación de la etapa 1</span><span class="small muted">${fmt(C.retro1.fecha)}</span></div><p>${esc(C.retro1.texto)}</p></div>
      <div class="card" style="margin-top:14px"><h3>Curaduría crítica</h3><div class="sub">Qué buscaste por tu cuenta y qué descartaste.</div>
        ${field('Fuente explorada 1', 'fuentes.0', { input: true, ro })}${field('Fuente explorada 2', 'fuentes.1', { input: true, ro, req: false })}
        <div class="entry"><div class="between"><span class="tg ia">${ic('x', 'sm')}Descarte de IA</span></div><p class="small" style="margin:4px 0 0"><b>${esc(C.descarte[0])}</b></p>
          ${field('Justificación', 'descarte.1', { ro, rows: 2 })}</div></div>
      <div class="card"><h3>Giro cognitivo</h3><div class="sub">Cómo un error se convirtió en hallazgo. No se penaliza equivocarse: se valora documentarlo.</div>
        <div class="giro"><div><h4>Duda emergente</h4><textarea class="in" data-bind="duda" rows="5" ${ro ? 'readonly' : ''}>${esc(C.duda)}</textarea></div>
          <div><h4>Error o fallo</h4><textarea class="in" data-bind="error" rows="5" ${ro ? 'readonly' : ''} placeholder="¿Qué no funcionó?">${esc(C.error)}</textarea></div>
          <div><h4>Rectificación</h4><textarea class="in" data-bind="rect" rows="5" ${ro ? 'readonly' : ''} placeholder="¿Qué cambiaste y por qué?">${esc(C.rect)}</textarea></div></div></div>
      <div class="card"><div class="between"><h3>Segundo avance</h3>${ro ? '<span class="chip warn">En revisión</span>' : ''}</div>
        ${C.avance2 ? `<div class="upload ok">${ic('file', 'lg')}<div><b>Avance_2_modelo_datos.pdf</b><div class="small muted">2.4 MB</div></div></div>`
          : `<div class="upload">${ic('upload', 'lg')}<div style="flex:1"><b>Sube tu avance</b><div class="small muted">PDF, imagen o ZIP · máximo 25 MB</div></div><button class="btn btn-g btn-s" data-act="upload2">Seleccionar archivo</button></div>`}
        ${ro ? `<div class="note" style="margin-top:14px">${ic('clock', 'sm')}<span>Entregada. Tu docente tiene hasta el ${fmtL(D.etapas[1].revision)} para retroalimentarte.</span></div>`
          : `<div class="between" style="margin-top:16px"><span class="small muted">Al enviar, la etapa queda en revisión y no podrás editarla.</span><button class="btn btn-p" data-act="send2">Enviar etapa 2</button></div>`}</div>`;
  }
  function stage3() {
    return `<div class="locked">${ic('lock', 'lg')}<div><b>Se habilita cuando tu docente revise la etapa 2</b><div class="small">Entrega prevista: ${fmtL(D.etapas[2].entrega)}</div></div></div>
      <div class="card" style="margin-top:14px;opacity:.7"><h3>Lo que registrarás en la conclusión</h3>
        <div class="axes">${Object.keys(D.cedula.ejes).map(k => `<div><h4>${k}</h4><p class="small muted" style="margin:0">¿Cómo se alinea tu solución con este eje?</p></div>`).join('')}</div>
        <ul class="small" style="margin:14px 0 0;padding-left:18px;line-height:1.8"><li>Gestión de riesgos y justificación</li><li>Declaración de soberanía intelectual (declaración de uso de IA)</li><li>¿Qué aprendiste? En tus propias palabras</li><li>Descarga de la cédula completa en PDF</li></ul></div>`;
  }

  V.constancia = () => `<div class="page"><div class="crumb"><button data-go="trayecto">Mi trayecto</button>${ic('right')}Constancia</div>
    <div class="ph"><div><h1>Constancia de Agencia Cognitiva</h1><p>Se emite al completar las cédulas de los ocho semestres.</p></div></div>
    <div class="card"><div class="track">${D.semestres.map(s => `<div class="sem ${s.estado === 'now' ? 'now' : ''} ${s.estado === 'lock' ? 'lock' : ''}"><span class="n">${s.n}</span><small>${s.estado === 'done' ? 'Completado' : s.estado === 'now' ? 'En curso' : 'Pendiente'}</small></div>`).join('')}</div>
      <div class="locked" style="margin-top:16px">${ic('award', 'lg')}<div><b>Constancia bloqueada</b><div class="small">Faltan 4 semestres. Al desbloquearse podrás descargarla en PDF con folio de verificación.</div></div></div></div></div>`;

  V.guia = () => `<div class="page"><div class="crumb">Ayuda</div><div class="ph"><div><h1>Cómo funciona</h1><p>Guía rápida. La explicación completa está en <a href="modelo.html">Conoce el modelo</a>.</p></div></div>
    <div class="grid3">${[['1', 'Tu docente publica el reto', 'Define si es un proyecto, una actividad integradora o una mini actividad, y calendariza al menos dos etapas.'],
      ['2', 'Entregas por etapa', 'En cada etapa registras tu proceso y subes un avance. Tu docente tiene un plazo fijo para retroalimentarte.'],
      ['3', 'Concluyes y acumulas', 'Cierras con lo que aprendiste. Cada cédula suma a tu trayecto hasta desbloquear tu constancia.']]
      .map(([n, t, d]) => `<div class="card"><span class="serif" style="font-size:34px;color:var(--gold);font-weight:300">${n}</span><h3 style="margin-top:6px">${t}</h3><p class="small muted" style="margin:6px 0 0">${d}</p></div>`).join('')}</div></div>`;

  /* =========================================================
     VISTAS · DOCENTE
     ========================================================= */
  const IT = () => S.nuevo.modo === 'integrador' ? S.nuevo.integr[0] : S.nuevo.acts[S.nuevo.act];
  const minPreg = i => i === 0 ? 3 : 1;
  const seg = (act, opts, val) => `<div class="seg" role="group">${opts.map(([v, t]) => `<button type="button" data-act="${act}" data-arg="${v}" aria-pressed="${val === v}">${t}</button>`).join('')}</div>`;
  const nb = (label, path, o = {}) => {
    const v = path.split('.').reduce((a, k) => a?.[k], IT());
    const el = o.area ? `<textarea class="in" data-nb="${path}" rows="${o.rows || 2}" placeholder="${esc(o.ph || '')}">${esc(v)}</textarea>`
      : `<input class="in" data-nb="${path}" value="${esc(v)}" placeholder="${esc(o.ph || '')}">`;
    return `<label class="f"><span class="${o.req ? 'req' : ''}">${label}${o.hint ? ` <em>· ${o.hint}</em>` : ''}</span>${el}</label>`;
  };

  V['doc-home'] = () => {
    const mat = D.docente.materias[0];
    const inv = D.invitaciones.filter(i => i.estado === 'pendiente');
    return `<div class="page">
    <div class="crumb">Panel docente</div>
    <div class="ph"><div><h1>Panel docente</h1><p>${D.docente.materias.map(m => `${m.c} ${esc(m.n)}`).join(' · ')} · Periodo ${D.periodo}</p></div><button class="btn btn-p" data-go="doc-reto">${ic('plus', 'sm')}Nuevo reto</button></div>
    <div class="grid4">
      <div class="card kpi"><b>${D.pendientes.length}</b><span>Revisiones pendientes</span></div>
      <div class="card kpi"><b>${D.pendientes.filter(p => days(p.vence) < 0).length}</b><span>Revisiones vencidas</span></div>
      <div class="card kpi"><b>31/34</b><span>Entregas de la etapa 1 en ${mat.c}</span></div>
      <div class="card kpi"><b>${mat.usadas}/${D.maxCedulasPorMateria}</b><span>Cédulas usadas en ${mat.c}</span></div></div>
    ${inv.map((v, i) => `<div class="card invite" style="margin-top:14px">
        <span class="ri">${ic('link')}</span><div><span class="caps muted">Invitación de colaboración</span><p style="margin:4px 0 0"><b>${esc(v.de)}</b> (${esc(v.m)}) le invita a compartir el proyecto <b>${esc(v.reto)}</b>.</p></div>
        <div class="row"><button class="btn btn-o btn-s" data-act="inviteAns" data-arg="${i}:rechazada">Rechazar</button><button class="btn btn-p btn-s" data-act="inviteAns" data-arg="${i}:aceptada">Aceptar</button></div></div>`).join('')}
    <div class="grid2" style="margin-top:14px">
      <div class="card"><div class="between"><h3>Por revisar</h3><button class="btn btn-o btn-s" data-go="doc-rev">Ver todas</button></div>
        <ul class="list-pend" style="margin-top:8px">${D.pendientes.map((p, i) => `<li><span class="av">${p.n.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
          <span><b class="small">${esc(p.n)}</b><br><span class="small muted">${p.m} · ${esc(p.etapa)} · ${p.g}</span></span>${dueChip(p.vence)}
          <button class="btn btn-o btn-s" data-go="doc-rev" data-arg="${i}">Revisar</button></li>`).join('')}</ul></div>
      <div class="card"><h3>Retos publicados</h3>${D.retosDocente.map(r => `<div class="entry"><div class="between"><span class="chip gold">${esc(r.tipo)}</span><span class="small muted">${esc(r.etapa)}</span></div>
          <p style="margin:8px 0 10px;font-weight:600">${esc(r.t)}</p><div class="bar"><i style="width:${r.entregas[0] / r.entregas[1] * 100}%"></i></div>
          <p class="small muted" style="margin:6px 0 0">${r.entregas[0]} de ${r.entregas[1]} entregas</p></div>`).join('')}
        <div class="note" style="margin-top:14px">${ic('clock', 'sm')}<span>Cada entrega abre automáticamente un plazo de ${D.diasRevisionDocente} días para su retroalimentación. Las revisiones a tiempo cuentan para su carta de cumplimiento.</span></div></div>
    </div></div>`;
  };

  function stageBlock(e, i, it) {
    const open = it.open.has(i), min = minPreg(i), nE = it.etapas.length;
    const nq = e.preguntas.filter(q => q.trim()).length;
    return `<div class="stage ${open ? 'open' : ''}">
      <div class="stage-row"><span class="n">${i + 1}</span>
        <input class="in" data-nb="etapas.${i}.nombre" value="${esc(e.nombre)}" aria-label="Nombre de la etapa ${i + 1}">
        <input class="in" type="date" data-nb="etapas.${i}.fecha" data-rerender="1" value="${e.fecha}" aria-label="Fecha de entrega">
        <span class="auto">Revisión hasta<br><b>${fmt(addDays(e.fecha, D.diasRevisionDocente))}</b></span>
        <button type="button" class="btn btn-o btn-s cfg-btn" data-act="cfgStage" data-arg="${i}" aria-expanded="${open}">${ic('sliders', 'sm')}<span>Configurar · ${nq} preg.</span></button>
        <button type="button" class="xbtn" data-act="delStage" data-arg="${i}" ${nE <= 2 ? 'disabled title="Mínimo dos etapas"' : ''} aria-label="Quitar etapa">${ic('x', 'sm')}</button></div>
      ${open ? `<div class="cfg">
        <div class="grid2">${nb('Entregable de la etapa', `etapas.${i}.entregable`, { ph: i === 0 ? 'Ej. Documento de requerimientos' : 'Ej. Segundo avance con correcciones' })}
          ${nb('Instrucciones para el estudiante', `etapas.${i}.instrucciones`, { area: true, ph: 'Qué debe hacer y cómo se entrega' })}</div>
        <div class="between" style="margin-top:16px"><div><b class="small">Preguntas abiertas de la etapa ${i + 1}</b><div class="small muted">Mínimo ${min}. ${i === 0 ? 'El estudiante responde sin apoyo de IA.' : 'Ayudan a reflexionar sobre la retroalimentación recibida.'}</div></div>
          <button type="button" class="btn btn-o btn-s" data-act="addQ" data-arg="${i}">${ic('plus', 'sm')}Agregar pregunta</button></div>
        ${e.preguntas.map((q, k) => `<div class="qrow"><span class="serif">${k + 1}.</span><input class="in" data-nb="etapas.${i}.preguntas.${k}" value="${esc(q)}" placeholder="Escriba la pregunta" aria-label="Pregunta ${k + 1}">
          <button type="button" class="xbtn" data-act="delQ" data-arg="${i}:${k}" ${e.preguntas.length <= min ? 'disabled' : ''} aria-label="Quitar pregunta">${ic('x', 'sm')}</button></div>`).join('')}
      </div>` : ''}</div>`;
  }

  V['doc-reto'] = () => {
    const N = S.nuevo, it = IT(), mat = D.docente.materias.find(m => m.c === N.materia);
    const libres = D.maxCedulasPorMateria - mat.usadas, need = N.modo === 'integrador' ? 1 : 3, ok = libres >= need;
    const invitables = D.docentes.filter(d => !N.compartido.some(c => c.d === d.n));
    return `<div class="page">
      <div class="crumb"><button data-go="doc-home">Panel docente</button>${ic('right')}Nuevo reto</div>
      <div class="ph"><div><h1>Nuevo reto de aprendizaje</h1><p>Defina la actividad y la guía que verán sus estudiantes.</p></div></div>

      <div class="card"><h3>Materia y modalidad</h3>
        <div class="grid2"><label class="f"><span class="req">Materia</span><select class="in" data-change="materia">${D.docente.materias.map(m => `<option value="${m.c}" ${m.c === N.materia ? 'selected' : ''}>${m.c} ${esc(m.n)} · ${m.grupos.join(', ')}</option>`).join('')}</select></label>
          <div class="f" style="align-self:end"><span class="small muted">Cédulas usadas en ${mat.c} este periodo</span><div class="row" style="margin-top:6px;flex-wrap:nowrap"><div class="bar gold" style="flex:1"><i style="width:${mat.usadas / D.maxCedulasPorMateria * 100}%"></i></div><b class="small">${mat.usadas} de ${D.maxCedulasPorMateria}</b></div></div></div>
        <div class="modes">
          <button type="button" class="mode" data-act="modo" data-arg="integrador" aria-pressed="${N.modo === 'integrador'}"><span class="rad"></span><span><b>Proyecto integrador</b><span>Un proyecto que puede compartirse con otras materias y docentes. Usa 1 cédula.</span></span></button>
          <button type="button" class="mode" data-act="modo" data-arg="actividades" aria-pressed="${N.modo === 'actividades'}"><span class="rad"></span><span><b>3 actividades de aprendizaje</b><span>Tres actividades de esta materia, cada una con su cédula. Usa 3 cédulas.</span></span></button></div>
        ${ok ? '' : `<div class="note" style="margin-top:14px">${ic('alert', 'sm')}<span>Solo ${libres === 1 ? 'queda 1 cédula disponible' : `quedan ${libres} cédulas disponibles`} en ${mat.c}. Elija proyecto integrador u otra materia.</span></div>`}
      </div>

      ${N.modo === 'actividades' ? `<div class="acttabs" role="tablist">${N.acts.map((a, k) => `<button type="button" role="tab" data-act="actTab" data-arg="${k}" aria-selected="${N.act === k}"><span class="st ${a.titulo.trim() ? 'done' : ''}">${a.titulo.trim() ? ic('check') : ''}</span>Actividad ${k + 1}</button>`).join('')}</div>` : ''}

      <div class="card"><h3>${N.modo === 'integrador' ? 'Datos del proyecto' : `Actividad ${N.act + 1}`}</h3>
        ${nb('Título', 'titulo', { req: true, ph: N.modo === 'integrador' ? 'Ej. Sistema de inventario para el laboratorio de cómputo' : 'Ej. Normalización de una base de datos real' })}
        <label class="f"><span class="req">Tipo de reto</span></label>${seg('tipoReto', [['Situado', 'Situado · problema real del territorio'], ['Conceptual', 'Conceptual · teorías y conceptos']], it.tipoReto)}
        ${nb('Descripción y problemática', 'desc', { area: true, rows: 3, req: true, ph: '¿Qué deben resolver? ¿Con qué comunidad, área o institución?' })}
      </div>

      <div class="card"><h3>Guía para el estudiante</h3><div class="sub">Lo que el estudiante verá al iniciar para saber cómo realizar ${N.modo === 'integrador' ? 'el proyecto' : 'la actividad'}.</div>
        <div class="grid2">${nb('Propósito de aprendizaje', 'proposito', { area: true, req: true, ph: '¿Qué debe aprender o ser capaz de hacer?' })}
          ${nb('Producto esperado', 'producto', { area: true, req: true, ph: 'Ej. Prototipo, documento técnico, propuesta de ley' })}</div>
        <label class="f"><span class="req">Organización</span></label>
        <div class="row">${seg('organizacion', [['Individual', 'Individual'], ['Equipo', 'En equipo']], it.organizacion)}${it.organizacion === 'Equipo' ? `<label class="row small" style="gap:8px">Integrantes por equipo <input class="in" style="width:80px" data-nb="integrantes" value="${esc(it.integrantes)}" inputmode="numeric"></label>` : ''}</div>
        <div class="grid2">${nb('Criterios de evaluación', 'criterios', { area: true, req: true, ph: 'Qué se valorará del proceso y del producto' })}
          ${nb('Recursos y fuentes obligatorias', 'recursos', { area: true, req: true, ph: 'Una por línea: textos, normas, bases de datos' })}</div>
        ${nb('Uso de IA permitido', 'ia', { area: true, req: true, ph: 'Qué sí y qué no se permite' })}
        ${nb('Ejemplo o referencia', 'ejemplo', { hint: 'opcional', ph: 'Enlace a un ejemplo o a una guía de apoyo' })}
      </div>

      ${N.modo === 'integrador' ? `<div class="card"><h3>Compartir proyecto con otros docentes</h3><div class="sub">Cada materia vinculada genera su propia cédula y cada docente revisa la suya.</div>
        <div class="share">
          <div class="fld"><span class="flab">Invitar desde la plataforma</span>
            <div class="row" style="flex-wrap:nowrap"><select class="in" data-change="invitar"><option value="">Seleccione un docente</option>${invitables.map(d => `<option value="${esc(d.n)}" ${N.invitar === d.n ? 'selected' : ''}>${esc(d.n)} · ${esc(d.m)}</option>`).join('')}</select>
            <button type="button" class="btn btn-p" data-act="invite" ${N.invitar ? '' : 'disabled'}>Enviar invitación</button></div></div>
          <div class="or"><span>o</span></div>
          <div class="fld"><span class="flab">Compartir enlace de invitación</span>
            <div class="row" style="flex-wrap:nowrap"><input class="in" readonly value="https://agencia.unach.mx/invitacion/R-2026-2-0158" id="invUrl">
            <button type="button" class="btn btn-o" data-act="copyLink">${ic('link', 'sm')}Copiar</button></div></div></div>
        <div class="tbl"><table style="margin-top:18px"><thead><tr><th>Materia</th><th>Docente</th><th>Estado</th><th></th></tr></thead><tbody>
          <tr><td><b>${mat.c}</b> ${esc(mat.n)}</td><td>${esc(D.docente.nombre)}</td><td><span class="chip ink">Responsable</span></td><td></td></tr>
          ${N.compartido.map((c, k) => `<tr><td>${esc(c.m)}</td><td>${esc(c.d)}</td><td><span class="chip ${c.e === 'Aceptada' ? 'ok' : 'warn'}">${c.e}</span></td>
            <td style="text-align:right;white-space:nowrap">${c.e !== 'Aceptada' ? `<button type="button" class="btn btn-o btn-s" data-act="resend" data-arg="${k}">Reenviar</button> ` : ''}<button type="button" class="btn btn-o btn-s" data-act="unshare" data-arg="${k}">Quitar</button></td></tr>`).join('')}
        </tbody></table></div></div>` : ''}

      <div class="card"><div class="between"><div><h3>Etapas y calendario</h3><div class="sub">Mínimo 2 etapas. La revisión se asigna automáticamente: entrega + ${D.diasRevisionDocente} días. Use "Configurar" para definir las preguntas y el entregable de cada etapa.</div></div>
          <button type="button" class="btn btn-o btn-s" data-act="addStage">${ic('plus', 'sm')}Agregar etapa</button></div>
        <div style="margin-top:10px">${it.etapas.map((e, i) => stageBlock(e, i, it)).join('')}
          <div class="stage-row last"><span class="n">${ic('award', 'sm')}</span><span><b>Conclusión del estudiante</b><br><span class="small muted">¿Qué aprendiste? Se agrega siempre al final.</span></span></div></div></div>

      <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-o" data-go="doc-home">Cancelar</button><button class="btn btn-o" data-act="draft">Guardar borrador</button><button class="btn btn-p" data-act="publish" ${ok ? '' : 'disabled'}>Publicar ${N.modo === 'integrador' ? 'proyecto' : 'actividades'}</button></div>
    </div>`;
  };

  V['doc-rev'] = () => {
    const mats = D.docente.materias, fm = S.revMat || 'todas';
    const list = D.pendientes.map((p, i) => [p, i]).filter(([p]) => fm === 'todas' || p.m === fm);
    const matSel = `<label class="f"><span>Materia</span><select class="in" data-change="revMat"><option value="todas">Todas las materias (${D.pendientes.length})</option>${mats.map(m => `<option value="${m.c}" ${fm === m.c ? 'selected' : ''}>${m.c} ${esc(m.n)} (${D.pendientes.filter(x => x.m === m.c).length})</option>`).join('')}</select></label>`;
    if (!list.length) return `<div class="page"><div class="crumb"><button data-go="doc-home">Panel docente</button>${ic('right')}Revisiones</div>
      <div class="card filters">${matSel}</div><div class="locked" style="margin-top:14px">${ic('check', 'lg')}<div><b>Sin revisiones pendientes</b><div class="small">No hay entregas por revisar con este filtro.</div></div></div></div>`;
    if (!list.some(([, i]) => i === S.reviewing)) S.reviewing = list[0][1];
    const pos = list.findIndex(([, i]) => i === S.reviewing), p = D.pendientes[S.reviewing], C = D.cedula;
    const prev = list[pos - 1]?.[1], next = list[pos + 1]?.[1];
    return `<div class="page">
      <div class="crumb"><button data-go="doc-home">Panel docente</button>${ic('right')}Revisiones</div>
      <div class="card filters">${matSel}
        <label class="f"><span>Alumno</span><select class="in" data-change="revAlumno">${list.map(([x, i]) => `<option value="${i}" ${i === S.reviewing ? 'selected' : ''}>${esc(x.n)} · ${x.m} · ${x.g} · ${days(x.vence) < 0 ? 'vencida' : 'vence ' + fmt(x.vence)}</option>`).join('')}</select></label>
        <div class="row nav-rev"><button class="btn btn-o" data-act="revGo" data-arg="${prev ?? ''}" ${prev == null ? 'disabled' : ''} aria-label="Anterior">${ic('left', 'sm')}</button>
          <span class="small muted">${pos + 1} de ${list.length}</span>
          <button class="btn btn-o" data-act="revGo" data-arg="${next ?? ''}" ${next == null ? 'disabled' : ''} aria-label="Siguiente">${ic('right', 'sm')}</button></div></div>
      <div class="ph"><div><h1>${esc(p.n)}</h1><p>${p.m} · ${esc(p.etapa)} · Grupo ${p.g}</p></div>${dueChip(p.vence)}</div>
      <div class="rev">
        <div><div class="card"><h3>Respuestas a las preguntas</h3>${C.preguntas.map(([q, a], i) => `<div class="qa"><div class="q"><i>${i + 1}.</i><span>${esc(q)}</span></div><p class="small" style="margin:8px 0 0 36px">${esc(a)}</p></div>`).join('')}</div>
          <div class="card"><h3>Bitácora</h3>${C.bitacora.map(b => `<div class="entry"><span class="tg ${b.tipo === 'IA' ? 'ia' : 'hum'}">${b.tipo === 'IA' ? 'Interacción con IA' : 'Diálogo humano'}</span>
            <p class="small" style="margin:6px 0 0">${esc(b.a)}</p><p class="small muted" style="margin:4px 0 0">${esc(b.b)}</p></div>`).join('')}</div>
          <div class="card"><h3>Propuesta inicial y avance</h3><p class="small" style="margin:8px 0 0">${esc(C.propuesta)}</p>
            <div class="upload ok">${ic('file', 'lg')}<div><b>Avance_1.pdf</b><div class="small muted">1.2 MB</div></div><button class="btn btn-o btn-s" style="margin-left:auto">${ic('download', 'sm')}Descargar</button></div></div></div>
        <div class="aside">
          <div class="assist"><div class="between"><span class="caps">Lectura asistida</span><span class="chip">Piloto · solo docentes</span></div>
            <p class="small" style="margin:0">Resumen: identifica bien el problema y consulta a las personas involucradas; su propuesta inicial todavía es simple.</p>
            <h4>Lista de revisión</h4><ul>
              <li class="y">${ic('check')}<span>Responde las preguntas abiertas</span></li>
              <li class="y">${ic('check')}<span>Registra interacción con IA y diálogo humano</span></li>
              <li class="n">${ic('x')}<span>No explica por qué aceptó la sugerencia de la IA</span></li></ul>
            <h4>Incongruencias</h4><ul><li class="n">${ic('alert')}<span>Menciona "concurrencia en horas pico" pero su propuesta no la considera.</span></li></ul>
            <p class="small muted" style="margin:12px 0 0">Sugerencia, no evaluación. La decisión es del docente.</p></div>
          <div class="card"><h3>Retroalimentación</h3>
            <label class="f"><span class="req">Comentario para el estudiante</span><textarea class="in" rows="5" id="fbText" placeholder="Qué está bien, qué falta, qué revisar en la siguiente etapa."></textarea></label>
            <label class="row small" style="margin-top:12px"><input type="checkbox" id="fbOk" checked> Marcar etapa como cumplida</label>
            <button class="btn btn-p" style="margin-top:14px;width:100%;justify-content:center" data-act="sendFb">Enviar retroalimentación</button></div>
        </div></div></div>`;
  };

  /* =========================================================
     VISTA · AUTORIDAD
     ========================================================= */
  V['aut-home'] = () => `<div class="page">
    <div class="crumb">Indicadores</div>
    <div class="ph"><div><h1>Panorama institucional</h1><p>Periodo ${D.periodo} · Cumplimiento del proceso de Agencia Cognitiva</p></div><button class="btn btn-o">${ic('download', 'sm')}Exportar reporte</button></div>
    <div class="grid4">
      <div class="card kpi"><b>18,420</b><span>Cédulas activas</span></div>
      <div class="card kpi"><b>79%</b><span>Etapas entregadas a tiempo</span></div>
      <div class="card kpi"><b>71%</b><span>Revisiones docentes a tiempo</span></div>
      <div class="card kpi"><b>64%</b><span>Docentes con retos publicados</span></div></div>
    <div class="card" style="margin-top:14px"><div class="between"><div><h3>Por facultad</h3><div class="sub">Entregas a tiempo de estudiantes y revisiones a tiempo de docentes</div></div>
        <div class="row small"><span class="row" style="gap:6px"><i style="width:10px;height:10px;border-radius:2px;background:var(--navy)"></i>Estudiantes</span><span class="row" style="gap:6px"><i style="width:10px;height:10px;border-radius:2px;background:var(--gold)"></i>Docentes</span></div></div>
      <div style="margin-top:10px">${D.facultades.map(([f, a, b]) => `<div class="hbar"><span>${esc(f)}</span><span><span class="bar" style="display:block"><i style="width:${a}%"></i></span><span class="bar gold" style="display:block;margin-top:4px"><i style="width:${b}%"></i></span></span><span class="small"><b>${a}%</b><br><span class="muted">${b}%</span></span></div>`).join('')}</div></div>
    <div class="grid2" style="margin-top:14px">
      <div class="card"><h3>Avance del trayecto por semestre</h3><div style="margin-top:10px">${[[1, 88], [2, 84], [3, 80], [4, 77], [5, 61], [6, 58], [7, 55], [8, 49]].map(([s, v]) => `<div class="hbar" style="grid-template-columns:90px 1fr 44px"><span>Semestre ${s}</span><span class="bar"><i style="width:${v}%"></i></span><b class="small">${v}%</b></div>`).join('')}</div></div>
      <div class="card"><h3>Lo que reportan haber aprendido</h3><div class="sub">Síntesis de las conclusiones de los estudiantes (muestra anónima)</div>
        <div class="row" style="margin-top:14px;gap:8px">${['Investigar antes de proponer', 'Justificar decisiones', 'Trabajo con la comunidad', 'Detectar errores de la IA', 'Modelado de datos', 'Normatividad local'].map((t, i) => `<span class="chip ${i < 2 ? 'ink' : i < 4 ? 'gold' : ''}">${t}</span>`).join('')}</div>
        <div class="note" style="margin-top:16px">${ic('alert', 'sm')}<span>Cifras de ejemplo. El sistema mide cumplimiento del proceso; el aprendizaje lo valoran docentes y academias.</span></div></div></div>
  </div>`;

  /* =========================================================
     RENDER Y EVENTOS
     ========================================================= */
  const DEFAULT = { est: 'trayecto', doc: 'doc-home', aut: 'aut-home' };
  function render() {
    $('#side').innerHTML = S.role === 'est' ? sideEst() : S.role === 'doc' ? sideDoc() : sideAut();
    $('#view').innerHTML = (V[S.view] || V[DEFAULT[S.role]])();
  }
  function go(view, arg) {
    S.view = view; S.arg = arg ?? null;
    if (view === 'doc-rev') { S.reviewing = arg != null ? +arg : null; if (arg != null) S.revMat = 'todas'; }
    if (view === 'cedula' && arg == null) S.stage = 2;
    $('#side').classList.remove('open');
    render(); window.scrollTo(0, 0); $('#view').focus({ preventScroll: true });
  }

  const ACT = {
    toggleMod: a => { const n = +a; S.open.has(n) ? S.open.delete(n) : S.open.add(n); render(); },
    openSem: a => { S.open.add(+a); S.sideTab = 'tray'; render(); if (innerWidth < 860) $('#side').classList.add('open'); },
    sideTab: a => { S.sideTab = a; render(); if (innerWidth < 860) $('#side').classList.add('open'); },
    toggleSide: () => $('#side').classList.toggle('open'),
    stage: a => { S.stage = +a; render(); },
    upload2: () => { D.cedula.avance2 = true; render(); toast('Archivo cargado'); },
    send2: () => {
      const C = D.cedula, m = [];
      if (!C.fuentes[0].trim()) m.push('Al menos una fuente explorada');
      if (!C.descarte[1].trim()) m.push('Justificación del descarte');
      ['duda', 'error', 'rect'].forEach(k => { if (!String(C[k]).trim()) m.push('Giro cognitivo: ' + { duda: 'duda emergente', error: 'error o fallo', rect: 'rectificación' }[k]); });
      if (!C.avance2) m.push('Archivo del segundo avance');
      if (m.length) return modal(`<h3>Faltan elementos para enviar</h3><p class="small muted" style="margin:6px 0 0">Se revisa que tu registro esté completo, no que sea "correcto".</p><ul>${m.map(x => `<li>${esc(x)}</li>`).join('')}</ul><div class="row"><button class="btn btn-p" data-act="closeModal">Entendido</button></div>`);
      modal(`<h3>Enviar etapa 2</h3><p class="small muted" style="margin:6px 0 0">Tu docente tendrá hasta el ${fmtL(D.etapas[1].revision)} para retroalimentarte.</p><div class="row"><button class="btn btn-o" data-act="closeModal">Cancelar</button><button class="btn btn-p" data-act="confirm2">Enviar</button></div>`);
    },
    confirm2: () => { S.sent2 = true; closeModal(); render(); toast('Etapa 2 enviada'); },
    closeModal, closeOv: (a, e) => { if (e.target.classList.contains('ov')) closeModal(); },
    notif: () => modal(`<h3>Avisos</h3><ul><li>Tu etapa 2 de 5.2 vence el ${fmtL(D.etapas[1].entrega)}.</li><li>Recibiste retroalimentación en 5.2 · Etapa 1.</li></ul><div class="row"><button class="btn btn-p" data-act="closeModal">Cerrar</button></div>`),
    logout: () => { $('#app').classList.add('hidden'); $('#login').classList.remove('hidden'); },
    modo: a => { S.nuevo.modo = a; S.nuevo.act = 0; render(); },
    actTab: a => { S.nuevo.act = +a; render(); },
    tipoReto: a => { IT().tipoReto = a; render(); },
    organizacion: a => { IT().organizacion = a; render(); },
    cfgStage: a => { const o = IT().open, i = +a; o.has(i) ? o.delete(i) : o.add(i); render(); },
    addStage: () => { const it = IT(), l = it.etapas.at(-1).fecha; it.etapas.push(etapaN('Nueva etapa', addDays(l, 14))); it.open.add(it.etapas.length - 1); render(); },
    delStage: a => { const it = IT(); if (it.etapas.length > 2) { it.etapas.splice(+a, 1); it.open = new Set(); render(); } },
    addQ: a => { IT().etapas[+a].preguntas.push(''); render(); },
    delQ: a => { const [i, k] = a.split(':').map(Number), e = IT().etapas[i]; if (e.preguntas.length > minPreg(i)) { e.preguntas.splice(k, 1); render(); } },
    invite: () => { const d = D.docentes.find(x => x.n === S.nuevo.invitar); if (!d) return; S.nuevo.compartido.push({ m: d.m, d: d.n, e: 'Pendiente' }); S.nuevo.invitar = ''; render(); toast('Invitación enviada a ' + d.n); },
    resend: a => toast('Invitación reenviada a ' + S.nuevo.compartido[+a].d),
    unshare: a => { S.nuevo.compartido.splice(+a, 1); render(); },
    copyLink: () => { const v = $('#invUrl').value; try { navigator.clipboard.writeText(v).then(() => toast('Enlace copiado'), () => toast('Copie el enlace manualmente')); } catch (err) { toast('Copie el enlace manualmente'); } },
    inviteAns: a => { const [i, r] = a.split(':'); const v = D.invitaciones.filter(x => x.estado === 'pendiente')[+i]; if (!v) return; v.estado = r; render(); toast(r === 'aceptada' ? 'Invitación aceptada: el proyecto aparece en sus retos' : 'Invitación rechazada'); },
    revFilter: a => { S.revMat = a; S.reviewing = null; go('doc-rev'); },
    revGo: a => { if (a !== '') { S.reviewing = +a; render(); } },
    draft: () => toast('Borrador guardado'),
    publish: () => {
      const N = S.nuevo, items = N.modo === 'integrador' ? N.integr : N.acts, m = [];
      items.forEach((it, k) => {
        const pre = N.modo === 'integrador' ? '' : `Actividad ${k + 1} · `;
        [['titulo', 'Título'], ['desc', 'Descripción'], ['proposito', 'Propósito de aprendizaje'], ['producto', 'Producto esperado'], ['criterios', 'Criterios de evaluación'], ['recursos', 'Recursos y fuentes'], ['ia', 'Uso de IA permitido']]
          .forEach(([f, t]) => { if (!String(it[f]).trim()) m.push(pre + t); });
        it.etapas.forEach((e, i) => { if (e.preguntas.filter(q => q.trim()).length < minPreg(i)) m.push(`${pre}Etapa ${i + 1}: mínimo ${minPreg(i)} pregunta${minPreg(i) > 1 ? 's' : ''}`); });
      });
      if (m.length) return modal(`<h3>Complete la información</h3><p class="small muted" style="margin:6px 0 0">Estos campos guían al estudiante y son obligatorios.</p><ul>${m.slice(0, 12).map(x => `<li>${esc(x)}</li>`).join('')}${m.length > 12 ? `<li>y ${m.length - 12} más</li>` : ''}</ul><div class="row"><button class="btn btn-p" data-act="closeModal">Entendido</button></div>`);
      toast(N.modo === 'integrador' ? 'Proyecto publicado' : '3 actividades publicadas'); go('doc-home');
    },
    sendFb: () => {
      if (!$('#fbText').value.trim()) return modal(`<h3>Escribe un comentario</h3><p class="small muted" style="margin:6px 0 0">La retroalimentación es obligatoria para cerrar la revisión.</p><div class="row"><button class="btn btn-p" data-act="closeModal">Entendido</button></div>`);
      D.pendientes.splice(S.reviewing ?? 0, 1); D.cumplimientoDocente.aTiempo++; D.cumplimientoDocente.total++;
      S.reviewing = null; toast('Retroalimentación enviada'); render(); window.scrollTo(0, 0);
    },
  };

  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); return go(g.dataset.go, g.dataset.arg); }
    const a = e.target.closest('[data-act]'); if (a && ACT[a.dataset.act]) {
      ACT[a.dataset.act](a.dataset.arg, e);
    }
  });
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.bind) {
      const ks = el.dataset.bind.split('.'), last = ks.pop();
      ks.reduce((o, k) => o[k], D.cedula)[last] = el.value; saving();
    }
    if (el.dataset.nb) {
      const ks = el.dataset.nb.split('.'), last = ks.pop();
      ks.reduce((o, k) => o[k], IT())[last] = el.value;
      if (ks[0] === 'etapas' && ks[2] === 'preguntas') {
        const lab = el.closest('.stage')?.querySelector('.cfg-btn span');
        if (lab) lab.textContent = `Configurar · ${IT().etapas[+ks[1]].preguntas.filter(q => q.trim()).length} preg.`;
      }
    }
    if (el.dataset.actInput === 'filter') {
      const q = el.value.toLowerCase();
      $$('#outline .item').forEach(i => { i.parentElement.style.display = i.textContent.toLowerCase().includes(q) ? '' : 'none'; });
      if (q) $$('#outline .mod').forEach(m => m.classList.add('open'));
    }
  });
  document.addEventListener('change', e => {
    const el = e.target, c = el.dataset.change;
    if (el.dataset.rerender) render();
    if (c === 'materia') { S.nuevo.materia = el.value; render(); }
    if (c === 'invitar') { S.nuevo.invitar = el.value; render(); }
    if (c === 'revMat') { S.revMat = el.value; S.reviewing = null; render(); }
    if (c === 'revAlumno') { S.reviewing = +el.value; render(); }
  });
  document.addEventListener('paste', e => {
    const el = e.target; if (!el.dataset?.bind) return;
    const lab = el.closest('label.f')?.querySelector('span') || el.previousElementSibling;
    if (lab && !lab.querySelector('.pasted')) lab.insertAdjacentHTML('beforeend', '<span class="pasted">texto pegado</span>');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Acceso ---------- */
  let role = 'est';
  $$('.role-opt').forEach(b => b.addEventListener('click', () => { role = b.dataset.role; $$('.role-opt').forEach(x => x.setAttribute('aria-pressed', x === b)); }));
  $('#btnLogin').addEventListener('click', () => {
    S.role = role; S.view = DEFAULT[role];
    const u = role === 'est' ? D.estudiante : role === 'doc' ? D.docente : D.autoridad;
    $('#userName').textContent = u.nombre; $('#userAv').textContent = u.iniciales;
    $('#userRole').textContent = { est: 'Estudiante', doc: 'Docente', aut: 'Autoridad' }[role];
    $('#ctxTitle').textContent = role === 'est' ? D.estudiante.programa : role === 'doc' ? 'Docencia' : 'Secretaría Académica';
    $('#ctxSub').textContent = role === 'est' ? `Periodo ${D.periodo} · Quinto semestre` : role === 'doc' ? `Materias ${D.docente.materias.map(m => m.c).join(' y ')} · Periodo ${D.periodo}` : `Periodo ${D.periodo} · Vista institucional`;
    $('#notifCount').classList.toggle('hidden', role !== 'est');
    $('#login').classList.add('hidden'); $('#app').classList.remove('hidden');
    render();
  });

  /* ---------- Relieve del acceso ---------- */
  $$('svg[data-topo]').forEach(svg => {
    const [cx, cy, rings, seed] = svg.dataset.topo.split(',').map(Number); let d = '';
    for (let k = 0; k < rings; k++) {
      const r = 30 + k * 26, pts = [];
      for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2, w = 1 + .16 * Math.sin(3 * a + k * .35 + seed) + .09 * Math.sin(5 * a - k * .22); pts.push((cx + Math.cos(a) * r * w * 1.25).toFixed(1) + ' ' + (cy + Math.sin(a) * r * w).toFixed(1)); }
      d += 'M' + pts.join('L') + 'Z';
    }
    svg.innerHTML = `<path d="${d}"/>`;
  });
  hydrateIcons();
})();

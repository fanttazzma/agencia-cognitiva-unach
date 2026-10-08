/* =========================================================
   Plataforma · Agencia Cognitiva UNACH (prototipo v3)
   - Sin manejadores en línea: un listener delegado
     (data-go = navegar, data-act = acción, data-change = selects).
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
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
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
    layers: '<path d="M12 3 3 8l9 5 9-5Z"/><path d="M3 13l9 5 9-5"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    cpu: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    undo: '<path d="M9 7 4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12"/>',
    print: '<path d="M7 9V3h10v6"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 14h10v7H7Z"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 5.5 3.5-5.5 3.5Z"/>',
  };
  const ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
  const hydrateIcons = (root = document) => $$('[data-icon]', root).forEach(el => { el.innerHTML = ic(el.dataset.icon); el.removeAttribute('data-icon'); });

  /* ---------- Fechas ---------- */
  const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const MESL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const dt = s => new Date(s + 'T12:00:00');
  const fmt = s => { const d = dt(s); return `${d.getDate()} ${MES[d.getMonth()]}`; };
  const fmtL = s => { const d = dt(s); return `${DIA[d.getDay()]} ${d.getDate()} de ${MESL[d.getMonth()]}`; };
  const days = s => Math.round((dt(s) - dt(D.hoy)) / 864e5);
  const addDays = (s, n) => { const d = dt(s); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const dueChip = s => { const k = days(s); return k < 0 ? `<span class="chip bad">${ic('alert', 'sm')}Vencida hace ${-k} d</span>` : k <= 3 ? `<span class="chip warn">${ic('clock', 'sm')}Vence en ${k} d</span>` : `<span class="chip">${ic('clock', 'sm')}Vence ${fmt(s)}</span>`; };
  const gcal = (titulo, fecha, detalle) => {
    const f = fecha.replace(/-/g, ''), f2 = addDays(fecha, 1).replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&dates=${f}/${f2}&details=${encodeURIComponent(detalle)}`;
  };
  const calLink = (titulo, fecha, detalle) => `<a class="cal-link" href="${gcal(titulo, fecha, detalle)}" target="_blank" rel="noopener">${ic('cal', 'sm')}Agregar a Google Calendar</a>`;

  /* ---------- Validación de textos ---------- */
  const palabras = t => (String(t).trim().match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,}/g) || []).length;
  // Heurística del prototipo; en producción la congruencia la revisa el asistente de IA
  const sinSentido = t => { const s = String(t).toLowerCase(); return /(.)\1{4,}/.test(s) || /\b(asd|qwe|xxx|jaja|aaa|lorem)\w*/.test(s) || (s.length > 10 && !/[aeiouáéíóú]/.test(s)); };

  /* ---------- Correspondencia etapas ↔ momentos del Modelo Académico ---------- */
  const MOM_CONC = 'Momentos 4 y 5 · Control de calidad y meta-reflexión';
  const momento = (i) => i === 0 ? 'Momento 2 · Construcción dialógica' : i === 1 ? 'Momento 3 · Curaduría crítica' : 'Momento 3 · Curaduría crítica (continuación)';
  const momTag = t => `<small class="mom" title="Momento del Modelo Académico al que corresponde">${esc(t)}</small>`;

  /* ---------- Fuentes del andamiaje ---------- */
  const TIPOS = { link: 'Enlace web', norma: 'Norma o documento oficial', doc: 'Documento del docente', libro: 'Libro de biblioteca' };
  const urlOk = u => /^https?:\/\/[^\s/$.?#][^\s]*\.[^\s]+$/i.test(String(u || '').trim());
  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (err) { return u; } };
  const fuenteNombre = f => (f.titulo || '').trim() || (urlOk(f.url) ? host(f.url) : f.archivo || (f.ref || '').trim() || 'Fuente sin datos');
  const fuenteHTML = f => {
    const n = esc(fuenteNombre(f)), icn = ic(f.tipo === 'doc' ? 'file' : f.tipo === 'libro' ? 'list' : 'link', 'sm');
    const main = urlOk(f.url) ? `<a href="${esc(f.url.trim())}" target="_blank" rel="noopener noreferrer">${n}</a>` : f.archivo ? `<a href="#" data-act="descargarFuente">${n}</a>` : `<span>${n}</span>`;
    const meta = [(f.autor || '').trim(), TIPOS[f.tipo], f.tipo === 'libro' && f.titulo ? (f.ref || '').trim() : ''].filter(Boolean).map(esc).join(' · ');
    return `<span class="fuente">${icn}<span>${main}${meta ? `<small>${meta}</small>` : ''}</span></span>`;
  };
  const fuenteValida = f => f.tipo === 'doc' ? !!f.archivo : f.tipo === 'libro' ? !!((f.ref || '').trim() || (f.titulo || '').trim()) : urlOk(f.url);

  /* ---------- Estado ---------- */
  const etapaN = (nombre, fecha, first) => ({ nombre, fecha, entregable: '', instrucciones: '', preguntas: first ? ['¿Qué entendiste del reto con tus propias palabras?', '¿Qué necesitas investigar para resolverlo?', '¿Qué harás en esta etapa?'] : ['¿Qué cambiaste a partir de la retroalimentación?'] });
  const itemN = f => ({ titulo: '', tipoReto: 'Situado', desc: '', proposito: '', producto: '', organizacion: 'Individual', integrantes: '3', criterios: '', fuentes: [{ tipo: 'link', url: '', titulo: '', autor: '', ref: '', archivo: '' }], ia: '', ejemplo: '',
    ejesDec: {}, ejes: {}, open: new Set([0]), defensa: { fecha: addDays(f, 75), hora: '10:00', lugar: '' },
    etapas: [etapaN('Comprender y explorar', f, true), etapaN('Mejora y adapta', addDays(f, D.diasRecomendadosEtapa))] });
  const S = { role: 'est', view: 'trayecto', arg: null, stage: 2, open: new Set([5]), sent2: false, reviewing: null,
    periodo: D.periodo, matSel: 'todas', revMat: 'todas', unidad: D.miUnidad,
    nuevo: { materia: '5.2-5A', otros: new Set(['5.2-5B']), modo: 'integrador', act: 0, numActs: 1, invitar: '',
      integr: [itemN('2026-11-03')], acts: [itemN('2026-08-25'), itemN('2026-09-24'), itemN('2026-10-24')],
      compartido: [{ m: '5.3 Calidad de los Procesos · 5A', d: 'Mtra. Laura Gómez Ruiz', e: 'Aceptada' }, { m: '5.6 Taller de Desarrollo · 5A', d: 'Ing. Pablo Torres Díaz', e: 'Pendiente' }] } };

  /* ---------- Utilidades de interfaz ---------- */
  function toast(m) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2800); }
  function modal(html, cls = '') { $('#modalRoot').innerHTML = `<div class="ov" data-act="closeOv"><div class="modal ${cls}" role="dialog" aria-modal="true">${html}</div></div>`; }
  const closeModal = () => { $('#modalRoot').innerHTML = ''; };
  const tip = (texto) => `<span class="tip" tabindex="0" role="note" aria-label="${esc(texto)}" data-tip="${esc(texto)}">${ic('info', 'sm')}</span>`;

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
  const matLabel = m => `${m.c} ${m.n} · ${m.g}`;

  /* =========================================================
     BARRA LATERAL
     ========================================================= */
  function semStats(s) { let d = 0, t = 0; s.materias.forEach(m => { d += m[2][0]; t += m[2][1]; }); return [d, t]; }
  function sideEst() {
    const tab = S.sideTab || 'tray';
    const semDone = D.semestres.filter(s => s.estado === 'done').length;
    const cur = D.semestres.find(s => s.estado === 'now'); const [cd, ct] = semStats(cur);
    const pct = Math.round(((semDone + cd / ct) / 8) * 100);
    const outline = D.semestres.map(s => {
      const [d, t] = semStats(s), open = S.open.has(s.n), lock = s.estado === 'lock';
      const items = s.materias.map(([c, n, [a, b]]) => {
        const st = a >= b ? 'done' : a > 0 || s.estado === 'now' ? 'prog' : '';
        const cur = S.view === 'materia' && S.arg === c;
        return `<li><button class="item" data-go="materia" data-arg="${c}" ${cur ? 'aria-current="true"' : ''}>
          <span class="st ${st}" style="--p:${Math.round(a / b * 100)}%">${st === 'done' ? ic('check') : ''}</span>
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
      <div><h4>Etapa ${e.n} · ${esc(e.nombre)}</h4><p>5.2 · Sistema de control de acceso</p>${e.estado !== 'done' ? calLink(`Entrega etapa ${e.n} · ${D.reto.titulo}`, e.entrega, 'Plataforma de Agencia Cognitiva UNACH') : ''}</div>${e.estado === 'done' ? '<span class="chip ok">Cumplida</span>' : dueChip(e.entrega)}</div>`).join('')
      + `<div class="due"><div class="d"><b>${dt(D.reto.defensa.fecha).getDate()}</b><span>${MES[dt(D.reto.defensa.fecha).getMonth()]}</span></div><div><h4>Defensa oral</h4><p>${esc(D.reto.defensa.hora)} · ${esc(D.reto.defensa.lugar)}</p>${calLink('Defensa oral · ' + D.reto.titulo, D.reto.defensa.fecha, D.reto.defensa.lugar)}</div><span class="chip">${ic('mic', 'sm')}Programada</span></div>`
      + `<p class="small muted" style="margin:14px 0 0">Recibirás un correo institucional 3 días antes de cada fecha.</p>`;
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
    const actual = S.periodo === D.periodo;
    const nav = [['doc-home', 'board', 'Panel', ''], ['doc-reto', 'plus', 'Nuevo reto', ''], ['doc-rev', 'msg', 'Revisiones pendientes', D.pendientes.length], ['doc-def', 'mic', 'Defensas orales', D.defensas.filter(d => !d.hecha).length]];
    return `<div class="side-period"><label class="flab" for="perSel">Periodo</label>
        <select id="perSel" class="in" data-change="periodo">${D.periodos.map(x => `<option value="${x.k}" ${x.k === S.periodo ? 'selected' : ''}>${x.n}${x.actual ? ' (actual)' : ''}</option>`).join('')}</select></div>
      <div class="outline">
      ${actual ? `<div class="mod open"><div class="mod-h" style="cursor:default"><span><b>Docencia</b><small>${D.periodos[0].n}</small></span><span></span><span></span></div>
      <ul class="items">${nav.map(([v, i, t, n]) => `<li><button class="item" data-go="${v}" ${S.view === v ? 'aria-current="true"' : ''} style="grid-template-columns:24px 1fr auto"><span>${ic(i, 'sm')}</span><span>${t}</span><span class="cnt">${n}</span></button></li>`).join('')}</ul></div>
      <div class="mod open"><div class="mod-h" style="cursor:default"><span><b>Mis materias</b><small>Cada grupo es independiente · máximo ${D.maxCedulasPorMateria} cédulas</small></span><span></span><span></span></div>
      <ul class="items"><li><button class="item" data-act="matSel" data-arg="todas" ${S.matSel === 'todas' && S.view === 'doc-home' ? 'aria-current="true"' : ''} style="grid-template-columns:24px 1fr"><span>${ic('layers', 'sm')}</span><span>Todas mis materias</span></button></li>
      ${D.materiasDocente.map(m => `<li><button class="item" data-act="matSel" data-arg="${m.id}" ${S.matSel === m.id && S.view === 'doc-home' ? 'aria-current="true"' : ''} style="grid-template-columns:24px 34px 1fr auto"><span class="st ${m.usadas ? 'prog' : ''}" style="--p:${m.usadas / D.maxCedulasPorMateria * 100}%"></span><span class="code">${m.c}</span><span>${esc(m.n)}<br><span class="small muted">Grupo ${m.g} · ${m.alumnos} alumnos</span></span><span class="cnt">${m.usadas}/${D.maxCedulasPorMateria}</span></button></li>`).join('')}</ul></div>`
      : `<div class="mod open"><div class="mod-h" style="cursor:default"><span><b>Historial</b><small>Consulta de solo lectura</small></span><span></span><span></span></div>
         <ul class="items"><li><button class="item" data-go="doc-home" aria-current="true" style="grid-template-columns:24px 1fr"><span>${ic('list', 'sm')}</span><span>Retos del periodo</span></button></li></ul></div>`}
      </div>
      <div class="cert"><span class="lk">${ic('award')}</span><span class="caps">Carta de cumplimiento docente</span>
        <b>Revisiones a tiempo en el periodo</b><span class="bar" style="display:block"><i style="width:${p}%"></i></span>
        <small><span>${c.aTiempo} de ${c.total}</span><span>${p}%</span></small></div>`;
  }
  function sideAut() {
    const nav = [['aut-home', 'chart', 'Ranking institucional'], ['aut-unidad', 'layers', 'Mi unidad académica']];
    return `<div class="outline" style="padding-top:10px"><div class="mod open"><div class="mod-h" style="cursor:default"><span><b>Indicadores</b><small>Periodo ${D.periodo}</small></span><span></span><span></span></div>
      <ul class="items">${nav.map(([v, i, t]) => `<li><button class="item" data-go="${v}" ${S.view === v ? 'aria-current="true"' : ''} style="grid-template-columns:24px 1fr"><span>${ic(i, 'sm')}</span><span>${t}</span></button></li>`).join('')}</ul></div>
      <div style="padding:16px" class="small muted">Los indicadores miden el cumplimiento del proceso, no calificaciones. El detalle por persona solo es visible para las áreas autorizadas.</div></div>`;
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
      <div class="ph"><div><h1>Hola, Ana</h1><p>Quinto semestre · ${esc(D.estudiante.programa)} · ${esc(D.estudiante.unidad)}</p></div>
        <button class="btn btn-p" data-go="cedula">Continuar cédula ${ic('right', 'sm')}</button></div>
      <div class="note navy first">${ic('info', 'sm')}<span>¿Primera vez en la plataforma? Revisa la <button class="lnk" data-go="guia">guía y el glosario</button> antes de empezar tu cédula.</span></div>
      <div class="card">
        <div class="between"><div><h3>Trayecto acumulativo</h3><div class="sub">Cada semestre suma sus materias (5.1 a 5.6). Elige un semestre para ver sus materias y retos.</div></div>
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
        <div class="tbl"><table style="margin-top:8px"><thead><tr><th>Materia</th><th>Cédulas</th><th style="width:34%">Avance</th><th></th></tr></thead><tbody>
        ${cur.materias.map(([c, n, [a, b]]) => `<tr><td><b>${c}</b> ${esc(n)}</td><td>${a} de ${b}</td><td><div class="bar gold"><i style="width:${a / b * 100}%"></i></div></td>
          <td style="text-align:right"><button class="btn btn-o btn-s" data-go="materia" data-arg="${c}">Abrir</button></td></tr>`).join('')}</tbody></table></div></div>
    </div>`;
  };

  V.materia = () => {
    const sem = D.semestres.find(s => s.materias.some(m => m[0] === S.arg));
    const [c, n, [a, b]] = sem.materias.find(m => m[0] === S.arg);
    const isMain = c === '5.2', done = a >= b && sem.estado === 'done';
    const ced1 = isMain ? `<div class="card ced">
        <div><div class="row"><span class="chip ink">Cédula 1</span><span class="chip gold">${esc(D.reto.tipo)}</span><span class="chip">${ic('link', 'sm')}Proyecto compartido</span></div>
          <h3>${esc(D.reto.titulo)}</h3><div class="sub">${esc(D.reto.docente)} · Grupo ${D.reto.grupo} · ${D.etapas.length} etapas</div>
          <div class="shared">${D.reto.compartido.map(([m, d]) => `<span>${ic('link', 'sm')}${esc(m)} · ${esc(d)}</span>`).join('')}</div>
          <div class="stg">${D.etapas.map(e => `<i class="${e.estado === 'done' ? 'd' : e.estado === 'cur' ? 'p' : ''}"></i>`).join('')}</div></div>
        <button class="btn btn-p" data-go="cedula">Continuar ${ic('right', 'sm')}</button></div>
      <div class="card ced"><div><div class="row"><span class="chip">Cédula 2</span><span class="chip">Actividad de aprendizaje</span></div>
          <h3>Optimización de consultas sobre datos institucionales</h3><div class="sub">Inicia el 3 de noviembre</div><div class="stg"><i></i><i></i><i></i></div></div>
        <span class="chip">${ic('lock', 'sm')}Por iniciar</span></div>`
      : `<div class="card ced"><div><div class="row"><span class="chip ink">Cédula 1</span><span class="chip">Actividad de aprendizaje</span></div>
          <h3>${c === '4.1' ? esc(D.cedulaFinal.reto) : 'Reto de ' + esc(n)}</h3><div class="sub">${a >= b ? 'Concluida' : 'En curso'}</div><div class="stg">${[0, 1, 2].map(i => `<i class="${a >= b ? 'd' : i === 0 ? 'p' : ''}"></i>`).join('')}</div></div>
        ${done ? `<button class="btn btn-o" data-go="cedula-final" data-arg="${c}">${ic('file', 'sm')}Ver cédula y descargar PDF</button>` : `<span class="chip ${a >= b ? 'ok' : 'warn'}">${a >= b ? 'Completa' : 'En curso'}</span>`}</div>`;
    const libres = Math.max(0, D.maxCedulasPorMateria - b);
    return `<div class="page">
      <div class="crumb"><button data-go="trayecto">Mi trayecto</button>${ic('right')}Semestre ${sem.n}${ic('right')}${c}</div>
      <div class="ph"><div><h1>${c} · ${esc(n)}</h1><p>${a} de ${b} cédulas completas</p></div></div>
      ${ced1}
      ${libres && sem.estado === 'now' ? `<div class="slot" style="margin-top:14px">${ic('layers')}Tu docente puede asignar hasta ${libres} cédula${libres > 1 ? 's' : ''} más en este periodo (máximo ${D.maxCedulasPorMateria} por materia).</div>` : ''}
    </div>`;
  };

  /* ----- Cédula por etapas ----- */
  V.cedula = () => {
    const st = D.etapas.map(e => {
      const sent = e.n === 2 && S.sent2;
      const cls = e.estado === 'done' || sent ? 'done' : e.estado === 'cur' ? 'cur' : '';
      return `<button class="step ${cls}" data-act="stage" data-arg="${e.n}" ${S.stage === e.n ? 'aria-current="true"' : ''}>
        <span class="c">${cls === 'done' ? ic('check', 'sm') : e.n}</span><b>${esc(e.nombre)}</b>${momTag(e.n === D.etapas.length ? MOM_CONC : momento(e.n - 1))}
        <small>${e.estado === 'done' ? 'Revisada · ' + fmt(e.revision) : sent ? 'En revisión' : e.estado === 'next' ? 'Bloqueada' : 'Entrega ' + fmt(e.entrega)}</small></button>`;
    }).join('');
    const body = [null, stage1, stage2, stage3][S.stage]();
    const e = D.etapas[S.stage - 1];
    const R = D.reto;
    return `<div class="page">
      <div class="crumb"><button data-go="trayecto">Mi trayecto</button>${ic('right')}<button data-go="materia" data-arg="5.2">5.2 Tópicos Avanzados de Bases de Datos</button>${ic('right')}Cédula 1</div>
      <div class="ph"><div><h1>${esc(R.titulo)}</h1><p>Cédula de Rastro Intelectual · ${esc(R.tipo)} · ${esc(R.docente)}</p></div>
        <span class="saved">Guardado automáticamente</span></div>
      <details class="card guide"><summary><span><span class="caps muted">Guía del reto</span><b>Propósito, producto esperado y criterios</b>${momTag('Momento 1 · Lanzamiento y andamiaje pedagógico')}</span>${ic('chev', 'sm')}</summary>
        <div class="ejes-chips"><span class="chip ink">Reto ${esc(R.tipoReto.toLowerCase())}</span><span class="chip gold">Adopción crítica de la IA</span>${Object.entries(R.ejes).map(([k, e]) => `<span class="chip ${e.aplica ? 'gold' : ''}">${esc(k)}${e.aplica ? '' : ' · no aplica'}</span>`).join('')}</div>
        <dl class="kv">${[['Propósito', R.guia.proposito], ['Producto esperado', R.guia.producto], ['Organización', R.guia.organizacion], ['Criterios', R.guia.criterios], ...Object.entries(R.ejes).map(([k, e]) => [k, (e.aplica ? '' : 'No aplica: ') + e.texto])].map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}
          <dt>Fuentes obligatorias (andamiaje)</dt><dd><ol class="fuentes">${R.andamiaje.map(f => `<li>${fuenteHTML(f)}</li>`).join('')}</ol></dd></dl>
        <p class="small muted" style="margin:12px 0 0">Proyecto integrador compartido con ${R.compartido.map(([m, d]) => `${esc(m)} (${esc(d)})`).join(' y ')}. <b>Lo llenas una sola vez:</b> tu avance se refleja en la cédula de cada materia.</p></details>
      <div class="stepper">${st}</div>
      <div class="ced-grid"><div>${body}
        <div class="nav-pn"><button class="btn btn-o" data-act="stage" data-arg="${Math.max(1, S.stage - 1)}" ${S.stage === 1 ? 'disabled' : ''}>${ic('left', 'sm')}Etapa anterior</button>
          <button class="btn btn-o" data-act="stage" data-arg="${Math.min(3, S.stage + 1)}" ${S.stage === 3 ? 'disabled' : ''}>Etapa siguiente ${ic('right', 'sm')}</button></div></div>
        <aside class="aside">
          <div class="card"><span class="caps muted">Etapa ${e.n}</span><h3 style="margin-top:6px">${esc(e.nombre)}</h3>${momTag(e.n === D.etapas.length ? MOM_CONC : momento(e.n - 1))}
            <dl class="kv" style="margin-top:12px"><dt>Tu entrega</dt><dd>${fmtL(e.entrega)}</dd><dt>Revisión docente</dt><dd>a más tardar ${fmt(e.revision)}</dd></dl>
            ${e.estado === 'cur' && !S.sent2 ? `<div style="margin-top:12px">${dueChip(e.entrega)}</div><div style="margin-top:10px">${calLink(`Entrega etapa ${e.n} · ${R.titulo}`, e.entrega, 'Plataforma de Agencia Cognitiva UNACH')}</div>` : ''}</div>
          <div class="card"><h3 style="font-size:15px">Uso de IA en este reto</h3><p class="small" style="margin:8px 0 0">${esc(R.criteriosIA)}</p></div>
          <div class="note navy">${ic('lock', 'sm')}<span>Copiar y pegar está desactivado en tus retos. Escribe con tus propias palabras: es parte de tu rastro intelectual.</span></div>
          <div class="note navy">${ic('eye', 'sm')}<span>Tu docente puede apoyarse en el asistente de IA de la UNACH para revisar tu entrega. Puedes solicitar revisión humana de cualquier retroalimentación.</span></div>
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
      <div class="card"><h3>Fuentes base del andamiaje</h3><div class="sub">Cómo usaste cada fuente obligatoria que definió tu docente.</div>
        ${D.reto.andamiaje.map((f, i) => `<div class="fb-src">${fuenteHTML(f)}</div>${field('¿Cómo la usaste?', `fuentesBase.${i}`, { ro: true, rows: 2 })}`).join('')}</div>
      <div class="card"><h3>Propuesta inicial</h3>${field('Tu primera idea, antes de investigar', 'propuesta', { ro: true, req: false })}</div>
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
      <div class="card"><div class="between"><h3>Evidencia del avance</h3>${ro ? '<span class="chip warn">En revisión</span>' : ''}</div>
        <div class="sub">El trabajo completo se entrega en clase; aquí solo una evidencia breve. Máximo 2 MB.</div>
        ${C.avance2 ? `<div class="upload ok">${ic('file', 'lg')}<div><b>Avance_2_modelo_datos.pdf</b><div class="small muted">1.4 MB</div></div></div>`
          : `<div class="upload">${ic('upload', 'lg')}<div style="flex:1"><b>Sube tu evidencia</b><div class="small muted">PDF o imagen · máximo 2 MB</div></div><button class="btn btn-g btn-s" data-act="upload2">Seleccionar archivo</button></div>`}
        ${ro ? `<div class="note" style="margin-top:14px">${ic('clock', 'sm')}<span>Entregada. Tu docente tiene hasta el ${fmtL(D.etapas[1].revision)} para revisarla. Si pide correcciones, tendrás ${D.diasCorreccion} días para volver a entregar.</span></div>`
          : `<div class="between" style="margin-top:16px"><span class="small muted">Al enviar, la etapa queda en revisión. La siguiente se abre cuando tu docente la revise.</span><button class="btn btn-p" data-act="send2">Enviar etapa 2</button></div>`}</div>`;
  }
  function stage3() {
    const R = D.reto;
    return `<div class="locked">${ic('lock', 'lg')}<div><b>Se habilita cuando tu docente revise la etapa 2</b><div class="small">Así cada etapa tiene su tiempo: el aprendizaje necesita respirar. Entrega prevista: ${fmtL(D.etapas[2].entrega)}.</div></div></div>
      <div class="card" style="margin-top:14px;opacity:.75"><h3>Lo que registrarás en la conclusión</h3>
        <p class="small muted" style="margin:6px 0 0">Matriz de impacto: revisarás tu propuesta frente a los cuatro ejes, como pide el Modelo Académico.</p>
        <div class="axes">${[['Adopción crítica de la IA', { aplica: true, texto: 'Explica cómo usaste la IA y cómo mantuviste tu propio juicio.' }], ...Object.entries(R.ejes)].map(([k, e]) => `<div class="${e.aplica ? '' : 'na'}"><h4>${esc(k)}${e.aplica ? '' : ' <span class="chip">No aplica</span>'}</h4><p class="small muted" style="margin:0">${e.aplica ? '¿Cómo lo hiciste? ' + esc(e.texto) : 'Justificación del docente: ' + esc(e.texto) + ' Si tu solución sí tuvo relación con este eje, puedes comentarlo.'}</p></div>`).join('')}</div>
        <ul class="small" style="margin:14px 0 0;padding-left:18px;line-height:1.8"><li><b>Gestión de riesgos y justificación:</b> si tu solución tiene un impacto no deseado en algún eje, reconócelo y explica por qué la mantuviste</li><li>Declaración de soberanía intelectual (declaración de uso de IA)</li><li>¿Qué aprendiste? En tus propias palabras</li><li>Al cerrar el reto se genera tu cédula en PDF con fecha y hora</li></ul></div>
      <div class="card"><div class="row" style="gap:14px;align-items:flex-start;flex-wrap:nowrap">${ic('mic', 'lg')}<div><h3>Defensa oral</h3>
        <p class="small" style="margin:6px 0 0">${fmtL(R.defensa.fecha)}, ${esc(R.defensa.hora)} h · ${esc(R.defensa.lugar)}</p>
        <p class="small muted" style="margin:6px 0 0">Al concluir, imprime tu cédula y preséntala en tu defensa oral. Tu docente registrará que se realizó.</p>
        <div style="margin-top:8px">${calLink('Defensa oral · ' + R.titulo, R.defensa.fecha, R.defensa.lugar)}</div></div></div></div>`;
  }

  /* ----- Cédula concluida e impresión ----- */
  V['cedula-final'] = () => {
    const F = D.cedulaFinal, now = new Date();
    const gen = `${now.getDate()} de ${MESL[now.getMonth()]} de ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} h`;
    return `<div class="page">
      <div class="crumb no-print"><button data-go="trayecto">Mi trayecto</button>${ic('right')}<button data-go="materia" data-arg="4.1">4.1 Programación Web</button>${ic('right')}Cédula concluida</div>
      <div class="ph no-print"><div><h1>Cédula concluida</h1><p>Descárgala en PDF para tu defensa oral o tu expediente.</p></div>
        <button class="btn btn-p" data-act="print">${ic('print', 'sm')}Descargar PDF</button></div>
      <article class="card print-area">
        <header class="pdf-h"><img src="assets/img/unach-logo.png" alt="" width="70"><div><span class="caps">Benemérita Universidad Autónoma de Chiapas</span><h2>Cédula de Rastro Intelectual</h2><p class="small muted">Folio ${esc(D.reto.id.replace('0142', '0087'))}-${esc(D.estudiante.matricula)}</p>${momTag('Momento 6 · Cédula de rastro intelectual y evaluación')}</div></header>
        <dl class="kv pdf-kv"><dt>Estudiante</dt><dd>${esc(D.estudiante.nombre)} · ${esc(D.estudiante.matricula)}</dd><dt>Materia</dt><dd>${esc(F.materia)} · Grupo ${esc(F.grupo)}</dd><dt>Docente</dt><dd>${esc(F.docente)}</dd><dt>Periodo</dt><dd>${esc(F.periodo)}</dd>
          <dt>Reto</dt><dd>${esc(F.reto)} (${esc(F.tipoReto.toLowerCase())})</dd><dt>Ejes</dt><dd>${F.ejes.map(esc).join(' · ')}</dd></dl>
        <h3 class="pdf-sec">Etapas</h3><div class="tbl"><table><thead><tr><th>Etapa</th><th>Entrega</th><th>Estado</th></tr></thead><tbody>${F.etapas.map(([n, f, e]) => `<tr><td>${esc(n)}</td><td>${fmtL(f)}</td><td>${esc(e)}</td></tr>`).join('')}</tbody></table></div>
        <h3 class="pdf-sec">¿Qué aprendí?</h3><p>${esc(F.aprendi)}</p>
        <h3 class="pdf-sec">Defensa oral</h3><p>${esc(F.defensa)}</p>
        <footer class="pdf-f"><span>Generado el ${gen}</span><span>Documento generado por la Plataforma de Agencia Cognitiva UNACH</span></footer>
      </article></div>`;
  };

  V.constancia = () => `<div class="page"><div class="crumb"><button data-go="trayecto">Mi trayecto</button>${ic('right')}Constancia</div>
    <div class="ph"><div><h1>Constancia de Agencia Cognitiva</h1><p>Se emite al completar las cédulas de los ocho semestres.</p></div></div>
    <div class="card"><div class="track">${D.semestres.map(s => `<div class="sem ${s.estado === 'now' ? 'now' : ''} ${s.estado === 'lock' ? 'lock' : ''}"><span class="n">${s.n}</span><small>${s.estado === 'done' ? 'Completado' : s.estado === 'now' ? 'En curso' : 'Pendiente'}</small></div>`).join('')}</div>
      <div class="locked" style="margin-top:16px">${ic('award', 'lg')}<div><b>Constancia bloqueada</b><div class="small">Faltan 4 semestres. Al desbloquearse podrás descargarla en PDF con folio de verificación.</div></div></div></div></div>`;

  V.guia = () => `<div class="page"><div class="crumb">Ayuda</div><div class="ph"><div><h1>Guía de uso</h1><p>Cómo funciona la plataforma. La explicación completa del modelo está en <a href="modelo.html">Conoce el modelo</a>.</p></div></div>
    <div class="card video"><div class="video-ph">${ic('play', 'lg')}<div><b>Video de bienvenida</b><p class="small muted" style="margin:4px 0 0">Recorrido de 3 minutos por la plataforma (se incrustará desde YouTube).</p></div></div></div>
    <div class="grid3" style="margin-top:14px">${[['1', 'Tu docente publica el reto', 'Indica si es un proyecto integrador o actividades de aprendizaje, y calendariza al menos dos etapas.'],
      ['2', 'Entregas por etapa', 'En cada etapa registras tu proceso. La siguiente se abre cuando tu docente revisa la anterior.'],
      ['3', 'Concluyes y defiendes', 'Cierras con lo que aprendiste, descargas tu cédula en PDF y la presentas en tu defensa oral.']]
      .map(([n, t, d]) => `<div class="card"><span class="serif" style="font-size:34px;color:var(--gold);font-weight:300">${n}</span><h3 style="margin-top:6px">${t}</h3><p class="small muted" style="margin:6px 0 0">${d}</p></div>`).join('')}</div>
    <div class="grid2" style="margin-top:14px">
      <div class="card"><h3>Glosario</h3><dl class="glos">${D.glosario.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join('')}</dl></div>
      <div class="card"><h3>Ejes transversales</h3>${Object.entries(D.ejes).map(([k, v]) => `<div class="entry"><b class="small">${esc(k)}</b><p class="small" style="margin:6px 0 0">${esc(v.def)}</p><p class="small muted" style="margin:6px 0 0">${esc(v.ej)}</p></div>`).join('')}
        <h3 style="margin-top:20px">Ejemplos de retos</h3>${D.ejemplosRetos.map(([t, a, d]) => `<div class="entry"><div class="row"><span class="chip gold">${esc(t)}</span><span class="small muted">${esc(a)}</span></div><p class="small" style="margin:8px 0 0">${esc(d)}</p></div>`).join('')}</div>
    </div></div>`;

  /* =========================================================
     VISTAS · DOCENTE
     ========================================================= */
  const IT = () => S.nuevo.modo === 'integrador' ? S.nuevo.integr[0] : S.nuevo.acts[S.nuevo.act];
  const minPreg = i => i === 0 ? 3 : 1;
  const seg = (act, opts, val) => `<div class="seg" role="group">${opts.map(([v, t]) => `<button type="button" data-act="${act}" data-arg="${v}" aria-pressed="${val === v}">${t}</button>`).join('')}</div>`;
  const wc = (v, largo) => largo ? `<span class="wc ${palabras(v) >= D.minPalabras && !sinSentido(v) ? 'ok' : ''}" data-wc>${palabras(v)} palabras · mínimo ${D.minPalabras}</span>` : '';
  const nb = (label, path, o = {}) => {
    const v = path.split('.').reduce((a, k) => a?.[k], IT());
    const el = o.area ? `<textarea class="in" data-nb="${path}" ${o.largo ? 'data-largo="1"' : ''} rows="${o.rows || 2}" placeholder="${esc(o.ph || '')}">${esc(v)}</textarea>`
      : `<input class="in" data-nb="${path}" value="${esc(v)}" placeholder="${esc(o.ph || '')}" ${o.type ? `type="${o.type}"` : ''}>`;
    return `<label class="f"><span class="${o.req ? 'req' : ''}">${label}${o.hint ? ` <em>· ${o.hint}</em>` : ''}${o.tip ? tip(o.tip) : ''}</span>${el}${wc(v, o.largo)}</label>`;
  };
  const matsFiltradas = () => S.matSel === 'todas' ? D.materiasDocente : D.materiasDocente.filter(m => m.id === S.matSel);
  const pendFiltradas = () => S.matSel === 'todas' ? D.pendientes : D.pendientes.filter(p => `${p.m}-${p.g}` === S.matSel);

  V['doc-home'] = () => {
    const per = D.periodos.find(p => p.k === S.periodo);
    if (!per.actual) {
      const h = D.historialDocente[S.periodo] || [];
      return `<div class="page"><div class="crumb">Historial</div>
        <div class="ph"><div><h1>${esc(per.n)}</h1><p>Consulta de solo lectura de un periodo concluido.</p></div><button class="btn btn-o" data-act="volverActual">${ic('undo', 'sm')}Volver al periodo actual</button></div>
        <div class="card"><div class="tbl"><table><thead><tr><th>Materia</th><th>Reto</th><th>Tipo</th><th>Resultado</th></tr></thead><tbody>
        ${h.map(([m, t, ti, r]) => `<tr><td>${esc(m)}</td><td><b>${esc(t)}</b></td><td><span class="chip">${esc(ti)}</span></td><td>${esc(r)}</td></tr>`).join('') || '<tr><td colspan="4" class="muted">Sin registros.</td></tr>'}</tbody></table></div>
        <p class="small muted" style="margin:14px 0 0">Los retos no se copian automáticamente al nuevo periodo: cada semestre se capturan de nuevo para mantenerlos actualizados.</p></div></div>`;
    }
    const mats = matsFiltradas(), pend = pendFiltradas(), sel = S.matSel === 'todas' ? null : mats[0];
    const ent = mats.reduce((a, m) => [a[0] + m.entregas[0], a[1] + m.entregas[1]], [0, 0]);
    const inv = D.invitaciones.filter(i => i.estado === 'pendiente');
    const k = days(D.limitePublicacion);
    return `<div class="page">
    <div class="crumb">Panel docente</div>
    <div class="ph"><div><h1>${sel ? esc(matLabel(sel)) : 'Panel docente'}</h1><p>${sel ? `${sel.alumnos} alumnos · Periodo ${esc(per.n)}` : `Todas mis materias · ${D.materiasDocente.length} grupos · Periodo ${esc(per.n)}`}</p></div><button class="btn btn-p" data-go="doc-reto">${ic('plus', 'sm')}Nuevo reto</button></div>
    <div class="scope"><span class="small muted">Mostrando:</span>${seg('matSel', [['todas', 'Todas'], ...D.materiasDocente.map(m => [m.id, `${m.c} · ${m.g}`])], S.matSel)}</div>
    <div class="grid4">
      <div class="card kpi"><b>${pend.length}</b><span>Revisiones pendientes${sel ? '' : ' en todas tus materias'}</span></div>
      <div class="card kpi"><b>${pend.filter(p => days(p.vence) < 0).length}</b><span>Revisiones vencidas</span></div>
      <div class="card kpi"><b>${ent[0]}/${ent[1]}</b><span>Entregas de la etapa en curso${sel ? ` · grupo ${sel.g}` : ''}</span></div>
      <div class="card kpi"><b>${sel ? `${sel.usadas}/${D.maxCedulasPorMateria}` : mats.reduce((a, m) => a + m.usadas, 0)}</b><span>${sel ? 'Cédulas usadas en este grupo' : 'Cédulas asignadas en el periodo'}</span></div></div>
    <div class="note ${k < 0 ? '' : 'navy'}" style="margin-top:14px">${ic('cal', 'sm')}<span>Fecha límite para publicar retos: <b>${fmtL(D.limitePublicacion)}</b> (un mes después del inicio del periodo). Si un grupo no tiene retos publicados, la plataforma lo notifica a la dirección de la unidad académica. <b>Sus grupos: al corriente.</b></span></div>
    ${inv.map((v, i) => `<div class="card invite" style="margin-top:14px">
        <span class="ri">${ic('link')}</span><div><span class="caps muted">Invitación de colaboración</span><p style="margin:4px 0 0"><b>${esc(v.de)}</b> (${esc(v.m)}) le invita a compartir el proyecto <b>${esc(v.reto)}</b>.</p></div>
        <div class="row"><button class="btn btn-o btn-s" data-act="inviteAns" data-arg="${i}:rechazada">Rechazar</button><button class="btn btn-p btn-s" data-act="inviteAns" data-arg="${i}:aceptada">Aceptar</button></div></div>`).join('')}
    <div class="grid2" style="margin-top:14px">
      <div class="card"><div class="between"><h3>Por revisar</h3><button class="btn btn-o btn-s" data-go="doc-rev">Ver todas</button></div>
        ${pend.length ? `<ul class="list-pend" style="margin-top:8px">${pend.map(p => { const i = D.pendientes.indexOf(p); return `<li><span class="av">${p.n.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
          <span><b class="small">${esc(p.n)}</b><br><span class="small muted">${p.m} · Grupo ${p.g} · ${esc(p.etapa)}</span></span>${dueChip(p.vence)}
          <button class="btn btn-o btn-s" data-go="doc-rev" data-arg="${i}">Revisar</button></li>`; }).join('')}</ul>` : '<p class="small muted" style="margin:12px 0 0">Sin revisiones pendientes en este grupo.</p>'}</div>
      <div class="card"><h3>Retos publicados</h3>${(sel && sel.usadas === 0 ? [] : D.retosDocente).map(r => `<div class="entry"><div class="between"><span class="chip gold">${esc(r.tipo)}</span><span class="small muted">Grupos ${esc(r.grupos)} · ${esc(r.etapa)}</span></div>
          <p style="margin:8px 0 10px;font-weight:600">${esc(r.t)}</p><div class="bar"><i style="width:${r.entregas[0] / r.entregas[1] * 100}%"></i></div>
          <p class="small muted" style="margin:6px 0 0">${r.entregas[0]} de ${r.entregas[1]} entregas</p></div>`).join('') || '<p class="small muted" style="margin:12px 0 0">Este grupo aún no tiene retos publicados.</p>'}
        <div class="note" style="margin-top:14px">${ic('clock', 'sm')}<span>Tiene ${D.diasRevisionDocente} días después de cada entrega para revisarla. Las revisiones a tiempo cuentan para su carta de cumplimiento.</span></div></div>
    </div></div>`;
  };

  function stageBlock(e, i, it) {
    const open = it.open.has(i), min = minPreg(i), nE = it.etapas.length;
    const nq = e.preguntas.filter(q => q.trim()).length;
    return `<div class="stage ${open ? 'open' : ''}">
      <div class="stage-row"><span class="n">${i + 1}</span>
        <div class="nm"><input class="in" data-nb="etapas.${i}.nombre" value="${esc(e.nombre)}" aria-label="Nombre de la etapa ${i + 1}">${momTag(momento(i))}</div>
        <input class="in" type="date" data-nb="etapas.${i}.fecha" data-rerender="1" value="${e.fecha}" aria-label="Fecha de entrega">
        <span class="auto">Revisar a más tardar<br><b>${fmt(addDays(e.fecha, D.diasRevisionDocente))}</b></span>
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

  function fuentesBlock(it) {
    const n = it.fuentes.length;
    return `<div class="f fuentes-ed"><span class="flab req">Fuentes obligatorias (andamiaje)</span>
      <p class="small muted" style="margin:0 0 6px">De preferencia agregue un <b>enlace</b>. El título y el autor son opcionales: si no los escribe, se muestra el sitio del enlace.</p>
      ${it.fuentes.map((f, i) => `<div class="fuente-row">
        <select class="in" data-fsel="${i}" aria-label="Tipo de fuente ${i + 1}">${Object.entries(TIPOS).map(([k, t]) => `<option value="${k}" ${f.tipo === k ? 'selected' : ''}>${t}${k === 'link' ? ' (recomendado)' : ''}</option>`).join('')}</select>
        ${f.tipo === 'doc' ? (f.archivo ? `<span class="mini-file">${ic('file', 'sm')}${esc(f.archivo)}</span>` : `<button type="button" class="btn btn-o btn-s" data-act="fuenteArchivo" data-arg="${i}">${ic('upload', 'sm')}Subir archivo (máx. 2 MB)</button>`)
          : f.tipo === 'libro' ? `<input class="in" data-fnb="${i}.ref" value="${esc(f.ref)}" placeholder="Referencia o clasificación en biblioteca">`
          : `<input class="in" type="url" data-fnb="${i}.url" value="${esc(f.url)}" placeholder="https://…">`}
        <input class="in" data-fnb="${i}.titulo" value="${esc(f.titulo)}" placeholder="Título (opcional)" aria-label="Título (opcional)">
        <input class="in" data-fnb="${i}.autor" value="${esc(f.autor)}" placeholder="Autor (opcional)" aria-label="Autor (opcional)">
        <button type="button" class="xbtn" data-act="delFuente" data-arg="${i}" ${n <= 1 ? 'disabled' : ''} aria-label="Quitar fuente">${ic('x', 'sm')}</button>
        ${(f.tipo === 'link' || f.tipo === 'norma') && f.url && !urlOk(f.url) ? '<span class="wc">El enlace debe empezar con https:// o http://</span>' : ''}</div>`).join('')}
      <button type="button" class="btn btn-o btn-s" style="margin-top:10px" data-act="addFuente">${ic('plus', 'sm')}Agregar fuente</button></div>`;
  }

  function ejesBlock(it) {
    const otros = ['Interculturalidad', 'Sustentabilidad', 'Cultura de paz'];
    return `<div class="note navy" style="margin:4px 0 12px">${ic('info', 'sm')}<span><b>Modelo Académico (apartado 2.2.1.2):</b> los cuatro ejes son <b>filtros obligatorios de validación</b>; toda propuesta debe revisarse frente a los cuatro. Por eso cada eje debe marcarse como «Aplica» o «No aplica» con su justificación.</span></div>
      <div class="ejes">
      <div class="eje on fixed"><label><input type="checkbox" checked disabled> <b>Adopción crítica de la IA</b> <span class="chip">Siempre aplica</span>${tip(D.ejes['Adopción crítica de la IA'].def + ' ' + D.ejes['Adopción crítica de la IA'].ej)}</label>
        ${nb('¿Cómo se podrá usar la IA en este reto?', 'ia', { area: true, req: true, largo: true, ph: 'Qué sí y qué no se permite; para qué puede servir la IA' })}</div>
      ${otros.map(k => { const dec = it.ejesDec[k]; return `<div class="eje ${dec === 'si' ? 'on' : dec === 'no' ? 'na' : ''}"><div class="eje-h"><b>${k}</b>${tip(D.ejes[k].def + ' ' + D.ejes[k].ej)}
          ${seg('ejeDec', [[k + '|si', 'Aplica'], [k + '|no', 'No aplica']], dec ? k + '|' + dec : '')}</div>
        ${dec ? `<label class="f"><span class="req">${dec === 'si' ? `¿Qué incluye este reto de ${k.toLowerCase()}?` : `¿Por qué no aplica ${k.toLowerCase()} en este reto?`}</span><textarea class="in" data-eje="${k}" data-largo="1" rows="2" placeholder="${dec === 'si' ? `Qué aspecto de ${k.toLowerCase()} trabajará el estudiante` : 'Justifique brevemente, considerando el contexto del reto'}">${esc(it.ejes[k] || '')}</textarea>${wc(it.ejes[k] || '', true)}</label>
          <p class="small muted" style="margin:6px 0 0">${dec === 'si' ? 'Al concluir, el estudiante responderá: «¿Cómo lo hiciste?»' : 'La justificación será visible para el estudiante y para las autoridades académicas.'}</p>` : '<p class="small muted" style="margin:8px 0 0">Seleccione si aplica o no aplica.</p>'}</div>`; }).join('')}
      </div>`;
  }

  V['doc-reto'] = () => {
    const N = S.nuevo, it = IT(), mat = D.materiasDocente.find(m => m.id === N.materia);
    const hermanos = D.materiasDocente.filter(m => m.c === mat.c && m.id !== mat.id);
    const libres = D.maxCedulasPorMateria - mat.usadas;
    if (N.numActs > Math.max(1, libres)) N.numActs = Math.max(1, libres);
    if (N.act >= N.numActs) N.act = 0;
    const need = N.modo === 'integrador' ? 1 : N.numActs, ok = libres >= need;
    const invitables = D.docentes.filter(d => !N.compartido.some(c => c.d === d.n));
    return `<div class="page">
      <div class="crumb"><button data-go="doc-home">Panel docente</button>${ic('right')}Nuevo reto</div>
      <div class="ph"><div><h1>Nuevo reto de aprendizaje</h1><p>Defina la actividad y la guía que verán sus estudiantes.</p>${momTag('Momento 1 · Lanzamiento y andamiaje pedagógico')}</div></div>

      <div class="card"><h3>Materia y modalidad</h3>
        <div class="grid2"><label class="f"><span class="req">Materia y grupo</span><select class="in" data-change="materia">${D.materiasDocente.map(m => `<option value="${m.id}" ${m.id === N.materia ? 'selected' : ''}>${esc(matLabel(m))}</option>`).join('')}</select></label>
          <div class="f" style="align-self:end"><span class="small muted">Cédulas usadas en ${mat.c} · grupo ${mat.g}</span><div class="row" style="margin-top:6px;flex-wrap:nowrap"><div class="bar gold" style="flex:1"><i style="width:${mat.usadas / D.maxCedulasPorMateria * 100}%"></i></div><b class="small">${mat.usadas} de ${D.maxCedulasPorMateria}</b></div></div></div>
        ${hermanos.length ? `<div class="checks" style="margin-top:12px">${hermanos.map(h => `<label class="${N.otros.has(h.id) ? 'on' : ''}"><input type="checkbox" data-act="otroGrupo" data-arg="${h.id}" ${N.otros.has(h.id) ? 'checked' : ''}>Publicar también en el grupo ${h.g} <span class="small muted">· se gestiona por separado</span></label>`).join('')}</div>` : ''}
        <div class="modes">
          <button type="button" class="mode" data-act="modo" data-arg="integrador" aria-pressed="${N.modo === 'integrador'}"><span class="rad"></span><span><b>Proyecto integrador</b><span>Un proyecto que puede compartirse con otras materias y docentes. Usa 1 cédula.</span></span></button>
          <button type="button" class="mode" data-act="modo" data-arg="actividades" aria-pressed="${N.modo === 'actividades'}"><span class="rad"></span><span><b>Actividades de aprendizaje (1 a 3)</b><span>Actividades de esta materia, cada una con su propia cédula. Usa una cédula por actividad.</span></span></button></div>
        ${N.modo === 'actividades' && libres > 0 ? `<div class="row" style="margin-top:14px"><span class="small"><b>¿Cuántas actividades?</b></span>
          <div class="seg" role="group">${[1, 2, 3].map(k => `<button type="button" data-act="numActs" data-arg="${k}" aria-pressed="${N.numActs === k}" ${k > libres ? 'disabled title="No hay cédulas suficientes en este grupo"' : ''}>${k}</button>`).join('')}</div>
          <span class="small muted">Disponibles en este grupo: ${libres} de ${D.maxCedulasPorMateria}</span></div>` : ''}
        ${ok ? '' : `<div class="note" style="margin-top:14px">${ic('alert', 'sm')}<span>${libres === 0 ? 'Este grupo ya usó las 3 cédulas del periodo. Elija otra materia o grupo.' : `Solo ${libres === 1 ? 'queda 1 cédula disponible' : `quedan ${libres} cédulas disponibles`} en este grupo.`}</span></div>`}
      </div>

      ${N.modo === 'actividades' && N.numActs > 1 ? `<div class="acttabs" role="tablist">${N.acts.slice(0, N.numActs).map((a, k) => `<button type="button" role="tab" data-act="actTab" data-arg="${k}" aria-selected="${N.act === k}"><span class="st ${a.titulo.trim() ? 'done' : ''}">${a.titulo.trim() ? ic('check') : ''}</span>Cédula ${k + 1}</button>`).join('')}</div>` : ''}

      <div class="card"><h3>${N.modo === 'integrador' ? 'Datos del proyecto' : N.numActs > 1 ? `Cédula ${N.act + 1} · actividad de aprendizaje` : 'Datos de la actividad de aprendizaje'}</h3>
        ${nb('Título', 'titulo', { req: true, ph: N.modo === 'integrador' ? 'Ej. Sistema de inventario para el laboratorio de cómputo' : 'Ej. Normalización de una base de datos real' })}
        ${nb('Descripción y problemática', 'desc', { area: true, rows: 3, req: true, largo: true, ph: '¿Qué deben resolver? ¿Con qué comunidad, área o institución?' })}
      </div>

      <div class="card"><h3>Tipo de reto</h3><div class="sub">Define el enfoque y los ejes transversales que atraviesan el reto.</div>
        <label class="f"><span class="req">Enfoque</span></label>
        <div class="row">${seg('tipoReto', [['Situado', 'Situado'], ['Conceptual', 'Conceptual']], it.tipoReto)}${tip('Situado: resuelve un problema real del territorio o de una comunidad. Conceptual: profundiza, cuestiona o relaciona teorías y conceptos.')}</div>
        <label class="f"><span class="req">Ejes transversales</span></label>
        ${ejesBlock(it)}
      </div>

      <div class="card"><h3>Guía para el estudiante</h3><div class="sub">Lo que verá el estudiante al iniciar para saber cómo realizar ${N.modo === 'integrador' ? 'el proyecto' : 'la actividad'}.</div>
        <div class="grid2">${nb('Propósito de aprendizaje', 'proposito', { area: true, req: true, largo: true, ph: '¿Qué debe aprender o ser capaz de hacer?' })}
          ${nb('Producto esperado', 'producto', { area: true, req: true, largo: true, ph: 'Ej. Prototipo, documento técnico, propuesta de ley' })}</div>
        <label class="f"><span class="req">Organización</span></label>
        <div class="row">${seg('organizacion', [['Individual', 'Individual'], ['Equipo', 'En equipo']], it.organizacion)}${it.organizacion === 'Equipo' ? `<label class="row small" style="gap:8px">Integrantes por equipo <input class="in" style="width:80px" data-nb="integrantes" value="${esc(it.integrantes)}" inputmode="numeric"></label>` : ''}</div>
        <div class="grid2">${nb('Criterios de evaluación', 'criterios', { area: true, req: true, largo: true, ph: 'Qué se valorará del proceso y del producto' })}
</div>
        ${fuentesBlock(it)}
        ${nb('Ejemplo o referencia', 'ejemplo', { hint: 'opcional', ph: 'Enlace a un ejemplo o a una guía de apoyo' })}
      </div>

      ${N.modo === 'integrador' ? `<div class="card"><h3>Compartir proyecto con otros docentes</h3><div class="sub">Docentes de su mismo semestre y unidad académica. Cada materia genera su propia cédula y cada docente revisa la suya.</div>
        <div class="share">
          <div class="fld"><span class="flab">Invitar desde la plataforma</span>
            <div class="row" style="flex-wrap:nowrap"><select class="in" data-change="invitar"><option value="">Seleccione un docente</option>${invitables.map(d => `<option value="${esc(d.n)}" ${N.invitar === d.n ? 'selected' : ''}>${esc(d.n)} · ${esc(d.m)}</option>`).join('')}</select>
            <button type="button" class="btn btn-p" data-act="invite" ${N.invitar ? '' : 'disabled'}>Enviar invitación</button></div></div>
          <div class="or"><span>o</span></div>
          <div class="fld"><span class="flab">Compartir enlace de invitación</span>
            <div class="row" style="flex-wrap:nowrap"><input class="in" readonly value="https://agencia.unach.mx/invitacion/R-2026-2-0158" id="invUrl">
            <button type="button" class="btn btn-o" data-act="copyLink">${ic('link', 'sm')}Copiar</button></div></div></div>
        <div class="tbl"><table style="margin-top:18px"><thead><tr><th>Materia</th><th>Docente</th><th>Estado</th><th></th></tr></thead><tbody>
          <tr><td><b>${esc(matLabel(mat))}</b></td><td>${esc(D.docente.nombre)}</td><td><span class="chip ink">Responsable</span></td><td></td></tr>
          ${N.compartido.map((c, k) => `<tr><td>${esc(c.m)}</td><td>${esc(c.d)}</td><td><span class="chip ${c.e === 'Aceptada' ? 'ok' : 'warn'}">${c.e}</span></td>
            <td style="text-align:right;white-space:nowrap">${c.e !== 'Aceptada' ? `<button type="button" class="btn btn-o btn-s" data-act="resend" data-arg="${k}">Reenviar</button> ` : ''}<button type="button" class="btn btn-o btn-s" data-act="unshare" data-arg="${k}">Quitar</button></td></tr>`).join('')}
        </tbody></table></div></div>` : ''}

      <div class="card"><div class="between"><div><h3>Etapas y calendario</h3><div class="sub">Mínimo 2 etapas; se recomiendan ${D.diasRecomendadosEtapa} días por etapa. Tiene ${D.diasRevisionDocente} días después de cada entrega para revisar, y la siguiente etapa se abre cuando usted revisa la anterior. Use «Configurar» para las preguntas y el entregable de cada etapa. Los nombres son editables; debajo se indica el momento del Modelo Académico al que corresponde cada etapa.</div></div>
          <button type="button" class="btn btn-o btn-s" data-act="addStage">${ic('plus', 'sm')}Agregar etapa</button></div>
        <div style="margin-top:10px">${it.etapas.map((e, i) => stageBlock(e, i, it)).join('')}
          <div class="stage-row last"><span class="n">${ic('award', 'sm')}</span><span><b>Conclusión del estudiante</b><br><span class="small muted">¿Qué aprendiste? y ¿cómo trabajaste cada eje marcado? Se agrega siempre al final.</span>${momTag(MOM_CONC)}</span></div>
          <div class="stage-row defensa"><span class="n">${ic('mic', 'sm')}</span><span><b>Defensa oral</b><br><span class="small muted">Presencial, con la cédula impresa.</span>${momTag('Momento 5 · Resultado Final de Aprendizaje y defensa oral')}</span>
            <input class="in" type="date" data-nb="defensa.fecha" value="${esc(it.defensa.fecha)}" aria-label="Fecha de la defensa oral">
            <input class="in" data-nb="defensa.lugar" value="${esc(it.defensa.lugar)}" placeholder="Lugar (aula o laboratorio)" aria-label="Lugar de la defensa oral"></div></div></div>

      <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn btn-o" data-go="doc-home">Cancelar</button><button class="btn btn-o" data-act="preview">${ic('eye', 'sm')}Vista previa del estudiante</button><button class="btn btn-o" data-act="draft">Guardar borrador</button><button class="btn btn-p" data-act="publish" ${ok ? '' : 'disabled'}>Publicar ${N.modo === 'integrador' ? 'proyecto' : N.numActs === 1 ? 'actividad' : N.numActs + ' actividades'}</button></div>
    </div>`;
  };

  function previewHTML() {
    const it = IT(), N = S.nuevo, mat = D.materiasDocente.find(m => m.id === N.materia);
    const v = (x, alt = 'Sin capturar') => x && String(x).trim() ? esc(x) : `<span class="muted">${alt}</span>`;
    return `<div class="between"><span class="caps muted">Vista previa · así lo verá el estudiante</span><button class="xbtn" data-act="closeModal" aria-label="Cerrar">${ic('x', 'sm')}</button></div>
      <h3 style="margin-top:10px">${v(it.titulo, 'Título del reto')}</h3>
      <p class="small muted" style="margin:4px 0 0">${esc(matLabel(mat))} · ${esc(D.docente.nombre)} · ${N.modo === 'integrador' ? 'Proyecto integrador' : `Cédula ${N.act + 1} de ${N.numActs}`}</p>
      <div class="ejes-chips"><span class="chip ink">Reto ${esc(it.tipoReto.toLowerCase())}</span><span class="chip gold">Adopción crítica de la IA</span>${Object.entries(it.ejesDec).map(([k, v]) => `<span class="chip ${v === 'si' ? 'gold' : ''}">${esc(k)}${v === 'no' ? ' · no aplica' : ''}</span>`).join('')}</div>
      <dl class="kv" style="margin-top:12px"><dt>Descripción</dt><dd>${v(it.desc)}</dd><dt>Propósito</dt><dd>${v(it.proposito)}</dd><dt>Producto esperado</dt><dd>${v(it.producto)}</dd>
        <dt>Organización</dt><dd>${it.organizacion === 'Equipo' ? `En equipos de ${esc(it.integrantes)}` : 'Individual'}</dd><dt>Criterios</dt><dd>${v(it.criterios)}</dd><dt>Fuentes</dt><dd>${it.fuentes.some(fuenteValida) ? `<ol class="fuentes">${it.fuentes.filter(fuenteValida).map(f => `<li>${fuenteHTML(f)}</li>`).join('')}</ol>` : v('')}</dd><dt>Uso de IA</dt><dd>${v(it.ia)}</dd>
        ${['Interculturalidad', 'Sustentabilidad', 'Cultura de paz'].map(k => `<dt>${esc(k)}</dt><dd>${it.ejesDec[k] === 'no' ? '<b>No aplica:</b> ' : ''}${v(it.ejes[k], it.ejesDec[k] ? 'Sin capturar' : 'Sin decidir')}</dd>`).join('')}</dl>
      <h4 class="pv-h">Etapas</h4><ol class="pv-st">${it.etapas.map((e, i) => `<li><b>${esc(e.nombre)}</b> · entrega ${fmtL(e.fecha)}${e.preguntas.filter(q => q.trim()).length ? `<ul>${e.preguntas.filter(q => q.trim()).map(q => `<li>${esc(q)}</li>`).join('')}</ul>` : ''}</li>`).join('')}
        <li><b>Conclusión</b> · ¿Qué aprendiste?</li><li><b>Defensa oral</b> · ${fmtL(it.defensa.fecha)}${it.defensa.lugar ? ' · ' + esc(it.defensa.lugar) : ''}</li></ol>`;
  }

  V['doc-rev'] = () => {
    const fm = S.revMat || 'todas';
    const list = D.pendientes.map((p, i) => [p, i]).filter(([p]) => fm === 'todas' || `${p.m}-${p.g}` === fm);
    const matSel = `<label class="f"><span>Materia y grupo</span><select class="in" data-change="revMat"><option value="todas">Todas las materias (${D.pendientes.length})</option>${D.materiasDocente.map(m => `<option value="${m.id}" ${fm === m.id ? 'selected' : ''}>${esc(matLabel(m))} (${D.pendientes.filter(x => `${x.m}-${x.g}` === m.id).length})</option>`).join('')}</select></label>`;
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
      <div class="ph"><div><h1>${esc(p.n)}</h1><p>${p.m} · Grupo ${p.g} · ${esc(p.etapa)}</p>${momTag('Momento 6 · Cédula de rastro intelectual y evaluación')}</div>${dueChip(p.vence)}</div>
      <div class="rev">
        <div><div class="card"><h3>Curaduría crítica</h3>
            <p class="small" style="margin:8px 0 0"><b>Fuente explorada:</b> ${esc(C.fuentes[0])}</p>
            <div class="entry"><span class="tg ia">Descarte de IA</span><p class="small" style="margin:6px 0 0"><b>${esc(C.descarte[0])}</b></p><p class="small muted" style="margin:4px 0 0">${esc(C.descarte[1])}</p></div></div>
          <div class="card"><h3>Giro cognitivo</h3><div class="giro"><div><h4>Duda</h4><p class="small" style="margin:0">${esc(C.duda)}</p></div>
            <div><h4>Error</h4><p class="small" style="margin:0">El índice compuesto no se usaba en las consultas por fecha.</p></div>
            <div><h4>Rectificación</h4><p class="small" style="margin:0">Reordené las columnas del índice y particioné la tabla por mes.</p></div></div></div>
          <div class="card"><h3>Evidencia</h3>
            <div class="upload ok">${ic('file', 'lg')}<div><b>Avance_2_modelo_datos.pdf</b><div class="small muted">1.4 MB</div></div><button class="btn btn-o btn-s" style="margin-left:auto">${ic('download', 'sm')}Descargar</button></div></div></div>
        <div class="aside">
          <div class="assist"><div class="between"><span class="caps">Asistente de IA UNACH</span><span class="chip">${ic('cpu', 'sm')}Modelo local · piloto</span></div>
            <p class="small muted" style="margin:0 0 10px">Análisis generado al recibir la entrega · ${fmt(addDays(p.vence, -7))}, 18:40 h · guardado en la plataforma</p>
            <p class="small" style="margin:0">Resumen: identifica el problema de volumen y corrige su modelo inicial; documenta un error real y su corrección.</p>
            <h4>Lista de revisión</h4><ul>
              <li class="y">${ic('check')}<span>Atiende la retroalimentación de la etapa 1</span></li>
              <li class="y">${ic('check')}<span>Justifica el descarte de la sugerencia de IA</span></li>
              <li class="n">${ic('x')}<span>Solo registra una fuente explorada</span></li></ul>
            <h4>Incongruencias</h4><ul><li class="n">${ic('alert')}<span>Menciona "concurrencia en horas pico" pero no presenta pruebas de carga.</span></li></ul>
            <p class="small muted" style="margin:12px 0 0">Sugerencia, no evaluación. La decisión es del docente. <a href="ia.html" target="_blank" rel="noopener">¿Cómo funciona el asistente?</a></p></div>
          <div class="card"><h3>Retroalimentación</h3>
            <label class="f"><span class="req">Comentario para el estudiante</span><textarea class="in" rows="5" id="fbText" data-largo="1" placeholder="Qué está bien, qué falta, qué revisar en la siguiente etapa."></textarea><span class="wc" data-wc>0 palabras · mínimo ${D.minPalabras}</span></label>
            <button class="btn btn-p" style="margin-top:14px;width:100%;justify-content:center" data-act="sendFb">${ic('check', 'sm')}Aprobar etapa y enviar</button>
            <button class="btn btn-o" style="margin-top:8px;width:100%;justify-content:center" data-act="rejectFb">${ic('undo', 'sm')}Solicitar corrección (${D.diasCorreccion} días)</button>
            <p class="small muted" style="margin:10px 0 0">Al aprobar, se abre la siguiente etapa para el estudiante.</p></div>
        </div></div></div>`;
  };

  V['doc-def'] = () => `<div class="page"><div class="crumb"><button data-go="doc-home">Panel docente</button>${ic('right')}Defensas orales</div>
    <div class="ph"><div><h1>Defensas orales</h1><p>Programadas en sus retos. Registre cada defensa al realizarla.</p></div></div>
    <div class="card"><ul class="list-pend">${D.defensas.map((d, i) => `<li><span class="av">${d.n.split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
      <span><b class="small">${esc(d.n)}</b><br><span class="small muted">Grupo ${d.g} · ${fmtL(d.fecha)}, ${d.hora} h</span></span>
      ${d.hecha ? `<span class="chip ok">${ic('check', 'sm')}Realizada · ${esc(d.hecha)}</span>` : '<span class="chip">Programada</span>'}
      ${d.hecha ? '' : `<button class="btn btn-p btn-s" data-act="defOk" data-arg="${i}">Registrar realizada</button>`}</li>`).join('')}</ul>
    <p class="small muted" style="margin:14px 0 0">En producción el registro puede confirmarse escaneando el código QR de la cédula impresa del estudiante.</p></div></div>`;

  /* =========================================================
     VISTAS · AUTORIDAD
     ========================================================= */
  V['aut-home'] = () => {
    const top = D.unidades.slice(0, 10), mia = D.unidades.findIndex(u => u[0] === D.miUnidad);
    return `<div class="page">
    <div class="crumb">Indicadores</div>
    <div class="ph"><div><h1>Ranking institucional</h1><p>Periodo ${D.periodo} · Cumplimiento del proceso de Agencia Cognitiva por unidad académica</p></div><button class="btn btn-o">${ic('download', 'sm')}Exportar reporte</button></div>
    <div class="grid4">
      <div class="card kpi"><b>18,420</b><span>Cédulas activas</span></div>
      <div class="card kpi"><b>79%</b><span>Etapas entregadas a tiempo</span></div>
      <div class="card kpi"><b>71%</b><span>Revisiones docentes a tiempo</span></div>
      <div class="card kpi"><b>${D.actividadDocente.reportes}</b><span>Reportes enviados por grupos sin retos</span></div></div>
    <div class="mine card"><div class="between"><div><span class="caps muted">Tu unidad académica</span><h3 style="margin-top:4px">${esc(D.miUnidad)}</h3></div>
      <div class="rank"><b>${mia + 1}°</b><span>de ${D.totalUnidades}</span></div><button class="btn btn-o btn-s" data-go="aut-unidad">Ver detalle ${ic('right', 'sm')}</button></div></div>
    <div class="card" style="margin-top:14px"><div class="between"><div><h3>Top 10 unidades académicas</h3><div class="sub">Ordenadas por entregas a tiempo de los estudiantes</div></div>
        <div class="row small"><span class="row" style="gap:6px"><i class="lg-sw navy"></i>Estudiantes</span><span class="row" style="gap:6px"><i class="lg-sw gold"></i>Docentes</span></div></div>
      <div class="tbl"><table class="rank-t" style="margin-top:8px"><thead><tr><th>#</th><th>Unidad académica</th><th style="width:38%">Cumplimiento</th><th>Interculturalidad</th><th>Sustentabilidad</th><th>Cultura de paz</th></tr></thead><tbody>
      ${top.map(([u, a, b, e], i) => `<tr class="${u === D.miUnidad ? 'me' : ''}"><td class="serif">${i + 1}</td><td><b>${esc(u)}</b></td>
        <td><span class="bar" style="display:block"><i style="width:${a}%"></i></span><span class="bar gold" style="display:block;margin-top:4px"><i style="width:${b}%"></i></span><span class="small muted">${a}% · ${b}%</span></td>
        <td>${e.I}</td><td>${e.S}</td><td>${e.P}</td></tr>`).join('')}</tbody></table></div>
      <p class="small muted" style="margin:10px 0 0">Retos por eje: número de retos publicados que trabajan cada eje (la adopción crítica de la IA está en todos).</p></div>
  </div>`;
  };
  V['aut-unidad'] = () => {
    const u = D.unidades.find(x => x[0] === S.unidad) || D.unidades[2], pos = D.unidades.indexOf(u) + 1, A = D.actividadDocente;
    const mx = Math.max(u[3].I, u[3].S, u[3].P);
    return `<div class="page">
    <div class="crumb"><button data-go="aut-home">Indicadores</button>${ic('right')}Unidad académica</div>
    <div class="ph"><div><h1>${esc(u[0])}</h1><p>Lugar ${pos} de ${D.totalUnidades} · Periodo ${D.periodo}</p></div>
      <label class="f" style="margin:0;min-width:260px"><span>Unidad académica</span><select class="in" data-change="unidad">${D.unidades.map(x => `<option ${x[0] === u[0] ? 'selected' : ''}>${esc(x[0])}</option>`).join('')}</select></label></div>
    <div class="grid4">
      <div class="card kpi"><b>${u[1]}%</b><span>Etapas entregadas a tiempo</span></div>
      <div class="card kpi"><b>${u[2]}%</b><span>Revisiones docentes a tiempo</span></div>
      <div class="card kpi"><b>${A.activos}/${A.total}</b><span>Docentes activos en la plataforma</span></div>
      <div class="card kpi"><b>${A.sinRetos}</b><span>Grupos sin retos publicados (reporte enviado)</span></div></div>
    <div class="grid2" style="margin-top:14px">
      <div class="card"><h3>Por programa educativo y plan</h3><div class="tbl"><table style="margin-top:8px"><thead><tr><th>Programa</th><th>Plan</th><th>Estudiantes</th><th>Docentes</th></tr></thead><tbody>
        ${u[0] === D.miUnidad ? D.programas.map(([p, pl, a, b]) => `<tr><td><b>${esc(p)}</b></td><td>${esc(pl)}</td><td>${a}%</td><td>${b}%</td></tr>`).join('') : '<tr><td colspan="4" class="muted">Los programas de esta unidad se cargarán desde la API institucional.</td></tr>'}</tbody></table></div></div>
      <div class="card"><h3>Retos por eje transversal</h3><div class="sub">Retos publicados en la unidad que trabajan cada eje</div>
        <div style="margin-top:12px">${[['Interculturalidad', u[3].I], ['Sustentabilidad', u[3].S], ['Cultura de paz', u[3].P]].map(([k, v]) => `<div class="hbar" style="grid-template-columns:140px 1fr 40px"><span>${k}</span><span class="bar gold"><i style="width:${v / mx * 100}%"></i></span><b class="small">${v}</b></div>`).join('')}</div>
        <h3 style="margin-top:20px">Actividad docente</h3><dl class="kv" style="margin-top:8px"><dt>Accesos esta semana</dt><dd>${A.accesosSemana.toLocaleString('es-MX')}</dd><dt>Sin actividad</dt><dd>${A.total - A.activos} docentes</dd></dl></div>
    </div>
    <div class="card"><h3>Avance por semestre</h3><div style="margin-top:10px">${[[1, 88], [2, 84], [3, 80], [4, 77], [5, 61], [6, 58], [7, 55], [8, 49]].map(([s, v]) => `<div class="hbar" style="grid-template-columns:90px 1fr 44px"><span>Semestre ${s}</span><span class="bar"><i style="width:${v}%"></i></span><b class="small">${v}%</b></div>`).join('')}</div>
      <div class="note" style="margin-top:14px">${ic('alert', 'sm')}<span>Cifras de ejemplo. El sistema mide el cumplimiento del proceso; el aprendizaje lo valoran docentes y academias.</span></div></div>
  </div>`;
  };

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
  const msgModal = (t, p, ok = 'Entendido') => modal(`<h3>${t}</h3><p class="small muted" style="margin:6px 0 0">${p}</p><div class="row"><button class="btn btn-p" data-act="closeModal">${ok}</button></div>`);

  const ACT = {
    toggleMod: a => { const n = +a; S.open.has(n) ? S.open.delete(n) : S.open.add(n); render(); },
    openSem: a => { S.open.add(+a); S.sideTab = 'tray'; render(); if (innerWidth < 860) $('#side').classList.add('open'); },
    sideTab: a => { S.sideTab = a; render(); if (innerWidth < 860) $('#side').classList.add('open'); },
    toggleSide: () => $('#side').classList.toggle('open'),
    stage: a => {
      const n = +a;
      if (n === 3 && D.etapas[1].estado !== 'done') { S.stage = 3; render(); return; }
      S.stage = n; render();
    },
    upload2: () => { D.cedula.avance2 = true; render(); toast('Archivo cargado'); },
    send2: () => {
      const C = D.cedula, m = [];
      if (!C.fuentes[0].trim()) m.push('Al menos una fuente explorada');
      [['descarte.1', C.descarte[1], 'Justificación del descarte'], ['duda', C.duda, 'Giro cognitivo: duda emergente'], ['error', C.error, 'Giro cognitivo: error o fallo'], ['rect', C.rect, 'Giro cognitivo: rectificación']]
        .forEach(([, v, t]) => { if (!String(v).trim()) m.push(t); else if (palabras(v) < 8 || sinSentido(v)) m.push(`${t} (texto muy breve o sin sentido)`); });
      if (!C.avance2) m.push('Evidencia del avance');
      if (m.length) return modal(`<h3>Faltan elementos para enviar</h3><p class="small muted" style="margin:6px 0 0">Se revisa que tu registro esté completo y tenga sentido, no que sea "correcto".</p><ul>${m.map(x => `<li>${esc(x)}</li>`).join('')}</ul><div class="row"><button class="btn btn-p" data-act="closeModal">Entendido</button></div>`);
      modal(`<h3>Enviar etapa 2</h3><p class="small muted" style="margin:6px 0 0">Tu docente tendrá hasta el ${fmtL(D.etapas[1].revision)} para revisarla.</p><div class="row"><button class="btn btn-o" data-act="closeModal">Cancelar</button><button class="btn btn-p" data-act="confirm2">Enviar</button></div>`);
    },
    confirm2: () => { S.sent2 = true; closeModal(); render(); toast('Etapa 2 enviada'); },
    closeModal, closeOv: (a, e) => { if (e.target.classList.contains('ov')) closeModal(); },
    notif: () => modal(`<h3>Avisos</h3><ul class="notif">
        <li><div><b>Tu etapa 2 de 5.2 vence el ${fmtL(D.etapas[1].entrega)}</b><span class="small muted">Recordatorio también enviado a tu correo institucional</span></div><button class="btn btn-o btn-s" data-go="cedula">Ir a la etapa</button></li>
        <li><div><b>Recibiste retroalimentación en 5.2 · Etapa 1</b><span class="small muted">Mtro. Carlos Ruiz Hernández</span></div><button class="btn btn-o btn-s" data-go="cedula">Ver retroalimentación</button></li></ul>
        <div class="row"><button class="btn btn-p" data-act="closeModal">Cerrar</button></div>`),
    logout: () => { $('#app').classList.add('hidden'); $('#login').classList.remove('hidden'); },
    print: () => window.print(),
    /* docente */
    matSel: a => { S.matSel = a; S.view = 'doc-home'; render(); },
    volverActual: () => { S.periodo = D.periodo; render(); },
    modo: a => { S.nuevo.modo = a; S.nuevo.act = 0; render(); },
    numActs: a => { S.nuevo.numActs = +a; S.nuevo.act = 0; render(); },
    actTab: a => { S.nuevo.act = +a; render(); },
    tipoReto: a => { IT().tipoReto = a; render(); },
    organizacion: a => { IT().organizacion = a; render(); },
    addFuente: () => { IT().fuentes.push({ tipo: 'link', url: '', titulo: '', autor: '', ref: '', archivo: '' }); render(); },
    delFuente: a => { const f = IT().fuentes; if (f.length > 1) { f.splice(+a, 1); render(); } },
    fuenteArchivo: a => { IT().fuentes[+a].archivo = 'material-del-docente.pdf'; render(); toast('Archivo cargado'); },
    descargarFuente: (a, e) => { e.preventDefault(); toast('Descarga simulada en el prototipo'); },
    ejeDec: a => { const [k, v] = a.split('|'), it = IT(); if (it.ejesDec[k] !== v) it.ejes[k] = ''; it.ejesDec[k] = v; render(); },
    otroGrupo: a => { const s = S.nuevo.otros; s.has(a) ? s.delete(a) : s.add(a); render(); },
    cfgStage: a => { const o = IT().open, i = +a; o.has(i) ? o.delete(i) : o.add(i); render(); },
    addStage: () => { const it = IT(), l = it.etapas.at(-1).fecha; it.etapas.push(etapaN('Nueva etapa', addDays(l, D.diasRecomendadosEtapa))); it.open.add(it.etapas.length - 1); render(); },
    delStage: a => { const it = IT(); if (it.etapas.length > 2) { it.etapas.splice(+a, 1); it.open = new Set(); render(); } },
    addQ: a => { IT().etapas[+a].preguntas.push(''); render(); },
    delQ: a => { const [i, k] = a.split(':').map(Number), e = IT().etapas[i]; if (e.preguntas.length > minPreg(i)) { e.preguntas.splice(k, 1); render(); } },
    invite: () => { const d = D.docentes.find(x => x.n === S.nuevo.invitar); if (!d) return; S.nuevo.compartido.push({ m: d.m, d: d.n, e: 'Pendiente' }); S.nuevo.invitar = ''; render(); toast('Invitación enviada a ' + d.n); },
    resend: a => toast('Invitación reenviada a ' + S.nuevo.compartido[+a].d),
    unshare: a => { S.nuevo.compartido.splice(+a, 1); render(); },
    copyLink: () => { const v = $('#invUrl').value; try { navigator.clipboard.writeText(v).then(() => toast('Enlace copiado'), () => toast('Copie el enlace manualmente')); } catch (err) { toast('Copie el enlace manualmente'); } },
    inviteAns: a => { const [i, r] = a.split(':'); const v = D.invitaciones.filter(x => x.estado === 'pendiente')[+i]; if (!v) return; v.estado = r; render(); toast(r === 'aceptada' ? 'Invitación aceptada: el proyecto aparece en sus retos' : 'Invitación rechazada'); },
    revGo: a => { if (a !== '') { S.reviewing = +a; render(); } },
    draft: () => toast('Borrador guardado'),
    preview: () => modal(previewHTML(), 'wide'),
    publish: () => {
      const N = S.nuevo, items = N.modo === 'integrador' ? N.integr : N.acts.slice(0, N.numActs), m = [];
      items.forEach((it, k) => {
        const pre = N.modo === 'integrador' || N.numActs === 1 ? '' : `Cédula ${k + 1} · `;
        if (!it.titulo.trim()) m.push(pre + 'Título');
        [['desc', 'Descripción'], ['proposito', 'Propósito de aprendizaje'], ['producto', 'Producto esperado'], ['criterios', 'Criterios de evaluación'], ['ia', 'Uso de la IA']]
          .forEach(([f, t]) => { const v = it[f]; if (!String(v).trim()) m.push(`${pre}${t}`); else if (palabras(v) < D.minPalabras || sinSentido(v)) m.push(`${pre}${t}: mínimo ${D.minPalabras} palabras con sentido`); });
        it.fuentes.forEach((f, i) => { if (!fuenteValida(f)) m.push(`${pre}Fuente ${i + 1}: ${f.tipo === 'doc' ? 'suba el archivo' : f.tipo === 'libro' ? 'escriba la referencia del libro' : 'escriba un enlace válido (https://…)'}`); });
        ['Interculturalidad', 'Sustentabilidad', 'Cultura de paz'].forEach(e => { const dec = it.ejesDec[e], v = it.ejes[e] || ''; if (!dec) m.push(`${pre}${e}: indique si aplica o no aplica`); else if (palabras(v) < D.minPalabras || sinSentido(v)) m.push(`${pre}${e}: ${dec === 'si' ? 'describa qué incluye' : 'justifique por qué no aplica'} (mínimo ${D.minPalabras} palabras)`); });
        it.etapas.forEach((e, i) => { if (e.preguntas.filter(q => q.trim()).length < minPreg(i)) m.push(`${pre}Etapa ${i + 1}: mínimo ${minPreg(i)} pregunta${minPreg(i) > 1 ? 's' : ''}`); });
        if (!it.defensa.lugar.trim()) m.push(pre + 'Lugar de la defensa oral');
      });
      if (m.length) return modal(`<h3>Complete la información</h3><p class="small muted" style="margin:6px 0 0">Estos campos guían al estudiante. Se pide un mínimo de palabras para evitar textos vacíos; en producción el asistente de IA también revisará su congruencia.</p><ul>${m.slice(0, 12).map(x => `<li>${esc(x)}</li>`).join('')}${m.length > 12 ? `<li>y ${m.length - 12} más</li>` : ''}</ul><div class="row"><button class="btn btn-p" data-act="closeModal">Entendido</button></div>`);
      toast(N.modo === 'integrador' ? 'Proyecto publicado' : N.numActs === 1 ? 'Actividad publicada' : `${N.numActs} actividades publicadas`); go('doc-home');
    },
    sendFb: () => {
      const v = $('#fbText').value;
      if (palabras(v) < D.minPalabras || sinSentido(v)) return msgModal('Escriba una retroalimentación', `Mínimo ${D.minPalabras} palabras con sentido. Oriente al estudiante: qué está bien, qué falta y qué revisar.`);
      D.pendientes.splice(S.reviewing ?? 0, 1); D.cumplimientoDocente.aTiempo++; D.cumplimientoDocente.total++;
      S.reviewing = null; toast('Etapa aprobada: se abrió la siguiente para el estudiante'); render(); window.scrollTo(0, 0);
    },
    rejectFb: () => {
      const v = $('#fbText').value;
      if (palabras(v) < D.minPalabras || sinSentido(v)) return msgModal('Explique qué debe corregir', `Para solicitar corrección escriba al menos ${D.minPalabras} palabras indicando qué falta.`);
      D.pendientes.splice(S.reviewing ?? 0, 1); S.reviewing = null;
      toast(`Corrección solicitada: el estudiante tiene ${D.diasCorreccion} días para volver a entregar`); render(); window.scrollTo(0, 0);
    },
    defOk: a => { D.defensas[+a].hecha = fmt(D.hoy); render(); toast('Defensa oral registrada'); },
  };

  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); closeModal(); return go(g.dataset.go, g.dataset.arg); }
    const a = e.target.closest('[data-act]'); if (a && ACT[a.dataset.act]) {
      if (a.tagName === 'INPUT' && a.type === 'checkbox') { ACT[a.dataset.act](a.dataset.arg, e); return; }
      ACT[a.dataset.act](a.dataset.arg, e);
    }
  });
  function updWc(el) {
    const w = el.parentElement.querySelector('[data-wc]'); if (!w) return;
    const n = palabras(el.value), ok = n >= D.minPalabras && !sinSentido(el.value);
    w.textContent = `${n} palabras · mínimo ${D.minPalabras}${sinSentido(el.value) ? ' · revise el texto' : ''}`; w.classList.toggle('ok', ok);
  }
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
    if (el.dataset.eje) IT().ejes[el.dataset.eje] = el.value;
    if (el.dataset.fnb) {
      const [i, k] = el.dataset.fnb.split('.'); IT().fuentes[+i][k] = el.value;
      if (k === 'url') { const row = el.closest('.fuente-row'), bad = el.value && !urlOk(el.value); let w = row.querySelector('.wc'); if (bad && !w) row.insertAdjacentHTML('beforeend', '<span class="wc">El enlace debe empezar con https:// o http://</span>'); if (!bad && w) w.remove(); }
    }
    if (el.dataset.largo) updWc(el);
    if (el.dataset.actInput === 'filter') {
      const q = el.value.toLowerCase();
      $$('#outline .item').forEach(i => { i.parentElement.style.display = i.textContent.toLowerCase().includes(q) ? '' : 'none'; });
      if (q) $$('#outline .mod').forEach(m => m.classList.add('open'));
    }
  });
  document.addEventListener('change', e => {
    const el = e.target, c = el.dataset.change;
    if (el.dataset.rerender) render();
    if (c === 'periodo') { S.periodo = el.value; S.view = 'doc-home'; render(); }
    if (c === 'materia') { S.nuevo.materia = el.value; S.nuevo.otros = new Set(); render(); }
    if (c === 'invitar') { S.nuevo.invitar = el.value; render(); }
    if (c === 'revMat') { S.revMat = el.value; S.reviewing = null; render(); }
    if (c === 'revAlumno') { S.reviewing = +el.value; render(); }
    if (c === 'unidad') { S.unidad = el.value; render(); }
    if (el.dataset.fsel) { const f = IT().fuentes[+el.dataset.fsel]; f.tipo = el.value; f.url = ''; f.archivo = ''; f.ref = ''; render(); }
  });

  /* ---------- Sin copiar ni pegar para estudiantes ----------
     Aplica en todo el contenido de sus retos (#view). Es una medida
     disuasiva en el navegador; en producción los intentos también
     se registran en el servidor. */
  let avisoT = 0;
  const bloquear = (e, msg) => {
    if (S.role !== 'est' || !e.target.closest?.('#view')) return;
    e.preventDefault();
    if (Date.now() - avisoT > 2500) { avisoT = Date.now(); toast(msg); }
  };
  ['copy', 'cut'].forEach(t => document.addEventListener(t, e => bloquear(e, 'En tus retos no se permite copiar texto.')));
  document.addEventListener('paste', e => bloquear(e, 'En tus retos no se permite pegar texto: escríbelo con tus propias palabras.'));
  document.addEventListener('drop', e => bloquear(e, 'En tus retos no se permite arrastrar texto.'));
  document.addEventListener('beforeinput', e => { if (/^insertFrom(Paste|Drop)/.test(e.inputType)) bloquear(e, 'En tus retos no se permite pegar texto: escríbelo con tus propias palabras.'); });
  document.addEventListener('contextmenu', e => bloquear(e, 'El menú de copiar y pegar está desactivado en tus retos.'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Acceso (en producción: Google, solo cuentas @unach.mx) ---------- */
  let role = 'est';
  $$('.role-opt').forEach(b => b.addEventListener('click', () => { role = b.dataset.role; $$('.role-opt').forEach(x => x.setAttribute('aria-pressed', x === b)); }));
  $('#btnLogin').addEventListener('click', () => {
    S.role = role; S.view = DEFAULT[role]; S.periodo = D.periodo; S.matSel = 'todas';
    const u = role === 'est' ? D.estudiante : role === 'doc' ? D.docente : D.autoridad;
    $('#userName').textContent = u.nombre; $('#userAv').textContent = u.iniciales;
    $('#userRole').textContent = { est: 'Estudiante', doc: 'Docente', aut: 'Autoridad' }[role];
    $('#ctxTitle').textContent = role === 'est' ? D.estudiante.programa : role === 'doc' ? 'Docencia' : 'Secretaría Académica';
    $('#ctxSub').textContent = role === 'est' ? `${D.estudiante.unidad} · Periodo ${D.periodo} · Quinto semestre` : role === 'doc' ? `${D.estudiante.unidad} · ${D.materiasDocente.length} grupos · Periodo ${D.periodo}` : `Periodo ${D.periodo} · Vista institucional`;
    $('#notifCount').classList.toggle('hidden', role !== 'est');
    document.body.classList.toggle('rol-est', role === 'est');
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

/* Cápsula de Memorias Alico — núcleo común del muro y el panel */
(function () {
'use strict';
const LS = AL.LS, MEM = window.MEM = {};
MEM.AREAS = ['Producción', 'Calidad', 'Logística', 'Comercial', 'Servicio al cliente', 'Finanzas', 'Gestión humana', 'TI', 'Mantenimiento', 'Otra'];
MEM.IA = ['Visión artificial', 'Asistente de voz', 'Conocimiento técnico (RAG)', 'Analítica y predicción', 'Automatización de procesos', 'Agente / copiloto', 'Otra'];
MEM.COLORS = ['#EE7623', '#00BED6', '#E99B35', '#2BD67B', '#ff6b9d', '#8b7cf6', '#ffd166', '#4dabf7'];
const KEY = 'mem_ideas';
MEM.list = () => { let l = LS.get(KEY, null); if (!l) { l = MEM.seed(); LS.set(KEY, l); } return l; };
MEM.store = l => { try { LS.set(KEY, l); } catch (e) { const t = l.map(x => x.ejemplo ? x : x); try { LS.set(KEY, t.map((x, i) => i < t.length - 6 ? Object.assign({}, x, { foto: null }) : x)); } catch (e2) {} } };
MEM.get = id => MEM.list().find(x => x.id === id);
MEM.cloudCopy = r => { const c = JSON.parse(JSON.stringify(Object.assign({}, r, { foto: null }))); c.respuestas_txt = (r.respuestas || []).join(' | '); Object.assign(c, { nombre_idea: r.h && r.h.nombre_idea, historia_usuario: r.h && r.h.historia_usuario, problema: r.h && r.h.problema, impacto: r.h && r.h.impacto, horas_semana: r.h && r.h.horas_semana, prioridad: r.h && r.h.prioridad, complejidad: r.h && r.h.complejidad, tipo_ia: r.h && r.h.tipo_ia, primer_paso: r.h && r.h.primer_paso, fecha_objetivo: r.h && r.h.fecha_objetivo, respuestas: c.respuestas_txt, consentimiento: r.consent ? 'Sí ' + r.consent : 'No' }); return c; };
MEM.save = r => { const l = MEM.list(), i = l.findIndex(x => x.id === r.id); r.upd = Date.now(); if (i >= 0) l[i] = r; else l.unshift(r); MEM.store(l); if (!r.ejemplo) { AL.queue('idea', MEM.cloudCopy(r)); if (r.foto && AL.hasCloud()) AL.saveFile('idea-' + r.id + '.foto', r.foto, 'text/plain'); } return r; };
MEM.pull = async function () {
  if (!AL.hasCloud()) return false;
  try {
    const rows = (await AL.cloudGet({ action: 'ideas' })).rows || [], l = MEM.list(); let ch = false;
    rows.forEach(x => { if (!x || !x.id) return; const k = l.findIndex(y => y.id === x.id); const loc = k >= 0 ? l[k] : null;
      if (!loc) { x.respuestas = String(x.respuestas_txt || '').split(' | '); l.unshift(x); ch = true; }
      else if ((x.upd || 0) > (loc.upd || 0)) { Object.assign(loc, x, { foto: loc.foto, respuestas: loc.respuestas }); ch = true; } });
    if (ch) MEM.store(l); return ch;
  } catch (e) { return false; }
};
MEM.fetchFoto = async function (r) {
  if (r.foto || r.ejemplo || !AL.hasCloud() || r._ff) return r.foto; r._ff = 1;
  try { r.foto = await AL.loadFile('idea-' + r.id + '.foto'); const l = MEM.list(), k = l.findIndex(x => x.id === r.id); if (k >= 0) { l[k].foto = r.foto; MEM.store(l); } return r.foto; } catch (e) { return null; }
};
MEM.fmtFecha = d => new Date(d).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

/* ---------- Memo, la mascota (SVG) ---------- */
MEM.ROBOT = { saludo: 1, presentacion: 1, analisis: 1, aprobacion: 1, senalar: 1, explicacion: 1, cordialidad: 1, complicidad: 1, atencion: 1, calma: 1, alegria: 1, duda: 1 };
/* Memo = el robot Softgic (manual de marca, repertorio de posturas y expresiones). pose: saludo, presentacion, analisis, aprobacion, senalar, explicacion (cuerpo) o cordialidad, complicidad, atencion, calma, alegria, duda (plano medio). */
MEM.memo = function (o = {}) {
  const s = o.size || 160, p = MEM.ROBOT[o.pose] ? o.pose : 'saludo';
  return `<img class="memo ${o.talk ? 'talk' : ''}" src="assets/robot/${p}.png" alt="Memo, el robot de Softgic" style="height:${s}px;width:auto;max-width:100%;object-fit:contain">`;
};
/* ---------- empaque (funda) de la idea ---------- */
MEM.funda = function (r, w = 260) {
  const h = r.h || {}, t = String(h.nombre_idea || 'Mi idea'), ing = h.ingredientes || {};
  const words = t.split(' '), l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' ');
  const clip = (x, n) => String(x || '').slice(0, n);
  return `<svg viewBox="0 0 260 340" width="${w}" style="filter:drop-shadow(0 12px 18px rgba(0,0,0,.4))"><defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8a3d"/><stop offset="1" stop-color="#e2610f"/></linearGradient></defs>
  <path d="M20 14 H240 L246 40 Q252 170 240 322 H20 Q8 170 14 40Z" fill="#fff"/><path d="M20 14 H240 L243 34 H17Z" fill="#d9dee3"/><path d="M14 40 H246 Q250 80 249 110 H11 Q10 80 14 40Z" fill="url(#fg)"/>
  <text x="130" y="82" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="800" font-size="26" fill="#fff">alico</text><text x="130" y="100" text-anchor="middle" font-family="Poppins,sans-serif" font-size="9" fill="#fff" opacity=".9">Cápsula de Memorias</text>
  <text x="130" y="140" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="800" font-size="${l2 ? 17 : 19}" fill="#2b2e30">${AL.esc(clip(l1, 22))}</text>${l2 ? `<text x="130" y="160" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="800" font-size="17" fill="#2b2e30">${AL.esc(clip(l2, 22))}</text>` : ''}
  <text x="130" y="184" text-anchor="middle" font-family="Poppins,sans-serif" font-size="9.5" fill="#6b7480">${AL.esc(clip(h.frase_empaque || 'Una idea empacada', 38))}</text>
  <rect x="24" y="196" width="212" height="1.5" fill="#e6e6e6"/>
  <text x="30" y="214" font-family="Poppins,sans-serif" font-weight="700" font-size="9" fill="#EE7623">Contenido neto: 1 idea</text>
  <text x="30" y="238" font-family="Poppins,sans-serif" font-size="9.5" fill="#2b2e30"><tspan font-weight="700">Problema · </tspan>${AL.esc(clip(ing.problema, 30))}</text>
  <text x="30" y="258" font-family="Poppins,sans-serif" font-size="9.5" fill="#2b2e30"><tspan font-weight="700">IA · </tspan>${AL.esc(clip(ing.ia, 34))}</text>
  <text x="30" y="278" font-family="Poppins,sans-serif" font-size="9.5" fill="#2b2e30"><tspan font-weight="700">Beneficio · </tspan>${AL.esc(clip(ing.beneficio, 30))}</text>
  <text x="30" y="306" font-family="Poppins,sans-serif" font-size="8.5" fill="#9aa1a8">${AL.esc(clip(r.grupo, 24))} · ${new Date(r.ts).toLocaleDateString('es-CO')}</text>
  ${r.foto ? `<image href="${r.foto}" x="180" y="288" width="44" height="30" preserveAspectRatio="xMidYMid slice" clip-path="inset(0 round 4px)"/>` : ''}</svg>`;
};
/* ---------- "foto" ilustrada de ejemplo ---------- */
function fotoEj(c1, c2, n) {
  const pp = []; for (let i = 0; i < n; i++) { const x = 70 + i * (340 / n), cc = ['#EE7623', '#00758D', '#E99B35', '#53575A'][i % 4]; pp.push(`<circle cx="${x}" cy="140" r="26" fill="#f1c9a5"/><path d="M${x - 38} 260 q38 -92 76 0Z" fill="${cc}"/><circle cx="${x}" cy="132" r="26" fill="none"/><path d="M${x - 26} 130 q26 -40 52 0" fill="#3a2a22"/>`); }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="480" height="360" fill="url(#g)"/>${pp.join('')}</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
MEM.seed = function () {
  const now = Date.now(), mk = (i, g, p, rol, area, nombre, esl, hist, hs, pri, cmp, tipo, ing, c1, c2, n) => ({ id: 'ej' + i, ts: new Date(now - (i + 1) * 36e5).toISOString(), upd: now, ejemplo: true, sesion: 'EJEMPLO', grupo: g, participante: p, rol, area, consent: 'EJEMPLO', respuestas: [], foto: fotoEj(c1, c2, n), padrino: 'Dirección de planta', estado: 'nueva',
    h: Object.assign({ nombre_idea: nombre, eslogan: esl, area, tipo_ia: tipo, historia_usuario: hist, horas_semana: hs, prioridad: pri, complejidad: cmp, impacto: 'Menos tiempo perdido y decisiones más rápidas', primer_paso: 'Piloto en una línea', fecha_objetivo: 'Próximo trimestre', criterios: [], riesgos: [], ingredientes: ing, frase_empaque: esl }, {}) });
  return [
    mk(0, 'Grupo 1', 'Marta', 'Líder de turno', 'Producción', 'Control de Inventarios IA', 'Cada rollo, siempre contado', 'Como líder de turno quiero conocer el inventario de insumos en tiempo real para no parar la línea por faltantes.', 12, 'Alta', 'Media', 'Analítica y predicción', { problema: 'Faltantes de insumo', ia: 'Predicción de consumo', beneficio: 'Cero paradas' }, '#EE7623', '#00758D', 4),
    mk(1, 'Grupo 2', 'Andrés', 'Analista de calidad', 'Calidad', 'Sello a la Vista', 'El defecto se ve antes de salir', 'Como analista de calidad quiero detectar sellos abiertos en cámara para evitar reclamos del cliente.', 9, 'Alta', 'Media', 'Visión artificial', { problema: 'Sellos abiertos', ia: 'Visión artificial', beneficio: 'Menos reclamos' }, '#00BED6', '#14202e', 3),
    mk(2, 'Los Imparables', 'Carolina', 'Coordinadora logística', 'Logística', 'Ruta Sin Retrasos', 'Entregas a tiempo, siempre', 'Como coordinadora logística quiero anticipar retrasos de despacho para cumplir al cliente a tiempo y completo.', 8, 'Media', 'Baja', 'Analítica y predicción', { problema: 'Entregas tardías', ia: 'Alertas predictivas', beneficio: 'OTIF más alto' }, '#E99B35', '#2b2e30', 5)
  ];
};
/* ---------- utilidades ---------- */
MEM.csv = rows => { const cols = Object.keys(rows.reduce((a, r) => Object.assign(a, r), {})); return '﻿' + [cols.join(',')].concat(rows.map(r => cols.map(c => '"' + String(r[c] ?? '').replace(/"/g, '""').replace(/\n/g, ' ') + '"').join(','))).join('\n'); };
MEM.flat = r => { const h = r.h || {}; return { id: r.id, fecha: r.ts, sesion: r.sesion, grupo: r.grupo, participante: r.participante, rol: r.rol, area: r.area, consentimiento: r.consent || '', nombre_idea: h.nombre_idea, historia_usuario: h.historia_usuario, problema: h.problema, afectados: h.afectados, horas_semana: h.horas_semana, impacto: h.impacto, valor_estimado: h.valor_estimado, prioridad: h.prioridad, complejidad: h.complejidad, tipo_ia: h.tipo_ia, criterios: (h.criterios || []).join(' | '), riesgos: (h.riesgos || []).join(' | '), dependencias: (h.dependencias || []).join(' | '), primer_paso: h.primer_paso, fecha_objetivo: h.fecha_objetivo, padrino: r.padrino, respuestas: (r.respuestas || []).join(' | ') }; };
MEM.reales = () => MEM.list().filter(x => !x.ejemplo);
})();

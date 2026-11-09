/* Empaquemos estas memorias · Alico × Softgic — núcleo del muro, la entrevista y el informe */
(function () {
'use strict';
const LS = AL.LS, MEM = window.MEM = {};
MEM.AREAS = ['Producción', 'Calidad', 'Mantenimiento', 'Logística', 'Comercial', 'Servicio al cliente', 'Compras', 'Finanzas', 'Gestión humana', 'TI', 'Innovación y desarrollo', 'Otra'];

/* ---------- los 5 casos del taller GEN IA (para votar y para el informe) ---------- */
MEM.CASOS = [
  { id: 'vision', n: 'Inspección visual con IA', ic: '📷', c: '#00A9C4', area: 'Producción · Calidad', cx: 2,
    valor: 'Detecta defectos en la línea antes de que lleguen al cliente y deja trazabilidad por lote, operario y máquina.',
    kpis: ['% de defecto', 'Reclamos por calidad', 'Costo de no calidad'], piloto: 'Una línea (ej. Conversión 3) con cámara industrial e iluminación, 4–6 semanas.',
    necesita: 'Muestras buenas y malas, acceso a la línea, criterio de Calidad.', dolores: ['inspeccion'], ayudas: ['calidad'] },
  { id: 'maestro', n: 'Maestro · asistente de planta', ic: '🎙️', c: '#EE7623', area: 'Producción · Mantenimiento', cx: 1,
    valor: 'El operario reporta paros y resuelve fallas hablando; la planta aprende de cada turno y baja el tiempo perdido.',
    kpis: ['Minutos de paro', 'Fallas repetidas', 'Tiempo de respuesta de mantenimiento'], piloto: 'Una máquina crítica y un turno, con voz en tablet, 4 semanas.',
    necesita: 'Lista de fallas frecuentes, procedimientos, un líder de turno patrocinador.', dolores: ['paros', 'reportes', 'coordinacion'], ayudas: ['voz', 'alertas'] },
  { id: 'conocimiento', n: 'Agente de conocimiento técnico', ic: '🧠', c: '#00758D', area: 'Ingeniería · Calidad · Soporte', cx: 1,
    valor: 'Respuestas técnicas en segundos, con fuente y escalamiento al especialista; el conocimiento deja de depender de una persona.',
    kpis: ['Tiempo para resolver una consulta', 'Consultas resueltas sin escalar', 'Conocimiento documentado'], piloto: 'Biblioteca de 30–50 documentos de un proceso, 3–4 semanas.',
    necesita: 'Fichas, manuales y procedimientos vigentes; un experto que valide.', dolores: ['informacion'], ayudas: ['preguntas'] },
  { id: 'reclamos', n: 'Centro de inteligencia del cliente', ic: '🎧', c: '#B15E14', area: 'Servicio al cliente · Comercial · Logística', cx: 2,
    valor: 'Cada solicitud y reclamo se clasifica, se resuelve en Epicor y se aprende de él; el cliente sabe siempre en qué va su caso.',
    kpis: ['Tiempo de respuesta', 'Reclamos repetidos', 'Satisfacción del cliente'], piloto: 'Canal de reclamos de un país con triage de IA, 6 semanas.',
    necesita: 'Histórico de reclamos, políticas de devolución, acceso a Epicor/CRM.', dolores: ['solicitudes', 'pedidos'], ayudas: ['clasificar'] },
  { id: 'torre', n: 'Torre de control de negocios', ic: '🗼', c: '#53575A', area: 'Gerencia · Compras · Finanzas', cx: 3,
    valor: 'Toda la compañía en una pantalla, con alertas antes del problema y preguntas a los datos en español.',
    kpis: ['Horas en reportes', 'Quiebres de inventario', 'Decisiones con datos del día'], piloto: 'Tablero de ventas e inventario conectado a Epicor, 6–8 semanas.',
    necesita: 'Acceso de lectura a Epicor, definición de indicadores, patrocinador gerencial.', dolores: ['planeacion', 'reportes'], ayudas: ['decidir', 'reportes'] }
];
MEM.caso = id => MEM.CASOS.find(c => c.id === id);

/* ---------- las 5 preguntas: voz libre + respuesta rápida (para poder medir) ---------- */
MEM.DOLORES = [['reportes', 'Reportes y digitación a mano'], ['informacion', 'Buscar información o documentos'], ['inspeccion', 'Inspección y control de calidad'], ['paros', 'Paros y fallas de máquina'], ['pedidos', 'Seguimiento a pedidos y despachos'], ['solicitudes', 'Atender solicitudes y reclamos'], ['planeacion', 'Planeación, compras e inventarios'], ['coordinacion', 'Coordinación entre áreas y turnos']];
MEM.HORAS = [['<1 h', .5], ['1–3 h', 2], ['4–8 h', 6], ['9–15 h', 12], ['+15 h', 18]];
MEM.PERSONAS = [['Solo yo', 1], ['2 a 5', 3], ['6 a 15', 10], ['Más de 15', 20]];
MEM.AYUDAS = [['reportes', 'Que haga los reportes por mí'], ['alertas', 'Que me avise antes de que pase un problema'], ['preguntas', 'Que responda preguntas técnicas al instante'], ['calidad', 'Que revise la calidad automáticamente'], ['clasificar', 'Que clasifique y atienda solicitudes'], ['decidir', 'Que analice datos para decidir mejor'], ['voz', 'Que registre lo que digo por voz']];
MEM.BARRERAS = [['capacitacion', 'Capacitación práctica'], ['facil', 'Que sea fácil de usar'], ['datos', 'Datos ordenados y confiables'], ['jefe', 'Apoyo de mi jefe'], ['confianza', 'Saber que me ayuda, no me reemplaza'], ['equipos', 'Equipos y conectividad en planta']];
MEM.LISTO = ['😟', '🙁', '😐', '🙂', '🤩'];
MEM.lab = (arr, k) => (arr.find(x => x[0] === k) || [k, k])[1];
MEM.Q = [
  { k: 'dolor', q: '¿Qué tarea de tu día a día te quita más tiempo o te genera más frustración?', corto: 'La tarea que más tiempo te quita',
    hint: 'Cuéntalo con un ejemplo real. Luego toca la categoría que mejor lo describe.', tipo: 'uno', opts: MEM.DOLORES,
    ej: ['Paso la mañana pasando datos de un formato a Excel', 'Busco fichas técnicas en carpetas y correos', 'El defecto lo vemos cuando el lote ya salió'] },
  { k: 'tiempo', q: '¿Cuántas horas a la semana se te van en eso y a cuántas personas de tu equipo les pasa lo mismo?', corto: 'Horas y personas',
    hint: 'Un número aproximado está bien. Toca las horas y las personas.', tipo: 'tiempo',
    ej: ['Unas 5 horas a la semana, nos pasa a 6 personas', 'Todos los días, como una hora cada uno'] },
  { k: 'caso', q: 'De los cinco casos que viste hoy, ¿cuál te gustaría tener primero en tu área, y por qué?', corto: 'El caso que quieres primero',
    hint: 'Elige uno y cuéntame qué cambiaría en tu trabajo.', tipo: 'caso',
    ej: ['La visión artificial, para no depender del ojo cansado', 'Maestro, porque reportar hablando es más fácil'] },
  { k: 'ayuda', q: 'Si la inteligencia artificial trabajara contigo, ¿qué te gustaría que hiciera por ti?', corto: 'Lo que quieres que la IA haga por ti',
    hint: 'Elige hasta dos y, si quieres, cuéntalo con tus palabras.', tipo: 'varios', max: 2, opts: MEM.AYUDAS,
    ej: ['Que me avise cuando una máquina va a fallar', 'Que el informe del turno se haga solo'] },
  { k: 'adopcion', q: 'Para usarla con confianza, ¿qué necesitarías? Y del uno al cinco, ¿qué tan listo te sientes?', corto: 'Lo que necesitas para adoptarla',
    hint: 'Elige hasta dos necesidades y marca qué tan listo te sientes.', tipo: 'adopcion', max: 2, opts: MEM.BARRERAS,
    ej: ['Una capacitación corta y práctica', 'Que mi jefe nos dé el tiempo para aprender'] }
];

/* ---------- almacenamiento: este navegador + Google Sheets (hoja «Respuestas») ---------- */
const KEY = 'mem_resp_v2', CFG = 'mem_cfg_v2';
MEM.cfg = Object.assign({ desde: 0, evento: 'Feria de Innovación y Conocimiento · Alico' }, LS.get(CFG, {}));
MEM.saveCfg = () => LS.set(CFG, MEM.cfg);
MEM.list = () => { let l = LS.get(KEY, null); if (!l) { l = MEM.seed(); LS.set(KEY, l); } return l; };
MEM.store = l => { try { LS.set(KEY, l); return true; } catch (e) { try { LS.set(KEY, l.map((x, i) => i > 25 ? Object.assign({}, x, { foto: x.ejemplo ? x.foto : null, fotoNube: !!x.foto }) : x)); AL.toast('Memoria llena: fotos antiguas quedan en la nube'); } catch (e2) { AL.toast('No pude guardar en este navegador: descarga el respaldo'); } return false; } };
MEM.get = id => MEM.list().find(x => x.id === id);
MEM.reales = () => MEM.list().filter(x => !x.ejemplo);
MEM.muro = () => MEM.list().filter(x => !MEM.cfg.desde || x.ejemplo || new Date(x.ts).getTime() >= MEM.cfg.desde);
MEM.flat = r => {
  const a = r.a || {}, h = r.h || {}, c = MEM.caso(a.caso) || {};
  return { id: r.id, fecha: r.ts, sesion: r.sesion, ejemplo: r.ejemplo ? 'sí' : '', grupo: r.grupo, participante: r.participante, rol: r.rol, area: r.area,
    p1_tarea_texto: (r.t || [])[0], p1_categoria: MEM.lab(MEM.DOLORES, a.dolor), p2_texto: (r.t || [])[1], p2_horas_semana: a.horas, p2_personas: a.personas, horas_equipo_semana: MEM.horasEquipo(r),
    p3_caso: c.n || '', p3_por_que: (r.t || [])[2], p4_ayuda: (a.ayuda || []).map(k => MEM.lab(MEM.AYUDAS, k)).join(' | '), p4_texto: (r.t || [])[3],
    p5_necesita: (a.barreras || []).map(k => MEM.lab(MEM.BARRERAS, k)).join(' | '), p5_preparacion_1a5: a.listo, p5_texto: (r.t || [])[4],
    idea: h.nombre_idea, historia_usuario: h.historia_usuario, impacto: h.impacto, prioridad: h.prioridad, primer_paso: h.primer_paso, padrino: r.padrino, consentimiento: r.consent ? 'Sí ' + r.consent : '' };
};
MEM.horasEquipo = r => { const a = r.a || {}; return Math.round((+a.horas || 0) * (+a.personas || 1)); };
MEM.save = r => {
  const l = MEM.list(), i = l.findIndex(x => x.id === r.id); r.upd = Date.now(); if (i >= 0) l[i] = r; else l.unshift(r); MEM.store(l);
  if (!r.ejemplo) { AL.queue('respuesta', Object.assign(MEM.flat(r), { titulo: (r.h && r.h.nombre_idea) || r.grupo, json: '' }, { _r: Object.assign({}, r, { foto: null }) })); if (r.foto && AL.hasCloud()) AL.saveFile('resp-' + r.id + '.foto', r.foto, 'text/plain'); }
  return r;
};
MEM.pull = async function () {
  if (!AL.hasCloud()) return false;
  try {
    const rows = (await AL.cloudGet({ action: 'respuestas' })).rows || [], l = MEM.list(); let ch = false;
    rows.forEach(x => { if (!x || !x.id) return; const k = l.findIndex(y => y.id === x.id), loc = k >= 0 ? l[k] : null;
      if (!loc) { l.unshift(x); ch = true; } else if ((x.upd || 0) > (loc.upd || 0)) { Object.assign(loc, x, { foto: loc.foto }); ch = true; } });
    if (ch) MEM.store(l); return ch;
  } catch (e) { return false; }
};
MEM.fetchFoto = async function (r) {
  if (r.foto || r.ejemplo || !AL.hasCloud() || r._ff) return r.foto; r._ff = 1;
  try { r.foto = await AL.loadFile('resp-' + r.id + '.foto'); const l = MEM.list(), k = l.findIndex(x => x.id === r.id); if (k >= 0) { l[k].foto = r.foto; MEM.store(l); } return r.foto; } catch (e) { return null; }
};
/* respaldo completo (con fotos) para no perder nada y unir varios equipos */
MEM.respaldo = () => JSON.stringify({ app: 'memorias-alico', v: 2, fecha: new Date().toISOString(), cfg: MEM.cfg, respuestas: MEM.reales() });
MEM.importar = txt => { const j = JSON.parse(txt); const l = MEM.list(); let n = 0; (j.respuestas || []).forEach(x => { if (!x.id) return; const k = l.findIndex(y => y.id === x.id); if (k < 0) { l.unshift(x); n++; } else if ((x.upd || 0) > (l[k].upd || 0)) { l[k] = x; n++; } }); MEM.store(l); return n; };
MEM.fmtFecha = d => new Date(d).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
MEM.csv = rows => { const cols = Object.keys(rows.reduce((a, r) => Object.assign(a, r), {})); return '﻿' + [cols.join(';')].concat(rows.map(r => cols.map(c => '"' + String(r[c] ?? '').replace(/"/g, '""').replace(/\n/g, ' ') + '"').join(';'))).join('\n'); };

/* ---------- Memo (robot Softgic del manual de marca) ---------- */
MEM.ROBOT = { saludo: 1, presentacion: 1, analisis: 1, aprobacion: 1, senalar: 1, explicacion: 1, cordialidad: 1, complicidad: 1, atencion: 1, calma: 1, alegria: 1, duda: 1 };
MEM.memo = function (o = {}) { const s = o.size || 160, p = MEM.ROBOT[o.pose] ? o.pose : 'saludo'; return `<img class="memo ${o.talk ? 'talk' : ''}" src="assets/robot/${p}.png" alt="Memo, el robot de Softgic" style="height:${s}px;width:auto;max-width:100%;object-fit:contain">`; };

/* ---------- estadísticas para el muro y el informe ---------- */
MEM.stats = function (l) {
  const cnt = (f, arr) => { const o = {}; l.forEach(r => [].concat(f(r) || []).forEach(k => { if (k != null && k !== '') o[k] = (o[k] || 0) + 1; })); return (arr ? arr.map(([k, n]) => [k, n, o[k] || 0]) : Object.entries(o).map(([k, n]) => [k, k, n])).sort((a, b) => b[2] - a[2]); };
  const A = r => r.a || {};
  const casos = MEM.CASOS.map(c => {
    const vot = l.filter(r => A(r).caso === c.id), af = l.filter(r => A(r).caso !== c.id && (c.dolores.includes(A(r).dolor) || (A(r).ayuda || []).some(k => c.ayudas.includes(k))));
    const horas = vot.reduce((s, r) => s + MEM.horasEquipo(r), 0) + af.reduce((s, r) => s + MEM.horasEquipo(r) * .5, 0);
    const areas = {}; vot.concat(af).forEach(r => areas[r.area] = (areas[r.area] || 0) + 1);
    const bar = {}; vot.forEach(r => (A(r).barreras || []).forEach(k => bar[k] = (bar[k] || 0) + 1));
    const listo = vot.filter(r => A(r).listo).map(r => +A(r).listo);
    return Object.assign({}, c, { votos: vot.length, afines: af.length, horas: Math.round(horas), areas: Object.entries(areas).sort((a, b) => b[1] - a[1]), barreras: Object.entries(bar).sort((a, b) => b[1] - a[1]), listo: listo.length ? listo.reduce((a, b) => a + b, 0) / listo.length : 0,
      frases: vot.map(r => (r.t || [])[2] || (r.t || [])[0]).filter(Boolean).slice(0, 4), personas: vot.map(r => r.participante + ' · ' + r.area) });
  });
  const maxV = Math.max(1, ...casos.map(c => c.votos + c.afines * .5)), maxH = Math.max(1, ...casos.map(c => c.horas));
  casos.forEach(c => { c.score = Math.round(100 * (.5 * (c.votos + c.afines * .5) / maxV + .3 * c.horas / maxH + .2 * (4 - c.cx) / 3)); });
  const orden = casos.slice().sort((a, b) => b.score - a.score);
  orden.forEach((c, i) => c.ola = i < 2 ? 1 : i < 4 ? 2 : 3);
  const listo = l.filter(r => A(r).listo).map(r => +A(r).listo);
  return {
    n: l.length, grupos: new Set(l.map(r => r.grupo)).size, personas: new Set(l.map(r => r.participante).filter(Boolean)).size,
    horas: l.reduce((s, r) => s + MEM.horasEquipo(r), 0), listo: listo.length ? listo.reduce((a, b) => a + b, 0) / listo.length : 0, listoDist: [1, 2, 3, 4, 5].map(k => listo.filter(x => x === k).length),
    dolores: cnt(r => A(r).dolor, MEM.DOLORES), ayudas: cnt(r => A(r).ayuda, MEM.AYUDAS), barreras: cnt(r => A(r).barreras, MEM.BARRERAS), areas: cnt(r => r.area),
    casos, orden
  };
};

/* ---------- respuestas de EJEMPLO (se ocultan solas cuando hay respuestas reales) ---------- */
function fotoEj(c1, c2, n) {
  const pp = []; for (let i = 0; i < n; i++) { const x = 70 + i * (340 / n), cc = ['#DA9100', '#00758D', '#B15E14', '#53575A'][i % 4]; pp.push(`<circle cx="${x}" cy="140" r="26" fill="#f1c9a5"/><path d="M${x - 38} 260 q38 -92 76 0Z" fill="${cc}"/><path d="M${x - 26} 130 q26 -40 52 0" fill="#3a2a22"/>`); }
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="480" height="360" fill="url(#g)"/>${pp.join('')}</svg>`);
}
MEM.seed = function () {
  const now = Date.now(), D = [
    ['Grupo 1', 'Marta', 'Líder de turno', 'Producción', 'reportes', 6, 10, 'maestro', ['voz', 'reportes'], ['facil', 'capacitacion'], 4, 'El informe del turno lo llenamos a mano al final, siempre corriendo', 'Reportar hablando, sin papel', 'Turno sin papel', '#F3D9A4', '#DA9100', 4],
    ['Grupo 1', 'Andrés', 'Analista de calidad', 'Calidad', 'inspeccion', 12, 3, 'vision', ['calidad', 'alertas'], ['datos', 'equipos'], 4, 'Revisamos muestras a ojo y el defecto lo encuentra el cliente', 'No depender del ojo cansado', 'Sello a la vista', '#CDEFF4', '#00758D', 3],
    ['Grupo 2', 'Carolina', 'Coordinadora logística', 'Logística', 'pedidos', 6, 3, 'reclamos', ['clasificar', 'alertas'], ['jefe', 'datos'], 3, 'Preguntan todo el día en qué va el pedido y lo busco en tres sistemas', 'Que el cliente sepa solo en qué va', 'Pedido a la vista', '#F6E3C4', '#B15E14', 3],
    ['Grupo 2', 'Jhon', 'Técnico de mantenimiento', 'Mantenimiento', 'paros', 6, 10, 'maestro', ['alertas', 'voz'], ['capacitacion', 'equipos'], 5, 'La misma falla de la selladora vuelve y nadie dejó registro', 'Que la máquina avise antes', 'Falla que no vuelve', '#E8E2D8', '#53575A', 4],
    ['Grupo 3', 'Luz', 'Ingeniera de procesos', 'Innovación y desarrollo', 'informacion', 6, 10, 'conocimiento', ['preguntas'], ['datos', 'confianza'], 4, 'Las fichas técnicas están en carpetas, correos y en la cabeza de dos personas', 'Que el conocimiento no se vaya', 'Pregúntale a la planta', '#D6EEF1', '#00A9C4', 3],
    ['Grupo 3', 'Diego', 'Analista de compras', 'Compras', 'planeacion', 12, 3, 'torre', ['decidir', 'alertas'], ['datos', 'jefe'], 3, 'Armar el pronóstico de resina me toma dos días de Excel', 'Comprar con datos del día', 'Resina a tiempo', '#EFE6D6', '#53575A', 3],
    ['Grupo 4', 'Paola', 'Asesora de servicio', 'Servicio al cliente', 'solicitudes', 6, 10, 'reclamos', ['clasificar', 'reportes'], ['facil', 'capacitacion'], 4, 'Los reclamos llegan por WhatsApp, correo y teléfono y se pierden', 'Ningún reclamo se pierde', 'Cliente escuchado', '#F8E7CC', '#DA9100', 4],
    ['Grupo 4', 'Natalia', 'Jefe de planta', 'Producción', 'coordinacion', 6, 20, 'torre', ['decidir', 'reportes'], ['jefe', 'datos'], 4, 'Para la reunión de las 7 armo el reporte con datos de ayer', 'Decidir con la planta en vivo', 'Planta en una pantalla', '#E6E1D9', '#00758D', 3],
    ['Grupo 5', 'Carlos', 'Operario de impresión', 'Producción', 'inspeccion', 2, 10, 'vision', ['calidad'], ['confianza', 'capacitacion'], 3, 'El registro de impresión se corre y lo vemos tarde', 'Que la cámara me ayude', 'Registro perfecto', '#D3ECF0', '#00A9C4', 4],
    ['Grupo 5', 'Sofía', 'Analista financiera', 'Finanzas', 'reportes', 6, 3, 'torre', ['reportes', 'decidir'], ['datos'], 5, 'El cierre de mes depende de copiar y pegar de Epicor', 'Cierre en horas, no en días', 'Cierre sin Excel', '#EEE3CF', '#B15E14', 3]
  ];
  return D.map(([g, p, rol, area, dolor, horas, personas, caso, ayuda, barreras, listo, t1, t3, idea, c1, c2, n], i) => ({
    id: 'ej' + i, ts: new Date(now - (i + 1) * 23 * 6e4).toISOString(), upd: now, ejemplo: true, sesion: 'EJEMPLO', grupo: g, participante: p, rol, area, consent: 'EJEMPLO',
    a: { dolor, horas, personas, caso, ayuda, barreras, listo }, t: [t1, `Unas ${horas} horas a la semana`, t3, '', ''], foto: fotoEj(c1, c2, n), padrino: 'Por definir',
    h: { nombre_idea: idea, eslogan: t3, historia_usuario: `Como ${rol.toLowerCase()} quiero ${t3.toLowerCase()} para recuperar ${horas} horas a la semana.`, impacto: `${horas * personas} horas/semana del equipo`, prioridad: horas * personas > 40 ? 'Alta' : 'Media', primer_paso: 'Piloto de 4 semanas', caso }
  }));
};
})();

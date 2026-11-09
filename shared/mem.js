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

/* ---------- discovery express: 6 preguntas, voz libre + respuesta rápida (para poder medir) ---------- */
MEM.DOLORES = [['reportes', 'Reportes y digitación a mano'], ['informacion', 'Buscar información o documentos'], ['inspeccion', 'Inspección y control de calidad'], ['paros', 'Paros y fallas de máquina'], ['pedidos', 'Seguimiento a pedidos y despachos'], ['solicitudes', 'Atender solicitudes y reclamos'], ['planeacion', 'Planeación, compras e inventarios'], ['coordinacion', 'Coordinación entre áreas y turnos']];
MEM.HORAS = [['1 h', 1], ['5 h', 5], ['10 h', 10], ['15 h', 15], ['20 h', 20], ['30 h', 30], ['40 h', 40]];
MEM.PERSONAS = [['Solo yo', 1], ['2 a 5', 3], ['6 a 15', 10], ['Más de 15', 20]];
MEM.AYUDAS = [['reportes', 'Que haga los reportes por mí'], ['alertas', 'Que me avise antes de que pase un problema'], ['preguntas', 'Que responda preguntas técnicas al instante'], ['calidad', 'Que revise la calidad automáticamente'], ['clasificar', 'Que clasifique y atienda solicitudes'], ['decidir', 'Que analice datos para decidir mejor'], ['voz', 'Que registre lo que digo por voz']];
MEM.GANAS = [['valor', 'Tiempo para tareas de más valor'], ['errores', 'Menos errores y reprocesos'], ['aprender', 'Aprender nuevas habilidades'], ['cliente', 'Mejor servicio al cliente'], ['tranquilo', 'Turnos más tranquilos, menos estrés'], ['decidir', 'Decidir con datos, no a ojo'], ['seguridad', 'Más seguridad en la operación']];
MEM.APOYOS = [['formacion', 'Formación práctica en mi puesto'], ['tiempo', 'Tiempo para aprender y probar'], ['lider', 'Acompañamiento de mi líder'], ['datos', 'Datos e información ordenados'], ['herramientas', 'Herramientas y equipos adecuados'], ['ideas', 'Un espacio para proponer ideas'], ['claridad', 'Claridad: la IA me ayuda, no me reemplaza']];
MEM.BARRERAS = MEM.APOYOS;   // compatibilidad
MEM.LISTO = ['😐', '🙂', '😊', '😃', '🤩'];
MEM.lab = (arr, k) => (arr.find(x => x[0] === k) || [k, k])[1];
MEM.nombre = r => r.anon ? 'Colaborador(a) de ' + (r.area || 'Alico') : (r.participante || '');
MEM.Q = [
  { k: 'dolor', q: 'Aquí no hay respuestas buenas ni malas. ¿Qué parte de tu trabajo te quita más tiempo o energía?', corto: 'Lo que más tiempo o energía te quita',
    hint: 'Cuéntalo con un ejemplo real, sin nombres ni culpables. Memo marca la categoría por ti; puedes cambiarla.', tipo: 'uno', opts: MEM.DOLORES,
    ej: ['Paso la mañana pasando datos de un formato a Excel', 'Busco fichas técnicas en carpetas y correos', 'El defecto lo vemos cuando el lote ya salió'] },
  { k: 'tiempo', q: '¿Cuántas horas a la semana se te van en eso? ¿Y a cuántas personas de tu equipo les pasa lo mismo?', corto: 'Horas a la semana y personas',
    hint: 'Un número aproximado está bien.', tipo: 'tiempo',
    ej: ['Unas 5 horas a la semana, nos pasa a 6 personas', 'Como 10 horas, solo a mí'] },
  { k: 'ayuda', q: 'Si la inteligencia artificial fuera tu compañera de trabajo, ¿qué te gustaría que hiciera por ti?', corto: 'Lo que quieres que la IA haga por ti',
    hint: 'Elige hasta dos y, si quieres, cuéntalo con tus palabras.', tipo: 'varios', campo: 'ayuda', max: 2, opts: MEM.AYUDAS,
    ej: ['Que me avise cuando una máquina va a fallar', 'Que el informe del turno se haga solo'] },
  { k: 'gana', q: 'Imagina que ya funciona. ¿Qué ganarías tú y tu equipo con ese tiempo libre?', corto: 'Lo que ganarías tú y tu equipo',
    hint: 'Piensa en ti, en tu equipo y en el cliente. Elige hasta dos.', tipo: 'varios', campo: 'gana', max: 2, opts: MEM.GANAS,
    ej: ['Dedicarme a mejorar el proceso en vez de copiar datos', 'Salir a tiempo y con menos estrés'] },
  { k: 'apoyo', q: 'Para crecer con la inteligencia artificial, ¿en qué te gustaría que Alico y tus líderes te apoyen? Y del uno al cinco, ¿qué tantas ganas tienes de aprender?', corto: 'El apoyo que esperas de Alico y tus líderes',
    hint: 'Elige hasta dos apoyos y marca tus ganas de aprender.', tipo: 'apoyo', campo: 'apoyo', max: 2, opts: MEM.APOYOS,
    ej: ['Que nos enseñen en el puesto, con casos reales', 'Que mi jefe nos dé un rato para probar'] },
  { k: 'caso', q: 'Última pregunta. De los cinco casos que viste hoy, ¿cuál te gustaría tener primero en tu área, y por qué?', corto: 'El caso que quieres primero',
    hint: 'Elige uno y cuéntame qué cambiaría en tu trabajo.', tipo: 'caso',
    ej: ['La visión artificial, para no depender del ojo cansado', 'Maestro, porque reportar hablando es más fácil'] }
];

/* ---------- Memo entiende lo que dijiste: sugiere la categoría a partir de la transcripción ---------- */
const KW = {
  dolor: { reportes: /report|excel|digit|formato|papel|planilla|informe|transcrib|copiar|pegar|llenar/, informacion: /busc|ficha|documento|manual|carpeta|correo|informaci|procedimiento/, inspeccion: /calidad|defect|inspecc|muestra|ojo|rechaz|registro de impres/, paros: /paro|falla|m[aá]quina|da[ñn]o|mantenimiento|aver[ií]a|repuesto/, pedidos: /pedido|despach|entrega|env[ií]o|transporte|en qu[eé] va/, solicitudes: /reclam|solicitud|queja|whatsapp|llamad|tel[eé]fono/, planeacion: /planea|compra|inventario|pron[oó]stic|resina|materia prima|stock|proveedor/, coordinacion: /coordin|turno|reuni[oó]n|comunic|[aá]reas|entrega de turno/ },
  ayuda: { reportes: /report|informe|excel|formato/, alertas: /avis|alert|antes de|prevenir|anticip/, preguntas: /pregunt|respond|consult|resolver dudas/, calidad: /calidad|defect|revis|inspecc/, clasificar: /clasific|reclamo|solicitud|atiend|correo/, decidir: /decid|dato|analiz|pron[oó]stic|indicador/, voz: /voz|habl|dict|decir/ },
  gana: { valor: /valor|importante|mejorar|proyecto|pensar/, errores: /error|reproceso|equivoc|rechaz/, aprender: /aprend|capacit|nuevo|crecer/, cliente: /cliente/, tranquilo: /estr[eé]s|tranquil|corr|presi[oó]n|a tiempo|familia/, decidir: /decid|dato/, seguridad: /segur|accident|riesgo/ },
  apoyo: { formacion: /formaci|capacit|curso|ense[ñn]|entren/, tiempo: /tiempo|un rato|espacio para probar/, lider: /jefe|l[ií]der|acompa[ñn]/, datos: /dato|informaci|sistema|epicor/, herramientas: /herramient|equipo|tablet|computador|wifi|internet|celular/, ideas: /idea|propon|escuch/, claridad: /reemplaz|quitar el trabajo|miedo|perder|despid/ },
  caso: { vision: /visi[oó]n|c[aá]mara|inspecc|defect|calidad/, maestro: /maestro|paro|voz|turno|mantenimiento|falla/, conocimiento: /conocimiento|agente|pregunt|ficha|manual|t[eé]cnic/, reclamos: /reclam|cliente|queja|servicio|inteligencia del cliente/, torre: /torre|tablero|pantalla|indicador|gerencia|negocio/ }
};
MEM.sugerir = function (campo, txt) {
  const t = (txt || '').toLowerCase(), m = KW[campo]; if (!m || !t) return [];
  return Object.entries(m).map(([k, re]) => [k, (t.match(new RegExp(re.source, 'g')) || []).length]).filter(x => x[1]).sort((a, b) => b[1] - a[1]).map(x => x[0]);
};
const NUM = { un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, doce: 12, quince: 15, veinte: 20, treinta: 30, cuarenta: 40 };
MEM.numeros = function (txt) {
  const t = (txt || '').toLowerCase().replace(/\b(un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|doce|quince|veinte|treinta|cuarenta)\b/g, w => NUM[w]);
  const near = (v, arr) => arr.reduce((b, x) => Math.abs(x[1] - v) < Math.abs(b[1] - v) ? x : b)[1];
  let h = t.match(/(\d+)\s*(h\b|hora)/), p = t.match(/(\d+)\s*(persona|compa|de nosotros|del equipo|operari)/), o = {};
  if (h) o.horas = near(+h[1] * (/al d[ií]a|diari|cada d[ií]a|todos los d[ií]as/.test(t) ? 5 : 1), MEM.HORAS);
  if (p) o.personas = +p[1] <= 1 ? 1 : +p[1] <= 5 ? 3 : +p[1] <= 15 ? 10 : 20;
  else if (/solo (a )?m[ií]|yo solo|solo yo/.test(t)) o.personas = 1; else if (/todo el equipo|todos/.test(t)) o.personas = 10;
  return o;
};

/* ---------- almacenamiento: este navegador + Google Sheets (hoja «Respuestas») ---------- */
const KEY = 'mem_resp_v3', CFG = 'mem_cfg_v2';
MEM.cfg = Object.assign({ desde: 0, evento: 'Feria de Innovación y Conocimiento · Alico' }, LS.get(CFG, {}));
MEM.saveCfg = () => LS.set(CFG, MEM.cfg);
/* ---------- reinicio general del muro: cada navegador arranca de cero una sola vez, y lo anterior en la nube se ignora ---------- */
MEM.RESET = { id: 'r-2026-11-09', ts: Date.parse('2026-11-09T13:45:00Z') };
if (LS.get('mem_reset', '') !== MEM.RESET.id) {
  LS.set(KEY, []); MEM.cfg.desde = 0; MEM.saveCfg();
  try { localStorage.removeItem('mem_ejec'); localStorage.removeItem('mem_resp_v2'); } catch (e) {}
  try { const ob = LS.get('al_outbox', []) || []; LS.set('al_outbox', ob.filter(it => it.kind !== 'respuesta' && !(it.kind === 'archivo' && /^resp-/.test((it.data || {}).name || '')))); } catch (e) {}
  LS.set('mem_reset', MEM.RESET.id);
}
MEM.list = () => { let l = LS.get(KEY, null); if (!l) { l = MEM.seed(); LS.set(KEY, l); } return l; };
MEM.store = l => { try { LS.set(KEY, l); return true; } catch (e) { try { LS.set(KEY, l.map((x, i) => i > 25 ? Object.assign({}, x, { foto: x.ejemplo ? x.foto : null, fotoNube: !!x.foto }) : x)); AL.toast('Memoria llena: fotos antiguas quedan en la nube'); } catch (e2) { AL.toast('No pude guardar en este navegador: descarga el respaldo'); } return false; } };
MEM.get = id => MEM.list().find(x => x.id === id);
MEM.reales = () => MEM.list().filter(x => !x.ejemplo);
MEM.muro = () => MEM.list().filter(x => !MEM.cfg.desde || x.ejemplo || new Date(x.ts).getTime() >= MEM.cfg.desde);
MEM.flat = r => {
  const a = r.a || {}, h = r.h || {}, c = MEM.caso(a.caso) || {}, t = r.t || [], L = (arr, x) => (x || []).map(k => MEM.lab(arr, k)).join(' | ');
  return { id: r.id, fecha: r.ts, sesion: r.sesion, ejemplo: r.ejemplo ? 'sí' : '', grupo: r.grupo, participante: r.participante, anonimo: r.anon ? 'sí' : '', rol: r.rol, area: r.area,
    p1_tarea_texto: t[0], p1_categoria: MEM.lab(MEM.DOLORES, a.dolor), p2_texto: t[1], p2_horas_semana: a.horas, p2_personas: a.personas, horas_equipo_semana: MEM.horasEquipo(r),
    p3_ayuda_ia: L(MEM.AYUDAS, a.ayuda), p3_texto: t[2], p4_ganaria: L(MEM.GANAS, a.gana), p4_texto: t[3],
    p5_apoyo_alico_lideres: L(MEM.APOYOS, a.apoyo), p5_ganas_aprender_1a5: a.listo, p5_texto: t[4], p6_caso: c.n || '', p6_por_que: t[5],
    idea: h.nombre_idea, eslogan: h.eslogan, historia_usuario: h.historia_usuario, impacto: h.impacto, prioridad: h.prioridad, primer_paso: h.primer_paso, aprendizaje: h.aprendizaje, padrino: r.padrino, consentimiento: r.consent ? 'Sí ' + r.consent : '' };
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
    rows.forEach(x => { if (!x || !x.id || new Date(x.ts).getTime() < MEM.RESET.ts) return; const k = l.findIndex(y => y.id === x.id), loc = k >= 0 ? l[k] : null;
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
  const A = r => r.a || {}, avg = x => x.length ? x.reduce((a, b) => a + b, 0) / x.length : 0, top = (arr, f, L) => { const c = {}; arr.forEach(r => [].concat(f(r) || []).forEach(k => c[k] = (c[k] || 0) + 1)); const k = Object.entries(c).sort((a, b) => b[1] - a[1])[0]; return k ? MEM.lab(L, k[0]) : '—'; };
  const casos = MEM.CASOS.map(c => {
    const vot = l.filter(r => A(r).caso === c.id), af = l.filter(r => A(r).caso !== c.id && (c.dolores.includes(A(r).dolor) || (A(r).ayuda || []).some(k => c.ayudas.includes(k))));
    const horas = vot.reduce((s, r) => s + MEM.horasEquipo(r), 0) + af.reduce((s, r) => s + MEM.horasEquipo(r) * .5, 0);
    const areas = {}; vot.concat(af).forEach(r => areas[r.area] = (areas[r.area] || 0) + 1);
    const ap = {}; vot.forEach(r => (A(r).apoyo || []).forEach(k => ap[k] = (ap[k] || 0) + 1));
    const listo = vot.filter(r => A(r).listo).map(r => +A(r).listo);
    return Object.assign({}, c, { votos: vot.length, afines: af.length, horas: Math.round(horas), areas: Object.entries(areas).sort((a, b) => b[1] - a[1]), apoyos: Object.entries(ap).sort((a, b) => b[1] - a[1]), barreras: Object.entries(ap).sort((a, b) => b[1] - a[1]), listo: avg(listo),
      frases: vot.map(r => (r.t || [])[5] || (r.t || [])[0]).filter(Boolean).slice(0, 4), personas: vot.map(r => MEM.nombre(r) + ' · ' + r.area) });
  });
  const maxV = Math.max(1, ...casos.map(c => c.votos + c.afines * .5)), maxH = Math.max(1, ...casos.map(c => c.horas));
  casos.forEach(c => { c.score = Math.round(100 * (.5 * (c.votos + c.afines * .5) / maxV + .3 * c.horas / maxH + .2 * (4 - c.cx) / 3)); });
  const orden = casos.slice().sort((a, b) => b.score - a.score);
  orden.forEach((c, i) => c.ola = i < 2 ? 1 : i < 4 ? 2 : 3);
  const listo = l.filter(r => A(r).listo).map(r => +A(r).listo);
  /* diagnóstico por equipo (área) */
  const porArea = {}; l.forEach(r => (porArea[r.area || 'Otra'] = porArea[r.area || 'Otra'] || []).push(r));
  const equipos = Object.entries(porArea).map(([area, rs]) => ({ area, n: rs.length, horas: rs.reduce((s, r) => s + MEM.horasEquipo(r), 0), dolor: top(rs, r => A(r).dolor, MEM.DOLORES), ayuda: top(rs, r => A(r).ayuda, MEM.AYUDAS), apoyo: top(rs, r => A(r).apoyo, MEM.APOYOS), gana: top(rs, r => A(r).gana, MEM.GANAS), caso: top(rs, r => A(r).caso, MEM.CASOS.map(c => [c.id, c.ic + ' ' + c.n])), listo: avg(rs.filter(r => A(r).listo).map(r => +A(r).listo)) })).sort((a, b) => b.horas - a.horas);
  const apoyos = cnt(r => A(r).apoyo, MEM.APOYOS);
  return {
    n: l.length, grupos: new Set(l.map(r => r.grupo)).size, personas: new Set(l.map(r => r.participante).filter(Boolean)).size,
    horas: l.reduce((s, r) => s + MEM.horasEquipo(r), 0), listo: avg(listo), listoDist: [1, 2, 3, 4, 5].map(k => listo.filter(x => x === k).length),
    dolores: cnt(r => A(r).dolor, MEM.DOLORES), ayudas: cnt(r => A(r).ayuda, MEM.AYUDAS), ganas: cnt(r => A(r).gana, MEM.GANAS), apoyos, barreras: apoyos, areas: cnt(r => r.area),
    casos, orden, equipos
  };
};

/* ---------- respuestas de EJEMPLO (se ocultan solas cuando hay respuestas reales) ---------- */
function fotoEj(c1, c2, n) {
  const pp = []; for (let i = 0; i < n; i++) { const x = 70 + i * (340 / n), cc = ['#DA9100', '#00758D', '#B15E14', '#53575A'][i % 4]; pp.push(`<circle cx="${x}" cy="140" r="26" fill="#f1c9a5"/><path d="M${x - 38} 260 q38 -92 76 0Z" fill="${cc}"/><path d="M${x - 26} 130 q26 -40 52 0" fill="#3a2a22"/>`); }
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="480" height="360" fill="url(#g)"/>${pp.join('')}</svg>`);
}
MEM.seed = function () {
  const now = Date.now(), D = [
    ['Grupo 1', 'Marta', 'Líder de turno', 'Producción', 'reportes', 5, 10, 'maestro', ['voz', 'reportes'], ['valor', 'tranquilo'], ['formacion', 'tiempo'], 4, 'El informe del turno lo llenamos a mano al final, siempre corriendo', 'Reportar hablando, sin papel', 'Turno sin papel', '#F3D9A4', '#DA9100', 4],
    ['Grupo 1', 'Andrés', 'Analista de calidad', 'Calidad', 'inspeccion', 10, 3, 'vision', ['calidad', 'alertas'], ['errores', 'cliente'], ['datos', 'herramientas'], 4, 'Revisamos muestras a ojo y el defecto lo encuentra el cliente', 'No depender del ojo cansado', 'Sello a la vista', '#CDEFF4', '#00758D', 3],
    ['Grupo 2', 'Carolina', 'Coordinadora logística', 'Logística', 'pedidos', 5, 3, 'reclamos', ['clasificar', 'alertas'], ['cliente', 'tranquilo'], ['lider', 'datos'], 3, 'Preguntan todo el día en qué va el pedido y lo busco en tres sistemas', 'Que el cliente sepa solo en qué va', 'Pedido a la vista', '#F6E3C4', '#B15E14', 3],
    ['Grupo 2', 'Jhon', 'Técnico de mantenimiento', 'Mantenimiento', 'paros', 5, 10, 'maestro', ['alertas', 'voz'], ['seguridad', 'errores'], ['formacion', 'herramientas'], 5, 'La misma falla de la selladora vuelve y nadie dejó registro', 'Que la máquina avise antes', 'Falla que no vuelve', '#E8E2D8', '#53575A', 4],
    ['Grupo 3', 'Luz', 'Ingeniera de procesos', 'Innovación y desarrollo', 'informacion', 5, 10, 'conocimiento', ['preguntas'], ['aprender', 'valor'], ['datos', 'claridad'], 4, 'Las fichas técnicas están en carpetas, correos y en la cabeza de dos personas', 'Que el conocimiento no se vaya', 'Pregúntale a la planta', '#D6EEF1', '#00A9C4', 3],
    ['Grupo 3', 'Diego', 'Analista de compras', 'Compras', 'planeacion', 15, 3, 'torre', ['decidir', 'alertas'], ['decidir', 'valor'], ['datos', 'lider'], 3, 'Armar el pronóstico de resina me toma dos días de Excel', 'Comprar con datos del día', 'Resina a tiempo', '#EFE6D6', '#53575A', 3],
    ['Grupo 4', 'Paola', 'Asesora de servicio', 'Servicio al cliente', 'solicitudes', 5, 10, 'reclamos', ['clasificar', 'reportes'], ['cliente', 'aprender'], ['formacion', 'ideas'], 4, 'Los reclamos llegan por WhatsApp, correo y teléfono y se pierden', 'Ningún reclamo se pierde', 'Cliente escuchado', '#F8E7CC', '#DA9100', 4],
    ['Grupo 4', 'Natalia', 'Jefe de planta', 'Producción', 'coordinacion', 5, 20, 'torre', ['decidir', 'reportes'], ['decidir', 'valor'], ['lider', 'datos'], 4, 'Para la reunión de las 7 armo el reporte con datos de ayer', 'Decidir con la planta en vivo', 'Planta en una pantalla', '#E6E1D9', '#00758D', 3],
    ['Grupo 5', 'Carlos', 'Operario de impresión', 'Producción', 'inspeccion', 1, 10, 'vision', ['calidad'], ['errores', 'aprender'], ['claridad', 'formacion'], 3, 'El registro de impresión se corre y lo vemos tarde', 'Que la cámara me ayude', 'Registro perfecto', '#D3ECF0', '#00A9C4', 4],
    ['Grupo 5', 'Sofía', 'Analista financiera', 'Finanzas', 'reportes', 5, 3, 'torre', ['reportes', 'decidir'], ['valor', 'tranquilo'], ['datos'], 5, 'El cierre de mes depende de copiar y pegar de Epicor', 'Cierre en horas, no en días', 'Cierre sin Excel', '#EEE3CF', '#B15E14', 3]
  ];
  return D.map(([g, p, rol, area, dolor, horas, personas, caso, ayuda, gana, apoyo, listo, t1, t6, idea, c1, c2, n], i) => ({
    id: 'ej' + i, ts: new Date(now - (i + 1) * 23 * 6e4).toISOString(), upd: now, ejemplo: true, sesion: 'EJEMPLO', grupo: g, participante: p, rol, area, consent: 'EJEMPLO',
    a: { dolor, horas, personas, caso, ayuda, gana, apoyo, listo }, t: [t1, `Unas ${horas} horas a la semana`, '', '', '', t6], foto: fotoEj(c1, c2, n), padrino: 'Por definir',
    h: { nombre_idea: idea, eslogan: t6, historia_usuario: `Como ${rol.toLowerCase()} de ${area} quiero ${t6.toLowerCase()} para recuperar ${horas} horas a la semana y dedicarlas a mejorar el proceso.`, impacto: `${horas * personas} horas/semana del equipo`, prioridad: horas * personas > 40 ? 'Alta' : 'Media', primer_paso: 'Piloto de 4 semanas', aprendizaje: 'Trabajar con un asistente de IA en su puesto', caso }
  }));
};

/* ---------- empaque futurista Alico: la idea «empacada» en un doypack metálico que brilla ---------- */
MEM.empaque = function (o = {}) {
  const E = AL.esc, id = 'pk' + Math.random().toString(36).slice(2, 7), c = MEM.caso(o.caso) || {};
  const body = 'M48 30H252Q258 30 258 36L264 318Q266 350 238 360Q150 384 62 360Q34 350 36 318L42 36Q42 30 48 30Z';
  const lote = 'IA-' + new Date().getFullYear() + '·' + String(o.id || '0000').slice(-4).toUpperCase();
  const bars = Array.from({ length: 26 }, (_, i) => `<rect x="${196 + i * 2.1}" y="318" width="${[1, .6, 1.4, .8][i % 4]}" height="22" fill="#F2B33D" opacity=".75"/>`).join('');
  const spark = [[24, 70, 0], [280, 110, .7], [18, 250, 1.3], [286, 300, .4], [150, 6, 1.9], [270, 30, 1.1], [30, 380, 2.2]].map(([x, y, d]) => `<path class="tw" style="animation-delay:${d}s" d="M${x} ${y - 9}L${x + 2.5} ${y - 2.5}L${x + 9} ${y}L${x + 2.5} ${y + 2.5}L${x} ${y + 9}L${x - 2.5} ${y + 2.5}L${x - 9} ${y}L${x - 2.5} ${y - 2.5}Z" fill="#FFE7A8"/>`).join('');
  return `<svg class="empaque" viewBox="-10 -14 320 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Empaque Alico de la idea ${E(o.nombre || '')}">
  <defs>
    <radialGradient id="${id}a" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F2B33D" stop-opacity=".75"/><stop offset=".55" stop-color="#DA9100" stop-opacity=".18"/><stop offset="1" stop-color="#DA9100" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E261C"/><stop offset=".45" stop-color="#15120E"/><stop offset="1" stop-color="#0B0A08"/></linearGradient>
    <linearGradient id="${id}h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#DA9100"/><stop offset=".3" stop-color="#FFE7A8"/><stop offset=".55" stop-color="#F2B33D"/><stop offset=".78" stop-color="#7FE3F0"/><stop offset="1" stop-color="#DA9100"/></linearGradient>
    <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="${id}e" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".12" stop-color="#fff" stop-opacity="0"/><stop offset=".88" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".14"/></linearGradient>
    <clipPath id="${id}c"><path d="${body}"/></clipPath>
    <filter id="${id}g" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <ellipse class="aura" cx="150" cy="200" rx="165" ry="200" fill="url(#${id}a)"/>
  <ellipse cx="150" cy="384" rx="112" ry="10" fill="#000" opacity=".28"/>
  <g class="float">
    <path d="${body}" fill="url(#${id}b)" stroke="url(#${id}h)" stroke-width="2.5" filter="url(#${id}g)"/>
    <g clip-path="url(#${id}c)">
      <rect x="30" y="30" width="240" height="26" fill="#0A0907"/>${Array.from({ length: 60 }, (_, i) => `<rect x="${40 + i * 3.7}" y="32" width="1.2" height="22" fill="#2E271F"/>`).join('')}<rect x="130" y="38" width="40" height="9" rx="4.5" fill="#1A1510" stroke="#DA9100" stroke-opacity=".6"/>
      <path d="M30 64H270" stroke="url(#${id}h)" stroke-width="2" stroke-dasharray="3 3"/>
      <path d="M36 300Q150 330 264 300" stroke="#fff" stroke-opacity=".12" stroke-width="1.5" fill="none"/>
      <path d="M38 300C110 268 190 330 262 292V400H38Z" fill="url(#${id}h)" opacity=".16"/>
      <path d="M38 132C120 110 200 150 262 120" stroke="url(#${id}h)" stroke-width="1.2" fill="none" opacity=".7"/>
      <path d="M38 142C120 120 200 160 262 130" stroke="url(#${id}h)" stroke-width=".6" fill="none" opacity=".45"/>
      <rect x="30" y="30" width="240" height="350" fill="url(#${id}e)"/>
      <rect class="sheen" x="-160" y="0" width="90" height="420" fill="url(#${id}s)" transform="skewX(-18)"/>
    </g>
    <path d="M42 58l7 4-7 4M258 58l-7 4 7 4" fill="#DA9100"/>
    <image href="assets/alico.png" x="88" y="78" width="124" height="40" preserveAspectRatio="xMidYMid meet"/>
    <text x="150" y="164" text-anchor="middle" font-family="Plus Jakarta Sans,Poppins,sans-serif" font-size="9.5" font-weight="800" letter-spacing="3" fill="#F2B33D">IDEA EMPACADA · GEN IA</text>
    <foreignObject x="54" y="172" width="192" height="98"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Plus Jakarta Sans',Poppins,sans-serif;color:#fff;text-align:center;font-weight:800;font-size:22px;line-height:1.1;letter-spacing:-.02em;display:flex;align-items:center;justify-content:center;height:98px;overflow:hidden">${E(o.nombre || 'Mi idea')}</div></foreignObject>
    <foreignObject x="58" y="268" width="184" height="40"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Plus Jakarta Sans',Poppins,sans-serif;color:#E8DCC6;text-align:center;font-size:10.5px;line-height:1.3;overflow:hidden;height:40px">${E(o.eslogan || '')}</div></foreignObject>
    <text x="58" y="328" font-family="Plus Jakarta Sans,Poppins,sans-serif" font-size="8" font-weight="700" fill="#B8A88C">${E(c.ic ? c.ic + ' ' + c.n : 'Orgullosamente Alico')}</text>
    <text x="58" y="341" font-family="ui-monospace,monospace" font-size="7.5" fill="#8E806A">LOTE ${E(lote)}</text>
    ${bars}
  </g>
  ${spark}
</svg>`;
};
MEM.empaqueCSS = `.empaque{width:100%;height:auto;overflow:visible}.empaque .float{animation:pkf 4s ease-in-out infinite;transform-origin:150px 200px}.empaque .aura{animation:pka 3s ease-in-out infinite;transform-origin:150px 200px}.empaque .sheen{animation:pks 3.4s ease-in-out infinite}.empaque .tw{animation:pkt 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes pkf{50%{transform:translateY(-7px) rotate(-1deg)}}@keyframes pka{50%{opacity:.6;transform:scale(1.06)}}@keyframes pks{0%{transform:skewX(-18deg) translateX(0)}60%,100%{transform:skewX(-18deg) translateX(520px)}}@keyframes pkt{0%,100%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1)}}`;
})();

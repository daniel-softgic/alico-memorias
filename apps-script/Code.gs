/**
 * Taller de IA · Alico — backend en Google Apps Script (Sheets + Drive)
 * Un solo script atiende los dos portales (GEN IA y «Empaquemos estas memorias»):
 *   Eventos, Turnos, Casos  → Maestro
 *   Reclamos                → Centro de inteligencia del cliente
 *   Preguntas, Inspecciones → Agente técnico y Visión artificial
 *   Drive/Alico-Taller-IA/Modelos      → modelo de visión (archivo)
 *   Drive/Alico-Taller-IA/Conocimiento → documentos que alimentan al agente técnico (txt, md, Google Docs)
 *
 * INSTALACIÓN
 * 1) Crea una Hoja de cálculo de Google (vacía) y abre Extensiones > Apps Script.
 * 2) Pega este código y cambia SECRET por una clave tuya.
 * 3) Ejecuta una vez la función «autorizar» (concede permisos de Hojas y Drive).
 * 4) Implementar > Nueva implementación > Aplicación web: Ejecutar como «Yo», acceso «Cualquier usuario».
 * 5) Copia la URL (termina en /exec) en Ajustes del taller > «URL de la nube».
 */
const SECRET = 'CAMBIA_ESTA_CLAVE';
const HOJA_ID = '';                  // opcional: ID de la hoja si el script NO está creado desde la hoja (Extensiones › Apps Script)
function ss_() { return HOJA_ID ? SpreadsheetApp.openById(HOJA_ID) : SpreadsheetApp.getActiveSpreadsheet(); }
const CARPETA = 'Alico-Taller-IA';
const CORREOS = true;                 // envía al cliente un correo al crear su reclamo y cada vez que cambia de estado
const COPIA_EQUIPO = '';              // opcional: correo del equipo de servicio que recibe copia (ej. servicio@alico-sa.com)
const REMITENTE = 'Servicio al Cliente · Alico (demo Softgic)';

const COLS = {
  Eventos: ['id', 'ts', 'sesion', 'tipo', 'caso_id', 'area', 'via', 'ok', 'ms', 'min', 'operario', 'turno', 'detalle', 'ejemplo'],
  Casos:   ['id', 'estado', 'autor', 'area', 'titulo', 'ts', 'json'],
  Turnos:  ['id', 'ts', 'sesion', 'operario', 'turno', 'maquina', 'paros_min', 'resumen_audio', 'alertas', 'pendientes', 'texto_original']
};
const GENERICA = ['id', 'ts', 'sesion', 'titulo', 'estado', 'json'];
/* portal «Empaquemos estas memorias»: una fila legible por respuesta (este es el informe del evento) */
COLS.Respuestas = ['id', 'fecha', 'sesion', 'grupo', 'participante', 'rol', 'area', 'p1_categoria', 'p1_tarea_texto', 'p2_horas_semana', 'p2_personas', 'horas_equipo_semana', 'p3_caso', 'p3_por_que', 'p4_ayuda', 'p4_texto', 'p5_necesita', 'p5_preparacion_1a5', 'p5_texto', 'idea', 'historia_usuario', 'impacto', 'prioridad', 'primer_paso', 'padrino', 'consentimiento', 'json'];

function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function cap_(s) { s = String(s || '').replace(/[^A-Za-z0-9_]/g, ''); return s.charAt(0).toUpperCase() + s.slice(1); }

function sheet_(name, cols) {
  const ss = ss_();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(cols); sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, cols.length).setFontWeight('bold').setBackground('#FDE9CF');
  }
  return sh;
}
function rowFrom_(cols, d) {
  return cols.map(function (c) {
    const v = d[c];
    if (v === undefined || v === null) return '';
    const s = (typeof v === 'object') ? JSON.stringify(v) : v;
    return (typeof s === 'string' && s.length > 45000) ? s.slice(0, 45000) : s;
  });
}
function upsert_(sh, cols, d) {
  const last = sh.getLastRow();
  const ids = last > 1 ? sh.getRange(2, 1, last - 1, 1).getValues().map(function (r) { return String(r[0]); }) : [];
  const idx = ids.indexOf(String(d.id));
  const row = rowFrom_(cols, d);
  if (idx >= 0) sh.getRange(idx + 2, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
}
function carpeta_(sub) {
  let it = DriveApp.getFoldersByName(CARPETA);
  const raiz = it.hasNext() ? it.next() : DriveApp.createFolder(CARPETA);
  if (!sub) return raiz;
  it = raiz.getFoldersByName(sub);
  return it.hasNext() ? it.next() : raiz.createFolder(sub);
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'json' }); }
  const portal = !!body.portal && body.portal === portalKey_();   // celular del cliente (QR): solo puede crear reclamos y su foto
  if (body.secret !== SECRET && !portal) return out_({ ok: false, error: 'auth' });
  if (portal) body.items = (body.items || []).filter(function (it) { return it.kind === 'reclamo' || (it.kind === 'archivo' && /^reclamo-[\w-]+\.foto$/.test((it.data || {}).name || '')); }).slice(0, 2);
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    let n = 0;
    (body.items || []).forEach(function (it) {
      const d = it.data || {};
      if (it.kind === 'evento') { sheet_('Eventos', COLS.Eventos).appendRow(rowFrom_(COLS.Eventos, d)); n++; }
      else if (it.kind === 'turno') { sheet_('Turnos', COLS.Turnos).appendRow(rowFrom_(COLS.Turnos, d)); n++; }
      else if (it.kind === 'caso') { upsert_(sheet_('Casos', COLS.Casos), COLS.Casos, Object.assign({}, d, { json: JSON.stringify(d), ts: d.ts || new Date().toISOString() })); n++; }
      else if (it.kind === 'archivo') {
        const f = carpeta_('Modelos'), files = f.getFilesByName(d.name);
        if (files.hasNext()) files.next().setContent(d.content); else f.createFile(d.name, d.content, d.mime || 'application/json');
        n++;
      } else if (it.kind === 'respuesta') {
        upsert_(sheet_('Respuestas', COLS.Respuestas), COLS.Respuestas, Object.assign({}, d, { json: JSON.stringify(d._r || d) })); n++;
      } else if (it.kind === 'reclamo') {
        const sh = sheet_('Reclamos', GENERICA), prev = buscar_(sh, d.id);
        upsert_(sh, GENERICA, Object.assign({ ts: new Date().toISOString() }, d, { json: JSON.stringify(d) })); n++;
        if (CORREOS && !d.ejemplo) {
          if (!prev) avisar_(d, 'nuevo'); else if (prev.estado !== d.estado) avisar_(d, 'estado');
        }
      } else if (/^[a-z_]{3,24}$/.test(it.kind)) {
        const nombre = cap_(it.kind) + 's';
        upsert_(sheet_(nombre, GENERICA), GENERICA, Object.assign({ ts: new Date().toISOString() }, d, { json: JSON.stringify(d) })); n++;
      }
    });
    return out_({ ok: true, guardados: n });
  } finally { lock.releaseLock(); }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'estado' && p.portal && p.portal === portalKey_()) {   // el cliente consulta SU reclamo por código
    const sh = ss_().getSheetByName('Reclamos');
    if (!sh || sh.getLastRow() < 2) return out_({ ok: true, reclamo: null });
    const rows = sh.getRange(2, 1, sh.getLastRow() - 1, GENERICA.length).getValues();
    for (let i = rows.length - 1; i >= 0; i--) if (String(rows[i][0]) === String(p.id)) { try { const r = JSON.parse(rows[i][5]); return out_({ ok: true, reclamo: { id: r.id, tipo: r.tipo, producto: r.producto, estado: r.estado, upd: r.upd, respuesta: r.estado === 'respondido' || r.estado === 'cerrado' ? r.respuesta : '', hist: (r.hist || []).slice(-6) } }); } catch (err) {} }
    return out_({ ok: true, reclamo: null });
  }
  if (p.secret !== SECRET) return out_({ ok: false, error: 'auth' });
  if (p.action === 'ping') { let q = null; try { q = MailApp.getRemainingDailyQuota() + ' disponibles hoy'; } catch (err) {} return out_({ ok: true, ts: new Date().toISOString(), correo: q }); }

  if (p.action === 'casos') {                       // fichas de Maestro
    const sh = sheet_('Casos', COLS.Casos), last = sh.getLastRow();
    if (last < 2) return out_({ ok: true, casos: [] });
    const rows = sh.getRange(2, 1, last - 1, COLS.Casos.length).getValues();
    const casos = rows.map(function (r) { try { const c = JSON.parse(r[6]); c.estado = r[1] || c.estado; return c; } catch (err) { return null; } }).filter(Boolean);
    return out_({ ok: true, casos: casos });
  }
  if (p.action === 'rows') {                        // cualquier hoja genérica (Reclamos, Preguntas…)
    const nombre = cap_(p.sheet) + (/s$/.test(p.sheet) ? '' : 's');
    const sh = ss_().getSheetByName(nombre);
    if (!sh || sh.getLastRow() < 2) return out_({ ok: true, rows: [] });
    const last = sh.getLastRow(), n = Math.min(parseInt(p.n || '500', 10), last - 1);
    const rows = sh.getRange(last - n + 1, 1, n, GENERICA.length).getValues().map(function (r) { try { return JSON.parse(r[5]); } catch (err) { return null; } }).filter(Boolean);
    return out_({ ok: true, rows: rows });
  }
  if (p.action === 'respuestas') {                  // portal de memorias: trae todas las respuestas
    const sh = ss_().getSheetByName('Respuestas');
    if (!sh || sh.getLastRow() < 2) return out_({ ok: true, rows: [] });
    const c = COLS.Respuestas.length, rows = sh.getRange(2, 1, sh.getLastRow() - 1, c).getValues().map(function (r) { try { return JSON.parse(r[c - 1]); } catch (err) { return null; } }).filter(Boolean);
    return out_({ ok: true, rows: rows });
  }
  if (p.action === 'eventos') {
    const sh = sheet_('Eventos', COLS.Eventos), last = sh.getLastRow();
    if (last < 2) return out_({ ok: true, eventos: [] });
    const n = Math.min(parseInt(p.n || '500', 10), last - 1);
    const rows = sh.getRange(last - n + 1, 1, n, COLS.Eventos.length).getValues();
    return out_({ ok: true, eventos: rows.map(function (r) { const o = {}; COLS.Eventos.forEach(function (c, i) { o[c] = r[i]; }); return o; }) });
  }
  if (p.action === 'archivo') {                     // modelo de visión u otros archivos
    const files = carpeta_('Modelos').getFilesByName(p.name);
    if (!files.hasNext()) return out_({ ok: false, error: 'no_existe' });
    return out_({ ok: true, content: files.next().getBlob().getDataAsString() });
  }
  if (p.action === 'docs') {                        // conocimiento técnico desde Drive
    const docs = [], it = carpeta_('Conocimiento').getFiles();
    while (it.hasNext()) {
      const f = it.next(), mt = f.getMimeType();
      try {
        if (mt === 'application/vnd.google-apps.document') docs.push({ name: f.getName(), text: DocumentApp.openById(f.getId()).getBody().getText() });
        else if (mt.indexOf('text/') === 0) docs.push({ name: f.getName(), text: f.getBlob().getDataAsString() });
      } catch (err) {}
    }
    return out_({ ok: true, docs: docs });
  }
  return out_({ ok: false, error: 'accion' });
}

/* ---------- correos al cliente ---------- */
function buscar_(sh, id) {
  const last = sh.getLastRow(); if (last < 2) return null;
  const rows = sh.getRange(2, 1, last - 1, GENERICA.length).getValues();
  for (let i = rows.length - 1; i >= 0; i--) if (String(rows[i][0]) === String(id)) { try { return JSON.parse(rows[i][5]); } catch (err) { return { estado: rows[i][4] }; } }
  return null;
}
const ESTADOS_ = { nuevo: 'Recibido', triage: 'En análisis', investigacion: 'Buscando la causa', decision: 'En decisión', ejecutado: 'Solución en proceso', respondido: 'Respondido', cerrado: 'Cerrado' };
const ORDEN_ = ['nuevo', 'triage', 'investigacion', 'decision', 'ejecutado', 'respondido', 'cerrado'];
function avisar_(r, motivo) {
  const para = String(r.contacto || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(para)) return;               // solo si dejó un correo válido
  const est = ESTADOS_[r.estado] || r.estado, k = ORDEN_.indexOf(r.estado);
  const pasos = ORDEN_.map(function (e, i) { const on = i <= k; return '<td style="padding:6px 4px;text-align:center;font:12px Arial;color:' + (on ? '#1c9a5b' : '#9a9a9a') + '"><div style="width:22px;height:22px;border-radius:50%;margin:0 auto 4px;background:' + (on ? '#1c9a5b' : '#e6e0d6') + ';color:#fff;line-height:22px">' + (on ? '✓' : '') + '</div>' + ESTADOS_[e] + '</td>'; }).join('');
  const asunto = motivo === 'nuevo' ? 'Recibimos tu reclamo ' + r.id + ' · Alico' : 'Tu reclamo ' + r.id + ' cambió a «' + est + '» · Alico';
  const intro = motivo === 'nuevo' ? 'Gracias por avisarnos. Ya registramos tu caso y el equipo lo está revisando.' : 'Tu caso avanzó. Este es su estado actual:';
  const resp = (r.estado === 'respondido' || r.estado === 'cerrado') && r.respuesta ? '<div style="background:#f2fbfd;border:1px solid #b9eaf1;border-radius:12px;padding:14px;margin:14px 0;white-space:pre-wrap;font:14px Arial;color:#2b2e30">' + esc_(r.respuesta) + '</div>' : '';
  const link = r.seguimiento ? '<p style="text-align:center;margin:18px 0"><a href="' + r.seguimiento + '" style="background:#EE7623;color:#fff;text-decoration:none;font:bold 15px Arial;padding:12px 22px;border-radius:12px;display:inline-block">Ver el estado de mi reclamo</a></p>' : '';
  const html = '<div style="max-width:560px;margin:auto;font-family:Arial,sans-serif;color:#2b2e30"><div style="background:#EE7623;color:#fff;padding:18px 22px;border-radius:14px 14px 0 0"><div style="font-size:13px;opacity:.9">Servicio al Cliente · Alico</div><div style="font-size:22px;font-weight:bold">Reclamo ' + r.id + '</div></div>' +
    '<div style="border:1px solid #f0e2d0;border-top:0;border-radius:0 0 14px 14px;padding:18px 22px"><p style="font-size:15px">Hola ' + esc_(r.cliente || '') + ',</p><p style="font-size:15px">' + intro + '</p>' +
    '<p style="font-size:15px"><b>Estado:</b> ' + est + '<br><b>Producto:</b> ' + esc_(r.producto_n || r.producto || '') + '<br><b>Pedido:</b> ' + esc_(r.pedido || '') + '</p><table style="width:100%;border-collapse:collapse"><tr>' + pasos + '</tr></table>' + resp + link +
    '<p style="font-size:12px;color:#888">Este correo hace parte de una demostración del Centro de inteligencia del cliente (Softgic para Alico). Si no reconoces este reclamo, ignóralo.</p></div></div>';
  try { MailApp.sendEmail({ to: para, cc: COPIA_EQUIPO || undefined, subject: asunto, htmlBody: html, name: REMITENTE }); } catch (err) { console.log('correo: ' + err); }
}
function esc_(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

/** Clave del portal del cliente: se deriva del SECRET (el PC la calcula igual) y solo permite crear reclamos. */
function portalKey_() {
  const d = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'portal:' + SECRET, Utilities.Charset.UTF_8);
  return d.slice(0, 8).map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
}

/** Ejecuta esta función una vez para autorizar Hojas y Drive. */
function autorizar() {
  ss_().getName();
  MailApp.getRemainingDailyQuota();                   // pide el permiso para enviar correos a los clientes
  carpeta_('Conocimiento'); carpeta_('Modelos');
}

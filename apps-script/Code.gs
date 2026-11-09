/**
 * Cápsula de Memorias + Taller de IA · Alico — backend en Google Apps Script (Sheets + Drive)
 * Un solo script atiende los 5 casos:
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
const CARPETA = 'Alico-Taller-IA';

const COLS = {
  Eventos: ['id', 'ts', 'sesion', 'tipo', 'caso_id', 'area', 'via', 'ok', 'ms', 'min', 'operario', 'turno', 'detalle', 'ejemplo'],
  Casos:   ['id', 'estado', 'autor', 'area', 'titulo', 'ts', 'json'],
  Ideas:   ['id', 'ts', 'sesion', 'grupo', 'participante', 'rol', 'area', 'nombre_idea', 'historia_usuario', 'problema', 'impacto', 'horas_semana', 'prioridad', 'complejidad', 'tipo_ia', 'primer_paso', 'fecha_objetivo', 'padrino', 'consentimiento', 'respuestas', 'json'],
  Turnos:  ['id', 'ts', 'sesion', 'operario', 'turno', 'maquina', 'paros_min', 'resumen_audio', 'alertas', 'pendientes', 'texto_original']
};
const GENERICA = ['id', 'ts', 'sesion', 'titulo', 'estado', 'json'];

function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function cap_(s) { s = String(s || '').replace(/[^A-Za-z0-9_]/g, ''); return s.charAt(0).toUpperCase() + s.slice(1); }

function sheet_(name, cols) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
  if (body.secret !== SECRET) return out_({ ok: false, error: 'auth' });
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    let n = 0;
    (body.items || []).forEach(function (it) {
      const d = it.data || {};
      if (it.kind === 'evento') { sheet_('Eventos', COLS.Eventos).appendRow(rowFrom_(COLS.Eventos, d)); n++; }
      else if (it.kind === 'turno') { sheet_('Turnos', COLS.Turnos).appendRow(rowFrom_(COLS.Turnos, d)); n++; }
      else if (it.kind === 'caso') { upsert_(sheet_('Casos', COLS.Casos), COLS.Casos, Object.assign({}, d, { json: JSON.stringify(d), ts: d.ts || new Date().toISOString() })); n++; }
      else if (it.kind === 'idea') { upsert_(sheet_('Ideas', COLS.Ideas), COLS.Ideas, Object.assign({ ts: new Date().toISOString() }, d, { json: JSON.stringify(d) })); n++; }
      else if (it.kind === 'archivo') {
        const f = carpeta_('Modelos'), files = f.getFilesByName(d.name);
        if (files.hasNext()) files.next().setContent(d.content); else f.createFile(d.name, d.content, d.mime || 'application/json');
        n++;
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
  if (p.secret !== SECRET) return out_({ ok: false, error: 'auth' });
  if (p.action === 'ping') return out_({ ok: true, ts: new Date().toISOString() });

  if (p.action === 'casos') {                       // fichas de Maestro
    const sh = sheet_('Casos', COLS.Casos), last = sh.getLastRow();
    if (last < 2) return out_({ ok: true, casos: [] });
    const rows = sh.getRange(2, 1, last - 1, COLS.Casos.length).getValues();
    const casos = rows.map(function (r) { try { const c = JSON.parse(r[6]); c.estado = r[1] || c.estado; return c; } catch (err) { return null; } }).filter(Boolean);
    return out_({ ok: true, casos: casos });
  }
  if (p.action === 'rows') {                        // cualquier hoja genérica (Reclamos, Preguntas…)
    const nombre = cap_(p.sheet) + (/s$/.test(p.sheet) ? '' : 's');
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombre);
    if (!sh || sh.getLastRow() < 2) return out_({ ok: true, rows: [] });
    const last = sh.getLastRow(), n = Math.min(parseInt(p.n || '500', 10), last - 1);
    const rows = sh.getRange(last - n + 1, 1, n, GENERICA.length).getValues().map(function (r) { try { return JSON.parse(r[5]); } catch (err) { return null; } }).filter(Boolean);
    return out_({ ok: true, rows: rows });
  }
  if (p.action === 'ideas') {                       // portal Cápsula de Memorias
    const sh = sheet_('Ideas', COLS.Ideas), last = sh.getLastRow();
    if (last < 2) return out_({ ok: true, rows: [] });
    const rows = sh.getRange(2, 1, last - 1, COLS.Ideas.length).getValues().map(function (r) { try { return JSON.parse(r[COLS.Ideas.length - 1]); } catch (err) { return null; } }).filter(Boolean);
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

/** Ejecuta esta función una vez para autorizar Hojas y Drive. */
function autorizar() {
  SpreadsheetApp.getActiveSpreadsheet().getName();
  carpeta_('Conocimiento'); carpeta_('Modelos');
}

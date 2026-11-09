/* Taller de IA · Alico — núcleo común: configuración, IA (Claude), nube (Google Sheets + Drive), voz, barra de caso */
(function () {
'use strict';
const AL = window.AL = {};
const $ = (s, r = document) => r.querySelector(s);
AL.$ = $;
AL.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
AL.uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
AL.norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ ]/g, ' ');
const LS = AL.LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ---------- configuración (compartida por todos los casos del mismo sitio) ---------- */
const DEF = {apiKey: '', model: 'claude-haiku-5-5', cloudUrl: '', cloudSecret: '', pin: '1234', voz: true, sesion: 'Sesión demo', tutorialVisto: false};
AL.cfg = Object.assign({}, DEF, LS.get('al_cfg', {}));
AL.save = () => LS.set('al_cfg', AL.cfg);
/* nube del taller ya configurada: solo falta la clave, que no se publica en el código */
AL.NUBE = 'https://script.google.com/macros/s/AKfycbzTptR3n18xKCSE7NmMDQ5rvTzPAhx6RrEliZNd2XKm6c2rNTK14wrCTjVjY2d9Eke6/exec';
if (!AL.cfg.cloudUrl || AL.cfg.cloudUrl.includes('AKfycbwcW-7MqKBSTLIfIDDlGymFCIqbuiVpB4g77eRKJtVlY-GpIj39d6A3WGxa5BBXK0C7')) AL.cfg.cloudUrl = AL.NUBE;
/* enlace de configuración de una sola vez: …/?clave=XXXX (opcional &ia=sk-ant-…). Se guarda en este navegador y se borra de la barra */
try {
  const qs = new URLSearchParams(location.search); let ch = false;
  if (qs.get('clave')) { AL.cfg.cloudSecret = qs.get('clave').trim(); qs.delete('clave'); ch = true; }
  if (qs.get('ia') && /^sk-ant-/.test(qs.get('ia'))) { AL.cfg.apiKey = qs.get('ia').trim(); qs.delete('ia'); ch = true; }
  if (ch) { AL.save(); AL._recienConfig = true; history.replaceState(null, '', location.pathname + (qs.toString() ? '?' + qs : '') + location.hash); }
} catch (e) {}
AL.hasIA = () => !!AL.cfg.apiKey;
AL.hasCloud = () => !!AL.cfg.cloudUrl;
AL.state = {ia: null, cloud: null, pending: 0};

/* ---------- avisos ---------- */
AL.toast = (m, ms = 3200) => { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), ms); };

/* ---------- IA (Claude, directo desde el navegador) ---------- */
AL.SYS = 'Eres un asistente de IA de Softgic para la empresa Alico (empaques flexibles, termoformados y fundas, Medellín). Responde en español claro y profesional, sin inventar datos: si no lo sabes o no está en el contexto, dilo.';
AL.claude = async function (system, user, opt = {}) {
  const t0 = performance.now();
  try {
    let content = user;
    if (opt.images && opt.images.length) content = [...opt.images.map(i => ({type: 'image', source: {type: 'base64', media_type: i.media_type, data: i.data}})), {type: 'text', text: user}];
    const msgs = opt.messages || [{role: 'user', content}];
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'content-type': 'application/json', 'x-api-key': AL.cfg.apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true'},
      body: JSON.stringify({model: opt.model || AL.cfg.model, max_tokens: opt.max || 800, system, messages: msgs})
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error?.message || ('HTTP ' + r.status));
    AL.state.ia = true; AL.paint();
    AL.log('ia', {ok: 'si', ms: Math.round(performance.now() - t0), detalle: opt.tag || ''});
    return (j.content || []).map(b => b.text || '').join('');
  } catch (e) {
    AL.state.ia = false; AL.paint();
    AL.log('ia', {ok: 'no', ms: Math.round(performance.now() - t0), detalle: String(e.message || e).slice(0, 120)});
    throw e;
  }
};
AL.parseJSON = t => { const m = String(t).match(/[\[{][\s\S]*[\]}]/); if (!m) throw new Error('sin JSON'); return JSON.parse(m[0]); };

/* ---------- nube: Google Sheets + Drive vía Apps Script ---------- */
let outbox = LS.get('al_outbox', []);
AL.queue = function (kind, data) {
  outbox.push({kind, data}); if (outbox.length > 3000) outbox = outbox.slice(-3000);
  LS.set('al_outbox', outbox); AL.state.pending = outbox.length; AL.paint();
  clearTimeout(AL.queue.t); AL.queue.t = setTimeout(AL.sync, 1200);
};
AL.sync = async function () {
  if (!AL.cfg.cloudUrl || !outbox.length) { AL.state.pending = outbox.length; AL.paint(); return; }
  const batch = outbox.slice(0, 30);
  try {
    const r = await fetch(AL.cfg.cloudUrl, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify({secret: AL.cfg.cloudSecret, items: batch})});
    const j = await r.json();
    if (j.ok) { outbox = outbox.slice(batch.length); LS.set('al_outbox', outbox); AL.state.cloud = true; if (outbox.length) setTimeout(AL.sync, 300); }
    else AL.state.cloud = false;
  } catch (e) { AL.state.cloud = false; }
  AL.state.pending = outbox.length; AL.paint();
};
setInterval(() => AL.sync(), 30000);
AL.cloudGet = async function (params) {
  const q = new URLSearchParams(Object.assign({secret: AL.cfg.cloudSecret}, params)).toString();
  const r = await fetch(AL.cfg.cloudUrl + '?' + q); const j = await r.json();
  if (!j.ok) throw new Error(j.error || 'nube'); AL.state.cloud = true; AL.paint(); return j;
};
AL.rows = async (sheet, n = 500) => (await AL.cloudGet({action: 'rows', sheet, n})).rows || [];
AL.saveFile = (name, content, mime = 'application/json') => AL.queue('archivo', {name, content, mime});
AL.loadFile = async name => (await AL.cloudGet({action: 'archivo', name})).content;
AL.log = function (tipo, d = {}) {   // evento estándar (hoja «Eventos»)
  const ev = Object.assign({id: AL.uid(), ts: new Date().toISOString(), sesion: AL.cfg.sesion, tipo, ejemplo: false}, d);
  if (tipo !== 'ia') AL.queue('evento', ev); else if (AL.hasCloud()) AL.queue('evento', ev);
  return ev;
};

/* ---------- voz ---------- */
let rec = null;
AL.listening = () => !!rec;
AL.listen = function (opts) {
  AL.stopListen();
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { AL.toast('Este navegador no escucha. Usa Chrome o Edge, o escribe con el teclado.'); return false; }
  rec = new SR(); rec.lang = 'es-CO'; rec.interimResults = true; rec.continuous = !!opts.continuous;
  let fin = '';
  rec.onresult = ev => { let it = ''; for (let i = ev.resultIndex; i < ev.results.length; i++) { const r = ev.results[i]; if (r.isFinal) fin += r[0].transcript + ' '; else it += r[0].transcript; } opts.onText && opts.onText((fin + it).trim()); };
  rec.onerror = ev => { if (ev.error !== 'no-speech' && ev.error !== 'aborted') AL.toast('No te escuché bien. ¿Probamos otra vez?'); };
  rec.onend = () => { rec = null; opts.onEnd && opts.onEnd(fin.trim()); };
  try { rec.start(); } catch (e) { rec = null; return false; }
  return true;
};
AL.stopListen = () => { if (rec) { try { rec.stop(); } catch (e) {} } };
/* voz: prefiere voces latinas naturales (Edge: Salomé/Gonzalo es-CO, Dalia/Jorge es-MX; Chrome: Google español de Estados Unidos) */
AL.vozScore = v => {
  if (!/^es/i.test(v.lang)) return -1;
  const L = v.lang.replace('_', '-').toLowerCase(), n = v.name;
  let s = L === 'es-co' ? 50 : L === 'es-mx' ? 46 : L === 'es-us' ? 42 : L === 'es-419' ? 40 : L === 'es-es' ? 4 : 34;
  if (/natural|neural/i.test(n)) s += 45; else if (/online/i.test(n)) s += 35;
  if (/google/i.test(n)) s += 26; if (/enhanced|premium|mejorad/i.test(n)) s += 30;
  if (/salom|gonzalo|dalia|jorge|paloma|camila|valentina|elena/i.test(n)) s += 6;
  return s;
};
AL.voces = () => { try { return speechSynthesis.getVoices().filter(v => AL.vozScore(v) >= 0).sort((a, b) => AL.vozScore(b) - AL.vozScore(a)); } catch (e) { return []; } };
AL.mejorVoz = () => { const V = AL.voces(); return V.find(v => v.name === AL.cfg.vozNombre) || V[0] || null; };
try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); } catch (e) {}
AL.hablar = function (t, rate) {
  try {
    speechSynthesis.cancel(); const v = AL.mejorVoz();
    /* frases cortas: suena más natural y evita que Chrome corte los textos largos */
    const partes = String(t).replace(/[*#_`]/g, '').replace(/\s+/g, ' ').match(/[^.!?\n]+[.!?]*\s*/g) || [String(t)];
    partes.map(p => p.trim()).filter(Boolean).forEach(p => {
      const u = new SpeechSynthesisUtterance(p); u.lang = v ? v.lang : 'es-CO'; if (v) u.voice = v;
      u.rate = rate || (v && /natural|neural|online/i.test(v.name) ? 1.02 : .97); u.pitch = 1; speechSynthesis.speak(u);
    });
  } catch (e) {}
};
AL.say = function (t) {
  if (!AL.cfg.voz || !('speechSynthesis' in window)) return;
  AL.hablar(t);
};
AL.shutUp = () => { try { speechSynthesis.cancel(); } catch (e) {} };

/* ---------- utilidades varias ---------- */
AL.download = (name, mime, txt) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], {type: mime})); a.download = name; document.body.appendChild(a); a.click(); a.remove(); };
AL.money = n => '$' + Math.round(n).toLocaleString('es-CO');
AL.fmt = n => Number(n).toLocaleString('es-CO', {maximumFractionDigits: 1});
AL.rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

/* ---------- modales ---------- */
AL.modal = function (html, cls = '') {
  AL.closeModal();
  const o = document.createElement('div'); o.className = 'overlay'; o.id = 'al-overlay';
  o.innerHTML = `<div class="modal ${cls}" role="dialog">${html}</div>`;
  o.addEventListener('mousedown', e => { if (e.target === o) AL.closeModal(); });
  document.body.appendChild(o); return o;
};
AL.closeModal = () => { const o = $('#al-overlay'); o && o.remove(); };

AL.help = function (key, steps, force) {
  const seen = LS.get('al_help', {});
  if (!force && seen[key]) return;
  let i = 0;
  const draw = () => {
    const s = steps[i], last = i === steps.length - 1;
    AL.modal(`<div class="tut"><div class="big">${s.ico}</div><h2>${s.t}</h2><p>${s.p}</p><div class="dots">${steps.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
      <div style="display:flex;gap:.7rem;justify-content:center">${last ? '<button class="btn ok lg" id="al-h-ok">¡Entendido, vamos!</button>' : '<button class="btn lg" id="al-h-next">Siguiente →</button>'}<button class="btn gr" id="al-h-skip">Saltar</button></div></div>`);
    const done = () => { seen[key] = 1; LS.set('al_help', seen); AL.closeModal(); };
    $('#al-h-skip').onclick = done; if (last) $('#al-h-ok').onclick = done; else $('#al-h-next').onclick = () => { i++; draw(); };
  };
  draw();
};

/* ---------- estado visible (chips IA / nube) ---------- */
AL.paint = function () {
  const ia = $('#al-ia'), cl = $('#al-cloud');
  if (ia) { ia.className = 'alb-chip ' + (!AL.hasIA() ? 'warn' : AL.state.ia === false ? 'bad' : 'ok'); ia.textContent = !AL.hasIA() ? '🤖 IA: modo básico' : AL.state.ia === false ? '🤖 IA sin respuesta' : '🤖 IA conectada'; }
  if (cl) { const p = AL.state.pending; cl.className = 'alb-chip ' + (!AL.hasCloud() ? 'warn' : AL.state.cloud === false ? 'bad' : p ? 'warn' : 'ok'); cl.textContent = !AL.hasCloud() ? '☁️ Solo este equipo' : AL.state.cloud === false ? `☁️ Sin conexión (${p})` : p ? `☁️ Enviando ${p}…` : '☁️ Nube conectada'; }
};

/* ---------- ajustes (modal común) ---------- */
AL.settings = function () {
  const c = AL.cfg;
  AL.modal(`<h2>⚙️ Ajustes del taller <span class="muted small">(quien prepara la demo)</span></h2>
  <div class="two" style="margin-top:.8rem">
    <div>
      <div class="field"><label>Nombre de la sesión (queda en cada registro)</label><input id="s-ses" value="${AL.esc(c.sesion)}" placeholder="Ej: Grupo 3 · 10:00 a. m."></div>
      <div class="field"><label>Clave de la IA (Anthropic)</label><input id="s-key" type="password" value="${AL.esc(c.apiKey)}" placeholder="sk-ant-…" autocomplete="off"><span class="small muted">Se guarda solo en este navegador. Usa una clave con límite de gasto y bórrala al terminar.</span></div>
      <div class="field"><label>Modelo</label><input id="s-mod" value="${AL.esc(c.model)}"></div>
      <div class="field"><label>PIN del líder / administrador</label><input id="s-pin" value="${AL.esc(c.pin)}" inputmode="numeric"></div>
      <label class="pk ${c.voz ? 'on' : ''}" style="cursor:pointer"><input type="checkbox" id="s-voz" ${c.voz ? 'checked' : ''} style="display:none"> 🔊 La IA habla en voz alta</label>
      <div class="field"><label>Voz</label><div style="display:flex;gap:.4rem"><select id="s-vz" style="flex:1"></select><button class="btn gr sm" id="s-vzt" type="button">▶ Probar</button></div><span class="small muted">Las más humanas: en Microsoft Edge, «Salomé» o «Gonzalo» (Colombia) o «Dalia» (México) con la palabra «Natural/Online».</span></div>
    </div>
    <div>
      <div class="field"><label>URL de la nube (Apps Script, termina en /exec)</label><input id="s-url" value="${AL.esc(c.cloudUrl)}" placeholder="https://script.google.com/macros/s/…/exec"></div>
      <div class="field"><label>Clave de la nube</label><input id="s-sec" type="password" value="${AL.esc(c.cloudSecret)}"></div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.7rem"><button class="btn gr sm" id="s-tia">🤖 Probar IA</button><button class="btn gr sm" id="s-tcl">☁️ Probar nube</button><button class="btn gr sm" id="s-kill">🔑 Borrar clave de IA</button></div>
      <div id="s-res" class="small muted" style="min-height:2.5rem"></div>
    </div>
  </div>
  <div style="display:flex;gap:.7rem;justify-content:flex-end;margin-top:.8rem"><button class="btn gr" id="s-close">Cerrar</button><button class="btn ok" id="s-save">Guardar</button></div>`);
  const read = () => { const g = id => $(id).value.trim(); AL.cfg.sesion = g('#s-ses') || 'Sesión demo'; AL.cfg.apiKey = g('#s-key'); AL.cfg.model = g('#s-mod') || DEF.model; AL.cfg.pin = g('#s-pin') || '1234'; AL.cfg.cloudUrl = g('#s-url'); AL.cfg.cloudSecret = g('#s-sec'); AL.cfg.voz = $('#s-voz').checked; AL.cfg.vozNombre = $('#s-vz') ? $('#s-vz').value : AL.cfg.vozNombre; AL.save(); };
  const fillV = () => { const V = AL.voces(), cur = AL.mejorVoz(); $('#s-vz').innerHTML = V.length ? V.map((v, i) => `<option value="${AL.esc(v.name)}" ${cur && v.name === cur.name ? 'selected' : ''}>${AL.esc(v.name)} · ${v.lang}${i === 0 ? ' (recomendada)' : ''}</option>`).join('') : '<option value="">Este navegador no tiene voces en español</option>'; };
  fillV(); try { speechSynthesis.addEventListener('voiceschanged', fillV); } catch (e) {}
  $('#s-vzt').onclick = () => { AL.cfg.vozNombre = $('#s-vz').value; AL.hablar('Hola, bienvenidos a GEN IA Alico. Así sonará la voz durante el taller.'); };
  $('#s-close').onclick = AL.closeModal;
  $('#s-save').onclick = () => { read(); AL.closeModal(); AL.toast('Ajustes guardados.'); setTimeout(() => location.reload(), 500); };
  $('#s-kill').onclick = () => { AL.cfg.apiKey = ''; AL.save(); AL.closeModal(); AL.paint(); AL.toast('Clave borrada de este equipo.'); };
  $('#s-tia').onclick = async () => { read(); const r = $('#s-res'), k = AL.cfg.apiKey;
    if (!k) { r.innerHTML = '❌ Falta la clave. Pégala en «Clave de la IA». Se crea en <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com → API Keys</a> (empieza por <b>sk-ant-</b>) y la cuenta debe tener saldo.'; return; }
    if (!/^sk-ant-/.test(k)) { r.innerHTML = '❌ Esa no parece una clave de Anthropic: debe empezar por <b>sk-ant-</b>. Revisa que la copiaste completa y sin espacios.'; return; }
    r.innerHTML = '<span class="spin"></span> Probando…';
    try { const t = await AL.claude('Responde solo con la palabra OK.', 'Prueba', {max: 10}); r.textContent = '✅ La IA respondió: ' + t.trim().slice(0, 40) + ' (modelo ' + AL.cfg.model + ')'; }
    catch (e) { const m = String(e.message || e); r.innerHTML = '❌ ' + (/invalid x-api-key|authentication/i.test(m) ? 'La clave no es válida o fue borrada. Crea una nueva en console.anthropic.com.' : /credit|billing|balance/i.test(m) ? 'La cuenta no tiene saldo. Agrega créditos en console.anthropic.com → Billing.' : /model/i.test(m) ? 'El modelo «' + AL.esc(AL.cfg.model) + '» no está disponible para tu cuenta. Prueba con claude-sonnet-5-5.' : /Failed to fetch|NetworkError/i.test(m) ? 'No hay conexión a internet o la red bloquea api.anthropic.com.' : AL.esc(m)); } };
  $('#s-tcl').onclick = async () => { read(); const r = $('#s-res'), u = AL.cfg.cloudUrl;
    if (!u) { r.innerHTML = '❌ Falta la URL de la nube. Sigue el MANUAL (sección 1-B) para crear el Apps Script y pega aquí la URL que termina en <b>/exec</b>.'; return; }
    if (!/^https:\/\/script\.google(usercontent)?\.com\/.+\/exec$/.test(u)) { r.innerHTML = '❌ La URL debe empezar por <b>https://script.google.com/macros/s/</b> y terminar en <b>/exec</b> (no uses la que termina en /dev ni la del editor).'; return; }
    if (!AL.cfg.cloudSecret) { r.innerHTML = '❌ Falta la «Clave de la nube»: es el mismo texto que pusiste en <b>SECRET</b> dentro del Apps Script.'; return; }
    r.innerHTML = '<span class="spin"></span> Probando…';
    let txt = '';
    try { const res = await fetch(u + '?' + new URLSearchParams({action: 'ping', secret: AL.cfg.cloudSecret})); txt = await res.text(); const j = JSON.parse(txt);
      if (j.ok) { r.textContent = '✅ Nube conectada' + (j.correo ? ' · correos activos (' + j.correo + ')' : ''); AL.state.cloud = true; }
      else r.innerHTML = '❌ ' + (j.error === 'auth' ? 'La nube respondió pero la clave no coincide: escribe aquí exactamente lo mismo que en <b>SECRET</b> del Apps Script.' : 'La nube respondió: ' + AL.esc(j.error));
    } catch (e) { AL.state.cloud = false;
      r.innerHTML = '❌ ' + (/<html|<!DOCTYPE/i.test(txt) ? 'Google pide iniciar sesión: en Apps Script → Implementar → Administrar implementaciones → editar, pon <b>«Quién tiene acceso: Cualquier usuario»</b> y <b>«Ejecutar como: Yo»</b>, y crea una nueva versión.' : 'No pude llegar a la URL. Revisa que la copiaste completa, que la implementación es «Aplicación web» y que ejecutaste la función <b>autorizar</b> una vez.'); }
    AL.paint(); };

};

/* ---------- barra superior de cada caso ---------- */
AL.barCSS = `
.alb{position:relative;z-index:1000;display:flex;align-items:center;gap:.8rem;flex-wrap:wrap;padding:.5rem 1.1rem;background:#1f2326;color:#fff;font:500 13px/1.3 Poppins,system-ui,sans-serif;border-bottom:3px solid #EE7623}
.alb a.back{display:inline-flex;gap:.4rem;align-items:center;background:#EE7623;color:#fff;text-decoration:none;font-weight:700;border-radius:10px;padding:.4rem .8rem}
.alb a.back:hover{filter:brightness(1.08)}
.alb .n{width:1.7rem;height:1.7rem;border-radius:50%;background:var(--zc,#00BED6);color:#00222A;font-weight:800;display:grid;place-items:center}
.alb b{font-size:14px}
.alb .meta{display:flex;gap:.5rem;flex-wrap:wrap}
.alb .meta span{background:#ffffff14;border-radius:99px;padding:.25rem .75rem;white-space:nowrap}
.alb .meta em{font-style:normal;opacity:.65}
.alb .sp{flex:1}
.alb-chip{border-radius:99px;padding:.25rem .7rem;font-weight:600;font-size:12px;background:#ffffff14;white-space:nowrap}
.alb-chip.ok{background:#1c9a5b55;color:#9bf0c4}.alb-chip.warn{background:#e9a10033;color:#ffd77a}.alb-chip.bad{background:#d6403a55;color:#ffb3b0}
.alb button{background:#ffffff14;border:0;color:#fff;border-radius:10px;padding:.4rem .75rem;cursor:pointer;font:600 12.5px Poppins,system-ui,sans-serif}
.alb button:hover{background:#ffffff2a}
.alb-nav{display:flex;gap:.3rem}
.alb-nav a{display:grid;place-items:center;width:1.7rem;height:1.7rem;border-radius:50%;background:#ffffff14;color:#fff;text-decoration:none;font-weight:700;font-size:12px}
.alb-nav a.on{background:var(--zc,#00BED6);color:#00222A}
.alb-nav a:hover{background:#ffffff33}
@media (max-width:900px){.alb .meta{display:none}}`;
const CASOS = [
  {n: 1, id: 'vision', ruta: 'casos/vision/index.html', nombre: 'Visión artificial', color: '#00BED6'},
  {n: 2, id: 'maestro', ruta: 'casos/maestro/index.html', nombre: 'Maestro · asistente de planta', color: '#EE7623'},
  {n: 3, id: 'conocimiento', ruta: 'casos/conocimiento/index.html', nombre: 'Agente de conocimiento técnico', color: '#00758D'},
  {n: 4, id: 'reclamos', ruta: 'casos/reclamos/index.html', nombre: 'Centro de inteligencia del cliente', color: '#E99B35'},
  {n: 5, id: 'torre', ruta: 'casos/torre/index.html', nombre: 'Torre de control de negocios', color: '#6C7A89'}
];
AL.CASOS = CASOS;
AL.bar = function (o) {
  const st = document.createElement('style'); st.textContent = AL.barCSS; document.head.appendChild(st);
  const c = CASOS.find(x => x.id === o.id) || CASOS[0];
  const v = LS.get('al_visited', {}); v[c.id] = 1; LS.set('al_visited', v);
  const el = document.createElement('div'); el.className = 'alb'; el.style.setProperty('--zc', c.color);
  const base = o.base || '../../';
  el.innerHTML = `<a class="back" href="${base}index.html">← Planta</a><span class="n">${c.n}</span><b>${AL.esc(o.titulo || c.nombre)}</b>
    <div class="meta"><span><em>Dirigido a:</em> ${AL.esc(o.publico)}</span><span><em>Área:</em> ${AL.esc(o.area)}</span><span><em>Iniciativa:</em> ${AL.esc(o.iniciativa)}</span></div>
    <div class="sp"></div>
    <div class="alb-nav">${CASOS.map(x => `<a href="${base}${x.ruta}" title="${AL.esc(x.nombre)}" class="${x.id === c.id ? 'on' : ''}" style="--zc:${x.color}">${x.n}</a>`).join('')}</div>
    ${o.chips === false ? '' : '<span id="al-ia" class="alb-chip"></span><span id="al-cloud" class="alb-chip"></span>'}
    ${o.narra ? '<button id="al-say" title="Escuchar de qué trata este caso">🔊 Escuchar</button>' : ''}${o.help ? '<button id="al-help">❓ Cómo se usa</button>' : ''}<button id="al-set">⚙️ Ajustes</button>`;
  document.body.prepend(el);
  $('#al-set').onclick = AL.settings;
  if (o.narra) $('#al-say').onclick = () => { if (window.speechSynthesis && speechSynthesis.speaking) { AL.shutUp(); $('#al-say').textContent = '🔊 Escuchar'; return; } AL.narrar(o.narra); $('#al-say').textContent = '⏹ Detener'; const iv = setInterval(() => { if (!speechSynthesis.speaking) { clearInterval(iv); const b = $('#al-say'); b && (b.textContent = '🔊 Escuchar'); } }, 500); };
  if (o.help) { $('#al-help').onclick = () => AL.help(c.id, o.help, true); AL.help(c.id, o.help); }
  AL.paint(); AL.sync();
};
})();

/* ---------- bus entre casos: lo que pasa en uno alimenta a los otros (mismo navegador + nube) ---------- */
(function () {
  const AL = window.AL, LS = AL.LS, KEY = k => 'al_hub_' + k, subs = {};
  AL.hub = {
    list: kind => LS.get(KEY(kind), []),
    push(kind, obj, cap = 600) {
      const it = Object.assign({ id: AL.uid(), ts: new Date().toISOString(), sesion: AL.cfg.sesion }, obj);
      const l = LS.get(KEY(kind), []); l.unshift(it); try { LS.set(KEY(kind), l.slice(0, cap)); } catch (e) {}
      (subs[kind] || []).forEach(f => { try { f(it); } catch (e) {} });
      if (AL.hasCloud()) AL.queue(kind, Object.assign({}, it, { titulo: it.titulo || kind, foto: undefined }));
      return it;
    },
    update(kind, id, patch) { const l = LS.get(KEY(kind), []), x = l.find(o => o.id === id); if (x) { Object.assign(x, patch); LS.set(KEY(kind), l); } return x; },
    on(kind, fn) { (subs[kind] = subs[kind] || []).push(fn); },
    clear: kind => LS.set(KEY(kind), [])
  };
  window.addEventListener('storage', e => {           // otra pestaña escribió (ej.: visión → torre abierta al lado)
    if (!e.key || !e.key.startsWith('al_hub_')) return;
    const kind = e.key.slice(7), l = LS.get(e.key, []);
    (subs[kind] || []).forEach(f => { try { f(l[0], true); } catch (er) {} });
  });
  /* narración: cada caso tiene un botón 🔊 que cuenta qué es y cómo se usa */
  AL.narrar = function (txt) { if (!('speechSynthesis' in window)) return AL.toast('Este navegador no habla. Usa Chrome o Edge.'); const was = AL.cfg.voz; AL.cfg.voz = true; AL.say(txt); AL.cfg.voz = was; };
})();

/* aviso tras usar el enlace de configuración */
if (AL._recienConfig) addEventListener('load', () => setTimeout(() => AL.toast && AL.toast('✅ Este computador quedó conectado a la nube del taller' + (AL.cfg.apiKey ? ' y a la IA' : '')), 600));

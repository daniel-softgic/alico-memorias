# Empaquemos estas memorias · Alico (Cápsula de Memorias)

Portal independiente para cerrar cada sesión del workshop: en 5 minutos un participante postula una iniciativa por voz, la IA la convierte en historia de negocio y el grupo queda en el muro de la TV.

## Archivos
- `index.html` – Muro para la TV + flujo de entrevista (voz/texto, 5 preguntas, foto, acta, aplauso).
- `admin.html` – Panel administrativo (PIN por defecto **1234**): resumen, ideas, discovery automático, exportar.
- `shared/` – núcleo común (`al.js`, `al.css`) y lógica de memorias (`mem.js`).
- `apps-script/Code.gs` – backend para Google Sheets / Drive.

## Puesta en marcha (10 min)
1. **Hosting**: sube la carpeta a un repo de GitHub → Settings → Pages → rama `main`, raíz. (La cámara y el micrófono exigen https; GitHub Pages lo cumple.)
2. **Google Sheets** (opcional pero recomendado para no perder datos): crea una hoja → Extensiones → Apps Script → pega `apps-script/Code.gs` → Implementar como aplicación web (acceso: cualquiera) → copia la URL.
3. **Ajustes** (botón ⚙️ en el panel): pega la API key de Anthropic, la URL del Apps Script, el secreto y cambia el PIN. Sin API key funciona en "modo básico" (historia armada con plantilla).
4. **Prueba**: abre `index.html` en Chrome o Edge en el PC del taller, permite cámara y micrófono, y postula una idea de prueba. Luego en admin pulsa «Eliminar ejemplos».

## Cómo correr los 5 minutos
1. Muro en la TV (pantalla completa, F11). 
2. Botón **➕ Postular una idea** (o tecla N).
3. Participantes eligen grupo (o nombre propio), aceptan consentimiento y responden 5 preguntas hablando.
4. Revisan la funda, se toman la foto (cuenta regresiva), firman el acta y el grupo aplaude.
5. El grupo aparece en el muro con burbujas, confeti y banners.

## Memo (robot de Softgic)
Memo usa las poses del Manual de Marca de Softgic (`assets/robot/`), cambiando según el momento: saludo, atención, análisis, aprobación, señalar, presentación, alegría y duda.

## Notas
- Voz: reconocimiento solo en Chrome/Edge. Siempre hay texto como alternativa.
- Fotos: se guardan en el navegador y en Drive (no en la hoja). Entre equipos se sincronizan vía Apps Script.
- Consentimiento Habeas Data (Ley 1581) y de imagen se registra por idea.
- La API key queda en el navegador del equipo del taller: úsala solo ahí y revócala al terminar.
- Las 3 ideas «EJEMPLO» son de demostración y se eliminan desde Exportar.

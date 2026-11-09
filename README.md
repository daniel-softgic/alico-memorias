# Empaquemos estas memorias · Alico × Softgic

Muro y entrevista con Memo para el taller GEN IA de Alico, más el informe del evento para Alico y Softgic.

- **Muro** (`index.html`): las memorias de cada grupo, lo que piden los colaboradores y lo que más tiempo les quita. Botón **⟲ Reiniciar contador** (PIN): pone el muro en cero sin borrar nada.
- **Entrevista · discovery express (6 preguntas)**: espacio seguro (no es evaluación, opción anónima), voz con subtítulos de Memo y transcripción en vivo. Memo entiende lo que dice cada persona y marca la categoría por ella; entre preguntas responde con una validación corta hecha con IA.
  1. Lo que más tiempo o energía te quita
  2. Horas a la semana (1, 5, 10, 15, 20, 30, 40) y personas a las que les pasa
  3. Lo que quieres que la IA haga por ti
  4. Lo que ganarías tú y tu equipo
  5. El apoyo que esperas de Alico y tus líderes + ganas de aprender (1 a 5)
  6. El caso que quieres primero
  Luego la IA empaca la idea (nombre, eslogan, historia de usuario, impacto, lo que va a aprender) en un empaque futurista de Alico, se elige padrino y se toma la foto del grupo, que queda enmarcada en el muro.
- **Informe** (`admin.html`, PIN del taller): Resumen con informe ejecutivo (IA opcional) y diagnóstico por equipo, **Informe por caso y hoja de ruta** (puntaje, olas 1–3, piloto, indicadores, lo que se necesita de Alico), tabla de respuestas y **Guardar y exportar** (CSV para Excel, respaldo JSON con fotos, importar, PDF, Google Sheets).

## Nube
Todo se guarda en el navegador y, si hay nube, en la hoja «Respuestas» de Google Sheets (código en `apps-script/Code.gs`).
La URL de la nube ya viene configurada. Para conectar un computador basta abrir una vez:
`https://daniel-softgic.github.io/alico-memorias/?clave=LA_CLAVE` (opcional `&ia=sk-ant-…`).

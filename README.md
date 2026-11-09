# Empaquemos estas memorias · Alico × Softgic

Muro y entrevista con Memo para el taller GEN IA de Alico, más el informe del evento para Alico y Softgic.

- **Muro** (`index.html`): las memorias de cada grupo, lo que piden los colaboradores y lo que más tiempo les quita. Botón **⟲ Reiniciar contador** (PIN): pone el muro en cero sin borrar nada.
- **Entrevista**: 5 preguntas con voz, subtítulos de Memo y transcripción en vivo de la respuesta, más opciones rápidas para poder medir:
  1. La tarea que más tiempo te quita
  2. Horas por semana y personas a las que les pasa
  3. El caso que quieres primero en tu área
  4. Lo que quieres que la IA haga por ti
  5. Lo que necesitas para adoptarla y qué tan listo te sientes
  Luego Memo empaca la idea (historia de usuario, impacto, primer paso), se elige padrino y se toma la foto del grupo.
- **Informe** (`admin.html`, PIN del taller): Resumen con informe ejecutivo (IA opcional), **Informe por caso y hoja de ruta** (puntaje, olas 1–3, piloto, indicadores, lo que se necesita de Alico), tabla de respuestas y **Guardar y exportar** (CSV para Excel, respaldo JSON con fotos, importar, PDF, Google Sheets).

## Nube
Todo se guarda en el navegador y, si hay nube, en la hoja «Respuestas» de Google Sheets (código en `apps-script/Code.gs`).
La URL de la nube ya viene configurada. Para conectar un computador basta abrir una vez:
`https://daniel-softgic.github.io/alico-memorias/?clave=LA_CLAVE` (opcional `&ia=sk-ant-…`).
